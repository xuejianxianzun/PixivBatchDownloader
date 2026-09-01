import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { artworkThumbnail } from '../ArtworkThumbnail'
import { IDData } from '../store/StoreType'
import { Tools } from '../Tools'
import { Config } from '../Config'
import { displayThumbnailListOnMultiImageWorkPage } from '../pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'
import { novelThumbnail } from '../NovelThumbnail'
import { lang } from '../Language'
import { toast } from '../Toast'

// 在图片作品的缩略图上显示下载按钮，点击按钮会直接下载这个作品
// 这个模块只在移动端页面上运行
class DownloadBtnOnThumbOnMobile {
  constructor() {
    if (!Config.mobile) {
      return
    }
    // 在移动端，由于没有 mouseover 事件，
    // 所以只能每个作品缩略图分别添加一个下载按钮
    this.bindEvents()
  }

  private readonly btnId = 'downloadBtnOnThumb'
  private readonly size = 32
  private styleElement?: HTMLStyleElement

  private bindEvents() {
    artworkThumbnail.onFound((el: HTMLElement, id: string | '') => {
      if (!settings.showDownloadBtnOnThumb) {
        return
      }

      const btn = this.addBtn(el)
      btn.addEventListener('click', (ev) => {
        // 阻止事件冒泡和默认行为，避免点击按钮时触发缩略图的点击事件，导致跳转到作品详情页
        ev.stopPropagation()
        ev.preventDefault()
        EVT.fire('clickBtnOnThumb')

        // 在移动端的某些页面里，一开始可能获取不到作品 id，或者是错误的 '0'，所以在点击按钮时再尝试获取 id
        // 例如大家的新作品页面：
        // https://www.pixiv.net/new_illust.php
        if (!id || id === '0') {
          id = Tools.findWorkIdFromElement(el, 'illusts')
        }
        if (!id) {
          return
        }

        const IDData: IDData = {
          type: 'illusts',
          id: id,
        }

        // 在多图作品的缩略图列表上触发时，获取 data-index 属性的值，只下载这一张图片
        if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
          const _index = Number.parseInt(el.dataset!.index!)
          IDData.downloadIndexes = [_index]
        }

        EVT.fire('crawlIdList', [IDData])
      })
    })

    novelThumbnail.onFound((el: HTMLElement, id: string | '') => {
      if (!settings.showDownloadBtnOnThumb) {
        return
      }

      const btn = this.addBtn(el)
      btn.addEventListener('click', (ev) => {
        // 阻止事件冒泡和默认行为，避免点击按钮时触发缩略图的点击事件，导致跳转到作品详情页
        ev.stopPropagation()
        ev.preventDefault()
        EVT.fire('clickBtnOnThumb')
        this.clickNovelBtn(el)
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
    btn.id = this.btnId
    btn.classList.add('btnOnThumb')
    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#download"></use>
</svg>`

    btn.style.left = 'auto'
    btn.style.right = '0px'
    btn.style.top = '0px'
    btn.style.display = 'flex'

    target.appendChild(btn)
    return btn
  }

  private clickNovelBtn(el: HTMLElement) {
    // 点击小说上的下载按钮时，重新获取当前作品的 id 和类型，并触发抓取事件
    const idData = Tools.getNovelOrSeriesIDData(el)
    // 如果找不到小说 id，也找不到系列 id，则不下载
    if (!idData) {
      toast.error(lang.transl('_没有找到可下载的作品'))
      return
    }
    EVT.fire('crawlIdList', [idData])
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
    const btns = document.body.querySelectorAll(`#${this.btnId}`)
    for (const btn of btns) {
      ;(btn as HTMLButtonElement).style.display = value ? 'flex' : 'none'
    }
  }
}

new DownloadBtnOnThumbOnMobile()
