import { Tools } from '../Tools'
import { store } from '../store/Store'
import { fileName } from '../FileName'
import { lang } from '../Lang'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'

// 输出 lst 文件
class ExportLST {
  constructor() {
    this.bindEvents()
  }

  private readonly separate = '?/' // 分隔符
  private readonly CRLF = '\r\n' // 换行符

  private bindEvents() {
    window.addEventListener(
      'keydown',
      (ev) => {
        if (ev.altKey && ev.code === 'KeyL') {
          this.createLst()
        }
      },
      false
    )
  }

  private createLst() {
    if (store.result.length === 0) {
      toast.error(lang.transl('_没有可用的抓取结果'))
      return
    }

    const array: string[] = []
    for (const data of store.result) {
      array.push(data.original + this.separate + fileName.getFileName(data))
    }

    const result = array.join(this.CRLF)
    const blob = new Blob([result])
    const url = URL.createObjectURL(blob)
    const name = Tools.getPageTitle() + '.lst'

    Utils.downloadFile(url, name)
  }
}

new ExportLST()
