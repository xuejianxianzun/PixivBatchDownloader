import { EVT } from './EVT'

// 储存需要跨组件使用的，会变化的状态
class States {
  constructor() {
    this.bindEvent()
  }
  // 当前是否允许展开工作（影响抓取或者下载，也会影响其他一些功能）
  // 如果为 false，说明现在正在抓取中，或者正在下载中
  public allowWork = true

  public quickDownload = false // 快速下载标记。如果这次下载是快速下载，则为 true

  public notAutoDownload = false // 如果为 true，那么下载器在抓取完成后，不回自动开始下载。这样需要用户手动点击下载按钮才开始下载。

  private bindEvent() {
    window.addEventListener(EVT.events.downloadComplete, () => {
      this.allowWork = true
      this.quickDownload = false
    })
  }
}

const states = new States()
export { states }
