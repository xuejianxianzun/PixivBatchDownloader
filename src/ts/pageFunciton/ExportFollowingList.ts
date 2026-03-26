import { lang } from '../Language'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { createCSV } from '../utils/CreateCSV'
import { API } from '../API'
import { msgBox } from '../MsgBox'
import { Tools } from '../Tools'
import { FollowingUserData } from '../crawl/CrawlResult'

interface UserData {
  userId: string
  userName: string
  homePage: string
  userComment: string
  profileImageUrl: string
}

class ExportFollowingList {
  private busy = false
  private baseOffset = 0 // 开始抓取时，记录初始的偏移量
  private readonly onceNumber = 24 // 每页 24 个用户
  private crawlPageNumber = 1 // 需要抓取多少个页面

  // 页面子类型：我的关注 | 我的好 P 友 | 我的粉丝
  private pageType: 'following' | 'mypixiv' | 'followers' = 'following'
  private rest: 'show' | 'hide' = 'show'
  private tag = ''
  private currentUserId = ''

  private requestTimes = 0 // 获取用户列表时，记录请求的次数
  private readonly limit = 100 // 每次请求多少个用户
  private totalNeed = Number.MAX_SAFE_INTEGER

  // csv 的内容更丰富，json 只包含用户 id 列表，所以默认导出 csv 格式
  private format: 'csv' | 'json' = 'csv'
  private CSVData: UserData[] = [] // 储存用户列表，包含 id 和用户名
  private JSONData: FollowingUserData[] = []

  // 用户主页的通用链接前缀
  private readonly homePrefix = 'https://www.pixiv.net/users/'

  public start(format: 'csv' | 'json') {
    if (this.busy) {
      toast.error(lang.transl('_有同类任务正在执行请等待之前的任务完成'))
      return
    }

    this.busy = true
    this.format = format

    // 显示提示
    const log1 = lang.transl(
      format === 'csv' ? '_导出关注列表CSV' : '_导出关注列表JSON'
    )
    log.success('🚀' + log1)
    const log2 = lang.transl('_开始抓取用户列表')
    log.log(log2)
    toast.show(log2)
    // 总是慢速抓取
    log.warning(lang.transl('_慢速抓取'))

    this.readyGet()
  }

  protected getWantPage() {
    this.crawlPageNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlPageNumber === -1) {
      log.warning(lang.transl('_抓取所有页面'))
    } else {
      log.warning(lang.transl('_注意这个任务遵从抓取多少页面的设置'))
      log.warning(
        lang.transl('_从本页开始抓取x页', this.crawlPageNumber.toString())
      )
    }
  }

  private getPageType() {
    const pathname = window.location.pathname
    if (pathname.includes('/following')) {
      this.pageType = 'following'
    } else if (pathname.includes('/mypixiv')) {
      this.pageType = 'mypixiv'
    } else if (pathname.includes('/followers')) {
      this.pageType = 'followers'
    }
  }

  protected readyGet() {
    this.getWantPage()
    this.getPageType()
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
    if (this.crawlPageNumber !== -1) {
      this.totalNeed = this.onceNumber * this.crawlPageNumber
    }

    // 获取当前页面的用户 id
    const test = /users\/(\d*)\//.exec(location.href)
    if (test && test.length > 1) {
      this.currentUserId = test[1]
    } else {
      const msg = `Get the user's own id failed`
      log.error(msg)
      // 输出空字符串，起到占据一个空行的效果，使得日志看起来更清晰
      log.log('')
      throw new Error(msg)
    }

    this.getUserList()
  }

  // 获取用户列表
  private async getUserList() {
    const offset = this.baseOffset + this.requestTimes * this.limit
    let res
    try {
      switch (this.pageType) {
        case 'following':
          res = await API.getFollowingList(
            this.currentUserId,
            this.rest,
            this.tag,
            offset
          )
          break
        case 'mypixiv':
          res = await API.getMyPixivList(this.currentUserId, offset)
          break
        case 'followers':
          res = await API.getFollowersList(this.currentUserId, offset)
          break
      }
    } catch {
      this.getUserList()
      return
    }

    const users = res.body.users

    // console.log(users.length, offset)
    if (users.length === 0) {
      // 用户列表抓取完毕
      return this.getUserListComplete()
    }

    for (const userData of users) {
      if (this.format === 'csv') {
        this.CSVData.push({
          userId: userData.userId,
          userName: userData.userName,
          homePage: this.homePrefix + userData.userId,
          userComment: userData.userComment,
          profileImageUrl: userData.profileImageUrl,
        })
      } else {
        this.JSONData.push(userData)
      }

      if (this.JSONData.length >= this.totalNeed) {
        // 抓取到了指定数量的用户
        return this.getUserListComplete()
      }
    }

    log.log(
      lang.transl('_当前有x个用户', this.JSONData.length.toString()),
      'exportFollowingListProgress'
    )

    this.requestTimes++
    // 获取下一批用户列表
    window.setTimeout(() => {
      this.getUserList()
    }, settings.slowCrawlDealy)
  }

  private async getUserListComplete() {
    this.busy = false
    log.log(lang.transl('_当前有x个用户', this.JSONData.length.toString()))

    if (this.JSONData.length === 0) {
      const msg =
        '✅' +
        lang.transl('_用户数量为0') +
        ', ' +
        lang.transl('_没有可用的抓取结果')
      log.warning(msg)
      msgBox.warning(msg)
    } else {
      let msg = ''
      if (this.format === 'csv') {
        await this.exportCSV()
        msg = '✅' + lang.transl('_导出关注列表CSV')
      } else {
        await this.exportJSON()
        msg = '✅' + lang.transl('_导出关注列表JSON')
      }

      log.success(msg)
      toast.success(msg)
    }

    this.reset()
  }

  private async exportCSV() {
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

  private async exportJSON() {
    // 在一次测试里我导出了 4514 个用户，JSON 文件的体积是 25.45 MiB（已格式化），平均每个用户的数据为 5912 B
    // 当用户数量超过 80000 时，体积才会接近 500 MiB。保守估计这里限制为 50000
    // 如果超出限制，会产生多个 json 文件，需要全部下载
    const limit = this.JSONData.length > 50000
    let urls: string[] = []
    if (!limit) {
      const blob = Utils.json2Blob(this.JSONData)
      const url = URL.createObjectURL(blob)
      urls.push(url)
    } else {
      const data = await Utils.json2BlobSafe(this.JSONData)
      urls = data.map((item) => item.url)
    }

    let part = 1
    for (const url of urls) {
      let partString = ''
      if (limit) {
        partString = `part ${part}-`
      }

      // 文件名示例：
      // following list-total 4514-from user 9460149-[part 1-]2026／3／26 20：58：54
      const fileName = `following list-total ${this.JSONData.length}-from user ${Utils.getURLPathField(
        window.location.pathname,
        'users'
      )}-${partString}${Utils.replaceUnsafeStr(new Date().toLocaleString())}.json`
      Utils.downloadFile(url, fileName)
      URL.revokeObjectURL(url)
      part++
    }
  }

  private reset() {
    this.JSONData = []
    this.CSVData = []
    this.requestTimes = 0
  }
}

const exportFollowingList = new ExportFollowingList()
export { exportFollowingList }
