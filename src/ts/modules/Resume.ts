import config from './Config'
import { EVT } from './EVT'
import { store } from './Store'
import { downloadStates, DLStatesI } from './DownloadStates'
import { WorkInfo } from './Store.d'

interface DownloadTaskData {
  id: number,
  url: string,
  data: WorkInfo[]
}

interface DLStates {
  id: number,
  states: DLStatesI
}

class Resume {
  constructor() {
    this.init()
  }

  public mode = false

  private db!: IDBDatabase
  private taskName = 'downloadTask'
  private statesName = 'downloadStates'
  private taskId!: number
  private statesData!: DLStates

  private async init() {
    await this.initDB()
    this.resetData()
    this.restoreData()
    // 最后再绑定事件。因为这个类既监听了 crawlFinish，又会发出 crawlFinish，所以需要把监听放到最后面。
    this.bindEvent()
  }

  private resetData() {
    this.mode = false

    this.statesData = {
      id: 0,
      states: []
    }
  }

  private getURL() {
    return window.location.href.split('#')[0]
  }

  private async getTaskDataByURL(url: string) {
    return new Promise<DownloadTaskData | null>((resolve) => {
      const s = this.db.transaction(this.taskName, 'readonly').objectStore(this.taskName)
      const r = s.index('url').get(this.getURL())

      r.onsuccess = ev => {
        const data = r.result as DownloadTaskData
        if (data) {
          resolve(data)
        }
        resolve(null)
      }
    })
  }

  private async getDownloadedData(id: number) {
    return new Promise<DLStates | null>((resolve) => {
      const r = this.db.transaction(this.statesName, 'readonly').objectStore(this.statesName).get(id)

      r.onsuccess = ev => {
        const data = r.result as DLStates
        if (data) {
          resolve(data)
        }
        resolve(null)
      }
    })
  }

  private async restoreData() {
    const taskData = await this.getTaskDataByURL(this.getURL())
    if (!taskData) {
      this.mode = false
      return
    }

    // 恢复抓取结果
    store.result = taskData.data

    // 恢复下载状态
    const data = await this.getDownloadedData(taskData.id)
    if (data) {
      downloadStates.replace(data.states)
    }

    this.mode = true

    // 发出抓取完毕的信号
    EVT.fire(EVT.events.crawlFinish, {
      initiator: 'resume'
    })
  }

  private async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.dbName, 1)

      request.onupgradeneeded = (ev) => {
        this.db = request.result

        // 创建表和索引
        const taskStore = this.db.createObjectStore(this.taskName, { keyPath: 'id' })
        taskStore.createIndex('id', 'id', { unique: true })
        taskStore.createIndex('url', 'url', { unique: true })

        const idsStore = this.db.createObjectStore(this.statesName, { keyPath: 'id' })
        idsStore.createIndex('id', 'id', { unique: true })

        resolve()
      }

      request.onerror = (ev) => {
        reject('open indexDB failed')
      }

      request.onsuccess = (ev) => {
        this.db = request.result
        resolve()
      }
    })
  }

  private addData(storeNames: string, data: DownloadTaskData | DLStates) {
    const r = this.db.transaction(storeNames, 'readwrite').objectStore(storeNames).add(data)

    r.onsuccess = (ev) => {
      // console.log('add success')
    }
    r.onerror = (ev) => {
      console.log('add failed')
    }
  }

  private putData(storeNames: string, data: DownloadTaskData | DLStates) {
    const r = this.db.transaction(storeNames, 'readwrite').objectStore(storeNames).put(data)

    r.onsuccess = (ev) => {
      // console.log('put success')
    }
    r.onerror = (ev) => {
      console.log('put failed')
    }
  }


  private deleteData(storeNames: string, id: number) {
    const r = this.db.transaction(storeNames, 'readwrite').objectStore(storeNames).delete(id)

    r.onsuccess = (ev) => {
      // console.log('delete success')
    }
    r.onerror = (ev) => {
      console.log('delete failed')
    }
  }

  private bindEvent() {
    // 抓取完成时，保存这次任务的数据
    window.addEventListener(EVT.events.crawlFinish, async (ev:CustomEventInit) => {
      if(ev.detail.data.initiator==='resume'){
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
        data: store.result
      }
      this.addData(this.taskName, data)

      this.statesData.id = this.taskId
      this.addData(this.statesName, this.statesData)
    })

    // 当有文件下载完成时，保存下载状态
    window.addEventListener(EVT.events.downloadSucccess, (event: CustomEventInit) => {
      this.statesData.id = this.taskId
      this.statesData.states = downloadStates.states
      this.putData(this.statesName, this.statesData)
    })

    // 任务下载完毕时，清除这次任务的数据
    window.addEventListener(EVT.events.downloadComplete, () => {
      this.deleteData(this.taskName, this.taskId)
      this.deleteData(this.statesName, this.taskId)

      this.resetData()
    })

    // 开始新的抓取时，清空本类中暂存的下载状态数据（不清空数据库）
    window.addEventListener(EVT.events.crawlStart, () => {
      this.resetData()
    })
  }

}

const resume = new Resume()
export { resume }
