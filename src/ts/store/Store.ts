import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { Tools } from '../Tools'
import { Result, ResultOptional, RankList, IDData } from './StoreType'

// 生成抓取结果
class Store {
  constructor() {
    this.bindEvents()
  }

  public idList: IDData[] = [] // 储存从列表中抓取到的作品的 id

  public waitingIdList: IDData[] = [] // 下载器尚未完成本次下载时，如果有新的下载请求，则添加到这里，下载完成后再处理

  public resultMeta: Result[] = [] // 储存抓取结果的元数据。
  // 当用于图片作品时，它可以根据每个作品需要下载多少张，生成每一张图片的信息

  /**系列小说的设定资料 */
  public novelSeriesGlossary = ''

  private artworkIDList: number[] = [] // 储存抓取到的图片作品的 id 列表，用来避免重复添加
  private novelIDList: number[] = [] // 储存抓取到的小说作品的 id 列表，用来避免重复添加

  public result: Result[] = [] // 储存抓取结果

  /**记录从每个作品里下载多少个文件 */
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

  public remainingDownload = 0 // 剩余多少个等待下载和保存的文件

  private rankList: RankList = {} // 储存作品在排行榜中的排名

  public tag = '' // 开始抓取时，储存页面此时的 tag

  public title = '' // 开始抓取时，储存页面此时的 title

  public URLWhenCrawlStart = '' // 开始抓取时，储存页面此时的 URL

  public crawlCompleteTime: Date = new Date()

  /**只下载作品里的一部分图片 */
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

  private readonly fileDataDefault: Result = {
    aiType: 0,
    idNum: 0,
    id: '',
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

  // 添加每个作品的信息。只需要传递有值的属性
  // 如果一个作品有多张图片，只需要传递第一张图片的数据。后面的数据会根据设置自动生成
  public addResult(data: ResultOptional) {
    // 检查该作品 id 是否已存在，已存在则不添加
    const useList = data.type === 3 ? this.novelIDList : this.artworkIDList
    if (data.idNum !== undefined) {
      if (useList.includes(data.idNum)) {
        return
      }
      useList.push(data.idNum)
    }

    // 添加该作品的元数据
    const workData = Object.assign({}, this.fileDataDefault, data)
    // 注意：由于 Object.assign 不是深拷贝，所以不可以修改 result 的引用类型数据，否则会影响到源对象
    // 可以修改基础类型的数据

    if (workData.type === 0 || workData.type === 1) {
      workData.id = workData.idNum + `_p0`
    } else {
      workData.id = workData.idNum.toString()
    }

    this.resultMeta.push(workData)

    EVT.fire('addResult', workData)

    // 保存这个作品里每个文件的数据
    if (workData.type === 2 || workData.type === 3) {
      // 动图和小说作品直接添加
      this.result.push(workData)

      this.downloadCount[workData.idNum] = 1
    } else {
      // 插画和漫画

      // 储存需要下载的图片的索引
      let fileIndexList: number[] = []

      // 只下载部分图片
      if (this.downloadOnlyPart[workData.idNum]) {
        fileIndexList = this.downloadOnlyPart[workData.idNum]
        delete this.downloadOnlyPart[workData.idNum]
      } else {
        // 下载全部图片
        let total = workData.pageCount

        // 如果下载全部图片，则检查一些过滤器
        // 只下载部分图片时，用户已经手动指定了要下载的图片，所以不要检查这些过滤器

        // 多图作品只下载前几张图片
        if (settings.firstFewImagesSwitch) {
          total = Math.min(workData.pageCount, settings.firstFewImages)
        }

        // 不抓取多图作品的最后一张图片
        if (
          settings.doNotDownloadLastImageOfMultiImageWork &&
          workData.pageCount > 1
        ) {
          total = Math.min(total, workData.pageCount - 1)
        }

        // 特定用户的多图作品不下载最后几张图片
        if (workData.pageCount > 1) {
          const removeLastFew = settings.DoNotDownloadLastFewImagesList.find(
            (item) => item.uid === Number.parseInt(workData.userId)
          )

          if (removeLastFew && removeLastFew.value > 0) {
            let number = workData.pageCount - removeLastFew.value
            if (number < 1) {
              // 用户设置的值有可能把这个作品的图片全部排除了，此时只跳过最后一张
              number = workData.pageCount - 1
            }
            total = Math.min(total, number)
          }
        }

        for (let i = 0; i < total; i++) {
          fileIndexList.push(i)
        }
      }

      this.downloadCount[workData.idNum] = fileIndexList.length

      // 生成每个图片的数据
      const p0 = 'p0'
      for (const i of fileIndexList) {
        const fileData = Object.assign({}, workData)
        const pi = 'p' + i
        fileData.index = i
        fileData.id = fileData.id.replace(p0, pi)
        fileData.original = fileData.original.replace(p0, pi)
        fileData.regular = fileData.regular.replace(p0, pi)
        fileData.small = fileData.small.replace(p0, pi)
        fileData.thumb = fileData.thumb.replace(p0, pi)
        this.result.push(fileData)
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
    for (const result of this.result) {
      if (result.id === id) {
        return result
      }
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
    this.novelSeriesGlossary = ''
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
