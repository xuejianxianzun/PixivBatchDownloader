import { EVT } from './EVT'
import { pageType } from './PageType'
import { settings } from './setting/Settings'
import { Tools } from './Tools'

class ShowLargerThumbnails {
  constructor() {
    this.loadCssText()
    this.bindEvents()
    this.findFriendsWrapEl()
  }

  // css 内容来自 style/showLargerThumbnails.css
  private css = ''
  private readonly styleId = 'ShowLargerThumbnails'

  private findFriendsWrap = false

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
      this.findFriendsWrap = false
    })

    window.setInterval(() => {
      this.findFriendsWrapEl()
    }, 1000)
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

  // 在首页查找“关注用户・好P友的作品”列表容器，为其添加自定义的 className
  private findFriendsWrapEl() {
    if (this.findFriendsWrap || pageType.type !== pageType.list.Home) {
      return
    }

    const query = document.evaluate(
      `//*[@id="root"]/div[2]/div[2]/div[4]/div/section/div[2]/div`,
      document,
      null,
      XPathResult.ANY_TYPE,
      null
    )
    const el = query.iterateNext() as HTMLDivElement
    if (el && el.childElementCount === 2) {
      el.classList.add('homeFriendsNewWorks')
      this.findFriendsWrap = true
    }
  }
}

new ShowLargerThumbnails()
