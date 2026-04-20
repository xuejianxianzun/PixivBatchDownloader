import { EVT } from './EVT'
import { lang } from './Language'
import { msgBox } from './MsgBox'
import { setSetting, settings } from './setting/Settings'
import { Utils } from './utils/Utils'

class RequestSponsorship {
  constructor() {
    window.addEventListener(EVT.list.settingInitialized, async () => {
      // 赋予初始值
      if (settings.requestSponsorshipTime === 0) {
        setSetting('requestSponsorshipTime', Date.now() + this.interval)
      }

      await Utils.sleep(10000)
      this.check()
    })
  }

  // 30 * 24 * 60 * 60 * 1000
  private readonly interval = 2592000000

  private check() {
    const now = Date.now()
    if (now >= settings.requestSponsorshipTime) {
      msgBox.once('request sponsorship', lang.transl('_赞助方式提示'), 'show', {
        title: lang.transl('_赞助我'),
      })

      setSetting('requestSponsorshipTime', now + this.interval)
    }
  }
}

new RequestSponsorship()
