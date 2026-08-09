import browser from 'webextension-polyfill'
import { Config } from '../Config'
import { Utils } from '../utils/Utils'
import { SendToBackEndData } from './DownloadType'

// 由于现在有两种下载方式：1. 调用浏览器的 downloads API；2. 使用 A 标签下载。所以在这里统一处理
class SendDownload {
  /**
   * 下载不显示在下载进度条上的独立文件，不检查下载状态，默认下载成功。
   * @param blob 要下载的文件内容
   * @param name 文件名，可包含文件夹路径
   * @param downloadMethod `downloadsAPI` 使用浏览器 downloads API，可以创建子文件夹保存文件；`anchorDownload` 使用 A 标签下载，该方法会忽略文件夹，直接把文件保存到下载目录里。
   *
   * 提示：如果这个文件是某个抓取结果的附带文件，则应该根据 settings.rememberTheLastSaveLocation 来决定使用哪种下载方式。
   * @param conflictAction downloads API 遇到同名文件时的处理方式。如果未指定，后台脚本默认会使用 overwrite
   */
  static async noReply(
    blob: Blob,
    name: string,
    downloadMethod: 'downloadsAPI' | 'anchorDownload',
    conflictAction?: 'uniquify' | 'overwrite' | 'prompt'
  ) {
    const blobURL = URL.createObjectURL(blob)

    // 如果需要使用 a.download 来下载文件
    if (downloadMethod === 'anchorDownload') {
      // 移除文件夹，只保留文件名部分，因为这种方式不支持建立文件夹
      const lastName = name.split('/').pop()
      Utils.downloadFile(blobURL, lastName!)
    } else {
      // 调用 downloads API
      let dataURL: string | undefined = undefined
      if (Config.sendDataURL) {
        dataURL = await Utils.blobToDataURL(blob)
      }

      const sendData: SendToBackEndData = {
        msg: 'save_novel_series_file',
        fileName: name,
        id: 'fake',
        taskBatch: -1,
        blobURL,
        blob: Config.sendBlob ? blob : undefined,
        dataURL,
        conflictAction,
      }
      browser.runtime.sendMessage(sendData)
    }
  }
}

export { SendDownload }
