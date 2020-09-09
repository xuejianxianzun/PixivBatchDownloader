import { EVT } from './EVT'
import { Result, WorkInfoOptional, RankList, IDData } from './Store.d'

// 储存抓取结果
class Store {
  constructor() {
    window.addEventListener(EVT.events.crawlStart, () => {
      this.resetResult()
    })
  }

  public idList: IDData[] = [] // 储存从列表中抓取到的作品的 id

  public resultMeta: Result[] = [] // 储存抓取结果的元数据。
  // 当用于图片作品时，它可以根据每个作品需要下载多少张，生成每一张图片的信息

  private resultIDList: number[] = [] // 储存抓取结果的元数据的 id 列表，用来判断该作品是否已经添加过了，避免重复添加
  // resultIDList 可能会有隐患，因为没有区分图片和小说。如果一次抓取任务里，有图片和小说使用了相同的 id，那么只会保留先抓取到的那个。不过目前看来这种情况几乎不会发生。

  public result: Result[] = [] // 储存抓取结果

  private assignResult(data: WorkInfoOptional) {
    // 图片详细信息的默认值
    const dataDefault: Result = {
      idNum: 0,
      id: '',
      url: '',
      thumb: '',
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
      novelBlob: null,
    }

    return Object.assign(dataDefault, data)
  }

  // 添加每个作品的信息。只需要传递有值的属性
  public addResult(data: WorkInfoOptional) {
    // 检查该作品数据是否已存在，已存在则不添加
    if (data.idNum !== undefined && this.resultIDList.includes(data.idNum)) {
      return
    }

    if (data.idNum !== undefined) {
      this.resultIDList.push(data.idNum)
    }

    // 添加该作品的元数据
    const result = this.assignResult(data)
    this.resultMeta.push(result)
    EVT.fire(EVT.events.addResult, result)

    if (result.type === 3) {
      this.result.push(result)
    } else {
      // 添加该作品里每一张图片的数据
      for (let i = 0; i < result.dlCount; i++) {
        const result = this.assignResult(data)
        result.idNum = parseInt(result.id)
        result.id = result.id + `_p${i}`
        result.url = result.url.replace('p0', 'p' + i)
        this.result.push(result)
      }
    }
  }

  private rankList: RankList = {} // 储存作品在排行榜中的排名

  public getRankList(index: string) {
    return this.rankList[index]
  }

  public setRankList(id: string, rank: string) {
    this.rankList[id] = rank
  }

  // 储存页面信息，用来生成文件名
  public pageInfo = {
    pageTitle: '',
    pageTag: '',
  }

  public resetResult() {
    this.resultMeta = []
    this.resultIDList = []
    this.result = []
    this.idList = []
    this.rankList = {}
  }
}

const store = new Store()
export { store }
