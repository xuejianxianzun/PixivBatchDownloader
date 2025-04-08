import { Config } from './Config'
import { EVT } from './EVT'
import { pageType } from './PageType'
import { settings } from './setting/Settings'
import { Tools } from './Tools'

class ShowLargerThumbnails {
  constructor() {
    if (Config.mobile) {
      return
    }

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

  // 在首页一些特定容器，为其添加自定义的 className
  private findFriendsWrapEl() {
    if (this.findFriendsWrap || pageType.type !== pageType.list.Home) {
      return
    }

    const sectionList = document.querySelectorAll('section')
    if (sectionList.length === 0) {
      return
    }

    if (sectionList[1]) {
      // 查找 精选新作 和 已关注用户的作品 的 section 父元素
      if (sectionList[1].querySelector('ul div')) {
        sectionList[1].classList.add('homeFriendsNewWorks')
        this.findFriendsWrap = true
      }
    }

    // 在新版首页里，额外查找 推荐作品
    if (
      sectionList[2] &&
      ['/', '/en/', '/illustration'].includes(window.location.pathname)
    ) {
      const allLi = sectionList[2].querySelectorAll('ul li')
      if (allLi.length > 1) {
        sectionList[2].classList.add('homeRecommendedWorks')

        // 并且需要查找里面的小说作品，然后找到其 li 元素。
        // 这样可以给小说的 li 添加 width:100%，否则小说的宽度就是原本的样子，和大图片的视觉效果不一致
        allLi.forEach((li) => {
          if (li.querySelector('a[href^="/novel"]')) {
            li.classList.add('novelLI')
          }
        })

        // 推荐作品里，最前面两个 li 元素可能是空的，也可能有个含有 iframe 的元素。
        // 当下载器把 ul 设置为 display: flex; 之后，需要移除这些元素，否则它们会占据一些宽度
        allLi.forEach((li) => {
          if (li.childElementCount === 0) {
            li.remove()
          }
          const iframe = li.querySelector('iframe')
          if (iframe) {
            iframe.remove()
          }
        })
      }
    }
  }
}

new ShowLargerThumbnails()
