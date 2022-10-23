import { store } from '../store/Store'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { settings } from '../setting/Settings'
import { toast } from '../Toast'
import { Config } from '../Config'

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
    const urls: string[] = []
    const size = settings.imageSize
    for (const data of store.result) {
      // 只输出图片文件的 url
      // 小说文件没有固定的 url 所以不输出
      if (data.type !== 3) {
        urls.push(data[size])
      }
    }

    if (store.result.length === 0 || urls.length === 0) {
      return toast.error(lang.transl('_没有可用的抓取结果'))
    }

    let result = ''
    if (store.result.length < Config.outputMax) {
      result = urls.join('<br>')
    } else {
      result = urls.join('\n')
    }

    EVT.fire('output', {
      content: result,
      title: '_复制url',
    })
  }
}

new ShowURLs()
