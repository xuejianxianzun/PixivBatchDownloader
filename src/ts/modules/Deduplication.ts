import config from './Config'
import { EVT } from './EVT'
import { form } from './Settings'
import { store } from './Store'
import { IDB } from './IndexedDB'

// 去重。保存和查询下载记录
class Deduplication {
  constructor() {
    this.init()
  }


  private db!: IDBDatabase
  private historyName = 'history' // 下载任务元数据的表名

  private readonly testMode = false // 调试存储状况的开关

  private async init() {
    if (location.hostname.includes('pixivision.net')) {
      return
    }

    this.db = await this.initDB()
    this.bindEvent()
    this.testMode && this.test(1000000)
  }

  // 初始化数据库，获取数据库对象
  private async initDB() {
    // 创建表和索引
    window.addEventListener(EVT.events.DBupgradeneeded, (ev: CustomEventInit) => {
      const db = ev.detail.data.db as IDBDatabase
      if (!db.objectStoreNames.contains(this.historyName)) {
        const store = db.createObjectStore(this.historyName, { keyPath: 'id' })
        store.createIndex('id', 'id', { unique: true })
      }
    })

    return new Promise<IDBDatabase>(async (resolve, reject) => {
      const db = await IDB.open(config.DBName, config.DBVer)
      resolve(db)
    })
  }

  private bindEvent() {
    // 当有文件下载完成时，存储这个任务的记录
    window.addEventListener(EVT.events.downloadSucccess, () => {

    })
  }


  // 添加指定数量的测试数据，模拟抓取完毕事件，用于调试存储情况
  // 这个数据由于 id 是重复的，所以不能正常下载
  private test(num: number) {
    while (num > 0) {

      num--
    }
  }
}

const deduplication = new Deduplication()
export { deduplication }
