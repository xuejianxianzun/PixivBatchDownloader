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
import { pageType } from '../PageType'
import { cacheWorkData } from '../store/CacheWorkData'
import { setTimeoutWorker } from '../SetTimeoutWorker'
import { mergeNovelFileName } from './MergeNovelFileName'
import { SendDownload } from './SendDownload'
import { msgBox } from '../MsgBox'
import { filter } from '../filter/Filter'

declare const jEpub: any

/** 储存每个小说的必要数据。这是从完整数据里提取的部分摘要数据 */
interface NovelSummary {
  id: string
  /**小说在系列中的排序。通常是从 1 开始的数字，但也有例外（从大于 1 的数字开始） */
  // 例如：https://www.pixiv.net/novel/series/649007
  // 它的两篇小说虽然在系列页面显示的是正常的 #1、#2（因为只有这两篇小说）
  // 但是小说页面里显示的却是 #9 和 #10
  // 小说数据里的 order 确实是 9 和 10，下载器以小说数据里的为准
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
  private seriesId = ''
  private seriesTitle = ''
  private seriesUpdateDate = ''
  private seriesCaption = ''
  private seriesGlossary = ''
  private seriesTags: string[] = []
  private userName = ''
  /** 合并后的小说文件的完整文件名。一开始是空字符串，在合并过程中才会填充实际的值 */
  // 注意：这个变量里的 {part} 总是空字符串（也就是默认合并后的文件不会分割成多个）
  // 如果需要分割成多个文件，那么在分割时生成新的文件名在局部使用即可
  private novelName = ''

  private seriesData: NovelSeriesData | null = null
  private novelIdList: string[] = []
  private allNovelData: NovelSummary[] = []
  private readonly limit = 30
  private last = 0
  private slowMode = false

  private readonly CRLF = '\n' // 小说的换行符
  private readonly CRLF2 = '\n\n'
  private readonly br2 = '<br/><br/>'

  // 由于每个系列里都可能含有多个小说和图片，所以下载器可能会发送很多请求。为了避免触发 Pixiv 的警告，下载器在合并时总是会添加间隔时间，以降低发送请求的频率。

  /** 抓取时的间隔时间，最低为 2400 ms。这不会触发 429 错误 */
  // 我尝试过更低的延迟时间，例如 2000, 没有触发 429 错误，但依然被警告了，所以增加到 2400
  private get crawlInterval() {
    return Math.max(2400, settings.slowCrawlDealy)
  }
  /** 下载文件时的间隔时间，最低为 2000 ms */
  private get downloadInterval() {
    return Math.max(2000, settings.downloadInterval)
  }

  /**每次请求之间等待一段时间 */
  private async sleep(time: number) {
    if (this.slowMode) {
      return new Promise((res) => setTimeoutWorker.set(res, time))
    }
  }

  /** 合并系列小说。返回值是合并完成后所包含的小说数量（不包含 404 的小说） */
  public async merge(
    seriesId: string | number,
    seriesTitle?: string,
    slowMode: boolean = false
  ): Promise<number> {
    if (!seriesId) {
      toast.error(`seriesId is undefined`)
      return 0
    }

    this.seriesId = seriesId.toString()
    this.seriesTitle = seriesTitle || ''
    this.slowMode = slowMode
    const link = `<a href="https://www.pixiv.net/novel/series/${this.seriesId}" target="_blank">${this.seriesTitle || this.seriesId}</a>`

    if (seriesTitle) {
      const check = await filter.check({ seriesTitle: seriesTitle })
      if (!check) {
        log.warning(`✅${lang.transl('_跳过合并系列小说')} ${link}`)
        return 0
      }
    }

    log.log(`📚${lang.transl('_合并系列小说')} ${link}`)

    if (settings.novelSaveAs === 'txt') {
      // 如果用户选择的保存格式是 txt，显示提示。因为很多小说阅读器都无法识别 txt 里的章节标记
      log.warning(
        lang.transl('_合并小说时提示用户使用EPUB格式'),
        1,
        false,
        'mergeNovelRecommendEPUB'
      )
    }

    // 在系列小说页面里执行时，关闭设置面板
    // 在其他页面类型里不关闭设置面板，因为在其他页面里可能需要合并多个系列小说，会导致多次关闭设置面板。这可能会影响用户正常使用设置面板
    if (pageType.type === pageType.list.NovelSeries) {
      EVT.fire('closeCenterPanel')
    }

    log.log(lang.transl('_获取小说列表'))
    // 只在第一个发送网络请求的步骤里使用 try catch 即可
    // 因为最常见的错误是 404, 如果遇到 404, 这一步就可以检查出来，不必向下执行了
    try {
      await this.sleep(this.crawlInterval)
      await this.getNovelIds()
    } catch (error) {
      log.error(`❌${lang.transl('_发生错误取消合并这个系列小说')} ${link}`)
      return 0
    }

    if (this.novelIdList.length === 0) {
      log.warning(`✅${lang.transl('_跳过合并系列小说')} ${link}`)
      return 0
    }

    // 在获取每篇小说的数据之前，检查是否需要应用抓取间隔时间
    if (
      !this.slowMode &&
      this.novelIdList.length > settings.slowCrawlOnWorksNumber
    ) {
      this.slowMode = true
      log.warning(lang.transl('_慢速抓取'))
    }

    await this.getAllNovelData()

    // 获取这个系列的设定资料
    if (settings.saveNovelMeta) {
      log.log(lang.transl('_获取设定资料'))
      const data = await getNovelGlossarys.getGlossarys(
        this.seriesId,
        this.crawlInterval
      )
      this.seriesGlossary = getNovelGlossarys.storeGlossaryText(data)
    }

    // 获取这个系列本身的详细数据
    await this.sleep(this.crawlInterval)
    log.log(lang.transl('_获取系列数据'))
    this.seriesData = await API.getNovelSeriesData(this.seriesId)
    const body = this.seriesData.body
    this.userName = Tools.replaceEPUBText(Utils.replaceUnsafeStr(body.userName))
    this.seriesTitle = Tools.replaceEPUBTitle(
      Utils.replaceUnsafeStr(body.title)
    )
    this.seriesCaption = Utils.htmlToText(Utils.htmlDecode(body.caption))
    this.seriesTags = body.tags
    this.seriesUpdateDate = DateFormat.format(body.updateDate)

    // 进入合并流程
    this.novelName = mergeNovelFileName.getName(this.seriesData)
    // msgBox.show(this.novelName +'<br>' + settings.seriesNovelNameRule)
    // await Utils.sleep(3600000)
    if (settings.novelSaveAs === 'txt') {
      await this.mergeTXT()
    } else {
      await this.mergeEPUB(body)
    }

    // 下载系列小说的封面图片，保存到单独的文件
    const coverUrl = body.cover.urls.original
    if (settings.downloadNovelCoverImage && coverUrl) {
      this.logDownloadSeriesCover()
      // 在 mergeEPUB 里会先加载一遍封面图片，所以这里有可能会从缓存加载，就不需要添加等待时间
      // 只有当保存格式为 txt 时，才需要在这里再下载一次封面图片
      if (settings.novelSaveAs === 'txt') {
        await this.sleep(this.downloadInterval)
      }
      await downloadNovelCover.download(coverUrl, this.novelName)
    }

    // 合并完成
    log.success(`✅${lang.transl('_已合并系列小说')} ${link}`)

    // 在系列小说页面里执行时，由于只有一个系列，所以合并后显示轻提示
    if (pageType.type === pageType.list.NovelSeries) {
      toast.success(`${lang.transl('_已合并系列小说')}`)
    }

    // 清除数据以减少内存占用
    window.setTimeout(() => {
      this.reset()
    }, 1000)

    // 返回该系列里的小说数量
    const total = this.allNovelData.length
    return total
  }

  private async mergeTXT() {
    // 保存为 txt 格式时，在这里下载小说内嵌的图片
    for (const data of this.allNovelData) {
      // 虽然 downloadNovelEmbeddedImage 里会使用“下载间隔”设置，但是在自动合并系列小说时，抓取结果的数量可能比较少，没有达到生效条件，所以实际上不会等待
      // 因此这里需要单独添加等待时间。考虑到 Pixiv 对下载文件的限制没有调用 API 那么严格，所以间隔时间设置为 1 秒应该没问题
      await downloadNovelEmbeddedImage.TXT(
        data.id,
        data.title,
        data.content,
        data.embeddedImages,
        this.novelName,
        this.downloadInterval
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
      a.push(`${lang.transl('_作者')}: ` + this.userName)
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
      // 添加章节编号
      // 让编号独占一行。如果编号和标题在一行里，会导致无法识别目录
      text.push(`${this.chapterNo(data.no)}`)
      // 我测试了 Android 上的静读天下（Moon+ Reader），对于 txt 小说，它可以识别中文的“第x章”这样的章节名
      // 但如果使用英语章节名如 Chapter 1 就识别不出来，我尝试了各种格式都不行，放弃了
      text.push(this.CRLF2)
      text.push(data.title)
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
    await SendDownload.noReply(blob, this.novelName)
  }

  // 生成的 EPUB 文件在这个方法里自行保存
  private async mergeEPUB(body: NovelSeriesData['body']) {
    // 生成一些在每个文件里固定不变的数据
    const link = `https://www.pixiv.net/novel/series/${this.seriesId}`
    const date = new Date(this.seriesUpdateDate)
    let description = this.handleEPUBDescription(this.seriesCaption)

    // 生成元数据
    // EPUB 小说里有个“信息”页面，会显示如下数据（就是在下面的 jepub.init 里定义的）：
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

    // 每次创建 EPUB 文件时，从第几篇小说开始添加
    let index = 0

    // 把创建 EPUB 的步骤放到一个函数里，方便在需要分割文件时多次调用
    const generateEPUB = async () => {
      this.pushSizeLog()

      // 记录 description 的体积，其实文本的体积（包括简介、正文）通常都很小，记录与否都影响不大
      // 在一次测试里，700 个系列小说里只有 1 篇的正文体积超过了 10 MiB
      // 另外：使用 length 并不准确，因为 1 个 length 的实际字节数可能是 1 - 4（ASCII、变音标记、中文、emoji）
      // 如果文本不是 ASCII 字符，那么 length 是小于实际的文件体积的
      // 追求准确的话应该使用 TextEncoder 编码然后获取 length，但这里影响不大，就无所谓了
      this.addSize(description.length)

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
      jepub.date(date)

      // 添加这个系列的封面图片到 EPUB 文件里
      const coverUrl = body.cover.urls.original
      if (settings.downloadNovelCoverImage && coverUrl) {
        await this.sleep(this.downloadInterval)
        this.logDownloadSeriesCover()
        const cover = await downloadNovelCover.getCover(coverUrl, 'arrayBuffer')
        if (cover) {
          this.addSize(cover.byteLength)
          jepub.cover(Config.isFirefox ? Utils.copyArrayBuffer(cover) : cover)
        }
      }

      // 循环添加小说内容
      for (; index < this.allNovelData.length; index++) {
        const data = this.allNovelData[index]
        const novelId = data.id

        // 添加每篇小说的封面图片
        let coverHtml = ''
        if (settings.downloadNovelCoverImage && data.coverUrl) {
          await this.sleep(this.downloadInterval)
          log.log(
            lang.transl(
              '_下载小说的封面图片的提示',
              Tools.createWorkLink(novelId, data.title, 'novel')
            )
          )
          // 下载器使用的 jepub.js 库只能为整个 EPUB 文件添加一个封面图片，不能为单个章节设置封面图片
          // 所以需要手动添加图片，然后添加图片对应的 html 代码
          const cover = await downloadNovelCover.getCover(
            data.coverUrl,
            'arrayBuffer'
          )
          if (cover) {
            this.addSize(cover.byteLength)
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
        let content = Tools.replaceEPUBTextWithP(data.content)
        content = coverHtml + metaHtml + content

        // 添加小说里的图片
        const value = await downloadNovelEmbeddedImage.EPUB(
          novelId,
          data.title,
          content,
          data.embeddedImages,
          jepub,
          this.downloadInterval
        )
        content = value.content

        // 添加正文，这会在 EPUB 里生成一个新的章节
        // 实际上会生成一个对应的 html 文件，如 OEBPS/page-0.html
        const title = Tools.replaceEPUBTitle(Utils.replaceUnsafeStr(data.title))
        jepub.add(`${this.chapterNo(data.no)} ${title}`, content)

        // 如果添加了所有小说
        if (index === this.allNovelData.length - 1) {
          await this.saveEPUBFile(jepub, true)
          return
        } else {
          // 如果还有未添加的小说
          // 检查文件体积
          this.addSize(content.length)
          this.addSize(value.size)
          const limit = this.checkSizeLimit()
          // 如果文件体积达到限制，就保存这个 EPUB 文件
          if (limit) {
            await this.saveEPUBFile(jepub)
            // 生成新的 EPUB 文件
            index++
            return generateEPUB()
          }
        }
        // 如果不满足保存 EPUB 文件的条件，就会继续循环
      }
    }

    await generateEPUB()
  }

  /** 获取这个系列里所有小说的 id */
  private async getNovelIds(): Promise<void> {
    const seriesContents = await API.getNovelSeriesContent(
      this.seriesId,
      this.limit,
      this.last,
      'asc'
    )

    const list = seriesContents.body.page.seriesContents
    for (const item of list) {
      const check = await filter.check({
        id: item.id,
        aiType: item.aiType,
        xRestrict: item.xRestrict,
        tags: item.tags,
        title: item.title,
        seriesTitle: this.seriesTitle || '',
        userId: item.userId,
        bookmarkData: item.bookmarkData,
        bookmarkCount: item.bookmarkCount,
        createDate: item.createDate,
      })
      if (check) {
        this.novelIdList.push(item.id)
      } else {
        const order_title = `#${item.series.contentOrder} ${item.title}`
        const link = Tools.createWorkLink(item.id, order_title, 'novel')
        log.warning(lang.transl('_排除小说') + ': ' + link)
      }
    }

    this.last += list.length

    // 如果这一次返回的作品数量达到了每批限制，可能这次没有请求完，继续请求后续的数据
    if (list.length === this.limit) {
      return this.getNovelIds()
    } else {
      // 获取完毕
      if (this.novelIdList.length === 0) {
        log.warning(lang.transl('_这个系列里的所有小说都被排除了'))
      }
    }
  }

  /** 获取所有小说数据，然后储存必须的数据 */
  private async getAllNovelData() {
    const total = this.novelIdList.length
    let count = 0

    for (const id of this.novelIdList) {
      // 自动合并系列小说时，可能会连续不断的合并多个系列，这些系列可能包含非常多的小说，所以需要添加等待时间，以减小出现 429 错误的概率
      // 另外获取设定资料时也有可能需要发送多个请求，但并不总是需要多次请求，所以获取设定资料时没有添加等待时间
      count++
      log.log(
        lang.transl('_获取小说数据进度', `${count} / ${total}`),
        1,
        false,
        'getNovelDataProgress' + this.seriesId
      )

      // 优先从缓存中获取数据
      let data = cacheWorkData.get(id, 'novel')
      if (!data) {
        try {
          // 发送请求
          await this.sleep(this.crawlInterval)
          data = await API.getNovelData(id)
          cacheWorkData.set(data)
        } catch (error: Error | any) {
          // 请求小说的数据出错时跳过它，不重试（通常是 404 错误，没有必要重试）
          log.error(lang.transl('_跳过这个小说'))
          continue
        }
      }

      const tags: string[] = Tools.extractTags(data)

      // 添加“原创”对应的标签
      if (data.body.isOriginal) {
        const originalMark = Tools.getOriginalMark()
        Tools.unshiftTag(tags, originalMark)
      }

      // 判断是不是 AI 生成的作品
      let aiType = data.body.aiType
      if (aiType !== 2) {
        if (Tools.checkAIFromTags(tags)) {
          aiType = 2
        }
      }

      // 添加“AI生成”对应的标签
      const aiMarkString = Tools.getAIGeneratedMark(aiType)
      if (aiMarkString) {
        Tools.unshiftTag(tags, aiMarkString)
      }

      // 应用标签过滤器
      // 虽然这里也能检查其他过滤条件，但没有必要，因为前面已经检查过了
      const check = await filter.check({
        xRestrict: data.body.xRestrict,
        tags,
      })
      const novelId = data.body.id
      const title = data.body.title
      const order = data.body.seriesNavData!.order
      if (check) {
        const novelData: NovelSummary = {
          id: novelId,
          no: order,
          updateDate: DateFormat.format(data.body.uploadDate),
          title: Utils.replaceUnsafeStr(title),
          tags,
          description: Utils.htmlToText(
            Utils.htmlDecode(data.body.description)
          ),
          content: Tools.replaceNovelContentFlag(data.body.content),
          coverUrl: data.body.coverUrl,
          embeddedImages: Tools.extractEmbeddedImages(data),
        }
        this.allNovelData.push(novelData)
      } else {
        const order_title = `#${order} ${title}`
        const link = Tools.createWorkLink(novelId, order_title, 'novel')
        log.warning(lang.transl('_排除小说') + ': ' + link)
      }
    }

    // 获取了所有小说的数据
    log.persistentRefresh('getNovelDataProgress' + this.seriesId)

    // 按照小说的序号进行升序排列
    this.allNovelData.sort(Utils.sortByProperty('no', 'asc'))
  }

  /** 限制单个 EPUB 文件的大小 */
  // 每当添加完一篇小说的文件，就检查这个 EPUB 文件的体积是否超出了限制，如果超出就保存它，然后新建一个 EPUB 文件继续添加
  // 这样最终会生成多个 EPUB 文件，文件名后面会添加 part1, part2 之类的后缀
  // 目前体积限制为 200 MiB，这主要是担心手机上的阅读器打开大体积的 EPUB 文件时可能会出现性能问题
  // 实际可用的体积上限取决于 jszip.min.js 的限制，通常文件体积不能超过 2 GiB
  // 在之前的几次测试里，650 个 EPUB 文件（未分割）里只有 7 个文件的体积超过了 100 MiB，其中只有 1 个超过了 200 MiB
  // 所以绝大多数的系列小说都不需要分割。之所以添加分割功能，是因为遇到了一个体积非常大的系列小说：
  // https://www.pixiv.net/novel/series/7708974
  // 含有 1150 张插画，这些插画的总体积高达 3.96 GB。之前没有分割，会因为体积过大导致 jszip 报错，进而导致程序卡住
  // 虽然这么大的系列小说很罕见，但不得不处理。要成功下载它就必须分割成多个文件。
  // 分割之后它生成了 28 个 EPUB 文件，总体积 3.74 GB（因为 jszip 压缩了文件，所以体积比未压缩时小。解压后是完全相同的）
  // 注意：检查体积时是以单篇小说为单位的，所以以下情况会生成超过 100 MiB 的 EPUB 文件：
  // 1. 单篇小说的体积已经超出限制（例如 200 MiB）
  // 2. 添加了多篇小说时，最后一篇导致总体积超出限制。例如 90 + 60，或者 30 + 30 + 50 的情况
  // 我在自己的手机上测试打开 180 MB 的单个 EPUB 文件，阅读正常，里面的插画也能正常显示。
  private readonly epubSizeLimit = 200 * 1024 * 1024

  /** 保存每个部分的体积日志。只有当保存格式是 EPUB 时才会用到 */
  // 一开始会添加第一项，如果体积达到了限制才会添加下一项
  private sizeLog: {
    /** 这是第几个文件，从 0 开始 */
    part: number
    /** 这个文件里的文件总体积 */
    size: number
    /** 这个部分是否正在被使用。有多个部分时，只有最后一项是使用中的 */
    inUse: boolean
  }[] = []

  /** 每次创建 EPUB 文件时，就添加一条体积的记录 */
  private pushSizeLog() {
    // 把之前已有的记录标记为不使用
    this.sizeLog.forEach((item) => (item.inUse = false))
    // 添加新的记录
    this.sizeLog.push({
      part: this.sizeLog.length,
      size: 0,
      inUse: true,
    })
  }

  private addSize(size: number) {
    const current = this.sizeLog.find((item) => item.inUse)
    if (current) {
      current.size += size
    }
  }

  private checkSizeLimit(): boolean {
    const current = this.sizeLog.find((item) => item.inUse)
    if (current) {
      return current.size >= this.epubSizeLimit
    }
    return false
  }

  private async saveEPUBFile(jepub: any, complete: boolean = false) {
    let name = this.novelName

    // 判断是否需要添加 part 标记
    let addPartFlag = true
    // 如果已经添加了所有小说，并且只有一条 size 记录，说明这个 EPUB 文件里包含了所有小说，所以无须添加 part 标记
    if (complete && this.sizeLog.length === 1) {
      addPartFlag = false
    }

    // 如果需要添加 part 编号
    if (addPartFlag) {
      let part = 0
      const current = this.sizeLog.find((item) => item.inUse)
      if (current) {
        part = current.part
      }
      // 为这个分割的文件生成新的文件名（添加了 part 编号）
      name = mergeNovelFileName.getName(this.seriesData!, part + 1)
    }

    // 保存文件
    // 如果这个小说需要分割成多个文件，那么把文件名冲突时的处理方式改为由浏览器自动添加编号
    // 这是因为当文件名太长而被截断时，如果 {part} 位于文件名末尾部分，可能会被截断
    // 这可能会导致出现重名文件。此时把冲突方式改为 uniquify，以免覆盖同名文件
    let conflictAction: 'uniquify' | undefined = addPartFlag
      ? 'uniquify'
      : undefined
    const blob = await jepub.generate('blob', (metadata: any) => {})
    await SendDownload.noReply(blob, name, conflictAction)

    // 当这个系列里的所有小说都下载完毕后，如果它被分割成了多个文件，则显示提示日志
    if (complete && this.sizeLog.length > 1) {
      log.warning(
        lang.transl(
          '_由于这个系列小说里的图片体积很大所以分割成了x个文件',
          this.sizeLog.length.toString()
        )
      )
    }
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
  // 在 TXT 格式的小说里添加章节编号，可以使小说阅读软件能够识别章节、显示目录，提高阅读体验
  // 对于 EPUB 格式的小说，由于其内部自带分章结构，所以并不依赖这里的章节编号
  private chapterNo(number: number | string) {
    // 对于中文区，使用“第N章”。这样最容易被国内的小说阅读软件识别出来
    if (lang.type === 'zh-cn' || lang.type === 'zh-tw' || lang.type === 'ja') {
      return `第${number}章`
    } else {
      // 对于其他地区，使用 `Chapter N`
      return `Chapter ${number}`
    }
    // 我还尝试过使用 #1 这样的编号，但是阅读器对这种编号的识别情况不够好
  }

  private logDownloadSeriesCover() {
    const link = `<a href="https://www.pixiv.net/novel/series/${this.seriesId}" target="_blank">${this.seriesTitle}</a>`
    log.log(lang.transl('_下载系列小说的封面图片', link))
  }

  private reset() {
    this.seriesData = null
    this.allNovelData = []
    this.novelIdList = []
    this.seriesTags = []
    this.seriesId = ''
    this.seriesTitle = ''
    this.novelName = ''
  }
}

export { MergeNovel }
