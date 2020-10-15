import { API } from './API'
import { DOM } from './DOM'
import { EVT } from './EVT'
import { lang } from './Lang'
import { settings } from './setting/Settings'
import { DonwloadSuccessData } from './Download.d'
import { IndexedDB } from './IndexedDB'
import { store } from './Store'
import { fileName } from './FileName'

interface Record {
  id: string
  n: string
}

// 去重
// 通过保存和查询下载记录，判断重复文件
class Deduplication {
  constructor() {
    this.IDB = new IndexedDB()
    this.init()
  }

  private IDB: IndexedDB
  private readonly DBName = 'DLRecord'
  private readonly DBVer = 1
  private readonly storeNameList: string[] = [
    'record1',
    'record2',
    'record3',
    'record4',
    'record5',
    'record6',
    'record7',
    'record8',
    'record9',
  ] // 表名的列表

  private skipIdList: string[] = [] // 被跳过下载的文件的 id。当收到下载成功事件时，根据这个 id 列表判断这个文件是不是真的被下载了。如果这个文件是被跳过的，则不保存到下载记录里。

  private existedIdList: string[] = [] // 检查文件是否重复时，会查询数据库。查询到的数据的 id 会保存到这个列表里。当向数据库添加记录时，可以先查询这个列表，如果已经有过记录就改为 put 而不是 add，因为添加主键重复的数据会报错

  private async init() {
    await this.initDB()
    this.bindEvent()
  }

  // 初始化数据库，获取数据库对象
  private async initDB() {
    // 在升级事件里创建表和索引
    const onUpdate = (db: IDBDatabase) => {
      for (const name of this.storeNameList) {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: 'id' })
          store.createIndex('id', 'id', { unique: true })
        }
      }
    }

    return new Promise<IDBDatabase>(async (resolve, reject) => {
      resolve(await this.IDB.open(this.DBName, this.DBVer, onUpdate))
    })
  }

  private bindEvent() {
    // 当有文件被跳过时，保存到 skipIdList
    window.addEventListener(EVT.list.skipDownload, (ev: CustomEventInit) => {
      const data = ev.detail.data as DonwloadSuccessData
      this.skipIdList.push(data.id)
    })

    // 当有文件下载完成时，存储这个任务的记录
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      this.add(successData.id)
    })

    // 当抓取完成、下载完成时，清空 skipIdList 列表
    ;[EVT.list.crawlFinish, EVT.list.downloadComplete].forEach(val => {
      window.addEventListener(val, () => {
        this.skipIdList = []
      })
    })

    // 导入下载记录的按钮
    {
      const btn = document.querySelector('#importDownloadRecord')
      if (btn) {
        btn.addEventListener('click', () => {
          EVT.fire(EVT.list.importDownloadRecord)
        })
      }
    }

    // 监听导入下载记录的事件
    window.addEventListener(EVT.list.importDownloadRecord, () => {
      // 创建 input 元素选择文件
      const i = document.createElement('input')
      i.setAttribute('type', 'file')
      i.setAttribute('accept', 'application/json')
      i.onchange = () => {
        if (i.files && i.files.length > 0) {
          // 读取文件内容
          const reader = new FileReader()
          reader.readAsText(i.files[0])
          reader.onload = () => {
            const str = reader.result as string
            let record: Record[] = []
            try {
              record = JSON.parse(str) as Record[]
            } catch (error) {
              const msg = 'JSON parse error!'
              window.alert(msg)
              throw new Error(msg)
            }
            // 判断格式是否符合要求
            if (
              Array.isArray(record) === false ||
              record[0].id === undefined ||
              record[0].n === undefined
            ) {
              const msg = 'Format error!'
              window.alert(msg)
              throw new Error(msg)
            }
            // 开始导入
            this.importRecord(record)
          }
        }
      }

      i.click()
    })

    // 导出下载记录的按钮
    {
      const btn = document.querySelector('#exportDownloadRecord')
      if (btn) {
        btn.addEventListener('click', () => {
          EVT.fire(EVT.list.exportDownloadRecord)
        })
      }
    }

    // 监听导出下载记录的事件
    window.addEventListener(EVT.list.exportDownloadRecord, () => {
      this.exportRecord()
    })

    // 清空下载记录的按钮
    {
      const btn = document.querySelector('#clearDownloadRecord')
      if (btn) {
        btn.addEventListener('click', () => {
          EVT.fire(EVT.list.clearDownloadRecord)
        })
      }
    }

    // 监听清空下载记录的事件
    window.addEventListener(EVT.list.clearDownloadRecord, () => {
      this.clearRecords()
      this.existedIdList = []
    })
  }

  // 当要查找或存储一个 id 时，返回它所对应的 storeName
  private getStoreName(id: string) {
    const firstNum = parseInt(id[0])
    return this.storeNameList[firstNum - 1]
  }

  // 生成一个下载记录
  private createRecord(resultId: string): Record {
    let name = settings.userSetName

    // 查找这个抓取结果，获取其文件名
    for (const result of store.result) {
      if (result.id === resultId) {
        name = fileName.getFileName(result)
        break
      }
    }

    return {
      id: resultId,
      n: name,
    }
  }

  // 添加一条下载记录
  private async add(resultId: string) {
    // 不储存被跳过下载的文件
    if (this.skipIdList.includes(resultId)) {
      return
    }

    const storeName = this.getStoreName(resultId)
    const data = this.createRecord(resultId)

    if (this.existedIdList.includes(resultId)) {
      this.IDB.put(storeName, data)
    } else {
      this.IDB.add(storeName, data).catch(() => {
        this.IDB.put(storeName, data)
      })
    }
  }

  // 检查一个 id 是否是重复下载
  // 返回值 true 表示重复，false 表示不重复
  public async check(resultId: string) {
    if (location.hostname.includes('pixivision.net')) {
      return false
    }

    return new Promise<boolean>(async (resolve, reject) => {
      // 如果未启用去重，直接返回不重复
      if (!settings.deduplication) {
        resolve(false)
      }
      // 在数据库进行查找
      const storeNmae = this.getStoreName(resultId)
      const data = (await this.IDB.get(storeNmae, resultId)) as Record | null
      // 查询结果为空，返回不重复
      if (data === null) {
        resolve(false)
      } else {
        this.existedIdList.push(data.id)
        // 查询到了对应的记录，根据策略进行判断
        if (settings.dupliStrategy === 'loose') {
          // 如果是宽松策略（只考虑 id），返回重复
          resolve(true)
        } else {
          // 如果是严格策略（同时考虑 id 和文件名），则比较文件名
          const record = this.createRecord(resultId)
          resolve(record.n === data.n)
        }
      }
    })
  }

  // 清空下载记录
  private clearRecords() {
    for (const name of this.storeNameList) {
      this.IDB.clear(name)
    }
    window.alert(lang.transl('_下载记录已清除'))
  }

  private async exportRecord() {
    let record: Record[] = []
    for (const name of this.storeNameList) {
      const r = (await this.IDB.getAll(name)) as Record[]
      record = record.concat(r)
    }

    const str = JSON.stringify(record, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    DOM.downloadFile(
      url,
      `record-${API.replaceUnsafeStr(new Date().toLocaleString())}.json`,
    )
  }

  private importRecord(record: Record[]) {
    console.log(record)
  }
}

const deduplication = new Deduplication()
export { deduplication }
