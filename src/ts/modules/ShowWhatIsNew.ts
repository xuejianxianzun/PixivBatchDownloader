import { lang } from './Lang'
import Config from './config/Config'
import { msgBox } from './MsgBox'
import { Tools } from './Tools'

// 显示最近更新内容
class ShowWhatIsNew {
  constructor() {
    this.show()
  }

  private flag = 'xzNew920'
  private msg = lang.transl('_新增设置项') + ': <br>' + lang.transl('_背景图片')

  private readonly storeName = 'xzNewVerTag'

  private show() {
    const value = localStorage.getItem(this.storeName)
    if (Tools.isPixiv() && value !== this.flag) {
      msgBox.show(this.msg, {
        title: Config.name + ` ${lang.transl('_最近更新')}`,
        btn: lang.transl('_我知道了'),
      })
      localStorage.setItem(this.storeName, this.flag)
    }
  }
}

new ShowWhatIsNew()
