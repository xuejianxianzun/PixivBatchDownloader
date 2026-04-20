import { log } from '../Log'
import { Utils } from '../utils/Utils'
import { lang } from '../Language'
import { SendDownload } from './SendDownload'

class DownloadNovelCover {
  /**下载小说的封面图片 */
  // 这个模块内部没有添加间隔时间
  public async download(coverURL: string, novelName: string) {
    const blob = await this.getCover(coverURL, 'blob')
    if (blob === null) {
      return
    }

    let coverName = Utils.replaceExtension(novelName, coverURL)
    SendDownload.noReply(blob, coverName)
  }

  /**最多重试一定次数，避免无限重试 */
  private readonly retryMax = 5

  public async getCover(
    url: string,
    type: 'blob',
    retry?: number
  ): Promise<Blob | null>
  public async getCover(
    url: string,
    type: 'arrayBuffer',
    retry?: number
  ): Promise<ArrayBuffer | null>
  public async getCover(
    url: string,
    type: 'blob' | 'arrayBuffer',
    retry = 0
  ): Promise<Blob | ArrayBuffer | null> {
    try {
      const res = await fetch(url, {
        method: 'get',
        credentials: 'same-origin',
      })
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const data = await res[type]()
      return data
    } catch (error: Error | any) {
      retry++
      // console.log(retry, url)
      if (retry > this.retryMax) {
        let msg = `${lang.transl('_下载小说封面失败')}: ${url}`
        const status = error.status
        if (status !== undefined) {
          msg += `<br> ${lang.transl('_状态码')}: ${status}`
        }
        log.error(msg)
        return null
      }
      return this.getCover(url, type as any, retry)
    }
  }
}

const downloadNovelCover = new DownloadNovelCover()
export { downloadNovelCover }
