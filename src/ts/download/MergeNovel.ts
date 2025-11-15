import { store } from '../store/Store'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { settings } from '../setting/Settings'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { downloadNovelCover } from '../download/DownloadNovelCover'
import { downloadNovelEmbeddedImage } from './DownloadNovelEmbeddedImage'
import { log } from '../Log'
import { API } from '../API'
import { NovelSeriesData } from '../crawl/CrawlResult'
import { Config } from '../Config'
import { toast } from '../Toast'
import { getNovelGlossarys } from '../crawlNovelPage/GetNovelGlossarys'
import { DateFormat } from '../utils/DateFormat'

declare const jEpub: any

/** 储存每个小说的必要数据 */
interface NovelData {
  id: string
  /**小说在系列中的排序，是从 1 开始的数字 */
  no: number
  title: string
  updateDate: string
  tags: string[]
  description: string
  content: string
  coverUrl: string
  embeddedImages: null | {
    [key: string]: string
  }
}

class MergeNovel {
  constructor(seriesId: string | number) {
    if (!seriesId) {
      toast.error(`seriesId is undefined`)
      return
    }

    this.seriesId = seriesId.toString()
    this.merge()
  }

  private seriesId = ''
  private seriesTitle = ''
  private seriesUpdateDate = ''
  private seriesCaption = ''
  private seriesGlossary = ''
  private seriesTags: string[] = []
  private userName = ''

  private novelIdList: string[] = []
  private allNovelData: NovelData[] = []
  private readonly limit = 30
  private last = 0
  private readonly CRLF = '\n' // 小说的换行符
  private readonly CRLF2 = '\n\n'
  private readonly br2 = '<br/><br/>'

  public async merge() {
    log.log(lang.transl('_合并系列小说'))
    toast.show(lang.transl('_开始抓取'), {
      position: 'center',
    })
    EVT.fire('closeCenterPanel')

    log.log(lang.transl('_获取小说列表'))
    await this.getIdList()
    await this.getNovelData()

    // 获取这个系列的设定资料
    if (settings.saveNovelMeta) {
      log.log(lang.transl('_获取设定资料'))
      const data = await getNovelGlossarys.getGlossarys(this.seriesId)
      this.seriesGlossary = getNovelGlossarys.storeGlossaryText(data)
    }

    // 获取这个系列本身的详细数据
    log.log(lang.transl('_获取系列数据'))
    const seriesDataJSON = await API.getNovelSeriesData(this.seriesId)
    const seriesData = seriesDataJSON.body
    this.userName = Tools.replaceEPUBText(
      Utils.replaceUnsafeStr(seriesData.userName)
    )
    this.seriesTitle = Tools.replaceEPUBTitle(
      Utils.replaceUnsafeStr(seriesData.title)
    )
    this.seriesCaption = Utils.htmlToText(Utils.htmlDecode(seriesData.caption))
    this.seriesTags = seriesData.tags
    this.seriesUpdateDate = DateFormat.format(seriesData.updateDate)

    // 生成小说文件并下载
    let file: Blob | null = null
    const novelName = `${this.seriesTitle}-user_${this.userName}-seriesId_${this.seriesId}-tags_${seriesData.tags}.${settings.novelSaveAs}`
    if (settings.novelSaveAs === 'txt') {
      file = await this.mergeTXT(novelName)
    } else {
      file = await this.mergeEPUB(seriesData)
    }

    // 下载系列小说的封面图片，保存到单独的文件
    const coverUrl = seriesData.cover.urls.original
    if (settings.downloadNovelCoverImage && coverUrl) {
      this.logDownloadSeriesCover()
      await downloadNovelCover.download(coverUrl, novelName, 'mergeNovel')
    }

    const url = URL.createObjectURL(file)
    Utils.downloadFile(url, Utils.replaceUnsafeStr(novelName))

    EVT.fire('downloadComplete')
    log.success(lang.transl('_下载完毕'), 2)

    store.reset()
  }

  /** 获取这个系列里所有小说的 id */
  private async getIdList(): Promise<void> {
    const seriesData = await API.getNovelSeriesContent(
      this.seriesId,
      this.limit,
      this.last,
      'asc'
    )

    const list = seriesData.body.page.seriesContents
    list.forEach((item) => {
      this.novelIdList.push(item.id)
    })

    this.last += list.length

    // 如果这一次返回的作品数量达到了每批限制，可能这次没有请求完，继续请求后续的数据
    if (list.length === this.limit) {
      return this.getIdList()
    }
    // 获取完毕
  }

  /** 获取所有小说数据，然后储存必须的数据 */
  private async getNovelData() {
    const total = this.novelIdList.length
    let count = 0

    for (const id of this.novelIdList) {
      count++
      log.log(
        lang.transl('_获取小说数据进度', `${count} / ${total}`),
        1,
        false,
        'getNovelDataProgress' + this.seriesId
      )

      const data = await API.getNovelData(id)
      const novelData: NovelData = {
        id: data.body.id,
        no: data.body.seriesNavData!.order,
        updateDate: DateFormat.format(data.body.uploadDate),
        title: Utils.replaceUnsafeStr(data.body.title),
        tags: Tools.extractTags(data),
        description: Utils.htmlToText(Utils.htmlDecode(data.body.description)),
        content: Tools.replaceNovelContentFlag(data.body.content),
        coverUrl: data.body.coverUrl,
        embeddedImages: Tools.extractEmbeddedImages(data),
      }
      this.allNovelData.push(novelData)
    }

    // 按照小说的序号进行升序排列
    this.allNovelData.sort(Utils.sortByProperty('no', 'asc'))
  }

  private async mergeTXT(novelName: string): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 保存为 txt 格式时，在这里下载小说内嵌的图片
      for (const data of this.allNovelData) {
        await downloadNovelEmbeddedImage.TXT(
          data.id,
          data.title,
          data.content,
          data.embeddedImages,
          novelName,
          'mergeNovel'
        )
      }

      // 合并文本内容
      const text: string[] = []

      // 添加系列的元数据
      if (settings.saveNovelMeta) {
        const a: string[] = []
        const CRLF_2 = this.CRLF2
        // 系列标题
        a.push(this.seriesTitle)
        a.push(CRLF_2)
        // 作者
        a.push(this.userName)
        a.push(CRLF_2)
        // 系列网址
        const link = `https://www.pixiv.net/novel/series/${this.seriesId}`
        a.push(link)
        a.push(CRLF_2)
        // 更新日期
        a.push(lang.transl('_更新日期') + ': ' + this.seriesUpdateDate)
        a.push(CRLF_2)
        // 系列 tags
        if (this.seriesTags.length > 0) {
          const tags = this.seriesTags.map((tag) => `#${tag}`).join(', ')
          a.push(tags)
          a.push(CRLF_2)
        }
        // 系列简介
        if (this.seriesCaption) {
          a.push(lang.transl('_系列简介') + ': ')
          a.push(CRLF_2)
          a.push(this.seriesCaption)
          a.push(CRLF_2)
        }
        // 设定资料
        if (this.seriesGlossary) {
          a.push(lang.transl('_设定资料') + ': ')
          a.push(CRLF_2)
          a.push(Utils.htmlToText(Utils.htmlDecode(this.seriesGlossary)))
          // seriesGlossary 结尾有两个\n，这里再添加一个以增大空白区域，和其他部分做出区分
          a.push(this.CRLF)
        }
        a.push(`----- ${lang.transl('_系列小说的元数据部分结束')} -----`)
        a.push(this.CRLF.repeat(3))

        // 合并
        text.push(a.join(''))
      }

      // 添加每篇小说的内容
      for (const data of this.allNovelData) {
        // 添加章节名（标题）
        text.push(`${this.chapterNo(data.no)} ${data.title}`)
        text.push(this.CRLF2)
        // 添加小说的元数据，内容包含：
        // url 小说的 URL
        // date 小说的更新日期
        // tags 小说的标签列表
        // description 小说的简介
        if (settings.saveNovelMeta) {
          const url = `https://www.pixiv.net/novel/show.php?id=${data.id}`
          text.push(url)
          text.push(this.CRLF2)
          text.push(lang.transl('_更新日期') + ': ' + data.updateDate)
          text.push(this.CRLF2)
          const tags = `${data.tags.map((tag) => `#${tag}`).join(this.CRLF)}`
          text.push(tags)
          text.push(this.CRLF2)
          text.push(data.description)
          text.push(this.CRLF2)
          text.push(`----- ${lang.transl('_下面是正文')} -----`)
          text.push(this.CRLF2)
        }
        // 添加正文
        // 替换换行标签，移除 html 标签
        text.push(
          data.content.replace(/<br \/>/g, this.CRLF).replace(/<\/?.+?>/g, '')
        )
        // 在正文结尾添加换行标记，使得不同章节之间区分开来
        text.push(this.CRLF.repeat(4))
      }

      const blob = new Blob(text, {
        type: 'text/plain',
      })
      return resolve(blob)
    })
  }

  private mergeEPUB(seriesData: NovelSeriesData['body']): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const link = `https://www.pixiv.net/novel/series/${this.seriesId}`
      let description = this.handleEPUBDescription(this.seriesCaption)

      // 现在生成的 EPUB 小说里有个“信息”页面，会显示如下数据（就是在下面的 jepub.init 里定义的）：
      // title 系列标题
      // author 作者
      // publisher 系列小说的 URL
      // tags 系列小说的标签列表
      // description 系列小说的简介

      // 元数据里不属于以上分类的，都放到 description 里即可，会在信息页面里显示出来
      if (settings.saveNovelMeta) {
        const otherMeta: string[] = []
        // 添加 date
        otherMeta.push(`${lang.transl('_更新日期')}: ${this.seriesUpdateDate}`)
        otherMeta.push(this.br2)
        // 添加简介
        if (description) {
          console.log(description)
          otherMeta.push(lang.transl('_系列简介') + ': ')
          otherMeta.push(this.br2)
          otherMeta.push(description)
          otherMeta.push(this.br2)
        }
        // 添加设定资料
        if (this.seriesGlossary) {
          otherMeta.push(lang.transl('_设定资料') + ': ')
          otherMeta.push(this.br2)
          otherMeta.push(this.handleEPUBDescription(this.seriesGlossary))
          otherMeta.push(this.br2)
        }
        description = otherMeta.join('')
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
        title: this.seriesTitle,
        author: this.userName,
        publisher: link,
        tags: this.seriesTags,
        description: description,
      })

      jepub.uuid(link)
      jepub.date(new Date(this.seriesUpdateDate))

      // 添加这个系列的封面图片到 epub 文件里
      const coverUrl = seriesData.cover.urls.original
      if (settings.downloadNovelCoverImage && coverUrl) {
        this.logDownloadSeriesCover()
        const cover = await downloadNovelCover.getCover(coverUrl, 'arrayBuffer')
        if (cover) {
          jepub.cover(Config.isFirefox ? Utils.copyArrayBuffer(cover) : cover)
        }
      }

      // 循环添加小说内容
      for (const data of this.allNovelData) {
        let content = Tools.replaceEPUBTextWithP(data.content)
        const novelId = data.id

        // 添加每篇小说的封面图片
        let coverHtml = ''
        if (settings.downloadNovelCoverImage && data.coverUrl) {
          log.log(
            lang.transl(
              '_下载小说的封面图片的提示',
              Tools.createWorkLink(novelId, data.title, false)
            ),
            1,
            false,
            'downloadNovelCover' + novelId
          )
          // 下载器使用的 jepub.js 库只能为整个 epub 文件添加一个封面图片，不能为单个章节设置封面图片
          // 所以需要手动添加图片，然后添加图片对应的 html 代码
          const cover = await downloadNovelCover.getCover(
            data.coverUrl,
            'arrayBuffer'
          )
          if (cover) {
            const imageId = 'cover-' + novelId
            jepub.image(
              Config.isFirefox ? Utils.copyArrayBuffer(cover) : cover,
              imageId
            )
            coverHtml = `<p><img src="assets/${imageId}.jpg" /></p>`
          }
        }

        // 添加每篇小说的元数据，内容包含：
        // url 小说的 URL
        // date 小说的更新日期
        // tags 小说的标签列表
        // description 小说的简介
        let metaHtml = ''
        if (settings.saveNovelMeta) {
          const url = `https://www.pixiv.net/novel/show.php?id=${data.id}`
          const link = `<p><a href="${url}" target="_blank">${url}</a></p>`
          const date = `<p>${lang.transl('_更新日期') + ': ' + data.updateDate}</p>`
          const tags = `<p>${data.tags.map((tag) => `#${tag}`).join('<br/>')}</p>`

          const meta = `${link}${date}${tags}${Tools.replaceEPUBText(data.description)}`
          metaHtml =
            meta +
            `<br/><br/>----- ${lang.transl('_下面是正文')} -----<br/><br/>`
        }

        // 组合封面图片和简介，使封面图片位于所有文字内容之前
        content = coverHtml + metaHtml + content

        // 添加小说里的图片
        content = await downloadNovelEmbeddedImage.EPUB(
          novelId,
          data.title,
          content,
          data.embeddedImages,
          jepub
        )

        const title = Tools.replaceEPUBTitle(Utils.replaceUnsafeStr(data.title))

        // 添加正文，这会在 EPUB 里生成一个新的章节
        // 实际上会生成一个对应的 html 文件，如 OEBPS/page-0.html
        jepub.add(`${this.chapterNo(data.no)} ${title}`, content)
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

  private logDownloadSeriesCover() {
    const link = `<a href="https://www.pixiv.net/novel/series/${this.seriesId}" target="_blank">${this.seriesTitle}</a>`
    log.log(
      lang.transl('_下载系列小说的封面图片', link),
      1,
      false,
      'downloadSeriesNovelCover' + this.seriesId
    )
  }
}

export { MergeNovel }
