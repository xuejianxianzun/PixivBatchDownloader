// 初始化关注页面、好 P 友页面、粉丝页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { Tools } from '../Tools'
import { createCSV } from '../utils/CreateCSV'
import { Utils } from '../utils/Utils'

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
  private myId = ''
  private rest: 'show' | 'hide' = 'show'

  private userList: string[] = []

  private index = 0 // getIdList 时，对 userList 的索引

  private userInfoList: UserInfo[] = [] // 储存用户列表，包含 id 和用户名

  private downUserList = false // 下载用户列表的标记

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

    Tools.addBtn('crawlBtns', Colors.bgGreen, '_下载用户列表').addEventListener(
      'click',
      () => {
        this.downUserList = true
        this.readyCrawl()
      }
    )
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
    this.readyGet()
    log.log(lang.transl('_正在抓取'))
    this.getPageType()
    this.getUserList()
  }

  protected readyGet() {
    this.rest = location.href.includes('rest=hide') ? 'hide' : 'show'

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

    // 获取用户自己的 id
    const test = /users\/(\d*)\//.exec(location.href)
    if (test && test.length > 1) {
      this.myId = test[1]
    } else {
      const msg = `Get the user's own id failed`
      log.error(msg, 2)
      throw new Error(msg)
    }
  }

  // 获取用户列表
  private async getUserList() {
    const offset = this.baseOffset + this.getUserListNo * this.limit

    let res
    try {
      switch (this.pageType) {
        case 0:
          res = await API.getFollowingList(this.myId, this.rest, offset)
          break
        case 1:
          res = await API.getMyPixivList(this.myId, offset)
          break
        case 2:
          res = await API.getFollowersList(this.myId, offset)
          break
      }
    } catch {
      this.getUserList()
      return
    }

    const users = res.body.users

    if (users.length === 0) {
      // 用户列表抓取完毕
      return this.getUserListComplete()
    }

    for (const userData of users) {
      // 保存用户 id
      this.userList.push(userData.userId)

      // 如果需要下载用户列表
      if (this.downUserList) {
        this.userInfoList.push({
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

  private getUserListComplete() {
    log.log(lang.transl('_当前有x个用户', this.userList.length.toString()))

    if (this.userList.length === 0) {
      return this.getIdListFinished()
    }

    // 处理下载用户列表的情况
    if (this.downUserList) {
      this.toCSV()
      return this.getIdListFinished()
    }

    this.getIdList()
  }

  private toCSV() {
    // 添加用户信息
    const data: string[][] = this.userInfoList.map((item) => {
      return Object.values(item)
    })

    // 添加用户信息的标题字段
    data.unshift(Object.keys(this.userInfoList[0]))

    const csv = createCSV.create(data)
    const csvURL = URL.createObjectURL(csv)

    const csvName = Tools.getPageTitle()

    Utils.downloadFile(csvURL, Utils.replaceUnsafeStr(csvName) + '.csv')
  }

  // 获取用户的 id 列表
  protected async getIdList() {
    let idList = []
    try {
      idList = await API.getUserWorksByType(this.userList[this.index])
    } catch {
      this.getIdList()
      return
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

    this.getIdList()
  }

  protected resetGetIdListStatus() {
    this.userList = []
    this.userInfoList = []
    this.downUserList = false
    this.getUserListNo = 0
    this.index = 0
  }

  protected sortResult() {
    // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
    store.result.sort(Utils.sortByProperty('id'))
  }
}
export { InitFollowingPage }
