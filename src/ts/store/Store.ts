import { EVT } from '../EVT'
import { checkIndexForMultiImageWork } from '../filter/CheckIndexForMultiImageWork'
import { Tools } from '../Tools'
import { Result, ResultOptional, RankList, IDData } from './StoreType'

/** 保存抓取结果和一些公用数据 */
class Store {
  constructor() {
    this.loggedUserID = Tools.getLoggedUserID()
    this.bindEvents()
  }

  /** 保存当前登录的用户的 ID。在某些页面类型里，可能没有获取到用户 ID，所以有可能是空字符串 */
  public loggedUserID = ''

  /** 储存从列表中抓取到的作品的 id */
  public idList: IDData[] = []

  /** 下载器忙碌时，如果有新的抓取请求，则添加到等待队列里
   *
   * 当下载器的抓取结果为空、以及下载完毕后，会开始抓取等待队列里的 id */
  public waitingIdList: IDData[] = []

  /** 储存抓取结果的元数据。每个作品只会有一条数据 */
  // 抓取图片作品时，会根据此数据生成每一张图片的数据（result）
  public resultMeta: Result[] = []
  // 有一种情况下没有 resultMeta 数据：Resume 也就是恢复未完成的下载时，只恢复了 result，没有生成 resultMeta

  /** 储存抓取结果 */
  public result: Result[] = []

  /** 储存抓取到的图片作品的 id 列表，用来避免重复添加 */
  private artworkIDList: number[] = []
  /** 储存抓取到的小说作品的 id 列表，用来避免重复添加 */
  private novelIDList: number[] = []

  /** 记录从每个作品里下载多少个文件 */
  public downloadCount: {
    [workID: string]: number
  } = {}

  // 恢复未完成的下载之后，生成 downloadCount 数据
  // 因为保存的任务数据里没有 downloadCount，并且恢复数据时也没有生成 downloadCount
  public resetDownloadCount() {
    this.downloadCount = {}
    for (const r of this.result) {
      this.downloadCount[r.idNum] = (this.downloadCount[r.idNum] || 0) + 1
    }
  }

  /** 有多少个文件尚未下载完成 */
  public remainingDownload = 0
  /** 储存作品在排行榜中的排名 */
  private rankList: RankList = {}
  /** 开始抓取时，储存页面此时的 tag */
  public tag = ''
  /** 开始抓取时，储存页面此时的 title */
  public title = ''
  /** 开始抓取时，储存页面此时的 URL */
  public URLWhenCrawlStart = ''
  /** 抓取完成的时间 */
  public crawlCompleteTime: Date = new Date()

  /** 只下载作品里的一部分图片 */
  private downloadOnlyPart: {
    [workID: string]: number[]
  } = {}

  public setDownloadOnlyPart(workID: number, indexList: number[]) {
    if (this.downloadOnlyPart[workID]) {
      this.downloadOnlyPart[workID] = Array.from(
        new Set(this.downloadOnlyPart[workID].concat(indexList))
      )
    } else {
      this.downloadOnlyPart[workID] = indexList
    }
  }

  private readonly resultDefault: Result = {
    aiType: 0,
    idNum: 0,
    id: '',
    isOriginal: null,
    original: '',
    thumb: '',
    regular: '',
    small: '',
    title: '',
    description: '',
    pageCount: 1,
    index: 0,
    tags: [],
    tagsWithTransl: [],
    tagsTranslOnly: [],
    user: '',
    userId: '',
    fullWidth: 0,
    fullHeight: 0,
    ext: '',
    bmk: 0,
    bookmarked: false,
    bmkId: '',
    date: '',
    uploadDate: '',
    type: 0,
    rank: null,
    ugoiraInfo: null,
    seriesTitle: null,
    seriesOrder: null,
    seriesId: null,
    novelMeta: null,
    likeCount: 0,
    viewCount: 0,
    commentCount: 0,
    xRestrict: 0,
    sl: null,
  }

  // 添加每个作品的数据。只需要传递有值的属性
  // 如果一个作品有多张图片，只需要传递第一张图片的数据。后面的数据会根据设置自动生成
  public addResult(data: ResultOptional) {
    // 检查该作品 id 是否已存在，已存在则不添加
    if (data.idNum !== undefined) {
      const useList = data.type === 3 ? this.novelIDList : this.artworkIDList
      if (useList.includes(data.idNum)) {
        return
      }
      useList.push(data.idNum)
    }

    // 生成该作品的元数据
    const meta = Object.assign({}, this.resultDefault, data)
    if (meta.type === 0 || meta.type === 1) {
      meta.id = meta.idNum + `_p0`
    } else {
      meta.id = meta.idNum.toString()
    }
    this.resultMeta.push(meta)
    EVT.fire('addResult', meta)

    // 添加作品里每个文件的数据
    if (meta.type === 2 || meta.type === 3) {
      // 动图和小说作品只有一个文件，直接使用元数据
      this.result.push(meta)
      this.downloadCount[meta.idNum] = 1
    } else {
      // 插画和漫画可能有多个文件，需要确定保存哪些文件
      // 储存需要下载的图片的索引
      let indexList: number[] = []
      // 如果已经指定了只下载部分图片
      if (this.downloadOnlyPart[meta.idNum]) {
        indexList = this.downloadOnlyPart[meta.idNum]
        delete this.downloadOnlyPart[meta.idNum]
      } else {
        // 如果没有指定要下载的图片，则从全部图片里取出要下载的部分
        const pageCount = meta.pageCount
        const allIndex = [...Array(pageCount).keys()]
        // 单图作品在这里不需要应用过滤器，保存所有图片（其实也就一个）
        if (pageCount === 1) {
          indexList = allIndex
        } else {
          // 对多图作品应用过滤器，来决定最终保留哪些图片
          // 每个过滤器都可能会删除一些图片，只保留部分图片
          // 这些过滤器的执行顺序不重要，取它们的交集来确定最终保留哪些图片（在所有过滤器里都为 true 的项）
          indexList = allIndex.filter((index) =>
            checkIndexForMultiImageWork.check(index, pageCount, meta.userId)
          )
        }
      }
      this.downloadCount[meta.idNum] = indexList.length

      // 添加插画、漫画作品里每个文件的数据
      const p0 = 'p0'
      for (const i of indexList) {
        const result = Object.assign({}, meta)
        const pi = 'p' + i
        result.index = i
        result.id = meta.id.replace(p0, pi)
        result.original = meta.original.replace(p0, pi)
        result.regular = meta.regular.replace(p0, pi)
        result.small = meta.small.replace(p0, pi)
        result.thumb = meta.thumb.replace(p0, pi)
        this.result.push(result)
      }
    }
  }

  public getRankList(index: string) {
    return this.rankList[index]
  }

  public setRankList(id: string, rank: number) {
    this.rankList[id] = rank
  }

  public findResult(id: string) {
    return this.result.find((item) => item.id === id)
  }

  public reset() {
    this.resultMeta = []
    this.artworkIDList = []
    this.novelIDList = []
    this.result = []
    this.idList = []
    this.waitingIdList = []
    this.rankList = {}
    this.remainingDownload = 0
    this.tag = Tools.getTagFromURL()
    this.title = Tools.getPageTitle()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.URLWhenCrawlStart = window.location.href
      this.reset()
    })

    // 停止下载时，清空等待下载的任务
    window.addEventListener(EVT.list.downloadStop, () => {
      this.waitingIdList = []
    })

    window.addEventListener(EVT.list.resume, () => {
      this.tag = Tools.getTagFromURL()
      this.title = Tools.getPageTitle()
    })
  }
}

const store = new Store()
export { store }
