import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { DonwloadSuccessData } from './DownloadType'
import { IndexedDB } from '../utils/IndexedDB'
import { store } from '../store/Store'
import { fileName } from '../FileName'
import { Utils } from '../utils/Utils'
import { Result } from '../store/StoreType'
import { DownloadRecordManager } from './DownloadRecordManager'

export interface DownloadRecordType {
  id: string
  n: string
  /** 作品的发布/修改时间。可能为 undefined，因为旧版本没有这个数据 */
  d?: string
}

/** 添加和查询下载记录 */
class DownloadRecord {
  constructor() {
    this.IDB = new IndexedDB()
    new DownloadRecordManager(this.IDB, this.storeNameList)
    this.dbReady = this.init()
  }

  private IDB: IndexedDB
  /** 等待数据库初始化完成的 Promise，用于防止在 DB 就绪前查询 */
  private dbReady: Promise<void>
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
  ]

  private existedIdList: string[] = [] // 检查文件是否重复时，会查询数据库。查询到的数据的 id 会保存到这个列表里。当向数据库添加记录时，可以先查询这个列表，如果已经有过记录就改为 put 而不是 add，因为添加主键重复的数据会报错

  // 从图片 url 里取出日期字符串的正则表达式
  private readonly dateRegExp = /img\/(.*)\//

  private async init() {
    await this.initDB()
    this.bindEvents()
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

    return this.IDB.open(this.DBName, this.DBVer, onUpdate)
  }

  private bindEvents() {
    // 当有文件下载完成时，存储这个任务的记录
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      // console.log(successData)
      // 如果文件名异常，不保存这个下载记录，以便用户之后重新下载这个文件
      if (successData.uuid) {
        return
      }

      // 所以下载器在保存和判断重复文件时，使用的都是 filename.createFileName() 生成的文件名
      // 即使文件名在实际下载流程中被修改，也不会影响这里保存的文件名，所以不会影响检测重复文件的功能。
      const result = store.findResult(successData.id)
      result && this.addRecordFromResult(result)
    })

    // 监听清空下载记录的事件
    window.addEventListener(EVT.list.clearDownloadRecord, () => {
      this.existedIdList = []
    })
  }

  // 当要查找或存储一个 id 时，返回它所对应的 storeName
  private getStoreName(id: string) {
    const firstNum = parseInt(id[0])
    return this.storeNameList[firstNum - 1]
  }

  /**返回作品的修改日期字符串 */
  private getDateString(result: Result) {
    // 图像作品不使用 uploadDate，这是历史遗留原因，因为以前下载器的内部数据里没有 uploadDate 数据
    // 而是从文件 URL 里取出日期字符串。例如
    // 'https://i.pximg.net/img-original/img/2021/10/11/00/00/06/93364702_p0.png'
    // 返回
    // '2021/10/11/00/00/06'
    // 为了保持向后兼容，这里不做修改
    if (result.type !== 3) {
      return result.original.match(this.dateRegExp)![1]
    } else {
      // 小说作品使用 uploadDate，返回值如
      // '2021-09-03T14:31:03+00:00'
      return result.uploadDate
    }
  }

  // 生成一个下载记录
  private createRecord(data: Result | string): DownloadRecordType {
    let result: Result | undefined = undefined
    if (typeof data === 'string') {
      result = store.findResult(data)
    } else {
      result = data
    }
    if (result === undefined) {
      throw new Error('createRecord failed')
    }

    return {
      id: result.id,
      n: fileName.createFileName(result),
      d: this.getDateString(result),
    }
  }

  /** 传入一个 Result 对象，添加它的下载记录 */
  private async addRecordFromResult(result: Result) {
    const record = this.createRecord(result)
    this.addRecordFromRecord(record)
  }

  /** 传入一个构造好的 Record 对象，添加它的下载记录 */
  public async addRecordFromRecord(record: DownloadRecordType) {
    const storeName = this.getStoreName(record.id)
    if (this.existedIdList.includes(record.id)) {
      this.IDB.put(storeName, record)
    } else {
      // 先查询有没有这个记录
      const exists = await this.getRecord(record.id)
      this.IDB[exists ? 'put' : 'add'](storeName, record)
    }
  }

  // 在有 10,000 条下载记录时，我下载了 100 个文件进行测试，get 查询的平均耗时为 6.45 ms。
  // 现代浏览器的 IndexedDB 实现通常基于 B-tree 或类似平衡树来维护主键索引，其单点查找时间复杂度是 O(log N)，即对数级别。即使有 1,000,000 条记录，单次查询的时间也不会大幅增加，可能平均值在 10 ms 左右。
  public async getRecord(id: string) {
    await this.dbReady
    const storeName = this.getStoreName(id)
    const record = (await this.IDB.get(
      storeName,
      id
    )) as DownloadRecordType | null
    if (record) {
      this.existedIdList.push(record.id)
    }
    // console.log('getRecord', id, record)
    return record
  }

  /** 检查一个作品是否是重复下载
   *
   * 返回值 true 表示重复，false 表示不重复
   */
  public async checkDeduplication(result: Result) {
    if (!Utils.isPixiv()) {
      return false
    }

    // 如果未启用去重，直接返回不重复
    if (!settings.deduplication) {
      return false
    }

    const record = await this.getRecord(result.id)
    if (record === null) {
      return false
    }

    // 有记录，说明这个文件下载过

    // 首先检查日期字符串是否发生了变化
    // 如果日期字符串变化了，则不视为重复文件
    if (record.d !== undefined && record.d !== this.getDateString(result)) {
      return false
    }
    // 如果之前的下载记录里没有日期，说明是早期的下载记录，那么就不检查日期
    // 同时，更新这个作品的下载记录，为其添加日期
    if (record.d === undefined) {
      this.addRecordFromResult(result)
    }
    // 如果日期字符串没有变化，再根据策略进行判断
    if (settings.dupliStrategy === 'loose') {
      // 如果是宽松策略（不比较文件名）
      return true
    } else {
      // 如果是严格策略（比较文件名）
      const name = fileName.createFileName(result)
      return name === record.n
    }
  }
}

const downloadRecord = new DownloadRecord()
export { downloadRecord }
