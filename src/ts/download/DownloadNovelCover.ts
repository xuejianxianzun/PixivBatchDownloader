import browser from 'webextension-polyfill'
import { log } from '../Log'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'
import { SendToBackEndData } from './DownloadType'
import { lang } from '../Language'

class DownloadNovelCover {
  /**下载小说的封面图片
   *
   * 默认是正常下载小说的情况，可以设置为合并系列小说的情况
   */
  // 这个模块内部没有添加间隔时间，由调用者负责添加间隔时间
  public async download(
    coverURL: string,
    novelName: string,
    action: 'downloadNovel' | 'mergeNovel' = 'downloadNovel'
  ) {
    const blob = await this.getCover(coverURL, 'blob')
    if (blob === null) {
      return
    }

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
    } catch (error) {
      retry++
      console.log(retry, url)
      if (retry > this.retryMax) {
        log.error(`${lang.transl('_下载小说封面失败')}: ${url}`)
        return null
      }
      return this.getCover(url, type as any, retry)
    }
  }
}

const downloadNovelCover = new DownloadNovelCover()
export { downloadNovelCover }
