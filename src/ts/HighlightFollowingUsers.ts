import { API } from "./API"
import { store } from "./store/Store"

interface Following {
  /** 指示这个对象属于哪个用户 id **/
  user: string
  /** 此用户的关注用户的 id 列表 **/
  following: string[]
  /** 此用户公开关注的用户数量。注意，这个数量是 API 返回的 total，实际用户数量可能少于这个值 **/
  publicTotal: number
  /** 此用户私密关注的用户数量。注意，这个数量是 API 返回的 total，实际用户数量可能少于这个值 **/
  privateTotal: number
  /** 最后一次更新数据的时间戳 **/
  time: number
}

type List = Following[]

class HighlightFollowingUsers {
  constructor() {
    this.loadData()
    this.regularlyCheckUpdate()
  }

  private list: List = []

  private readonly storeName = 'following'

  private publicTotal = 0
  private privateTotal = 0

  private checkUpdateTimer?: number

  /**全量获取当前用户的所有关注列表 */
  private async getList(): Promise<string[]> {
    console.log('全量获取当前用户的所有关注列表')
    if(!store.loggedUserID){
      throw new Error('store.loggedUserID is empty')
    }
    // 需要获取公开关注和私密关注
    const publicList = await this.getFollowingList('show')
    const privateList = await this.getFollowingList('hide')

    const followingIDList = publicList.concat(privateList)
    return followingIDList
  }

  /**获取公开或私密关注的用户 ID 列表 */
  private async getFollowingList(rest: 'show' | 'hide'): Promise<string[]> {
    const ids: string[] = []
    let offset = 0
    let total = await this.getFollowingTotal(rest)

    if (total === 0) {
      return ids
    }


    // 每次请求 100 个关注用户的数据
    const limit = 100

    while (ids.length < total) {
      const res = await API.getFollowingList(
        store.loggedUserID,
        rest,
        '',
        offset,
        limit
      )
      offset = offset + limit

      for (const users of res.body.users) {
        ids.push(users.userId)
      }

      if(res.body.users.length===0){
        // 实际获取到的关注用户数量可能比 total 少，这是正常的
        // 例如 toal 是 3522，实际上获取到的可能是 3483 个，再往后都是空数组了
        break
      }
    }

    return ids
  }

  /**只发送一次请求，以获取 total */
  private async getFollowingTotal(rest: 'show' | 'hide') {
    const res = await API.getFollowingList(
      store.loggedUserID,
      rest,
      '',
      0,
      24
    )

    if (rest === 'show') {
      this.publicTotal = res.body.total
    } else {
      this.privateTotal = res.body.total
    }

    return res.body.total
  }

  /**使用给定的 ID 列表作为当前用户的关注用户列表 */
  private updateList(IDList: string[]) {
    const index = this.list.findIndex(following => following.user === store.loggedUserID)
    if (index > -1) {
      this.list[index].following = IDList
      this.list[index].privateTotal = this.privateTotal
      this.list[index].publicTotal = this.publicTotal
      this.list[index].time = new Date().getTime()
    } else {
      this.list.push({
        user: store.loggedUserID,
        following: IDList,
        privateTotal: this.privateTotal,
        publicTotal: this.publicTotal,
        time: new Date().getTime()
      })
    }

    this.saveFollowlingList()
  }

  private saveFollowlingList() {
    console.log('saveFollowlingList')
    console.log(this.list)
    localStorage.setItem(this.storeName, JSON.stringify(this.list))
  }

  private addFollow(userId: number) { }

  private unfollow(userId: number) { }

  /**定时检查是否需要更新数据 */
  private async regularlyCheckUpdate() {
    window.clearTimeout(this.checkUpdateTimer)
    // 每隔 10 分钟检查一次关注用户的数量，如果数量发生变化则执行全量更新
    this.checkUpdateTimer = window.setTimeout(async () => {
      const cfg = [{
        old: this.publicTotal,
        rest: 'show'
      }, {
        old: this.privateTotal,
        rest: 'hide'
      }]

      for (const { old, rest } of cfg) {
        const newTotal = await this.getFollowingTotal(rest as "show" | "hide")
        if (old !== newTotal) {
          console.log(`${rest} 数量变化 ${old} => ${newTotal}`)
          this.updateList(await this.getList())
          return this.regularlyCheckUpdate()
        }
        console.log(`${rest} 数量没有变化`)
      }
    }, 60000)
  }

  private async loadData() {
    // 尝试恢复数据
    const str = localStorage.getItem(this.storeName)
    if (str) {
      const data = JSON.parse(str)
      if (data.length > 0) {
        this.list = data

        const index = this.list.findIndex(following => following.user === store.loggedUserID)
        if (index > -1) {
          this.privateTotal = this.list[index].privateTotal
          this.publicTotal = this.list[index].publicTotal
        } else {
          // 恢复的数据里没有当前用户的数据，全新获取
          this.updateList(await this.getList())
        }
      }
    } else {
      // 没有已保存的数据，全新获取
      this.updateList(await this.getList())
    }
  }
}

new HighlightFollowingUsers()
