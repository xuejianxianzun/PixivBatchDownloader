import { lang } from './Lang'
import { Config } from './config/Config'
import { msgBox } from './MsgBox'
import { Utils } from './utils/Utils'
import { EVT } from './EVT'
import { setSetting, settings } from './setting/Settings'

// 显示最近更新内容
class ShowWhatIsNew {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.show()
    })
  }

  private flag = '11.7.0'

  private msg = `${lang.transl('_新增命名标记')}: {bmk_id}
  <br>
  ${lang.transl('_命名标记bmk_id')}
  `

  private show() {
    if (Utils.isPixiv() && settings.whatIsNewFlag !== this.flag) {
      msgBox.show(this.msg, {
        title: Config.appName + ` ${lang.transl('_最近更新')}`,
        btn: lang.transl('_我知道了'),
      })
      setSetting('whatIsNewFlag', this.flag)
    }
  }
}

new ShowWhatIsNew()
