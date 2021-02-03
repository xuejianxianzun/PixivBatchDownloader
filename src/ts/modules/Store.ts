import { API } from './API'
import { EVT } from './EVT'
import { DOM } from './DOM'
import { Result, ResultOptional, RankList, IDData } from './Store.d'

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
    // 图片详细信息的默认值
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
      rank: '',
      ugoiraInfo: null,
      seriesTitle: null,
      seriesOrder: null,
      novelMeta: null,
      likeCount: 0,
      viewCount: 0,
      commentCount: 0,
    }

    return Object.assign(dataDefault, data)
  }

  // 添加每个作品的信息。只需要传递有值的属性
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
    this.resultMeta.push(result)
    EVT.fire(EVT.list.addResult, result)

    if (result.type === 3) {
      this.result.push(result)
    } else {
      // 添加该作品里每一张图片的数据
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

  public setRankList(id: string, rank: string) {
    this.rankList[id] = rank
  }

  public reset() {
    this.resultMeta = []
    this.artworkIDList = []
    this.novelIDList = []
    this.result = []
    this.idList = []
    this.rankList = {}
    this.tag = API.getTagFromURL()
    this.title = DOM.getTitle()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.reset()
    })

    window.addEventListener(EVT.list.resume, () => {
      this.tag = API.getTagFromURL()
      this.title = DOM.getTitle()
    })
  }
}

const store = new Store()
export { store }
