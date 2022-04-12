import { EVT } from './EVT'
import { settings, setSetting } from './setting/Settings'
import { Tools } from './Tools'
import { findHorizontalImageWrap } from './FindHorizontalImageWrap'

// 如果一个作品的缩略图是横图，则把这个缩略图的容器的宽度设置为默认宽度的 2 倍
// 注意：必须开启“替换方形缩略图以显示图片比例”，“横图占用二倍宽度”的功能才能生效
class DoubleWidthThumb {
  constructor() {
    this.bindEvents()
  }

  private readonly addId = 'doubleWidth'
  /* 双倍宽度的图片的 id（由下载器添加这个 id） */
  private readonly styleId = 'doubleWidthStyle'
  private readonly css = `#doubleWidth {
    width: 30% !important;
  }`

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'doubleWidthThumb') {
        // 如果开启了父级设置“显示更大的缩略图”，以及这个设置，则必须开启“替换方形缩略图以显示图片比例”
        if (
          settings.showLargerThumbnails &&
          settings.doubleWidthThumb &&
          !settings.replaceSquareThumb
        ) {
          setSetting('replaceSquareThumb', true)
        }

        this.setCss()
      }

      if (data.name === 'showLargerThumbnails') {
        this.setCss()
      }

      // 如果关闭了“替换方形缩略图以显示图片比例”，则需要关闭这个设置，因为这个设置无法生效
      if (data.name === 'replaceSquareThumb') {
        if (!settings.replaceSquareThumb && settings.doubleWidthThumb) {
          setSetting('doubleWidthThumb', false)
        }
      }
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.setCss()
    })

    // 如果一个缩略图是横图，则在它的容器上添加特定 id
    findHorizontalImageWrap.onFind((wrap: HTMLElement) => {
      if (!wrap.id) {
        wrap.id = this.addId
      }
    })
  }

  private setCss() {
    if (Tools.notEnabledShowLargerThumb()) {
      return this.removeStyle()
    }

    if (
      settings.replaceSquareThumb &&
      settings.showLargerThumbnails &&
      settings.doubleWidthThumb
    ) {
      this.addStyle()
    } else {
      this.removeStyle()
    }
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

new DoubleWidthThumb()
