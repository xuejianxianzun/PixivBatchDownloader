import { API } from '../API'
import { lang } from '../Lang'
import { log } from '../Log'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'

type EmbeddedImages = null | {
  [key: string]: string
}

type NovelImageData = {
  /**图片的 id，可能会重复。id 重复时，它们的 p 不同 */
  id: string
  /**这个属性只在引用其他作品的图片时有实机值，表示这个图片是作品里的第几张图片（从 1 开始）。0 无实际意义。 */
  p: number
  /**表示图片来源自用户上传，或是引用其他作品 */
  type: 'upload' | 'pixiv'
  /**图片的 URL，有可能是 null。当图片是通过引用作品 ID 插入，但下载器获取到作品数据里的 urls 都是 null（通常是因为用户未登录），那这个属性就也是 null。此时无法下载这个图片 */
  url: string | null
  /**图片的 BLOBURL */
  blobURL?: string
  /**图片在原文中的标记文字 */
  flag: string
}

type NovelImageList = NovelImageData[]

/**下载小说里的内嵌图片 */
class DownloadNovelEmbeddedImage {
  // 小说保存为 txt 时，直接下载小说里的内嵌图片。因为 txt 无法存储图像，只能单独保存

  /**下载小说为 txt 时
   *
   * 默认是正常下载小说的情况，可以设置为合并系列小说的情况
   */
  public async TXT(
    content: string,
    embeddedImages: EmbeddedImages,
    novelName: string,
    action: 'downloadNovel' | 'mergeNovel' = 'downloadNovel'
  ) {
    if (!settings.downloadNovelEmbeddedImage) {
      return
    }

    const imageList = await this.getImageList(content, embeddedImages)

    let current = 1
    const total = imageList.length
    // 保存为 TXT 格式时，每加载完一个图片，就立即保存这个图片
    for (let image of imageList) {
      log.log(
        lang.transl('_正在下载小说中的插画', `${current} / ${total}`),
        action === 'mergeNovel' ? 1 : 2,
        false
      )
      current++
      if (image.url === null) {
        // 如果引用的图片作品已经不存在，那么它的图片网址会是 null
        log.warning(`image ${image.id} not found`)
        continue
      }

      image = await this.getImageBlobURL(image)
      let imageName = Utils.replaceSuffix(novelName, image.url!)
      // 在文件名末尾加上内嵌图片的 id 和序号
      const array = imageName.split('.')
      const addString = `-${image.id}${image.p === 0 ? '' : '-' + image.p}`
      array[array.length - 2] = array[array.length - 2] + addString
      imageName = array.join('.')

      // 合并系列小说时，文件直接保存在下载目录里，内嵌图片也保存在下载目录里
      // 所以要替换掉内嵌图片路径里的斜线
      if (action === 'mergeNovel') {
        imageName = Utils.replaceUnsafeStr(imageName)
      }
      this.sendDownload(image.blobURL!, imageName)
    }
    log.persistentRefresh()
  }

  // 获取正文里上传的图片 id 和引用的图片 id
  public async getImageList(
    content: string,
    embeddedImages: EmbeddedImages
  ): Promise<NovelImageList> {
    return new Promise(async (resolve) => {
      if (!settings.downloadNovelEmbeddedImage) {
        return resolve([])
      }
      const idList: NovelImageList = []

      // 获取上传的图片数据
      if (embeddedImages) {
        for (const [id, url] of Object.entries(embeddedImages)) {
          idList.push({
            id,
            p: 0,
            type: 'upload',
            url,
            flag: `[uploadedimage:${id}]`,
          })
        }
      }

      // 获取引用的图片数据
      const reg = /\[pixivimage:(.+?)\]/g
      let test
      while ((test = reg.exec(content))) {
        if (test && test.length === 2) {
          // 99381250
          // 一个图像作品可能有多个被引用的图片，如
          // 99760571-1
          // 99760571-130
          const idInfo = test[1].split('-')
          idList.push({
            id: idInfo[0],
            p: idInfo[1] ? parseInt(idInfo[1]) : 0,
            type: 'pixiv',
            url: '',
            flag: `[pixivimage:${test[1]}]`,
          })
        }
      }

      // 引用的图片此时没有 URL
      // 统计引用的图像作品的 id （不重复），然后获取每个 id 的数据
      const artworkIDs: Set<string> = new Set()
      idList.forEach((data) => {
        if (data.type === 'pixiv') {
          artworkIDs.add(data.id)
        }
      })

      for (const id of Array.from(artworkIDs)) {
        try {
          // 尝试获取原图作品数据，提取 URL
          const workData = await API.getArtworkData(id)
          const p0URL = workData.body.urls.original

          for (const idData of idList) {
            if (idData.id === id) {
              // 如果 p 为 0 则表示未指定图片序号，也就是第一张图片
              if (idData.p === 0) {
                idData.url = p0URL
              } else {
                // 如果指定了图片序号，则从第一张图片的 URL 生成指定图片的 URL
                idData.url = p0URL.replace('p0.', `p${idData.p - 1}.`)
              }
            }
          }
        } catch (error) {
          // 原图作品可能被删除了，404
          console.log(error)
          continue
        }
      }

      // 返回数据时，删除没有 url 的数据
      const result = idList.filter((data) => data.url !== '')
      return resolve(result)
    })
  }

  private async getImageBlobURL(
    image: NovelImageData
  ): Promise<NovelImageData> {
    return new Promise(async (resolve) => {
      if (image.url) {
        const illustration = await fetch(image.url).then((response) => {
          if (response.ok) {
            return response.blob()
          }
        })
        // 如果图片获取失败，不重试
        if (illustration === undefined) {
          log.error(`fetch ${image.url} failed`)
          return resolve(image)
        }
        image.blobURL = URL.createObjectURL(illustration)
      }
      resolve(image)
    })
  }

  private sendDownload(url: string, name: string) {
    chrome.runtime.sendMessage({
      msg: 'save_novel_embedded_image',
      fileUrl: url,
      fileName: name,
    })
  }
}

const downloadNovelEmbeddedImage = new DownloadNovelEmbeddedImage()
export { downloadNovelEmbeddedImage }
