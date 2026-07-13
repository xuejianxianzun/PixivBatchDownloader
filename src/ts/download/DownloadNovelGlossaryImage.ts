import { log } from '../Log'
import { lang } from '../Language'
import { SendDownload } from './SendDownload'
import { Tools } from '../Tools'
import { settings } from '../setting/Settings'

type Urls = {
  '240mw': string
  '480mw': string
  '1200x1200': string
  '128x128': string
  original: string
}

/**下载系列小说的设定资料里的图片 */
// 这个模块内部没有添加间隔时间
class DownloadNovelGlossaryImage {
  public getUrl(urls: Urls): string | null {
    switch (settings.novelEmbeddedImageSize) {
      case '128':
        return urls['128x128'] || urls['original']
      case '240':
        return urls['240mw'] || urls['original']
      case '480':
        return urls['480mw'] || urls['original']
      case '1200':
        return urls['1200x1200'] || urls['original']
      case 'original':
        return urls['original']
      default:
        return urls['original'] || null
    }
  }
  public async download(
    urls: Urls,
    novelName: string,
    imageId: string,
    seriesId: string
  ) {
    if (!settings.downloadNovelEmbeddedImage) {
      return
    }

    const blob = await this.getImage(urls, 'blob')
    if (blob === null) {
      return
    }

    const _imageId = seriesId + '-' + imageId
    const url = this.getUrl(urls)
    const imageName = Tools.createNovelImageName(
      novelName,
      url!,
      seriesId,
      _imageId
    )

    SendDownload.noReply(blob, imageName)
  }

  /**最多重试一定次数，避免无限重试 */
  private readonly retryMax = 5

  public async getImage(
    urls: Urls,
    type: 'blob',
    retry?: number
  ): Promise<Blob | null>
  public async getImage(
    urls: Urls,
    type: 'arrayBuffer',
    retry?: number
  ): Promise<ArrayBuffer | null>
  public async getImage(
    urls: Urls,
    type: 'blob' | 'arrayBuffer',
    retry = 0
  ): Promise<Blob | ArrayBuffer | null> {
    if (!settings.downloadNovelEmbeddedImage) {
      return null
    }
    const url = this.getUrl(urls)
    if (url === null) {
      log.error('get glossaryImage url failed: ' + JSON.stringify(urls))
      return null
    }

    console.log('get glossaryImage url', url)
    try {
      const res = await fetch(url, {
        method: 'get',
        credentials: 'same-origin',
      })
      if (!res.ok) {
        const error = new Error(`${res.status} ${res.statusText}`)
        ;(error as any).status = res.status
        ;(error as any).statusText = res.statusText
        throw error
      }
      const data = await res[type]()
      return data
    } catch (error: Error | any) {
      retry++
      // console.log(retry, url)
      if (retry > this.retryMax) {
        let msg = `${lang.transl('_下载设定资料里的图片失败')}: ${url}`
        const status = error.status
        if (status !== undefined) {
          msg += `<br> ${lang.transl('_状态码')}: ${status}`
        }
        log.error(msg)
        return null
      }
      return this.getImage(urls, type as any, retry)
    }
  }
}

const downloadNovelGlossaryImage = new DownloadNovelGlossaryImage()
export { downloadNovelGlossaryImage }
