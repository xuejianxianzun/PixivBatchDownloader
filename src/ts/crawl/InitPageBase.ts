// 初始化所有页面抓取流程的基类
import { lang } from '../Lang'
import { Colors } from '../Colors'
import { Tools } from '../Tools'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { EVT } from '../EVT'
import { options } from '../setting/Options'
import { settings } from '../setting/Settings'
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
import { Config } from '../Config'
import { timedCrawl } from './TimedCrawl'
import '../pageFunciton/QuickBookmark'
import '../pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'
import { setTimeoutWorker } from '../SetTimeoutWorker'

abstract class InitPageBase {
  protected crawlNumber = 0 // 要抓取的个数/页数

  protected maxCount = 1000 // 当前页面类型最多有多少个页面/作品

  protected startpageNo = 1 // 列表页开始抓取时的页码，只在 api 需要页码时使用

  protected listPageFinished = 0 // 记录一共抓取了多少个列表页

  protected readonly ajaxThreadsDefault = 10 // 抓取作品数据时的并发请求数量默认值，也是最大值

  protected ajaxThread = this.ajaxThreadsDefault // 抓取时的并发请求数

  protected finishedRequest = 0 // 抓取作品之后，如果 id 队列为空，则统计有几个并发线程完成了请求。当这个数量等于 ajaxThreads 时，说明所有请求都完成了

  protected crawlFinishBecauseStopCrawl = false

  // 子组件必须调用 init 方法，并且不可以修改 init 方法
  protected init() {
    this.setFormOption()
    this.addCrawlBtns()
    this.addAnyElement()
    this.initAny()

    // 如果在 init 方法中绑定了全局事件，并且该事件只适用于当前页面类型，那么应该在 destroy 中解绑事件。

    // 注册当前页面的 destroy 函数
    destroyManager.register(this.destroy.bind(this))

    // 切换页面时，如果任务已经完成，则移除日志区域
    EVT.bindOnce('clearLogAfterPageSwitch', EVT.list.pageSwitch, () => {
      if (!states.busy) {
        EVT.fire('clearLog')
      }
    })

    EVT.bindOnce('crawlCompleteTime', EVT.list.crawlComplete, () => {
      states.crawlCompleteTime = new Date().getTime()
    })

    EVT.bindOnce('downloadCompleteTime', EVT.list.downloadComplete, () => {
      states.downloadCompleteTime = new Date().getTime()
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
  }

  // 设置表单里的选项。主要是设置页数，并隐藏不需要的选项。
  protected setFormOption(): void {
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: '_抓取多少页面',
      tip: '_从本页开始下载提示',
      rangTip: '_数字提示1',
      min: 1,
      max: -1,
    })
  }

  // 添加抓取区域的默认按钮，可以被子类覆写
  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_默认下载多页'
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

  // 作品个数/页数的输入不合法
  private getWantPageError() {
    EVT.fire('wrongSetting')
    const msg = lang.transl('_下载数量错误')
    msgBox.error(msg)
    throw new Error(msg)
  }

  // 在某些页面检查页数/个数设置
  // 可以为 -1，或者大于 0
  protected checkWantPageInput(crawlPartTip: string, crawlAllTip: string) {
    const want = settings.wantPageArr[pageType.type]

    // 如果比 1 小，并且不是 -1，则不通过
    if ((want < 1 && want !== -1) || isNaN(want)) {
      // 比 1 小的数里，只允许 -1 , 0 也不行
      throw this.getWantPageError()
    }

    if (want >= 1) {
      log.warning(crawlPartTip.replace('{}', want.toString()))
    } else if (want === -1) {
      log.warning(crawlAllTip)
    }

    return want
  }

  // 在某些页面检查页数/个数设置，要求必须大于 0
  // 参数 max 为最大值
  // 参数 page 指示单位是“页”（页面）还是“个”（作品个数）
  protected checkWantPageInputGreater0(max: number, page: boolean) {
    const want = settings.wantPageArr[pageType.type]
    if (want > 0) {
      const result = Math.min(want, max)
      log.warning(
        lang.transl(
          page ? '_从本页开始下载x页' : '_从本页开始下载x个',
          result.toString()
        )
      )
      return result
    } else {
      throw this.getWantPageError()
    }
  }

  // 设置要获取的作品数或页数。有些页面使用，有些页面不使用。使用时再具体定义
  protected getWantPage() {}

  // 获取多图作品设置。因为这个不属于过滤器 filter，所以在这里直接获取
  protected getMultipleSetting() {
    // 获取作品张数设置
    if (settings.firstFewImagesSwitch) {
      log.warning(
        `${lang.transl('_多图作品只下载前几张图片')} ${settings.firstFewImages}`
      )
    }
  }

  /**在日志上显示任意提示 */
  protected showTip() {
    if (
      settings.removeWorksOfFollowedUsersOnSearchPage &&
      (pageType.type === pageType.list.ArtworkSearch ||
        pageType.type === pageType.list.NovelSearch)
    ) {
      log.warning(lang.transl('_在搜索页面里移除已关注用户的作品'))
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

    EVT.fire('clearLog')

    log.success(lang.transl('_开始抓取'))
    toast.show(lang.transl('_开始抓取'), {
      position: 'center',
    })

    EVT.fire('crawlStart')

    if (Utils.isPixiv()) {
      await mute.getMuteSettings()
    }

    this.getWantPage()

    this.getMultipleSetting()

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
    // 如果下载器正忙则把 id 列表添加到等待队列中
    if (states.busy) {
      store.waitingIdList.push(...idList)
      toast.show(lang.transl('_下载器正忙这次请求已开始排队'), {
        bgColor: Colors.bgBlue,
      })
    } else {
      if (!this.confirmRecrawl()) {
        return
      }

      EVT.fire('clearLog')

      log.success(lang.transl('_开始抓取'))
      toast.show(lang.transl('_开始抓取'), {
        bgColor: Colors.bgBlue,
      })

      EVT.fire('crawlStart')

      if (Utils.isPixiv()) {
        await mute.getMuteSettings()
      }

      this.getMultipleSetting()

      this.finishedRequest = 0

      this.crawlFinishBecauseStopCrawl = false

      states.stopCrawl = false

      // 传递 id 列表下载时，不显示下载面板
      states.quickCrawl = true

      store.idList = idList

      this.getIdListFinished()
    }
  }

  // 当可以开始抓取时，进入下一个流程。默认情况下，开始获取作品列表。如有不同，由子类具体定义
  protected nextStep() {
    this.getIdList()
  }

  // 获取 id 列表，由各个子类具体定义
  protected getIdList() {}

  // id 列表获取完毕，开始抓取作品内容页
  protected async getIdListFinished() {
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
      const check = await filter.check({
        id: idData.id,
        workTypeString: idData.type,
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

    log.persistentRefresh()
    log.log(lang.transl('_当前作品个数', store.idList.length.toString()))

    // 导出 ID 列表，并停止抓取
    if ((settings.exportIDList || states.exportIDList) && Utils.isPixiv()) {
      states.busy = false
      EVT.fire('stopCrawl')
      log.warning(lang.transl('_已停止抓取'))

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

        const msg = '✓ ' + lang.transl('_导出ID列表')
        log.success(msg)
        toast.success(msg)
      }

      return
    }

    // 这个 return 在这里重置任务状态，不继续抓取作品的详情了，用于调试时反复进行抓取
    // return states.busy = false

    log.log(lang.transl('_开始获取作品信息'))

    if (
      settings.slowCrawl &&
      store.idList.length > settings.slowCrawlOnWorksNumber
    ) {
      // 慢速抓取
      log.warning(lang.transl('_慢速抓取'))
      states.slowCrawlMode = true
      this.ajaxThread = 1
    } else {
      // 全速抓取
      states.slowCrawlMode = false
      this.ajaxThread = Math.min(this.ajaxThreadsDefault, store.idList.length)
    }

    // 开始抓取作品数据
    for (let i = 0; i < this.ajaxThread; i++) {
      window.setTimeout(() => {
        store.idList.length > 0 ? this.getWorksData() : this.afterGetWorksData()
      }, 0)
    }
  }

  // 重设抓取作品列表时使用的变量或标记
  protected resetGetIdListStatus() {}

  protected log429ErrorTip = Utils.debounce(() => {
    log.error(lang.transl('_抓取被限制时返回空结果的提示'))
    if (!settings.slowCrawl) {
      log.error(lang.transl('_提示启用减慢抓取速度功能'))
    }
  }, 500)

  // 获取作品的数据
  protected async getWorksData(idData?: IDData): Promise<void> {
    if (states.stopCrawl) {
      return this.crawlFinished()
    }

    idData = idData || (store.idList.shift()! as IDData)
    if (!idData) {
      return this.afterGetWorksData()
    }
    const id = idData.id

    if (!id) {
      const msg = 'Error: work id is invalid!'
      msgBox.error(msg)
      throw new Error(msg)
    }

    // 在抓取作品详细数据之前，预先对 id 进行检查，如果不符合要求则跳过它
    // 现在这里能够检查这些过滤条件：
    // 1. 检查 id 是否符合 id 范围条件
    // 2. 检查 id 的发布时间是否符合时间范围条件
    // 3. 区分图像作品和小说。注意：因为在某些情况下，下载器只能确定一个作品是图像还是小说，
    // 但不能区分它具体是图像里的哪一种类型（插画、漫画、动图），所以这里不能检查具体的图像类型，只能检查是图像还是小说
    const check = await filter.check({
      id,
      workTypeString: idData.type,
      workType: Tools.getWorkTypeVague(idData.type),
    })
    if (!check) {
      return this.afterGetWorksData()
    }

    try {
      const unlisted = pageType.type === pageType.list.Unlisted
      // 这里不能使用 cacheWorkData中的缓存数据，因为某些数据（如作品的收藏状态）可能已经发生变化
      if (idData.type === 'novels') {
        const data = await API.getNovelData(id, unlisted)
        await saveNovelData.save(data)
        this.afterGetWorksData(data)
      } else {
        const data = await API.getArtworkData(id, unlisted)
        await saveArtworkData.save(data)
        this.afterGetWorksData(data)
      }
    } catch (error) {
      // 当 API 里的网络请求的状态码异常时，会 reject，被这里捕获
      if (error.status) {
        // 请求成功，但状态码不正常
        this.logErrorStatus(error.status, idData)
        if (error.status === 500 || error.status === 429) {
          // 如果状态码 500 或 429，获取不到作品数据，可能是被 pixiv 限制了，等待一段时间后再次发送这个请求
          this.log429ErrorTip()
          window.setTimeout(() => {
            this.getWorksData(idData)
          }, Config.retryTime)
          return
        } else {
          this.afterGetWorksData()
        }
      } else {
        // 请求失败，没有获得服务器的返回数据，一般都是
        // TypeError: Failed to fetch
        // 此外这里也会捕获到 save 作品数据时的错误（如果有）
        console.error(error)

        // 再次发送这个请求
        window.setTimeout(() => {
          this.getWorksData(idData)
        }, 2000)
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
        workTypeString: nextIDData.type,
        workType: Tools.getWorkTypeVague(nextIDData.type),
      })
      if (!check) {
        store.idList.shift()
        return this.getWorksData()
      }
    }

    // 如果存在下一个作品，则继续抓取
    if (store.idList.length > 0) {
      if (states.slowCrawlMode) {
        setTimeoutWorker.set(() => {
          this.getWorksData()
        }, settings.slowCrawlDealy)
      } else {
        this.getWorksData()
      }
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
    // 当下载器没有处于慢速抓取模式时，会使用 10 个并发请求
    // 此时如果第一个请求触发了停止抓取 states.stopCrawl，这 10 个都会进入这里
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

    log.log(lang.transl('_共抓取到n个作品', store.resultMeta.length.toString()))

    log.log(lang.transl('_共抓取到n个文件', store.result.length.toString()))

    log.success(lang.transl('_抓取完毕'), 2)

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

  // 网络请求状态异常时输出提示
  private logErrorStatus(status: number, idData: IDData) {
    const isNovel = idData.type === 'novels'
    const workLink = Tools.createWorkLink(idData.id, !isNovel)
    switch (status) {
      case 0:
        log.error(workLink + ' ' + lang.transl('_作品页状态码0'))
        break

      case 400:
        log.error(workLink + ' ' + lang.transl('_作品页状态码400'))
        break

      case 401:
        log.error(workLink + ' ' + lang.transl('_作品页状态码401'))
        break

      case 403:
        log.error(workLink + ' ' + lang.transl('_作品页状态码403'))
        break

      case 404:
        log.error(workLink + ' ' + lang.transl('_作品页状态码404'))
        break

      case 429:
        log.error(workLink + ' ' + lang.transl('_作品页状态码429'))
        break

      case 500:
        log.error(workLink + ' ' + lang.transl('_作品页状态码500'))
        break

      default:
        log.error(
          lang.transl('_无权访问', workLink) + `HTTP status code: ${status}`
        )
        break
    }
  }

  // 每当抓取了一个作品之后，输出提示
  protected logResultNumber() {
    log.log(
      `${lang.transl('_待处理')} ${store.idList.length}, ${lang.transl(
        '_共抓取到n个作品',
        store.resultMeta.length.toString()
      )}`,
      1,
      false
    )
  }

  // 抓取结果为 0 时输出提示
  protected noResult() {
    // 先触发 crawlComplete，后触发 crawlEmpty。这样便于其他组件处理 crawlEmpty 这个例外情况
    // 如果触发顺序反过来，那么最后执行的都是 crawlComplete，可能会覆盖对 crawlEmpty 的处理
    EVT.fire('crawlComplete')
    EVT.fire('crawlEmpty')
    const msg = lang.transl('_抓取结果为零')
    log.error(msg, 2)
    msgBox.error(msg)
  }

  // 抓取完成后，对结果进行排序
  protected sortResult() {}

  /**定时抓取的按钮 */
  protected addStartTimedCrawlBtn(cb: Function) {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_定时抓取',
      '_定时抓取说明'
    ).addEventListener('click', () => {
      timedCrawl.start(cb)
    })
  }

  /**取消定时抓取的按钮 */
  protected addCancelTimedCrawlBtn() {
    const btn = Tools.addBtn('crawlBtns', Colors.bgWarning, '_取消定时抓取')
    btn.style.display = 'none'

    btn.addEventListener('click', () => {
      EVT.fire('cancelTimedCrawl')
      btn.style.display = 'none'
    })

    // 启动定时抓取之后，显示取消定时抓取的按钮
    window.addEventListener(EVT.list.startTimedCrawl, () => {
      btn.style.display = 'flex'
    })
  }
}

export { InitPageBase }
