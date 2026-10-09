import { EVT } from '../EVT'
import { log } from '../Log'
import { lang } from '../Language'
import { store, ColorBlockedRecord } from '../store/Store'
import { states } from '../store/States'
import { downloadStates, DLStatesI } from './DownloadStates'
import { Result } from '../store/StoreType'
import { IndexedDB } from '../utils/IndexedDB'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'

interface TaskMeta {
  id: number
  url: string
  URLWhenCrawlStart: string
  part: number
  date: Date
  /** 被图片色彩检查排除的图片索引：[作品的数字 id, 排除记录]
   *
   * 它必须和任务数据一起存下来，不能靠 result 反推：result 里没有的图片索引既可能是「被色彩排除」的，
   * 也可能是「被多图作品设置排除」的，反推无法区分（见 restoreResultMetaFromResult 里的兜底逻辑）。
   *
   * 数据量不大（只有多图作品才可能有），所以直接放在 meta 记录里，不另建表：
   * ⚠️ 新建表需要提升 DBVer，而 IndexedDB 的升级在有其他标签页持有旧连接时会被阻塞，
   * 那会让整个 Resume 模块初始化不了（连保存的监听都绑不上） */
  colorBlocked?: [number, ColorBlockedRecord][]
}

interface TaskData {
  id: number
  data: Result[]
}

interface TaskStates {
  id: number
  states: DLStatesI
}

// 断点续传。恢复未完成的下载
class Resume {
  constructor() {
    this.IDB = new IndexedDB()
    this.init()
  }

  private IDB: IndexedDB
  private readonly DBName = 'PBD'
  private readonly DBVer = 3
  /** 记住数据库实际的版本（见 getDBVer） */
  private readonly dbVerKey = 'PBD_DBVer'
  private metaName = 'taskMeta' // 下载任务元数据的表名
  private dataName = 'taskData' // 下载任务数据的表名
  private statesName = 'taskStates' // 下载状态列表的表名
  // 本模块所操作的下载数据的 id
  private taskId!: number

  private part: number[] = [] // 储存每个分段里的数据的数量

  private try = 0 // 任务结果是分批储存的，记录每批失败了几次。根据失败次数减少每批的数量

  // 尝试存储抓取结果时，单次存储的数量不能超过这个数字。因为超过这个数字可能会碰到单次存储的上限
  // 由于每个结果的体积可能不同，所以这只是一个预估值
  // 这有助于减少尝试次数。因为存储的思路是存储失败时改为上次数量的 1/2。例如有 100 w 个结果，存储算法会依次尝试存入 100 w、50 w、25 w、12.5 w 以此类推，直到最后有一次能成功存储一批数据。这样的话就进行了 4 次尝试才成功存入一批数据。但通过直接指定一批数据的大小为 onceMax，理想情况下可以只尝试一次就成功存入一批数据。
  // 非理想情况下，即这个数量的结果已经超过了单次存储上限（目前推测这可能会在大量抓取小说、动图时出现；如果抓取的作品大部分是插画、漫画，这个数量的结果应该不可能超出存储上限），那么这不会减少尝试数量，但因为每次尝试存储的数量不会超过这个数字，这依然有助于减少每次尝试时的资源占用、耗费时间。
  private readonly onceMax = 150000

  private readonly putStatesTime = 1000 // 每隔指定时间存储一次最新的下载状态

  private needPutStates = false // 指示是否需要更新存储的下载状态

  private async init() {
    if (!Utils.isPixiv()) {
      return
    }

    const dbReady = await this.initDB()

    // ⚠️ 不管数据库有没有打开成功，都要绑定事件。
    // 如果数据库打不开（例如版本升级被其他标签页阻塞）就在这里中断，
    // 那么「抓取完成时保存抓取结果」的监听就永远不会被绑上，
    // 表现为「抓取完成后不保存抓取结果」，而其它功能看起来一切正常，很难排查
    this.bindEvents()

    if (!dbReady) {
      return
    }

    if (states.settingInitialized) {
      this.restoreData()
    }

    this.regularPutStates()
    this.clearExired()
  }

  /** 初始化数据库，返回是否成功。
   *
   * ⚠️ **不抛出异常**：数据库不可用时只影响「保存 / 恢复抓取结果」，
   * 不应该让整个模块的初始化流程中断（见 init 里的说明）。
   *
   * 带版本打开失败时退化为「按数据库当前的版本打开」：
   * - 数据库的版本高于请求的版本（用户用过更高的版本）→ VersionError
   * - 请求的版本高于数据库当前的版本，但还有别的连接在打开它 → 请求被阻塞
   * 不带版本打开不会触发升级，所以这两种情况都能绕过去。 */
  private async initDB(): Promise<boolean> {
    // 在升级事件里创建表和索引
    const onUpdate = (db: IDBDatabase) => {
      if (!db.objectStoreNames.contains(this.metaName)) {
        const metaStore = db.createObjectStore(this.metaName, {
          keyPath: 'id',
        })
        metaStore.createIndex('id', 'id', { unique: true })
        metaStore.createIndex('url', 'url', { unique: true })
      }

      if (!db.objectStoreNames.contains(this.dataName)) {
        const dataStore = db.createObjectStore(this.dataName, {
          keyPath: 'id',
        })
        dataStore.createIndex('id', 'id', { unique: true })
      }

      if (!db.objectStoreNames.contains(this.statesName)) {
        const statesStore = db.createObjectStore(this.statesName, {
          keyPath: 'id',
        })
        statesStore.createIndex('id', 'id', { unique: true })
      }
    }

    // 数据库实际的版本可能比 DBVer 高（用户用过某个更高的版本），直接用那个版本打开，
    // 这样就不会每次都先撞一次 VersionError
    const ver = this.getDBVer()

    try {
      await this.IDB.open(this.DBName, ver, onUpdate)
      return true
    } catch (ev) {
      log.warning(
        lang.transl('_IndexedDB改为按当前版本打开', IndexedDB.getErrorName(ev))
      )
    }

    // 不带版本打开：它不会触发升级，所以上面那两种情况都绕得过去
    try {
      const db = await this.IDB.open(this.DBName)
      // 这样打开的数据库可能缺表（数据库是在更早的版本里创建的，而升级没能进行）。
      // 缺表时保存和恢复都会报错，所以判定为失败，别装作能用
      const missing = [this.metaName, this.dataName, this.statesName].filter(
        (name) => !db.objectStoreNames.contains(name)
      )
      if (missing.length > 0) {
        log.error(lang.transl('_IndexedDB缺少数据表', missing.join(', ')))
        return false
      }
      // 记住实际的版本，下次直接用它打开
      if (db.version !== ver) {
        try {
          localStorage.setItem(this.dbVerKey, db.version.toString())
        } catch (err) {
          // 写不进去只是失去这个优化，不能因此判定「数据库打不开」（见下面的 catch 分支）
        }
      }
      return true
    } catch (ev) {
      log.error(lang.transl('_IndexedDB打不开', IndexedDB.getErrorName(ev)))
      return false
    }
  }

  /** 打开数据库时要用的版本：取「代码里的 DBVer」与「上次发现的实际版本」中较大的那个。
   *
   * 数据库的实际版本可能比 DBVer 高（用户用过某个更高的版本，而 IndexedDB 不支持降级）。
   * 用较大的版本打开，才不会每次都先撞一次 VersionError */
  private getDBVer() {
    // ⚠️ 这个方法在 initDB 的 try 之外被调用，所以它自己绝不能抛：
    // 禁用站点数据等情况读取 localStorage 会抛异常，而 initDB 承诺了「不抛出异常」
    try {
      const saved = Number.parseInt(localStorage.getItem(this.dbVerKey) || '')
      return Number.isFinite(saved) && saved > this.DBVer ? saved : this.DBVer
    } catch (err) {
      // 取不到就按代码里的 DBVer 走
      return this.DBVer
    }
  }

  private bindEvents() {
    // 切换页面时，重新检查恢复数据
    const restoreEvt = [EVT.list.pageSwitch, EVT.list.settingInitialized]
    restoreEvt.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.restoreData()
      })
    })

    // 抓取完成时，保存这次任务的数据
    const evs = [EVT.list.crawlComplete, EVT.list.resultChange]
    for (const ev of evs) {
      window.addEventListener(ev, async () => {
        // 注意：即使 store.result 为空，也要保存数据。这是为了覆盖之前的数据。
        // 例如用户在搜索页面先产生了 100  个抓取结果，之后通过筛选条件排除了所有结果，使结果变成 0
        // 此时依然需要保存抓取结果，以覆盖已经不需要的 100 个结果。
        // 如果此时不保存抓取结果，那么刷新页面之后，就会恢复之前的 100 个结果。
        // if (store.result.length > 0) {}
        this.saveData()
      })
    }

    // 当有文件下载完成或者跳过下载时，更新下载状态
    const saveEv = [EVT.list.downloadSuccess, EVT.list.skipDownload]
    saveEv.forEach((val) => {
      window.addEventListener(val, () => {
        this.needPutStates = true
      })
    })

    // 任务下载完毕时，以及停止任务时，清除这次任务的数据
    const clearDataEv = [EVT.list.downloadComplete, EVT.list.downloadStop]
    for (const ev of clearDataEv) {
      window.addEventListener(ev, async () => {
        this.clearData(ev)
      })
    }

    // 清空已保存的抓取结果
    window.addEventListener(EVT.list.clearSavedCrawl, () => {
      this.clearSavedCrawl()
    })
  }

  // 恢复未完成任务的数据
  private async restoreData() {
    // 如果下载器在抓取或者在下载，则不恢复数据
    if (states.busy) {
      return
    }

    // 数据库不可用时不恢复。init() 在初始化失败时不会调用这里，
    // 但 pageSwitch / settingInitialized 的监听也会调用它，所以要挡一下
    if (!this.IDB.db) {
      return
    }

    // 1 获取任务的元数据
    const meta = (await this.IDB.get(
      this.metaName,
      this.getURL(),
      'url'
    )) as TaskMeta | null
    if (!meta) {
      return
    }

    log.log(lang.transl('_正在恢复抓取结果'))

    this.taskId = meta.id

    // 2 恢复抓取结果

    // 生成每批数据的 id 列表
    const dataIdList: number[] = this.createIdList(meta.id, meta.part)
    // 读取全部数据并恢复
    const promiseList = []
    for (const id of dataIdList) {
      promiseList.push(this.IDB.get(this.dataName, id))
    }

    await Promise.all(promiseList).then((res) => {
      // 恢复数据时不适合使用 store.addResult，因为那样会被多图作品设置影响，可能导致恢复的数据和之前下载时不一致
      // 所以这里直接替换整个 store.result
      store.result = []
      const r = res as TaskData[]
      for (const taskData of r) {
        for (const data of taskData.data) {
          store.result.push(data)
        }
      }

      store.resetDownloadCount()

      // 过去没有保存过 resultMeta，所以这里根据刚刚恢复的 result 反向生成它。
      // 这样恢复之后“在结果中筛选”、预览列表等功能才能正常工作
      store.restoreResultMetaFromResult()
    })

    // 3 恢复下载状态
    const data = (await this.IDB.get(
      this.statesName,
      this.taskId
    )) as TaskStates

    // 保存的下载状态必须和恢复的抓取结果数量一致，否则下载时会读到 store.result 之外的下标。
    // 不一致时（例如保存 states 失败）就重建状态列表，保证两者一一对应
    if (data?.states?.length === store.result.length) {
      downloadStates.replace(data.states)
    } else {
      downloadStates.init()
    }

    store.crawlCompleteTime = meta.date
    store.URLWhenCrawlStart = meta.URLWhenCrawlStart || ''

    // 恢复抓取完成的时间，这样恢复出来的结果才不会被判定为「已经下载完毕」。
    // 注意类型不同：meta.date 是 Date，而 states.crawlCompleteTime 是时间戳。
    // 如果 meta.date 缺失或无效（例如数据由旧版本保存），就当作刚刚抓取完成。
    // 这样会判定为「未下载完毕」，是这个判定的安全方向：放弃下载时依然会向用户确认
    const crawlCompleteTime = meta.date
      ? new Date(meta.date).getTime()
      : Number.NaN
    states.crawlCompleteTime = Number.isFinite(crawlCompleteTime)
      ? crawlCompleteTime
      : Date.now()

    // 4 恢复「被色彩检查排除的图片索引」。
    // 有了它，恢复之后再做删除/筛选作品时，不会把被色彩排除的图片又加回来。
    //
    // ⚠️ 必须放在 restoreResultMetaFromResult() 之后：那个方法会先按 result 反推一份（给旧数据兜底），
    // 这里再用精确保存的数据覆盖它。旧数据（没有 colorBlocked 字段）时保持反推的结果
    if (meta.colorBlocked) {
      store.restoreColorBlockedIndexes(meta.colorBlocked)
    }

    // 恢复模式就绪
    await states.waitSettingInitialized()
    log.success(lang.transl('_已恢复抓取结果'), 'restoreCrawlResult')
    EVT.fire('resume')
  }

  // 保存数据的串行队列。把每次保存请求串到同一条队列上，
  // 保证 get → delete → add 严格按顺序执行，避免并发的 saveData 互相穿插，
  // 导致同一 url 的两条记录撞上 taskMeta 表的 url 唯一索引而报错。
  private saveDataChain: Promise<void> = Promise.resolve()

  private saveData() {
    // 无论上一次保存成功还是失败，都把本次保存接到队列末尾顺序执行
    const run = () => this.saveDataInner()
    const p = this.saveDataChain.then(run, run)
    // 忽略单次保存失败，避免阻塞后续保存
    const handled = p.catch((error) => {
      // 失败原因可能是字符串（这层封装会 reject 字符串）、事件对象或 Error，
      // 所以统一交给 IndexedDB.getErrorName 取一个能看懂的原因
      log.error(lang.transl('_保存抓取结果失败', IndexedDB.getErrorName(error)))
    })
    // ⚠️ 返回处理过的这个：调用方是事件监听，拿到原始 Promise 会产生未处理的拒绝
    this.saveDataChain = handled
    return handled
  }

  private async saveDataInner() {
    // 首先检查这个网址下是否已经存在数据，如果有数据，则清除之前的数据，保持每个网址只有一份数据
    const taskData = (await this.IDB.get(
      this.metaName,
      this.getURL(),
      'url'
    )) as TaskMeta | null

    if (taskData) {
      await this.IDB.delete(this.metaName, taskData.id)
      await this.IDB.delete(this.statesName, taskData.id)
    }

    // 保存本次任务的数据
    // 如果此时本次任务已经完成，就不进行保存了
    if (states.downloadCompleteOrStop) {
      return
    }

    // log.warning(lang.transl('_正在保存抓取结果'))
    this.taskId = Date.now()

    this.part = []

    await this.saveTaskData()

    // 保存 meta 数据
    // 被图片色彩检查排除的图片索引也放在这里（见 TaskMeta.colorBlocked）
    const metaData: TaskMeta = {
      id: this.taskId,
      url: this.getURL(),
      URLWhenCrawlStart: store.URLWhenCrawlStart,
      part: this.part.length,
      date: store.crawlCompleteTime,
      colorBlocked: store.getColorBlockedIndexes(),
    }

    // add 必须 await，否则下一个排队的保存可能在它提交前就读取/插入，撞上 url 唯一索引
    // 主键冲突时退化为 put 保存（仍 await，确保本次写入完成后再进行下一次保存）
    await this.IDB.add(this.metaName, metaData).catch(async (err) => {
      // 有时错误信息是这样的：Key already exists in the object store
      // 所以尝试使用 put 来保存 meta 数据
      await this.IDB.put(this.metaName, metaData)
    })

    // 保存 states 数据
    const statesData = {
      id: this.taskId,
      states: downloadStates.states,
    }

    await this.IDB.add(this.statesName, statesData)

    log.success(lang.transl('_已保存抓取结果'), 'saveCrawlResult')
  }

  // 存储抓取结果
  private async saveTaskData(): Promise<void> {
    // 每一批任务的第一次执行会尝试保存所有剩余数据(0.5 的 0 次幂是 1)
    // 如果出错了，则每次执行会尝试保存上一次数据量的一半，直到这次存储成功
    // 之后继续进行下一批任务（如果有）
    let tryNum = Math.floor(store.result.length * Math.pow(0.5, this.try))
    // 如果这批尝试数据大于指定数量，则设置为指定数量
    tryNum > this.onceMax && (tryNum = this.onceMax)
    let data = {
      id: this.numAppendNum(this.taskId, this.part.length),
      data: store.result.slice(
        this.getPartTotal(),
        this.getPartTotal() + tryNum
      ),
    }

    try {
      // 当成功存储了一批数据时
      await this.IDB.add(this.dataName, data)
      this.part.push(data.data.length) // 记录这一次保存的结果数量
      this.try = 0 // 重置已尝试次数

      // 任务数据全部添加完毕
      if (this.getPartTotal() >= store.result.length) {
        return
      } else {
        // 任务数据没有添加完毕，继续添加
        return this.saveTaskData()
      }
    } catch (error: Error | any) {
      // 当存储失败时
      console.error(error)
      if (error.target && error.target.error && error.target.error.message) {
        const msg = error.target.error.message as string
        if (msg.includes('too large')) {
          // 体积超大
          // 尝试次数 + 1 ，进行下一次尝试
          this.try++
          return this.saveTaskData()
        } else {
          // 未知错误，不再进行尝试
          this.try = 0
          log.error('IndexedDB: ' + msg)
          throw error
        }
      }
    }
  }

  // 定时 put 下载状态
  private async regularPutStates() {
    window.setInterval(() => {
      if (this.needPutStates) {
        const statesData = {
          id: this.taskId,
          states: downloadStates.states,
        }
        this.needPutStates = false
        // 如果此时本次任务已经完成，就不进行保存了
        if (states.downloadCompleteOrStop) {
          return
        }
        this.IDB.put(this.statesName, statesData)
      }
    }, this.putStatesTime)
  }

  private async clearData(ev: string) {
    if (!this.taskId) {
      return
    }
    const meta = (await this.IDB.get(this.metaName, this.taskId)) as TaskMeta

    if (!meta) {
      return
    }

    this.IDB.delete(this.metaName, this.taskId)
    this.IDB.delete(this.statesName, this.taskId)

    const dataIdList = this.createIdList(this.taskId, meta.part)
    for (const id of dataIdList) {
      this.IDB.delete(this.dataName, id)
    }

    // 当因为停止下载而清除保存的抓取结果时，显示提示，让用户知道这个机制
    if (ev === EVT.list.downloadStop) {
      log.warning(lang.transl('_已清除这个URL里保存的抓取结果'))
    }
  }

  // 清除过期的数据
  private async clearExired() {
    // 数据的过期时间，设置为 30 天。30*24*60*60*1000
    const expiryTime = 2592000000

    // 每隔一天检查一次数据是否过期
    const nowTime = Date.now()
    let lastCheckTime = 0
    const storeName = 'lastCheckExired'
    const data = localStorage.getItem(storeName)
    if (data === null) {
      localStorage.setItem(storeName, lastCheckTime.toString())
    } else {
      lastCheckTime = Number.parseInt(data)
    }
    if (nowTime - lastCheckTime < 86400000) {
      return
    }
    localStorage.setItem(storeName, nowTime.toString())

    // 检查数据是否过期
    const callback = (item: IDBCursorWithValue | null) => {
      if (item) {
        const data = item.value as TaskMeta
        if (nowTime - data.id > expiryTime) {
          this.IDB.delete(this.metaName, data.id)
          this.IDB.delete(this.statesName, data.id)

          const dataIdList = this.createIdList(data.id, data.part)
          for (const id of dataIdList) {
            this.IDB.delete(this.dataName, id)
          }
        }
        item.continue()
      }
    }

    this.IDB.openCursor(this.metaName, callback)
  }

  // 计算 part 数组里的数字之和
  private getPartTotal() {
    if (this.part.length === 0) {
      return 0
    }

    return this.part.reduce((prev, curr) => {
      return prev + curr
    })
  }

  // 处理本页面的 url
  private getURL() {
    return window.location.href.split('#')[0]
  }

  // 在数字后面追加数字
  // 用于在 task id  后面追加序号数字(part)
  private numAppendNum(id: number, num: number) {
    return parseInt(id.toString() + num)
  }

  // 根据 taskMeta 里的 id 和 part 数量，生成 taskData 里对应的数据的 id 列表
  private createIdList(taskid: number, part: number) {
    // part 记录数据分成了几部分，所以是从 1 开始的，而不是从 0 开始
    // 生成的 id 的结尾是从 0 开始增加的
    const arr = []
    let start = 0
    while (start < part) {
      arr.push(this.numAppendNum(taskid, start))
      start++
    }
    return arr
  }

  // 清空已保存的抓取结果
  private async clearSavedCrawl() {
    await Promise.all([
      this.IDB.clear(this.metaName),
      this.IDB.clear(this.dataName),
      this.IDB.clear(this.statesName),
    ])
    toast.success(lang.transl('_数据清除完毕'))
  }
}

new Resume()
