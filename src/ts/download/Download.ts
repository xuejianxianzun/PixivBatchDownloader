// 下载文件，然后发送给浏览器进行保存
import { EVT } from '../EVT'
import { log } from '../Log'
import { lang } from '../Lang'
import { fileName } from '../FileName'
import { convertUgoira } from '../ConvertUgoira/ConvertUgoira'
import {
  downloadArgument,
  SendToBackEndData,
  DonwloadSkipData,
} from './DownloadType'
import { progressBar } from './ProgressBar'
import { filter } from '../filter/Filter'
import { deduplication } from './Deduplication'
import { settings } from '../setting/Settings'
import { MakeNovelFile } from './MakeNovelFile'
import { Utils } from '../utils/Utils'
import { Config } from '../config/Config'
import { msgBox } from '../MsgBox'

class Download {
  constructor(progressBarIndex: number, data: downloadArgument) {
    this.progressBarIndex = progressBarIndex

    this.download(data)
    this.bindEvents()
  }

  private progressBarIndex: number
  private fileName = ''

  private retry = 0 // 重试次数
  private lastRequestTime = 0 // 最后一次发起请求的时间戳
  private retryInterval: number[] = [] // 保存每次到达重试环节时，距离上一次请求的时间差

  private cancel = false // 这个下载是否被取消（下载被停止，或者这个文件没有通过某个检查）

  private sizeChecked = false // 是否对文件体积进行了检查

  private bindEvents() {
    ;[EVT.list.downloadStop, EVT.list.downloadPause].forEach((event) => {
      window.addEventListener(event, () => {
        this.cancel = true
      })
    })
  }

  // 设置进度条信息
  private setProgressBar(loaded: number, total: number) {
    progressBar.setProgress(this.progressBarIndex, {
      name: this.fileName,
      loaded: loaded,
      total: total,
    })
  }

  // 跳过某个文件的下载，可以传入警告消息
  private skip(data: DonwloadSkipData, msg?: string) {
    this.cancel = true
    if (msg) {
      log.warning(msg)
    }
    EVT.fire('skipDownload', data)
  }

  // 当重试达到最大次数时
  private afterReTryMax(status: number, fileId: string) {
    // 404, 500 错误，跳过，不会再尝试下载这个文件（因为没有触发 downloadError 事件，所以不会重试下载）
    if (status === 404 || status === 500) {
      log.error(`Error: ${fileId} Code: ${status}`)
      return this.skip({
        id: fileId,
        reason: status.toString() as '404' | '500',
      })
    }

    // 状态码为 0 ，可能是系统磁盘空间不足导致的错误，也可能是超时等错误
    if (status === 0) {
      // 判断是否是磁盘空间不足。特征是每次重试之间的间隔时间比较短。
      // 超时的特征是等待时间比较长，可能超过 20 秒
      const timeLimit = 10000 // 如果从发起请求到进入重试的时间间隔小于这个值，则视为磁盘空间不足的情况
      const result = this.retryInterval.filter((val) => val <= timeLimit)
      // 在全部的 10 次请求中，如果有 9 次小于 10 秒，就认为是磁盘空间不足。
      if (result.length > 9) {
        log.error(`Error: ${fileId} Code: ${status}`)
        const tip = lang.transl('_系统磁盘空间不足提醒')
        log.error(tip)
        msgBox.error(tip)
        return EVT.fire('requestPauseDownload')
      }
    }

    // 其他状态码，暂时跳过这个任务，但最后还是会尝试重新下载它
    this.cancel = true
    EVT.fire('downloadError', fileId)
  }

  // 下载文件
  private async download(arg: downloadArgument) {
    // 检查是否是重复文件
    const duplicate = await deduplication.check(arg.id)
    if (duplicate) {
      return this.skip(
        {
          id: arg.id,
          reason: 'duplicate',
        },
        lang.transl('_跳过下载因为重复文件', arg.id)
      )
    }

    // 获取文件名
    this.fileName = fileName.getFileName(arg.data)

    // 重设当前下载栏的信息
    this.setProgressBar(0, 0)

    // 下载文件
    let url: string
    if (arg.data.type === 3) {
      // 生成小说的文件
      if (arg.data.novelMeta) {
        let blob: Blob = await MakeNovelFile.make(arg.data.novelMeta)
        url = URL.createObjectURL(blob)
      } else {
        throw new Error('Not found novelMeta')
      }
    } else {
      // 对于图像作品，如果设置了图片尺寸就使用指定的 url，否则使用原图 url
      url = arg.data[settings.imageSize] || arg.data.original
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
          this.setProgressBar(1, 1)
          this.skip(
            {
              id: arg.id,
              reason: 'size',
            },
            lang.transl('_不保存图片因为体积', arg.id)
          )
        }
      }

      if (this.cancel) {
        xhr.abort()
        xhr = null as any
        return
      }

      this.setProgressBar(event.loaded, event.total)
    })

    // 图片获取完毕（出错时也会进入 loadend）
    xhr.addEventListener('loadend', async () => {
      if (this.cancel) {
        xhr = null as any
        return
      }

      let file: Blob = xhr.response // 要下载的文件
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
          arg.data.ugoiraInfo &&
          settings.imageSize !== 'thumb'
        ) {
          // 当下载图片的方形缩略图时，不转换动图，因为此时下载的是作品的静态缩略图，无法进行转换
          try {
            if (ext === 'webm') {
              file = await convertUgoira.webm(file, arg.data.ugoiraInfo)
            }

            if (ext === 'gif') {
              file = await convertUgoira.gif(file, arg.data.ugoiraInfo)
            }

            if (ext === 'png') {
              file = await convertUgoira.apng(file, arg.data.ugoiraInfo)
            }
          } catch (error) {
            const msg = `Convert ugoira error, id ${arg.data.idNum}.`
            // 因为会重试所以不再日志上显示
            // log.error(msg, 1)
            console.error(msg)

            this.cancel = true
            EVT.fire('downloadError', arg.id)
          }
        }
      }

      if (this.cancel) {
        return
      }

      // 生成下载链接
      const blobUrl = URL.createObjectURL(file)

      // 对插画、漫画进行颜色检查
      // 在这里进行检查的主要原因：抓取时只能检测第一张的缩略图，并没有检查后面的图片。所以这里需要对后面的图片进行检查。
      // 另一个原因：如果抓取时没有设置不下载某种颜色的图片，下载时又开启了设置，那么就在这里进行检查
      if (arg.data.type === 0 || arg.data.type === 1) {
        const result = await filter.check({
          mini: blobUrl,
        })
        if (!result) {
          return this.skip(
            {
              id: arg.id,
              reason: 'color',
            },
            lang.transl('_不保存图片因为颜色', arg.id)
          )
        }
      }

      // 检查图片的宽高设置
      // 因为抓取时只能检查每个作品第一张图片的宽高，所以可能会出现作品的第一张图片符合要求，但后面的图片不符合要求的情况。这里针对第一张之后的其他图片也进行检查，提高准确率。
      if (
        (arg.data.type === 0 || arg.data.type === 1) &&
        !arg.data.id.includes('p0')
      ) {
        const img = await Utils.loadImg(blobUrl)
        const result = await filter.check({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
        if (!result) {
          return this.skip(
            {
              id: arg.id,
              reason: 'widthHeight',
            },
            lang.transl('_不保存图片因为宽高', arg.id)
          )
        }
      }

      // 向浏览器发送下载任务
      this.browserDownload(blobUrl, this.fileName, arg.id, arg.taskBatch)
      xhr = null as any
      file = null as any
    })

    this.lastRequestTime = new Date().getTime()
    // 没有设置 timeout，默认值是 0，不会超时
    xhr.send()
  }

  // 向浏览器发送下载任务
  private browserDownload(
    blobUrl: string,
    fileName: string,
    id: string,
    taskBatch: number
  ) {
    // 如果任务已停止，不会向浏览器发送下载任务
    if (this.cancel) {
      // 释放 bloburl
      URL.revokeObjectURL(blobUrl)
      return
    }

    const sendData: SendToBackEndData = {
      msg: 'save_work_file',
      fileUrl: blobUrl,
      fileName: fileName,
      id,
      taskBatch,
    }

    chrome.runtime.sendMessage(sendData)
  }
}

export { Download }
