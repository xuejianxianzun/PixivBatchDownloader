import config from './Config'
import { EVT } from './EVT'
import { store } from './Store'
import { WorkInfo } from './Store.d'
import { DonwloadSuccessData } from './Download.d'

interface DownloadTaskData {
  id: number,
  url: string,
  data: WorkInfo[]
}

interface DownloadedItemData {
  id: number,
  ids: string[]
}

class Resume {
  constructor() {
    this.init()
  }

  private db!: IDBDatabase
  private taskName = 'downloadTask'
  private idsName = 'downloadedItem'
  private taskId!: number
  private downloadedItemData!: DownloadedItemData

  private async init() {
    await this.initDB()
    this.resetData()
    this.restoreData()
    this.bindEvent()
  }

  private resetData() {
    this.downloadedItemData = {
      id: 0,
      ids: []
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
    return new Promise<DownloadedItemData | null>((resolve) => {
      const r = this.db.transaction(this.idsName, 'readonly').objectStore(this.idsName).get(id)

      r.onsuccess = ev => {
        const data = r.result as DownloadedItemData
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
      return
    }

    // 恢复抓取结果
    store.result = taskData.data

    // 恢复下载状态
    const downloadedData = await this.getDownloadedData(taskData.id)
    if (downloadedData) {
      store.downloadedIds = downloadedData.ids
    }

    // 发出抓取完毕的信号
    EVT.fire(EVT.events.crawlFinish)
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

        const idsStore = this.db.createObjectStore(this.idsName, { keyPath: 'id' })
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

  private addData(storeNames: string, data: DownloadTaskData | DownloadedItemData) {
    const r = this.db.transaction(storeNames, 'readwrite').objectStore(storeNames).add(data)

    r.onsuccess = (ev) => {
      // console.log('add success')
    }
    r.onerror = (ev) => {
      console.log('add failed')
    }
  }

  private putData(storeNames: string, data: DownloadTaskData | DownloadedItemData) {
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
    window.addEventListener(EVT.events.crawlFinish, async () => {
      // 首先检查这个网址下是否已经存在有数据，如果有数据，则清除之前的数据，保持每个网址只有一份数据
      const taskData = await this.getTaskDataByURL(this.getURL())
      if (taskData) {
        this.deleteData(this.taskName, taskData.id)
        this.deleteData(this.idsName, taskData.id)
      }

      // 保存本次任务的数据
      this.taskId = new Date().getTime()
      const data = {
        id: this.taskId,
        url: this.getURL(),
        data: store.result
      }
      this.addData(this.taskName, data)

      this.downloadedItemData.id = this.taskId
      this.addData(this.idsName, this.downloadedItemData)
    })

    // 当有文件下载完成时，添加到已下载列表
    window.addEventListener(EVT.events.downloadSucccess, (event: CustomEventInit) => {
      const evData = event.detail.data as DonwloadSuccessData
      this.downloadedItemData.ids.push(evData.id)
      this.putData(this.idsName, this.downloadedItemData)
    })

    // 任务下载完毕时，清除这次任务的数据
    window.addEventListener(EVT.events.downloadComplete, () => {
      this.deleteData(this.taskName, this.taskId)
      this.deleteData(this.idsName, this.taskId)

      this.resetData()
    })

    // 开始新的抓取时，清空本类中暂存的 id 列表数据（不清空数据库）
    window.addEventListener(EVT.events.crawlStart, () => {
      this.resetData()
    })
  }

}

const resume = new Resume()
export { resume }
