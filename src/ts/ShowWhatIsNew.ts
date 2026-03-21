import { lang } from './Language'
import { Config } from './Config'
import { msgBox } from './MsgBox'
import { Utils } from './utils/Utils'
import { EVT } from './EVT'
import { setSetting, settings } from './setting/Settings'

// 显示版本更新说明
class ShowWhatIsNew {
  constructor() {
    this.bindEvents()
  }

  private flag = '18.5.0'

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      // 在 settingInitialized 事件触发后生成消息，如果时间较早，可能会被翻译成错误的语言
      let msg = `
      <span>${lang.transl('_扩展程序升到x版本', this.flag)}</span>
      <br>
      <br>
      <span>${lang.transl('_更新说明1850')}</span>
      `

      // <strong><span>✨ ${lang.transl('_新增设置项')}:</span></strong>
      // <strong><span>✨ ${lang.transl('_新增功能')}:</span></strong>
      // <span class="blue">${lang.transl('_下载间隔')}</span>
      // <span>${lang.transl('_该功能默认启用')}</span>
      // <span>${lang.transl('_默认未启用')}</span>
      // <span>${lang.transl('_修复bug')}</span>
      // <span>${lang.transl('_优化用户体验')}</span>

      // 在更新说明的底部添加赞助提示
      msg += `
      <br>
      <br>
      ${lang.transl('_赞助方式提示')}`

      this.show(msg)
    })
  }

  private show(msg: string) {
    // 如果这个标记是初始值，说明这是用户首次安装这个扩展，或者重置了设置，此时不显示版本更新提示
    if (settings.whatIsNewFlag === Config.whatIsNewFlagDefault) {
      setSetting('whatIsNewFlag', this.flag)
      return
    }

    if (Utils.isPixiv() && settings.whatIsNewFlag !== this.flag) {
      msgBox.show(msg, {
        title: Config.appName + ` ${lang.transl('_最近更新')}`,
        btn: lang.transl('_我知道了'),
      })
      setSetting('whatIsNewFlag', this.flag)
    }
  }
}

new ShowWhatIsNew()
