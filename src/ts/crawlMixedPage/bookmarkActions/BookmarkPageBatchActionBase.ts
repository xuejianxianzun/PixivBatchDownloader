import { API } from '../../API'
import { Config } from '../../Config'
import { ArtworkCommonData, BookmarkData } from '../../crawl/CrawlResult'
import { EVT } from '../../EVT'
import { lang } from '../../Language'
import { log } from '../../Log'
import { msgBox } from '../../MsgBox'
import { settings } from '../../setting/Settings'
import { states } from '../../store/States'
import { store } from '../../store/Store'
import { toast } from '../../Toast'
import { Tools } from '../../Tools'
import { Utils } from '../../utils/Utils'
import { WorkBookmarkData } from '../../Bookmark'

// 收藏页接口里单条作品的数据类型。
type BookmarkWork = BookmarkData['body']['works'][number]

// 调用方只需要传入“抓取多少页、如何收集每条作品、收集完怎么处理”。
type BookmarkActionOptions<T> = {
  /** 设置要抓取多少页。-1 表示抓取全部收藏；其他值表示抓取指定页数。 */
  crawlNumber: number
  /** 有些动作要从第一页开始，有些则要沿用当前页偏移量。resetOffset 为 true 的话就是从第一页开始抓取 */
  resetOffset?: boolean
  /** 是否启用慢速抓取，以避免请求频率过快。 */
  slowCrawl?: boolean
  /** 对 API 获取到的收藏数据进行处理，通常会进行过滤，并提取成子类需要使用的数据格式 */
  collectWork: (
    workData: BookmarkWork,
    tagList?: string[]
  ) => Promise<T | null> | T | null
  /** 当抓取任务完成后执行的回调函数，通常会对收集到的数据进行处理。 */
  onCollected: (bookmarkDataList: T[]) => Promise<void> | void
}

/** 在收藏页面里的通用抓取流程 */
abstract class BookmarkPageBatchActionBase<T> {
  // 防止同一个按钮重复启动抓取。
  private running = false
  // 当前收藏页内容类型，插画或小说。
  protected type: 'illusts' | 'novels' = 'illusts'

  // 供子类判断自己当前是否已经在执行。
  protected isRunning() {
    return this.running
  }

  /** 配置如何抓取收藏作品、如何提取需要的数据、抓取完成后怎么处理 */
  protected async run(options: BookmarkActionOptions<T>) {
    if (this.running || states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    if (window.location.pathname.includes('/collections')) {
      const msg = lang.transl('_下载器目前不支持抓取珍藏册')
      msgBox.warning(msg)
      log.warning(msg)
      EVT.fire('stopCrawl')
      return
    }

    this.running = true
    try {
      this.type = window.location.pathname.includes('/novel')
        ? 'novels'
        : 'illusts'

      // 收藏页每次显示的条数：小说 30，本子/插画 48。
      const onceNumber = window.location.pathname.includes('/novels') ? 30 : 48
      // 根据当前页面的页码，决定从哪一批收藏开始抓。
      const nowPage = Utils.getURLSearchField(location.href, 'p')
      let offset = options.resetOffset
        ? 0
        : nowPage
          ? (Number.parseInt(nowPage) - 1) * onceNumber
          : 0
      if (offset < 0) {
        offset = 0
      }

      // 目标抓取数量：有限页数按页数换算，无限抓取则使用全局上限。
      const requestNumber =
        options.crawlNumber === -1
          ? Config.worksNumberLimit
          : onceNumber * options.crawlNumber

      // 后续接口请求会复用当前收藏页的筛选条件。
      store.tag = Tools.getTagFromURL()
      const isHide = Utils.getURLSearchField(location.href, 'rest') === 'hide'
      const order = (Utils.getURLSearchField(location.href, 'order') ||
        'desc') as 'desc' | 'asc'
      const mode = (Utils.getURLSearchField(location.href, 'mode') || 'all') as
        | 'all'
        | 'safe'
        | 'r18'
      const work_tag = Utils.getURLSearchField(location.href, 'work_tag') || ''
      const bm =
        Utils.getURLSearchField(location.href, 'bm').replaceAll('-', '') || ''

      log.log(lang.transl('_正在抓取'))
      if (options.crawlNumber === -1) {
        log.log(lang.transl('_获取全部书签作品'))
      }

      if (options.slowCrawl) {
        states.slowCrawlMode = settings.slowCrawl
        if (settings.slowCrawl) {
          log.warning(lang.transl('_慢速抓取'))
        }
      } else {
        states.slowCrawlMode = false
      }

      states.stopCrawl = false

      const bookmarkDataList = await this.collectBookmarkData({
        collectWork: options.collectWork,
        isHide,
        order,
        mode,
        work_tag,
        bm,
        offset,
        requestNumber,
      })

      console.log('bookmarkDataList', bookmarkDataList)
      await options.onCollected(bookmarkDataList)
    } finally {
      states.slowCrawlMode = false
      this.running = false
    }
  }

  // 在某些子类的 collectWork 方法里调用，用于从作品详情里提取收藏信息
  // 这是一个比较通用的处理。如果子类需要使用不同的处理逻辑，可以在 collectWork 方法里自行处理
  protected createBookmarkData(
    workData: BookmarkWork,
    bookmarkTags?: string[]
  ): null | WorkBookmarkData {
    if (!workData.bookmarkData) {
      return null
    }

    // 该方法会保留已被删除的作品的数据。
    // 被删除的作品的 id 是 number 而非 string，因为 API 返回的数据里就是这样的
    return {
      workID: Number.parseInt(workData.id),
      type:
        (workData as ArtworkCommonData).illustType === undefined
          ? 'novels'
          : 'illusts',
      bookmarkID: workData.bookmarkData.id,
      private: workData.bookmarkData.private,
      bookmarkTags: bookmarkTags || [],
    }
  }

  // 加载收藏列表来获取作品数据，并把符合条件的作品转换成动作需要的数据。
  private async collectBookmarkData({
    collectWork,
    isHide,
    order,
    mode,
    work_tag,
    bm,
    offset,
    requestNumber,
  }: {
    collectWork: (
      workData: BookmarkWork,
      tagList?: string[]
    ) => Promise<T | null> | T | null
    isHide: boolean
    order: 'desc' | 'asc'
    mode: 'all' | 'safe' | 'r18'
    work_tag: string
    bm: string
    offset: number
    requestNumber: number
  }): Promise<T[]> {
    const bookmarkDataList: T[] = []
    // 当前收藏页所属用户。
    const userID = Tools.getCurrentPageUserID()

    while (true) {
      if (states.stopCrawl) {
        break
      }

      const data = await API.getBookmarkData(
        userID,
        this.type,
        store.tag,
        offset,
        isHide,
        order,
        mode,
        work_tag,
        bm
      )

      // 当前页返回的作品列表。
      const works = data.body.works
      if (works.length === 0) {
        break
      }

      const _bookmarkTags = data.body.bookmarkTags || {}

      for (const workData of works) {
        // 由子类决定是否保留当前作品。
        // 传递这个作品的收藏标签，供有需要的模块使用。注意这不是作品本身的标签，而是用户为该它添加的收藏标签
        const bookmarkTags =
          _bookmarkTags[workData.bookmarkData?.id || ''] || []
        const item = await collectWork(workData, bookmarkTags)
        if (item) {
          // 该列表里包含已被删除的作品
          bookmarkDataList.push(item)
        }
      }

      // 记录已收集到的作品数，供日志和停止条件使用。
      const length = bookmarkDataList.length
      log.log(
        lang.transl('_当前有x个作品', length.toString()),
        'initBookmarkPageCrawlCount'
      )

      if (length >= requestNumber) {
        break
      }

      // 下一页收藏列表的偏移量，每页固定 100 条。
      offset += 100

      if (states.slowCrawlMode) {
        await Utils.sleep(settings.slowCrawlDealy)
      }
    }

    if (bookmarkDataList.length > requestNumber) {
      bookmarkDataList.splice(requestNumber, bookmarkDataList.length)
    }

    return bookmarkDataList
  }
}

export { BookmarkPageBatchActionBase }
