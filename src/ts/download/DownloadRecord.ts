import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { DonwloadSuccessData } from './DownloadType'
import { IndexedDB } from '../utils/IndexedDB'
import { store } from '../store/Store'
import { fileName } from '../FileName'
import { Utils } from '../utils/Utils'
import { Result } from '../store/StoreType'
import { DownloadRecordManager } from './DownloadRecordManager'
import { log } from '../Log'
import { lang } from '../Language'
import { msgBox } from '../MsgBox'

/** 建好下载记录的存储库
 *
 * 1 版本的数据库给每个存储库都建了一个 id 索引，而它和主键（keyPath 也是 id）完全重复，
 * 从来没有被任何查询用到。但它会让每次写入和清除都多维护一份索引数据，导致导入和清除下载记录时的速度变慢。
 * 所以新版本不再创建它，并在升级时把已有的删掉。
 *
 * @param db 升级事件里的数据库对象
 * @param transaction 版本变更事务。修改已存在的存储库必须用它，
 *                    不能在升级事件里另开 db.transaction()：那样新事务要等升级结束后才执行，
 *                    那时已经不允许改结构了，deleteIndex 会失败
 */
function createRecordStores(
  db: IDBDatabase,
  transaction: IDBTransaction | undefined,
  storeNameList: string[]
) {
  for (const name of storeNameList) {
    if (!db.objectStoreNames.contains(name)) {
      // 新建存储库。注意：不要再建 id 索引
      db.createObjectStore(name, { keyPath: 'id' })
    } else if (transaction) {
      // 数据库已存在（从旧版本升级上来）：删掉冗余的索引。
      // 用 try/catch 包住：删不掉只是回到以前的慢速度，不能让整个升级失败
      try {
        const store = transaction.objectStore(name)
        if (store.indexNames.contains('id')) {
          store.deleteIndex('id')
        }
      } catch (error) {
        console.warn(`delete legacy index failed in ${name}`)
      }
    }
  }
}

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
  /** 是否已经申请过持久化存储。每个页面只需要申请一次 */
  private persistentStorageRequested = false
  private readonly DBName = 'DLRecord'
  /** 数据库版本。
   * 2 版本开始不再给每个存储库建那个和主键完全重复的 id 索引，并在升级时删掉已有的
   * （它从来没有被用到，却会让写入和清除都多维护一份数据，是导入/清除慢的主要原因）。
   * 2 版本那次升级用错了事务（在升级事件里另开 db.transaction()），索引实际没删成，
   * 所以再升一次版本，用版本变更事务重新删 */
  private readonly DBVer = 3
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

  // 从图片 url 里取出日期字符串的正则表达式
  private readonly dateRegExp = /img\/(.*)\//

  private async init() {
    // 数据库打不开时（例如版本升级被其他标签页阻塞）整个模块降级为「不记录下载记录」：
    // 这时不绑定事件，避免之后写数据库时报错；异常也不能逃出去变成未处理的拒绝
    if (!(await this.initDB())) {
      return
    }

    this.bindEvents()
  }

  /** 申请持久化存储，避免下载记录所在的 IndexedDB 在磁盘空间紧张时被浏览器清除。
   *
   * 下载记录是用户辛苦攒下来的数据（用来去重），一旦被清除很难恢复，
   * 而站点数据默认是 best-effort 的存储，可以被浏览器按 LRU 清掉。
   *
   * 只在第一次成功写入下载记录之后申请一次：Firefox 会为此弹出一个授权框，
   * 不能在页面刚加载时就打断用户；而用户真正产生了下载记录，才说明这个功能对他有意义。
   * 浏览器可能拒绝（Chrome 按站点参与度等信号自动决定，不会弹窗），这是正常的，不影响功能，所以只记录到控制台。
   */
  private async requestPersistentStorage() {
    if (this.persistentStorageRequested) {
      return
    }
    this.persistentStorageRequested = true

    const persisted = await Utils.requestPersistentStorage()
    if (!persisted) {
      console.info('[PPD] persistent storage is not granted')
    }
  }

  // 初始化数据库，获取数据库对象
  private async initDB() {
    // 在升级事件里创建存储库（并删掉旧版本冗余的索引）
    const onUpdate = (
      db: IDBDatabase,
      transaction: IDBTransaction,
      oldVersion: number
    ) => {
      // oldVersion 为 0 表示数据库不存在、这是全新安装：这时只是建库，用户没有数据受影响，
      // 不需要提示。只有从旧版本升级上来时才提示（旧库里可能有很多记录，
      // 删索引等操作会让数据库在一段时间内不可用）
      if (oldVersion > 0) {
        // 只有真的开始升级了才会走到这里。在这之前，open 请求可能只是被其他标签页
        // 阻塞着（那样会走 onblocked，不会触发升级），所以提示要放在这里
        this.showUpgradeStart()

        // 升级事务提交之后才算升级完成（出错中止的话不会触发 complete，也就不会误报）
        transaction.oncomplete = () => {
          this.showUpgradeComplete()
        }
      }

      createRecordStores(db, transaction, this.storeNameList)
    }

    try {
      await this.IDB.open(this.DBName, this.DBVer, onUpdate)
      return true
    } catch (ev) {
      const errorName = IndexedDB.getErrorName(ev)
      if (errorName === 'BlockedError') {
        // 升级被其他标签页阻塞（那些标签页还开着旧版本的连接）。
        // 这时下载记录功能会暂停，直到用户刷新其他标签页，所以要说清楚该怎么办
        log.error(lang.transl('_IndexedDB被其他标签页阻塞'))
      } else {
        log.error(lang.transl('_IndexedDB打不开', errorName))
      }
      return false
    }
  }

  /** 数据库升级开始的提示。升级期间数据库不可用，所以要让用户知道并暂停下载 */
  private showUpgradeStart() {
    const msg = lang.transl('_IndexedDB需要升级')
    log.warning('🚀' + msg)
    msgBox.warning(msg)
  }

  /** 数据库升级完成的提示 */
  private showUpgradeComplete() {
    const msg = lang.transl('_IndexedDB升级完成')
    log.success('✅' + msg)
    msgBox.success(msg)
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
    // 数据库不可用时直接跳过（写不进去，也不应该报错）
    if (!this.IDB.db) {
      return
    }
    const storeName = this.getStoreName(record.id)

    // 直接 put：同一个作品的记录本来就应该以最近一次下载的为准。
    // 以前要先查一次数据库才知道用 add 还是 put，每条记录都多付一次查询
    // （还要在 existedIdList 这个数组里做线性查找），而现在一次写入就够了
    try {
      await this.IDB.put(storeName, record)
    } catch (error) {
      log.error(IndexedDB.getErrorName(error))
      return
    }

    // 写入成功说明用户确实在积累下载记录，这时才值得申请持久化存储（每个页面只申请一次）
    this.requestPersistentStorage()
  }

  // 在有 10,000 条下载记录时，我下载了 100 个文件进行测试，get 查询的平均耗时为 6.45 ms。
  // 现代浏览器的 IndexedDB 实现通常基于 B-tree 或类似平衡树来维护主键索引，其单点查找时间复杂度是 O(log N)，即对数级别。即使有 1,000,000 条记录，单次查询的时间也不会大幅增加，可能平均值在 10 ms 左右。
  public async getRecord(id: string) {
    await this.dbReady
    // 数据库不可用时当作「没有记录」：去重会失效，但不会让下载流程报错
    if (!this.IDB.db) {
      return null
    }
    const storeName = this.getStoreName(id)
    const record = (await this.IDB.get(
      storeName,
      id
    )) as DownloadRecordType | null
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
export { createRecordStores, downloadRecord }
