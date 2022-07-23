import { store } from '../store/Store'
import { settings } from '../setting/Settings'
import { lang } from '../Lang'
import { EVT } from '../EVT'
import { DonwloadSuccessData, DonwloadSkipData } from './DownloadType'
import { Bookmark } from '../Bookmark'

// 当文件下载成功后，收藏这个作品
class BookmarkAfterDL {
  constructor(tipEl?: HTMLElement) {
    if (tipEl) {
      this.tipEl = tipEl
      lang.register(this.tipEl)
    }

    this.bindEvents()
  }

  // 储存接收到的 id，用于防止对一个作品重复添加收藏
  // 其实重复添加收藏没什么影响，和只添加一次没区别。为了不浪费网络请求，还是尽量不要重复添加。
  private savedIds: number[] = []

  private successCount = 0

  private tipEl: HTMLElement = document.createElement('span')

  // 可选传入一个元素，显示收藏的数量和总数
  private bindEvents() {
    // 当有文件下载完成时，提取 id 进行收藏
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
      this.showProgress()
    })
  }

  private showProgress() {
    if (this.savedIds.length === 0) {
      lang.updateText(this.tipEl, '')
      return
    }
    lang.updateText(
      this.tipEl,
      '_已收藏带参数',
      `${this.successCount}/${this.savedIds.length}`
    )
  }

  private reset() {
    this.savedIds = []
    this.successCount = 0
  }

  // 接收作品 id，开始收藏
  private send(id: number | string) {
    if (!settings.bmkAfterDL) {
      return
    }

    if (typeof id !== 'number') {
      id = Number.parseInt(id)
    }

    // 检查这个 id 是否已经添加了
    if (this.savedIds.includes(id)) {
      return
    }

    this.addBookmark(id)
  }

  // 给所有作品添加收藏（之前收藏过的，新 tag 将覆盖旧 tag）
  private async addBookmark(id: number) {
    return new Promise<void>(async (resolve, reject) => {
      this.savedIds.push(id)
      this.showProgress()

      // 从 store 里查找这个作品的数据
      const dataSource =
        store.resultMeta.length > 0 ? store.resultMeta : store.result
      const data = dataSource.find((val) => val.idNum === id)
      if (data === undefined) {
        return reject(new Error(`Not find ${id} in result`))
      }

      await Bookmark.add(
        id.toString(),
        data.type !== 3 ? 'illusts' : 'novels',
        data.tags
      )

      this.successCount++
      this.showProgress()

      resolve()
    })
  }
}

export { BookmarkAfterDL }
