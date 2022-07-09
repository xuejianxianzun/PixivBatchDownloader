import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { Tools } from '../Tools'
import { Result, ResultOptional, RankList, IDData } from './StoreType'

// 储存抓取结果
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

  public remainingDownload = 0 // 剩余多少个等待下载和保存的文件

  private rankList: RankList = {} // 储存作品在排行榜中的排名

  public tag = '' // 开始抓取时，储存页面此时的 tag

  public title = '' // 开始抓取时，储存页面此时的 title

  public crawlCompleteTime: Date = new Date()

  private readonly fileDataDefault: Result = {
    idNum: 0,
    id: '',
    original: '',
    thumb: '',
    regular: '',
    small: '',
    title: '',
    description: '',
    pageCount: 1,
    dlCount: 1,
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

  // 计算要从这个作品里下载几张图片
  private getDLCount(pageCount: number) {
    if (settings.firstFewImagesSwitch) {
      return Math.min(pageCount, settings.firstFewImages)
    } else {
      return pageCount
    }
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
      workData.dlCount = this.getDLCount(workData.pageCount)
      workData.id = workData.idNum + `_p0`
    } else {
      workData.id = workData.idNum.toString()
    }

    this.resultMeta.push(workData)

    EVT.fire('addResult', workData)

    // 把该作品里的每个文件的数据添加到结果里
    if (workData.type === 2 || workData.type === 3) {
      // 动图和小说作品直接添加
      this.result.push(workData)
    } else {
      // 插画和漫画
      // 循环生成每一个图片文件的数据
      const p0 = 'p0'
      for (let i = 0; i < workData.dlCount; i++) {
        // 不下载多图作品的最后一张图片
        if (
          settings.doNotDownloadLastImageOfMultiImageWork &&
          i > 0 &&
          i === workData.pageCount - 1
        ) {
          continue
        }
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
