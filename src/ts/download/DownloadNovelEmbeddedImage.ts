import { API } from '../API'
import { Config } from '../Config'
import { lang } from '../Lang'
import { log } from '../Log'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'
import { downloadInterval } from './DownloadInterval'

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
  /**图片的 BLOBURL */
  blobURL?: string
  /**图片在原文中的标记文字，如 [pixivimage:121979383-1]*/
  flag: string
  /**标记里的图片 id + 序号部分，如 121979383-1（也可能没有序号） */
  flag_id_part: string
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
    novelID: string,
    content: string,
    embeddedImages: EmbeddedImages,
    novelName: string,
    action: 'downloadNovel' | 'mergeNovel' = 'downloadNovel'
  ) {
    if (!settings.downloadNovelEmbeddedImage) {
      return
    }

    const imageList = await this.getImageList(novelID, content, embeddedImages)

    let current = 1
    const total = imageList.length
    // 保存为 TXT 格式时，每加载完一个图片，就立即保存这个图片
    for (let image of imageList) {
      log.log(
        lang.transl('_正在下载小说中的插画', `${current} / ${total}`),
        1,
        false,
        'downloadNovelImage' + novelID
      )
      current++
      if (image.url === '') {
        log.warning(`image ${image.id} not found`)
        continue
      }

      await downloadInterval.wait()

      image = await this.getImageBlobURL(image)
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
      this.sendDownload(image.blobURL!, imageName)
    }
    log.persistentRefresh('downloadNovelImage' + novelID)
  }

  // 获取正文里上传的图片 id 和引用的图片 id
  public async getImageList(
    novelID: string,
    content: string,
    embeddedImages: EmbeddedImages
  ): Promise<NovelImageList> {
    return new Promise(async (resolve) => {
      if (!settings.downloadNovelEmbeddedImage) {
        return resolve([])
      }
      const idList: NovelImageList = []

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
      } catch (error) {
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

  private async getImageBlobURL(
    image: NovelImageData
  ): Promise<NovelImageData> {
    return new Promise(async (resolve) => {
      if (image.url) {
        let illustration: Blob | undefined = undefined
        try {
          illustration = await fetch(image.url).then((response) => {
            if (response.ok) {
              return response.blob()
            }
          })
        } catch (error) {
          console.log(error)
        }
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
