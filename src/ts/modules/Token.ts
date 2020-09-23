import { EVT } from './EVT'

// 获取和保存 token
class Token {
  constructor() {
    this.bindEvent()

    this.updateToken()
  }

  private readonly tokenStore = 'xzToken'
  private readonly timeStore = 'xzTokenTime'
  private readonly updateURL = 'https://www.pixiv.net/artworks/62751951'

  private bindEvent() {
    window.addEventListener(EVT.list.resetSettings, () => {
      localStorage.removeItem(this.tokenStore)
      this.updateToken()
    })
  }

  // 从本地存储里取出保存的 token
  public getToken() {
    const token = localStorage.getItem(this.tokenStore)
    if (token) {
      return token
    } else {
      this.updateToken()
      return ''
    }
  }

  // 更新 token
  private updateToken() {
    // 检查距离上次更新 token 的时间间隔
    const interval = 300000 // 两次检查之间的间隔。目前设置为 5 分钟
    const nowTime = new Date().getTime()
    const lastTimeStr = localStorage.getItem(this.timeStore)
    const token = localStorage.getItem(this.tokenStore)

    if (
      token &&
      lastTimeStr &&
      nowTime - Number.parseInt(lastTimeStr) < interval
    ) {
      return
    }

    // 从网页源码里获取用户 token，并储存起来
    fetch(this.updateURL)
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        let result = data.match(/token":"(\w+)"/)
        if (result) {
          localStorage.setItem(this.tokenStore, result[1])
          localStorage.setItem(this.timeStore, new Date().getTime().toString())
        } else {
          console.error('UpdateToken failed: no token found!')
        }
      })
  }
}

const token = new Token()
export { token }
