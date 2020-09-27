import { EVT } from './EVT'

// 获取和保存 token
class Token {
  constructor() {
    this.token = this.getToken()

    this.updateToken()

    this.bindEvent()
  }

  private readonly tokenStore = 'xzToken'
  private readonly timeStore = 'xzTokenTime'
  private readonly updateURL = 'https://www.pixiv.net/artworks/62751951'

  public token!: string

  private bindEvent() {
    window.addEventListener(EVT.list.resetSettings, () => {
      localStorage.removeItem(this.tokenStore)
      this.updateToken()
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
      (nowTime - Number.parseInt(lastTimeStr)) < interval
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
}

const token = new Token()
export { token }
