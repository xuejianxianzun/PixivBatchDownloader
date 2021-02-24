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

    // 使用数组储存文件数据
    let resultArray:string[] = []

    // 定义数组项的分隔字符
    const split = ','

    // 在数组开头添加数组的开始符号
    resultArray.push('[')

    // 循环添加每一个结果，以及分割字符
    for (const result of store.result) {
      resultArray.push(JSON.stringify(result))
      resultArray.push(split)
    }

    // 在数组末尾添加数组的结束符号
    resultArray.push(']')

    // 创建 blob 对象
    const blob = new Blob(resultArray, { type: 'application/json' })
    resultArray = []

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
