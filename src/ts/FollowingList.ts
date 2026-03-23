import browser from 'webextension-polyfill'
import { API } from './API'
import { EVT } from './EVT'
import { lang } from './Language'
import { settings } from './setting/Settings'
import { store } from './store/Store'
import { toast } from './Toast'
import { Utils } from './utils/Utils'
import { BackgroundMsg, UserInfo, AllUserFollowingData } from './FollowingData'
import { log } from './Log'

// 更新关注列表
class FollowingList {
  constructor() {
    if (!Utils.isPixiv()) {
      return
    }

    this.delayCheckUpdate()

    browser.runtime.onMessage.addListener(
      (
        msg: unknown,
        sender: browser.Runtime.MessageSender,
        sendResponse: Function
      ): any => {
        if (!this.isMsg(msg)) {
          return false
        }

        if (msg.msg === 'dispatchFollowingData') {
          this.receiveData(msg.data || [])
        }

        if (msg.msg === 'updateFollowingData') {
          if (!store.loggedUserID) {
            return
          }

          this.getList()
        }

        if (msg.msg === 'getLoggedUserID') {
          sendResponse({ loggedUserID: store.loggedUserID })
        }
      }
    )

    if (store.loggedUserID) {
      browser.runtime.sendMessage({
        msg: 'requestFollowingData',
      })
    }
  }

  /**当前登录用户的关注用户列表 */
  public following: string[] = []
  public followedUsersInfo: UserInfo[] = []

  /**当前登录用户的关注用户总数，也就是 pixiv 页面上显示的公开关注 + 非公开关注数量之和。
   * 这不一定是实际关注数量（也就是不一定等于 this.following.length)，因为有些用户可能已经注销了，所以实际关注数量比显示的数量少是很常见的 */
  public total = 0

  private checkUpdateTimer?: number

  public status: 'idle' | 'locked' = 'idle'

  // 类型守卫，只要求消息有 msg 属性
  private isMsg(msg: any): msg is BackgroundMsg {
    return !!msg.msg
  }

  /**全量获取当前用户的所有关注列表 */
  // 这个方法会在关注数量与已储存的关注数据里的数量不一致时自动执行，以更新储存的关注数据。
  // 如果在某些时候想强制更新，可以调用这个方法
  public async getList(): Promise<string[]> {
    if (this.status === 'locked') {
      return new Promise((resolve) => {
        this.queue.push(() => {
          resolve(this.following)
        })
      })
    }

    this.status = 'locked'
    const tip1 = lang.transl('_正在加载关注用户列表')
    log.warning(tip1)
    toast.show(tip1, {
      position: 'topCenter',
    })

    // 获取公开关注和私密关注，然后合并
    const publicList = await this.getFollowingList('show')
    const privateList = await this.getFollowingList('hide')
    const following = publicList.following.concat(privateList.following)
    const followedUsersInfo = publicList.followedUsersInfo.concat(
      privateList.followedUsersInfo
    )
    const total = publicList.total + privateList.total

    const tip2 = lang.transl('_已更新关注用户列表')
    log.success(tip2)
    toast.success(tip2, {
      position: 'topCenter',
    })

    browser.runtime.sendMessage({
      msg: 'setFollowingData',
      data: {
        user: store.loggedUserID,
        following: following,
        followedUsersInfo: followedUsersInfo,
        total: total,
      },
    })

    this.executeQueue()
    this.status = 'idle'
    return this.following
  }

  /**获取公开或私密关注的用户 ID 列表 */
  private async getFollowingList(rest: 'show' | 'hide'): Promise<{
    following: string[]
    followedUsersInfo: UserInfo[]
    total: number
  }> {
    const following: string[] = []
    const followedUsersInfo: UserInfo[] = []
    let total = await this.getFollowingTotal(rest)

    if (total === 0) {
      return {
        following,
        followedUsersInfo,
        total,
      }
    }

    // 每次请求 100 个关注用户的数据
    const limit = 100
    let offset = 0

    while (following.length < total) {
      const res = await API.getFollowingList(
        store.loggedUserID,
        rest,
        '',
        offset,
        limit
      )
      offset = offset + limit

      for (const users of res.body.users) {
        following.push(users.userId)
        followedUsersInfo.push({
          id: users.userId,
          name: users.userName,
          avatar: users.profileImageUrl,
          deleteByUser: false,
          exist: true,
        })
      }
      const type =
        rest === 'show' ? lang.transl('_公开') : lang.transl('_非公开')
      log.log(
        `${type} ${following.length} / ${total}`,
        1,
        false,
        `getFollowingList_${rest}`
      )

      if (res.body.users.length === 0) {
        // 实际获取到的关注用户数量可能比 total 少，这是正常的
        // 例如 toal 是 3522，实际上获取到的可能是 3483 个，再往后都是空数组了
        log.warning(
          lang.transl('_提示有些用户可能已经注销'),
          1,
          false,
          'tipUserMayDeactivated'
        )
        break
      }

      await Utils.sleep(settings.slowCrawlDealy)
    }

    return {
      following,
      followedUsersInfo,
      total,
    }
  }

  /**只请求关注列表第一页的数据，以获取 total */
  private async getFollowingTotal(rest: 'show' | 'hide') {
    // 关注页面一页显示 24 个作者
    const res = await API.getFollowingList(store.loggedUserID, rest, '', 0, 24)
    return res.body.total
  }

  private async receiveData(list: AllUserFollowingData) {
    // console.log('receiveData', list)
    const data = list.find((data) => data.user === store.loggedUserID)
    if (data) {
      this.following = data.following
      this.followedUsersInfo = data.followedUsersInfo
      this.total = data.total
    } else {
      // 恢复的数据里没有当前用户的数据，需要获取
      this.checkNeedUpdate()
    }

    EVT.fire('followingUsersChange')
  }

  private async delayCheckUpdate() {
    window.clearTimeout(this.checkUpdateTimer)
    this.checkUpdateTimer = window.setTimeout(async () => {
      this.checkNeedUpdate()
      return this.delayCheckUpdate()
    }, this.getUpdateTime())
  }

  private getUpdateTime() {
    // 每次检查更新的最低时间间隔是 5 分钟，最多是 15 分钟
    // 如果用户打开了多个标签页，它们都会加载关注列表的第一页来检查数量
    // 所以间隔不宜太短
    const base = 300000

    // 产生一个 10 分钟内的随机数
    const random = Math.random() * 600000

    // 通常不需要担心间隔时间太大导致数据更新不及时
    // 因为多个标签页里只要有一个更新了数据，所有的标签页都会得到新数据
    return base + random
  }

  /**检查关注用户的数量，如果数量发生变化则执行全量更新 */
  private async checkNeedUpdate() {
    // 在搜索页面里移除已关注用户的作品 功能依赖关注用户列表，所以如果用户启用了该功能，也需要更新关注列表
    if (
      !settings.highlightFollowingUsers &&
      !settings.removeWorksOfFollowedUsersOnSearchPage
    ) {
      return
    }

    // 因为本程序不区分公开和非公开关注，所以只储存总数
    let newTotal = 0
    const type = ['show', 'hide'] as const
    for (const rest of type) {
      const total = await this.getFollowingTotal(rest)
      newTotal = newTotal + total
    }

    if (newTotal !== this.total) {
      console.log(
        `关注用户总数量变化 ${this.total} -> ${newTotal}，请求更新关注列表`
      )
      this.total = newTotal
      browser.runtime.sendMessage({
        msg: 'needUpdateFollowingData',
        user: store.loggedUserID,
      })
    }
  }

  // getList 的等待队列。当一个 getList 已经在执行时，再次调用 getList 的话会进入等待队列，等待 getList 完毕
  private queue: Function[] = []
  private executeQueue() {
    while (this.queue.length > 0) {
      const func = this.queue.shift()!
      func()
    }
  }
}

const followingList = new FollowingList()
export { followingList }
