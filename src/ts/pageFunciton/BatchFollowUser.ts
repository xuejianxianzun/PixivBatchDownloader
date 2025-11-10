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
import { setTimeoutWorker } from '../SetTimeoutWorker'

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

  private userList: string[] = []
  private importFollowedUserIDs: string[] = []

  public async start() {
    if (this.busy) {
      toast.error(lang.transl('_有同类任务正在执行请等待之前的任务完成'))
      return
    }

    if (store.loggedUserID === '') {
      return msgBox.error(lang.transl('_请您登录Pixiv账号然后重试_401'))
    }

    this.busy = true
    this.reset()

    this.importFollowedUserIDs = await this.importUserList()
    log.log(
      lang.transl('_导入的用户ID数量') + this.importFollowedUserIDs.length
    )
    if (this.importFollowedUserIDs.length === 0) {
      return log.success(lang.transl('_本次任务已全部完成'))
    }

    this.stopAddFollow = false
    this.sendReqNumber = 0

    // 显示提示
    log.log(lang.transl('_批量关注用户'))
    log.log(lang.transl('_正在加载关注用户列表'))
    // 总是慢速抓取
    log.warning(lang.transl('_慢速抓取'))

    this.readyGet()
  }

  protected readyGet() {
    // 始终抓取自己的关注列表，而非别人的，因为添加关注时，需要和自己的关注列表进行对比
    this.currentUserId = store.loggedUserID

    this.tag = Utils.getURLPathField(window.location.pathname, 'following')
    this.rest = location.href.includes('rest=hide') ? 'hide' : 'show'
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

    // 获取当前页面的用户 id
    const test = /users\/(\d*)\//.exec(location.href)
    if (test && test.length > 1) {
      this.currentUserId = test[1]
    } else {
      const msg = `Get the user's own id failed`
      log.error(msg, 2)
      throw new Error(msg)
    }

    this.getUserList()
  }

  // 获取关注的用户列表
  private async getUserList() {
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
      this.getUserList()
      return
    }

    const users = res.body.users

    // 用户列表抓取完毕
    if (users.length === 0) {
      return this.getUserListComplete()
    }

    for (const userData of users) {
      this.userList.push(userData.userId)

      // 抓取到了指定数量的用户
      if (this.userList.length >= this.totalNeed) {
        return this.getUserListComplete()
      }
    }

    log.log(
      lang.transl('_当前有x个用户', this.userList.length.toString()),
      1,
      false,
      'batchFollowGetUserListProgress'
    )

    this.requestTimes++
    // 获取下一批用户列表
    window.setTimeout(() => {
      this.getUserList()
    }, settings.slowCrawlDealy)
  }

  private async getUserListComplete() {
    log.log(lang.transl('_当前有x个用户', this.userList.length.toString()))
    // 在批量关注用户时，不需要关心”已关注的用户“的数量是不是 0
    await this.batchFollow()
    this.busy = false
  }

  protected reset() {
    this.userList = []
    this.requestTimes = 0
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

  private stopAddFollow = false
  private sendReqNumber = 0
  private readonly dailyLimit = 1000 // 每天限制关注的数量，以免被封号
  private tokenHasUpdated = false
  private need_recaptcha_enterprise_score_token = false

  private logProgress(current: number, total: number, newAdded: number) {
    log.log(
      `${current} / ${total}, ${lang.transl('_新增x个', newAdded.toString())}`,
      1,
      false
    )
  }

  private async batchFollow(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const taskName = lang
        .transl('_批量关注用户')
        .replace('（JSON）', '')
        .replace('(JSON)', '')
      log.success(taskName)
      log.warning(lang.transl('_慢速执行以避免引起429错误'))
      log.warning(lang.transl('_提示可以重新执行批量关注任务'))

      let followed = 0
      let number = 0
      const total = this.importFollowedUserIDs.length

      for (const userID of this.importFollowedUserIDs) {
        this.logProgress(number, total, this.sendReqNumber)

        if (this.stopAddFollow) {
          const msg = lang.transl('_任务已中止')
          log.error(msg)
          msgBox.error(msg)
          return resolve()
        }

        if (this.sendReqNumber >= this.dailyLimit) {
          this.stopAddFollow = true
          const msg = lang.transl(
            '_新增的关注用户达到每日限制',
            this.dailyLimit.toString()
          )
          log.error(msg)
          msgBox.error(msg)
          return resolve()
        }

        number++
        if (this.userList.includes(userID) === false) {
          this.sendReqNumber++
          await this.addFollow(userID)
        } else {
          followed++
        }
      }

      this.logProgress(number, total, this.sendReqNumber)
      log.success('✓ ' + taskName)
      msgBox.success('✓ ' + taskName)
      return resolve()
    })
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

  private async addFollow(userID: string): Promise<number> {
    return new Promise(async (resolve) => {
      // 需要携带 need_recaptcha_enterprise_score_token 时，用 iframe 加载网页然后点击关注按钮
      if (this.need_recaptcha_enterprise_score_token) {
        const iframe = await this.loadIframe(userID)
        this.clearIframe(iframe)
        return resolve(200)
      }

      // 不需要携带 need_recaptcha_enterprise_score_token 时可以直接添加关注
      const status = await API.addFollowingUser(
        userID,
        token.token,
        this.rest === 'show'
      )
      if (status !== 200) {
        const errorMsg = `Error: ${Tools.createUserLink(
          userID
        )} Status: ${status}`
        if (status === 404) {
          // 404 可能的原因：
          // 1. token 无效
          // 2. 该用户不存在
          if (this.tokenHasUpdated === true) {
            log.error(errorMsg)
          } else {
            // 404 时尝试重新获取 token，然后重试请求（仅执行一次）
            this.tokenHasUpdated = true
            await token.reset()
            await Utils.sleep(1000)
            await API.addFollowingUser(
              userID,
              token.token,
              this.rest === 'show'
            )
          }
        } else if (status === 400) {
          // 400 是需要传递 recaptcha_enterprise_score_token 的时候，它的值为空或错误
          // 此时发出一次错误提醒，并重试添加关注
          this.need_recaptcha_enterprise_score_token = true
          log.warning(lang.transl('_模拟用户点击'))
          const iframe = await this.loadIframe(userID)
          this.clearIframe(iframe)

          return resolve(200)
        } else if (status === 403) {
          // 403 是访问权限已经被限制
          log.error(errorMsg)
          const msg = lang.transl('_你的账号已经被Pixiv限制')
          log.error(msg)
          msgBox.error(msg)
          this.stopAddFollow = true
          return resolve(status)
        } else {
          // 其他错误
          log.error(errorMsg)
        }
      }

      // 慢速执行
      // 关注用户的 API 也会触发 429 错误，此时获取作品数据的话会返回 429，
      // 但是关注用户的 API 依然返回 200，并且返回值也正常，但实际上关注用户的操作失败了。无法判断到底有没有关注成功
      // 所以需要限制添加的速度。我用 1400ms 依然会触发 429，所以需要使用更大的时间间隔，以确保不会触发 429
      setTimeoutWorker.set(
        () => {
          return resolve(status)
        },
        Tools.rangeRandom(2500, 3600)
      )
    })
  }

  private clickFollowBtn(
    userID: string,
    iframe: HTMLIFrameElement
  ): Promise<HTMLIFrameElement> {
    return new Promise(async (resolve) => {
      // 等待一段时间，默认操作完成。但是如果此时一些请求尚未完成，可能会被取消。所以这个时间最好稍大一点
      setTimeoutWorker.set(
        () => {
          return resolve(iframe)
        },
        Tools.rangeRandom(2500, 3600)
      )

      const button = iframe.contentDocument?.querySelector(
        'button[data-click-label]'
      ) as HTMLButtonElement | null
      if (button) {
        button.click()
        console.log(userID + ' click')
      } else {
        const msg = lang.transl(
          '_没有找到关注按钮的提示',
          Tools.createUserLink(userID)
        )
        log.error(msg)

        return resolve(iframe)
      }
    })
  }

  // 加载指定用户的的主页，然后查找关注按钮并点击
  private async loadIframe(userID: string): Promise<HTMLIFrameElement> {
    return new Promise(async (resolve, reject) => {
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
      setTimeoutWorker.set(
        async () => {
          const _iframe = await this.clickFollowBtn(userID, iframe)
          return resolve(_iframe)
        },
        Tools.rangeRandom(2500, 3600)
      )
    })
  }
}

const batchFollowUser = new BatchFollowUser()
export { batchFollowUser }
