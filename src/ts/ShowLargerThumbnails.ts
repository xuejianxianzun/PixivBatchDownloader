import { EVT } from './EVT'
import { settings } from './setting/Settings'
import { Tools } from './Tools'

class ShowLargerThumbnails {
  constructor() {
    this.loadCssText()
    this.bindEvents()
  }

  // css 内容来自 style/showLargerThumbnails.css
  private css = ''
  private readonly styleId = 'ShowLargerThumbnails'

  private async loadCssText() {
    const css = await fetch(
      chrome.runtime.getURL('style/showLargerThumbnails.css')
    )
    this.css = await css.text()
    this.setCss()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'showLargerThumbnails') {
        this.setCss()
      }
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.setCss()
    })
  }

  private setCss() {
    if (!this.css) {
      return
    }

    if (Tools.notEnabledShowLargerThumb()) {
      return this.removeStyle()
    }
    settings.showLargerThumbnails ? this.addStyle() : this.removeStyle()
  }

  private addStyle() {
    if (document.querySelector('#' + this.styleId)) {
      return
    }

    const el = document.createElement('style')
    el.id = this.styleId
    el.innerHTML = this.css
    document.body.append(el)
  }

  private removeStyle() {
    const el = document.querySelector('#' + this.styleId)
    el && el.remove()
  }
}

new ShowLargerThumbnails()
