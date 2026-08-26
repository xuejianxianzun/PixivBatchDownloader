import browser from 'webextension-polyfill'
import { lang } from './Language'
import { Config } from './Config'
import { msgBox } from './MsgBox'
import { Utils } from './utils/Utils'
import { EVT } from './EVT'
import { setSetting, settings } from './setting/Settings'

// 显示版本更新说明
class ShowWhatIsNew {
  constructor() {
    // 在 settingInitialized 事件触发后显示消息。如果时间较早，文本可能会被翻译成错误的语言
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.show()
    })

    window.addEventListener(EVT.list.showRecentUpdates, () => {
      this.showMsg()
    })
  }

  private version = browser.runtime.getManifest().version

  /** 版本升级后自动显示一次更新说明 */
  private show() {
    // 如果这个标记是初始值，说明用户是首次安装这个扩展，或者重置了设置，此时不显示更新说明
    // 这样做的目的：只有当用户是从以前的版本升级到新版本时，才会显示更新说明
    if (settings.whatIsNewFlag === Config.whatIsNewFlagDefault) {
      setSetting('whatIsNewFlag', this.version)
      return
    }

    if (settings.whatIsNewFlag === this.version || !Utils.isPixiv()) {
      return
    }

    this.showMsg()
    setSetting('whatIsNewFlag', this.version)
  }

  /** 使用消息框显示最近更新说明 */
  private showMsg() {
    const msg = `
      <span>${lang.transl('_扩展程序升到x版本', this.version)}</span>
      <br>
      <span>${lang.transl('_提示可以在release页面查看更新日志')}</span>
      <br>
      <br>
      <div>${lang.transl('_版本更新说明')}</div>
      <br>
      ${lang.transl('_赞助方式提示')}`
    msgBox.show(msg, {
      title: Config.appName + ` ${lang.transl('_最近更新')}`,
      btn: lang.transl('_我知道了'),
    })
  }
}

new ShowWhatIsNew()
