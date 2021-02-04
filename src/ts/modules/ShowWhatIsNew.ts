import { lang } from './Lang'
import { langTextKeys } from './LangText'
import Config from './Config'
import { msgBox } from './MsgBox'

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
      msgBox.show(lang.transl(this.newTag), {
        title: Config.name + ` ${lang.transl('_最近更新')}`,
        btn: lang.transl('_我知道了'),
      })
      localStorage.setItem(storeName, this.newTag)
    }
  }
}

new ShowWhatIsNew()
