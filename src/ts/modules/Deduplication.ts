import { DOM } from './DOM'
import { EVT } from './EVT'
import { lang } from './Lang'
import { log } from './Log'
import { settings } from './setting/Settings'
import { DonwloadSuccessData } from './Download.d'
import { IndexedDB } from './IndexedDB'
import { store } from './Store'
import { fileName } from './FileName'
import { Tools } from './Tools'

interface Record {
  id: string
  n: string
}

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

  private existedIdList: string[] = [] // 检查文件是否重复时，会查询数据库。查询到的数据的 id 会保存到这个列表里。当向数据库添加记录时，可以先查询这个列表，如果已经有过记录就改为 put 而不是 add，因为添加主键重复的数据会报错

  private async init() {
    await this.initDB()
    this.bindEvents()
    // this.exportTestFile(10)
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

  private bindEvents() {
    // 当有文件下载完成时，存储这个任务的记录
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      this.add(successData.id)
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
      this.importRecord()
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
    const storeName = this.getStoreName(resultId)
    const data = this.createRecord(resultId)

    if (this.existedIdList.includes(resultId)) {
      this.IDB.put(storeName, data)
    } else {
      // 先查询有没有这个记录
      const result = await this.IDB.get(storeName, data.id)
      const type: 'add' | 'put' = result ? 'put' : 'add'
      this.IDB[type](storeName, data)
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
        return resolve(false)
      }
      // 在数据库进行查找
      const storeNmae = this.getStoreName(resultId)
      const data = (await this.IDB.get(storeNmae, resultId)) as Record | null
      // 查询结果为空，返回不重复
      if (data === null) {
        return resolve(false)
      } else {
        this.existedIdList.push(data.id)
        // 查询到了对应的记录，根据策略进行判断
        if (settings.dupliStrategy === 'loose') {
          // 如果是宽松策略（只考虑 id），返回重复
          return resolve(true)
        } else {
          // 如果是严格策略（同时考虑 id 和文件名），则比较文件名
          const record = this.createRecord(resultId)
          return resolve(record.n === data.n)
        }
      }
    })
  }

  // 清空下载记录
  private clearRecords() {
    for (const name of this.storeNameList) {
      this.IDB.clear(name)
    }

    EVT.fire(EVT.list.sendToast, {
      text: lang.transl('_下载记录已清除'),
      bgColorType: 'green',
    })
  }

  // 导出下载记录
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
      `record-${Tools.replaceUnsafeStr(new Date().toLocaleString())}.json`
    )
  }

  // 导入下载记录
  private async importRecord() {
    const record = (await DOM.loadJSONFile().catch((err) => {
      return EVT.sendMsg({
        type: 'error',
        msg: err,
      })
    })) as Record[]

    if (!record) {
      return
    }

    // 判断格式是否符合要求
    if (
      Array.isArray(record) === false ||
      record[0].id === undefined ||
      record[0].n === undefined
    ) {
      const msg = 'Format error!'
      return EVT.sendMsg({
        msg: msg,
        type: 'error',
      })
    }

    // 开始导入
    log.warning(lang.transl('_导入下载记录'))
    let stored = 0
    let total = record.length
    let t = 0
    t = window.setInterval(() => {
      log.log(`${stored}/${total}`, 1, false)
      if (stored >= total) {
        log.success(lang.transl('_完成'))
        window.clearInterval(t)
      }
    }, 500)

    // 依次处理每个存储库
    for (let index = 0; index < this.storeNameList.length; index++) {
      // 提取出要存入这个存储库的数据
      const data: Record[] = []
      for (const r of record) {
        if (parseInt(r.id[0]) - 1 === index) {
          data.push(r)
        }
      }
      // 批量添加数据
      await this.IDB.batchAddData(this.storeNameList[index], data, 'id')
      stored += data.length
    }

    EVT.sendMsg({
      msg: `${lang.transl('_导入下载记录')}<br>${lang.transl('_完成')}`,
      type: 'success',
    })

    // 时间参考：导入 100000 条下载记录，花费的时间在 30 秒以内。但偶尔会有例外，中途像卡住了一样，很久没动，最后花了两分钟多的时间。
  }

  // 创建一个文件，模拟导出的下载记录
  private exportTestFile(number: number) {
    let r: Record[] = []
    for (let index = 1; index <= number; index++) {
      r.push({
        id: index.toString(),
        n: index.toString(),
      })
    }
    const str = JSON.stringify(r, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    DOM.downloadFile(url, `record-test-${number}.json`)
  }
}

const deduplication = new Deduplication()
export { deduplication }
