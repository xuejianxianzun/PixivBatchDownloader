// 下载文件，并发送给浏览器下载
import { EVT } from './EVT'
import { log } from './Log'
import { lang } from './Lang'
import { titleBar } from './TitleBar'
import { fileName } from './FileName'
import { converter } from './ConvertUgoira'
import { downloadArgument, SendToBackEndData, ProgressBar } from './Download.d'

class Download {
  constructor(progressBar: HTMLDivElement, data: downloadArgument) {
    this.progressBar = {
      name: progressBar.querySelector('.download_fileName')! as HTMLSpanElement,
      loaded: progressBar.querySelector('.loaded')! as HTMLSpanElement,
      progress: progressBar.querySelector('.progress')! as HTMLDivElement
    }

    this.download(data)

    this.listenEvents()
  }

  private progressBar: ProgressBar
  private stoped = false
  private retry = 0
  private readonly retryMax = 50

  private listenEvents() {
    ;[EVT.events.downloadStop, EVT.events.downloadPause].forEach(event => {
      window.addEventListener(event, () => {
        this.stoped = true
      })
    })
  }

  // 设置进度条信息
  private setProgressBar(loaded: number, total: number) {
    this.progressBar.loaded.textContent = `${Math.floor(
      loaded / 1024
    )}/${Math.floor(total / 1024)}`

    let progress = loaded / total
    if (isNaN(progress)) {
      progress = 0
    }
    this.progressBar.progress.style.width = progress * 100 + '%'
  }

  private download(arg: downloadArgument) {
    titleBar.changeTitle('↓')

    // 获取文件名
    let fullFileName = fileName.getFileName(arg.data)

    // 重设当前下载栏的信息
    this.progressBar.name.textContent = fullFileName
    this.setProgressBar(0, 0)

    // 下载图片
    let xhr = new XMLHttpRequest()
    xhr.open('GET', arg.data.url, true)
    xhr.responseType = 'blob'

    // 显示下载进度
    xhr.addEventListener('progress', event => {
      if (this.stoped) {
        xhr.abort()
        xhr = null as any
        return
      }
      this.setProgressBar(event.loaded, event.total)
    })

    // 图片获取完毕（出错时也会进入 loadend）
    xhr.addEventListener('loadend', async () => {
      if (this.stoped) {
        xhr = null as any
        return
      }

      let file: Blob = xhr.response // 要下载的文件

      const HandlingError = () => {
        if (xhr.status === 404) {
          // 404 错误时创建 txt 文件，并保存提示信息
          const msg = lang.transl('_file404', arg.id)
          log.error(msg, 1)
          file = new Blob([`${msg}`], {
            type: 'text/plain'
          })
          fullFileName = fullFileName.replace(
            /\.jpg$|\.png$|\.zip$|\.gif$|\.webm$/,
            '.txt'
          )
          return true
        } else {
          // 无法处理的情况
          EVT.fire(EVT.events.downloadError)
          return false
        }
      }

      if (xhr.status !== 200) {
        // 状态码错误
        // 正常下载完毕的状态码是 200
        this.progressBar.name.classList.add('downloadError')
        this.retry++
        if (this.retry >= this.retryMax) {
          // 重试 retryMax 次依然错误，进行错误处理。无法处理的情况则终止执行。
          if (!HandlingError()) {
            return
          }
        } else {
          return this.download(arg)
        }
      } else {
        // 状态码正常
        this.progressBar.name.classList.remove('downloadError')
        if (
          (arg.data.ext === 'webm' || arg.data.ext === 'gif') &&
          arg.data.ugoiraInfo
        ) {
          // 如果需要转换成视频
          if (arg.data.ext === 'webm') {
            file = await converter.webm(file, arg.data.ugoiraInfo)
          }

          // 如果需要转换成动图
          if (arg.data.ext === 'gif') {
            file = await converter.gif(file, arg.data.ugoiraInfo)
          }
        }
      }

      // 生成下载链接
      const blobUrl = URL.createObjectURL(file)
      // 向浏览器发送下载任务
      this.browserDownload(blobUrl, fullFileName, arg.id, arg.taskBatch)
      xhr = null as any
      file = null as any
    })
    xhr.send()
  }

  // 向浏览器发送下载任务
  private browserDownload(
    blobUrl: string,
    fullFileName: string,
    id: string,
    taskBatch: number
  ) {
    // 如果任务已停止，不会向浏览器发送下载任务
    if (this.stoped) {
      // 释放 bloburl
      URL.revokeObjectURL(blobUrl)
      return
    }

    const sendData: SendToBackEndData = {
      msg: 'send_download',
      fileUrl: blobUrl,
      fileName: fullFileName,
      id,
      taskBatch
    }

    chrome.runtime.sendMessage(sendData)
  }
}

export { Download }
