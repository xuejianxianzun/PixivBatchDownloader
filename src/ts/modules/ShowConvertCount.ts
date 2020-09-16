import { EVT } from './EVT'
import { lang } from './Lang'

// 显示正在转换的文件数量
class ShowConvertCount {
  constructor(el: HTMLElement) {
    this.el = el
    this.bindEvent()
  }

  private el: HTMLElement // 显示提示文本的容器

  private bindEvent() {
    window.addEventListener(EVT.list.convertChange, (ev: CustomEventInit) => {
      const count = ev.detail.data
      let convertText = ''
      if (count > 0) {
        convertText = lang.transl('_转换任务提示', count.toString())
      }
      this.el.textContent = convertText
    })
  }
}

export { ShowConvertCount }
