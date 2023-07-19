import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { store } from '../store/Store'
import { lang } from '../Lang'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'
import { log } from '../Log'

class ExportResult {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.exportResult, () => {
      this.output()
    })
  }

  private async output() {
    if (store.result.length === 0) {
      toast.error(lang.transl('_没有可用的抓取结果'))
      return
    }

    const resultList = await Utils.json2BlobSafe(store.result)
    for (const result of resultList) {
      Utils.downloadFile(
        result.url,
        `result-total ${result.total}-${Utils.replaceUnsafeStr(
          Tools.getPageTitle()
        )}-${Utils.replaceUnsafeStr(
          store.crawlCompleteTime.toLocaleString()
        )}.json`
      )
    }

    const msg = lang.transl('_导出成功')
    log.success(msg)
    toast.success(msg)
  }
}

new ExportResult()
