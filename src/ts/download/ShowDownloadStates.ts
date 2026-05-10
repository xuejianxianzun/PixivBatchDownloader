import { Colors } from '../Colors'
import { EVT } from '../EVT'
import { lang } from '../Language'

// 显示下载状态
class ShowDownloadStates {
  constructor(el: HTMLElement) {
    this.el = el
    this.bindEvents()
  }

  private el: HTMLElement

  private bindEvents() {
    for (const ev of [
      EVT.list.crawlComplete,
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
      this.setText('_下载已暂停', Colors.textWarning)
    })

    window.addEventListener(EVT.list.downloadStop, () => {
      this.setText('_下载已停止', Colors.textError)
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
