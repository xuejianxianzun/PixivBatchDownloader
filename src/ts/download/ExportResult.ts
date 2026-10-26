import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { store } from '../store/Store'
import { lang } from '../Language'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'
import { log } from '../Log'
import { Config } from '../Config'

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

    const resultList = await Utils.json2BlobSafe(
      store.result,
      Config.exportFileByteLengthLimit
    )
    for (const result of resultList) {
      Utils.downloadFile(
        result.url,
        `result-total ${result.total}-${Utils.replaceUnsafeStr(
          Tools.getPageTitle()
        )}-${Tools.formatDateTimeInFilename(store.crawlCompleteTime)}.json`,
        // 抓取结果可能达到上百 MB，给浏览器留出读取 blob 的时间
        10000
      )
    }

    const msg = lang.transl('_导出成功')
    log.success(msg)
    toast.success(msg)
  }
}

new ExportResult()
