// 下载文件，并发送给浏览器下载
import { EVT } from './EVT'
import { log } from './Log'
import { lang } from './Lang'
import { DOM } from './DOM'
import { fileName } from './FileName'
import { converter } from './ugoira/ConvertUgoira'
import {
  downloadArgument,
  SendToBackEndData,
  DonwloadSuccessData,
} from './Download.d'
import { progressBar } from './ProgressBar'
import { filter } from './Filter'
import { deduplication } from './Deduplication'
import { settings } from './setting/Settings'

class Download {
  constructor(progressBarIndex: number, data: downloadArgument) {
    this.progressBarIndex = progressBarIndex

    this.download(data)
    this.listenEvents()
  }

  private progressBarIndex: number
  private fileName = ''
  private readonly retryMax = 30
  private retry = 0 // 重试次数

  private cancel = false // 这个下载是否被取消（下载被停止，或者这个文件没有通过某个检查）

  private sizeChecked = false // 是否对文件体积进行了检查

  private listenEvents() {
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

  private skip(data: DonwloadSuccessData, msg = '') {
    this.cancel = true
    log.warning(msg)
    EVT.fire(EVT.list.skipDownload, data)
  }

  // 下载文件
  private async download(arg: downloadArgument) {
    // 检查是否是重复文件
    const duplicate = await deduplication.check(arg.id)
    if (duplicate) {
      return this.skip(
        {
          url: '',
          id: arg.id,
          tabId: 0,
          uuid: false,
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
      url = arg.data.original
    } else {
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
              url: '',
              id: arg.id,
              tabId: 0,
              uuid: false,
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

      // 错误处理
      const downloadError = () => {
        let msg = ''

        if (xhr.status === 404) {
          // 404 错误时
          msg = lang.transl('_file404', arg.id)
        } else {
          // 无法处理的错误状态
          msg = lang.transl('_文件下载失败', arg.id)
        }

        log.error(msg, 1)

        this.cancel = true
        EVT.fire(EVT.list.downloadError, arg.id)
      }

      if (xhr.status !== 200) {
        // 状态码错误
        // 正常下载完毕的状态码是 200

        // 处理小说恢复后下载出错的问题，重新生成小说的 url
        if (arg.data.type === 3 && xhr.status === 0) {
          arg.data.original = URL.createObjectURL(arg.data.novelBlob)
          return this.download(arg)
        }

        // 进入重试环节
        progressBar.showErrorColor(this.progressBarIndex, true)
        this.retry++
        if (this.retry >= this.retryMax) {
          // 重试 retryMax 次依然错误
          // console.log(arg.data.id + ' retryMax')
          downloadError()
        } else {
          return this.download(arg)
        }
      } else {
        // 状态码正常
        progressBar.showErrorColor(this.progressBarIndex, false)

        // 需要转换动图的情况
        const convertExt = ['webm', 'gif', 'png']
        if (convertExt.includes(arg.data.ext) && arg.data.ugoiraInfo) {
          try {
            if (arg.data.ext === 'webm') {
              file = await converter.webm(file, arg.data.ugoiraInfo)
            }

            if (arg.data.ext === 'gif') {
              file = await converter.gif(file, arg.data.ugoiraInfo)
            }

            if (arg.data.ext === 'png') {
              file = await converter.apng(file, arg.data.ugoiraInfo)
            }
          } catch (error) {
            const msg = `Convert ugoira error, id ${arg.data.idNum}.`
            log.error(msg, 1)
            console.error(error)

            this.cancel = true
            EVT.fire(EVT.list.downloadError, arg.id)
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
              url: blobUrl,
              id: arg.id,
              tabId: 0,
              uuid: false,
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
        const img = await DOM.loadImg(blobUrl)
        const result = await filter.check({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
        if (!result) {
          return this.skip(
            {
              url: blobUrl,
              id: arg.id,
              tabId: 0,
              uuid: false,
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
      msg: 'send_download',
      fileUrl: blobUrl,
      fileName: fileName,
      id,
      taskBatch,
    }

    chrome.runtime.sendMessage(sendData)
  }
}

export { Download }
