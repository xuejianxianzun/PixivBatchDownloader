import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { novelThumbnail } from '../NovelThumbnail'
import { Config } from '../Config'
import { lang } from '../Language'
import { ButtonsConfig, BtnConfig } from './ButtonsConfig'
import { Tools } from '../Tools'
import { toast } from '../Toast'

// 在小说作品的缩略图上显示一些按钮
// 目前它只管理在 PC 上生效的缩略图按钮
class ButtonsOnNovelThumbOnPC extends ButtonsConfig {
  constructor() {
    super()
    if (Config.mobile) {
      return
    }

    this.bindEvents()
    this.createAllBtn()
  }

  private currentId = '' // 保存触发事件的缩略图的作品 id
  private workEL?: HTMLElement // 保存触发事件的缩略图的作品元素

  private hiddenBtnTimer = 0 // 使用定时器让按钮延迟消失。这是为了解决一些情况下按钮闪烁的问题
  private delay = 100
  private doNotShowBtn = false // 当点击了按钮后，进入此状态，此状态中不会显示按钮
  // 此状态是为了解决这个问题：点击了按钮之后，按钮会被隐藏，隐藏之后，鼠标下方就是图片缩略图区域，这会触发缩略图的鼠标事件，导致按钮马上就又显示了出来。所以点击按钮之后设置这个状态，在其为 true 的期间不会显示按钮。过一段时间再把它复位。复位所需的时间很短，因为只要能覆盖这段时间就可以了：从隐藏按钮开始算起，到缩略图触发鼠标事件结束。

  private bindEvents() {
    novelThumbnail.onEnter((el: HTMLElement, id: string) => {
      this.currentId = id
      this.workEL = el
      this.showAllBtn()
    })

    novelThumbnail.onLeave(() => {
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

  private filterBtn() {
    // btnsConfig 里有些按钮不适合在小说缩略图上显示
    // 现在只需要显示下载按钮，所以需要过滤
    return this.btnsConfig.filter(
      (config) => config.name === 'downloadBtnOnThumb'
    )
  }

  private createAllBtn() {
    this.filterBtn().forEach((config) => {
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
        if (!this.currentId) {
          return
        }
        // 定义点击每个按钮时的具体逻辑。实际上现在只有下载按钮，所以直接调用下载逻辑
        this.clickBtn()
      })
    })
  }

  private createBtn(config: BtnConfig) {
    const btn = document.createElement('button')
    btn.id = config.name
    btn.classList.add('btnOnThumb')
    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#${config.icon}"></use>
</svg>`
    btn.dataset.xztitle = config.title
    lang.register(btn)
    document.body.appendChild(btn)

    return btn
  }

  private clickBtn() {
    // 点击下载按钮时，重新获取当前作品的 id 和类型，并触发抓取事件
    const idData = Tools.getNovelOrSeriesIDData(this.workEL)
    // 如果找不到小说 id，也找不到系列 id，则不下载
    if (!idData) {
      toast.error(lang.transl('_没有找到可下载的作品'))
      return
    }
    EVT.fire('crawlIdList', [idData])
  }

  private showAllBtn() {
    if (this.doNotShowBtn) {
      return
    }

    window.clearTimeout(this.hiddenBtnTimer)
    // 记录有几个按钮需要显示，用于设置按钮的位置（top 值）
    let order = 0
    const rect = this.workEL!.getBoundingClientRect()
    for (const config of this.filterBtn()) {
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
    const top = window.scrollY + rect.top + size * order
    btn.style.top = top + 'px'
    btn.style.display = 'flex'
  }

  private hiddenAllBtn() {
    this.filterBtn().forEach((config) => {
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

new ButtonsOnNovelThumbOnPC()
