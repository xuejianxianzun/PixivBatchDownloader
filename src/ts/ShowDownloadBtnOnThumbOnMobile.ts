import { EVT } from './EVT'
import { settings } from './setting/Settings'
import { artworkThumbnail } from './ArtworkThumbnail'
import { states } from './store/States'
import { toast } from './Toast'
import { lang } from './Lang'
import { IDData } from './store/StoreType'
import { Colors } from './Colors'
import { Tools } from './Tools'

// 在图片作品的缩略图上显示下载按钮，点击按钮会直接下载这个作品
class ShowDownloadBtnOnThumbOnMobile {
  constructor() {
    // 在移动端，由于没有 mouseover 事件，
    // 所以只能每个作品缩略图分别添加一个下载按钮
    this.bindEvents()
  }

  private readonly className = 'downloadBtnOnThumb'
  private readonly size = 32
  private styleElement?: HTMLStyleElement

  private bindEvents() {
    artworkThumbnail.onFound((el: HTMLElement, id: string | '') => {
      if (!settings.showDownloadBtnOnThumb) {
        return
      }

      const btn = this.addBtn(el)
      btn.addEventListener('click', (ev) => {
        if (!id) {
          id = Tools.findWorkIdFromElement(el, 'illusts')
        }
        if (!id) {
          return
        }
        const IDData: IDData = {
          type: 'illusts',
          id: id,
        }
        EVT.fire('crawlIdList', [IDData])
      })
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data
      if (data.name === 'showDownloadBtnOnThumb') {
        this.toggleShowBtns(data.value)
        this.setPageCountStyle(data.value)
      }
    })
  }

  private addBtn(target: HTMLElement) {
    const btn = document.createElement('button')
    btn.classList.add(this.className)
    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-download"></use>
</svg>`

    btn.style.left = 'auto'
    btn.style.right = '0px'
    btn.style.top = '0px'
    btn.style.display = 'flex'

    target.appendChild(btn)
    return btn
  }

  private setPageCountStyle(value: boolean) {
    // 显示按钮时，让缩略图的页数文字下移到按钮下面，否则页数会被按钮遮挡
    if (value && !this.styleElement) {
      this.styleElement = document.createElement('style')
      this.styleElement.innerText = `.status-page-count-container {margin-top: ${this.size}px;}`
      document.body.append(this.styleElement)
    }

    if (!value && this.styleElement) {
      this.styleElement.remove()
      this.styleElement = undefined
    }
  }

  private toggleShowBtns(value: boolean) {
    const btns = document.body.querySelectorAll(`.${this.className}`)
    for (const btn of btns) {
      ;(btn as HTMLButtonElement).style.display = value ? 'flex' : 'none'
    }
  }
}

export { ShowDownloadBtnOnThumbOnMobile }
