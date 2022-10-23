import { EVT } from '../EVT'

// 储存需要跨模块使用的、会变化的状态
// 这里的状态不需要持久化保存
// 状态的值通常只由单一的模块修改
class States {
  constructor() {
    this.bindEvents()
  }

  /**指示 settings 是否初始化完毕 */
  public settingInitialized = false

  /**表示下载器是否处于繁忙状态
   *
   * 繁忙：下载器正在抓取作品，或者正在下载文件，或者正在批量添加收藏
   */
  public busy = false

  /**快速下载标记
   *
   * 快速下载模式中不会显示下载面板，并且总是会自动开始下载
   *
   * 启动快速下载时设为 true，下载完成或中止时复位到 false
   */
  public quickCrawl = false

  /**在排行榜抓取时，是否只抓取“首次登场”的作品 */
  // 修改者：InitRankingArtworkPage 模块修改这个状态
  public debut = false

  /**收藏模式的标记 */
  // 开始批量收藏时设为 true，收藏完成之后复位到 false
  public bookmarkMode = false

  /**合并系列小说时使用的标记 */
  public mergeNovel = false

  /**抓取标签列表时使用的标记 */
  public crawlTagList = false

  /**是否处于手动选择作品状态 */
  public selectWork = false

  /**是否处于下载中 */
  public downloading = false

  /**是否应用慢速抓取模式 */
  // 由 InitPageBase 修改它的值
  public slowCrawlMode = false

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.settingInitialized = true
    })

    const idle = [
      EVT.list.crawlFinish,
      EVT.list.downloadPause,
      EVT.list.downloadStop,
      EVT.list.downloadComplete,
      EVT.list.bookmarkModeEnd,
    ]

    idle.forEach((type) => {
      window.addEventListener(type, () => {
        this.busy = false
      })
    })

    const busy = [
      EVT.list.crawlStart,
      EVT.list.downloadStart,
      EVT.list.bookmarkModeStart,
    ]

    busy.forEach((type) => {
      window.addEventListener(type, () => {
        this.busy = true
      })
    })

    window.addEventListener(EVT.list.bookmarkModeStart, () => {
      this.bookmarkMode = true
    })

    window.addEventListener(EVT.list.bookmarkModeEnd, () => {
      this.bookmarkMode = false
    })

    // 下载完成，或者下载中止时，复位快速下载类状态
    const resetQuickState = [
      EVT.list.crawlEmpty,
      EVT.list.downloadStop,
      EVT.list.downloadPause,
      EVT.list.downloadComplete,
      EVT.list.downloadCancel,
    ]

    for (const ev of resetQuickState) {
      window.addEventListener(ev, () => {
        this.quickCrawl = false
      })
    }

    window.addEventListener(EVT.list.downloadStart, () => {
      this.downloading = true
    })

    const downloadIdle = [
      EVT.list.downloadPause,
      EVT.list.downloadStop,
      EVT.list.downloadComplete,
    ]
    for (const ev of downloadIdle) {
      window.addEventListener(ev, () => {
        this.downloading = false
      })
    }

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      // 当用户关闭设置里的慢速抓取时，在这里把慢速抓取模式的标记设为 false
      // 但是当用户开启慢速抓取时，不应该在这里把标记设为 true
      if (data.name === 'slowCrawl' && data.value === false) {
        this.slowCrawlMode = false
      }
    })
  }
}

const states = new States()
export { states }
