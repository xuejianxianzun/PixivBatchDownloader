export interface FollowingData {
  /** 指示这个对象属于哪个用户 id **/
  user: string
  /** 用户的关注用户的 id 列表 **/
  following: string[]
  /** 此用户的关注用户总数。这是公开和非公开关注的数量之和。因为本程序不区分一个关注是公开的还是非公开的
   *  注意这可能与 following 的 length 不同，因为这是按照 API 返回的 total 计算的，但是 API 返回的实际用户数量可能比 total 少
   */
  total: number
  /** 最后一次更新本地数据的时间戳 **/
  time: number
}

export type List = FollowingData[]

interface SetData {
  /**数据属于哪个用户 */
  user: string
  /**此用户的关注用户的 id 列表 **/
  following: string[]
  /**此用户的关注用户总数。注意这可能与 following 的 length 不同*/
  total: number
}

interface UserOperate {
  action: '' | 'add' | 'remove'
  loggedUserID: string
  userID: string
}

// 这是一个后台脚本
class ManageFollowing {
  constructor() {
    this.restore()

    chrome.runtime.onInstalled.addListener(async () => {
      // 每次更新或刷新扩展时尝试读取数据，如果数据不存在则设置数据
      const data = await chrome.storage.local.get(this.store)
      if (
        data[this.store] === undefined ||
        Array.isArray(data[this.store]) === false
      ) {
        this.storage()
      }
    })

    chrome.runtime.onMessage.addListener(async (msg, sender) => {
      if (msg.msg === 'requestFollowingData') {
        this.dispatchFollowingList(sender?.tab)
      }

      if (msg.msg === 'needUpdateFollowingData') {
        if (this.status === 'locked') {
          // 查询上次执行更新任务的标签页还是否存在，如果不存在，
          // 则改为让这次发起请求的标签页执行更新任务
          const tabs = await this.findAllPixivTab()
          const find = tabs.find((tab) => tab.id === this.updateTaskTabID)
          if (!find) {
            this.updateTaskTabID = sender!.tab!.id!
          } else {
            // 如果上次执行更新任务的标签页依然存在，且状态锁定，则拒绝这次请求
            return
          }
        } else {
          this.updateTaskTabID = sender!.tab!.id!
        }

        this.status = 'locked'

        chrome.tabs.sendMessage(this.updateTaskTabID, {
          msg: 'updateFollowingData',
        })
      }

      if (msg.msg === 'setFollowingData') {
        const data = msg.data as SetData
        // 当前台获取新的关注列表完成之后，会发送此消息。
        // 如果发送消息的页面和发起请求的页面是同一个，则解除锁定状态
        if (sender!.tab!.id === this.updateTaskTabID) {
          // set 操作不会被放入等待队列中，而且总是会被立即执行
          // 这是因为在请求数据的过程中可能产生了其他操作，set 操作的数据可能已经是旧的了
          // 所以需要先应用 set 里的数据，然后再执行其他操作，在旧数据的基础上进行修改
          this.setData(data)

          // 如果队列中没有等待的操作，则立即派发数据并储存数据
          // 如果有等待的操作，则不派发和储存数据，因为稍后队列执行完毕后也会派发和储存数据
          // 这是为了避免重复派发和储存数据，避免影响性能
          if (this.queue.length === 0) {
            this.dispatchFollowingList()
            this.storage()
          }

          this.status = 'idle'
          return
        }
        // 如果不是同一个页面，这个 set 操作会被丢弃
      }
    })

    // 监听用户新增或取消一个关注的请求
    // 由于某些逻辑相似，就添加到一个监听器里了
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        if (details.method === 'POST') {
          if (details?.requestBody?.formData) {
            let operate: UserOperate = {
              action: '',
              loggedUserID: '',
              userID: '',
            }

            // 检查数据格式是否是自己需要的，以防这个 URL 有其他用途
            const formData = details.requestBody.formData
            if (details.url.endsWith('bookmark_add.php')) {
              const check =
                formData.mode &&
                formData.mode[0] === 'add' &&
                formData.user_id &&
                formData.user_id[0]
              if (check) {
                operate.action = 'add'
                operate.userID = formData.user_id[0]
              } else {
                return
              }
            }

            if (details.url.endsWith('rpc_group_setting.php')) {
              const check =
                formData.mode &&
                formData.mode[0] === 'del' &&
                formData.type &&
                formData.type[0] === 'bookuser' &&
                formData.id &&
                formData.id[0]
              if (check) {
                operate.action = 'remove'
                operate.userID = formData.id[0]
              } else {
                return
              }
            }

            // 获取发起请求的标签页里的登录的用户 ID
            chrome.tabs.sendMessage(
              details.tabId,
              {
                msg: 'getLoggedUserID',
              },
              (response) => {
                if (response?.loggedUserID) {
                  operate.loggedUserID = response.loggedUserID
                  this.queue.push(operate)
                  this.executionQueue()
                }
              }
            )
          }
        }
      },
      {
        urls: [
          'https://*.pixiv.net/bookmark_add.php',
          'https://*.pixiv.net/rpc_group_setting.php',
        ],
        types: ['xmlhttprequest'],
      },
      ['requestBody']
    )

    setInterval(() => {
      this.executionQueue()
    }, 1000)

    this.checkDeadlock()

    this.clearUnusedData()
  }

  private readonly store = 'following'

  private data: List = []

  /**当状态为 locked 时，如果需要增加或删除某个关注的用户，则将其放入等待队列 */
  private queue: UserOperate[] = []

  private status: 'idle' | 'loading' | 'locked' = 'idle'

  private updateTaskTabID = 0

  private async restore() {
    if (this.status !== 'idle') {
      return
    }

    this.status = 'loading'
    const data = await chrome.storage.local.get(this.store)
    if (data[this.store] && Array.isArray(data[this.store])) {
      this.data = data[this.store]
      this.status = 'idle'
    } else {
      return setTimeout(() => {
        this.restore()
      }, 500)
    }
  }

  /**向前台脚本派发数据
   * 可以指定向哪个 tab 派发
   * 如果未指定 tab，则向所有的 pixiv 标签页派发
   */
  private async dispatchFollowingList(tab?: chrome.tabs.Tab) {
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        msg: 'dispathFollowingData',
        data: this.data,
      })
    } else {
      const tabs = await this.findAllPixivTab()
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id!, {
          msg: 'dispathFollowingData',
          data: this.data,
        })
      }
    }
  }

  private async dispatchRecaptchaToken(
    recaptcha_enterprise_score_token: string
  ) {
    const tabs = await this.findAllPixivTab()
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id!, {
        msg: 'dispatchRecaptchaToken',
        data: recaptcha_enterprise_score_token,
      })
    }
  }

  private storage() {
    return chrome.storage.local.set({ following: this.data })
  }

  /**执行队列中的所有操作 */
  private executionQueue() {
    if (this.status !== 'idle' || this.queue.length === 0) {
      return
    }

    while (this.queue.length > 0) {
      // set 操作不会在此处执行
      const queue = this.queue.shift()!
      this.addOrRemoveOne(queue)
    }

    // 队列中的所有操作完成后，派发和储存数据
    this.dispatchFollowingList()

    this.storage()
  }

  private setData(data: SetData) {
    const index = this.data.findIndex(
      (following) => following.user === data.user
    )
    if (index > -1) {
      this.data[index].following = data.following
      this.data[index].total = data.total
      this.data[index].time = new Date().getTime()
    } else {
      this.data.push({
        user: data.user,
        following: data.following,
        total: data.total,
        time: new Date().getTime(),
      })
    }
  }

  private addOrRemoveOne(operate: UserOperate) {
    const i = this.data.findIndex(
      (following) => following.user === operate.loggedUserID
    )
    if (i === -1) {
      return
    }

    if (operate.action === 'add') {
      this.data[i].following.push(operate.userID)
      this.data[i].total = this.data[i].total + 1
    } else if (operate.action === 'remove') {
      const index = this.data[i].following.findIndex(
        (id) => id === operate.userID
      )
      if (index > -1) {
        this.data[i].following.splice(index, 1)
        this.data[i].total = this.data[i].total - 1
      }
    } else {
      return
    }

    this.data[i].time = new Date().getTime()
  }

  private async findAllPixivTab() {
    const tabs = await chrome.tabs.query({
      url: 'https://*.pixiv.net/*',
    })
    return tabs
  }

  /**解除死锁
   * 一个标签页在执行更新任务时可能会被用户关闭，这会导致锁死
   * 定时检查执行更新任务的标签页是否还存在，如果不存在则解除死锁
   */
  private checkDeadlock() {
    setInterval(async () => {
      if (this.status === 'locked') {
        const tabs = await this.findAllPixivTab()
        const find = tabs.find((tab) => tab.id === this.updateTaskTabID)
        if (!find) {
          this.status = 'idle'
        }
      }
    }, 30000)
  }

  /**如果某个用户的关注数据 30 天没有修改过，则清除对应的数据 */
  private clearUnusedData() {
    setInterval(() => {
      const day30ms = 2592000000
      for (let index = 0; index < this.data.length; index++) {
        const item = this.data[index]
        if (new Date().getTime() - item.time > day30ms) {
          this.data.splice(index, 1)

          this.dispatchFollowingList()
          this.storage()
          break
        }
      }
    }, 3600000)
  }
}

new ManageFollowing()
