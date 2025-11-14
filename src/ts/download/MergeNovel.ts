import { store } from '../store/Store'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { states } from '../store/States'
import { settings } from '../setting/Settings'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { downloadNovelCover } from '../download/DownloadNovelCover'
import { downloadNovelEmbeddedImage } from './DownloadNovelEmbeddedImage'
import { log } from '../Log'
import { API } from '../API'
import { NovelSeriesData } from '../crawl/CrawlResult'
import { Config } from '../Config'

declare const jEpub: any

// 单个小说的数据
interface NovelData {
  id: string
  /**小说在系列中的排序，是从 1 开始的数字 */
  no: number
  title: string
  tags: string[]
  description: string
  content: string
  coverUrl: string
  embeddedImages: null | {
    [key: string]: string
  }
}

class MergeNovel {
  constructor() {
    this.init()
  }

  private readonly CRLF = '\n' // pixiv 小说的换行符

  /** 这个系列小说的元数据，现在只用在 TXT 里 */
  private seriesMeta = ''

  private init() {
    window.addEventListener(EVT.list.crawlComplete, () => {
      window.setTimeout(() => {
        if (states.mergeNovel) {
          this.merge()
        }
      }, 0)
    })
  }

  private async merge() {
    if (
      store.resultMeta.length === 0 ||
      store.resultMeta[0].novelMeta === null
    ) {
      states.mergeNovel = false
      return
    }

    // 因为结果里的小说顺序可能是乱的，所以需要按照小说的序号对结果进行排序
    const allResult = store.resultMeta.sort(
      Utils.sortByProperty('seriesOrder', 'asc')
    )

    // 汇总小说数据
    const allNovelData: NovelData[] = []
    for (const result of allResult) {
      allNovelData.push({
        id: result.id,
        no: result.seriesOrder!,
        title: Utils.replaceUnsafeStr(result.title),
        tags: result.novelMeta!.tags,
        content: result.novelMeta!.content,
        coverUrl: result.novelMeta!.coverUrl,
        embeddedImages: result.novelMeta!.embeddedImages,
        description: result.novelMeta!.description,
      })
    }

    // 获取这个系列本身的资料
    const seriesDataJSON = await API.getNovelSeriesData(
      store.resultMeta[0].seriesId!
    )
    const seriesData = seriesDataJSON.body

    // 生成系列小说元数据的文本
    this.seriesMeta = ''

    const title = Tools.replaceEPUBTitle(
      Utils.replaceUnsafeStr(seriesData.title)
    )
    const userName = Tools.replaceEPUBText(
      Utils.replaceUnsafeStr(seriesData.userName)
    )
    if (settings.saveNovelMeta) {
      const metaArray: string[] = []
      // 系列标题
      metaArray.push(title)
      // 作者
      metaArray.push(userName)
      // 系列网址
      const link = `https://www.pixiv.net/novel/series/${seriesData.id}`
      metaArray.push(link + this.CRLF)

      const description = Utils.htmlToText(Utils.htmlDecode(seriesData.caption))
      metaArray.push(description + this.CRLF.repeat(2))

      // 设定资料
      if (store.novelSeriesGlossary) {
        metaArray.push(
          Utils.htmlToText(Utils.htmlDecode(store.novelSeriesGlossary)) +
          this.CRLF.repeat(2)
        )
      }

      this.seriesMeta = metaArray.join(this.CRLF)
    }

    // 生成小说文件并下载
    let file: Blob | null = null
    const novelName = `${title}-user_${userName}-seriesId_${seriesData.id}-tags_${seriesData.tags}.${settings.novelSaveAs}`
    if (settings.novelSaveAs === 'txt') {
      file = await this.mergeTXT(allNovelData, novelName)
    } else {
      file = await this.mergeEPUB(allNovelData, seriesData)
    }

    // 下载系列小说的封面图片
    const coverUrl = seriesData.cover.urls.original
    if (settings.downloadNovelCoverImage && coverUrl) {
      this.logDownloadSeriesCover(seriesData.id, seriesData.title)
      await downloadNovelCover.download(coverUrl, novelName, 'mergeNovel')
    }

    const url = URL.createObjectURL(file)
    Utils.downloadFile(url, Utils.replaceUnsafeStr(novelName))

    states.mergeNovel = false
    EVT.fire('downloadComplete')
    log.success(lang.transl('_下载完毕'), 2)

    store.reset()
  }

  private async mergeTXT(
    novelDataArray: NovelData[],
    novelName: string
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 保存为 txt 格式时，在这里下载小说内嵌的图片
      for (const result of store.resultMeta) {
        const meta = result.novelMeta!
        await downloadNovelEmbeddedImage.TXT(
          meta.id,
          meta.title,
          meta.content,
          meta.embeddedImages,
          novelName,
          'mergeNovel'
        )
      }

      // 合并文本内容
      const result: string[] = []
      if (settings.saveNovelMeta) {
        result.push(this.seriesMeta)
      }

      for (const data of novelDataArray) {
        // 添加章节名
        result.push(`${this.chapterNo(data.no)} ${data.title}`)
        result.push(this.CRLF.repeat(2))
        // 添加每篇小说的元数据，内容包含：
        // url 小说的 URL
        // tags 小说的标签列表
        // description 小说的简介
        if (settings.saveNovelMeta) {
          const url = `https://www.pixiv.net/novel/show.php?id=${data.id}`
          result.push(url)
          result.push(this.CRLF.repeat(2))
          const tags = `${data.tags.map((tag) => `#${tag}`).join(this.CRLF)}`
          result.push(tags)
          result.push(this.CRLF.repeat(2))
          result.push(data.description)
          result.push(this.CRLF.repeat(2))
          result.push(`----- ${lang.transl('_下面是正文')} -----`)
          result.push(this.CRLF.repeat(2))
        }
        // 添加正文
        // 替换换行标签，移除 html 标签
        result.push(
          data.content.replace(/<br \/>/g, this.CRLF).replace(/<\/?.+?>/g, '')
        )
        // 在正文结尾添加换行标记，使得不同章节之间区分开来
        result.push(this.CRLF.repeat(4))
      }

      const blob = new Blob(result, {
        type: 'text/plain',
      })
      return resolve(blob)
    })
  }

  private mergeEPUB(
    novelDataArray: NovelData[],
    seriesData: NovelSeriesData['body']
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const link = `https://www.pixiv.net/novel/series/${seriesData.id}`
      const title = Tools.replaceEPUBTitle(
        Utils.replaceUnsafeStr(seriesData.title)
      )
      const userName = Tools.replaceEPUBText(
        Utils.replaceUnsafeStr(seriesData.userName)
      )
      let description = this.handleEPUBDescription(seriesData.caption)

      // 现在生成的 EPUB 小说里有个“信息”页面，会显示如下数据（就是在下面的 jepub.init 里定义的）：
      // title 系列标题
      // author 作者
      // publisher 系列小说的 URL
      // tags 系列小说的标签列表
      // description 系列小说的简介

      // 所以如果需要保存系列小说的元数据，那么把上面未包含的数据添加到 description 里即可
      if (settings.saveNovelMeta) {
        if (store.novelSeriesGlossary) {
          description =
            description +
            '<br/><br/>' +
            this.handleEPUBDescription(store.novelSeriesGlossary)
        }
      }

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
        publisher: link,
        tags: seriesData.tags,
        description: description,
      })

      jepub.uuid(link)
      jepub.date(new Date(seriesData.updateDate))

      // 添加这个系列的封面图片
      const coverUrl = seriesData.cover.urls.original
      if (settings.downloadNovelCoverImage && coverUrl) {
        this.logDownloadSeriesCover(seriesData.id, seriesData.title)
        const cover = await downloadNovelCover.getCover(coverUrl, 'arrayBuffer')
        if (cover) {
          jepub.cover(Config.isFirefox ? Utils.copyArrayBuffer(cover) : cover)
        }
      }

      // 循环添加小说内容
      for (const novelData of novelDataArray) {
        let content = Tools.replaceEPUBTextWithP(novelData.content)
        const novelId = novelData.id

        // 添加每篇小说的封面图片
        let coverHtml = ''
        if (settings.downloadNovelCoverImage && novelData.coverUrl) {
          log.log(
            lang.transl(
              '_下载小说的封面图片的提示',
              Tools.createWorkLink(novelData.id, novelData.title, false)
            ),
            1,
            false,
            'downloadNovelCover' + novelData.id
          )
          // 下载器使用的 jepub.js 库只能为整个 epub 文件添加一个封面图片，不能为单个章节设置封面图片
          // 所以需要手动添加图片，然后添加图片对应的 html 代码
          const cover = await downloadNovelCover.getCover(novelData.coverUrl, 'arrayBuffer')
          if (cover) {
            const imageId = 'cover-' + novelData.id
            jepub.image(Config.isFirefox ? Utils.copyArrayBuffer(cover) : cover, imageId)
            coverHtml = `<p><img src="assets/${imageId}.jpg" /></p>`
          }
        }

        // 添加每篇小说的元数据，内容包含：
        // url 小说的 URL
        // tags 小说的标签列表
        // description 小说的简介
        let metaHtml = ''
        if (settings.saveNovelMeta) {
          const url = `https://www.pixiv.net/novel/show.php?id=${novelData.id}`
          const link = `<p><a href="${url}" target="_blank">${url}</a></p>`
          const tags = `<p>${novelData.tags.map((tag) => `#${tag}`).join('<br/>')}</p>`

          const meta =`${link}${tags}${Tools.replaceEPUBText(novelData.description)}` 
          metaHtml = meta +
            `<br/><br/>----- ${lang.transl('_下面是正文')} -----<br/><br/>`
        }

        // 组合封面图片和简介，使封面图片位于所有文字内容之前
        content = coverHtml + metaHtml + content

        // 添加小说里的图片
        content = await downloadNovelEmbeddedImage.EPUB(
          novelId,
          novelData.title,
          content,
          novelData.embeddedImages,
          jepub
        )

        const title = Tools.replaceEPUBTitle(
          Utils.replaceUnsafeStr(novelData.title)
        )

        // 添加正文，这会在 EPUB 里生成一个新的章节
        // 实际上会生成一个对应的 html 文件，如 OEBPS/page-0.html
        jepub.add(`${this.chapterNo(novelData.no)} ${title}`, content)
      }

      const blob = await jepub.generate('blob', (metadata: any) => {
        // console.log('progression: ' + metadata.percent.toFixed(2) + ' %');
        // if (metadata.currentFile) console.log('current file = ' + metadata.currentFile);
      })
      resolve(blob)
    })
  }

  /** 处理从 Pixiv API 里取得的字符串，将其转换为可以安全的用于 EPUB 小说的 description 的内容
   *
   * 这些字符串通常是作品简介、设定资料等，可能包含 html 代码、特殊符号 */
  private handleEPUBDescription(htmlString: string) {
    return Tools.replaceEPUBTextWithP(
      Tools.replaceEPUBDescription(
        Utils.htmlToText(Utils.htmlDecode(htmlString))
      )
    )
  }

  // 在每个小说的开头加上章节编号
  // 在 TXT 格式的小说里添加章节编号，可以使小说阅读软件能够识别章节，以及显示章节导航，提高阅读体验
  // 对于 EPUB 格式的小说，由于其内部自带分章结构，所以并不依赖这里的章节编号
  private chapterNo(number: number | string) {
    // 如果是中文用户，返回“第N章”。这样最容易被国内的小说阅读软件识别出来
    if (lang.type === 'zh-cn' || lang.type === 'zh-tw' || lang.type === 'ja') {
      return `第${number}章`
    } else {
      // 对于其他地区，返回 `Chapter N`。但是由于我没有使用过国外的小说阅读软件，所以并不清楚是否能够起到分章作用
      return `Chapter ${number}`
    }
    // 我还尝试过使用 #1 这样的编号，但是这种方式并不可靠，有的小说可以分章有的小说不可以
  }

  private logDownloadSeriesCover(seriseId: string, seriseTitle: string) {
    const link = `<a href="https://www.pixiv.net/novel/series/${seriseId}" target="_blank">${seriseTitle}</a>`
    log.log(
      lang.transl('_下载系列小说的封面图片', link),
      1,
      false,
      'downloadSeriesNovelCover' + seriseId
    )
  }
}

new MergeNovel()
