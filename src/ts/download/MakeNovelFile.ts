import { NovelMeta } from '../store/StoreType'
import { settings } from '../setting/Settings'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'
import { lang } from '../Language'
import { log } from '../Log'
import { downloadInterval } from './DownloadInterval'
import { DateFormat } from '../utils/DateFormat'
import { Config } from '../Config'
import { downloadNovelCover } from './DownloadNovelCover'
import { downloadNovelEmbeddedImage } from './DownloadNovelEmbeddedImage'

declare const jEpub: any

class MakeNovelFile {
  /** 下载小说的封面图片 */
  private async downloadCover(
    id: string,
    title: string,
    url: string,
    filename: string
  ) {
    if (settings.downloadNovelCoverImage && url) {
      log.log(
        lang.transl(
          '_下载小说的封面图片的提示',
          Tools.createWorkLink(id, title, false)
        ),
        1,
        false,
        'downloadNovelCover' + id
      )
      await downloadInterval.wait()
      await downloadNovelCover.download(url, filename, 'downloadNovel')
    }
  }

  // 设置单例执行（主要是在下载图片时启用限制），禁止并发执行。
  // 这是因为本模块里的两个 make 方法是被 Download 调用的
  // 有几个同时下载数量，就会产生几个并发调用，这会导致下载器同时下载多个小说里的图片。这样不好：
  // 1. 如果图片体积都比较大，或者用户网络较差时，会增加图片下载失败的几率
  // 2. 如果图片体积都比较小，下载会迅速完成，这会导致下载频率很高，增大了账号被 Pixiv 警告、封禁的风险
  // 因此下载图片期间需要使用单例执行
  private busy = false
  private waitForIdle(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (!this.busy) {
          resolve()
        } else {
          setTimeout(check, 50)
        }
      }
      check()
    })
  }

  public async makeTXT(data: NovelMeta, filename: string) {
    await this.waitForIdle()
    this.busy = true

    await this.downloadCover(data.id, data.title, data.coverUrl, filename)

    // 下载小说里的内嵌图片
    await downloadNovelEmbeddedImage.TXT(
      data.id,
      data.title,
      data.content,
      data.embeddedImages,
      filename
    )

    this.busy = false

    let content = data.content

    // 添加元数据
    if (settings.saveNovelMeta) {
      content =
        this.makeMeta(data) +
        `----- ${lang.transl('_下面是正文')} -----\n\n` +
        content
    }

    // 替换换行标签，移除 html 标签
    content = content.replace(/<br \/>/g, '\n').replace(/<\/?.+?>/g, '')

    return new Blob([content], {
      type: 'text/plain',
    })
  }

  public async makeEPUB(data: NovelMeta, filename: string): Promise<Blob> {
    await this.waitForIdle()
    this.busy = true

    await this.downloadCover(data.id, data.title, data.coverUrl, filename)

    let content = data.content

    // 添加元数据
    if (settings.saveNovelMeta) {
      content =
        this.makeMeta(data) +
        `----- ${lang.transl('_下面是正文')} -----\n\n` +
        content
    }

    // 统一替换添加 <p> 与 </p>， 以对应 EPUB 文本的惯例
    content = Tools.replaceEPUBTextWithP(content)

    const userName = Tools.replaceEPUBText(
      Utils.replaceUnsafeStr(data.userName)
    )
    const title = Tools.replaceEPUBTitle(Utils.replaceUnsafeStr(data.title))
    const novelURL = `https://www.pixiv.net/novel/show.php?id=${data.id}`

    // 开始生成 EPUB 文件
    const jepub = new jEpub()
    const date = DateFormat.format(data.createDate, settings.dateFormat)
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
      // description 的内容会被添加到 book.opf 的 <dc:description> 标签对中
      // 有的小说简介里含有 & 符号，需要转换成别的字符，否则会导致阅读器解析时出错
      // 如 https://www.pixiv.net/novel/show.php?id=22260000
      tags: data.tags || [],
      //使用新的function统一替换添加<p>与</p>， 以对应EPUB文本惯例
      description:
        `<p>${date}</p>` + Tools.replaceEPUBTextWithP(data.description),
    })

    jepub.uuid(novelURL)
    jepub.date(new Date(data.createDate))

    if (settings.downloadNovelCoverImage && data.coverUrl) {
      const cover = await downloadNovelCover.getCover(
        data.coverUrl,
        'arrayBuffer'
      )
      if (cover) {
        jepub.cover(Config.isFirefox ? Utils.copyArrayBuffer(cover) : cover)
      }
    }

    const novelId = data.id

    // 下载小说里的内嵌图片
    content = await downloadNovelEmbeddedImage.EPUB(
      novelId,
      data.title,
      content,
      data.embeddedImages,
      jepub
    )

    this.busy = false

    // 添加正文，这会在 EPUB 里生成一个新的章节
    // 实际上会生成对应的 html 文件，如 OEBPS/page-0.html
    jepub.add(title, content)

    const blob = await jepub.generate('blob', (metadata: any) => {
      // console.log('progression: ' + metadata.percent.toFixed(2) + ' %');
      // if (metadata.currentFile) console.log('current file = ' + metadata.currentFile);
    })
    return blob
  }

  /** 生成 meta 数据，每条数据之间有两个换行 \n，结尾也有两个换行 \n */
  private makeMeta(data: NovelMeta) {
    const array: string[] = []
    const date = DateFormat.format(data.uploadDate, settings.dateFormat)
    // meta 依次是：
    // 标题
    // 作者名
    // url
    // 更新日期
    // tag 列表
    // 简介
    array.push(
      data.title,
      data.userName,
      `https://www.pixiv.net/novel/show.php?id=${data.id}`,
      date,
      data.tags.map((tag) => `#${tag}`).join('\n'),
      data.description
    )
    return array.join('\n\n') + '\n\n'
  }
}

const makeNovelFile = new MakeNovelFile()
export { makeNovelFile }
