// 仓库
import { EVT } from './EVT'
import { WorkInfo, WorkInfoOptional, RankList } from './Store.d'

// 存储抓取结果和状态
class Store {
  constructor() {
    const allowWorkTrue = [
      EVT.events.crawlFinish,
      EVT.events.crawlEmpty,
      EVT.events.crawlError,
      EVT.events.downloadPause,
      EVT.events.downloadStop,
    ]

    allowWorkTrue.forEach((type) => {
      window.addEventListener(type, () => {
        this.states.allowWork = true
      })
    })

    const allowWorkFalse = [EVT.events.crawlStart, EVT.events.downloadStart]

    allowWorkFalse.forEach((type) => {
      window.addEventListener(type, () => {
        this.states.allowWork = false
      })
    })

    window.addEventListener(EVT.events.crawlStart, () => {
      this.resetResult()
    })

    window.addEventListener(EVT.events.downloadComplete, () => {
      this.resetStates()
    })
  }

  public resultMeta: WorkInfo[] = [] // 储存抓取结果的元数据。它可以根据每个作品需要下载多少张，生成每一张图片的信息

  private resultIDList: number[] = [] // 储存抓取结果的元数据的 id 列表，用来判断该作品是否已经添加过了，避免重复添加

  public result: WorkInfo[] = [] // 储存抓取结果

  /*
   id - 其实是默认名，包含两部分：id + 序号，如 44920385_p0。动图只有 id 没有序号
   url - 图片大图的 url
   title - 作品的标题
   tags - 作品的 tag 列表
   tagsTranslated - 作品的 tag 列表，附带翻译后的 tag（如果有）
   user - 作品的画师名字
   userid - 作品的画师id
   fullWidth - 第一张图片的宽度
   fullHeight - 第一张图片的高度
   ext - 图片下载时使用的后缀名
   bmk - 作品的收藏数量
   date - 作品的创建日期，格式为 yyyy-MM-dd。如 2019-08-29
   type - 作品的类型，分为 illustration、manga、ugoira
   rank - 作品在排行榜中的排名
   ugoiraInfo - 当作品是动图时才有值，包含 frames（数组）和 mimeType（string）属性
   */

  private assignResult(data: WorkInfoOptional) {
    // 图片详细信息的默认值
    const dataDefault: WorkInfo = {
      idNum: 0,
      id: '',
      url: '',
      thumb: '',
      title: '',
      pageCount: 1,
      dlCount: 1,
      tags: [],
      tagsTranslated: [],
      user: '',
      userid: '',
      fullWidth: 0,
      fullHeight: 0,
      ext: '',
      bmk: 0,
      bookmarked: false,
      date: '',
      type: 0,
      rank: '',
      ugoiraInfo: null,
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

    // 添加该作品里每一张图片的数据
    for (let i = 0; i < result.dlCount; i++) {
      const result = this.assignResult(data)
      result.idNum = parseInt(result.id)
      result.id = result.id + `_p${i}`
      result.url = result.url.replace('p0', 'p' + i)
      this.result.push(result)
    }
  }

  public idList: string[] = [] // 储存从列表中抓取到的作品的 id

  private rankList: RankList = {} // 储存作品在排行榜中的排名

  public getRankList(index: string) {
    return this.rankList[index]
  }

  public setRankList(id: string, rank: string) {
    this.rankList[id] = rank
  }

  // 储存和下载有关的状态
  public states = {
    allowWork: true, // 当前是否允许展开工作（如果抓取未完成、下载未完成则应为 false
    quickDownload: false, // 快速下载当前作品，这个只在作品页内直接下载时使用
    notAutoDownload: false, // 抓取完成后，不自动开始下载
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

  public resetStates() {
    this.states.allowWork = true
    this.states.quickDownload = false
  }
}

const store = new Store()
export { store }
