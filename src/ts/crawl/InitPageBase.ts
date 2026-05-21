// 初始化所有页面抓取流程的基类
import { lang } from '../Language'
import { Colors } from '../Colors'
import { Tools } from '../Tools'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import '../setting/CrawlNumber'
import { states } from '../store/States'
import { saveArtworkData } from '../store/SaveArtworkData'
import { saveNovelData } from '../store/SaveNovelData'
import { mute } from '../filter/Mute'
import { IDData } from '../store/StoreType'
import './StopCrawl'
import '../SelectWork'
import { destroyManager } from '../pageFunciton/DestroyManager'
import { vipSearchOptimize } from './VipSearchOptimize'
import { ArtworkData, NovelData } from './CrawlResult.d'
import { toast } from '../Toast'
import { msgBox } from '../MsgBox'
import { Utils } from '../utils/Utils'
import { pageType } from '../PageType'
import { filter } from '../filter/Filter'
import { timedCrawl } from './TimedCrawl'
import '../pageFunciton/QuickBookmark'
import '../pageFunciton/CopyButtonOnWorkPage'
import '../pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'
import { cacheWorkData } from '../store/CacheWorkData'
import { crawlLatestFewWorks } from './CrawlLatestFewWorks'
import { autoMergeNovel } from '../download/AutoMergeNovel'
import { showOneTimeMsg } from '../ShowOneTimeMsg'
import { MergeNovel } from '../download/MergeNovel'
import { ppdTask } from '../PPDTask'

abstract class InitPageBase {
  /**要抓取的个数/页数 */
  protected crawlNumber = 0
  /**当前页面类型最多有多少个页面/作品 */
  protected maxCount = 1000
  /**列表页开始抓取时的页码，只在 api 需要页码时使用 */
  protected startpageNo = 1
  /** 记录一共抓取了多少个列表页 */
  protected listPageFinished = 0
  /** 获取 id 列表时，如果要显示刷新的日志（显示进度信息），可以设置这个 key。获取 id 完毕后会将其持久化 */
  protected getIdListLogKey = ''
  /**抓取作品时的并发请求数量默认值，也是最大值 */
  protected readonly ajaxThreadsDefault = 3
  /**抓取作品时的并发请求数 */
  protected ajaxThread = this.ajaxThreadsDefault
  /**当所有作品都发送了抓取请求之后，开始统计有多少个并发线程完成了请求。当这个数量等于 ajaxThreads 时，说明所有请求都完成了 */
  protected finishedRequest = 0
  /** 如果 stopCrawl 标记为 true，则这个标记也会变成 true。通过检查这个标记，可以避免重复执行一些逻辑 */
  protected crawlFinishBecauseStopCrawl = false
  /** 获取完 idList 之后，保存它的的长度 */
  protected idListLength = 0
  /** 抓取过程中，保存合并系列小说的数量。当抓取完成后，如果这个数量等于 idListLength，则说明所有作品都被合并为系列小说 */
  protected mergedNovelCount = 0
  /** 调试用，如果为 true，则在 getIdListFinished 之后就停止抓取，便于重复测试抓取 idList 的流程 */
  // 切换到不同页面类型后，会恢复成默认值 false
  protected onlyCrawlIdList = false

  // 该类的实现必须调用 init 方法，并且不可以修改 init 方法
  protected readonly init = () => {
    this.addCrawlBtns()
    this.addAnyElement()
    this.initAny()

    // 如果在 init 方法中绑定了全局事件，并且该事件只适用于当前页面类型，那么应该在 destroy 中解绑事件。

    // 注册当前页面的 destroy 函数
    destroyManager.register(this.destroy.bind(this))

    EVT.bindOnce(
      'setSlowCrawlMode',
      EVT.list.settingChange,
      (ev: CustomEventInit) => {
        const data = ev.detail.data as any
        if (data.name === 'slowCrawl' && data.value) {
          if (store.idList.length > settings.slowCrawlOnWorksNumber) {
            // 当用户打开慢速抓取开关时，设置慢速抓取的标记
            log.warning(lang.transl('_慢速抓取'))
            states.slowCrawlMode = true
            this.ajaxThread = 1
          }
        }
      }
    )

    // 页面切换后，如果任务已经完成，则移除日志区域
    EVT.bindOnce('clearLogAfterPageSwitch', EVT.list.pageSwitch, () => {
      if (!states.busy) {
        EVT.fire('clearLog')
      }
    })

    EVT.bindOnce('crawlCompleteTime', EVT.list.crawlComplete, () => {
      states.crawlCompleteTime = Date.now()
    })

    EVT.bindOnce('downloadCompleteTime', EVT.list.downloadComplete, () => {
      states.downloadCompleteTime = Date.now()
    })

    // 监听下载 id 列表的事件
    EVT.bindOnce('crawlIdList', EVT.list.crawlIdList, (ev: CustomEventInit) => {
      const idList = ev.detail.data as IDData[]
      if (idList) {
        this.crawlIdList(idList)
      }
      // 通过 bindOnce 绑定的 this 是执行此代码时通过这个虚拟类生成的实例，这个 this 是不会变化的
      // 但是这个虚拟类会产生多个实例，所以这里调用 this 的方法时，要求这个方法与具体实例无关，不受实例变化影响
      // 也就是说即使页面类型变化并且生成了新的实例，调用旧实例上的这个方法也依然会正常运行
      // 如果某个方法做不到这一点, 就不要在这里调用。
      // 基于此，在这里修改 this 上的属性是不合适的，因为每个新实例都会复制这个虚拟类上的属性，它们是独立的
    })

    // 设置用于调试的 flag
    ppdTask.register(1, 'Only crawl IdList', () => {
      this.onlyCrawlIdList = !this.onlyCrawlIdList
      if (this.onlyCrawlIdList) {
        log.warning('onlyCrawlIdList: On')
      } else {
        log.success('onlyCrawlIdList: Off')
      }
    })
  }

  // 添加抓取区域的默认按钮，可以被子类覆写
  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_默认下载多页',
      'startCrawling'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  // 添加其他任意元素（如果有）
  protected addAnyElement(): void {}

  // 初始化任意内容
  // 如果有一些代码不能归纳到 init 方法的前面几个方法里，那就放在这里
  // 通常用来初始化特有的组件、功能、事件、状态等
  protected initAny() {}

  // 销毁初始化页面时添加的元素和事件，恢复设置项等
  protected destroy(): void {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')
  }

  // 设置要获取的作品数或页数。有些页面使用，有些页面不使用。使用时再具体定义
  protected getWantPage() {}

  /**在日志上显示任意提示 */
  protected showTip() {
    if (
      settings.removeWorksOfFollowedUsersOnSearchPage &&
      (pageType.type === pageType.list.ArtworkSearch ||
        pageType.type === pageType.list.NovelSearch)
    ) {
      log.warning(lang.transl('_在搜索页面里移除已关注用户的作品'))
    }

    if (settings.autoMergeNovel) {
      log.warning(lang.transl('_自动合并系列小说'))
    }
  }

  protected setSlowCrawl() {
    states.slowCrawlMode = settings.slowCrawl
    if (settings.slowCrawl) {
      log.warning(lang.transl('_慢速抓取'))
    }
  }

  protected confirmRecrawl() {
    if (store.result.length > 0) {
      // 如果已经有抓取结果，则检查这些抓取结果是否已被下载过
      // 如果没有被下载过，则显示提醒
      if (states.crawlCompleteTime > states.downloadCompleteTime) {
        const _confirm = window.confirm(lang.transl('_已有抓取结果时进行提醒'))
        return _confirm
      }
    }

    return true
  }

  // 准备正常进行抓取，执行一些检查
  protected async readyCrawl() {
    // 检查是否可以开始抓取
    // states.busy 表示下载器正在抓取或正在下载
    if (states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    // 下载器空闲，此时检查是否有已存在的抓取结果
    if (!this.confirmRecrawl()) {
      return
    }

    // 清空日志
    // 注意：抓取过程中，很多方法都会输出日志，它们必须在此事件之后执行，否则用户根本看不到那些日志
    EVT.fire('clearLog')

    showOneTimeMsg.show(
      'tipCloseAskFileSaveLocationOnce',
      lang.transl('_建议您关闭询问文件保存位置')
    )

    log.success('🚀' + lang.transl('_开始抓取'))
    toast.show(lang.transl('_开始抓取'), {
      position: 'center',
    })

    const wrongSetting = filter.showTip()
    if (wrongSetting) {
      log.error(lang.transl('_取消抓取因为某些抓取条件不正确'))
      log.log('')
      return
    }

    EVT.fire('crawlStart')

    await mute.getMuteSettings()

    this.getWantPage()

    crawlLatestFewWorks.showLog()

    this.showTip()

    this.finishedRequest = 0

    this.crawlFinishBecauseStopCrawl = false

    states.stopCrawl = false

    // 进入第一个抓取流程
    this.nextStep()
  }

  // 基于传递的 id 列表直接开始抓取
  // 这个方法是为了让其他模块可以传递 id 列表，直接进行下载。
  // 这个类的子类没有必要使用这个方法。当子类需要直接指定 id 列表时，修改自己的 getIdList 方法即可。
  protected async crawlIdList(idList: IDData[]) {
    // 对 idList 进行去重
    // 这是因为有些用户可能会连续、快速的重复建立下载（比如在预览时迅速的连续按两次 C 键）
    const ids: string[] = []
    const _idList: IDData[] = []
    for (const i of idList) {
      if (ids.includes(i.id) === false) {
        ids.push(i.id)
        _idList.push(i)
      }
    }

    // 如果下载器正忙则把 id 列表添加到等待队列中
    if (states.busy) {
      store.waitingIdList.push(..._idList)
      toast.show(lang.transl('_下载器正忙这次请求已开始排队'), {
        bgColor: Colors.bgBlue,
      })
    } else {
      if (!this.confirmRecrawl()) {
        return
      }

      showOneTimeMsg.show(
        'tipCloseAskFileSaveLocationOnce',
        lang.transl('_建议您关闭询问文件保存位置')
      )

      log.success('🚀' + lang.transl('_开始抓取'))
      toast.show(lang.transl('_开始抓取'), {
        bgColor: Colors.bgBlue,
      })

      const wrongSetting = filter.showTip()
      if (wrongSetting) {
        log.error(lang.transl('_取消抓取因为某些抓取条件不正确'))
        log.log('')
        return
      }

      EVT.fire('crawlStart')

      await mute.getMuteSettings()

      this.finishedRequest = 0

      this.crawlFinishBecauseStopCrawl = false

      states.stopCrawl = false

      // 传递 id 列表下载时，不显示下载面板
      states.quickCrawl = true

      store.idList = _idList

      this.getIdListFinished()
    }
  }

  // 当可以开始抓取时，进入下一个流程。默认情况下，开始获取作品列表。如有不同，由子类具体定义
  protected nextStep() {
    this.getIdList()
  }

  // 获取 id 列表，由各个子类具体定义
  protected getIdList() {}

  /** 检查该用户是否被屏蔽了。如果被屏蔽，则不抓取他的作品，以避免发送不必要的抓取请求 */
  protected async checkUserId(userId: string) {
    return await filter.check({
      userId,
    })
  }

  // id 列表获取完毕，开始抓取作品内容页
  protected async getIdListFinished(): Promise<void> {
    log.persistentRefresh(this.getIdListLogKey)
    states.slowCrawlMode = false
    this.resetGetIdListStatus()

    // 在抓取作品详细数据之前，预先对 id 进行检查，如果不符合要求则直接剔除它
    // 现在这里能够检查这些过滤条件：
    // 1. 检查 id 是否符合 id 范围条件
    // 2. 检查 id 的发布时间是否符合时间范围条件
    // 3. 区分图像作品和小说。注意：因为在某些情况下，下载器只能确定一个作品是图像还是小说，
    // 但不能区分它具体是图像里的哪一种类型（插画、漫画、动图），所以这里不能检查具体的图像类型，只能检查是图像还是小说
    const filteredIDList: IDData[] = []
    for (const idData of store.idList) {
      let check = true
      check = await filter.check({
        id: idData.id,
        IDTypeString: idData.type,
        workType: Tools.getWorkTypeVague(idData.type),
      })

      if (check) {
        filteredIDList.push(idData)
      }
    }
    store.idList = filteredIDList

    EVT.fire('getIdListFinished')
    if (states.stopCrawl || states.bookmarkMode) {
      return
    }

    if (store.idList.length === 0) {
      return this.noResult()
    }

    // 如果要抓取的作品数量超过指定数量（目前为 100 页），则显示使用小号抓取的提示
    if (store.idList.length > 6000) {
      log.warning(lang.transl('_提示使用小号下载'))
    }

    log.log(lang.transl('_当前有x个作品', store.idList.length.toString()))

    // 导出 ID 列表，并停止抓取
    if ((settings.exportIDList || states.exportIDList) && Utils.isPixiv()) {
      EVT.fire('stopCrawl')

      if (settings.exportIDList) {
        const resultList = await Utils.json2BlobSafe(store.idList)
        for (const result of resultList) {
          Utils.downloadFile(
            result.url,
            `ID list-total ${
              result.total
            }-from ${Tools.getPageTitle()}-${Utils.replaceUnsafeStr(
              new Date().toLocaleString()
            )}.json`
          )
        }

        const msg = lang.transl('_导出ID列表')
        log.success('✅' + msg)
        toast.success(msg)
      }

      return
    }

    // 如果启用了这个标记，则重置任务状态，不继续抓取作品的详情了
    if (this.onlyCrawlIdList) {
      log.warning('onlyCrawlIdList: On，停止抓取')
      EVT.fire('stopCrawl')
      return
    }

    log.log(lang.transl('_开始获取作品信息'))

    this.idListLength = store.idList.length
    this.mergedNovelCount = 0

    // 设置抓取线程
    if (
      settings.slowCrawl &&
      store.idList.length > settings.slowCrawlOnWorksNumber
    ) {
      // 慢速抓取时限制为 1
      log.warning(lang.transl('_慢速抓取'))
      states.slowCrawlMode = true
      this.ajaxThread = 1
    } else {
      // 全速抓取
      states.slowCrawlMode = false
      this.ajaxThread = Math.min(this.ajaxThreadsDefault, store.idList.length)
    }

    // 快速下载单个作品的情况。这通常是由 crawlIdList 触发的，比如：
    // 在作品页里快速下载这个作品；预览图片时按快捷键下载；点击缩略图右上角的下载按钮
    // 对于图像作品，优先从缓存读取。其实缓存数据里的某些值可能不是作品的最新值了，但是下载单个作品时，通常距离缓存时没过去多久，所以就使用缓存了
    // 不检查 novelSeries 类型的作品，因为目前不会缓存系列小说的数据
    // 也不检查 novels 类型的作品，因为小说可能属于系列小说，可能需要自动合并系列小说，所以必须走正常抓取流程处理，不能在这里跳过抓取流程
    if (
      states.quickCrawl &&
      store.idList.length === 1 &&
      ['illusts', 'manga', 'ugoira'].includes(store.idList[0].type)
    ) {
      const data = cacheWorkData.get(store.idList[0].id, 'artwork')
      if (data) {
        store.idList = []
        await saveArtworkData.save(data)
        return this.crawlFinished()
      }
    }

    // 进入抓取流程
    this.startGetWorksData()
  }

  /** 并发调用 getWorksData 方法 */
  protected startGetWorksData() {
    // 如果 idList 里有系列小说，就把抓取线程设置为 1, 避免同时合并多个系列小说
    // 这是因为合并每个系列小说时都需要发送多个请求，如果同时合并多个，容易触发 429 限制
    if (store.idList.some((idData) => idData.type === 'novelSeries')) {
      this.ajaxThread = 1
      log.warning(lang.transl('_由于有系列小说所以抓取线程被限制为1'))
    }
    log.log(lang.transl('_抓取线程为x', this.ajaxThread.toString()))

    // 开始并发抓取
    for (let i = 0; i < this.ajaxThread; i++) {
      window.setTimeout(() => {
        store.idList.length > 0 ? this.getWorksData() : this.afterGetWorksData()
      }, 0)
    }
  }

  // 重设抓取作品列表时使用的变量或标记
  protected resetGetIdListStatus() {}

  // 获取作品的数据
  protected async getWorksData(idData?: IDData): Promise<void> {
    if (states.stopCrawl) {
      return this.crawlFinished()
    }

    idData = idData ?? store.idList.shift()
    if (!idData) {
      return this.afterGetWorksData()
    }
    const id = idData.id

    if (!id) {
      const msg = 'Error: work id is invalid!'
      msgBox.error(msg)
      throw new Error(msg)
    }

    // 在抓取作品详细数据之前对 id 进行检查，如果不符合要求就跳过它
    const check = await filter.check({
      id,
      IDTypeString: idData.type,
      workType: Tools.getWorkTypeVague(idData.type),
    })
    if (!check) {
      return this.afterGetWorksData()
    }

    try {
      const unlisted = pageType.type === pageType.list.Unlisted
      if (idData.type === 'novels') {
        // 小说数据尝试从缓存中获取，这是因为“自动合并系列小说”里也需要获取小说数据。
        // 如果不使用缓存，则必定会导致一个小说发送两次请求
        // 使用缓存有负面影响：作品的某些数据（如收藏数量）在它被缓存之后可能已经发生变化
        // 但通常问题不大
        const data = await cacheWorkData.getWorkDataAsync(id, 'novel', unlisted)
        // 自动合并系列小说
        const seriesId = data.body.seriesNavData?.seriesId
        const canMerge = seriesId && settings.autoMergeNovel
        if (canMerge) {
          const seriseTitle = data.body.seriesNavData?.title
          this.mergedNovelCount++
          await autoMergeNovel.merge(seriesId, seriseTitle)
        }
        // 如果这个小说不会被合并，或者即使合并也不跳过它，则保存到抓取结果里
        if (!canMerge || !settings.skipNovelsInSeriesWhenAutoMerge) {
          await saveNovelData.save(data)
        }
        this.afterGetWorksData(data)
      } else if (idData.type === 'novelSeries') {
        // 合并系列小说
        this.mergedNovelCount++
        await new MergeNovel().merge(id, idData.title, true)
        this.afterGetWorksData()
      } else {
        // 获取图像作品时，不使用缓存的数据，因为目前在一次抓取里不会重复请求同一个图像作品
        const data = await API.getArtworkData(id, unlisted)
        await saveArtworkData.save(data)
        this.afterGetWorksData(data)
      }
    } catch (error: Error | any) {
      if (error?.status) {
        // 请求成功，但状态码不正常
        // 不重试
        const link = Tools.createWorkLinkByIDData(idData)
        log.error(lang.transl('_因为网络错误跳过这个作品', link))
        this.afterGetWorksData()
      } else {
        // 请求失败，一般是
        // TypeError: Failed to fetch
        // 或者 Failed to load resource: net::ERR_CONNECTION_CLOSED
        // 对于这种请求没能成功发送的错误，会输出 null
        // 注意：这里也会捕获到 save 作品数据时的错误（如果有）
        console.error(error)

        // 再次发送这个请求
        await Utils.sleep(2000)
        this.getWorksData(idData)
      }
    }
  }

  // 每当获取完一个作品的信息
  private async afterGetWorksData(
    data?: NovelData | ArtworkData
  ): Promise<void> {
    this.logResultNumber()

    // 抓取可能中途停止，此时保留抓取结果
    if (states.stopCrawl) {
      return this.crawlFinished()
    }

    // 如果会员搜索优化策略指示停止抓取，则立即进入完成状态
    if (data && (await vipSearchOptimize.checkBookmarkCount(data))) {
      log.log(lang.transl('_后续作品低于最低收藏数量要求跳过后续作品'))
      // 指示抓取已停止
      states.stopCrawl = true
      return this.crawlFinished()
    }

    // 在进行下一次抓取前，预先检查这个 id 是否符合过滤条件
    // 如果它不符合过滤条件，则立刻跳过它，这样也不会发送请求来获取这个作品的数据
    // 这样可以加快抓取速度
    if (store.idList.length > 0) {
      const nextIDData = store.idList[0]
      const check = await filter.check({
        id: nextIDData.id,
        IDTypeString: nextIDData.type,
        workType: Tools.getWorkTypeVague(nextIDData.type),
      })
      if (!check) {
        store.idList.shift()
        return this.getWorksData()
      }
    }

    // 如果存在下一个作品，则继续抓取
    if (store.idList.length > 0) {
      // 如果下一个作品是小说，先检查缓存里是否有它的数据
      // 如果有缓存数据就不需要添加间隔时间，因为小说会使用缓存的数据，不必发送请求
      const nextIDData = store.idList[0]
      if (nextIDData && nextIDData.type === 'novels') {
        const cache = cacheWorkData.get(nextIDData.id, 'novel')
        if (cache) {
          return this.getWorksData()
        }
      }

      // 如果要实际发送请求，则根据慢速抓取设置，决定是否添加间隔时间
      if (states.slowCrawlMode) {
        await Utils.sleep(settings.slowCrawlDealy)
      }
      this.getWorksData()
    } else {
      // 没有剩余作品，统计此后有多少个完成的请求
      this.finishedRequest++
      // 所有请求都执行完毕
      if (this.finishedRequest === this.ajaxThread) {
        this.crawlFinished()
      }
    }
  }

  // 抓取完毕
  protected crawlFinished() {
    log.persistentRefresh('getWorksProgress')
    // 当下载器没有处于慢速抓取模式时，会使用并发请求（例如同时发送 3 个请求）
    // 此时如果第一个请求触发了停止抓取 states.stopCrawl，这些并发请求都会进入这里
    // 所以我设置了个一次性的标记，防止重复执行这里的代码
    if (this.crawlFinishBecauseStopCrawl) {
      return
    }

    if (states.stopCrawl) {
      this.crawlFinishBecauseStopCrawl = true
    }

    if (store.result.length === 0) {
      return this.noResult()
    }

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
    } else {
      // 如果用户未设置排序规则，则每个页面自行处理排序逻辑
      this.sortResult()
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

    // 发出抓取完毕的信号
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

  // 每当抓取了一个作品之后，输出提示
  protected logResultNumber() {
    log.log(
      `➡️${lang.transl('_待处理')} ${store.idList.length}, ${lang.transl(
        '_共抓取到n个作品',
        store.resultMeta.length.toString()
      )}`,
      'getWorksProgress'
    )
  }

  /** 抓取结果为 0 时显示提示 */
  protected noResult() {
    // 先触发 crawlComplete，后触发 crawlEmpty。这样便于其他模块处理 crawlEmpty 这个例外情况
    // 如果触发顺序反过来，那么最后执行的都是 crawlComplete，可能会覆盖对 crawlEmpty 的处理
    EVT.fire('crawlComplete')
    EVT.fire('crawlEmpty')

    // 如果所有 id 都产生了合并的小说，抓取结果就会是 0。此时显示抓取完毕的提示
    // 注意：这个条件需要判断 mergedNovelCount > 0，否则因为作品不符合过滤条件导致抓取结果为 0 时也符合这个判断条件
    if (
      this.mergedNovelCount > 0 &&
      this.mergedNovelCount === this.idListLength
    ) {
      log.warning(
        lang.transl('_抓取结果为零并且所有作品都产生了合并系列小说时的提示')
      )
      log.success('✅' + lang.transl('_抓取完毕'))
      log.log('')

      // 在这里触发 exportLog 属于特殊处理。因为合并系列小说是抓取阶段的任务，如果用户选择的导出日志的时机是“下载完毕”，就不会导出任何日志，这会让用户感到困惑。所以在这里触发事件来导出日志
      if (settings.exportLogTiming === 'downloadComplete') {
        setTimeout(() => {
          EVT.fire('exportLog')
        }, 0)
      }
      return
    }

    const msg = lang.transl('_抓取结果为零请检查筛选条件')
    log.error(msg)
    log.log('')
    if (!states.timedCrawlMode) {
      msgBox.error(msg)
    }
  }

  // 抓取完成后，对结果进行排序
  protected sortResult() {}

  /**定时抓取的按钮 */
  protected addStartTimedCrawlBtn(cb: Function) {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_定时抓取',
      '_定时抓取说明',
      'scheduleCrawling'
    ).addEventListener('click', () => {
      timedCrawl.start(cb)
    })
  }

  /**取消定时抓取的按钮 */
  protected addCancelTimedCrawlBtn() {
    const id = 'cancelScheduledCrawling'
    const btn = Tools.addBtn(
      'crawlBtns',
      Colors.bgWarning,
      '_取消定时抓取',
      '',
      id
    )
    btn.style.display = 'none'

    btn.addEventListener('click', () => {
      EVT.fire('cancelTimedCrawl')
      btn.style.display = 'none'
    })

    // 启动定时抓取之后，显示取消定时抓取的按钮
    window.addEventListener(EVT.list.startTimedCrawl, () => {
      const btn = document.getElementById(id)
      if (btn) {
        btn.style.display = 'flex'
      }
    })
  }
}

export { InitPageBase }
