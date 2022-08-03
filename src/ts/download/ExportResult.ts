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
    if (store.result.length === 0) {
      toast.error(lang.transl('_没有可用的抓取结果'))
      return
    }

    const blob = Utils.json2BlobSafe(store.result)
    const url = URL.createObjectURL(blob)
    Utils.downloadFile(
      url,
      `result-${Utils.replaceUnsafeStr(
        Tools.getPageTitle()
      )}-${store.crawlCompleteTime.getTime()}.json`
    )

    toast.success(lang.transl('_导出成功'))
  }
}

new ExportResult()
