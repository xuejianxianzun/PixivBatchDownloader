import { EVT } from './EVT'
import { Tools } from './Tools'

// 获取和保存 token
class Token {
  constructor() {
    if (Tools.isPixiv()) {
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
    // 重置设置时清除保存的 token，因为用户切换账号时，登录上新账号后可能 token 还是之前账号的，就会出错。清除设置时清除 token，就可以解决这个问题。
    window.addEventListener(EVT.list.resetSettings, () => {
      this.reset()
    })
  }

  private getToken() {
    const token = localStorage.getItem(this.tokenStore)
    return token ? token : ''
  }

  private updateToken() {
    const interval = 300000 // 两次更新之间的最小时间间隔。目前设置为 5 分钟
    const nowTime = new Date().getTime()
    const lastTimeStr = localStorage.getItem(this.timeStore)

    if (
      this.token &&
      lastTimeStr &&
      nowTime - Number.parseInt(lastTimeStr) < interval
    ) {
      return
    }

    // 从网页源码里获取用户 token 并储存
    fetch(this.updateURL)
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        const result = data.match(/token":"(\w+)"/)
        if (result) {
          this.token = result[1]
          localStorage.setItem(this.tokenStore, this.token)
          localStorage.setItem(this.timeStore, new Date().getTime().toString())
        } else {
          console.error('UpdateToken failed: no token found!')
        }
      })
  }

  private reset() {
    this.token = ''
    localStorage.removeItem(this.tokenStore)
    localStorage.removeItem(this.timeStore)
    this.updateToken()
  }
}

const token = new Token()
export { token }
