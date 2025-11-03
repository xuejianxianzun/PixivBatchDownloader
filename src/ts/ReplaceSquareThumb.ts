import { EVT } from './EVT'
import { pageType } from './PageType'
import { settings } from './setting/Settings'
import { Tools } from './Tools'

class ReplaceSquareThumb {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(
      EVT.list.settingInitialized,
      (ev: CustomEventInit) => {
        // 在 settingInitialized 时执行，此时所有设置都已经从本地存储中恢复
        // 之前是在 settingChange 事件里监听到 replaceSquareThumb 变化时执行
        // 但是本模块在排行榜页面里还需要判断 settings.showLargerThumbnails
        // 它的默认值是 false，但用户可能把它修改为 true
        // 之前执行时，showLargerThumbnails 还是内置的默认值 false，尚未恢复为用户储存的值，
        // 这导致一些图片被跳过处理，我一开始没有意识到是这个原因，浪费了一些时间才找到原因
        this.replaceAllImage()
        this.observer()
      }
    )
  }

  private replaceAllImage() {
    if (
      settings.replaceSquareThumb ||
      pageType.type == pageType.list.ArtworkRanking
    ) {
      const allImage = document.body.querySelectorAll('img')
      allImage.forEach((img) => this.replace(img))
    }
  }

  private get disable() {
    return window.location.pathname.startsWith('/group')
  }

  /**在排行榜页面进行特殊处理 */
  // 排行榜里的缩略图本来就是保持了比例的，不需要替换其缩略图。但是排行榜里的缩略图原本尺寸较小，当用户启用了“显示更大的缩略图”之后，缩略图被放大后显得模糊，此时需要替换成更大尺寸的缩略图。
  private get handleArtworkRanking() {
    return (
      pageType.type === pageType.list.ArtworkRanking &&
      settings.showLargerThumbnails
    )
  }

  private replace(img: HTMLImageElement) {
    if (!img.src || img.dataset.index || this.disable) {
      return
    }
    const src = img.src
    // 排除不需要替换的图片
    if (!src.endsWith('square1200.jpg') && !src.endsWith('custom1200.jpg')) {
      // 排行榜页面里的图片 URL 后缀不一样，需要特别处理
      if (this.handleArtworkRanking) {
        // 旧版排行榜页面的图片 URL 如下：
        // 'https://i.pximg.net/c/240x480/img-master/img/2022/08/01/17/59/39/100156836_p0_master1200.jpg'
        // 新版排行榜页面的图片 URL 如下，最大尺寸是 480 px：
        // https://i.pximg.net/c/480x960/img-master/img/2025/11/01/00/00/22/136937607_p0_master1200.jpg
        if (!src.includes('240x480') && !src.includes('480x960')) {
          return
        }
      } else {
        return
      }
    }

    // 替换 src
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
