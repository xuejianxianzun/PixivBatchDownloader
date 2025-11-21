import { store } from '../store/Store'
import { settings } from '../setting/Settings'
import { lang } from '../Language'
import { EVT } from '../EVT'
import { DonwloadSuccessData, DonwloadSkipData } from './DownloadType'
import { bookmark } from '../Bookmark'
import { setTimeoutWorker } from '../SetTimeoutWorker'
import { log } from '../Log'

// 当文件下载成功后，收藏这个作品
class BookmarkAfterDL {
  constructor(tipEl?: HTMLElement) {
    if (tipEl) {
      this.tipEl = tipEl
      lang.register(this.tipEl)
    }

    this.bindEvents()
    this.check()
  }

  private successCount = 0

  // 储存需要收藏的作品的 ID。其数量就是收藏任务的总数
  private IDList: number[] = []

  // 储存需要收藏的作品的 ID。每次收藏时，从这里取出一个 ID 进行收藏。它的数量并不总是等于任务总数
  private queue: number[] = []

  private tipEl: HTMLElement = document.createElement('span')

  // 如果之前的下载已完成，那么当下一次开始下载时（也就是新的下载，而不是暂停后继续的下载），则重置状态
  private delayReset = false

  // 可选传入一个元素，显示收藏的数量和总数
  private bindEvents() {
    // 当有文件下载完成时，提取作品 ID 进行收藏
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      this.send(Number.parseInt(successData.id))
    })

    // 当有文件跳过下载时，如果是重复的下载，也进行收藏
    // 因为重复的下载，本意还是要下载的，只是之前下载过了。所以进行收藏。
    // 其他跳过下载的原因，则是本意就是不下载，所以不收藏。
    window.addEventListener(EVT.list.skipDownload, (ev: CustomEventInit) => {
      const skipData = ev.detail.data as DonwloadSkipData
      if (skipData.reason === 'duplicate') {
        this.send(Number.parseInt(skipData.id))
      }
    })

    // 当开始新的抓取时重置状态和提示
    window.addEventListener(EVT.list.crawlStart, (ev: CustomEventInit) => {
      this.reset()
    })

    window.addEventListener(EVT.list.downloadComplete, () => {
      this.showCompleteLog = true
      this.delayReset = true
    })

    window.addEventListener(EVT.list.downloadStart, () => {
      if (this.delayReset) {
        this.reset()
        this.delayReset = false
      }
    })
  }

  /** 当所有的收藏任务都完成后，显示一条日志 */
  // 只有当所有文件都下载完毕后才会显示这条日志
  private showCompleteLog = false

  private showProgress() {
    if (this.IDList.length === 0) {
      lang.updateText(this.tipEl, '')
      return
    }
    lang.updateText(
      this.tipEl,
      '_已收藏带参数',
      `${this.successCount}/${this.IDList.length}`
    )

    if (
      this.showCompleteLog &&
      this.successCount > 0 &&
      this.successCount === this.IDList.length
    ) {
      this.showCompleteLog = false
      log.success(lang.transl('_收藏作品完毕'))
    }
  }

  private reset() {
    this.IDList = []
    this.queue = []
    this.showCompleteLog = false
    this.successCount = 0
    this.tipEl.classList.remove('red')
    this.tipEl.classList.add('green')
    this.showProgress()
  }

  // 接收作品 ID，开始收藏
  private send(id: number | string) {
    if (!settings.bmkAfterDL) {
      return
    }

    if (typeof id !== 'number') {
      id = Number.parseInt(id)
    }

    // 检查这个 ID 是否已经添加了
    if (this.IDList.includes(id)) {
      return
    }

    this.queue.push(id)
    this.IDList.push(id)
    this.showProgress()
  }

  private busy = false

  private check() {
    setTimeoutWorker.set(() => {
      this.addBookmark()
    }, 200)
  }

  // 给所有作品添加收藏（之前收藏过的，新 tag 将覆盖旧 tag）
  private async addBookmark() {
    if (this.busy || this.queue.length === 0) {
      return this.check()
    }

    const id = this.queue.shift()
    if (!id) {
      return this.check()
    }

    this.busy = true

    // 从 store 里查找这个作品的数据
    const dataSource =
      store.resultMeta.length > 0 ? store.resultMeta : store.result
    const data = dataSource.find((val) => val.idNum === id)
    if (data === undefined) {
      log.error(`Not find ${id} in result`)
      return this.check()
    }

    // 添加收藏
    // 当抓取结果很少时，不使用慢速收藏
    // 如果抓取结果大于 30 个，则使用慢速收藏1
    const status = await bookmark.add(
      id.toString(),
      data.type !== 3 ? 'illusts' : 'novels',
      data.tags,
      undefined,
      undefined,
      store.result.length > 30
    )

    this.successCount++
    // 已完成的数量不应该超过任务总数
    // 特定情况下会导致已完成数量比任务总数多 1，需要修正。原因如下：
    // 在下载完毕后，收藏尚未完毕（例如进度为 18/48)，并且第 19 个收藏任务已经发送给了 bookmark.add
    // 在这个收藏任务完成前，用户点击开始下载按钮开始了新一批下载任务，导致执行了 reset
    // successCount 会重置为 0
    // 但之后遗留的 bookmark.add 执行完毕，在这里导致 successCount + 1
    // 这会使已完成数量比开始下载后的新的任务数量多 1，所以需要进行检查，以避免这种情况
    if (this.successCount > this.IDList.length) {
      this.successCount = this.IDList.length
    }
    this.showProgress()
    this.busy = false

    if (status === 403) {
      log.error(
        `Add bookmark: ${id}, Error: 403 Forbidden, ${lang.transl(
          '_你的账号已经被Pixiv限制'
        )}`
      )
    }

    return this.check()
  }
}

export { BookmarkAfterDL }
