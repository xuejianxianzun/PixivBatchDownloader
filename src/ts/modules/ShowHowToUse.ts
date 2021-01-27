import { lang } from './Lang'
import { EVT } from './EVT'
import Config from './Config'

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
    EVT.sendMsg({
      title: Config.name,
      msg: lang.transl('_HowToUse'),
      btn: lang.transl('_我知道了'),
    })

    window.localStorage.setItem(this.flag, '1')
  }
}

new ShowHowToUse()
