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

  private flag = '12.6.0'
  private msg = ''

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      // 消息文本要写在 settingInitialized 事件回调里，否则它们可能会被翻译成错误的语言
      this.msg = `
      ${lang.transl('_新增设置项')}: ${lang.transl('_下载小说的封面图片')}
      <br>
      <br>
      ${lang.transl('_该功能默认开启')}
      <br>
      ${lang.transl('_你可以在更多他选项卡的下载分类里找到它')}

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
