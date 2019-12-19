// 下载文件，发送给浏览器下载
import { EVT } from './EVT'
import { log } from './Log'
import { lang } from './Lang'
import { store } from './store'
import { titleBar } from './TitleBar'
import { fileName } from './FileName'
import { dlCtrl } from './DownloadControl'
import { converter } from './ConvertUgoira'
import {
  downloadArgument,
  DownloadedMsg,
  SendToBackEndData
} from './Download.d'

class DownloadFile {
  constructor() {
    window.addEventListener(EVT.events.download, (event: CustomEventInit) => {
      this.download(event.detail.data as downloadArgument)
    })
    this.listenDownloaded()
  }

  private downloadTime: number = 0 // 把下载完成的文件交给浏览器保存的时间戳
  private timeInterval: number = 200 // 设置向浏览器发送下载任务的间隔时间。如果在很短时间内让浏览器建立大量下载任务，有一些下载任务就会丢失，所以设置这个参数。
  private taskBatch: number = 0 // 任务批次

  // 监听浏览器下载文件后，返回的消息
  private listenDownloaded() {
    chrome.runtime.onMessage.addListener((msg: DownloadedMsg) => {
      if (!this.taskBatch) {
        return
      }
      // 文件下载成功
      if (msg.msg === 'downloaded') {
        // 释放 BLOBURL
        URL.revokeObjectURL(msg.data.url)

        EVT.fire(EVT.events.downloadSucccess, msg.data)
      } else if (msg.msg === 'download_err') {
        // 下载出错
        log.error(
          `${store.result[msg.data.index].id}: download error! code: ${msg.err}`
        )
        EVT.fire(EVT.events.downloadError)
      }

      // UUID 的情况
      if (msg.data && msg.data.uuid) {
        log.error(lang.transl('_uuid'))
      }
    })
  }

  // 下载文件。参数是要使用的下载栏的序号
  public download(arg: downloadArgument) {
    titleBar.changeTitle('↓')

    this.taskBatch = arg.taskBatch

    // 获取文件名
    let fullFileName = fileName.getFileName(arg.data)

    // 重设当前下载栏的信息
    dlCtrl.setDownloadBar(arg.progressBarNo, fullFileName, 0, 0)

    // 下载图片
    let xhr = new XMLHttpRequest()
    xhr.open('GET', arg.data.url, true)
    xhr.responseType = 'blob'

    // 显示下载进度
    xhr.addEventListener('progress', function(event) {
      if (dlCtrl.downloadStopped) {
        xhr.abort()
        xhr = null as any
        return
      }
      dlCtrl.setDownloadBar(
        arg.progressBarNo,
        fullFileName,
        event.loaded,
        event.total
      )
    })

    // 图片获取完毕（出错时也会进入 loadend）
    xhr.addEventListener('loadend', async () => {
      if (dlCtrl.downloadStopped) {
        xhr = null as any
        return
      }

      let file: Blob = xhr.response // 要下载的文件

      // 正常下载完毕的状态码是 200
      if (xhr.status !== 200) {
        // 404 时不进行重试，因为重试也依然会是 404
        if (xhr.status === 404) {
          // 输出提示信息
          log.error(lang.transl('_file404', arg.data.id), 1)
          // 404 错误时创建 txt 文件，并保存提示信息
          file = new Blob([`${lang.transl('_file404', arg.data.id)}`], {
            type: 'text/plain'
          })
          fullFileName = fullFileName.replace(
            /\.jpg$|\.png$|\.zip$|\.gif$|\.webm$/,
            '.txt'
          )
        } else {
          EVT.fire(EVT.events.downloadError)
          return
        }
      } else if (
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

      // 生成下载链接
      const blobUrl = URL.createObjectURL(file)
      // 向浏览器发送下载任务
      this.browserDownload(blobUrl, fullFileName, arg.progressBarNo, arg.index)
      xhr = null as any
      file = null as any
    })
    xhr.send()
  }

  // 向浏览器发送下载任务
  private browserDownload(
    blobUrl: string,
    fullFileName: string,
    downloadBarNo: number,
    index: number
  ) {
    // 如果前后两次任务的时间间隔小于 time_interval，则延迟一定时间使间隔达到 time_interval。
    const t = new Date().getTime() - this.downloadTime
    if (t < this.timeInterval) {
      setTimeout(() => {
        this.browserDownload(blobUrl, fullFileName, downloadBarNo, index)
      }, this.timeInterval - t)
      return
    }

    // 如果任务已停止，不会向浏览器发送下载任务
    if (dlCtrl.downloadStopped) {
      // 释放 bloburl
      URL.revokeObjectURL(blobUrl)
      return
    }

    this.downloadTime = new Date().getTime()

    const sendData: SendToBackEndData = {
      msg: 'send_download',
      fileUrl: blobUrl,
      fileName: fullFileName,
      no: downloadBarNo,
      index: index,
      taskBatch: this.taskBatch
    }

    chrome.runtime.sendMessage(sendData)
  }
}

const dlFile = new DownloadFile()
export { dlFile }
