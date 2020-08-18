import { EVT } from './EVT'
import { lang } from './Lang'

// 显示跳过下载的文件数量
class ShowSkipCount {
  constructor(el: HTMLElement) {
    this.el = el
    this.bindEvent()
  }

  private count = 0 // 跳过下载的数量
  private el: HTMLElement // 显示提示文本的容器

  private bindEvent() {
    window.addEventListener(EVT.events.crawlStart, () => {
      this.reset()
    })

    window.addEventListener(EVT.events.downloadStop, () => {
      // 重置计数但不清空提示文字，因为用户还需要看
      this.count = 0
    })

    window.addEventListener(EVT.events.skipSaveFile, () => {
      this.addCount()
    })

    window.addEventListener(EVT.events.downloadStart, () => {
      if (this.count === 0) {
        this.reset()
      }
    })

    window.addEventListener(EVT.events.downloadComplete, () => {
      // 重置计数但不清空提示文字，因为用户还需要看
      this.count = 0
    })
  }

  private addCount() {
    this.count++
    this.el.textContent = lang.transl('_已跳过n个文件', this.count.toString())
  }

  private reset() {
    this.count = 0
    this.el.textContent = ''
  }
}

export { ShowSkipCount }
