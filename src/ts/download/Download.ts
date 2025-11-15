import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { log } from '../Log'
import { lang } from '../Language'
import { fileName } from '../FileName'
import { convertUgoira } from '../ConvertUgoira/ConvertUgoira'
import {
  downloadArgument,
  SendToBackEndData,
  DonwloadSkipData,
} from './DownloadType'
import { progressBar } from './ProgressBar'
import { filter } from '../filter/Filter'
import { downloadRecord } from './DownloadRecord'
import { settings } from '../setting/Settings'
import { makeNovelFile } from './MakeNovelFile'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'
import { msgBox } from '../MsgBox'
import { states } from '../store/States'
import { Tools } from '../Tools'
import { setTimeoutWorker } from '../SetTimeoutWorker'
import { downloadStates } from './DownloadStates'
import { downloadInterval } from './DownloadInterval'

// 处理下载队列里的任务
// 不显示在进度条上的下载任务，不在这里处理
class Download {
  constructor(
    progressBarIndex: number,
    data: downloadArgument,
    downloadStatesIndex: number
  ) {
    this.progressBarIndex = progressBarIndex
    this.downloadStatesIndex = downloadStatesIndex
    this.beforeDownload(data)
  }

  private progressBarIndex: number
  private downloadStatesIndex: number

  private retry = 0 // 重试次数
  private lastRequestTime = 0 // 最后一次发起请求的时间戳
  private retryInterval: number[] = [] // 保存每次到达重试环节时，距离上一次请求的时间差

  private sizeChecked = false // 是否对文件体积进行了检查
  private skip = false // 这个下载是否应该被跳过。如果这个文件不符合某些过滤条件就应该跳过它
  private error = false // 在下载过程中是否出现了无法解决的错误

  private get cancel() {
    return this.skip || this.error || !states.downloading
  }

  // 跳过下载这个文件。可以传入用于提示的文本
  private skipDownload(data: DonwloadSkipData, msg?: string) {
    this.skip = true
    if (msg) {
      log.warning(msg)
    }
    if (states.downloading) {
      EVT.fire('skipDownload', data)
    }
  }

  // 在开始下载前进行检查
  private async beforeDownload(arg: downloadArgument) {
    // 检查是否是重复文件
    const duplicate = await downloadRecord.checkDeduplication(arg.result)
    if (duplicate) {
      return this.skipDownload({
        id: arg.id,
        type: arg.result.type,
        reason: 'duplicate',
      })
    }

    // 如果是动图，再次检查是否排除了动图
    // 因为有时候用户在抓取时没有排除动图，但是在下载时排除了动图。所以下载时需要再次检查
    if (arg.result.type === 2 && !settings.downType2) {
      return this.skipDownload({
        id: arg.id,
        reason: 'excludedType',
      })
    }

    // 检查宽高条件和宽高比
    if (
      (settings.setWHSwitch || settings.ratioSwitch) &&
      arg.result.type !== 3
    ) {
      // 默认使用当前作品中第一张图片的宽高
      let wh = {
        width: arg.result.fullWidth,
        height: arg.result.fullHeight,
      }
      // 如果不是第一张图片，则加载图片以获取宽高
      if (arg.result.index > 0) {
        // 始终获取原图的尺寸
        wh = await Utils.getImageSize(arg.result.original)
      }

      // 如果获取宽高失败，图片会被视为通过宽高检查
      if (wh.width === 0 || wh.height === 0) {
        log.error(
          lang.transl('_获取图片的宽高时出现错误') +
            Tools.createWorkLink(arg.id)
        )
        // 图片加载失败可能是请求超时，或者图片不存在。这里无法获取到具体原因，所以不直接返回。
        // 如果是 404 错误，在 download 方法中可以处理这个问题
        // 如果是请求超时，则有可能错误的通过了这个图片
      }

      const result = await filter.check(wh)
      if (!result) {
        return this.skipDownload(
          {
            id: arg.id,
            reason: 'widthHeight',
          },
          lang.transl('_不保存图片因为宽高', Tools.createWorkLink(arg.id))
        )
      }
    }

    this.download(arg)
  }

  // 设置进度条信息
  private setProgressBar(name: string, loaded: number, total: number) {
    // 在下载初始化和下载完成时，立即更新进度条
    // 在下载途中，使用节流来更新进度条
    progressBar[loaded === total ? 'setProgress' : 'setProgressThrottle'](
      this.progressBarIndex,
      {
        name,
        loaded,
        total,
      }
    )
  }

  // 当重试达到最大次数时
  private afterReTryMax(status: number, fileId: string) {
    const errorMsg = lang.transl(
      '_作品id无法下载带状态码',
      Tools.createWorkLink(fileId),
      status.toString()
    )
    // 404, 500 错误，跳过，不会再尝试下载这个文件（因为没有触发 downloadError 事件，所以不会重试下载）
    if (status === 404 || status === 500) {
      log.error(errorMsg)
      log.error(lang.transl('_下载器不会再重试下载它'))
      return this.skipDownload({
        id: fileId,
        reason: status.toString() as '404' | '500',
      })
    }

    // 状态码为 0，可能是系统磁盘空间不足导致的错误，也可能是代理软件导致的网络错误
    // 超时也会返回状态码 0
    if (status === 0) {
      // 判断是否是磁盘空间不足。特征是每次重试之间的间隔时间比较短。
      // 如果是超时，那么等待时间会比较长，可能超过 20 秒
      const timeLimit = 10000 // 如果从发起请求到进入重试的时间间隔小于这个值，则视为磁盘空间不足的情况
      const result = this.retryInterval.filter((val) => val <= timeLimit)
      // 在全部的 10 次请求中，如果有 9 次小于 10 秒，就有可能是磁盘空间不足。
      if (result.length > 9) {
        log.error(errorMsg)
        const tip = lang.transl('_状态码为0的错误提示')
        log.error(tip)
        msgBox.error(tip)
        return EVT.fire('requestPauseDownload')
      }
    }

    // 其他状态码，暂时跳过这个任务，但最后还是会尝试重新下载它
    log.log(lang.transl('_下载器会暂时跳过它'))
    this.error = true
    EVT.fire('downloadError', fileId)
  }

  // 下载文件
  private async download(arg: downloadArgument) {
    // 获取文件名
    const _fileName = fileName.createFileName(arg.result)

    // 重设当前下载栏的信息
    this.setProgressBar(_fileName, 0, 0)

    // 下载文件
    let url: string
    if (arg.result.type === 3) {
      // 小说
      if (arg.result.novelMeta) {
        // 生成小说文件
        if (settings.novelSaveAs === 'epub') {
          const blob: Blob = await makeNovelFile.makeEPUB(
            arg.result.novelMeta,
            _fileName
          )
          url = URL.createObjectURL(blob)
        } else {
          const blob: Blob = await makeNovelFile.makeTXT(
            arg.result.novelMeta,
            _fileName
          )
          url = URL.createObjectURL(blob)
        }
      } else {
        throw new Error('Not found novelMeta')
      }
    } else {
      // 对于图像作品，如果设置了图片尺寸就使用指定的 url，否则使用原图 url
      url = arg.result[settings.imageSize] || arg.result.original
      await downloadInterval.wait()
    }

    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'

    // 显示下载进度
    xhr.addEventListener('progress', async (event) => {
      // 检查体积设置
      if (!this.sizeChecked) {
        this.sizeChecked = true
        const result = await filter.check({ size: event.total })
        if (!result) {
          // 当因为体积问题跳过下载时，可能这个下载进度还是 0 或者很少，所以这里直接把进度条拉满
          this.setProgressBar(_fileName, 1, 1)
          this.skipDownload(
            {
              id: arg.id,
              reason: 'size',
            },
            lang.transl('_不保存图片因为体积', Tools.createWorkLink(arg.id))
          )
        }
      }

      if (this.cancel) {
        xhr.abort()
        xhr = null as any
        return
      }

      this.setProgressBar(_fileName, event.loaded, event.total)
    })

    // 文件加载完毕，或者加载出错
    xhr.addEventListener('loadend', async () => {
      if (this.cancel) {
        xhr = null as any
        return
      }

      // 要下载的文件
      let file: Blob = xhr.response

      // 下载时有些图片可能没有 content-length，无法计算下载进度
      // 所以在 loadend 之后，把下载进度拉满
      if (file?.size) {
        this.setProgressBar(_fileName, file.size, file.size)
      } else {
        // 有时候 file 是 null，所以不能获取 size 属性。尚不清楚原因是什么
        console.log(file)
      }

      // 状态码错误，进入重试流程
      if (xhr.status !== 200) {
        // 正常下载完毕的状态码是 200
        // 储存重试的时间戳等信息
        this.retryInterval.push(new Date().getTime() - this.lastRequestTime)

        progressBar.errorColor(this.progressBarIndex, true)
        this.retry++

        if (this.retry >= Config.retryMax) {
          // 重试达到最大次数
          this.afterReTryMax(xhr.status, arg.id)
        } else {
          // 开始重试
          return this.download(arg)
        }
      } else {
        // 状态码正常
        progressBar.errorColor(this.progressBarIndex, false)
        // 需要转换动图的情况
        const convertExt = ['webm', 'gif', 'png']
        const ext = settings.ugoiraSaveAs
        if (
          convertExt.includes(ext) &&
          arg.result.ugoiraInfo &&
          settings.imageSize !== 'thumb'
        ) {
          // 当下载图片的方形缩略图时，不转换动图，因为此时下载的是作品的静态缩略图，无法进行转换
          try {
            if (ext === 'webm') {
              file = await convertUgoira.webm(
                file,
                arg.result.ugoiraInfo,
                arg.result.idNum
              )
            }

            if (ext === 'gif') {
              file = await convertUgoira.gif(
                file,
                arg.result.ugoiraInfo,
                arg.result.idNum
              )
            }

            if (ext === 'png') {
              file = await convertUgoira.apng(
                file,
                arg.result.ugoiraInfo,
                arg.result.idNum
              )
            }
          } catch (error) {
            const msg = lang.transl(
              '_动图转换失败的提示',
              Tools.createWorkLink(arg.result.idNum)
            )
            // 因为会重试所以不在日志上显示
            // log.error(msg, 1)
            console.error(msg)

            this.error = true
            EVT.fire('downloadError', arg.id)
          }
        }
      }

      if (this.cancel) {
        return
      }

      // 生成下载链接
      const blobURL = URL.createObjectURL(file)

      // 对插画、漫画进行颜色检查
      // 在这里进行检查的主要原因：抓取时只会检查单图作品的颜色，不会检查多图作品的颜色。所以多图作品需要在这里进行检查。
      // 另一个原因：如果抓取时没有设置图片的颜色条件，下载时才设置颜色条件，那么就必须在这里进行检查。
      if (arg.result.type === 0 || arg.result.type === 1) {
        const result = await filter.check({
          mini: blobURL,
        })
        if (!result) {
          return this.skipDownload(
            {
              id: arg.id,
              reason: 'color',
            },
            lang.transl('_不保存图片因为颜色', Tools.createWorkLink(arg.id))
          )
        }
      }

      // 向浏览器发送下载任务
      if (settings.setFileDownloadOrder) {
        await this.waitPreviousFileDownload()
      }
      this.browserDownload(file, blobURL, _fileName, arg.id, arg.taskBatch)
      xhr = null as any
      file = null as any
    })

    this.lastRequestTime = new Date().getTime()
    // 没有设置 timeout，默认值是 0，不会超时
    xhr.send()
  }

  // 等待上一个文件下载成功之后（浏览器将文件保存到硬盘上），再保存这个文件。这是为了保证文件的保存顺序不会错乱
  private waitPreviousFileDownload() {
    return new Promise(async (resolve) => {
      if (this.downloadStatesIndex === 0) {
        return resolve(true)
      }

      if (downloadStates.states[this.downloadStatesIndex - 1] === 1) {
        return resolve(true)
      } else {
        return resolve(
          new Promise((resolve) => {
            setTimeoutWorker.set(() => {
              resolve(this.waitPreviousFileDownload())
            }, 50)
          })
        )
      }
    })
  }

  // 向浏览器发送下载任务
  private async browserDownload(
    blob: Blob,
    blobURL: string,
    fileName: string,
    id: string,
    taskBatch: number
  ) {
    // 如果任务已停止，不会向浏览器发送下载任务
    if (this.cancel) {
      // 释放 blob URL
      URL.revokeObjectURL(blobURL)
      return
    }

    let dataURL: string | undefined = undefined
    if (Config.sendDataURL) {
      dataURL = await Utils.blobToDataURL(blob)
    }

    const sendData: SendToBackEndData = {
      msg: 'save_work_file',
      fileName: fileName,
      id,
      taskBatch,
      blobURL,
      blob: Config.sendBlob ? blob : undefined,
      dataURL,
    }

    // 使用 a.download 来下载文件时，不调用 downloads API
    if (settings.rememberTheLastSaveLocation) {
      // 移除文件夹，只保留文件名部分，因为这种方式不支持建立文件夹
      // 路径符号 / 会被浏览器处理成 _，例如：
      // pixiv/mojo-94576902/136825223_p0-藤田ことね🎃.png 会变成：
      // pixiv_mojo-94576902_136825223_p0-藤田ことね🎃.png
      // 所以我只保留了文件名部分
      const lastName = fileName.split('/').pop()
      Utils.downloadFile(blobURL, lastName!)
      sendData.msg = 'save_work_file_a_download'
      browser.runtime.sendMessage(sendData)
      return
    }

    try {
      browser.runtime.sendMessage(sendData)
      EVT.fire('sendBrowserDownload')
    } catch (error) {
      let msg = `${lang.transl('_发生错误原因')}<br>{}${lang.transl(
        '_请刷新页面'
      )}`
      if ((error as Error).message.includes('Extension context invalidated')) {
        msg = msg.replace('{}', lang.transl('_扩展程序已更新'))
        log.error(msg)
        msgBox.error(msg)
        return
      }

      console.error(error)
      msg = msg.replace('{}', lang.transl('_未知错误'))
      log.error(msg)
      msgBox.error(msg)
    }
  }
}

export { Download }
