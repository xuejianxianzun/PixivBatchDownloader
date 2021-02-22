import { lang } from './Lang'
import Config from './config/Config'
import { msgBox } from './MsgBox'

class ShowHowToUse {
  constructor() {
    this.check()
  }

  private readonly flag = 'xzHowToUse'

  private check() {
    const query = window.localStorage.getItem(this.flag)
    if (!query) {
      this.show()
    }
  }

  private show() {
    msgBox.show(lang.transl('_HowToUse'), {
      title: Config.name,
      btn: lang.transl('_我知道了'),
    })

    window.localStorage.setItem(this.flag, '1')
  }
}

new ShowHowToUse()
