import { API } from '../API'
import { Config } from '../Config'
import { lang } from '../Language'
import { log } from '../Log'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'
import { downloadInterval } from './DownloadInterval'
import { Tools } from '../Tools'
import { SendDownload } from './SendDownload'
import { EVT } from '../EVT'

type EmbeddedImages = null | {
  [key: string]: string
}

type NovelImageData = {
  /**图片的 id，可能会重复。id 重复时，它们的 p 不同 */
  // 对于上传的图片，id 并没有对应的插画作品页面，也没有序号 p
  // 对于引用自插画的图片，id 就是插画的 id。可能有 p，也可能没有
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
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    const enableDownload = [EVT.list.crawlStart, EVT.list.downloadStart]
    for (const ev of enableDownload) {
      window.addEventListener(ev, () => {
        this.stop = false
      })
    }

    const stopDownload = [EVT.list.downloadPause, EVT.list.downloadStop]
    for (const ev of stopDownload) {
      window.addEventListener(ev, () => {
        this.stop = true
      })
    }
  }

  /** 指示是否应该停止下载后续图片。当用户点击“停止下载”按钮时把该属性设置为 true */
  public stop = false
  // 注意：这里不应该使用 states.downloading，因为它是由多个事件触发的，本模块不需要使用其中的某些事件。
  // 而且在合并单个系列小说时，始终没有“开始下载”、“停止下载”的事件，所以无法使用该状态

  /** 下载文件时的间隔时间，最低为 2000 ms */
  private get downloadInterval() {
    return Math.max(2000, settings.downloadInterval)
  }

  /** 在每张图片之间添加间隔时间 */
  private async waitDownloadInterval(
    mode: 'single novel' | 'merge novel',
    total: number
  ) {
    // 如果未启用下载间隔，则根据需要决定是否添加间隔时间
    if (downloadInterval.checkDisable()) {
      // 如果是下载单个小说，那么当小说里的图片大于指定数量时，就添加间隔时间
      // 如果是合并系列小说，那么始终添加间隔时间。这是因为合并系列小说时，是遍历每篇小说并下载内嵌图片的，无法提前知道所有小说里一共有多少张图片。如果不添加间隔时间，可能会在短时间内下载大量图片。因此需要强制设置间隔时间
      if ((mode === 'single novel' && total > 40) || mode === 'merge novel') {
        await Utils.sleep(this.downloadInterval)
      } else {
        // 如果是下载单个小说，且小说里的图片数量小于指定数量，则不添加间隔时间
        return
      }
    } else {
      // 如果启用了下载间隔，则等待下载间隔模块放行
      await downloadInterval.wait()
    }
  }

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
    mode: 'single novel' | 'merge novel'
  ) {
    const imageList = await this.getImageList(novelId, content, embeddedImages)

    let current = 1
    const total = imageList.length

    // 保存为 TXT 格式时，每加载完一个图片，就立即保存这个图片
    for (let image of imageList) {
      if (this.stop) {
        log.warning(
          lang.transl('_由于下载已暂停或停止所以不再下载小说里剩余的图片')
        )
        break
      }

      this.logProgress(novelId, novelTitle, current, total)
      current++
      if (image.url === '') {
        log.warning(`image ${image.id} not found`)
        continue
      }

      await this.waitDownloadInterval(mode, total)

      const blob = await this.getImage(image.url, 'blob', novelId, novelTitle)
      if (blob === null) {
        continue
      }

      const imageId = novelId + '-' + image.flag_id_part
      const imageName = Tools.createNovelImageName(
        novelName,
        image.url,
        novelId,
        imageId
      )

      await SendDownload.noReply(blob, imageName)
    }

    log.persistentRefresh('downloadNovelImage' + novelId)
  }

  /**小说保存为 epub 时，内嵌到 Epub 对象里。返回值是个对象：size 是图片体积总数，content 是替换后的正文内容 */
  public async EPUB(
    novelId: string,
    novelTitle: string,
    content: string,
    embeddedImages: EmbeddedImages,
    jepub: any,
    mode: 'single novel' | 'merge novel'
  ): Promise<{
    size: number
    content: string
  }> {
    const imageList = await this.getImageList(novelId, content, embeddedImages)

    let size = 0
    let current = 1
    const total = imageList.length

    for (const image of imageList) {
      if (this.stop) {
        log.warning(
          lang.transl('_由于下载已暂停或停止所以不再下载小说里剩余的图片')
        )
        break
      }

      this.logProgress(novelId, novelTitle, current, total)
      current++

      // 在 EPUB 规范里，item 的 id 属性必须以字母开头，所以在前面加上 image- 前缀
      const imageID = 'image-' + image.flag_id_part
      if (image.url === '') {
        content = content.replaceAll(image.flag, `${imageID} not found`)
        continue
      }

      await this.waitDownloadInterval(mode, total)

      const buffer = await this.getImage(
        image.url,
        'arrayBuffer',
        novelId,
        novelTitle
      )
      // 如果图片获取失败，将正文里它对应的标记替换为提示文字
      if (buffer === null) {
        content = content.replaceAll(image.flag, `fetch ${image.url} failed`)
        continue
      }
      jepub.image(
        Config.isFirefox ? Utils.copyArrayBuffer(buffer) : buffer,
        imageID
      )
      size += buffer.byteLength

      // 将小说正文里的图片标记替换为真实的的图片路径，以在 EPUB 里显示
      // 例如把
      // [uploadedimage:17995414] 替换成
      // <img src="assets/17995414.png" />
      // 小说页面的文件是 OEBPS/page-0.html
      // 小说里的图片保存在 OEBPS/assets 文件夹里（封面图除外，它直接保存在 OEBPS/cover-image.jpg）
      // 注意：img src 的 assets 前面不要添加相对位置的符号： ./
      // 也就是说不能是 src="./assets/17995414.png"
      // 因为某些在线阅读器(https://epub-reader.online/)会读取图片内容，生成 blob URL，然后替换原 src 里的值。
      // 当 src 前面有 ./ 的时候，blob URL 会跟在 ./ 后面，导致图片路径错误，无法显示
      const ext = Utils.getExtension(image.url)
      // 在图片前后添加换行，因为有时图片和文字挨在一起，或者多张图片挨在一起。
      // 不添加换行的话，在某些阅读器里这些内容会并排，影响阅读体验
      const imgTag = `<br/><img src="assets/${imageID}.${ext}" /><br/>`
      content = content.replaceAll(image.flag, imgTag)
    }

    log.persistentRefresh('downloadNovelImage' + novelId)
    return {
      size,
      content,
    }
  }

  // 获取正文里上传的图片 id 和引用的图片 id
  private async getImageList(
    novelID: string,
    content: string,
    embeddedImages: EmbeddedImages
  ): Promise<NovelImageData[]> {
    if (!settings.downloadNovelEmbeddedImage) {
      return []
    }
    const idList: NovelImageData[] = []

    // 获取上传的图片数据
    // 此时可以直接获取到图片 URL
    if (embeddedImages) {
      for (const [id, url] of Object.entries(embeddedImages)) {
        const sizeUrl = Tools.converNovelEmbeddedImagetUrl(
          url,
          settings.novelEmbeddedImageSize
        )
        idList.push({
          id: id,
          p: '',
          type: 'upload',
          url: sizeUrl,
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
      return idList
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
              // 根据 novelEmbeddedImageSize 选择对应尺寸的 URL
              // novelEmbeddedImageSize 的尺寸是针对的小说里内嵌（上传）的图片，而非引用的图片，它们的尺寸并不对应
              // 内嵌图片有 5 种尺寸：128、240、480、1200、original
              // 引用的图片有 3 种尺寸：small 48、medium 1200、original
              // 把 novelEmbeddedImageSize 里除了 original 的尺寸都映射到  128、240、480 都映射到 medium 1200。不使用  small 48，因为它太小了，无法看清图片内容
              let size: 'original' | 'medium' | 'small' = 'original'
              if (settings.novelEmbeddedImageSize !== 'original') {
                size = 'medium'
              }
              idData.url = illustData.illust.images[size]
            }
          }
        }
      }

      return idList
    } catch (error: Error | any) {
      if (error.status) {
        // 请求成功，但状态码不正常
        // 最可能的是作品被删除（404 ）了
        // 此时直接返回数据（不会下载图片，但是后续会在正文里显示对应的提示）
        return idList
      } else {
        // 请求失败，没有获得服务器的返回数据，一般都是
        // TypeError: Failed to fetch
        console.error(error)

        // 再次发送这个请求
        await Utils.sleep(2000)
        return this.getImageList(novelID, content, embeddedImages)
      }
    }
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
        Tools.createWorkLink(id, title, 'novel'),
        `${current} / ${total}`
      ),
      'downloadNovelImage' + id
    )
  }

  /**最多重试一定次数，避免无限重试 */
  private readonly retryMax = 10

  // txt 里获取 Blob, epub 里需要获取 ArrayBuffer
  private async getImage(
    url: string,
    type: 'blob',
    id: string | number,
    title: string,
    retry?: number
  ): Promise<Blob | null>
  private async getImage(
    url: string,
    type: 'arrayBuffer',
    id: string | number,
    title: string,
    retry?: number
  ): Promise<ArrayBuffer | null>
  private async getImage(
    url: string,
    type: 'blob' | 'arrayBuffer',
    id: string | number,
    title: string,
    retry = 0
  ): Promise<Blob | ArrayBuffer | null> {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        const error = new Error(`${res.status} ${res.statusText}`)
        ;(error as any).status = res.status
        ;(error as any).statusText = res.statusText
        throw error
      }
      const data = await res[type]()
      return data
    } catch (error: Error | any) {
      // 发生网络错误时，有时候请求会立即结束并被捕获。但有时需要等比较长的时间，例如服务器错误的返回了 206 状态码，请求并不会立刻结束，而是要等到浏览器认为请求超时才会报错。可能需要等待 5 分钟
      retry++
      // console.log(retry, url)
      if (retry > this.retryMax) {
        const link = Tools.createWorkLink(id, title, 'novel')
        let msg = `${lang.transl('_下载小说里的图片失败')}: ${link}<br>${url}`
        const status = error.status
        if (status !== undefined) {
          msg += `<br> ${lang.transl('_状态码')}: ${status}`
        }
        log.error(msg)
        return null
      }
      // 重试下载
      return this.getImage(url, type as any, id, title, retry)
    }
  }
}

const downloadNovelEmbeddedImage = new DownloadNovelEmbeddedImage()
export { downloadNovelEmbeddedImage }
