import { store } from '../Store'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { settings } from '../setting/Settings'

// 显示 url
class ShowURLs {
  constructor() {
    this.bindEvent()
  }

  private bindEvent() {
    window.addEventListener(EVT.list.showURLs, () => {
      this.showURLs()
    })
  }

  private showURLs() {
    if (store.result.length === 0) {
      EVT.sendMsg({
        msg: lang.transl('_没有数据可供使用'),
        type: 'error',
      })
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
