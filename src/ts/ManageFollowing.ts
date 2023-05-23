import { List } from './HighlightFollowingUsers'

interface Task {
  /**请求执行的动作：添加，移除，重设 */
  action: 'add' | 'remove' | 'set'
  /**要操作的数据属于哪个用户 */
  user: string
  /**要设置的用户 id 列表 */
  IDList: string[]
  privateTotal: number
  publicTotal: number
}

// 注意这是一个后台脚本
class ManageFollowing {
  constructor() {
    this.load()

    chrome.storage.local.get().then(val=>{
      console.log(val)
      for (const [key,value] of Object.entries(val)) {
        console.log(key)
        if(key.startsWith('xz')){
          console.log(value)
        }
      }
    })
    chrome.runtime.onInstalled.addListener(async () => {
      // 每次更新或刷新扩展时尝试读取数据，如果数据不存在则设置数据
      const data = await chrome.storage.local.get(this.store)
      if (data[this.store] === undefined || Array.isArray(data[this.store]) === false) {
        this.save()
      }
    })

    chrome.runtime.onMessage.addListener(async (msg, sender) => {
      if (msg.msg === 'requestFollowingData') {
        this.dispath(sender?.tab)
      }

      if (msg.msg === 'needUpdateFollowingData') {
        if (this.status === 'locked') {
          // 查询上次执行更新任务的标签页还是否存在，如果不存在，
          // 则改为让这次发起请求的标签页执行更新任务
          const lastTabInfo = this.updateTaskTabs.find(data=>data.user===msg.user)
          if(!lastTabInfo){

          }
          const tabs = await this.findAllPixivTab()
          const find = tabs.find(tab => tab.id === this.updateTaskTabID)
          if (!find) {
            this.updateTaskTabID = sender!.tab!.id!
            console.log('改为让这次发起请求的标签页执行更新任务')
          } else {
            // 如果上次执行更新任务的标签页依然存在，则拒绝这次请求
            console.log('上次执行更新任务的标签页依然存在，拒绝这次请求')
            return
          }
        } else {
          this.updateTaskTabID = sender!.tab!.id!
          
        }
        this.updateTaskTabs.push({
          tabID: sender.tab!.id!,
          user: msg.user
        })

        this.status = 'locked'
        console.log('执行更新任务的标签页', this.updateTaskTabID)

        chrome.tabs.sendMessage(this.updateTaskTabID, {
          msg: 'getFollowingData'
        })
      }

      if (msg.msg === 'setFollowingData') {
        this.status = 'idle'
        this.queue.push(msg.data)
        this.next()
      }
    })

    this.checkDeadlock()
  }

  private readonly store = 'following'

  private data: List = []

  /**当状态为 loading 时，如果有新的任务，则将其放入等待队列 */
  private queue: Task[] = []

  private status: 'idle' | 'loading' | 'locked' = 'idle'

  private updateTaskTabID = 0

  // 当确定由一个标签页执行更新时，保存它的 tab id 和所属用户
  // 没必要保存 tab 对象，因为经过测试，关闭页面后保存的 tab 对象依然存在，所以判断时还是必须用 tab id
  private updateTaskTabs: {
    tabID: chrome.tabs.Tab['id']
    user: string
  }[] = []

  private getUpdateTaskTab(user:string){

  }

  private async load() {
    if (this.status !== 'idle') {
      return
    }

    this.status = 'loading'
    const data = await chrome.storage.local.get(this.store)
    console.log(data)
    if (data[this.store] && Array.isArray(data[this.store])) {
      this.data = data[this.store]
      this.status = 'idle'
      this.next()
    } else {
      return setTimeout(() => {
        this.load()
      }, 500)
    }

    console.log('已加载关注用户列表数据', this.data)
  }

  /**当状态变为空闲时，执行队列中的等待任务 */
  private next() {
    if (this.queue.length === 0) {
      this.status = 'idle'
      return
    }

    const queue = this.queue.shift()!
    if (queue.action === 'set') {
      this.setData(queue)
    }
  }

  private setData(task: Task) {
    const index = this.data.findIndex(
      (following) => following.user === task.user
    )
    if (index > -1) {
      this.data[index].following = task.IDList
      this.data[index].privateTotal = task.privateTotal
      this.data[index].publicTotal = task.publicTotal
      this.data[index].time = new Date().getTime()
    } else {
      this.data.push({
        user: task.user,
        following: task.IDList,
        privateTotal: task.privateTotal,
        publicTotal: task.publicTotal,
        time: new Date().getTime(),
      })
    }

    this.dispath()

    this.save()
  }

  /**向前台脚本派发数据
   * 可以指定向哪个 tab 派发
   * 如果未指定 tab，则向所有 pixiv 标签页派发
   */
  private async dispath(tab?: chrome.tabs.Tab) {
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        msg: 'dispathFollowingData',
        data: this.data
      })
    } else {
      console.log('向所有标签页派发数据')
      const tabs = await this.findAllPixivTab()
      for (const tab of tabs) {
        console.log(tab)

        chrome.tabs.sendMessage(tab.id!, {
          msg: 'dispathFollowingData',
          data: this.data
        })
      }
    }
  }

  private save() {
    return chrome.storage.local.set({ following: this.data })
  }

  private async findAllPixivTab() {
    const tabs = await chrome.tabs.query({
      url: 'https://*.pixiv.net/*'
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
        const find = tabs.find(tab => tab.id === this.updateTaskTabID)
        if (!find) {
          console.log('解除死锁')
          this.status = 'idle'
        }
      }
    }, 30000)
  }
}

new ManageFollowing()
