import { canRequestInBatch } from '../AccountWarning'
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
import { EVT } from '../EVT'
import { Config } from '../Config'

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

  private retryNumber = 0 // 请求用户列表失败时，已经重试了多少次
  private readonly retryMax = 3 // 最多重试几次，超过之后终止任务
  private readonly retryWait = 2000 // 每次重试之前等待的时间（毫秒）

  // csv 的内容更丰富，json 只包含用户 id 列表，所以默认导出 csv 格式
  private format: 'csv' | 'json' = 'csv'
  private CSVData: UserData[] = [] // 储存用户列表，包含 id 和用户名
  private JSONData: FollowingUserData[] = []

  // 用户主页的通用链接前缀
  private readonly homePrefix = 'https://www.pixiv.net/users/'

  public start(format: 'csv' | 'json') {
    if (!canRequestInBatch('_导出关注列表')) {
      return
    }

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
    toast.show(log1)
    log.success('🚀' + log1)
    EVT.fire('closeSettingsPanel')
    log.log(lang.transl('_开始抓取用户列表'))

    // 总是慢速抓取
    log.warning(lang.transl('_慢速抓取'))

    try {
      this.readyGet()
    } catch (error) {
      // 出现异常时要复位 busy，否则之后每次点击都只会提示「有同类任务正在执行」
      this.abort(error)
    }
  }

  /** 任务因为异常而终止时的收尾：复位 busy，输出错误日志 */
  private abort(error?: unknown) {
    this.busy = false
    log.error(lang.transl('_任务已中止'))
    error !== undefined && console.error(error)
    this.reset()
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
    try {
      await this.requestUserList()
    } catch (error) {
      // 出现异常时要复位 busy，否则之后每次点击都只会提示「有同类任务正在执行」
      this.abort(error)
    }
  }

  private async requestUserList() {
    // 账户被警告时终止遍历，不再请求后续的用户列表，也不会导出不完整的列表
    // canRequestInBatch 已经输出了停止的原因，这里不再重复提示
    if (!canRequestInBatch('_导出关注列表')) {
      this.busy = false
      this.reset()
      return
    }

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
      // 请求失败时，等待一段时间再重试，避免短时间内重复请求
      if (this.retryNumber >= this.retryMax) {
        log.error(lang.transl('_获取关注列表失败'))
        this.abort()
        return
      }
      this.retryNumber++
      await Utils.sleep(this.retryWait)
      this.getUserList()
      return
    }

    // 请求成功之后，重置重试次数
    this.retryNumber = 0

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
      }

      // 始终添加 JSON 数据
      this.JSONData.push(userData)

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
    await Utils.sleep(settings.slowCrawlDealy)
    this.getUserList()
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
      try {
        let msg = ''
        if (this.format === 'csv') {
          await this.exportCSV()
          msg = lang.transl('_导出关注列表CSV')
        } else {
          await this.exportJSON()
          msg = lang.transl('_导出关注列表JSON')
        }

        log.success('✅' + msg)
        toast.success(msg)
      } catch (error) {
        // 导出失败时要清理已经抓取到的数据，否则它们会混进下一次导出的文件里
        this.abort(error)
        return
      }
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
    // 手机上一律走分片逻辑：格式化后的 JSON 体积是紧凑格式的 1.x 倍，几百个用户就可能超出内存承受范围
    const limit = Config.mobile || this.JSONData.length > 50000
    let urls: string[] = []
    if (!limit) {
      const blob = Utils.json2Blob(this.JSONData)
      const url = URL.createObjectURL(blob)
      urls.push(url)
    } else {
      const data = await Utils.json2BlobSafe(
        this.JSONData,
        Config.exportFileByteLengthLimit
      )
      urls = data.map((item) => item.url)
    }

    let part = 1
    for (const url of urls) {
      let partString = ''
      if (limit) {
        partString = `part ${part}-`
      }

      // 文件名示例：
      // following list-total 4514-from user 9460149-part 1-2026-08-07 08-01-00.json
      const fileName = `following list-total ${this.JSONData.length}-from user ${Utils.getURLPathField(
        window.location.pathname,
        'users'
      )}-${partString}${Tools.formatDateTimeInFilename()}.json`
      // 不要在这里直接 revokeObjectURL：大文件在手机上可能还没开始读取 blob 就被回收了，
      // 导致下载失败。交给 downloadFile 延迟回收
      Utils.downloadFile(url, fileName, 10000)
      part++
    }
  }

  private reset() {
    this.JSONData = []
    this.CSVData = []
    this.requestTimes = 0
    this.retryNumber = 0
  }
}

const exportFollowingList = new ExportFollowingList()
export { exportFollowingList }
