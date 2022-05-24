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

  private flag = '12.2.00'
  private msg = ''

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      // 消息文本要写在 settingInitialized 之后，否则它们可能会被翻译成错误的语言
      this.msg = `${lang.transl('_新增命名标记')}
      <br>
      <span class="blue">{series_id}</span>
      <br>
      ${lang.transl('_命名标记seriesId')}
      <br>
      <br>
      ${lang.transl('_优化预览作品功能')}
      `
      this.show()
    })
  }

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
