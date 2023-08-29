import { store } from '../store/Store'
import { states } from '../store/States'
import { EVT } from '../EVT'

// 抓取阶段，在网页标题上显示抓取到的结果数量
class ShowTotalResultOnTitle {
  constructor() {
    this.bindEvents()
  }

  private enable = false

  private bindEvents() {
    const enableEvts = [EVT.list.crawlStart, EVT.list.resultChange]

    enableEvts.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.removeStr()
        this.enable = true
      })
    })

    const disableEvts = [
      EVT.list.downloadStart,
      EVT.list.downloadPause,
      EVT.list.downloadStop,
    ]

    disableEvts.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.removeStr()
        this.enable = false
      })
    })

    window.setInterval(() => {
      this.enable && this.show()
    }, 500)
  }

  // 生成新的字符串
  private createStr() {
    if (store.result.length > 0) {
      return ` ${store.result.length} `
    }
    return ''
  }

  // 保存缓存的字符串，后面会需要在标题中查找缓存的字符串
  private str = this.createStr()

  // 检查标题中是否有下载状态的 flag
  // 如果没有，就不会显示剩余数量
  private checkStatusFlag() {
    return document.title.indexOf(']') > 0
  }

  private show() {
    if (states.downloading || !this.checkStatusFlag()) {
      return
    }

    // 先移除旧的字符串，然后添加新的字符串
    const title = this.removeStr(document.title)

    this.str = this.createStr()

    if (!this.str || !title) {
      return
    }

    document.title = title.replace(']', ']' + this.str)
  }

  // 如果传入字符串，则不直接修改 document.title，以提高性能
  private removeStr(titleStr?: string) {
    if (!this.str) {
      return
    }

    if (titleStr) {
      return titleStr.replace(this.str, '')
    } else {
      document.title = document.title.replace(this.str, '')
    }
  }
}

new ShowTotalResultOnTitle()
