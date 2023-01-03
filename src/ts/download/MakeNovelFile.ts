import { NovelMeta } from '../store/StoreType'
import { settings } from '../setting/Settings'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'
import { downloadNovelEmbeddedImage } from './DownloadNovelEmbeddedImage'

declare const EpubMaker: any

class MakeNovelFile {
  static async make(data: NovelMeta, type = settings.novelSaveAs) {
    if (type === 'txt') {
      return this.makeTXT(data, settings.saveNovelMeta)
    }
    return this.makeEPUB(data, settings.saveNovelMeta)
  }

  static makeTXT(data: NovelMeta, saveMeta = true) {
    let content = saveMeta ? data.meta + data.content : data.content

    // 替换换行标签，移除 html 标签
    content = content.replace(/<br \/>/g, '\n').replace(/<\/?.+?>/g, '')

    return new Blob([content], {
      type: 'text/plain',
    })
  }

  static makeEPUB(data: NovelMeta, saveMeta = true): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      let content = saveMeta ? data.meta + data.content : data.content

      content = Tools.replaceEPUBText(content)

      // 添加小说里内嵌的图片。这部分必须放在 replaceEPUBText 后面，否则 <img> 标签的左尖括号会被转义
      content = await downloadNovelEmbeddedImage.EPUB(
        content,
        data.embeddedImages
      )

      // epub 内部会使用标题 title 建立一个文件夹，把一些文件存放进去，所以要替换掉标题的特殊字符。特殊字符会导致这个文件夹名被截断，结果就是这个 epub 文件无法被解析。
      const userName = Tools.replaceEPUBText(
        Utils.replaceUnsafeStr(data.userName)
      )
      const title = Tools.replaceEPUBText(Utils.replaceUnsafeStr(data.title))
      new EpubMaker()
        .withTemplate('idpf-wasteland')
        .withAuthor(userName)
        .withModificationDate(new Date(data.createDate))
        .withRights({
          description: Tools.replaceEPUBText(data.description),
          license: '',
        })
        .withAttributionUrl(
          `https://www.pixiv.net/novel/show.php?id=${data.id}`
        )
        .withCover(data.coverUrl, {
          license: '',
          attributionUrl: '',
        })
        .withTitle(title)
        .withSection(
          new EpubMaker.Section(
            'chapter',
            null,
            {
              title: title,
              content: content,
            },
            true,
            true
          )
        )
        .makeEpub()
        .then((blob: Blob) => {
          resolve(blob)
        })
    })
  }
}

export { MakeNovelFile }
