import { Colors } from '../Colors'
import { EVT } from '../EVT'
import { lang } from '../Lang'

// 显示下载状态
class ShowDownloadStates {
  constructor(el: HTMLElement) {
    this.el = el
    this.bindEvents()
  }

  private el: HTMLElement

  private bindEvents() {
    for (const ev of [
      EVT.list.crawlFinish,
      EVT.list.resultChange,
      EVT.list.resume,
    ]) {
      window.addEventListener(ev, () => {
        this.setText('_未开始下载')
      })
    }

    window.addEventListener(EVT.list.downloadStart, () => {
      this.setText('_正在下载中')
    })

    window.addEventListener(EVT.list.downloadPause, () => {
      this.setText('_已暂停', '#f00')
    })

    window.addEventListener(EVT.list.downloadStop, () => {
      this.setText('_已停止', '#f00')
    })

    window.addEventListener(EVT.list.downloadComplete, () => {
      this.setText('_下载完毕', Colors.textSuccess)
    })
  }

  private setText(textFlag: string, color: string = Colors.bgBlue) {
    lang.updateText(this.el, textFlag)
    this.el.style.color = color
  }
}

export { ShowDownloadStates }
