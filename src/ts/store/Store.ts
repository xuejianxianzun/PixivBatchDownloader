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

  public resultMeta: Result[] = [] // 储存抓取结果的元数据。
  // 当用于图片作品时，它可以根据每个作品需要下载多少张，生成每一张图片的信息

  private artworkIDList: number[] = [] // 储存抓取到的图片作品的 id 列表，用来避免重复添加
  private novelIDList: number[] = [] // 储存抓取到的小说作品的 id 列表，用来避免重复添加

  public result: Result[] = [] // 储存抓取结果

  private rankList: RankList = {} // 储存作品在排行榜中的排名

  public tag = '' // 开始抓取时，储存页面此时的 tag

  public title = '' // 开始抓取时，储存页面此时的 title

  public crawlCompleteTime: Date = new Date()

  private assignResult(data: ResultOptional) {
    // 抓取结果的默认值
    const dataDefault: Result = {
      idNum: 0,
      id: '',
      original: '',
      thumb: '',
      regular: '',
      small: '',
      title: '',
      pageCount: 1,
      dlCount: 1,
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
      date: '',
      type: 0,
      rank: null,
      ugoiraInfo: null,
      seriesTitle: null,
      seriesOrder: null,
      novelMeta: null,
      likeCount: 0,
      viewCount: 0,
      commentCount: 0,
      xRestrict: 0,
      sl: null,
    }

    return Object.assign(dataDefault, data)
  }

  // 计算要从这个作品里下载几张图片
  private getDLCount(pageCount: number) {
    if (settings.firstFewImagesSwitch && settings.firstFewImages <= pageCount) {
      return settings.firstFewImages
    }
    return pageCount
  }

  // 添加每个作品的信息。只需要传递有值的属性
  // 如果一个作品有多张图片，只需要传递第一张图片的数据。后面的数据会根据设置自动生成
  public addResult(data: ResultOptional) {
    // 检查该作品数据是否已存在，已存在则不添加
    if (data.type === 3) {
      if (data.idNum !== undefined) {
        if (this.novelIDList.includes(data.idNum)) {
          return
        }
        this.novelIDList.push(data.idNum)
      }
    } else {
      if (data.idNum !== undefined) {
        if (this.artworkIDList.includes(data.idNum)) {
          return
        }
        this.artworkIDList.push(data.idNum)
      }
    }

    // 添加该作品的元数据
    const result = this.assignResult(data)

    // 设置这个作品要下载的数量
    if (result.type === 0 || result.type === 1) {
      result.dlCount = this.getDLCount(result.pageCount)
    }

    this.resultMeta.push(result)
    EVT.fire(EVT.list.addResult, result)

    if (result.type === 3) {
      // 小说作品直接添加到结果里
      this.result.push(result)
    } else {
      // 图片作品循环添加该作品里每一个图片文件的数据
      for (let i = 0; i < result.dlCount; i++) {
        const result = this.assignResult(data)
        result.idNum = parseInt(result.id)
        result.id = result.id + `_p${i}`
        result.original = result.original.replace('p0', 'p' + i)
        result.regular = result.regular.replace('p0', 'p' + i)
        result.small = result.small.replace('p0', 'p' + i)
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

  public reset() {
    this.resultMeta = []
    this.artworkIDList = []
    this.novelIDList = []
    this.result = []
    this.idList = []
    this.rankList = {}
    this.tag = Tools.getTagFromURL()
    this.title = Tools.getTitle()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.reset()
    })

    window.addEventListener(EVT.list.resume, () => {
      this.tag = Tools.getTagFromURL()
      this.title = Tools.getTitle()
    })
  }
}

const store = new Store()
export { store }
