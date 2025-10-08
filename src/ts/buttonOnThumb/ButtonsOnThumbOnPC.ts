import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { artworkThumbnail } from '../ArtworkThumbnail'
import { Config } from '../Config'
import { ImageViewer } from '../ImageViewer'
import { IDData } from '../store/StoreType'
import { store } from '../store/Store'
import { copyWorkInfo } from '../CopyWorkInfo'

type BtnConfig = {
  id: 'zoomBtnOnThumb' | 'downloadBtnOnThumb' | 'copyBtnOnThumb'
  order: number
  icon: string
  btn: HTMLButtonElement
  show: () => boolean
}
type BtnList = BtnConfig[]

// 在图片作品的缩略图上显示一些按钮
// 目前它只管理在 PC 上生效的缩略图按钮
class ButtonsOnThumbOnPC {
  constructor() {
    if (Config.mobile) {
      return
    }

    this.bindEvents()
    this.createAllBtn()
  }

  private readonly list: BtnList = [
    {
      id: 'zoomBtnOnThumb',
      order: 1,
      icon: 'icon-zoom',
      btn: document.createElement('button'),
      show: () => settings.magnifier,
    },
    {
      id: 'downloadBtnOnThumb',
      order: 2,
      icon: 'icon-download',
      btn: document.createElement('button'),
      show: () => settings.showDownloadBtnOnThumb,
    },
    {
      id: 'copyBtnOnThumb',
      order: 3,
      icon: 'icon-copy',
      btn: document.createElement('button'),
      show: () => settings.showCopyBtnOnThumb,
    },
  ]

  private readonly btnSize = 32
  private readonly margin = 8

  private currentWorkId = '' // 保存触发事件的缩略图的作品 id
  private workEL?: HTMLElement // 保存触发事件的缩略图的作品元素

  private hiddenBtnTimer = 0 // 使用定时器让按钮延迟消失。这是为了解决一些情况下按钮闪烁的问题
  private delay = 100
  private doNotShowBtn = false // 当点击了按钮后，进入此状态，此状态中不会显示按钮
  // 此状态是为了解决这个问题：点击了按钮之后，按钮会被隐藏，隐藏之后，鼠标下方就是图片缩略图区域，这会触发缩略图的鼠标事件，导致按钮马上就又显示了出来。所以点击按钮之后设置这个状态，在其为 true 的期间不会显示按钮。过一段时间再把它复位。复位所需的时间很短，因为只要能覆盖这段时间就可以了：从隐藏按钮开始算起，到缩略图触发鼠标事件结束。

  private bindEvents() {
    artworkThumbnail.onEnter((el: HTMLElement, id: string) => {
      this.currentWorkId = id
      this.workEL = el
      this.showAllBtn()
    })

    artworkThumbnail.onLeave(() => {
      this.hiddenBtnDelay()
    })

    // 页面切换时，隐藏所有按钮
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.hiddenBtnDelay()
    })

    // 开始抓取时，隐藏所有按钮
    window.addEventListener(EVT.list.crawlStart, () => {
      this.hiddenBtnDelay()
    })
  }

  private createAllBtn() {
    this.list.forEach((config) => {
      config.btn = this.createBtn(config)

      // 鼠标移入按钮时取消隐藏按钮
      config.btn.addEventListener('mouseenter', (ev) => {
        window.clearTimeout(this.hiddenBtnTimer)
      })

      // 鼠标移出按钮时，隐藏所有按钮
      config.btn.addEventListener('mouseleave', () => {
        this.hiddenBtnDelay()
      })

      // 点击按钮时
      config.btn.addEventListener('click', (ev) => {
        this.hiddenBtnNow()
        EVT.fire('clickBtnOnThumb')
        if (!this.currentWorkId) {
          return
        }
        // 定义点击每个按钮时的具体逻辑
        this.clickBtn(config)
      })
    })
  }

  private createBtn(config: BtnConfig) {
    const btn = document.createElement('button')
    btn.id = config.id
    btn.classList.add('btnOnThumb')
    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#${config.icon}"></use>
</svg>`
    document.body.appendChild(btn)
    return btn
  }

  private clickBtn(config: BtnConfig) {
    if (config.id === 'zoomBtnOnThumb') {
      const viewer = new ImageViewer({
        workId: this.currentWorkId,
        imageNumber: 1,
        imageSize: settings.magnifierSize,
        autoStart: true,
        showLoading: true,
      })
      viewer.init()
    } else if (config.id === 'downloadBtnOnThumb') {
      const IDData: IDData = {
        type: 'illusts',
        id: this.currentWorkId,
      }

      // 在多图作品的缩略图列表上触发时，获取 data-index 属性的值，只下载这一张图片
      if (Config.checkImageViewerLI(this.workEL)) {
        const index = Number.parseInt(this.workEL!.dataset!.index!)
        store.setDownloadOnlyPart(Number.parseInt(this.currentWorkId), [index])
      }

      EVT.fire('crawlIdList', [IDData])
    } else if (config.id === 'copyBtnOnThumb') {
      const idData: IDData = {
        type: 'illusts',
        id: this.currentWorkId,
      }
      copyWorkInfo.receive(idData)
    }
  }

  private showAllBtn() {
    if (this.doNotShowBtn) {
      return
    }

    window.clearTimeout(this.hiddenBtnTimer)
    // 记录有几个按钮需要显示，用于设置按钮的位置（top 值）
    let order = 0
    const rect = this.workEL!.getBoundingClientRect()
    const imageViewerLI = Config.checkImageViewerLI(this.workEL)

    for (const config of this.list) {
      // 在多图作品页面里的缩略图列表上触发时，只显示下载按钮，不显示其他按钮
      if (imageViewerLI && config.id !== 'downloadBtnOnThumb') {
        continue
      }

      if (config.show()) {
        this.showBtn(config.btn, rect, order)
        order++
      }
    }
  }

  private showBtn(btn: HTMLButtonElement, rect: DOMRect, order: number) {
    btn.style.left =
      window.scrollX +
      rect.left +
      (settings.magnifierPosition === 'left' ? 0 : rect.width - this.btnSize) +
      'px'

    const size = this.btnSize + this.margin
    const top = window.scrollY + rect.top + order * size
    btn.style.top = top + 'px'
    btn.style.display = 'flex'
  }

  private hiddenAllBtn() {
    this.list.forEach((config) => {
      config.btn.style.display = 'none'
    })
  }

  // 延迟隐藏按钮
  private hiddenBtnDelay() {
    window.clearTimeout(this.hiddenBtnTimer)
    this.hiddenBtnTimer = window.setTimeout(() => {
      this.hiddenAllBtn()
    }, this.delay)
  }

  // 立刻隐藏按钮
  private hiddenBtnNow() {
    this.doNotShowBtn = true
    window.setTimeout(() => {
      this.doNotShowBtn = false
    }, 100)

    window.clearTimeout(this.hiddenBtnTimer)
    this.hiddenAllBtn()
  }
}

new ButtonsOnThumbOnPC()
