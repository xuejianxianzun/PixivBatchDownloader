import { EVT } from './EVT'

class HiddenBrowserDownloadBar {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'hiddenBrowserDownloadBar') {
        chrome.runtime.sendMessage({
          msg: 'setShelfEnabled',
          value: !data.value,
        })
        // 如果这个设置为 true，则应该向后台传递 false
      }
    })
  }
}

new HiddenBrowserDownloadBar()
