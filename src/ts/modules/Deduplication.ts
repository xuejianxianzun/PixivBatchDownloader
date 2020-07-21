import config from './Config'
import { EVT } from './EVT'
import { form } from './Settings'
import { DonwloadSuccessData } from './Download.d'
import { IDB } from './IndexedDB'

interface Record {
  id: string
  n: string
}

// 去重。保存和查询下载记录
class Deduplication {
  constructor() {
    this.init()
  }


  private db!: IDBDatabase
  private recordName = 'record' // 下载任务元数据的表名

  private storeNameList:string[] = []

  private duplicateList:string[] = [] // 储存已经检测到的重复文件的 id。当向数据库添加记录时，可以先查询这个列表，如果已经有过记录就不再添加了。因为添加重复记录会出现一个错误，尽量避免

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
      if (!db.objectStoreNames.contains(this.recordName)) {
        const store = db.createObjectStore(this.recordName, { keyPath: 'id' })
        store.createIndex('id', 'id', { unique: true })
      }
    })

    return new Promise<IDBDatabase>(async (resolve, reject) => {
      resolve(await IDB.open(config.DBName, config.DBVer))
    })
  }

  // 生成一个下载记录
  private createRecord(resultId: string): Record {
    return {
      id: resultId,
      n: form.userSetName.value
    }
  }

  private bindEvent() {
    // 当有文件下载完成时，存储这个任务的记录
    window.addEventListener(EVT.events.downloadSucccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      if(this.duplicateList.includes(successData.id)){
        return
      }

      const data = this.createRecord(successData.id)
      IDB.add(this.recordName, data)
    })

    // 清空记录时，清空 duplicateList
  }

  public check(resultId: string) {

  }

  private clearRecords(){

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
