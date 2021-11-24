import { lang } from './Lang'
import { Config } from './config/Config'
import { msgBox } from './MsgBox'
import { EVT } from './EVT'
import { settings, setSetting } from './setting/Settings'

class ShowHowToUse {
  constructor() {
    this.bindEvents()
  }

  private checked = false

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      if (!this.checked) {
        this.checked = true
        this.check()
      }
    })
  }

  private check() {
    if (settings.showHowToUse) {
      this.show()
      setSetting('showHowToUse', false)
    }
  }

  private show() {
    msgBox.show(lang.transl('_HowToUse'), {
      title: Config.appName,
      btn: lang.transl('_我知道了'),
    })
  }
}

new ShowHowToUse()
