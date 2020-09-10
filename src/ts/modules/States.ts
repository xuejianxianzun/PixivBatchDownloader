import { EVT } from './EVT'

// 储存需要跨组件使用的、会变化的状态
// 这里的状态不需要持久化保存。
// 状态的值通常只由单一的组件修改，其他组件只读取不修改
class States {
  constructor() {
    this.bindEvent()
  }

  // 表示下载器是否处于繁忙状态
  // 如果下载器正在抓取中，或者正在下载中，则为 true；如果下载器处于空闲状态，则为 false
  // 修改者 1：本组件根据下载器的事件来修改这个状态
  public busy = false

  // 快速下载标记。如果为 true 说明进入了快速下载模式
  // 修改者 1：QuickDownloadBtn 组件里，启动快速下载时设为 true，下载完成或中止时复位到 false
  public quickDownload = false

  // 不自动下载的标记。如果为 true，那么下载器在抓取完成后，不会自动开始下载。（即使用户设置了自动开始下载）
  // 修改者 1：InitSearchArtworkPage 组件根据“预览搜索结果”的设置，修改这个状态
  public notAutoDownload = false

  // 在排行榜抓取时，是否只抓取“首次登场”的作品
  // 修改者 1：InitRankingArtworkPage 组件修改这个状态
  public debut = false

  private bindEvent() {
    const idle = [
      EVT.events.crawlFinish,
      EVT.events.crawlError,
      EVT.events.downloadPause,
      EVT.events.downloadStop,
      EVT.events.downloadComplete,
    ]

    idle.forEach((type) => {
      window.addEventListener(type, () => {
        this.busy = false
      })
    })

    const busy = [EVT.events.crawlStart, EVT.events.downloadStart]

    busy.forEach((type) => {
      window.addEventListener(type, () => {
        this.busy = true
      })
    })
  }
}

const states = new States()
export { states }
