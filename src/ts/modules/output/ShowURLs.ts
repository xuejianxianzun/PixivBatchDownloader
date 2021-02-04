import { store } from '../Store'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { settings } from '../setting/Settings'
import { toast } from '../Toast'

// 显示 url
class ShowURLs {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.showURLs, () => {
      this.showURLs()
    })
  }

  private showURLs() {
    if (store.result.length === 0) {
      toast.error(lang.transl('_没有数据可供使用'))
      return
    }

    const urls: string[] = []
    const size = settings.imageSize
    for (const result of store.result) {
      urls.push(result[size])
    }

    EVT.fire(EVT.list.output, {
      content: urls.join('<br>'),
      title: lang.transl('_复制url'),
    })
  }
}

new ShowURLs()
export {}
