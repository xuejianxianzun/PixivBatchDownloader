import { EVT } from './EVT'
import { pageType } from './PageType'
import { settings } from './setting/Settings'
import { Tools } from './Tools'

class ReplaceSquareThumb {
  constructor() {
    this.bindEvents()

    this.observer()
  }

  private isDisable() {
    return window.location.pathname.startsWith('/group')
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'replaceSquareThumb') {
        if (data.value) {
          this.replaceAllImage()
        }
      }
    })
  }

  private replaceAllImage() {
    if (
      settings.replaceSquareThumb ||
      pageType.type == pageType.list.ArtworkRanking
    ) {
      const allImage = document.querySelectorAll('img')
      allImage.forEach((img) => this.replace(img))
    }
  }

  private replace(img: HTMLImageElement) {
    if (!img.src || img.dataset.index || this.isDisable()) {
      return
    }
    const src = img.src
    if (!src.endsWith('square1200.jpg') && !src.endsWith('custom1200.jpg')) {
      if (
        pageType.type === pageType.list.ArtworkRanking &&
        settings.showLargerThumbnails
      ) {
        // 排行榜里的缩略图本来就是保持了比例的，不需要替换其缩略图。
        // 但是排行榜里的缩略图原本尺寸较小，当用户启用了“显示更大的缩略图”之后，缩略图被放大后显得模糊，此时需要替换成更大尺寸的缩略图。
        // 排行榜页面的图片 URL 比较特别，末尾是 master1200，如下：
        // 'https://i.pximg.net/c/240x480/img-master/img/2022/08/01/17/59/39/100156836_p0_master1200.jpg'
        if (!src.includes('240x480')) {
          return
        }
      } else {
        return
      }
    }
    img.src = Tools.convertThumbURLTo540px(src)
    img.style.objectFit = 'contain'
  }

  private observer() {
    const observer = new MutationObserver((records) => {
      if (!settings.replaceSquareThumb) {
        if (pageType.type !== pageType.list.ArtworkRanking) {
          // 在排行榜页面里，即使用户未启用“替换方形缩略图以显示图片比例”功能，也依然执行替换缩略图的动作
          return
        }
      }
      records.forEach((record) => {
        if (record.type === 'childList') {
          record.addedNodes.forEach((node) => {
            if (node.nodeName === 'IMG') {
              this.replace(node as HTMLImageElement)
            }
          })
        }

        if (record.type === 'attributes') {
          if (
            record.attributeName === 'src' &&
            record.target.nodeName === 'IMG'
          ) {
            this.replace(record.target as HTMLImageElement)
          }
        }
      })
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributeFilter: ['src'],
    })
  }
}

new ReplaceSquareThumb()
