import browser from 'webextension-polyfill'
import { lang } from '../Lang'
import { log } from '../Log'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'

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
    const url = URL.createObjectURL(blob)
    let coverName = Utils.replaceSuffix(novelName, coverURL)

    // 合并系列小说时，文件直接保存在下载目录里，封面图片也保存在下载目录里
    // 所以要替换掉封面图路径里的斜线
    if (action === 'mergeNovel') {
      coverName = Utils.replaceUnsafeStr(coverName)
    }

    browser.runtime.sendMessage({
      msg: 'save_novel_cover_file',
      blob: Config.isFirefox ? blob : undefined,
      fileURL: url,
      fileName: coverName,
    })
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
