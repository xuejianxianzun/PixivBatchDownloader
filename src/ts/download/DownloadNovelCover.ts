import browser from 'webextension-polyfill'
import { lang } from '../Language'
import { log } from '../Log'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'
import { SendToBackEndData } from './DownloadType'

class DownloadNovelCover {
  /**下载小说的封面图片
   *
   * 默认是正常下载小说的情况，可以设置为合并系列小说的情况
   */
  public async download(
    coverURL: string,
    novelName: string,
    action: 'downloadNovel' | 'mergeNovel' = 'downloadNovel'
  ) {
    log.log(lang.transl('_下载封面图片'), 1, false, 'downloadNovelCover')

    const blob = await this.getCover(coverURL)
    let coverName = Utils.replaceSuffix(novelName, coverURL)

    // 合并系列小说时，文件直接保存在下载目录里，封面图片也保存在下载目录里
    // 所以要替换掉封面图路径里的斜线
    if (action === 'mergeNovel') {
      coverName = Utils.replaceUnsafeStr(coverName)
    }

    let dataURL: string | undefined = undefined
    if (Config.sendDataURL) {
      dataURL = await Utils.blobToDataURL(blob)
    }

    // 不检查下载状态，默认下载成功
    const sendData: SendToBackEndData = {
      msg: 'save_novel_cover_file',
      fileName: coverName,
      id: 'fake',
      taskBatch: -1,
      blobURL: URL.createObjectURL(blob),
      blob: Config.sendBlob ? blob : undefined,
      dataURL,
    }
    browser.runtime.sendMessage(sendData)
  }

  private async getCover(coverURL: string): Promise<Blob> {
    const res = await fetch(coverURL, {
      method: 'get',
      credentials: 'same-origin',
    })
    const blob = await res.blob()
    return blob
  }
}

const downloadNovelCover = new DownloadNovelCover()
export { downloadNovelCover }
