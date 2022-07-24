import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'

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
    if (!settings.downloadNovelCoverImage || !coverURL) {
      return
    }

    const url = await this.getCoverBolbURL(coverURL)
    let coverName = Utils.replaceSuffix(novelName, coverURL)

    // 合并系列小说时，文件直接保存在下载目录里，封面图片也保存在下载目录里
    // 所以要替换掉封面图路径里的斜线
    if (action === 'mergeNovel') {
      coverName = Utils.replaceUnsafeStr(coverName)
    }
    this.sendDownload(url, coverName)
  }

  // 生成封面图片的 Blob URL
  private async getCoverBolbURL(coverURL: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(coverURL, {
        method: 'get',
        credentials: 'same-origin',
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      return resolve(url)
    })
  }

  private sendDownload(url: string, name: string) {
    chrome.runtime.sendMessage({
      msg: 'save_novel_cover_file',
      fileUrl: url,
      fileName: name,
    })
  }
}

const downloadNovelCover = new DownloadNovelCover()
export { downloadNovelCover }
