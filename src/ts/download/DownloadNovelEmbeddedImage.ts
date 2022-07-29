import { API } from '../API'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'

type EmbeddedImages = null | {
  [key: string]: string
}

type IDList = {
  id: string
  type: 'upload' | 'pixiv'
  url: string
  blobURL?: string
}[]

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

    let idList = await this.getIdList(content, embeddedImages)
    idList = await this.getImageBolbURL(idList)

    for (const item of idList) {
      let imageName = Utils.replaceSuffix(novelName, item.url)
      const array = imageName.split('.')
      // 在文件名末尾加上内嵌图片的 id
      array[array.length - 2] = array[array.length - 2] + '-' + item.id
      imageName = array.join('.')

      // 合并系列小说时，文件直接保存在下载目录里，内嵌图片也保存在下载目录里
      // 所以要替换掉内嵌图片路径里的斜线
      if (action === 'mergeNovel') {
        imageName = Utils.replaceUnsafeStr(imageName)
      }
      this.sendDownload(item.blobURL!, imageName)
    }
  }

  /**下载小说为 EPUB 时，替换内嵌图片标记，把图片用 img 标签保存到正文里 */
  public async EPUB(
    content: string,
    embeddedImages: EmbeddedImages
  ): Promise<string> {
    return new Promise(async (resolve) => {
      if (!settings.downloadNovelEmbeddedImage) {
        return resolve(content)
      }

      let idList = await this.getIdList(content, embeddedImages)
      idList = await this.getImageBolbURL(idList)

      for (const data of idList) {
        const dataURL = await this.getImageDataURL(data)
        const html = `<img src="${dataURL}" />`
        const flag = `[${
          data.type === 'upload' ? 'uploadedimage' : 'pixivimage'
        }:${data.id}]`
        content = content.replace(flag, html)
      }

      return resolve(content)
    })
  }

  // 获取正文里上传的图片 id 和引用的图片 id
  private async getIdList(
    content: string,
    embeddedImages: EmbeddedImages
  ): Promise<IDList> {
    return new Promise(async (resolve) => {
      const idList: IDList = []

      // 获取上传的图片数据
      if (embeddedImages) {
        for (const [id, url] of Object.entries(embeddedImages)) {
          idList.push({
            id,
            type: 'upload',
            url,
          })
        }
      }

      // 获取引用的图片数据
      const reg = /pixivimage:(\d+)/g
      let test
      while ((test = reg.exec(content))) {
        if (test && test.length === 2) {
          idList.push({
            id: test[1],
            type: 'pixiv',
            url: '',
          })
        }
      }

      // 引用的图片此时没有 URL，获取其 URL
      for (const data of idList) {
        if (data.type === 'pixiv') {
          const workData = await API.getArtworkData(data.id)
          data.url = workData.body.urls.original
        }
      }

      return resolve(idList)
    })
  }

  private async getImageBolbURL(idList: IDList): Promise<IDList> {
    return new Promise(async (resolve) => {
      for (const data of idList) {
        // epub 里无法直接加载 pixiv 的图片，所以必须保存到本地
        // 因为图片的域名 i.pximg.net 与 pixiv.net 不同，所以必须先转换为 blobURL，不然会有跨域问题，无法获取 DataURL
        const res = await fetch(data.url)
        const blob = await res.blob()
        data.blobURL = URL.createObjectURL(blob)
      }

      resolve(idList)
    })
  }

  private async getImageDataURL(data: {
    id: string
    type: 'upload' | 'pixiv'
    url: string
    blobURL?: string
  }): Promise<string> {
    return new Promise(async (resolve) => {
      const img = await Utils.loadImg(data.blobURL!)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const con = canvas.getContext('2d')
      con!.drawImage(img, 0, 0, img.width, img.height)

      const suffix = Utils.getSuffix(data.url)
      // 如果原图是 png 格式，就转换成 png 格式的数据，否则转换为 jpeg 格式
      if (suffix === 'png') {
        const ImgDataURL = canvas.toDataURL()
        return resolve(ImgDataURL)
      } else {
        const ImgDataURL = canvas.toDataURL('image/jpeg', 0.95)
        return resolve(ImgDataURL)
      }
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
