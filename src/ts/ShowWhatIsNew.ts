import { lang } from './Lang'
import { Config } from './config/Config'
import { msgBox } from './MsgBox'
import { Utils } from './utils/Utils'

// 显示最近更新内容
class ShowWhatIsNew {
  constructor() {
    this.show()
  }

  private flag = 'xzNew1090'

  private msg = `${lang.transl('_whatisnew')}`

  private readonly storeName = 'xzNewVerTag'

  private show() {
    const value = localStorage.getItem(this.storeName)
    if (Utils.isPixiv() && value !== this.flag) {
      msgBox.show(this.msg, {
        title: Config.appName + ` ${lang.transl('_最近更新')}`,
        btn: lang.transl('_我知道了'),
      })
      localStorage.setItem(this.storeName, this.flag)
    }
  }
}

new ShowWhatIsNew()
