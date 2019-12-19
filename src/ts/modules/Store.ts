// 仓库
import { EVT } from './EVT'
import { WorkInfo, WorkInfoOptional, RankList } from './Store.d'

// 存储抓取结果和状态
class Store {
  constructor() {
    const trueEvents = [
      EVT.events.crawlFinish,
      EVT.events.crawlEmpty,
      EVT.events.crawlError,
      EVT.events.downloadPause,
      EVT.events.downloadStop
    ]

    trueEvents.forEach(type => {
      window.addEventListener(type, () => {
        this.states.allowWork = true
      })
    })

    const falseEvents = [EVT.events.crawlStart, EVT.events.downloadStart]

    falseEvents.forEach(type => {
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

  public result: WorkInfo[] = [] // 储存图片信息

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

  // 添加每个图片的信息。只需要传递有值的属性
  public addResult(data: WorkInfoOptional) {
    // 图片详细信息的默认值
    const dataDefault: WorkInfo = {
      id: '',
      url: '',
      title: '',
      tags: [],
      tagsTranslated: [],
      user: '',
      userid: '',
      fullWidth: 0,
      fullHeight: 0,
      ext: '',
      bmk: 0,
      date: '',
      type: 0,
      rank: '',
      ugoiraInfo: null
    }

    this.result.push(Object.assign(dataDefault, data))
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
    quickDownload: false // 快速下载当前作品，这个只在作品页内直接下载时使用
  }

  // 储存页面信息，用来生成文件名
  public pageInfo = {
    pageUserName: '',
    pageUserID: '',
    pageTag: ''
  }

  public resetResult() {
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
