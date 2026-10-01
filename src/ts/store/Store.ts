import { EVT } from '../EVT'
import { checkIndexForMultiImageWork } from '../filter/CheckIndexForMultiImageWork'
import { pageType } from '../PageType'
import { Tools } from '../Tools'
import { Result, ResultOptional, RankList, IDData } from './StoreType'
import { settings } from '../setting/Settings'

/** 一条「被色彩检查排除的图片索引」记录 */
export interface ColorBlockedRecord {
  /** 记录时「保留彩色图片」这个选项是否启用 */
  colorImg: boolean
  /** 记录时「保留黑白图片」这个选项是否启用 */
  blackWhiteImg: boolean
  /** 被色彩检查排除的图片索引 */
  indexes: number[]
}

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

  /** 某个作品里「被色彩检查排除」的图片索引。key 是作品的数字 id（idNum）
   *
   * 重建抓取结果时（见 SearchResultPreview.reAddResult）必须知道当初有哪些图片没通过色彩检查，
   * 否则会把它们又加回来。所以这里按 idNum 记住它们。
   *
   * 唯一真正依赖记录的是「搜索页预览的结果重建」，也就是这一组操作触发的重建：
   * 在结果中筛选 / 清除多图作品 / 清除动图作品 / 手动删除作品 / 手动排除作品 / 改「只抓取前 N 张」。
   * 这些操作会修改抓取结果。
   * 如果用户在抓取时排除了某种颜色的图片（如黑白图片），那么在重建抓取结果时，
   * 为了不让被排除掉的图片再次加回来，就需要保存这些被色彩检查排除的索引。
   *
   * ⚠️ 这里只记「被色彩检查排除」的索引，**不要**记「被多图作品设置排除」的索引：
   * 后者每次重建都要按当时的设置重新计算（用户可能改了「只下载前几张图片」）。
   *
   * 清空时机：开始新一轮抓取、导入抓取结果、恢复未完成的下载。
   * ⚠️ 不能写进 reset()：reAddResult 也会调用 reset()，在那里清会丢掉本次抓取的结果。
   *
   * 同一轮抓取内只增不减，条目数不会超过作品数 */
  private colorBlockedIndexes = new Map<number, ColorBlockedRecord>()

  /** 储存抓取到的图片作品的 id 列表，用来避免重复添加 */
  private artworkIDList: number[] = []
  /** 储存抓取到的小说作品的 id 列表，用来避免重复添加 */
  private novelIDList: number[] = []

  /** 记录从每个作品里下载多少个文件 */
  public downloadCount: {
    [workID: string]: number
  } = {}

  /** 记录某个作品里被色彩检查排除的图片索引。
   * 连同当时的色彩设置一起记下来（含义取决于当时保留的是哪一侧，见 applyColorBlockedIndexes）。
   *
   * ⚠️ **一张都没被排除时也要调用**（传空数组）：空记录表示「这个作品的图片全都通过了色彩检查」，
   * 它和「没有记录」（从没检查过颜色）的含义不同，见 applyColorBlockedIndexes */
  public setColorBlockedIndexes(idNum: number, indexes: number[]) {
    this.colorBlockedIndexes.set(idNum, {
      colorImg: settings.downColorImg,
      blackWhiteImg: settings.downBlackWhiteImg,
      indexes,
    })
  }

  /** 清空色彩检查的排除记录。
   * 开始新一轮抓取、导入抓取结果、恢复未完成的下载时都要调用 */
  public clearColorBlockedIndexes() {
    this.colorBlockedIndexes.clear()
  }

  /** 导出色彩检查的排除记录，用于保存到 IndexedDB（见 Resume） */
  public getColorBlockedIndexes(): [number, ColorBlockedRecord][] {
    return [...this.colorBlockedIndexes.entries()]
  }

  /** 从保存的数据恢复色彩检查的排除记录（整体替换）。
   *
   * 传入空数组时等于清空 —— 这是对的：保存的记录是精确的，
   * 「保存过但内容为空」表示当时的图片全都通过了色彩检查 */
  public restoreColorBlockedIndexes(data: [number, ColorBlockedRecord][]) {
    this.colorBlockedIndexes.clear()
    for (const [idNum, record] of data) {
      this.colorBlockedIndexes.set(idNum, record)
    }
  }

  /** 按当前设置和这个作品的色彩检查结果，算出要保存它的哪些图片。
   *
   * 先用「多图作品设置」过滤，再按色彩检查的结果调整。
   *
   * 用它的地方都要通过这里，别在别处再写一套（addResult 和 SaveArtworkData 都依赖这个结果）。
   * 动图只有一个文件（下载的是 zip），但它的封面同样会被检查颜色，所以也要走这里 */
  // ⚠️ 色彩检查只检查过当初的那些索引（为了少发请求，见 SaveArtworkData），
  // 所以「没检查过」的索引按「允许」处理：如果用户后来放宽了「只下载前几张图片」，
  // 新出现的那些图片不会再被色彩过滤。这是刻意的取舍
  public getDownloadIndexes(meta: Result) {
    // 动图只有一个文件，不需要「多图作品」的过滤，所以直接用索引 0 过一遍色彩记录。
    // 这里不依赖 meta.pageCount：动图的 pageCount 虽然也是 1，但显式写出来更清楚。
    // （小说 type 3 不检查颜色，也就没有色彩记录，所以不会调用到这里）
    if (meta.type === 2) {
      return this.applyColorBlockedIndexes(meta.idNum, [0])
    }

    const allIndex = [...Array(meta.pageCount).keys()]
    // 单图作品不需要应用过滤器，保存所有图片（其实也就一个）
    const bySettings =
      meta.pageCount === 1
        ? allIndex
        : allIndex.filter((index) =>
            checkIndexForMultiImageWork.check(
              index,
              meta.pageCount,
              meta.userId
            )
          )

    return this.applyColorBlockedIndexes(meta.idNum, bySettings)
  }

  /** 把「被色彩检查排除的图片索引」应用到索引列表上。
   *
   * 应用之前要先判断两件事，否则会把用户已经取消掉的过滤又套回去、甚至套反：
   * 1. 色彩过滤现在是否还开着
   * 2. 现在的「保留侧」是否和记录时相同
   *
   * ⚠️「没有记录」和「有记录但 indexes 为空」必须区别对待，所以不要用 `if (!record.indexes.length)` 之类的判断提前返回：
   * - 没有记录 = 这个作品从没检查过颜色 → 保持原样
   * - 空记录 = 当时全都通过了 → 同一侧时保持全部，换到另一侧时应该只剩 0 张 */
  private applyColorBlockedIndexes(idNum: number, bySettings: number[]) {
    const record = this.colorBlockedIndexes.get(idNum)
    if (!record) {
      return bySettings
    }

    // 只有「恰好启用一侧」时才会做色彩检查，所以别的情况都不应该应用这个记录：
    // 两侧都启用 = 不检查颜色；两侧都不启用 = 整个作品都不会被保存
    const { downColorImg, downBlackWhiteImg } = settings
    if (downColorImg === downBlackWhiteImg) {
      return bySettings
    }

    // 记录记的是「当时没通过色彩检查的图片」，所以它的含义取决于当时保留的是哪一侧。
    // 同一侧：这些索引就是「不符合要求」的，减掉它们。
    // 换了一侧：这些索引正好是现在想要的（例如之前「只保留彩色」所以排除的是黑白图片，
    // 现在改成「只保留黑白」了），所以反过来用——只保留它们
    if (downColorImg === record.colorImg) {
      return bySettings.filter((index) => !record.indexes.includes(index))
    }
    return bySettings.filter((index) => record.indexes.includes(index))
  }

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
  /** 开始抓取时，储存页面此时的 id（只有部分页面类型会有这个值） */
  public pageId = ''
  /** 开始抓取时，储存页面此时的类型的字面量，如 Artwork、UserHome */
  public pageType = ''
  /** 开始抓取时，储存页面此时的 URL */
  public URLWhenCrawlStart = ''
  /** 抓取完成的时间 */
  public crawlCompleteTime: Date = new Date()

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

  /** 添加每个作品的数据。只需要传递有值的属性
   *
   * 如果一个作品有多张图片，只需要传递第一张图片的数据。后续图片的数据会根据设置自动生成
   */
  public addResult(data: ResultOptional, requestedIndexList?: number[]) {
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
      if (requestedIndexList) {
        indexList = requestedIndexList
      } else {
        // 没有指定时，按当前的多图作品设置和色彩检查结果算出要保存哪些图片
        // （多图作品设置的过滤在 getDownloadIndexes 里完成）
        indexList = this.getDownloadIndexes(meta)
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

  /** 从 idList 和抓取结果里移除指定的作品。返回值表示是否有作品被删除
   *
   * 目前只用于“手动排除作品”功能
   */
  public removeWorkById(ids: string[]) {
    // 记录删除前的 resultMeta / result 数量，用于判断是否真的发生了删除
    const beforeMetaLength = this.resultMeta.length
    const beforeResultLength = this.result.length

    for (const id of ids) {
      // 从 id 列表里移除（使用 id 字符串匹配）
      const idIndex = this.idList.findIndex((item) => item.id === id)
      if (idIndex !== -1) {
        this.idList.splice(idIndex, 1)
      }

      // 转换为数字 id 以便匹配 resultMeta / result
      const idNum = Number.parseInt(id)
      if (Number.isNaN(idNum)) {
        continue
      }

      // 从元数据里移除
      this.resultMeta = this.resultMeta.filter((r) => r.idNum !== idNum)
      // 从抓取结果里移除
      this.result = this.result.filter((r) => r.idNum !== idNum)

      // 从去重表移除，避免后续 addResult 因去重而拒绝重新加入
      const artworkIndex = this.artworkIDList.indexOf(idNum)
      if (artworkIndex !== -1) {
        this.artworkIDList.splice(artworkIndex, 1)
      }
      const novelIndex = this.novelIDList.indexOf(idNum)
      if (novelIndex !== -1) {
        this.novelIDList.splice(novelIndex, 1)
      }
    }

    // 只有确实从 resultMeta 或 result 里删除了数据时，才通知相关模块刷新
    if (
      this.resultMeta.length < beforeMetaLength ||
      this.result.length < beforeResultLength
    ) {
      EVT.fire('resultChange')
      return true
    }

    return false
  }

  /** 从抓取结果里移除指定的作品（会移除它的所有文件）。
   *
   * 与 removeWorkById 的区别：
   * - 不修改 idList；
   * - 不触发 resultChange 事件。
   *
   * 所以它适合在下载过程中调用：下载阶段修改 idList 没有意义，
   * 而 resultChange 会让 DownloadStates 重建状态列表，把下载进度清零。
   *
   * @param idNum 作品的数字 id
   * @returns 被移除的文件在 result 里原本的下标，升序排列。
   *          调用方需要用这些下标同步下载状态列表，保持两者一一对应。
   */
  public removeWorkFromResult(idNum: number): number[] {
    const removedIndexes: number[] = []
    this.result.forEach((result, index) => {
      if (result.idNum === idNum) {
        removedIndexes.push(index)
      }
    })

    this.result = this.result.filter((result) => result.idNum !== idNum)
    // resultMeta 里每个作品只有一条数据，单独移除
    this.resultMeta = this.resultMeta.filter((result) => result.idNum !== idNum)

    return removedIndexes
  }

  /** 根据 result 反向生成 resultMeta，并按 result 重建去重表。
   *
   * 用途：恢复未完成的下载时（见 Resume），过去只保存和恢复了 result，没有保存 resultMeta。
   * 而 result 是由 resultMeta 派生的，所以可以在这里反向还原它，
   * 让恢复之后“在结果中筛选”、预览列表等功能也能正常工作。
   *
   * 为什么不用 addResult() 重新添加一遍：addResult 会按当前的“多图作品”设置重新决定要下载
   * 哪些图片，导致恢复出来的结果和当初保存的不一致。所以这里只做纯数据还原。
   *
   * 同时按 result **反推**一份「被色彩检查排除的图片索引」（见 colorBlockedIndexes）。
   * 这只是给旧数据兜底：新数据会把精确的记录保存到 IndexedDB（见 Resume 的 TaskMeta.colorBlocked），恢复时由它覆盖。
   *
   * 这个方法可以重复调用（会先清空去重表和色彩排除记录）。
   */
  public restoreResultMetaFromResult() {
    const metaList: Result[] = []
    const addedIdList = new Set<number>()
    // 去重表也按 result 重建，避免重复调用时累积
    this.artworkIDList = []
    this.novelIDList = []
    // 色彩检查的排除记录同样按 result 重建（见下面 type 为 0/1 的分支）
    this.clearColorBlockedIndexes()

    // 先收集每个作品在 result 里保留了哪些图片索引，用于还原色彩检查的排除记录
    const keptIndexes = new Map<number, Set<number>>()
    for (const data of this.result) {
      if (data.type !== 0 && data.type !== 1) continue
      if (typeof data.index !== 'number') continue
      const kept = keptIndexes.get(data.idNum)
      if (kept) {
        kept.add(data.index)
      } else {
        keptIndexes.set(data.idNum, new Set([data.index]))
      }
    }

    for (const data of this.result) {
      // result 里同一个作品的多条数据是连续的，只取第一条
      if (addedIdList.has(data.idNum)) {
        continue
      }
      addedIdList.add(data.idNum)

      if (data.type === 3) {
        this.novelIDList.push(data.idNum)
      } else {
        this.artworkIDList.push(data.idNum)
      }

      if (data.type === 0 || data.type === 1) {
        // 插画、漫画：result 里的每条数据都是 resultMeta 的克隆，
        // 只有下面这些文件级字段被改过，需要还原回去
        const meta = { ...data, index: 0 }
        meta.id = `${data.idNum}_p0`
        meta.original = this.restoreP0InURL(data.original, data.idNum)
        meta.regular = this.restoreP0InURL(data.regular, data.idNum)
        meta.small = this.restoreP0InURL(data.small, data.idNum)
        meta.thumb = this.restoreP0InURL(data.thumb, data.idNum)
        metaList.push(meta)

        // 按 result 反推一份色彩检查的排除记录：result 里没有的图片索引就是当初被排除掉的。
        // 这样恢复之后再删除/筛选作品时，不会把被色彩排除的图片又加回来。
        //
        // ⚠️ 这只是**给旧数据兜底**：新数据会把精确的记录保存到 IndexedDB（见 Resume 的 TaskMeta.colorBlocked），
        // 恢复时用它覆盖这里的反推结果。
        // ⚠️ 反推也分不清「图片全都通过」和「从没检查过颜色」，所以只在 blocked 非空时才记（与 SaveArtworkData 不同）
        // ⚠️ 反推分不清「被色彩排除」和「被多图作品设置排除」，所以旧数据恢复之后如果放宽那些设置，
        // 它们不会回来（无法区分两者，只能一起当成已排除）
        const kept = keptIndexes.get(data.idNum)
        if (kept && kept.size > 0) {
          const blocked: number[] = []
          for (let i = 0; i < data.pageCount; i++) {
            if (!kept.has(i)) {
              blocked.push(i)
            }
          }
          if (blocked.length > 0) {
            this.setColorBlockedIndexes(data.idNum, blocked)
          }
        }
      } else {
        // 动图、小说只有一个文件，result 里的数据就是 resultMeta 本身
        metaList.push(data)
      }
    }

    this.resultMeta = metaList
  }

  /** 把图片链接里的 pN 还原成 p0。以作品 id 作为锚点，避免改到 URL 里的其他部分 */
  private restoreP0InURL(url: string, idNum: number) {
    if (!url) {
      return url
    }
    return url.replace(new RegExp(`${idNum}_p\\d+`), `${idNum}_p0`)
  }

  /** 根据抓取结果构造出 bookmarkData 对象。
   *
   * result 里没有保存原本的 bookmarkData 对象，只保存了书签 ID（bmkId）和是否已收藏（bookmarked）。
   * 返回值有三种情况：
   * - undefined：抓取结果里没有收藏状态的数据（例如手动编辑过的导入文件），让过滤器跳过这项检查
   * - null：未收藏
   * - 对象：已收藏，id 就是书签 ID */
  public createBookmarkDataFromResult(result: Result):
    | undefined
    | null
    | {
        id: string
        private: boolean
      } {
    // 没有收藏状态的数据时返回 undefined
    if (result.bookmarked === undefined) {
      return undefined
    }
    // 未收藏时返回 null
    if (!result.bookmarked) {
      return null
    }
    return {
      id: result.bmkId,
      // 注意：下载器目前的抓取结果里并没有保存收藏的公开/私密状态。这里默认设为 false（公开收藏）
      private: false,
    }
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
    this.pageId = Tools.getPageIdFromURL()
    this.pageType = pageType.list[pageType.type]
  }

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.URLWhenCrawlStart = window.location.href
      this.reset()
      // 新一轮抓取会有全新的结果，上次的色彩检查记录不再适用。
      // ⚠️ 必须写在这里而不是 reset() 里：reAddResult 也会调用 reset()，在那里清会丢掉本次抓取的结果
      this.clearColorBlockedIndexes()
    })

    // 停止下载时，清空等待下载的任务
    window.addEventListener(EVT.list.downloadStop, () => {
      this.waitingIdList = []
    })

    window.addEventListener(EVT.list.resume, () => {
      this.tag = Tools.getTagFromURL()
      this.title = Tools.getPageTitle()
      this.pageId = Tools.getPageIdFromURL()
      this.pageType = pageType.list[pageType.type]
    })
  }
}

const store = new Store()
export { store }
