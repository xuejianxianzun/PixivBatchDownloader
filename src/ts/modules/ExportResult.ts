import { EVT } from './EVT'
import { DOM } from './DOM'
import { store } from './Store'
import { lang } from './Lang'
import { Tools } from './Tools'

class ExportResult {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.outputResult, () => {
      this.output()
    })
  }

  private output() {
    // 如果没有数据则不执行
    if (store.result.length === 0) {
      EVT.fire(EVT.list.sendToast, {
        text: lang.transl('_没有数据可供使用'),
        bgColorType: 'error',
      })
      return
    }

    const str = JSON.stringify(store.result, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    DOM.downloadFile(
      url,
      `result-${Tools.replaceUnsafeStr(
        DOM.getTitle()
      )}-${store.crawlCompleteTime.getTime()}.json`
    )
  }
}

new ExportResult()
export {}
