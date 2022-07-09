import { Result } from '../store/StoreType'
import { fileName } from '../FileName'
import { settings } from '../setting/Settings'

// 下载小说的封面图片
class DownloadNovelCover {
  public async download(result: Result) {
    if (
      !settings.downloadNovelCoverImage ||
      result.type !== 3 ||
      !result.novelMeta?.coverUrl
    ) {
      return
    }

    const url = await this.getCoverBolbURL(result.novelMeta!.coverUrl)
    const novelName = fileName.getFileName(result)
    const coverName = this.createCoverFileName(
      novelName,
      result.novelMeta!.coverUrl
    )
    this.sendDownload(url, coverName)
  }

  public async downloadOnMergeNovel(coverURL: string, novelName: string) {
    const url = await this.getCoverBolbURL(coverURL)
    const coverName = this.createCoverFileName(novelName, coverURL)
    this.sendDownload(url, coverName)
  }

  // 下载封面图片，返回其 Blob URL
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

  // 生成封面的文件名
  private createCoverFileName(novelName: string, coverURL: string) {
    // 用小说的文件名修改，把后缀名改成图片的后缀名
    // 目前来看封面图片的后缀都是 jpg，不过严谨起见还是手动获取其后缀名
    const novelNameArray = novelName.split('.')
    const coverArray = coverURL.split('.')
    novelNameArray[novelNameArray.length - 1] =
      coverArray[coverArray.length - 1]
    const coverName = novelNameArray.join('.')
    return coverName
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
