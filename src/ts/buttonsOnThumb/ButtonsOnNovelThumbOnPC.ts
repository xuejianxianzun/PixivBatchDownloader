import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { novelThumbnail } from '../NovelThumbnail'
import { Config } from '../Config'
import { IDData } from '../store/StoreType'
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
    novelThumbnail.onEnter(
      (el: HTMLElement, id: string, ev: Event, isSeries: boolean) => {
        this.currentId = id
        this.workEL = el
        this.showAllBtn()
      }
    )

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
        // 定义点击每个按钮时的具体逻辑
        this.clickBtn(config)
      })
    })
  }

  private createBtn(config: BtnConfig) {
    const btn = document.createElement('button')
    btn.id = config.name
    btn.classList.add('btnOnThumb')
    btn.innerHTML = `<svg class="icon" aria-hidden="true"><use xlink:href="#${config.icon}"></use></svg>`
    btn.dataset.xztitle = config.title
    lang.register(btn)
    document.body.appendChild(btn)

    return btn
  }

  private async clickBtn(config: BtnConfig) {
    // 下载小说
    // 在点击之前，novelThumbnail 就已经获取了小说 id 或系列 id
    // 但是现在需要重新检查一次对应的 id 是否还存在于缩略图元素里
    // 这是因为有时页面元素会变化
    // 例如，在 pixiv 的小说首页的“追更列表中的作品”里，如果一篇小说属于某个系列，那么这里的元素一开始同时有最新一篇小说的链接和其系列链接的，novelThumbnail 会保存小说的 id
    // 但是之后 pixiv 会把这个元素（阅读最新话）替换成只有系列链接的元素（阅读后续），这时就不能使用之前保存的小说 id 了
    // 如果小说 id 不存在了，就改为获取系列 id
    const novelLink = this.workEL?.querySelector(
      `a[href*="/novel/show.php?id=${this.currentId}"]`
    )
    if (novelLink) {
      // 小说 id 仍然存在
      // 下载单篇小说
      const idData: IDData = {
        type: 'novels',
        id: this.currentId,
      }
      EVT.fire('crawlIdList', [idData])
      return
    } else {
      // 查找系列 id
      const seriesId = Tools.findSeriesIdFromElement(
        this.workEL as HTMLElement,
        'novels'
      )
      if (seriesId) {
        // 自动合并系列小说
        const idData: IDData = {
          type: 'novelSeries',
          id: seriesId,
        }
        EVT.fire('crawlIdList', [idData])
        return
      }
    }

    // 如果找不到小说 id，也找不到系列 id，则不下载
    toast.error(lang.transl('_没有找到可下载的作品'))
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
