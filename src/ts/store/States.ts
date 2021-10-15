import { EVT } from '../EVT'

// 储存需要跨模块使用的、会变化的状态
// 这里的状态不需要持久化保存。
// 状态的值通常只由单一的模块修改，其他模块只读取不修改
class States {
  constructor() {
    this.bindEvents()
  }

  // 表示下载器是否处于繁忙状态
  // 如果下载器正在抓取中，或者正在下载中，则为 true；如果下载器处于空闲状态，则为 false
  // 修改者：本模块根据下载器的事件来修改这个状态
  public busy = false

  // 快速下载标记
  // 快速下载模式中不会显示下载面板，并且会自动开始下载
  // 启动快速下载时设为 true，下载完成或中止时复位到 false
  public quickCrawl = false

  // 这次下载是否是从图片查看器建立的
  // 如果是，那么下载途中不会显示下载面板，并且会自动开始下载
  // 作用同 quickCrawl，只是触发方式不同
  public downloadFromViewer = false

  // 在排行榜抓取时，是否只抓取“首次登场”的作品
  // 修改者：InitRankingArtworkPage 模块修改这个状态
  public debut = false

  // 收藏模式的标记
  // 修改者：本模块监听批量收藏作品的事件来修改这个标记
  // 开始批量收藏时设为 true，收藏完成之后复位到 false
  public bookmarkMode = false

  // 合并系列小说时使用的标记
  public mergeNovel = false

  // 抓取标签列表时使用的标记
  public crawlTagList = false

  private bindEvents() {
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
        this.downloadFromViewer = false
      })
    }
  }
}

const states = new States()
export { states }
