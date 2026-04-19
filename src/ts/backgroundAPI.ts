import { UserProfile } from './crawl/CrawlResult'

class backgroundAPI {
  /** 获取用户信息。full=0 获取简略信息，full=1 获取完整信息 */
  // 如果这个用户不存在了，获取他的数据时会返回 403 状态码，例如：
  // https://www.pixiv.net/ajax/user/16689973?full=0
  static async getUserProfile(
    id: string,
    full: '0' | '1' = '1'
  ): Promise<UserProfile> {
    const url = `https://www.pixiv.net/ajax/user/${id}?full=${full}`
    return this.fetch(url)
  }

  static async fetch(url: string): Promise<any> {
    const response = await fetch(url)
    if (response.ok) {
      // 请求成功，直接返回数据
      const data = await response.json()
      return data
    } else {
      // 请求成功,但状态码异常
      console.error(`Status Code: ${response.status}`)
      throw {
        status: response.status,
        statusText: response.statusText,
      }
    }
  }

  static async sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }
}

export { backgroundAPI }
