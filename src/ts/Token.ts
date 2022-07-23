import { EVT } from './EVT'
import { Utils } from './utils/Utils'

// 获取和保存 token
class Token {
  constructor() {
    if (Utils.isPixiv()) {
      this.token = this.getToken()
      this.updateToken()
      this.bindEvents()
    }
  }

  private readonly tokenStore = 'xzToken'
  private readonly timeStore = 'xzTokenTime'
  private readonly updateURL = 'https://www.pixiv.net/artworks/62751951'

  public token!: string

  private bindEvents() {
    // 重置设置时重新获取一次 token
    window.addEventListener(EVT.list.resetSettingsEnd, () => {
      this.reset()
    })
  }

  private getToken() {
    const token = localStorage.getItem(this.tokenStore)
    return token ? token : ''
  }

  private interval = 300000 // 两次更新之间的最小时间间隔。目前设置为 5 分钟
  private async updateToken() {
    const nowTime = new Date().getTime()
    const lastTimeStr = localStorage.getItem(this.timeStore)

    if (
      this.token &&
      lastTimeStr &&
      nowTime - Number.parseInt(lastTimeStr) < this.interval
    ) {
      return
    }

    // 从网页源码里获取用户 token 并储存
    return fetch(this.updateURL)
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        const result = data.match(/token":"(\w+)"/)
        // 不论用户是否登录，都有 token，所以不能根据 token 来判断用户是否登录
        // 如果存在下面的字符串，则说明用户未登录：
        // "userData":null
        if (result) {
          this.token = result[1]
          localStorage.setItem(this.tokenStore, this.token)
          localStorage.setItem(this.timeStore, new Date().getTime().toString())
        } else {
          console.error('UpdateToken failed: no token found!')
        }
      })
  }

  public async reset() {
    this.token = ''
    localStorage.removeItem(this.tokenStore)
    localStorage.removeItem(this.timeStore)
    return this.updateToken()
  }
}

const token = new Token()
export { token }
