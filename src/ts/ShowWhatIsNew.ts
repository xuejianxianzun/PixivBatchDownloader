import { lang } from './Lang'
import { Config } from './config/Config'
import { msgBox } from './MsgBox'
import { Utils } from './utils/Utils'

// 显示最近更新内容
class ShowWhatIsNew {
  constructor() {
    this.show()
  }

  private flag = '11.4.2'

  private msg = `${lang.transl('_whatisnew')}`

  private readonly storeName = 'xzNewVerTag'

  private show() {
    const value = localStorage.getItem(this.storeName)
    if (value !== this.flag && Utils.isPixiv()) {
      msgBox.show(this.msg, {
        title: Config.appName + ` ${lang.transl('_最近更新')}`,
        btn: lang.transl('_我知道了'),
      })
      localStorage.setItem(this.storeName, this.flag)
    }
  }
}

new ShowWhatIsNew()
