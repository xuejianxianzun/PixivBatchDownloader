import { List } from './HighlightFollowingUsers'

interface Task {
  /**请求执行的动作：添加，移除，整个覆写 */
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

    chrome.runtime.onInstalled.addListener(async () => {
      // 每次更新或刷新扩展时尝试读取数据，如果数据不存在则设置数据
      const data = await chrome.storage.local.get(this.store)
      if (data[this.store] === undefined || Array.isArray(data[this.store]) === false) {
        this.storage()
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
          const tabs = await this.findAllPixivTab()
          const find = tabs.find(tab => tab.id === this.updateTaskTabID)
          if (!find) {
            this.updateTaskTabID = sender!.tab!.id!
            console.log('改为让这次发起请求的标签页执行更新任务')
          } else {
            // 如果上次执行更新任务的标签页依然存在，且状态锁定，则拒绝这次请求
            console.log('上次执行更新任务的标签页依然存在，且状态锁定，拒绝这次请求')
            return
          }
        } else {
          this.updateTaskTabID = sender!.tab!.id!
        }

        this.status = 'locked'
        console.log('执行更新任务的标签页', this.updateTaskTabID)

        chrome.tabs.sendMessage(this.updateTaskTabID, {
          msg: 'getFollowingData'
        })
      }

      if (msg.msg === 'changeFollowingData') {
        const task = msg.data as Task
        // 当前台获取新的关注列表完成之后，会发送此消息。
        // 如果发送消息的页面和发起请求的页面是同一个，则解除锁定状态
        if (task.action === 'set') {
          if (sender!.tab!.id === this.updateTaskTabID) {
            // set 操作不会被放入队列中，而且总是会被立即执行
            // 这是因为在请求数据的过程中可能产生了其他操作，set 操作的数据可能已经是旧的了
            // 所以需要先应用 set 里的数据，然后再执行其他操作，在旧数据的基础上进行修改
            this.setData(task)
            console.log('更新数据完成，解除锁定')

            // 如果队列中没有等待的操作，则立即派发数据并储存数据
            // 如果有等待的操作，则不派发和储存数据，因为稍后队列执行完毕后也会派发和储存数据
            // 这是为了避免重复派发和储存数据，避免影响性能
            if (this.queue.length === 0) {
              this.dispath()
              this.storage()
            }

            this.statusToIdle()
            return
          } else {
            // 如果不是同一个页面，则这个 set 操作会被丢弃
            return
          }
        }

        this.queue.push(task)
        this.executionQueue()
      }

    })

    this.checkDeadlock()
  }

  private readonly store = 'following'

  private data: List = []

  /**当状态为 locked 时，如果有新的任务，则将其放入等待队列 */
  private queue: Task[] = []

  private status: 'idle' | 'loading' | 'locked' = 'idle'

  private updateTaskTabID = 0

  private async load() {
    if (this.status !== 'idle') {
      return
    }

    this.status = 'loading'
    const data = await chrome.storage.local.get(this.store)
    console.log(data)
    if (data[this.store] && Array.isArray(data[this.store])) {
      this.data = data[this.store]
      this.statusToIdle()
    } else {
      return setTimeout(() => {
        this.load()
      }, 500)
    }

    console.log('已加载关注用户列表数据', this.data)
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

  private storage() {
    return chrome.storage.local.set({ following: this.data })
  }

  /**执行队列中的所有操作 */
  private executionQueue() {
    if (this.status !== 'idle' || this.queue.length === 0) {
      return
    }

    console.log('队列中的操作数量', this.queue.length)
    
    while (this.queue.length > 0) {
      // set 操作不会在此处执行
      const queue = this.queue.shift()!
      if (queue.action === 'add') {
        this.addData(queue)
      } else if (queue.action === 'remove') {
        this.removeData(queue)
      }
    }

    // 队列中的所有操作完成后一次性派发和储存数据
    this.dispath()

    this.storage()
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
  }

  private addData(task: Task) {
    const index = this.data.findIndex(
      (following) => following.user === task.user
    )
    if (index === -1) {
      return
    }

    this.data[index].following = this.data[index].following.concat(task.IDList)
    this.data[index].privateTotal = task.privateTotal
    this.data[index].publicTotal = task.publicTotal
    this.data[index].time = new Date().getTime()
  }

  private removeData(task: Task) {
    const index = this.data.findIndex(
      (following) => following.user === task.user
    )
    if (index === -1) {
      return
    }

    for (const id of task.IDList) {
      const i = this.data[index].following.findIndex(str => str === id)
      if (i > -1) {
        this.data[index].following.splice(i, 1)
      }
    }

    this.data[index].privateTotal = task.privateTotal
    this.data[index].publicTotal = task.publicTotal
    this.data[index].time = new Date().getTime()
  }

  private async findAllPixivTab() {
    const tabs = await chrome.tabs.query({
      url: 'https://*.pixiv.net/*'
    })
    return tabs
  }

  private statusToIdle() {
    this.status = 'idle'
    this.executionQueue()
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
          this.statusToIdle()
        }
      }
    }, 30000)
  }
}

new ManageFollowing()
