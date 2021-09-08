import { store } from '../store/Store'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { settings } from '../setting/Settings'
import { toast } from '../Toast'
import { Config } from '../config/Config'

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

    const size = settings.imageSize
    const urls = store.result.map((data) => data[size])

    let result = ''
    if (store.result.length < Config.outputMax) {
      result = urls.join('<br>')
    } else {
      result = urls.join('\n')
    }

    EVT.fire('output', {
      content: result,
      title: lang.transl('_复制url'),
    })
  }
}

new ShowURLs()
