import { IndexedDB } from '../utils/IndexedDB'
import { lang } from '../Language'
import { log } from '../Log'
import { toast } from '../Toast'
import { msgBox } from '../MsgBox'
import { Utils } from '../utils/Utils'
import { Tools } from '../Tools'
import { Config } from '../Config'
import { DownloadRecordType } from './DownloadRecord'
import { EVT } from '../EVT'
import browser from 'webextension-polyfill'

/** 导入、导出、清空下载记录 */
// 简单的测试记录文档：notes/导入下载记录时的效率-花费的时间.md
class DownloadRecordManager {
  constructor(IDB: IndexedDB, storeNameList: string[]) {
    this.IDB = IDB
    this.storeNameList = storeNameList
    this.bindEvents()
  }

  private IDB: IndexedDB
  private storeNameList: string[]

  /** 移动端建议的单次导入体积上限（100 MB）
   *
   * 移动端浏览器可用的内存比桌面端小得多，而导入时要把所有文件的 JSON
   * 文本和解析出的记录都放进内存，一次性导入太大的文件可能会失败。
   * 超过这个体积时只是给出提示，不会阻止导入 */
  private readonly mobileImportSizeLimit = 104857600

  /** 在扩展的 storage.local 里记录「上一次导出时，下载记录共有多少条」。
   *
   * 为什么需要它：下载记录保存在 pixiv.net 这个 origin 的 IndexedDB 里，
   * 而浏览器在磁盘空间紧张时会按 LRU 清掉整个 origin 的数据，
   * IndexedDB 检测到损坏时也会「删掉整个库再新建一个空库」（这是 Chromium 的既定行为）。
   * 这两种情况下记录都会凭空消失，而我们只能看到「数据库是空的」，
   * 无法区分「本来就没记录」和「记录被浏览器清掉了」。
   *
   * 扩展自己的 storage.local 属于扩展的 origin，不会被 pixiv 站点的数据清理影响，
   * 所以用它存一个「上次已知的记录数」，就能在发现数据库为空时提醒用户，而不是谎报「没有可用数据」。
   */
  private readonly lastCountStoreName = 'downloadRecordLastCount'

  /** 导出大文件时，下载之后延迟回收 blob URL 的时间（毫秒）。
   * 手机上上百 MB 的 blob 可能过几秒才真正开始被读取，200 毫秒就回收会导致下载失败 */
  private readonly exportRevokeDelay = 10000

  private bindEvents() {
    // 监听导出下载记录的事件
    window.addEventListener(EVT.list.exportDownloadRecord, () => {
      // 兜底：这些流程里如果还有没被捕获的异常，也不能让它变成静默的未处理拒绝，
      // 否则用户什么都看不到，只会觉得「卡住了」
      this.exportRecord().catch((error) => {
        log.error(IndexedDB.getErrorName(error))
      })
    })

    // 监听导入下载记录的事件
    window.addEventListener(EVT.list.importDownloadRecord, () => {
      this.importRecordFromJSON().catch((error) => {
        log.error(IndexedDB.getErrorName(error))
      })
    })

    // 导入含有 id 列表的 TXT 文件
    window.addEventListener(EVT.list.importDownloadRecordTXT, () => {
      this.importRecordFromTxt().catch((error) => {
        log.error(IndexedDB.getErrorName(error))
      })
    })

    // 监听清空下载记录的事件
    window.addEventListener(EVT.list.clearDownloadRecord, () => {
      this.clearRecords().catch((error) => {
        log.error(IndexedDB.getErrorName(error))
      })
    })
  }

  /** 记录「上一次已知的记录数」。失败时静默忽略：这只是辅助信息，不能影响正常功能 */
  private async setLastKnownCount(count: number) {
    try {
      await browser.storage.local.set({ [this.lastCountStoreName]: count })
    } catch (error) {
      // 扩展被更新/卸载时可能写不进去，忽略即可
    }
  }

  /** 读取「上一次已知的记录数」，读不到时返回 0 */
  private async getLastKnownCount(): Promise<number> {
    try {
      const data = await browser.storage.local.get(this.lastCountStoreName)
      const count = data[this.lastCountStoreName]
      return typeof count === 'number' ? count : 0
    } catch (error) {
      return 0
    }
  }

  /** 数据库不可用时的提示。
   *
   * 这些流程（导出、导入、清空）都要先确认数据库可用：否则底层的操作会失败，
   * 用户要么什么都看不到（看起来像卡住），要么看到「9 个存储库清除失败」这种误导性的信息
   */
  private showDatabaseUnavailable() {
    const msg = lang.transl('_下载记录数据库不可用')
    log.error(msg)
    toast.error(msg)
  }

  // 清空下载记录
  private async clearRecords() {
    if (!this.IDB.db) {
      return this.showDatabaseUnavailable()
    }

    if (window.confirm(lang.transl('_确定要清除下载记录吗')) === false) {
      return
    }

    log.success('🚀' + lang.transl('_清除下载记录'))
    toast.show(lang.transl('_开始清除下载记录'))
    EVT.fire('closeSettingsPanel')
    const startTime = Date.now()

    const total = this.storeNameList.length
    /** 已经清除完成的存储库数量 */
    let finished = 0

    // 9 个存储库互不相干，可以并行清除（IndexedDB 允许不同存储库的事务并发执行）。
    // 记录多的时候每个库可能要几秒到几十秒，串行等 9 次太久了
    const results = await Promise.all(
      this.storeNameList.map(async (name) => {
        try {
          await this.IDB.clear(name)
        } catch (error) {
          log.error(IndexedDB.getErrorName(error))
          return false
        }
        // 每清完一个存储库就报告一次进度，别让用户干等着
        finished++
        log.log(`${lang.transl('_任务进度')} ${finished}/${total}`)
        return true
      })
    )
    const failed = results.filter((ok) => ok === false).length

    // 用户主动清空的，所以标记也归零，之后导出时不会误报「记录被清除」
    await this.setLastKnownCount(0)

    log.log(lang.transl('_耗时毫秒', (Date.now() - startTime).toString()))

    // 有存储库没清掉时不能说「已清除」
    if (failed > 0) {
      const msg = lang.transl(
        '_部分下载记录清除失败',
        failed.toString(),
        total.toString()
      )
      log.error(msg)
      msgBox.error(msg)
      return
    }

    log.success(lang.transl('_下载记录已清除'))
    toast.success(lang.transl('_下载记录已清除'))
  }

  /** 惰性读取所有存储库的下载记录，一批一批地交出去
   *
   * 三个目的：
   * 1. 不把 9 个存储库的数据汇总成一个数组（那样光是记录数组就可能会占几 GB 内存）；
   * 2. 按页读取：内存里只有当前这一页，而不是「一个存储库的全部记录」
   *    （一个存储库的记录可能远大于单个导出文件的体积上限，一次 getAll 全读进来会占据太多内存）；
   * 3. 一批一批地交出去，消费方就不必对每条记录做一次异步迭代
   *    （几百万条记录时，每条都走一次 await 会明显拖慢导出）。
   *
   * @param onStoreError 某个存储库读取失败时回调（由调用方统计失败数量）
   */
  private async *iterateRecords(
    onStoreError: (error: any) => void
  ): AsyncGenerator<DownloadRecordType[]> {
    const total = this.storeNameList.length
    let num = 0
    /** 每页（也是每批）的记录数 */
    const pageSize = 20000

    for (const name of this.storeNameList) {
      log.log(`${lang.transl('_任务进度')} ${num}/${total}`)
      num++
      try {
        // 上一页最后一条记录的 id，作为下一页的起点（主键就是记录的 id）
        let lastKey: string | undefined = undefined
        while (true) {
          const page: DownloadRecordType[] | null =
            await this.IDB.getAllByPage<DownloadRecordType>(
              name,
              lastKey,
              pageSize
            )
          // 读到 null 说明这个存储库读完了
          if (!page) {
            break
          }
          lastKey = page[page.length - 1].id
          yield page
        }
      } catch (error) {
        // 一个存储库读取失败时，继续导出其他存储库的数据，最后如实报告
        onStoreError(error)
      }
    }

    log.log(`${lang.transl('_任务进度')} ${num}/${total}`)
  }

  // 导出下载记录
  private async exportRecord() {
    log.success('🚀' + lang.transl('_导出下载记录'))
    toast.show(lang.transl('_开始导出下载记录'))
    EVT.fire('closeSettingsPanel')

    // 数据库不可用时，getAll 会直接失败。这里给出明确的提示，
    // 否则异常会变成异步监听器里的未处理拒绝，界面上什么都不会显示，看起来就像「卡住了」
    if (!this.IDB.db) {
      return this.showDatabaseUnavailable()
    }

    const startTime = Date.now()
    /** 读取失败的存储库数量 */
    let failed = 0
    /** 已生成的记录数 */
    let exported = 0
    /** 已生成的文件数量 */
    let fileIndex = 0

    // 逐个存储库惰性读取，按批交给 json2BlobChunksBatched 往当前文件里放；
    // 放满一个文件就立刻下载并清空，然后继续。
    // 不能先把所有记录汇总成一个数组再生成文件：那样光是记录数组就要占几 GB 内存，
    // 加上 JSON 字符串和 Blob 各一份，实测能把标签页吃到 12 GB
    try {
      exported = await Utils.json2BlobChunksBatched(
        this.iterateRecords((error) => {
          failed++
          log.error(IndexedDB.getErrorName(error))
        }),
        Config.exportFileByteLengthLimit,
        async (url, total) => {
          fileIndex++
          Utils.downloadFile(
            url,
            `record-total ${total}-${Tools.formatDateTimeInFilename()}.json`,
            this.exportRevokeDelay
          )
          // 每生成一个文件就下载一个，所以这里能看到导出进度
          log.log(
            lang.transl(
              '_下载记录分片导出进度',
              (exported + total).toString(),
              fileIndex.toString()
            )
          )
          exported += total
        }
      )
    } catch (error) {
      const tip = (error as Error)?.message || (error as any)
      log.error(tip)
      msgBox.error(tip)
      return
    }

    // 有存储库读取失败时，导出的文件会缺少这部分记录，所以不能报「导出成功」
    const showFailedMessage = () => {
      const msg = lang.transl('_部分下载记录导出失败', failed.toString())
      log.error(msg)
      msgBox.error(msg)
    }

    if (exported === 0) {
      if (failed > 0) {
        return showFailedMessage()
      }
      // 数据库是空的。如果上次导出时明明有记录，就说明记录是被浏览器清除的，
      // 这时必须明确告诉用户，而不是简单的「没有可用数据」
      const lastCount = await this.getLastKnownCount()
      if (lastCount > 0) {
        const msg = lang.transl(
          '_下载记录可能已被浏览器清除',
          lastCount.toString()
        )
        log.error(msg)
        msgBox.error(msg)
        // 已经提醒过用户了，把标记归零，避免之后每次导出都重复这条提示。
        // 下次成功导出时会重新写入真实的记录数
        await this.setLastKnownCount(0)
        return
      }
      const msg = lang.transl('_没有数据可供使用')
      log.error(msg)
      toast.error(msg)
      return
    }

    // 有存储库读取失败时，导出的记录比实际少，所以不能把这个偏小的值当作「上次已知的记录数」写进去：
    // 那样之后记录真的被浏览器清掉时，就判断不出来了
    if (failed > 0) {
      return showFailedMessage()
    }

    // 更新「上次已知的记录数」，供下次判断记录是否被清除
    await this.setLastKnownCount(exported)

    log.log(lang.transl('_耗时毫秒', (Date.now() - startTime).toString()))
    const msg = lang.transl('_导出成功')
    log.success(msg)
    toast.success(msg)
  }

  // 导入下载记录
  private async importRecord(record: DownloadRecordType[]) {
    log.success('🚀' + lang.transl('_导入下载记录'))
    toast.show(lang.transl('_开始导入下载记录'))
    EVT.fire('closeSettingsPanel')

    // 显示导入进度
    let stored = 0
    let total = record.length

    if (total > 10000) {
      log.warning(lang.transl('_数据较多需要花费一些时间'))
    }

    log.log(`${stored}/${total}`, 'downloadRecordImportProgress')

    const startTime = Date.now()

    // 一趟遍历就把记录按 id 的首位分到各个存储库对应的桶里。
    // 老代码对每个存储库都完整扫一遍 record，9 个存储库就是 9 × 500 万次判断
    const buckets: DownloadRecordType[][] = this.storeNameList.map(() => [])
    for (const r of record) {
      const index = parseInt(r.id[0]) - 1
      const bucket = buckets[index]
      // id 的首位是 0 或者不是数字时，不属于任何存储库，跳过（和数据去重一样按首位分库）
      if (bucket) {
        bucket.push(r)
      }
    }
    // 分完桶就不再需要原数组了。几百万条记录占用的内存不小，尽早释放
    record.length = 0

    // 依次处理每个存储库
    for (let index = 0; index < this.storeNameList.length; index++) {
      const data = buckets[index]
      buckets[index] = []

      if (data.length === 0) {
        continue
      }

      // 添加数据
      log.log(`${lang.transl('_待处理')} ${data.length}`)
      try {
        // console.time('restoreRecord' + (index + 1))
        await this.IDB.batchAddData(this.storeNameList[index], data)
        // console.timeEnd('restoreRecord' + (index + 1))

        stored += data.length
        log.log(`${stored}/${total}`, 'downloadRecordImportProgress')
      } catch (error) {
        const tip = IndexedDB.getErrorName(error)
        log.error(tip)
        msgBox.error(tip)
      }
    }
    log.log(lang.transl('_耗时毫秒', (Date.now() - startTime).toString()))

    if (stored < total) {
      return
    }

    log.success(lang.transl('_导入成功'))
    toast.success(lang.transl('_导入成功'))

    msgBox.success(lang.transl('_导入成功'), {
      title: lang.transl('_导入下载记录'),
    })

    // 更新「上次已知的记录数」。数据库里可能还有本次没有覆盖到的记录，
    // 所以取「原有标记」和「本次导入数量」中较大的那个
    const lastCount = await this.getLastKnownCount()
    await this.setLastKnownCount(Math.max(lastCount, stored))

    // 时间参考：导入 100000 条下载记录，花费的时间在 30 秒以内。但偶尔会有例外，中途像卡住了一样，很久没动，最后花了两分钟多的时间。
  }

  /** 导入文件之前给出提示
   *
   * 1. 在日志里显示本次导入的文件名（数据较多时会分成多个文件，需要全部导入）
   * 2. 如果在移动端，检查文件体积是否过大：移动端浏览器可用的内存比较小，
   *    一次性导入体积太大的文件可能会失败。多个文件的数据会被汇总到一起导入，
   *    所以检查的是总体积。这只是提示，不会阻止导入
   *
   * @param files 本次导入的文件
   */
  private showImportHints(files: File[]) {
    // 用户可能有多个文件需要导入，因此在每次导入时显示当前文件名，以便用户区分、确认
    log.log(lang.transl('_本次导入的文件', files.map((f) => f.name).join(', ')))

    // 移动端浏览器可用的内存比较小，一次性导入体积太大的文件可能会失败，先提醒一下。
    // 多个文件的数据会被汇总到一起导入，所以检查的是总体积
    if (Config.mobile) {
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
      if (totalBytes > this.mobileImportSizeLimit) {
        log.warning('💡' + lang.transl('_移动端导入体积提示'))
      }
    }
  }

  // 从 json 文件导入
  private async importRecordFromJSON() {
    if (!this.IDB.db) {
      return this.showDatabaseUnavailable()
    }

    const loaded = (await Utils.loadJSONFilesWithFiles<
      DownloadRecordType[]
    >().catch((err) => {
      msgBox.error(err)
      return
    })) as { files: File[]; data: DownloadRecordType[][] } | undefined

    if (!loaded) {
      return
    }

    this.showImportHints(loaded.files)

    // 记录较多时导出会产生多个文件，这里把它们合并起来一起导入
    const record: DownloadRecordType[] = []
    for (const data of loaded.data) {
      // 判断格式是否符合要求
      if (
        Array.isArray(data) === false ||
        data.length === 0 ||
        data[0] === undefined ||
        data[0].id === undefined ||
        data[0].n === undefined
      ) {
        return msgBox.error(lang.transl('_格式错误'))
      }
      for (const item of data) {
        record.push(item)
      }
    }

    // 返回这个 Promise：不然它内部的异常不会被 bindEvents 里的 catch 接住
    return this.importRecord(record)
  }

  // 从 txt 文件导入
  // 每行一个文件 id（带序号），以换行分割
  private async importRecordFromTxt() {
    if (!this.IDB.db) {
      return this.showDatabaseUnavailable()
    }
    const files = await Utils.selectFile('.txt')
    if (!files) {
      return
    }
    const file = files[0]
    this.showImportHints([file])
    const text = await file.text()

    // 以换行分割
    let split = '\r\n'
    if (!text.includes(split)) {
      split = '\n'
    }
    const arr = text.split(split)

    // 把每一行视为一个 id，进行导入
    const record: DownloadRecordType[] = []
    for (const str of arr) {
      if (str) {
        record.push({
          id: str,
          n: str,
        })
      }
    }
    // 同上：把 Promise 交回给调用方，异常才不会变成未处理拒绝
    return this.importRecord(record)
  }
}

export { DownloadRecordManager }
