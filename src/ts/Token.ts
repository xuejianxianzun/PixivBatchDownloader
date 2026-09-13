import { Config } from './Config'
import { EVT } from './EVT'
import { Utils } from './utils/Utils'

/** 获取和保存 token；并发调用共享一次有期限的只读查询。 */
class Token {
  /** 保留同步读取缓存和当前页面的时机，后台初始化失败由本模块收尾。 */
  constructor() {
    if (Utils.isPixiv()) {
      this.bindEvents()
      this.init().catch(() => console.error('初始化 token 失败'))
    }
  }

  /** 原有 token 存储键。 */
  private readonly tokenStore = 'xzToken'
  /** 原有成功更新时间存储键。 */
  private readonly timeStore = 'xzTokenTime'
  /** 当前页面没有 token 时使用的原有作品页面。 */
  private readonly updateURL = 'https://www.pixiv.net/artworks/62751951'

  /** 供原有按钮和 API 调用读取；token 的存在不能代表已登录。 */
  public token = ''

  /** 两次自动更新之间的最小间隔仍为 5 分钟。 */
  private readonly interval = 300000

  /** 替代页面的请求和正文读取共用 20 秒期限，不限制已发送的写入。 */
  private readonly requestTimeout = 20000

  /** 只保存正在进行的查询；完成或失败后允许新的显式刷新。 */
  private updating?: Promise<string>

  /** 初始化只检查原有缓存间隔；跳过查询时不能阻止显式 reset。 */
  private async init() {
    this.token = localStorage.getItem(this.tokenStore) || ''
    const lastTimeStr = localStorage.getItem(this.timeStore)
    if (
      this.token &&
      lastTimeStr &&
      Date.now() - Number.parseInt(lastTimeStr) < this.interval
    ) {
      return
    }
    await this.updateToken()
  }

  /** 设置重置事件没有等待者，必须在这里处理刷新失败。 */
  private bindEvents() {
    // 重置设置时重新获取一次 token
    window.addEventListener(EVT.list.resetSettingsEnd, () => {
      this.reset().catch(() => console.error('重置设置后更新 token 失败'))
    })
  }

  /** 所有调用者接收同一结果；加入查询不会再次清空或启动另一请求。 */
  private updateToken(force = false): Promise<string> {
    if (this.updating) return this.updating

    const updating = this.readAndStoreToken(force).finally(() => {
      if (this.updating === updating) this.updating = undefined
    })
    this.updating = updating
    return updating
  }

  /** 仅保存本次查询取得的值，失败不能把旧缓存的更新时间向后延长。 */
  private async readAndStoreToken(force: boolean): Promise<string> {
    if (force) {
      this.token = ''
      localStorage.removeItem(this.tokenStore)
      localStorage.removeItem(this.timeStore)
    }

    // 优先从当前网页的特定源码里匹配 token
    // 这个 script 是 2025 年 4 月初改版出现的，里面的文字是转义过的
    // token 部分的源代码是这样的：
    // \\"token\\":\\"83332ba3da54d99b56e925728c295b28\\",
    let value = ''
    const script = document.querySelector('#__NEXT_DATA__')
    if (script) {
      const match = (script.textContent || '').match(/token\\":\\"(\w*)?\\/)
      if (match && match[1] && match[1].length === 32) {
        value = match[1]
      }
    }

    // 如果在当前网页里没有找到，则从作品页面的源码里获取 token
    if (!value) value = await this.fetchToken()

    localStorage.setItem(this.tokenStore, value)
    localStorage.setItem(this.timeStore, Date.now().toString())
    this.token = value
    return value
  }

  /** race 结束后才允许保存；即使 fetch 或正文忽略 abort，晚到结果也不能写入。 */
  private async fetchToken(): Promise<string> {
    const controller = new AbortController()
    let timer: number | undefined
    const timeout = new Promise<never>((_, reject) => {
      timer = window.setTimeout(() => {
        reject(new Error('更新 token 超时'))
        controller.abort()
      }, this.requestTimeout)
    })
    try {
      return await Promise.race([
        this.readPageToken(controller.signal),
        timeout,
      ])
    } finally {
      window.clearTimeout(timer)
      controller.abort()
    }
  }

  /** 保留 PC/mobile 的匹配规则；HTTP 错误或没有 token 时明确失败。 */
  private async readPageToken(signal: AbortSignal): Promise<string> {
    const response = await fetch(this.updateURL, { signal })
    signal.throwIfAborted()
    if (!response.ok)
      throw new Error(`更新 token 失败: HTTP ${response.status}`)
    const data = await response.text()
    signal.throwIfAborted()
    const regExp = Config.mobile ? /postKey":"(\w+)"/ : /token":"(\w+)"/
    const result = data.match(regExp)
    if (!result) throw new Error('更新 token 失败: 未找到 token')
    return result[1]
  }

  /** 强制绕过缓存间隔；返回本次结果供调用者固定重试所用的 token。 */
  public reset(): Promise<string> {
    return this.updateToken(true)
  }
}

const token = new Token()
export { token }
