import { Tools } from './Tools'

class ReplaceThumb {
  constructor() {
    const allImage = document.querySelectorAll('img')
    allImage.forEach((img) => this.replace(img))

    this.observer()
  }

  private replace(img: HTMLImageElement) {
    if (!img.src || img.dataset.index) {
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
new ReplaceThumb()
