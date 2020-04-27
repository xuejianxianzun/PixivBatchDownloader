// 下载文件，并发送给浏览器下载
import { EVT } from './EVT'
import { log } from './Log'
import { lang } from './Lang'
import { titleBar } from './TitleBar'
import { fileName } from './FileName'
import { converter } from './ConvertUgoira'
import {
  downloadArgument,
  SendToBackEndData,
  DonwloadSuccessData,
} from './Download.d'
import { progressBar } from './ProgressBar'
import { filter } from './Filter'

class Download {
  constructor(progressBarIndex: number, data: downloadArgument) {
    this.progressBarIndex = progressBarIndex

    this.download(data)

    this.listenEvents()
  }

  private progressBarIndex: number
  private fileName = ''
  private retry = 0
  private readonly retryMax = 50
  private cancel = false // 这个下载被取消（任务停止，或者没有通过某个检查）

  private sizeCheck: boolean | undefined = undefined // 检查文件体积

  private listenEvents() {
    ;[EVT.events.downloadStop, EVT.events.downloadPause].forEach((event) => {
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
    log.warning(msg)
    EVT.fire(EVT.events.skipSaveFile, data)
  }

  // 下载文件
  private download(arg: downloadArgument) {
    titleBar.change('↓')

    // 获取文件名
    this.fileName = fileName.getFileName(arg.data)

    // 重设当前下载栏的信息
    this.setProgressBar(0, 0)

    // 下载图片
    let xhr = new XMLHttpRequest()
    xhr.open('GET', arg.data.url, true)
    xhr.responseType = 'blob'

    // 显示下载进度
    xhr.addEventListener('progress', async (event) => {
      // 检查体积设置
      if (this.sizeCheck === undefined) {
        this.sizeCheck = await filter.check({ size: event.total })
        if (this.sizeCheck === false) {
          // 当因为体积问题跳过下载时，可能这个下载进度还是 0 或者很少，所以这里直接把进度条拉满
          this.setProgressBar(1, 1)
          this.cancel = true
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
      const HandleError = () => {
        let msg = ''

        if (xhr.status === 404) {
          // 404 错误时
          msg = lang.transl('_file404', arg.id)
        } else {
          // 无法处理的错误状态
          msg = lang.transl('_文件下载失败', arg.id)
        }

        log.error(msg, 1)

        // 创建 txt 文件，保存提示信息
        file = new Blob([`${msg}`], {
          type: 'text/plain',
        })

        this.fileName = this.fileName.replace(
          /\.jpg$|\.png$|\.zip$|\.gif$|\.webm$/,
          '.txt'
        )

        EVT.fire(EVT.events.downloadError)
      }

      if (xhr.status !== 200) {
        // 状态码错误
        // 正常下载完毕的状态码是 200
        progressBar.showErrorColor(this.progressBarIndex, true)
        this.retry++
        if (this.retry >= this.retryMax) {
          // 重试 retryMax 次依然错误，进行错误处理
          HandleError()
        } else {
          return this.download(arg)
        }
      } else {
        // 状态码正常
        progressBar.showErrorColor(this.progressBarIndex, false)

        // 需要转换动图的情况
        if (
          (arg.data.ext === 'webm' || arg.data.ext === 'gif') &&
          arg.data.ugoiraInfo
        ) {
          try {
            // 需要转换成 webm 视频
            if (arg.data.ext === 'webm') {
              file = await converter.webm(file, arg.data.ugoiraInfo)
            }

            // 需要转换成 gif 动图
            if (arg.data.ext === 'gif') {
              file = await converter.gif(file, arg.data.ugoiraInfo)
            }
          } catch (error) {
            // 创建 txt 文件，保存提示信息
            const msg = `Error: convert ugoira error, work id ${arg.data.idNum}.`
            log.error(msg, 2)

            file = new Blob([`${msg}`], {
              type: 'text/plain',
            })

            this.fileName = this.fileName.replace(/\.gif$|\.webm$/, '.txt')
          }
        }
      }

      // 生成下载链接
      const blobUrl = URL.createObjectURL(file)

      // 检查图片的彩色、黑白设置
      // 这里的检查，主要是因为抓取时只能检测第一张的缩略图，有些作品第一张图的颜色和后面不一样。例如某个作品第一张是彩色，后面是黑白；设置条件是只下载彩色。抓取时这个作品通过了检查，后面的黑白图片也会被下载。此时就需要在这里重新检查一次。
      // 对插画、漫画进行检查。动图抓取时检查了第一张图，已经够了，这里不再检查
      // 这里并没有让 filter 初始化，如果用户在抓取之后修改了彩色、黑白的设置，filter 不会响应变化。所以这里不检查第一张图，以避免无谓的检查。如果以后使 filter 在这里初始化了，那么第一张图也需要检查。
      if (
        (arg.data.type === 0 || arg.data.type === 1) &&
        !arg.data.id.includes('p0')
      ) {
        const result = await filter.check({
          mini: blobUrl,
        })
        if (!result) {
          this.cancel = true
          return this.skip(
            {
              url: blobUrl,
              id: arg.id,
              tabId: 0,
              uuid: false,
            },
            lang.transl('_不保存图片因为颜色设置', arg.id)
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
