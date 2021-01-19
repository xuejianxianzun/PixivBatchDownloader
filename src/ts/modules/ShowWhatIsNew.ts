import { lang } from './Lang'
import { langTextKeys } from './LangText'
import { EVT } from './EVT'

// 显示最近更新内容
class ShowWhatIsNew {
  constructor() {
    this.show()
  }

  private newTag: langTextKeys = '_xzNew900'

  private show() {
    const storeName = 'xzNewVerTag'
    const value = localStorage.getItem(storeName)
    if (window.location.host.includes('pixiv.net') && value !== this.newTag) {
      EVT.sendMsg({
        title: `Powerful Pixiv Downloader ${lang.transl('_最近更新')}`,
        msg: lang.transl(this.newTag),
      })
      localStorage.setItem(storeName, this.newTag)
    }
  }
}

new ShowWhatIsNew()
