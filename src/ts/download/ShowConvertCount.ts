import { EVT } from '../EVT'
import { lang } from '../Lang'

// 显示正在转换的文件数量
class ShowConvertCount {
  constructor(el: HTMLElement) {
    this.el = el
    lang.register(this.el)
    this.bindEvents()
  }

  private el: HTMLElement // 显示提示文本的容器

  private bindEvents() {
    window.addEventListener(EVT.list.convertChange, (ev: CustomEventInit) => {
      const count = ev.detail.data
      if (count > 0) {
        lang.updateText(this.el, '_转换任务提示', count.toString())
      } else {
        this.el.textContent = ''
        lang.updateText(this.el, '')
      }
    })
  }
}

export { ShowConvertCount }
