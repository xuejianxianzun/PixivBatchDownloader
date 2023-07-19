// 初始化关注页面、好 P 友页面、粉丝页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { Tools } from '../Tools'
import { createCSV } from '../utils/CreateCSV'
import { Utils } from '../utils/Utils'
import { states } from '../store/States'
import { Config } from '../Config'
import { setTimeoutWorker } from '../SetTimeoutWorker'
import { toast } from '../Toast'
import { showHelp } from '../ShowHelp'
import { msgBox } from '../MsgBox'
import { token } from '../Token'
import { EVT } from '../EVT'

interface UserInfo {
  userId: string
  userName: string
  homePage: string
  userComment: string
  profileImageUrl: string
}

type PageType = 0 | 1 | 2

class InitFollowingPage extends InitPageBase {
  constructor() {
    super()
    this.getPageType()
    this.init()
  }

  private baseOffset = 0 // 开始抓取时，记录初始的偏移量
  private readonly onceNumber = 24 // 每页 24 个画师

  private pageType: PageType = 0 // 页面子类型
  // 0 我的关注
  // 1 我的好 P 友
  // 2 我的粉丝

  private getUserListNo = 0 // 获取用户列表时，记录请求的次数
  private readonly limit = 100 // 每次请求多少个用户

  private totalNeed = Number.MAX_SAFE_INTEGER
  private crawlUserID = ''
  private rest: 'show' | 'hide' = 'show'
  private tag = ''

  private userList: string[] = []

  private index = 0 // getIdList 时，对 userList 的索引

  private task: 'crawl' | 'exportCSV' | 'exportJSON' | 'batchFollow' = 'crawl'

  private CSVData: UserInfo[] = [] // 储存用户列表，包含 id 和用户名

  private importFollowedUserIDs: string[] = []

  private readonly homePrefix = 'https://www.pixiv.net/users/' // 用户主页的通用链接前缀

  private getPageType() {
    const pathname = window.location.pathname
    if (pathname.includes('/following')) {
      this.pageType = 0
    } else if (pathname.includes('/mypixiv')) {
      this.pageType = 1
    } else if (pathname.includes('/followers')) {
      this.pageType = 2
    }
  }

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_默认下载多页'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })

    Tools.addBtn(
      'crawlBtns',
      Colors.bgGreen,
      '_导出关注列表CSV'
    ).addEventListener('click', () => {
      this.task = 'exportCSV'
      this.readyCrawl()
    })

    const exportButton = Tools.addBtn(
      'crawlBtns',
      Colors.bgGreen,
      '_导出关注列表'
    )
    exportButton.addEventListener('click', () => {
      this.task = 'exportJSON'
      this.readyCrawl()
    })
    exportButton.addEventListener('mouseenter', () => {
      showHelp.show(
        'tipExportFollowingUserList',
        lang.transl('_导入导出关注用户列表的说明')
      )
    })

    const batchFollowButton = Tools.addBtn(
      'crawlBtns',
      Colors.bgGreen,
      '_批量关注用户'
    )
    batchFollowButton.addEventListener('click', async () => {
      if (states.busy) {
        return toast.error(lang.transl('_当前任务尚未完成'))
      }

      if (store.loggedUserID === '') {
        return msgBox.error(lang.transl('_作品页状态码401'))
      }

      EVT.fire('clearLog')

      log.log(lang.transl('_批量关注用户'))
      this.importFollowedUserIDs = await this.importUserList()
      log.log(
        lang.transl('_导入的用户ID数量') + this.importFollowedUserIDs.length
      )
      if (this.importFollowedUserIDs.length === 0) {
        return log.success(lang.transl('_本次任务已全部完成'))
      }

      // 导入关注列表后，需要获取关注的所有用户列表，以便在添加关注时跳过已关注的，节约时间
      this.task = 'batchFollow'

      states.slowCrawlMode = true
      states.stopCrawl = false

      EVT.fire('crawlStart')

      // 批量添加关注时，获取所有关注的用户
      this.crawlNumber = -1
      // 把页面类型设置为 0，始终获取关注的用户列表
      this.pageType = 0

      log.log(lang.transl('_正在加载关注用户列表'))
      this.readyGet()

      // 始终抓取自己的关注列表，而非别人的，因为添加关注时，需要和自己的关注列表进行对比
      this.crawlUserID = store.loggedUserID

      this.getUserList()
    })
    batchFollowButton.addEventListener('mouseenter', () => {
      showHelp.show(
        'tipExportFollowingUserList',
        lang.transl('_导入导出关注用户列表的说明')
      )
    })
  }

  protected setFormOption() {
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: '_抓取多少页面',
      tip: '_从本页开始下载提示',
      rangTip: '_数字提示1',
    })
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_从本页开始下载x页'),
      lang.transl('_下载所有页面')
    )
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
        case 0:
          res = await API.getFollowingList(
            this.crawlUserID,
            this.rest,
            this.tag,
            offset
          )
          break
        case 1:
          res = await API.getMyPixivList(this.crawlUserID, offset)
          break
        case 2:
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

      if (this.task === 'exportCSV') {
        this.CSVData.push({
          userId: userData.userId,
          userName: userData.userName,
          homePage: this.homePrefix + userData.userId,
          userComment: userData.userComment,
          profileImageUrl: userData.profileImageUrl,
        })
      }

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

    if (this.task === 'exportCSV') {
      this.exportCSV()
      const msg = '✓ ' + lang.transl('_导出关注列表CSV')
      log.success(msg)
      toast.success(msg)

      this.stopCrawl()
      return
    }

    if (this.task === 'exportJSON') {
      this.exportJSON()
      const msg = '✓ ' + lang.transl('_导出关注列表')
      log.success(msg)
      toast.success(msg)

      this.stopCrawl()
      return
    }

    if (this.task === 'batchFollow') {
      await this.batchFollow()
      this.stopCrawl()
      return
    }

    this.getIdList()
  }

  private stopCrawl() {
    states.slowCrawlMode = false
    states.busy = false

    this.resetGetIdListStatus()

    EVT.fire('stopCrawl')
  }

  private exportCSV() {
    // 添加用户信息
    const data: string[][] = this.CSVData.map((item) => {
      return Object.values(item)
    })

    // 添加用户信息的标题字段
    data.unshift(Object.keys(this.CSVData[0]))

    const csv = createCSV.create(data)
    const csvURL = URL.createObjectURL(csv)

    const csvName = Tools.getPageTitle()

    Utils.downloadFile(csvURL, Utils.replaceUnsafeStr(csvName) + '.csv')
  }

  private exportJSON() {
    const blob = Utils.json2Blob(this.userList)
    const url = URL.createObjectURL(blob)
    Utils.downloadFile(
      url,
      `following list-toal ${
        this.userList.length
      }-from user ${Utils.getURLPathField(
        window.location.pathname,
        'users'
      )}-${Utils.replaceUnsafeStr(new Date().toLocaleString())}.json`
    )
    URL.revokeObjectURL(url)
  }

  private async importUserList(): Promise<string[]> {
    return new Promise(async (resolve) => {
      const loadedJSON = (await Utils.loadJSONFile().catch((err) => {
        return msgBox.error(err)
      })) as string[]
      if (!loadedJSON) {
        return resolve([])
      }

      // 要求是数组并且为 string[]
      if (
        !Array.isArray(loadedJSON) ||
        loadedJSON.length === 0 ||
        typeof loadedJSON[0] !== 'string'
      ) {
        toast.error(lang.transl('_格式错误'))
        return resolve([])
      }

      return resolve(loadedJSON)
    })
  }

  private async batchFollow(): Promise<void> {
    return new Promise(async (resolve) => {
      const taskName = lang
        .transl('_批量关注用户')
        .replace('（JSON）', '')
        .replace('(JSON)', '')
      log.success(taskName)
      log.warning(lang.transl('_慢速执行以避免引起429错误'))

      let followed = 0
      let number = 0
      const total = this.importFollowedUserIDs.length
      for (const userID of this.importFollowedUserIDs) {
        number++
        log.log(`${number} / ${total}`, 1, false)
        if (this.userList.includes(userID) === false) {
          await this.addFollow(userID)
        } else {
          followed++
        }
      }
      console.log('followed, not send request', followed)

      log.success('✓ ' + taskName)
      msgBox.success('✓ ' + taskName)
      return resolve()
    })
  }

  private retryUpdateToken = false
  private async addFollow(userID: string) {
    return new Promise(async (resolve) => {
      const status = await API.addFollowingUser(userID, token.token)
      if (status !== 200) {
        if (this.retryUpdateToken === true) {
          log.error(`Error: ${userID} Status: ${status}`)
        } else {
          // 404 有两种可能的原因：
          // 1. token 无效
          // 2. 该用户不存在
          // 404 时尝试重新获取 token，然后重试请求（仅执行一次）
          if (status === 404) {
            this.retryUpdateToken = true
            await token.reset()
            await API.addFollowingUser(userID, token.token)
          } else {
            log.error(`Error: ${userID} Status: ${status}`)
          }
        }
      }

      // 慢速执行
      // 关注用户的 API 也会触发 429 错误，此时获取作品数据的话会返回 429，
      // 但是关注用户的 API 依然返回 200，并且返回值也正常，但实际上关注用户的操作失败了。无法判断到底有没有关注成功
      // 所以需要限制添加的速度。我用 1400ms 依然会触发 429，所以需要使用更大的时间间隔，以确保不会触发 429
      setTimeoutWorker.set(() => {
        return resolve(status)
      }, 2500)
    })
  }

  // 获取用户的 id 列表
  protected async getIdList() {
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    let idList = []
    try {
      idList = await API.getUserWorksByType(this.userList[this.index])
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
      }, Config.slowCrawlDealy)
    } else {
      this.getIdList()
    }
  }

  protected resetGetIdListStatus() {
    this.userList = []
    this.task = 'crawl'
    this.CSVData = []
    this.importFollowedUserIDs = []
    this.getUserListNo = 0
    this.index = 0
  }

  protected sortResult() {
    // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
    store.result.sort(Utils.sortByProperty('id'))
  }
}
export { InitFollowingPage }
