import { API } from '../API'
import { lang } from '../Language'
import { log } from '../Log'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'

// 获取用户在 Pixiv 里屏蔽的用户和/或 tag，进行过滤
// Mute API 的文档：
// notes/用户屏蔽设定-mute.md
class Mute {
  private userList: string[] = []
  private tagList: string[] = []
  private got = false // 是否获取过用户设置

  /** 上一次发起请求的时间戳，用于限制执行间隔 */
  private lastRequestTime = 0
  /** 两次执行之间的最小间隔（毫秒）。在这段时间内重复调用会直接返回，不会发起请求 */
  private readonly interval = 60 * 1000
  /** 正在进行的请求。在它结束之前，后续的调用会复用这个请求，而不是再发起一次 */
  private pending: Promise<number> | null = null

  /**检查传入的 user id 是否包含在用户屏蔽设置里 */
  public async checkUser(id: number | string) {
    // 检查时，要求至少进行过一次获取用户设置的操作
    if (!this.got) {
      await this.getMuteSettings()
    }

    if (typeof id === 'number') {
      id = id.toString()
    }
    return this.userList.includes(id)
  }

  /**检查传入的 tag 是否包含在用户屏蔽设置里 */
  public async checkTag(tag: string) {
    if (!this.got) {
      await this.getMuteSettings()
    }

    return this.tagList.includes(tag)
  }

  // 此模块不会在初始化时获取设置，这是为了避免增加一次无谓的网络请求
  // 当执行此模块的 check 方法时，如果之前没有获取过设置，则此模块会主动获取一次设置
  // 其他模块也可以在必要的时候（如开始抓取时）直接执行此方法，预先获取设置，为后面的流程做准备
  //
  // 屏蔽设置通常不会频繁变化，而且浏览器对这个 API 的缓存时间很短（两次调用的间隔超过约 5 秒
  // 就不会使用缓存，而是发起真实请求），所以这里限制了执行间隔：间隔内的调用不会发起请求，
  // 而是直接返回，沿用上一次获取到的设置。这样可以降低请求频率，避免占用请求数量的配额。
  // 返回值是状态码；如果因为间隔限制而跳过了请求，也会返回 200。
  public async getMuteSettings(showTips = true): Promise<number> {
    if (!Utils.isPixiv()) {
      this.got = true
      return 200
    }

    if (Tools.checkUserLogin() === false) {
      return 401
    }

    // 上一次请求还没结束时，等待它完成。如果这里直接返回，
    // 并发调用（例如同时检查多个作品）会拿到还没填充的空白列表，导致屏蔽失效
    if (this.pending) {
      return this.pending
    }

    const now = Date.now()
    if (now - this.lastRequestTime < this.interval) {
      return 200
    }
    this.lastRequestTime = now

    this.pending = this.requestMuteSettings(showTips)
    try {
      return await this.pending
    } finally {
      this.pending = null
    }
  }

  /** 发起请求获取屏蔽设置，并更新 userList 和 tagList 列表 */
  private async requestMuteSettings(showTips: boolean): Promise<number> {
    this.userList = []
    this.tagList = []

    try {
      const response = await API.getMuteSettings()
      const items = response.body.mute_items
      for (const item of items) {
        // 如果这个屏蔽项未启用，则不保存
        if (item.enabled === false) {
          continue
        }
        if (item.type === 'user' && !this.userList.includes(item.value)) {
          this.userList.push(item.value)
        }
        if (item.type === 'tag' && !this.tagList.includes(item.value)) {
          this.tagList.push(item.value)
        }
      }

      if (showTips && (this.userList.length > 0 || this.tagList.length > 0)) {
        let msg = lang.transl('_屏蔽设定') + ': <br>'
        if (this.userList.length > 0) {
          msg += `${lang.transl('_用户')}: ${this.userList.join(',')}<br>`
        }
        if (this.tagList.length > 0) {
          msg += `${lang.transl('_标签')}: ${this.tagList.join(',')}<br>`
        }
        log.warning(msg)
      }

      this.got = true
      return 200
    } catch (error: Error | any) {
      // 当请求出错时，视为获取完成。不抛出 reject，否则会导致抓取中止
      this.got = true
      if (error.status === 401) {
        console.error(
          'get mute settings error ' + lang.transl('_状态码401的提示')
        )
      }
      return error.status
    }
  }
}

const mute = new Mute()
export { mute }
