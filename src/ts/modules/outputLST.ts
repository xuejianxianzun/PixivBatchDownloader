import { DOM } from './DOM'
import { store } from './Store'
import { fileName } from './FileName'

// 输出 lst 文件
class OutputLST {
  constructor() {
    this.bindEvent()
  }

  private readonly separate = '?/' // 分隔符
  private readonly CRLF = '\r\n' // 换行符

  private bindEvent() {
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
      return window.alert('现在没有抓取结果可以输出')
    }

    const array: string[] = []
    for (const data of store.result) {
      array.push(data.original + this.separate + fileName.getFileName(data))
    }

    const result = array.join(this.CRLF)
    const blob = new Blob([result])
    const url = URL.createObjectURL(blob)
    const name = DOM.getTitle() + '.lst'

    DOM.downloadFile(url, name)
  }
}

new OutputLST()
export {}
