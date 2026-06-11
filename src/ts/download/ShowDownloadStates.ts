import { EVT } from '../EVT'
import { lang } from '../Language'

type DownloadStateStatus = 'start' | 'loading' | 'pause' | 'stop' | 'complete'

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
      this.setText('_正在下载中', 'loading')
    })

    window.addEventListener(EVT.list.downloadPause, () => {
      this.setText('_下载已暂停', 'pause')
    })

    window.addEventListener(EVT.list.downloadStop, () => {
      this.setText('_下载已停止', 'stop')
    })

    window.addEventListener(EVT.list.downloadComplete, () => {
      this.setText('_下载完毕', 'complete')
    })
  }

  private setText(textFlag: string, state: DownloadStateStatus = 'start') {
    lang.updateText(this.el, textFlag)
    this.el.dataset.state = state
    this.el.style.removeProperty('color')
  }
}

export { ShowDownloadStates }
