import config from './Config'
import { EVT } from './EVT'
import { store } from './Store'
import { downloadStates, DLStatesI } from './DownloadStates'
import { WorkInfo } from './Store.d'

interface DownloadTaskData {
  id: number
  url: string
  data: WorkInfo[]
}

interface DLStates {
  id: number
  states: DLStatesI
}

// 断点续传。恢复未完成的下载
class Resume {
  constructor() {
    this.init()
  }

  public flag = false // 指示是否处于恢复模式

  private db!: IDBDatabase
  private taskName = 'downloadTask' // 下载任务数据的表名
  private statesName = 'downloadStates' // 下载状态列表的表名
  private taskId!: number // 为当前任务创建一个 id，操作数据库时使用

  private async init() {
    this.db = await this.initDB()
    this.restoreData()
    this.bindEvent()
    this.clearExired()
  }

  // 初始化数据库，获取数据库对象
  private async initDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(config.dbName, 1)

      request.onupgradeneeded = (ev) => {
        // 创建表和索引
        const taskStore = request.result.createObjectStore(this.taskName, {
          keyPath: 'id',
        })
        taskStore.createIndex('id', 'id', { unique: true })
        taskStore.createIndex('url', 'url', { unique: true })

        const idsStore = request.result.createObjectStore(this.statesName, {
          keyPath: 'id',
        })
        idsStore.createIndex('id', 'id', { unique: true })

        // resolve(request.result)
      }

      request.onerror = (ev) => {
        reject('open indexDB failed')
      }

      request.onsuccess = (ev) => {
        resolve(request.result)
      }
    })
  }

  // 恢复未完成任务的数据
  private async restoreData() {
    const taskData = await this.getTaskDataByURL(this.getURL())
    if (!taskData) {
      this.flag = false
      return
    }

    // 恢复下载任务的 id
    this.taskId = taskData.id

    // 恢复抓取结果
    store.result = taskData.data

    // 恢复下载状态
    const data = await this.getDLStates(taskData.id)
    if (data) {
      downloadStates.replace(data.states)
    }

    this.flag = true

    // 发出抓取完毕的信号
    EVT.fire(EVT.events.crawlFinish, {
      initiator: EVT.InitiatorList.resume,
    })
  }

  private bindEvent() {
    // 抓取完成时，保存这次任务的数据
    window.addEventListener(
      EVT.events.crawlFinish,
      async (ev: CustomEventInit) => {
        if (ev.detail.data.initiator === EVT.InitiatorList.resume) {
          // 如果这个事件是这个类自己发出的，则不进行处理
          return
        }
        // 首先检查这个网址下是否已经存在有数据，如果有数据，则清除之前的数据，保持每个网址只有一份数据
        const taskData = await this.getTaskDataByURL(this.getURL())
        if (taskData) {
          this.deleteData(this.taskName, taskData.id)
          this.deleteData(this.statesName, taskData.id)
        }

        // 保存本次任务的数据
        this.taskId = new Date().getTime()
        const data = {
          id: this.taskId,
          url: this.getURL(),
          data: store.result,
        }
        this.addData(this.taskName, data)

        const statesData = {
          id: this.taskId,
          states: downloadStates.states,
        }
        this.addData(this.statesName, statesData)
      }
    )

    // 当有文件下载完成时，保存下载状态
    window.addEventListener(
      EVT.events.downloadSucccess,
      (event: CustomEventInit) => {
        const statesData = {
          id: this.taskId,
          states: downloadStates.states,
        }
        this.putData(this.statesName, statesData)
      }
    )

    // 任务下载完毕时，清除这次任务的数据
    window.addEventListener(EVT.events.downloadComplete, () => {
      this.deleteData(this.taskName, this.taskId)
      this.deleteData(this.statesName, this.taskId)

      this.flag = false
    })

    // 开始新的抓取时，取消恢复模式
    window.addEventListener(EVT.events.crawlStart, () => {
      this.flag = false
    })
  }

  // 处理本页面的 url
  private getURL() {
    return window.location.href.split('#')[0]
  }

  // 根据 url，查找任务数据
  private async getTaskDataByURL(url: string) {
    return new Promise<DownloadTaskData | null>((resolve) => {
      const s = this.db
        .transaction(this.taskName, 'readonly')
        .objectStore(this.taskName)
      const r = s.index('url').get(url)

      r.onsuccess = (ev) => {
        const data = r.result as DownloadTaskData
        if (data) {
          resolve(data)
        }
        resolve(null)
      }
    })
  }

  // 根据 id 查找下载状态数据
  private async getDLStates(id: number) {
    return new Promise<DLStates | null>((resolve) => {
      const r = this.db
        .transaction(this.statesName, 'readonly')
        .objectStore(this.statesName)
        .get(id)

      r.onsuccess = (ev) => {
        const data = r.result as DLStates
        if (data) {
          resolve(data)
        }
        resolve(null)
      }
    })
  }

  // 写入新的记录
  private addData(storeNames: string, data: DownloadTaskData | DLStates) {
    const r = this.db
      .transaction(storeNames, 'readwrite')
      .objectStore(storeNames)
      .add(data)

    r.onsuccess = (ev) => {
      // console.log('add success')
    }
    r.onerror = (ev) => {
      console.error('add failed')
    }
  }

  // 更新已有记录
  // 目前只需要更新下载状态列表。因为任务数据只在抓取完成后保存一次即可。
  private putData(storeNames: string, data: DownloadTaskData | DLStates) {
    const r = this.db
      .transaction(storeNames, 'readwrite')
      .objectStore(storeNames)
      .put(data)
    r.onsuccess = (ev) => {
      // console.log('put success')
    }
    r.onerror = (ev) => {
      console.error('put failed')
    }
  }

  private deleteData(storeNames: string, id: number) {
    const r = this.db
      .transaction(storeNames, 'readwrite')
      .objectStore(storeNames)
      .delete(id)

    r.onsuccess = (ev) => {
      // console.log('delete success')
    }
    r.onerror = (ev) => {
      console.error('delete failed')
    }
  }

  // 清除过期的数据
  private clearExired() {
    // 数据的过期时间，设置为 30 天。30*24*60*60*1000
    const expiryTime = 2592000000

    const nowTime = new Date().getTime()

    const r = this.db
      .transaction(this.taskName)
      .objectStore(this.taskName)
      .openCursor()

    r.onsuccess = (ev) => {
      if (r.result) {
        const data = r.result.value as DownloadTaskData
        // 删除过期的数据
        if (nowTime - data.id > expiryTime) {
          this.deleteData(this.taskName, data.id)
          this.deleteData(this.statesName, data.id)
        }
        r.result.continue()
      }
    }
    r.onerror = (ev) => {
      console.error('openCursor failed')
    }
  }
}

const resume = new Resume()
export { resume }
