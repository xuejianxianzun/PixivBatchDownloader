import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { settings } from '../setting/Settings'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { downloadNovelCover } from '../download/DownloadNovelCover'
import { downloadNovelEmbeddedImage } from './DownloadNovelEmbeddedImage'
import { downloadNovelGlossaryImage } from './DownloadNovelGlossaryImage'
import { replaceNovelWords } from './ReplaceNovelWords'
import { log } from '../Log'
import { API } from '../API'
import { GlossaryCover, NovelData, NovelSeriesData } from '../crawl/CrawlResult'
import { Config } from '../Config'
import { toast } from '../Toast'
import { getNovelGlossarys } from '../crawlNovelPage/GetNovelGlossarys'
import { DateFormat } from '../utils/DateFormat'
import { pageType } from '../PageType'
import { cacheWorkData } from '../store/CacheWorkData'
import { mergeNovelFileName } from './MergeNovelFileName'
import { SendDownload } from './SendDownload'
import { filter } from '../filter/Filter'
import { states } from '../store/States'
import { downloadRecord, DownloadRecordType } from './DownloadRecord'
import { selectWork } from '../SelectWork'

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
  /** 发布时间，完整的字符串，例如 "2026-03-31T03:16:29+00:00" */
  updateDate: string
  /** 较短的发布时间，使用“日期和时间格式”格式化后的字符串，默认只有年月日，没有 T 后面的部分 */
  updateDateShort: string
  tags: string[]
  description: string
  content: string
  coverUrl: string
  embeddedImages: null | {
    [key: string]: string
  }
}

type GlossaryImageItem = GlossaryCover & {
  glossaryId: string
  glossaryTitle: string
}

type EpisodeCoverRecord = {
  id: string
  url: string
  size?: number
}

// 合并系列小说，并生成 TXT 或 EPUB 文件进行保存
// 文档：notes\MergeNovel 工作流程说明.md
class MergeNovel {
  private seriesId = ''
  private seriesTitle = ''
  private seriesUpdateDate = ''
  private seriesCaption = ''
  private seriesGlossaryText = ''
  private glossaryImages: GlossaryImageItem[] = []
  private seriesTags: string[] = []
  private userName = ''
  /** 合并后的小说文件的完整文件名。一开始是空字符串，在合并过程中才会填充实际的值 */
  // 注意：这个变量里的 {part} 总是空字符串（也就是默认合并后的文件不会分割成多个）
  // 如果需要分割成多个文件，那么在分割时生成新的文件名在局部使用即可
  private novelName = ''

  private seriesData: NovelSeriesData | null = null
  /** 在获取系列中的小说 ID 列表时，保存通过了过滤器检查的小说 ID */
  private novelIdListFiltered: string[] = []
  /** 在获取系列中的小说 ID 列表时，保存所有小说的 ID 列表（不应用过滤器） */
  private novelIdListUnfiltered: string[] = []
  /** 在获取系列中的小说 ID 列表完毕之后，保存最终用于合并的小说 ID 列表 */
  private novelIdList: string[] = []
  private allNovelData: NovelSummary[] = []
  private readonly limit = 30
  private last = 0
  private slowMode = false

  private readonly CRLF = '\n' // 小说的换行符
  private readonly CRLF2 = '\n\n'
  private readonly br = '<br/>'
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
      return Utils.sleep(time)
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

    const link = this.initMergeContext(seriesId, seriesTitle, slowMode)
    const canMerge = await this.checkCanMergeSeries(seriesTitle, link)
    if (!canMerge) {
      return 0
    }

    this.logMergeStart(link)
    this.closeCenterPanelOnSeriesPage()

    const gotNovelIds = await this.tryGetNovelIds(link)
    if (!gotNovelIds) {
      return 0
    }

    this.enableSlowModeIfNeeded()
    await this.getAllNovelData()
    await this.loadGlossaryData(seriesId)
    const body = await this.loadSeriesData()

    this.novelName = mergeNovelFileName.getName(this.seriesData!)
    await this.mergeByFormat(body)
    await this.downloadSeriesCoverFile(body.cover.urls.original)

    this.logMergeFinished(link)
    await this.saveMergedNovelDownloadRecords()
    this.scheduleReset()
    return this.allNovelData.length
  }

  /** 初始化这次合并任务使用的上下文数据，并返回系列链接。 */
  private initMergeContext(
    seriesId: string | number,
    seriesTitle?: string,
    slowMode = false
  ) {
    this.seriesId = seriesId.toString()
    this.seriesTitle = seriesTitle || ''
    this.slowMode = slowMode
    return this.getSeriesLink()
  }

  /** 生成当前系列的 HTML 链接。 */
  private getSeriesLink() {
    return `<a href="https://www.pixiv.net/novel/series/${this.seriesId}" target="_blank">${this.seriesTitle || this.seriesId}</a>`
  }

  /** 检查这个系列是否通过了标题过滤条件。 */
  private async checkCanMergeSeries(
    seriesTitle: string | undefined,
    link: string
  ) {
    if (!seriesTitle) {
      return true
    }

    const check = await filter.check({ seriesTitle })
    if (!check) {
      log.warning(`✅${lang.transl('_跳过合并系列小说')} ${link}`)
      return false
    }

    return true
  }

  /** 输出合并开始时的提示日志。 */
  private logMergeStart(link: string) {
    log.log(`📚${lang.transl('_合并系列小说')} ${link}`)

    log.warning(
      lang.transl('_提示可以只合并部分小说'),
      'tipOnlyMergeSomeNovels'
    )

    log.warning(
      lang.transl('_提示合并系列小说时可以跳过已合并的小说'),
      'tipMergeNovelSkipMergedNovels'
    )

    // 如果用户选择的保存格式是 txt，则提示使用 EPUB 格式。这是因为很多小说阅读器都无法识别 txt 里的章节标记，所以使用 EPUB 格式是更好的选择
    if (settings.novelSaveAs === 'txt') {
      log.warning(
        lang.transl('_合并小说时提示用户使用EPUB格式'),
        'mergeNovelRecommendEPUB'
      )
    }
  }

  /** 在系列页里启动合并时关闭中间面板。 */
  private closeCenterPanelOnSeriesPage() {
    // 在系列小说页面里执行时，关闭设置面板
    // 在其他页面类型里不关闭设置面板，因为在其他页面里可能需要合并多个系列小说，会导致多次关闭设置面板。这可能会影响用户正常使用设置面板
    if (pageType.type === pageType.list.NovelSeries) {
      EVT.fire('closeCenterPanel')
    }
  }

  /** 获取系列中的小说 id 列表，并处理首个请求阶段的错误。 */
  private async tryGetNovelIds(link: string) {
    log.log(lang.transl('_获取小说列表'), 'getNovelList')
    // 只在第一个发送网络请求的步骤里使用 try catch 即可
    // 因为最常见的错误是 404, 如果遇到 404, 这一步就可以检查出来，不必向下执行了
    try {
      await this.sleep(this.crawlInterval)
      await this.getNovelIds()
    } catch (error) {
      log.error(`❌${lang.transl('_发生错误取消合并这个系列小说')} ${link}`)
      return false
    }

    if (this.novelIdListFiltered.length === 0) {
      log.warning(`✅${lang.transl('_跳过合并系列小说')} ${link}`)
      return false
    }

    return true
  }

  /** 当小说数量较多时，自动启用慢速抓取模式。 */
  private enableSlowModeIfNeeded() {
    // 在获取每篇小说的数据之前，检查是否需要应用抓取间隔时间
    if (
      !this.slowMode &&
      this.novelIdList.length > settings.slowCrawlOnWorksNumber
    ) {
      this.slowMode = true
      log.warning(lang.transl('_慢速抓取'))
    }
  }

  /** 获取系列设定资料，并提取其中的图片和文本内容。 */
  private async loadGlossaryData(seriesId: string | number) {
    // 获取这个系列的设定资料
    if (!settings.saveNovelMeta || states.quickMergeNovel) {
      return
    }

    log.log(lang.transl('_获取设定资料'), 'getNovelGlossary' + seriesId)
    const data = await getNovelGlossarys.getGlossarys(
      this.seriesId,
      this.crawlInterval
    )

    // 获取设定资料里的图片的数据
    for (const categorie of data.result) {
      for (const item of categorie.items) {
        if (item.coverImage) {
          this.glossaryImages.push({
            ...item.coverImage,
            glossaryId: item.id,
            glossaryTitle: item.name,
          })
        }
      }
    }

    // 生成设定资料的文本内容
    this.seriesGlossaryText = getNovelGlossarys.storeGlossaryText(data.result)
  }

  /** 获取系列本身的详细数据，并同步更新当前实例上的系列信息。 */
  private async loadSeriesData() {
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
    return body
  }

  /** 根据用户选择的保存格式进入 TXT 或 EPUB 合并流程。 */
  private async mergeByFormat(body: NovelSeriesData['body']) {
    if (settings.novelSaveAs === 'txt') {
      await this.mergeTXT()
    } else {
      await this.mergeEPUB(body)
    }
  }

  /** 把系列封面单独保存为图像文件。 */
  private async downloadSeriesCoverFile(coverUrl: string) {
    // 下载系列小说的封面图片，保存为单独的图像文件
    if (!settings.downloadNovelCoverImage || !coverUrl) {
      return
    }

    this.logDownloadSeriesCover()
    // 在 mergeEPUB 里会先加载一遍封面图片，所以这里有可能会从缓存加载，就不需要添加等待时间
    // 只有当保存格式为 txt 时，才需要在这里再下载一次封面图片
    if (settings.novelSaveAs === 'txt') {
      await this.sleep(this.downloadInterval)
    }
    await downloadNovelCover.download(coverUrl, this.novelName)
  }

  /** 输出合并完成后的成功日志和提示。 */
  private logMergeFinished(link: string) {
    // 合并完成
    log.success(`✅${lang.transl('_已合并系列小说')} ${link}`)

    // 在系列小说页面里执行时，由于只有一个系列，所以合并后显示轻提示
    if (pageType.type === pageType.list.NovelSeries) {
      toast.success(`${lang.transl('_已合并系列小说')}`)
    }
  }

  /** 为合并结果中的每篇小说写入下载记录。 */
  private async saveMergedNovelDownloadRecords() {
    // 为每一篇小说生成下载记录，这样以后抓取和下载时，如果启用了“不抓取下载过的作品”、“不下载重复文件”，就不会再次抓取和保存这些小说，避免了重复下载
    // PS: 在合并系列小说时，会检查“不抓取下载过的作品”来跳过存在记录的小说。但不会检查“不下载重复文件”
    // 这份记录里，小说的文件名 n 不是使用命名规则生成的，所以很可能与实际下载它时的文件名不同。这样的影响是：
    // 当用户下载单篇小说，并启用了“不下载重复文件”时，使用宽松策略可以排除它（不再下载），使用严格策略则会再次下载它（因为文件名不同）。这是符合预期的。
    // 如果用户以后单独下载了它，下载记录里的 n 会被覆盖为实际的名字
    for (const data of this.allNovelData) {
      const record: DownloadRecordType = {
        id: data.id,
        n: `${data.id}-${data.title}.${settings.novelSaveAs}`,
        d: data.updateDate,
      }
      // console.log('add download record',data.no, record)
      await downloadRecord.addRecordFromRecord(record)
    }
  }

  /** 延迟清理当前实例保存的中间数据。 */
  private scheduleReset() {
    // 清除数据以减少内存占用
    window.setTimeout(() => {
      this.reset()
    }, 1000)
  }

  /** 合并系列小说并生成 TXT 文件。 */
  private async mergeTXT() {
    await this.downloadTXTAssets()

    const text: string[] = []
    const seriesMeta = this.buildTXTSeriesMeta()
    if (seriesMeta) {
      text.push(seriesMeta)
    }

    for (const data of this.allNovelData) {
      text.push(await this.buildTXTNovelSection(data))
    }

    const blob = new Blob(text, {
      type: 'text/plain',
    })
    await SendDownload.noReply(blob, this.novelName, 'uniquify')
  }

  /** 下载 TXT 合并流程需要的内嵌图片和设定资料图片。 */
  private async downloadTXTAssets() {
    // 保存为 txt 格式时，在这里下载小说内嵌的图片
    for (const data of this.allNovelData) {
      await downloadNovelEmbeddedImage.TXT(
        data.id,
        data.title,
        data.content,
        data.embeddedImages,
        this.novelName,
        'merge novel'
      )
    }

    // 保存设定资料里的图片
    for (const item of this.glossaryImages) {
      if (item) {
        this.logDownloadGlossaryImage(item)
        await downloadNovelGlossaryImage.download(
          item.urls,
          this.novelName,
          item.novelImageId,
          this.seriesId
        )
      }
    }
  }

  /** 生成 TXT 文件开头的系列元数据文本。 */
  private buildTXTSeriesMeta() {
    if (!settings.saveNovelMeta) {
      return ''
    }

    const result: string[] = []
    const CRLF_2 = this.CRLF2

    // 系列标题
    result.push(this.seriesTitle)
    result.push(CRLF_2)
    // 作者
    result.push(`${lang.transl('_作者')}: ` + this.userName)
    result.push(CRLF_2)
    // 系列网址
    result.push(`https://www.pixiv.net/novel/series/${this.seriesId}`)
    result.push(CRLF_2)
    // 更新日期
    result.push(lang.transl('_更新日期') + ': ' + this.seriesUpdateDate)
    result.push(CRLF_2)
    // 系列 tags
    if (this.seriesTags.length > 0) {
      const tags = this.seriesTags.map((tag) => `#${tag}`).join(', ')
      result.push(tags)
      result.push(CRLF_2)
    }
    // 系列简介
    if (this.seriesCaption) {
      result.push(lang.transl('_系列简介') + ': ')
      result.push(CRLF_2)
      result.push(this.seriesCaption)
      result.push(CRLF_2)
    }
    // 本次合并包含的章节
    result.push(lang.transl('_本次合并包含的章节') + ': ')
    result.push(CRLF_2)
    for (const data of this.allNovelData) {
      result.push(`#${data.no} ${data.title}`)
      result.push(this.CRLF)
    }
    result.push(this.CRLF)
    // 设定资料
    if (this.seriesGlossaryText) {
      result.push(lang.transl('_设定资料') + ': ')
      result.push(CRLF_2)
      result.push(Utils.htmlToText(Utils.htmlDecode(this.seriesGlossaryText)))
      // seriesGlossary 结尾有两个\n，这里再添加一个以增大空白区域，和其他部分做出区分
      result.push(this.CRLF)
    }
    result.push(`----- ${lang.transl('_系列小说的元数据部分结束')} -----`)
    result.push(this.CRLF.repeat(3))

    return result.join('')
  }

  /** 生成单篇小说在 TXT 文件中的完整章节文本。 */
  private async buildTXTNovelSection(data: NovelSummary) {
    const text: string[] = []

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
      text.push(`https://www.pixiv.net/novel/show.php?id=${data.id}`)
      text.push(this.CRLF2)
      text.push(lang.transl('_更新日期') + ': ' + data.updateDateShort)
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
    let content = data.content
      .replace(/<br \/>/g, this.CRLF)
      .replace(/<\/?.+?>/g, '')
    content = await replaceNovelWords.replace(this.seriesId, content)
    text.push(content)
    // 在正文结尾添加换行标记，使得不同章节之间区分开来
    text.push(this.CRLF.repeat(4))
    return text.join('')
  }

  /** 合并系列小说并生成 EPUB 文件；如有需要会自动分卷保存。 */
  private async mergeEPUB(body: NovelSeriesData['body']) {
    const link = `https://www.pixiv.net/novel/series/${this.seriesId}`
    const date = new Date(this.seriesUpdateDate)
    const description = this.buildEPUBDescription()

    // 每次创建 EPUB 文件时，从第几篇小说开始添加
    let index = 0

    // 把创建 EPUB 的步骤放到一个函数里，方便在需要分割文件时多次调用
    const generateEPUB = async () => {
      // 如果需要保存设定资料里的图片，就先把 description 里的图片标记替换为 EPUB 中可用的图片标签
      const needSaveGlossaryImages = this.checkNeedSaveGlossaryImages(index)
      const currentDescription = this.buildEPUBDescriptionWithImages(
        description,
        needSaveGlossaryImages
      )

      this.pushSizeLog()
      this.addSize(currentDescription.length)

      const jepub = this.createEPUB(link, date, currentDescription)

      // 实际下载设定资料里的图片
      await this.addGlossaryImagesToEPUB(jepub, needSaveGlossaryImages)

      // 添加系列封面图片
      await this.addSeriesCoverToEPUB(jepub, body.cover.urls.original)

      const episodeCovers: EpisodeCoverRecord[] = []

      // 循环添加每篇小说的内容
      for (; index < this.allNovelData.length; index++) {
        const data = this.allNovelData[index]
        const novelId = data.id
        // 添加这篇小说的封面图片、元数据、正文内容
        const coverHtml = await this.buildEpisodeCoverHtml(
          data,
          episodeCovers,
          jepub
        )
        const metaHtml = this.buildEpisodeMetaHtml(data)
        let content = await this.buildEPUBChapterContent(
          data,
          coverHtml,
          metaHtml
        )

        // 添加小说里的图片
        const value = await downloadNovelEmbeddedImage.EPUB(
          novelId,
          data.title,
          content,
          data.embeddedImages,
          jepub,
          'merge novel'
        )
        content = value.content

        // 添加正文，这会在 EPUB 里生成一个新的章节
        // 实际上会生成一个对应的 html 文件，如 OEBPS/page-0.html
        const title = this.buildEPUBChapterTitle(data.title)
        jepub.add(`${this.chapterNo(data.no)} ${title}`, content)

        if (index === this.allNovelData.length - 1) {
          await this.saveEPUBFile(jepub, true)
          return
        }

        this.addEPUBContentSize(content, value.size)
        if (this.checkSizeLimit()) {
          await this.saveEPUBFile(jepub)
          index++
          return generateEPUB()
        }
        // 如果不满足保存 EPUB 文件的条件，就会继续循环
      }
    }

    await generateEPUB()
  }

  /** 生成 EPUB 信息页里使用的系列描述文本。 */
  private buildEPUBDescription() {
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
        otherMeta.push(this.br)
        otherMeta.push(description)
        otherMeta.push(this.br)
      }
      // 本次合并包含的章节
      otherMeta.push(lang.transl('_本次合并包含的章节') + ': ')
      otherMeta.push(this.br)
      otherMeta.push('<p>')
      for (const data of this.allNovelData) {
        otherMeta.push(`#${data.no} ${data.title}`)
        otherMeta.push(this.br)
      }
      otherMeta.pop()
      otherMeta.push('</p>')
      otherMeta.push(this.br)
      // 添加设定资料
      if (this.seriesGlossaryText) {
        otherMeta.push(lang.transl('_设定资料') + ': ')
        otherMeta.push(this.br)
        otherMeta.push(this.handleEPUBDescription(this.seriesGlossaryText))
        otherMeta.push(this.br)
      }
      description = otherMeta.join('')
    }

    return description
  }

  /** 判断当前这个分卷是否需要携带设定资料图片。 */
  private checkNeedSaveGlossaryImages(index: number) {
    // 仅当保存第一个 EPUB 文件时，才添加设定资料里的图片。因为这些图片是整个系列的，而不是每篇小说的，所以只需要在第一个 EPUB 文件里添加即可
    return (
      index === 0 &&
      settings.saveNovelMeta &&
      settings.downloadNovelEmbeddedImage
    )
  }

  /** 把设定资料里的图片标记替换为 EPUB 中可用的图片标签。 */
  private buildEPUBDescriptionWithImages(
    description: string,
    needSaveGlossaryImages: boolean
  ) {
    if (!needSaveGlossaryImages) {
      return description
    }

    let result = description
    // 如果需要保存图片，就先把 description 里的图片标记为实际的图片标签。因为必须先执行 jepub.init，之后才能添加图片（jepub.image），因此需要先处理 description 的内容
    for (const item of this.glossaryImages) {
      if (item) {
        const url = downloadNovelGlossaryImage.getUrl(item.urls)
        if (!url) {
          continue
        }
        const extension = Utils.getExtension(url)
        const imageId = `glossaryImage-${item.novelImageId}`
        const imageHtml = `<p><img src="assets/${imageId}.${extension}" /></p>`
        const imageFlag = Tools.createGlossaryImageFlag(item.novelImageId)
        result = result.replaceAll(imageFlag, imageHtml)
      }
    }
    return result
  }

  /** 创建并初始化一个新的 EPUB 对象。 */
  private createEPUB(link: string, date: Date, description: string) {
    // 初始化 EPUB 文件
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
      description,
    })
    jepub.uuid(link)
    jepub.date(date)
    return jepub
  }

  /** 把设定资料图片下载并写入当前 EPUB。 */
  private async addGlossaryImagesToEPUB(
    jepub: any,
    needSaveGlossaryImages: boolean
  ) {
    if (!needSaveGlossaryImages) {
      return
    }

    // 在 EPUB 文件初始化之后，下载并保存设定资料里的图片
    for (const item of this.glossaryImages) {
      if (item) {
        this.logDownloadGlossaryImage(item)
        const image = await downloadNovelGlossaryImage.getImage(
          item.urls,
          'arrayBuffer'
        )
        if (image) {
          this.addSize(image.byteLength)
          const imageId = `glossaryImage-${item.novelImageId}`
          jepub.image(
            Config.isFirefox ? Utils.copyArrayBuffer(image) : image,
            imageId
          )
        }
      }
    }
  }

  /** 把系列封面下载并写入当前 EPUB。 */
  private async addSeriesCoverToEPUB(jepub: any, seriesCoverUrl: string) {
    // 添加这个系列的封面图片到 EPUB 文件里
    if (!settings.downloadNovelCoverImage || !seriesCoverUrl) {
      return
    }

    await this.sleep(this.downloadInterval)
    this.logDownloadSeriesCover()
    const cover = await downloadNovelCover.getCover(
      seriesCoverUrl,
      'arrayBuffer'
    )
    if (cover) {
      this.addSize(cover.byteLength)
      jepub.cover(Config.isFirefox ? Utils.copyArrayBuffer(cover) : cover)
    }
  }

  /** 生成单篇小说章节封面的 HTML，并在需要时把图片写入 EPUB。 */
  private async buildEpisodeCoverHtml(
    data: NovelSummary,
    episodeCovers: EpisodeCoverRecord[],
    jepub: any
  ) {
    // 添加每篇小说的封面图片
    // 这不需要调用 jepub.cover 方法，因为 jepub.cover 设置的是整个小说的唯一封面
    // 而且 jepub 不能为单个章节设置封面图片，所以每个章节的封面图是下载器调用 jepub.image 方法自行保存的，然后通过 html 标签引用
    let coverHtml = ''
    const coverUrl = data.coverUrl
    if (!settings.downloadNovelCoverImage || !coverUrl) {
      return coverHtml
    }

    const link = Tools.createWorkLink(data.id, data.title, 'novel')
    log.log(lang.transl('_下载小说的封面图片的提示', link))

    // 先检查是否已经保存过这个章节的封面图
    const find = episodeCovers.find((item) => item.url === coverUrl)
    // 如果已经保存过，则直接引用它
    if (find) {
      return `<p><img src="assets/${find.id}.jpg" /></p>`
    }

    // 没有保存过，下载并添加这个章节的封面图
    await this.sleep(this.downloadInterval)
    const cover = await downloadNovelCover.getCover(coverUrl, 'arrayBuffer')
    if (!cover) {
      return coverHtml
    }

    // 如果 URL 不同，那么在加载封面图片之后检查字节数是否相同。如果相同也认为是同一个文件
    // 这是因为有时即使封面图片是同一个文件，但 URL 是不同的（可能是因为作者每次都重新上传了封面图），这时就无法通过 URL 来判断是否已经保存过了
    // 示例：
    // https://www.pixiv.net/novel/series/1090654
    // 此时在下载封面图片后对比字节数，作为一种补充手段。如果相同的话就不保存，以减小文件体积
    const size = cover.byteLength
    const findSize = episodeCovers.find((item) => item.size === size)
    if (findSize) {
      return `<p><img src="assets/${findSize.id}.jpg" /></p>`
    }

    // 如果 URL 和字节数都不同，才会把这个封面图片保存到 epub 里
    this.addSize(size)
    const imageId = 'cover-' + data.id
    jepub.image(
      Config.isFirefox ? Utils.copyArrayBuffer(cover) : cover,
      imageId
    )
    coverHtml = `<p><img src="assets/${imageId}.jpg" /></p>`
    episodeCovers.push({ id: imageId, url: coverUrl, size })
    return coverHtml
  }

  /** 生成单篇小说章节前面的元数据 HTML。 */
  private buildEpisodeMetaHtml(data: NovelSummary) {
    // 添加每篇小说的元数据，内容包含：
    // url 小说的 URL
    // date 小说的更新日期
    // tags 小说的标签列表
    // description 小说的简介
    if (!settings.saveNovelMeta) {
      return ''
    }

    const url = `https://www.pixiv.net/novel/show.php?id=${data.id}`
    const link = `<p><a href="${url}" target="_blank">${url}</a></p>`
    const date = `<p>${lang.transl('_更新日期') + ': ' + data.updateDateShort}</p>`
    const tags = `<p>${data.tags.map((tag) => `#${tag}`).join('<br/>')}</p>`
    const meta = `${link}${date}${tags}${Tools.replaceEPUBText(data.description)}`
    return (
      meta + `<br/><br/>----- ${lang.transl('_下面是正文')} -----<br/><br/>`
    )
  }

  /** 生成单篇小说章节正文的 HTML。 */
  private async buildEPUBChapterContent(
    data: NovelSummary,
    coverHtml: string,
    metaHtml: string
  ) {
    // 组合封面图片和简介，使封面图片位于所有文字内容之前
    let content = await replaceNovelWords.replace(this.seriesId, data.content)
    content = Tools.replaceEPUBTextWithP(content)
    return coverHtml + metaHtml + content
  }

  /** 生成 EPUB 章节标题。 */
  private buildEPUBChapterTitle(title: string) {
    return Tools.replaceEPUBTitle(Utils.replaceUnsafeStr(title))
  }

  /** 把正文文本和章节内图片体积累计到当前分卷。 */
  private addEPUBContentSize(content: string, imageSize: number) {
    // 检查文件体积
    this.addSize(content.length)
    this.addSize(imageSize)
  }

  /** 获取这个系列里所有小说的 id */
  private async getNovelIds(): Promise<void> {
    const seriesContents = await API.getNovelSeriesContent(
      this.seriesId,
      this.limit,
      this.last,
      'asc'
    )

    let list = seriesContents.body.page.seriesContents
    const thisPageIdNumber = list.length

    // 如果当前页面是系列页面，并且用户手动选择了部分小说，那么在合并时，只合并用户选择的小说，而不是整个系列里的所有小说
    if (
      pageType.type === pageType.list.NovelSeries &&
      selectWork.idList.length > 0
    ) {
      const selectedNovelIds = selectWork.idList
        .filter((item) => item.type === 'novels')
        .map((item) => item.id)
      if (selectedNovelIds.length > 0) {
        log.warning(
          lang.transl('_提示只合并选择的小说'),
          'tipOnlyMergeSelectedNovels'
        )
        list = list.filter((item) => selectedNovelIds.includes(item.id))
      }
    }

    for (const item of list) {
      // 先保存小说 id（不进行过滤）
      this.novelIdListUnfiltered.push(item.id)

      // 然后保存通过了过滤器检查的小说 id
      const check = await filter.check({
        id: item.id,
        isOriginal: item.isOriginal,
        aiType: item.aiType,
        xRestrict: item.xRestrict,
        tags: item.tags,
        title: item.title,
        seriesTitle: this.seriesTitle || '',
        userId: item.userId,
        bookmarkData: item.bookmarkData,
        bookmarkCount: item.bookmarkCount,
        createDate: item.createDate,
        IDTypeString: 'novels',
      })
      if (check) {
        this.novelIdListFiltered.push(item.id)
      } else {
        const order_title = `#${item.series.contentOrder} ${item.title}`
        const link = Tools.createWorkLink(item.id, order_title, 'novel')
        log.warning(lang.transl('_排除小说') + ': ' + link)
      }
    }

    this.last += thisPageIdNumber

    // 如果这一次返回的小说数量等于每批限制（默认 30 个），说明这不是最后一页（因为最后一页往往不足 30 篇小说），继续请求后续页面的数据
    if (thisPageIdNumber === this.limit) {
      return this.getNovelIds()
    } else {
      // 获取完毕

      // 如果没有任何小说通过过滤器检查，就不会合并这个系列，此时输出提示日志
      if (this.novelIdListFiltered.length === 0) {
        log.warning(lang.transl('_这个系列里的所有小说都被排除了'))
      } else {
        // 根据条件决定只合并符合过滤条件的小说，还是合并所有小说
        if (settings.saveAllSeriesNovelsIfOneMatches) {
          this.novelIdList = this.novelIdListUnfiltered

          // 如果有部分小说不符合过滤条件，但用户设置了合并所有小说，那么就会合并不符合过滤条件的小说。此时显示提示
          if (
            this.novelIdListFiltered.length < this.novelIdListUnfiltered.length
          ) {
            log.warning(lang.transl('_提示会合并所有小说'))
          }
        } else {
          this.novelIdList = this.novelIdListFiltered
        }
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
        'getNovelDataProgress' + this.seriesId
      )

      const data = await this.fetchNovelData(id)
      if (!data) {
        continue
      }

      const novelData = await this.createNovelSummary(data)
      if (novelData) {
        this.allNovelData.push(novelData)
      }

      // 如果处于快速合并模式，则跳过剩余小说
      if (states.quickMergeNovel) {
        log.warning('⏩quickMergeNovel: On，跳过剩余小说')
        break
      }
    }

    // 获取了所有小说的数据
    log.persistentRefresh('getNovelDataProgress' + this.seriesId)

    // 按照小说的序号进行升序排列
    this.allNovelData.sort(Utils.sortByProperty('no', 'asc'))
  }

  /** 获取单篇小说的完整数据，优先使用缓存。 */
  private async fetchNovelData(id: string) {
    // 优先从缓存中获取数据
    let data = cacheWorkData.get(id, 'novel')
    if (data) {
      return data
    }

    try {
      // 自动合并系列小说时，可能会连续不断的合并多个系列，这些系列可能包含非常多的小说，所以需要添加等待时间，以减小出现 429 错误的概率
      // 另外获取设定资料时也有可能需要发送多个请求，但并不总是需要多次请求，所以获取设定资料时没有添加等待时间
      await this.sleep(this.crawlInterval)
      data = await API.getNovelData(id)
      cacheWorkData.set(data)
      return data
    } catch (error: Error | any) {
      // 请求小说的数据出错时跳过它，不重试（通常是 404 错误，没有必要重试）
      log.error('⏩' + lang.transl('_跳过这个小说'))
      return null
    }
  }

  /** 生成单篇小说用于后续处理的标签列表。 */
  private buildNovelTags(data: NovelData) {
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

    return tags
  }

  /** 从完整小说数据中提取合并流程需要的摘要数据。 */
  private async createNovelSummary(data: NovelData) {
    const tags = this.buildNovelTags(data)
    const novelId = data.body.id
    const title = data.body.title
    const order = data.body.seriesNavData!.order

    // 如果未启用此设置，则检查一些过滤条件。如果启用了此设置就不进行检查，因为此时需要合并所有小说
    if (settings.saveAllSeriesNovelsIfOneMatches === false) {
      // 检查年龄限制和标签过滤器
      // 虽然这里也能检查其他过滤条件，但没有必要，因为前面已经检查过了
      const check = await filter.check({
        xRestrict: data.body.xRestrict,
        tags,
      })
      if (!check) {
        const order_title = `#${order} ${title}`
        const link = Tools.createWorkLink(novelId, order_title, 'novel')
        log.warning(lang.transl('_排除小说') + ': ' + link)
        return null
      }
    }

    return {
      id: novelId,
      no: order,
      updateDate: data.body.uploadDate,
      updateDateShort: DateFormat.format(data.body.uploadDate),
      title: Utils.replaceUnsafeStr(title),
      tags,
      description: Utils.htmlToText(Utils.htmlDecode(data.body.description)),
      content: Tools.replaceNovelContentFlag(data.body.content),
      coverUrl: data.body.coverUrl,
      embeddedImages: Tools.extractEmbeddedImages(data),
    }
  }

  private readonly MiB = 1024 * 1024

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

  /** 把指定体积累加到当前正在写入的分卷记录里。 */
  private addSize(size: number) {
    const current = this.sizeLog.find((item) => item.inUse)
    if (current) {
      current.size += size
    }
  }

  /** 限制单个 EPUB 文件的大小 */
  // 每当添加完一篇小说，就检查这个 EPUB 文件的体积是否超出了限制，如果超出就保存它，然后新建一个 EPUB 文件继续添加，这样可能会生成多个 EPUB 文件
  // 实际可用的体积上限取决于 jszip 的限制，通常文件体积不能超过 2 GiB
  // 默认的体积限制是 200 MiB，这主要是担心一些阅读器打开大体积的 EPUB 文件时可能会出现性能问题
  // 例如 Windows 上的 Aquile Reader 打开 400 MiB 的 EPUB 文件时占用了 8 GB 内存，闲置一段时间后内存依然超过 5 GB。不过其他阅读器就没这么离谱了，就连手机上的静读天下也能顺利阅读这个小说。
  // 在之前的几次测试里，650 个 EPUB 文件（未分割）里只有 7 个文件的体积超过了 100 MiB， 所以绝大多数的系列小说都不需要分割
  // 注意：检查体积时是以单篇小说为单位的，所以以下情况会生成超过限制的 EPUB 文件：
  // 1. 单篇小说的体积已经超出限制
  // 2. 添加了多篇小说时，最后一篇导致总体积超出限制
  private checkSizeLimit(): boolean {
    const current = this.sizeLog.find((item) => item.inUse)
    if (current) {
      return current.size >= settings.singleEPUBFileSizeLimit * this.MiB
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

    // 保存合并的系列小说的文件时，如果已存在同名文件，不覆盖它而是添加序号。
    // 这是因为系列小说有更新的需要，例如第一次下载时，这个系列里有 10 篇小说；过段时间再次下载时，由于作者又更新了 10 篇小说，所以里面保存的可能是第 1 - 20 篇小说，也可能是第 11 - 20 篇小说（如果用户启用了“不抓取下载过的作品”）。所以这两次下载的文件的内容是不同的，不应该直接覆盖
    const blob = await jepub.generate('blob', (metadata: any) => {})
    await SendDownload.noReply(blob, name, 'uniquify')

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

  /** 输出下载系列封面图片时的日志。 */
  private logDownloadSeriesCover() {
    const link = `<a href="https://www.pixiv.net/novel/series/${this.seriesId}" target="_blank">${this.seriesTitle}</a>`
    log.log(lang.transl('_下载系列小说的封面图片', link))
  }

  /** 下载设定资料里的图片时，显示对应的日志 */
  private logDownloadGlossaryImage(item: GlossaryImageItem) {
    // 生成这条设定资料的 url，例如：
    // https://www.pixiv.net/novel/series/9114820/glossary/154698
    const glossaryUrl = `https://www.pixiv.net/novel/series/${this.seriesId}/glossary/${item.glossaryId}`
    const link = Utils.createLinkHTML(glossaryUrl, item.glossaryTitle)
    log.log(lang.transl('_下载设定资料x里的图片', link))
  }

  /** 重置当前实例上的系列合并状态。 */
  private reset() {
    this.seriesData = null
    this.allNovelData = []
    this.novelIdListFiltered = []
    this.novelIdListUnfiltered = []
    this.novelIdList = []
    this.seriesTags = []
    this.seriesId = ''
    this.seriesTitle = ''
    this.novelName = ''
  }
}

export { MergeNovel }
