import { NovelMeta } from '../store/StoreType'
import { settings } from '../setting/Settings'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'
import { downloadNovelEmbeddedImage } from './DownloadNovelEmbeddedImage'
import { lang } from '../Lang'
import { log } from '../Log'

declare const jEpub: any

class MakeNovelFile {
  static async make(data: NovelMeta, type = settings.novelSaveAs) {
    if (type === 'txt') {
      return this.makeTXT(data, settings.saveNovelMeta)
    } else {
      return this.makeEPUB(data, settings.saveNovelMeta)
    }
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

      const userName = Tools.replaceEPUBText(
        Utils.replaceUnsafeStr(data.userName)
      )
      const title = Tools.replaceEPUBTitle(Utils.replaceUnsafeStr(data.title))
      const novelURL = `https://www.pixiv.net/novel/show.php?id=${data.id}`

      // 开始生成 EPUB 文件
      const cover = await fetch(data.coverUrl).then((response) => {
        if (response.ok) return response.arrayBuffer()
        throw 'Network response was not ok.'
      })

      const jepub = new jEpub()
      jepub.init({
        i18n: lang.type,
        // 对 EPUB 左侧的一些文字进行本地化
        i18n_config: {
          code: lang.type,
          cover: 'Cover',
          toc: lang.transl('_目录'),
          info: lang.transl('_Information'),
          note: 'Notes',
        },
        title: title,
        author: userName,
        publisher: novelURL,
        description: Tools.replaceEPUBText(data.description),
        tags: data.tags || [],
      })

      jepub.uuid(novelURL)
      jepub.date(new Date(data.createDate))
      jepub.cover(cover)

      // 添加小说里的图片
      const imageList = await downloadNovelEmbeddedImage.getImageList(
        content,
        data.embeddedImages
      )

      let current = 1
      const total = imageList.length
      for (const image of imageList) {
        log.log(
          lang.transl('_正在下载小说中的插画', `${current} / ${total}`),
          2,
          false
        )
        current++
        if (image.url === null) {
          // 如果引用的图片作品已经不存在，那么它的图片网址会是 null。将其替换为提示
          content = content.replaceAll(
            image.flag,
            `image ${image.id} not found`
          )
          continue
        }

        // 加载图片
        const illustration = await fetch(image.url).then((response) => {
          if (response.ok) {
            return response.blob()
          }
        })
        // 如果图片获取失败，不重试，并将其替换为提示
        if (illustration === undefined) {
          content = content.replaceAll(image.flag, `fetch ${image.url} failed`)
          continue
        }
        jepub.image(illustration, image.id)

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
        const imgTag = `<img src="assets/${image.id}.${ext}" />`
        content = content.replaceAll(image.flag, imgTag)
      }
      log.persistentRefresh()

      // 添加正文，这会在 EPUB 里生成一个新的章节
      // 实际上会生成对应的 html 文件，如 OEBPS/page-0.html
      jepub.add(title, content)

      const blob = await jepub.generate('blob', (metadata: any) => {
        // console.log('progression: ' + metadata.percent.toFixed(2) + ' %');
        // if (metadata.currentFile) console.log('current file = ' + metadata.currentFile);
      })
      resolve(blob)
    })
  }
}

export { MakeNovelFile }
