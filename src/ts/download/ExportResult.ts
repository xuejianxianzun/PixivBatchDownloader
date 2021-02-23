import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { store } from '../store/Store'
import { lang } from '../Lang'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'

class ExportResult {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.exportResult, () => {
      this.output()
    })
  }

  private output() {
    // 如果没有数据则不执行
    if (store.result.length === 0) {
      toast.error(lang.transl('_没有数据可供使用'))
      return
    }

    const blob = Utils.json2Blob(store.result)
    const url = URL.createObjectURL(blob)
    Utils.downloadFile(
      url,
      `result-${Utils.replaceUnsafeStr(
        Tools.getTitle()
      )}-${store.crawlCompleteTime.getTime()}.json`
    )

    toast.success(lang.transl('_导出成功'))
  }
}

new ExportResult()
