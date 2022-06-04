import { store } from '../store/Store'
import { states } from '../store/States'
import { EVT } from '../EVT'

// 在网页标题上显示剩余下载数量
class ShowRemainingDownloadOnTitle {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.setInterval(() => {
      this.show()
    }, 500)

    const removeStrEvents = [
      EVT.list.downloadStop,
      EVT.list.downloadComplete,
      EVT.list.crawlStart,
    ]

    for (const evt of removeStrEvents) {
      window.addEventListener(evt, () => {
        this.removeStr()
      })
    }
  }

  // 生成新的字符串
  private createStr() {
    if (store.remainingDownload > 0) {
      return ` ${store.remainingDownload} `
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
    if (!states.downloading || !this.checkStatusFlag()) {
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

  private removeStr(): undefined
  // 如果传入字符串，则不直接修改 document.title，以提高性能
  private removeStr(titleStr: string): string
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

new ShowRemainingDownloadOnTitle()
