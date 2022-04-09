import { EVT } from './EVT'
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
    if (settings.replaceSquareThumb) {
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
      return
    }
    img.src = Tools.convertThumbURLTo540px(src)
    img.style.objectFit = 'contain'
  }

  private observer() {
    const observer = new MutationObserver((records) => {
      if (!settings.replaceSquareThumb) {
        return
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
