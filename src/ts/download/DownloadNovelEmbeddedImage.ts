import browser from 'webextension-polyfill'
import { API } from '../API'
import { Config } from '../Config'
import { lang } from '../Language'
import { log } from '../Log'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'
import { downloadInterval } from './DownloadInterval'
import { SendToBackEndData } from './DownloadType'
import { Tools } from '../Tools'

type EmbeddedImages = null | {
  [key: string]: string
}

type NovelImageData = {
  /**图片的 id，可能会重复。id 重复时，它们的 p 不同 */
  id: string
  /**这个属性只在引用其他作品的图片时有值，表示这个图片是作品里的第几张图片（从 1 开始） */
  p: '' | string
  /**表示图片来源自用户上传，或是引用其他作品 */
  type: 'upload' | 'pixiv'
  /**图片的 URL，有可能是空字符串。此时无法下载这个图片。
   * 可能的原因 1：当图片是通过引用作品 ID 插入，但这个图片作品已经不存在了（404）
   * 可能的原因 2：当图片是通过引用作品 ID 插入，但下载器获取到作品数据里的 urls 都是 null（通常是因为用户未登录） */
  url: '' | string
  /**图片在原文中的标记文字，如 [pixivimage:121979383-1]*/
  flag: string
  /**标记里的图片 id + 序号部分，如 121979383-1（也可能没有序号） */
  flag_id_part: string
}

/**下载小说里的内嵌图片 */
class DownloadNovelEmbeddedImage {
  /**小说保存为 txt 时，直接下载小说里的内嵌图片。因为 txt 无法存储图像，只能单独保存
   *
   * 默认是正常下载小说的情况，可以设置为合并系列小说的情况
   */
  public async TXT(
    novelId: string,
    novelTitle: string,
    content: string,
    embeddedImages: EmbeddedImages,
    novelName: string,
    action: 'downloadNovel' | 'mergeNovel' = 'downloadNovel'
  ) {
    const imageList = await this.getImageList(novelId, content, embeddedImages)

    let current = 1
    const total = imageList.length
    // 保存为 TXT 格式时，每加载完一个图片，就立即保存这个图片
    for (let image of imageList) {
      this.logProgress(novelId, novelTitle, current, total)
      current++
      if (image.url === '') {
        log.warning(`image ${image.id} not found`)
        continue
      }

      await downloadInterval.wait()

      const blob = await this.getImage(image.url, 'blob')
      if (blob === null) {
        continue
      }

      let imageName = Utils.replaceSuffix(novelName, image.url!)
      // 在文件名末尾加上内嵌图片的 id 和序号
      const array = imageName.split('.')
      const addString = image.flag_id_part
      array[array.length - 2] = array[array.length - 2] + addString
      imageName = array.join('.')

      // 合并系列小说时，文件直接保存在下载目录里，内嵌图片也保存在下载目录里
      // 所以要替换掉内嵌图片路径里的斜线
      if (action === 'mergeNovel') {
        imageName = Utils.replaceUnsafeStr(imageName)
      }

      let dataURL: string | undefined = undefined
      if (Config.sendDataURL) {
        dataURL = await Utils.blobToDataURL(blob)
      }

      // 不检查下载状态，默认下载成功
      const sendData: SendToBackEndData = {
        msg: 'save_novel_embedded_image',
        fileName: imageName,
        id: 'fake',
        taskBatch: -1,
        blobURL: URL.createObjectURL(blob),
        blob: Config.sendBlob ? blob : undefined,
        dataURL,
      }
      browser.runtime.sendMessage(sendData)
    }

    log.persistentRefresh('downloadNovelImage' + novelId)
  }

  /**小说保存为 epub 时，内嵌到 Epub 对象里 */
  public async EPUB(
    novelId: string,
    novelTitle: string,
    content: string,
    embeddedImages: EmbeddedImages,
    jepub: any
  ) {
    const imageList = await this.getImageList(novelId, content, embeddedImages)
    let current = 1
    const total = imageList.length
    for (const image of imageList) {
      this.logProgress(novelId, novelTitle, current, total)
      current++

      const imageID = image.flag_id_part
      if (image.url === '') {
        content = content.replaceAll(image.flag, `image ${imageID} not found`)
        continue
      }

      // 加载图片
      await downloadInterval.wait()

      const buffer = await this.getImage(image.url, 'arrayBuffer')
      // 如果图片获取失败，将正文里它对应的标记替换为提示文字
      if (buffer === null) {
        content = content.replaceAll(image.flag, `fetch ${image.url} failed`)
        continue
      }
      jepub.image(
        Config.isFirefox ? Utils.copyArrayBuffer(buffer) : buffer,
        imageID
      )

      // 将小说正文里的图片标记替换为真实的的图片路径，以在 EPUB 里显示
      // [uploadedimage:17995414]
      // <img src="assets/17995414.png"></img>
      // 小说页面的文件是 OEBPS/page-0.html
      // 小说里的图片保存在 OEBPS/assets 文件夹里（封面图除外，它直接保存在 OEBPS/cover-image.jpg）
      // 注意：img src 的 assets 前面不要添加相对位置的符号： ./
      // 也就是说不能是 src="./assets/17995414.png"
      // 因为某些在线阅读器(https://epub-reader.online/)会读取图片内容，生成 blob URL，然后替换原 src 里的值。
      // 当 src 前面有 ./ 的时候，blob URL 会跟在 ./ 后面，导致图片路径错误，无法显示
      const ext = Utils.getURLExt(image.url)
      // 在图片前后添加换行，因为有时图片和文字挨在一起，或者多张图片挨在一起。
      // 不添加换行的话，在某些阅读器里这些内容会并排，影响阅读体验
      const imgTag = `<br/><img src="assets/${imageID}.${ext}" /><br/>`
      content = content.replaceAll(image.flag, imgTag)
    }
    log.persistentRefresh('downloadNovelImage' + novelId)
    // 由于 content 是 string 而非对象，是按值传递的，所以需要返回它
    return content
  }

  // 获取正文里上传的图片 id 和引用的图片 id
  private async getImageList(
    novelID: string,
    content: string,
    embeddedImages: EmbeddedImages
  ): Promise<NovelImageData[]> {
    return new Promise(async (resolve) => {
      if (!settings.downloadNovelEmbeddedImage) {
        return resolve([])
      }
      const idList: NovelImageData[] = []

      // 获取上传的图片数据
      // 此时可以直接获取到图片 URL
      if (embeddedImages) {
        for (const [id, url] of Object.entries(embeddedImages)) {
          idList.push({
            id: id,
            p: '',
            type: 'upload',
            url,
            flag: `[uploadedimage:${id}]`,
            flag_id_part: id,
          })
        }
      }

      // 获取引用的图片数据
      const reg = /\[pixivimage:(.+?)\]/g
      let test: RegExpExecArray | null
      while ((test = reg.exec(content))) {
        if (test && test.length === 2) {
          // 当引用的是第一张插画时，可能有序号，也可能没有序号
          // 99381250
          // 一个插画作品可能有多个被引用的图片，如
          // 99760571-1
          // 99760571-130

          // 检查是否重复，因为同一张图片可能在小说里被多次引用，所以有可能出现重复的情况
          // 应该避免重复添加相同的图片 id，因为这会导致重复的图片下载请求
          const some = idList.some((idData) => idData.flag_id_part === test![1])
          if (some) {
            continue
          }

          const idInfo = test[1].split('-')
          idList.push({
            id: idInfo[0],
            // 如果没有带序号，那么实际上就是第一张图片
            p: idInfo[1] || '1',
            type: 'pixiv',
            url: '',
            flag: `[pixivimage:${test[1]}]`,
            flag_id_part: test[1],
          })
        }
      }

      // 引用的图片此时没有 URL，需要获取
      let insertIllustIDs: string[] = []
      for (const idData of idList) {
        if (idData.type === 'pixiv') {
          insertIllustIDs.push(idData.flag_id_part)
        }
      }
      if (insertIllustIDs.length === 0) {
        return resolve(idList)
      }

      try {
        const allInsert = await API.getNovelInsertIllustsData(
          novelID,
          insertIllustIDs
        )

        for (const id_part of insertIllustIDs) {
          const illustData = allInsert.body[id_part]
          for (const idData of idList) {
            if (idData.flag_id_part === id_part) {
              // // 从原图 URL 里根据序号生成对应 p 的 URL
              // const p0URL = illustData.illust.images.original
              // parseInt(idData.p)-1
              // idData.url = p0URL.replace('p0.', `p${idData.p - 1}.`)
              // 当引用的插画作品 404 或当前不能查看时，该数据为 null
              if (illustData.illust === null) {
                idData.url = ''
              } else {
                idData.url = illustData.illust.images.original
              }
            }
          }
        }

        return resolve(idList)
      } catch (error: Error | any) {
        if (error.status) {
          // 请求成功，但状态码不正常
          if (error.status === 500 || error.status === 429) {
            log.error(lang.transl('_抓取被限制时返回空结果的提示'))
            window.setTimeout(() => {
              return this.getImageList(novelID, content, embeddedImages)
            }, Config.retryTime)
            return
          } else {
            // 其他状态码，尚不清楚实际会遇到什么情况，最可能的是作品被删除（404 ）了吧
            // 此时直接返回数据（不会下载图片，但是后续会在正文里显示对应的提示）
            return resolve(idList)
          }
        } else {
          // 请求失败，没有获得服务器的返回数据，一般都是
          // TypeError: Failed to fetch
          console.error(error)

          // 再次发送这个请求
          window.setTimeout(() => {
            return this.getImageList(novelID, content, embeddedImages)
          }, 2000)
        }
      }
    })
  }

  private logProgress(
    id: string,
    title: string,
    current: number,
    total: number
  ) {
    log.log(
      lang.transl(
        '_正在下载小说x中的插画x',
        Tools.createWorkLink(id, title, false),
        `${current} / ${total}`
      ),
      1,
      false,
      'downloadNovelImage' + id
    )
  }

  /**最多重试一定次数，避免无限重试 */
  private readonly retryMax = 5

  // txt 里获取 Blob, epub 里需要获取 ArrayBuffer
  private async getImage(
    url: string,
    type: 'blob',
    retry?: number
  ): Promise<Blob | null>
  private async getImage(
    url: string,
    type: 'arrayBuffer',
    retry?: number
  ): Promise<ArrayBuffer | null>
  private async getImage(
    url: string,
    type: 'blob' | 'arrayBuffer',
    retry = 0
  ): Promise<Blob | ArrayBuffer | null> {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const data = await res[type]()
      return data
    } catch (error) {
      retry++
      console.log(retry, url)
      if (retry > this.retryMax) {
        log.error(`fetch ${url} failed`)
        return null
      }
      // 重试下载
      return this.getImage(url, type as any, retry)
    }
  }
}

const downloadNovelEmbeddedImage = new DownloadNovelEmbeddedImage()
export { downloadNovelEmbeddedImage }
