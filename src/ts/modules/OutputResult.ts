import { API } from './API'
import { EVT } from './EVT'
import { DOM } from './DOM'
import { store } from './Store'

class OutputResult {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.outputResult, () => {
      this.output()
    })
  }

  private output() {
    const str = JSON.stringify(store.result, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    DOM.downloadFile(
      url,
      `result-${API.replaceUnsafeStr(
        DOM.getTitle(),
      )}-${new Date().getTime()}.json`,
    )
  }
}

new OutputResult()
export {}
