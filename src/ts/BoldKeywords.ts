import { EVT } from './EVT'
import { settings } from './setting/Settings'

class BoldKeywords {
  constructor(wrap: HTMLElement) {
    this.wrap = wrap
    this.bindEvent()
    this.setClassName()
  }

  private wrap: HTMLElement
  private readonly className = 'showBlobKeywords'

  private bindEvent() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'boldKeywords') {
        this.setClassName()
      }
    })
  }

  private setClassName() {
    this.wrap.classList[settings.boldKeywords ? 'add' : 'remove'](
      this.className
    )
  }
}

export { BoldKeywords }
