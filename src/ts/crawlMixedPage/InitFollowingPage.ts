// 初始化关注页面、好 P 友页面、粉丝页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Language'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'
import { states } from '../store/States'
import { setTimeoutWorker } from '../SetTimeoutWorker'
import { settings } from '../setting/Settings'
import { pageType } from '../PageType'
import { crawlLatestFewWorks } from '../crawl/CrawlLatestFewWorks'
import { exportFollowingList } from '../pageFunciton/ExportFollowingList'
import { batchFollowUser } from '../pageFunciton/BatchFollowUser'

// 页面子类型：我的关注 | 我的好 P 友 | 我的粉丝
type PageType = 'following' | 'mypixiv' | 'followers'

class InitFollowingPage extends InitPageBase {
  constructor() {
    super()
    this.getPageType()
    this.init()
  }

  private baseOffset = 0 // 开始抓取时，记录初始的偏移量
  private readonly onceNumber = 24 // 每页 24 个画师

  private pageType: PageType = 'following'
  private getUserListNo = 0 // 获取用户列表时，记录请求的次数
  private readonly limit = 100 // 每次请求多少个用户

  private totalNeed = Number.MAX_SAFE_INTEGER
  private crawlUserID = ''
  private rest: 'show' | 'hide' = 'show'
  private tag = ''

  private userList: string[] = []
  private index = 0 // getIdList 时，对 userList 的索引

  private getPageType() {
    const allType: PageType[] = ['following', 'mypixiv', 'followers']
    for (const type of allType) {
      if (window.location.pathname.includes('/' + type)) {
        this.pageType = type
        break
      }
    }
  }

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_默认下载多页',
      'startCrawlingInFollowingPage'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })

    Tools.addBtn(
      'crawlBtns',
      Colors.bgGreen,
      '_导出关注列表CSV',
      '',
      'exportFollowingListCSV'
    ).addEventListener('click', () => {
      exportFollowingList.start('csv')
    })

    const exportButton = Tools.addBtn(
      'crawlBtns',
      Colors.bgGreen,
      '_导出关注列表JSON',
      '',
      'exportFollowingListJSON'
    )
    exportButton.addEventListener('click', () => {
      exportFollowingList.start('json')
    })

    const batchFollowButton = Tools.addBtn(
      'crawlBtns',
      Colors.bgGreen,
      '_批量关注用户',
      '',
      'batchFollowUser'
    )
    batchFollowButton.addEventListener('click', async () => {
      batchFollowUser.start()
    })
  }

  protected getWantPage() {
    this.crawlNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlNumber === -1) {
      log.warning(lang.transl('_下载所有页面'))
    } else {
      log.warning(
        lang.transl('_从本页开始下载x页', this.crawlNumber.toString())
      )
    }
  }

  protected nextStep() {
    this.setSlowCrawl()
    this.readyGet()
    log.log(lang.transl('_正在抓取'))
    this.getPageType()
    this.getUserList()
  }

  protected readyGet() {
    this.rest = location.href.includes('rest=hide') ? 'hide' : 'show'
    this.tag = Utils.getURLPathField(window.location.pathname, 'following')

    // 获取抓取开始时的页码
    const nowPage = Utils.getURLSearchField(location.href, 'p')
    // 计算开始抓取时的偏移量
    if (nowPage !== '') {
      this.baseOffset = (parseInt(nowPage) - 1) * this.onceNumber
    } else {
      this.baseOffset = 0
    }

    // 要抓取多少个用户
    this.totalNeed = Number.MAX_SAFE_INTEGER
    if (this.crawlNumber !== -1) {
      this.totalNeed = this.onceNumber * this.crawlNumber
    }

    // 获取当前页面的用户 id
    const test = /users\/(\d*)\//.exec(location.href)
    if (test && test.length > 1) {
      this.crawlUserID = test[1]
    } else {
      const msg = `Get the user's own id failed`
      log.error(msg, 2)
      throw new Error(msg)
    }
  }

  // 获取用户列表
  private async getUserList() {
    if (states.stopCrawl) {
      return this.getUserListComplete()
    }

    const offset = this.baseOffset + this.getUserListNo * this.limit

    let res
    try {
      switch (this.pageType) {
        case 'following':
          res = await API.getFollowingList(
            this.crawlUserID,
            this.rest,
            this.tag,
            offset
          )
          break
        case 'mypixiv':
          res = await API.getMyPixivList(this.crawlUserID, offset)
          break
        case 'followers':
          res = await API.getFollowersList(this.crawlUserID, offset)
          break
      }
    } catch {
      this.getUserList()
      return
    }

    if (states.stopCrawl) {
      return this.getUserListComplete()
    }

    const users = res.body.users

    if (users.length === 0) {
      // 用户列表抓取完毕
      return this.getUserListComplete()
    }

    for (const userData of users) {
      this.userList.push(userData.userId)

      if (this.userList.length >= this.totalNeed) {
        // 抓取到了指定数量的用户
        return this.getUserListComplete()
      }
    }

    log.log(
      lang.transl('_当前有x个用户', this.userList.length.toString()),
      1,
      false
    )

    this.getUserListNo++
    this.getUserList()
  }

  private async getUserListComplete() {
    log.log(lang.transl('_当前有x个用户', this.userList.length.toString()))

    if (this.userList.length === 0) {
      return this.getIdListFinished()
    }

    this.getIdList()
  }

  // 获取用户 id 列表
  protected async getIdList() {
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    let idList = []
    try {
      idList = await API.getUserWorksByType(this.userList[this.index])
      idList = crawlLatestFewWorks.filter(idList)
    } catch {
      this.getIdList()
      return
    }

    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    store.idList = store.idList.concat(idList)

    this.index++

    log.log(
      `${lang.transl('_已抓取x个用户', this.index.toString())}, ${lang.transl(
        '_当前作品个数',
        store.idList.length.toString()
      )}`,
      1,
      false
    )

    if (this.index >= this.userList.length) {
      return this.getIdListFinished()
    }

    if (states.slowCrawlMode) {
      setTimeoutWorker.set(() => {
        this.getIdList()
      }, settings.slowCrawlDealy)
    } else {
      this.getIdList()
    }
  }

  protected resetGetIdListStatus() {
    this.userList = []
    this.getUserListNo = 0
    this.index = 0
  }

  protected sortResult() {
    // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
    store.result.sort(Utils.sortByProperty('id'))
  }
}
export { InitFollowingPage }
