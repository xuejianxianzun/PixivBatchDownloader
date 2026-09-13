import { lang } from '../Language'
import { log } from '../Log'
import { settings } from '../setting/Settings'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { API } from '../API'
import { msgBox } from '../MsgBox'
import { Tools } from '../Tools'
import { store } from '../store/Store'
import { token } from '../Token'
import { FollowingUserData } from '../crawl/CrawlResult'
import { UserInfo } from '../FollowingData'

class BatchFollowUser {
  private busy = false
  private baseOffset = 0 // 开始抓取时，记录初始的偏移量
  private readonly onceNumber = 24 // 每页 24 个用户

  private rest: 'show' | 'hide' = 'show'
  private tag = ''
  private currentUserId = ''

  private requestTimes = 0 // 获取用户列表时，记录请求的次数
  private readonly limit = 100 // 每次请求多少个用户
  private totalNeed = Number.MAX_SAFE_INTEGER
  private taskName = lang.transl('_批量关注用户')

  /** 在任务开始时，保存已关注用户的列表，以避免重复添加已关注的用户 */
  private userList: string[] = []
  private importFollowedUserIDs: string[] = []

  /** 等待当前列表与关注流程；刷新失败或其他拒绝都恢复 busy。 */
  public async start() {
    if (this.busy) {
      toast.error(lang.transl('_有同类任务正在执行请等待之前的任务完成'))
      return
    }

    if (store.loggedUserID === '') {
      return msgBox.error(lang.transl('_状态码401的提示'), {
        title: this.taskName,
      })
    }

    this.busy = true
    try {
      this.reset()

      this.importFollowedUserIDs = await this.importUserList()
      log.log(
        lang.transl('_导入的用户ID数量') + this.importFollowedUserIDs.length
      )
      if (this.importFollowedUserIDs.length === 0) {
        this.busy = false
        return log.success(lang.transl('_本次任务已全部完成'))
      }

      this.stopAddFollow = false
      this.sendReqNumber = 0

      // 显示提示
      log.success('🚀' + lang.transl('_批量关注用户JSON'))

      // 根据当前页面来决定添加公开关注还是私密关注
      this.rest = location.href.includes('rest=hide') ? 'hide' : 'show'

      // 如果导入的用户数量较多，先获取关注用户列表，以便在添加关注时跳过已关注的用户
      // 24 是 PC 端关注页面里，每页的用户数量
      if (this.importFollowedUserIDs.length > 24) {
        await this.readyGetUserList()
      } else {
        // 如果导入的用户数量不多，就不需要获取关注用户列表，直接添加
        await this.batchFollow()
      }
    } catch {
      this.stopAddFollow = true
      const msg = lang.transl('_任务已中止')
      log.error(msg)
      msgBox.error(msg, { title: this.taskName })
    } finally {
      this.busy = false
    }
  }

  protected async readyGetUserList() {
    log.log(lang.transl('_正在加载关注用户列表'))
    // 总是慢速抓取
    log.warning(lang.transl('_慢速抓取'))
    // 始终抓取自己的关注列表，而非别人的，因为添加关注时，需要和自己的关注列表进行对比
    this.currentUserId = store.loggedUserID
    if (!this.currentUserId) {
      const msg = lang.transl('_获取当前登录的用户的ID失败')
      log.error(msg)
      msgBox.error(msg, {
        title: this.taskName,
      })
      this.busy = false
      return
    }

    this.tag = Utils.getURLPathField(window.location.pathname, 'following')
    if (this.rest === 'show') {
      log.warning(lang.transl('_添加为公开关注的提示'))
    } else {
      log.warning(lang.transl('_添加为非公开关注的提示'))
    }

    // 获取抓取开始时的页码
    const nowPage = Utils.getURLSearchField(location.href, 'p')
    // 计算开始抓取时的偏移量
    if (nowPage !== '') {
      this.baseOffset = (parseInt(nowPage) - 1) * this.onceNumber
    } else {
      this.baseOffset = 0
    }
    // 理论上应该获取所有关注的用户，即 baseOffset 固定为 0。这是为了避免不必要的重复关注
    // 目前的代码是从用户所在的页面抓取到最后一页，这样如果用户不在第一页，就不能获取所有关注的用户
    // 不过这是有意为之的，如果用户想跳过“先获取所有关注的用户的”的步骤，可以在最后一页执行
    // 这样可以节省时间

    // 要抓取多少个用户
    // 批量添加关注时，该数字没有限制
    this.totalNeed = Number.MAX_SAFE_INTEGER

    await this.getUserList()
  }

  private logGetUserListProgress(number: number) {
    log.log(
      lang.transl('_当前有x个用户', number.toString()),
      'batchFollowGetUserListProgress'
    )
  }

  // 获取关注的用户列表
  private async getUserList(): Promise<void> {
    const offset = this.baseOffset + this.requestTimes * this.limit

    let res
    try {
      res = await API.getFollowingList(
        this.currentUserId,
        this.rest,
        this.tag,
        offset
      )
    } catch {
      log.error(lang.transl('_获取关注用户列表时出现错误并重试'))
      return this.getUserList()
    }

    const users = res.body.users

    // 用户列表抓取完毕
    if (users.length === 0) {
      this.logGetUserListProgress(this.userList.length)
      log.persistentRefresh('batchFollowGetUserListProgress')
      return this.batchFollow()
    }

    for (const userData of users) {
      this.userList.push(userData.userId)
      this.logGetUserListProgress(this.userList.length)

      // 抓取到了指定数量的用户
      if (this.userList.length >= this.totalNeed) {
        log.persistentRefresh('batchFollowGetUserListProgress')
        return this.batchFollow()
      }
    }

    this.requestTimes++
    // 获取下一批用户列表
    await Utils.sleep(settings.slowCrawlDealy)
    return this.getUserList()
  }

  /** 新批次重新获得一次 token 刷新机会。 */
  private reset() {
    this.userList = []
    this.requestTimes = 0
    this.tokenHasUpdated = false
  }

  private async importUserList(): Promise<string[]> {
    const loadedJSON = (await Utils.loadJSONFile().catch((err) => {
      msgBox.error(err)
      return []
    })) as string[] | FollowingUserData[] | UserInfo[]
    if (!loadedJSON) {
      return []
    }

    // 要求是数组
    if (!Array.isArray(loadedJSON) || loadedJSON.length === 0) {
      toast.error(lang.transl('_格式错误'))
      return []
    }

    let userIDs: string[] = []
    // 如果类型是 string[]，说明是以前导出的数据格式，可以直接使用
    if (typeof loadedJSON[0] === 'string') {
      userIDs = loadedJSON as string[]
    } else {
      // 有 userId 属性的话，说明数据是下载器导出的关注列表，格式是 FollowingUserData
      // 有 id 属性的话，说明数据是下载器在扩展本地存储里保存的关注列表，格式是 UserInfo
      userIDs = (loadedJSON as FollowingUserData[]).map(
        (user) => (user as any).userId || (user as any).id
      )
    }

    return userIDs
  }

  private stopAddFollow = false
  private sendReqNumber = 0
  private readonly dailyLimit = 500 // 每天限制关注的数量，以降低封号风险
  /** 每批最多一次刷新；是否存在用户仍使用上游的检查。 */
  private tokenHasUpdated = false
  private need_recaptcha_enterprise_score_token = false

  private logProgress(current: number, total: number, newAdded: number) {
    log.log(
      `${current} / ${total}, ${lang.transl('_新增x个', newAdded.toString())}`,
      'batchFollowUserProgress'
    )
  }

  /** 最后一个用户失败也不能越过中止状态显示完成。 */
  private async batchFollow() {
    log.warning(lang.transl('_慢速执行以避免引起429错误'))
    log.warning(lang.transl('_提示可以重新执行批量关注任务'))
    log.warning(lang.transl('_提示下载器会跳过已关注的用户'))

    let newFollow = 0
    let no = 0
    const total = this.importFollowedUserIDs.length

    for (const userID of this.importFollowedUserIDs) {
      this.logProgress(no, total, newFollow)

      if (this.stopAddFollow) break

      if (this.sendReqNumber >= this.dailyLimit) {
        this.stopAddFollow = true
        const msg = lang.transl(
          '_批量关注用户的操作达到每日限制',
          this.dailyLimit.toString()
        )
        log.error(msg)
        msgBox.error(msg, { title: this.taskName })
        this.busy = false
        return
      }

      no++
      if (this.userList.includes(userID) === false) {
        this.sendReqNumber++
        const status = await this.addFollow(userID)
        // 只有当状态码正常时，才增加新增关注的数量
        if (status === 200) {
          newFollow++
        }
      }
    }

    if (this.stopAddFollow) {
      const msg = lang.transl('_任务已中止')
      log.error(msg)
      msgBox.error(msg, { title: this.taskName })
      return
    }

    this.logProgress(no, total, newFollow)
    this.busy = false
    const msg = '✅' + this.taskName
    log.success(msg)
    msgBox.success(msg, { title: this.taskName })
  }

  private clearIframe(iframe: HTMLIFrameElement) {
    iframe.src = 'about:blank'
    iframe.remove()
    iframe = null as any
    console.log('清理iframe')

    // 下载器每生成一个 iframe，Pixiv 的脚本也会创建一个 iframe，一并清除
    const allIframe = document.querySelectorAll(
      'body>iframe'
    ) as NodeListOf<HTMLIFrameElement>
    for (const frame of allIframe) {
      if (frame?.src.includes('criteo.com')) {
        frame.remove()
      }
    }
  }

  /** 保留用户存在检查和上游错误处理；刷新成功后使用返回 token 重试。 */
  private async addFollow(userID: string): Promise<number> {
    // 需要携带 need_recaptcha_enterprise_score_token 时，用 iframe 加载网页然后点击关注按钮
    if (this.need_recaptcha_enterprise_score_token) {
      const iframe = await this.loadIframe(userID)
      this.clearIframe(iframe)
      return 200
    }

    // 不需要携带 need_recaptcha_enterprise_score_token 时可以直接添加关注
    let status = await API.addFollowingUser(
      userID,
      token.token,
      this.rest === 'show'
    )
    if (status !== 200) {
      const userLink = Tools.createUserLink(userID)
      const errorMsg = lang.transl(
        '_关注这个用户时出错',
        userLink,
        status.toString()
      )
      // 测试用：3 个不存在的用户的 ID
      // ["3809545", "3809548", "3809552"]
      if (status === 404) {
        // 404 可能的原因：
        // 1. token 无效
        // 2. 该用户不存在
        log.error(errorMsg)
        const userExists = await this.checkUserExists(userID)
        // 如果该用户不存在，就跳过它
        if (!userExists) {
          return status
        }

        // 如果用户存在，说明是 token 无效导致的 404
        if (!this.tokenHasUpdated) {
          // 尝试重新获取 token（仅执行一次），然后重试请求
          this.tokenHasUpdated = true
          const refreshedToken = await token.reset().catch(() => '')
          if (!refreshedToken) {
            this.stopAddFollow = true
            return status
          }
          await Utils.sleep(1000)
          status = await API.addFollowingUser(
            userID,
            refreshedToken,
            this.rest === 'show'
          )
          if (status !== 200) {
            log.error(lang.transl('_关注该用户失败请等待一段时间后再试'))
            this.stopAddFollow = true
          }
        }
        return status
      } else if (status === 400) {
        // 400 是需要传递 recaptcha_enterprise_score_token 的时候，它的值为空或错误
        // 此时发出一次错误提醒，并重试添加关注
        this.need_recaptcha_enterprise_score_token = true
        log.warning(lang.transl('_模拟用户点击'))
        const iframe = await this.loadIframe(userID)
        this.clearIframe(iframe)

        return 200
      } else if (status === 403) {
        log.error(errorMsg)
        // 403 可能有两种原因：
        // 1. 当前用户的访问权限已经被限制
        // 2. 要关注的用户已经不存在
        // 详见文档：notes/判断一个用户是否已经不存在.md
        // 这里需要判断具体原因，以免误判

        const userExists = await this.checkUserExists(userID)
        // 如果要添加的用户存在，那么说明当前用户的访问权限被限制
        if (userExists) {
          const msg = lang.transl('_你的账号已经被Pixiv限制')
          log.error(msg)
          msgBox.error(msg, { title: this.taskName })
          this.stopAddFollow = true
        }
        return status
      } else {
        // 其他错误
        log.error(errorMsg)
      }
    }

    // 慢速执行
    // 关注用户的 API 也会触发 429 错误，此时获取作品数据的话会返回 429，
    // 但是关注用户的 API 依然返回 200，并且返回值也正常，但实际上关注用户的操作失败了。无法判断到底有没有关注成功
    // 所以需要限制添加的速度。我用 1400ms 依然会触发 429，所以需要使用更大的时间间隔，以确保不会触发 429
    await Utils.sleep(Tools.rangeRandom(2500, 3600))
    return status
  }

  private async checkUserExists(userID: string): Promise<boolean> {
    log.log(lang.transl('_检查该用户是否存在'))
    // 先假设该用户存在
    let userExists = true
    try {
      const res = await API.getUserProfile(userID, '0')
      if (res.error) {
        userExists = false
      }
    } catch (error) {
      // 如果请求出错，则认为该用户不存在，这是一个粗略的判断
      userExists = false
    }

    if (userExists) {
      log.log(lang.transl('_该用户存在'))
    } else {
      log.warning(lang.transl('_该用户不存在跳过他'))
    }

    return userExists
  }

  // 加载指定用户的的主页，然后查找关注按钮并点击
  private async loadIframe(userID: string): Promise<HTMLIFrameElement> {
    const url = `https://www.pixiv.net/${
      lang.htmlLangType === 'en' ? 'en/' : ''
    }users/${userID}`
    const res = await fetch(url)
    // const text = await res.text()
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.append(iframe)
    // iframe.srcdoc = text
    iframe.src = url

    // 在一定时间后，强制执行回调，不管 iframe.onload 的状态。
    // 因为有时一些广告脚本可能会加载失败，导致很久才能进入 onload。那样会等待太久。
    await Utils.sleep(Tools.rangeRandom(4000, 6000))
    await this.clickFollowBtn(userID, iframe)
    return iframe
  }

  private async clickFollowBtn(userID: string, iframe: HTMLIFrameElement) {
    const button = iframe.contentDocument?.querySelector(
      'button[data-click-label]'
    ) as HTMLButtonElement | null
    if (button) {
      button.click()
      console.log(userID + ' click')
    } else {
      const msg =
        '⏩' +
        lang.transl('_没有找到关注按钮的提示', Tools.createUserLink(userID))
      log.error(msg)
    }

    // 等待一段时间，以确保关注请求已经完成。之后 iframe 会被清除
    await Utils.sleep(Tools.rangeRandom(1000, 2000))
  }
}

const batchFollowUser = new BatchFollowUser()
export { batchFollowUser }
