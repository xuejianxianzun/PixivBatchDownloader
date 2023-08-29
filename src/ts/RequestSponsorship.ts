import { EVT } from './EVT'
import { lang } from './Lang'
import { msgBox } from './MsgBox'
import { setSetting, settings } from './setting/Settings'

class RequestSponsorship {
  constructor() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      // 赋予初始值
      if (settings.requestSponsorshipTime === 0) {
        setSetting(
          'requestSponsorshipTime',
          new Date().getTime() + this.interval
        )
      }

      window.setTimeout(() => {
        this.check()
      }, 10000)
    })
  }

  // 30 * 24 * 60 * 60 * 1000
  private readonly interval = 2592000000

  private check() {
    const now = new Date().getTime()
    if (now >= settings.requestSponsorshipTime) {
      msgBox.once('request sponsorship', lang.transl('_赞助方式提示'), 'show', {
        title: lang.transl('_赞助我'),
      })

      setSetting('requestSponsorshipTime', now + this.interval)
    }
  }
}

new RequestSponsorship()
