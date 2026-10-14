// 抓取用户列表。
// 在首页输入多个用户 ID，下载器会逐个抓取这些用户的作品。
// 它以用户为单位：一个用户的作品下载完毕之后，才会开始处理下一个用户。
//
// 本模块不属于某个页面类型，也不继承其他模块，而是复用了 InitPageBase 里的抓取流程。
// 每轮循环都相当于执行一次普通的抓取：
// 1. 循环开始时设置 busy、quickCrawl 状态，并触发 crawlStart（这会重置 store、显示停止按钮、复位下载模块）。
// 2. 抓取一个用户的作品列表，然后逐个抓取作品数据。
// 3. 抓完后触发 crawlComplete，下载模块会自动开始下载（需要启用“快速下载任务”）。
// 4. 等下载完成后，继续处理下一个用户。
//
// 任务数据会保存到本地存储，如果用户中途关闭了页面，可以重新打开并恢复任务。
import { API } from '../API'
import { Config } from '../Config'
import { EVT } from '../EVT'
import { Input } from '../Input'
import { lang } from '../Language'
import { log } from '../Log'
import { msgBox } from '../MsgBox'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { filter } from '../filter/Filter'
import { mute } from '../filter/Mute'
import { autoMergeNovel } from '../download/AutoMergeNovel'
import { stopCrawl } from '../crawl/StopCrawl'
import { cacheWorkData } from '../store/CacheWorkData'
import { saveArtworkData } from '../store/SaveArtworkData'
import { saveNovelData } from '../store/SaveNovelData'
import { states } from '../store/States'
import { store } from '../store/Store'
import { IDData } from '../store/StoreType'
import { toast } from '../Toast'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'

/** 保存在本地存储里的任务数据 */
interface CrawlUserListTaskData {
  /** 要抓取的用户 ID 列表 */
  idList: string[]
  /** 从每个用户那里抓取多少个作品。等于 Config.worksNumberLimit 时表示抓取所有作品 */
  crawlWorksNumber: number
  /** 正在处理的用户在 idList 里的索引 */
  progressIndex: number
}

class CrawlUserList {
  constructor() {
    this.bindEvents()
  }

  /** 任务数据在本地存储里使用的键名 */
  private readonly storeName = 'crawlUserListTask'

  /** 每次任务开始时 +1。旧任务的异步流程在发现这个值变化后会立即退出 */
  private runId = 0

  /** 用户是否停止了本模块的任务 */
  private stopped = false

  /** 要抓取的用户 ID 列表 */
  private idList: string[] = []
  /** 从每个用户那里抓取多少个作品。等于 Config.worksNumberLimit 时表示抓取所有作品 */
  private crawlWorksNumber = 0
  /** 正在处理的用户在 idList 里的索引。这个值会保存到本地存储，用于恢复任务 */
  private progressIndex = 0

  /** 当前用户这一轮是否已经结束（无抓取结果，或者下载完成、用户放弃下载） */
  private userDone = false

  /** 本模块设置的 beforeunload 回调。任务结束时需要把它还原成之前的值 */
  private combinedBeforeUnload:
    | ((this: WindowEventHandlers, ev: BeforeUnloadEvent) => any)
    | null = null
  /** 设置 beforeunload 回调之前，window 上原有的回调 */
  private prevBeforeUnload:
    | ((this: WindowEventHandlers, ev: BeforeUnloadEvent) => any)
    | null = null

  private bindEvents() {
    // 用户点击“停止抓取”按钮时，停止整个任务
    window.addEventListener(EVT.list.stopCrawl, this.onStopCrawl)

    // 这些事件都表示当前用户这一轮已经结束
    window.addEventListener(EVT.list.crawlEmpty, this.onUserDone)
    window.addEventListener(EVT.list.downloadComplete, this.onUserDone)
    window.addEventListener(EVT.list.downloadStop, this.onUserDone)

    // downloadStop 只会在用户点击“放弃下载”按钮时触发，此时给出提示
    window.addEventListener(EVT.list.downloadStop, this.onGiveUpDownload)
  }

  private onStopCrawl = () => {
    if (!states.crawlUserList) {
      return
    }
    this.stopTask()
  }

  private onUserDone = () => {
    if (!states.crawlUserList) {
      return
    }
    this.userDone = true
  }

  /** 用户点击“放弃下载”按钮时，说明放弃下载只会跳过当前用户，不会终止整个任务 */
  private onGiveUpDownload = () => {
    if (!states.crawlUserList) {
      return
    }
    log.warning(
      lang.transl('_抓取用户列表时放弃下载的提示'),
      'crawlUserListGiveUpDownload'
    )
  }

  /** 检测任务是否已经被中断（用户停止了任务，或者已经开始了新任务） */
  private isInterrupted(epoch: number) {
    return this.stopped || epoch !== this.runId
  }

  /** 公共入口。点击首页的“抓取用户列表”按钮时调用 */
  public async ready() {
    EVT.fire('closeSettingsPanel')

    if (states.busy) {
      return toast.error(lang.transl('_当前任务尚未完成'))
    }

    // 如果有未完成的任务数据，询问用户是否恢复它
    const taskData = this.restoreData()
    if (taskData) {
      const confirm = window.confirm(
        lang.transl('_检测到有未完成的抓取用户列表任务要恢复该任务吗')
      )
      if (confirm) {
        return this.resumeTask(taskData)
      }
    }

    await this.newTask()
  }

  /** 恢复之前未完成的任务 */
  private resumeTask(data: CrawlUserListTaskData) {
    // 用户在弹窗上确认时，下载器可能又变忙了
    if (states.busy) {
      return msgBox.show(
        lang.transl('_无法恢复抓取用户列表任务因为下载器正忙'),
        {
          title: lang.transl('_抓取用户列表'),
        }
      )
    }

    this.idList = data.idList
    this.crawlWorksNumber = data.crawlWorksNumber
    this.progressIndex = data.progressIndex

    // 输出任务开始时的日志
    EVT.fire('clearLog')
    this.showStartLogs()

    msgBox.show(lang.transl('_已恢复抓取用户列表任务'), {
      title: lang.transl('_抓取用户列表'),
    })

    // 从之前正在处理的那个用户开始
    this.startRun(this.progressIndex)
  }

  /** 开始一个新任务 */
  private async newTask() {
    // 输入用户 ID 列表
    const idList = await this.inputIDList()
    if (idList === null) {
      return
    }

    // 输入抓取的作品数量
    const crawlWorksNumber = await this.inputNumber()
    if (crawlWorksNumber === null) {
      return
    }

    // 输入期间下载器可能变忙了
    if (states.busy) {
      return toast.error(lang.transl('_当前任务尚未完成'))
    }

    this.idList = idList
    this.crawlWorksNumber = crawlWorksNumber

    EVT.fire('clearLog')
    toast.show(lang.transl('_开始抓取用户列表'))
    this.showStartLogs()

    this.startRun(0)
  }

  /** 让用户输入用户 ID 列表 */
  private async inputIDList(): Promise<string[] | null> {
    const input = new Input({
      type: 'textarea',
      rows: 6,
      instruction: lang.transl('_抓取用户列表的输入框提示'),
      placeholder: '163536\n12539859\n1980643\n28172249\n73117898',
    })

    const value = await input.submit()
    if (!value) {
      toast.warning(lang.transl('_本次操作已取消'))
      return null
    }

    // 把输入按行分开，去掉空行
    const array = value
      .split('\n')
      .map((str) => str.trim())
      .filter((str) => str !== '')

    if (array.length === 0) {
      toast.warning(lang.transl('_本次操作已取消'))
      return null
    }

    // 要求全部是数字
    for (const str of array) {
      if (!/^\d+$/.test(str)) {
        toast.error(lang.transl('_用户ID必须全部是数字'))
        return null
      }
    }

    // 去重
    return Array.from(new Set(array))
  }

  /** 让用户输入从每个用户那里抓取多少个作品 */
  private async inputNumber(): Promise<number | null> {
    const input = new Input({
      instruction: lang.transl('_抓取作品数量的输入框提示'),
      placeholder: '-1',
      value: '-1',
    })

    const value = await input.submit()
    if (!value) {
      toast.warning(lang.transl('_本次操作已取消'))
      return null
    }

    // 把值格式化为整数
    const num = Number.parseInt(value)

    // 要求是有效的数字，且只能是 -1（表示抓取所有作品）或者大于 0
    if (Number.isNaN(num) || num === 0 || (num < 0 && num !== -1)) {
      toast.error(lang.transl('_数字必须设置为负1或者大于0'))
      return null
    }

    return num === -1 ? Config.worksNumberLimit : num
  }

  /** 输出任务开始时的日志 */
  private showStartLogs() {
    log.success('🚀' + lang.transl('_开始抓取用户列表'))
    log.log(lang.transl('_一共有x个用户ID', this.idList.length.toString()))

    if (this.crawlWorksNumber === Config.worksNumberLimit) {
      log.log(lang.transl('_从每个用户那里抓取所有作品'))
    } else {
      log.log(
        lang.transl(
          '_从每个用户那里抓取x个作品',
          this.crawlWorksNumber.toString()
        )
      )
    }

    log.warning(lang.transl('_慢速抓取'))
    // 输出空字符串，起到占据一个空行的效果
    log.log('')
  }

  /** 开始运行任务 */
  private async startRun(fromIndex: number) {
    this.stopped = false
    this.runId++
    const epoch = this.runId

    states.crawlUserList = true
    // states.stopCrawl 会保持为 true 直到下一次任务开始，所以这里要重置它
    states.stopCrawl = false

    // 把进度限制在有效范围内
    if (!Number.isFinite(fromIndex) || fromIndex < 0) {
      fromIndex = 0
    }
    fromIndex = Math.min(Math.floor(fromIndex), this.idList.length)

    // 保存任务数据，并在任务完成前阻止用户关闭页面
    this.storeData()
    this.wrapBeforeUnload()

    // 预先获取用户在 Pixiv 的屏蔽设定，供后面的预检查使用
    await mute.getMuteSettings()

    this.runLoop(epoch, fromIndex)
  }

  /** 按顺序处理每个用户 */
  private async runLoop(epoch: number, fromIndex: number) {
    for (let i = fromIndex; i < this.idList.length; i++) {
      // 记录正在处理哪个用户
      this.progressIndex = i
      this.storeData()

      await this.crawlOneUser(epoch, i)

      if (this.isInterrupted(epoch)) {
        return
      }
    }

    // 所有用户都处理完毕
    this.completeTask()
  }

  /** 抓取一个用户的作品 */
  private async crawlOneUser(epoch: number, index: number) {
    const id = this.idList[index]

    // 每轮循环开始时，先设置状态，再触发 crawlStart。
    // 触发 crawlStart 会重置 store（避免上一个用户的抓取结果残留），
    // 并显示“停止抓取”按钮、复位下载模块
    states.busy = true
    states.quickCrawl = true
    EVT.fire('crawlStart')

    // 重置本轮的结束标记
    this.userDone = false

    // 检查这个用户是否被屏蔽了。如果被屏蔽，则跳过它，不发送抓取请求
    if (!(await filter.check({ userId: id }))) {
      return
    }
    if (this.isInterrupted(epoch)) {
      return
    }

    // 获取用户名，用于在日志里显示
    let userName = ''
    try {
      const profile = await API.getUserProfile(id)
      userName = profile.body.name
    } catch {
      // 请求出错，或者用户不存在、已注销
    }

    if (!userName) {
      log.error(
        lang.transl('_获取用户资料失败跳过该用户', Tools.createUserLink(id))
      )
      return
    }
    if (this.isInterrupted(epoch)) {
      return
    }

    // 在日志里显示这个用户的信息
    log.success(
      lang.transl('_开始抓取用户的作品', Tools.createUserLink(id, userName), id)
    )
    log.success(
      lang.transl('_他在队列中的位置是x', `${index + 1}/${this.idList.length}`)
    )
    log.log(lang.transl('_开始获取作品列表'))

    // 获取他的作品的 ID 列表
    let works = await API.getUserWorksByType(id)
    if (this.isInterrupted(epoch)) {
      return
    }

    // 按作品 ID 从大到小排列（从最新的作品开始抓取）
    works.sort(Utils.sortByProperty('id', 'desc'))

    // 如果只需要抓取部分作品，则裁剪
    if (this.crawlWorksNumber < works.length) {
      works = works.slice(0, this.crawlWorksNumber)
    }

    // 覆写 store.idList
    store.idList = works

    // 处理作品 ID 列表，然后抓取每个作品的数据
    const hasResult = await this.getIdListFinished(epoch)
    if (this.isInterrupted(epoch)) {
      return
    }

    // 等待本轮的下载结束，然后再处理下一个用户。
    // 每轮都会等待：如果“快速下载任务”被设置为不自动开始下载，下载不会自动开始，
    // 此时会等待用户手动开始下载（或放弃下载），而不是跳过下载、直接丢弃这一轮的抓取结果
    if (hasResult) {
      await this.waitUserDone(epoch)
    }
  }

  /** 处理该用户的作品 ID 列表，然后抓取每个作品的数据。
   *
   * @returns 抓取结果不为空时返回 true（表示本轮需要等待下载完成） */
  private async getIdListFinished(epoch: number): Promise<boolean> {
    // 在抓取作品详细数据之前，预先对 id 进行检查，如果不符合要求则直接剔除它
    const filteredIDList: IDData[] = []
    for (const idData of store.idList) {
      if (this.isInterrupted(epoch)) {
        return false
      }
      const check = await filter.check({
        id: idData.id,
        IDTypeString: idData.type,
        workType: Tools.getWorkTypeVague(idData.type),
      })
      if (check) {
        filteredIDList.push(idData)
      }
    }
    store.idList = filteredIDList

    if (store.idList.length === 0) {
      return this.noResult()
    }

    // 如果要抓取的作品数量比较多，显示使用小号抓取的提示
    if (store.idList.length > 6000) {
      log.warning(lang.transl('_提示使用小号下载'))
    }

    log.log(lang.transl('_当前有x个作品', store.idList.length.toString()))

    // 导出 ID 列表，并结束这个用户的处理流程。
    // 注意：不要在导出后触发 stopCrawl 事件，否则会停掉整个抓取用户列表的任务
    if ((settings.exportIDList || states.exportIDList) && Utils.isPixiv()) {
      if (settings.exportIDList) {
        const resultList = await Utils.json2BlobSafe(store.idList)
        for (const result of resultList) {
          Utils.downloadFile(
            result.url,
            `ID list-total ${
              result.total
            }-from ${Tools.getPageTitle()}-${Tools.formatDateTimeInFilename()}.json`
          )
        }

        const msg = lang.transl('_导出ID列表')
        log.success('✅' + msg)
        toast.success(msg)
      }
      return false
    }

    log.log(lang.transl('_开始获取作品信息'))

    // 逐个抓取每个作品的数据
    await this.getWorksDataSerial(epoch)

    return store.result.length > 0
  }

  /** 逐个抓取作品的详细数据。
   *
   * 总是串行发送请求，并且每次请求之间添加间隔时间（除非下一个作品使用了缓存数据） */
  private async getWorksDataSerial(epoch: number) {
    // 记录是否需要添加间隔时间（在第一次实际发送请求之前不需要）
    let needDelay = false

    while (store.idList.length > 0) {
      if (this.isInterrupted(epoch)) {
        return
      }

      const idData = store.idList.shift()!
      // 在抓取作品详细数据之前对 id 进行检查，如果不符合要求就跳过它，这样也不会发送请求
      const check = await filter.check({
        id: idData.id,
        IDTypeString: idData.type,
        workType: Tools.getWorkTypeVague(idData.type),
      })
      if (!check) {
        continue
      }

      // 如果要实际发送请求，则添加间隔时间。
      // 如果这个作品是小说，并且缓存里有它的数据，就不需要添加间隔时间（不必发送请求）
      if (needDelay) {
        const useCache =
          idData.type === 'novels' && !!cacheWorkData.get(idData.id, 'novel')
        if (!useCache) {
          await Utils.sleep(settings.slowCrawlDealy)
          if (this.isInterrupted(epoch)) {
            return
          }
        }
      }

      await this.getOneWorkData(epoch, idData)
      if (this.isInterrupted(epoch)) {
        return
      }

      needDelay = true

      // 输出进度日志
      log.log(
        `➡️${lang.transl('_待处理')} ${store.idList.length}, ${lang.transl(
          '_共抓取到n个作品',
          store.resultMeta.length.toString()
        )}`,
        'getWorksProgress'
      )
    }

    // 所有作品都处理完毕
    if (store.result.length === 0) {
      this.noResult()
    } else {
      this.crawlFinished()
    }
  }

  /** 抓取一个作品的详细数据 */
  private async getOneWorkData(epoch: number, idData: IDData): Promise<void> {
    const id = idData.id

    if (!id) {
      const msg = 'Error: work id is invalid!'
      msgBox.error(msg)
      throw new Error(msg)
    }

    try {
      const unlisted = pageType.type === pageType.list.Unlisted
      if (idData.type === 'novels') {
        // 小说数据尝试从缓存中获取，这是因为“自动合并系列小说”里也需要获取小说数据。
        // 如果不使用缓存，则必定会导致一个小说发送两次请求
        const data = await cacheWorkData.getWorkDataAsync(id, 'novel', unlisted)
        // 自动合并系列小说
        const seriesId = data.body.seriesNavData?.seriesId
        const canMerge = seriesId && settings.autoMergeNovel
        if (canMerge) {
          const seriesTitle = data.body.seriesNavData?.title
          await autoMergeNovel.merge(seriesId, seriesTitle)
        }
        // 如果这个小说不会被合并，或者即使合并也不跳过它，则保存到抓取结果里
        if (!canMerge || !settings.skipNovelsInSeriesWhenAutoMerge) {
          await saveNovelData.save(data)
        }
      } else {
        // 获取图像作品的数据
        const data = await API.getArtworkData(id, unlisted)
        await saveArtworkData.save(data, idData.downloadIndexes)
      }
    } catch (error: Error | any) {
      if (error?.status) {
        // 请求成功，但状态码不正常。不重试，跳过这个作品
        const link = Tools.createWorkLinkByIDData(idData)
        log.error(lang.transl('_因为网络错误跳过这个作品', link))
      } else {
        // 请求失败，一般是
        // TypeError: Failed to fetch
        // 或者 Failed to load resource: net::ERR_CONNECTION_CLOSED
        // 对于这种请求没能成功发送的错误，会输出 null
        // 注意：这里也会捕获到 save 作品数据时的错误（如果有）
        console.error(error)

        // 等待一段时间，然后再次发送这个请求
        await Utils.sleep(2000)
        if (this.isInterrupted(epoch)) {
          return
        }
        return this.getOneWorkData(epoch, idData)
      }
    }
  }

  /** 抓取完毕（有抓取结果时） */
  private crawlFinished() {
    store.crawlCompleteTime = new Date()

    // 对文件进行排序
    if (settings.setFileDownloadOrder) {
      // 按照用户设置的规则进行排序
      const scheme = new Map([
        ['ID', 'id'],
        ['bookmarkCount', 'bmk'],
        ['bookmarkID', 'bmkId'],
      ])
      let key = scheme.get(settings.downloadOrderSortBy)
      // 在搜索页面预览抓取结果时，始终按收藏数量排序
      if (
        pageType.type === pageType.list.ArtworkSearch &&
        settings.previewResult
      ) {
        key = 'bmk'
      }
      store.result.sort(Utils.sortByProperty(key!, settings.downloadOrder))
      store.resultMeta.sort(Utils.sortByProperty(key!, settings.downloadOrder))
    }

    log.log(
      lang.transl(
        '_共抓取到n个作品产生了n个抓取结果',
        store.resultMeta.length.toString(),
        store.result.length.toString()
      )
    )
    log.success('✅' + lang.transl('_抓取完毕'))
    log.log('')

    // 发出抓取完毕的信号，下载模块会据此自动开始下载
    EVT.fire('crawlComplete')

    // 自动导出抓取结果
    if (
      settings.autoExportResult &&
      store.result.length > settings.autoExportResultNumber
    ) {
      if (settings.autoExportResultCSV) {
        EVT.fire('exportCSV')
      }
      if (settings.autoExportResultJSON) {
        EVT.fire('exportResult')
      }
    }
  }

  /** 抓取结果为 0 时显示提示 */
  private noResult(): false {
    // 先触发 crawlComplete，后触发 crawlEmpty
    EVT.fire('crawlComplete')
    EVT.fire('crawlEmpty')

    // 批量抓取时，会有多个用户没有抓取结果，所以这里只输出日志，不显示消息框
    const msg = lang.transl('_抓取结果为零的提示')
    log.error(msg)
    // 输出空字符串，起到占据一个空行的效果
    log.log('')
    return false
  }

  /** 等待当前用户的下载结束（下载完成，或者用户放弃下载） */
  private async waitUserDone(epoch: number) {
    // 这里使用轮询而不是监听 promise，因为 crawlEmpty 是同步触发的，
    // 如果等抓取流程结束后才挂监听，就会漏掉它
    while (!this.userDone) {
      if (this.isInterrupted(epoch)) {
        return
      }
      await Utils.sleep(100)
    }
  }

  /** 所有用户都处理完毕 */
  private completeTask() {
    this.finishTask()

    const msg = lang.transl('_抓取用户列表完毕')
    log.success('✅' + msg)
    // 输出空字符串，起到占据一个空行的效果
    log.log('')
    toast.success(msg)
  }

  /** 用户停止了任务 */
  private stopTask() {
    if (this.stopped) {
      return
    }
    this.stopped = true
    this.finishTask()

    const msg = lang.transl('_已停止抓取用户列表')
    log.error('🛑' + msg)
    toast.error(msg)
  }

  /** 任务结束时的收尾工作 */
  private finishTask() {
    this.restoreBeforeUnload()
    this.clearStore()

    states.crawlUserList = false

    // 延后复位循环开始时设置的快速抓取标记。
    // 下载模块会在 crawlComplete 之后的事件队列里执行 readyDownload。如果此时快速抓取标记已经被复位，
    // 它会把最后一轮的抓取结果当作普通下载任务处理，并可能自动开始下载（取决于普通下载任务的设置）。
    // 所以延后一个事件周期再复位它，让下载模块仍然按快速下载任务来处理最后一轮的结果。
    // 停止任务时不会触发 downloadComplete 等事件，所以必须自己复位它
    window.setTimeout(() => {
      states.quickCrawl = false
    }, 0)

    // 复位 busy 标记。任务正常结束时它已经被复位了，
    // 但如果最后一轮走了“导出 ID 列表”或者跳过了用户，就不会被复位
    states.busy = false

    // 隐藏停止按钮。它在下载阶段也会显示，所以任务结束时需要手动隐藏它
    stopCrawl.hide()
  }

  /** 把任务数据保存到本地存储 */
  private storeData() {
    const data: CrawlUserListTaskData = {
      idList: this.idList,
      crawlWorksNumber: this.crawlWorksNumber,
      progressIndex: this.progressIndex,
    }
    localStorage.setItem(this.storeName, JSON.stringify(data))
  }

  /** 从本地存储里读取任务数据。没有数据或数据无效时返回 null */
  private restoreData(): CrawlUserListTaskData | null {
    const str = localStorage.getItem(this.storeName)
    if (!str) {
      return null
    }

    try {
      const data = JSON.parse(str) as CrawlUserListTaskData
      if (!Array.isArray(data.idList) || data.idList.length === 0) {
        return null
      }
      if (typeof data.crawlWorksNumber !== 'number') {
        return null
      }
      if (typeof data.progressIndex !== 'number') {
        return null
      }
      return data
    } catch {
      return null
    }
  }

  /** 清除本地存储里的任务数据 */
  private clearStore() {
    localStorage.removeItem(this.storeName)
  }

  /** 在任务完成之前，阻止用户关闭或刷新页面 */
  private wrapBeforeUnload() {
    this.restoreBeforeUnload()

    this.prevBeforeUnload = window.onbeforeunload
    this.combinedBeforeUnload = (ev: BeforeUnloadEvent) => {
      // 先执行之前注册的回调
      if (typeof this.prevBeforeUnload === 'function') {
        const result = this.prevBeforeUnload.call(window, ev)
        if (result === false) {
          return false
        }
      }

      // 抓取用户列表的任务尚未完成时，提示用户
      if (states.crawlUserList) {
        msgBox.error(lang.transl('_抓取用户列表任务尚未完成的提示'), {
          btn: lang.transl('_我知道了'),
        })
        return false
      }
    }
    window.onbeforeunload = this.combinedBeforeUnload
  }

  /** 还原 beforeunload 回调 */
  private restoreBeforeUnload() {
    if (
      this.combinedBeforeUnload &&
      window.onbeforeunload === this.combinedBeforeUnload
    ) {
      window.onbeforeunload = this.prevBeforeUnload
    }
    this.combinedBeforeUnload = null
  }
}

const crawlUserList = new CrawlUserList()
export { crawlUserList }
