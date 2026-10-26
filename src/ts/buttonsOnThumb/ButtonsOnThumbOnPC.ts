import { EVT } from '../EVT'
import { Config } from '../Config'
import { settings } from '../setting/Settings'
import { lang } from '../Language'
import { toast } from '../Toast'
import { cacheWorkData } from '../store/CacheWorkData'
import { addBookmarkFromWorkThumb } from '../AddBookmarkFromWorkThumb'
import { downloadOnClickBookmark } from '../download/DownloadOnClickBookmark'
import { WorkThumbnail } from '../WorkThumbnail'
import { ButtonsOnThumbConfig, BtnConfig } from './ButtonsOnThumbConfig'

// 在作品缩略图上显示按钮的模块的基类
// 它负责按钮的创建、显示、隐藏、收藏等通用逻辑，目前只在 PC 上生效
// 子类只需要提供：缩略图模块、要使用的按钮列表、指定按钮是否显示、点击按钮时的行为
//
// 注意：基类的构造函数会调用 bindEvents() 和 createAllBtn()，
// 所以子类不能在类字段里存放它们需要的数据（子类的字段初始化在 super() 之后才执行）。
// 子类需要的数据请写在方法里（方法在原型上，构造期间就可以访问）。
abstract class ButtonsOnThumbOnPC extends ButtonsOnThumbConfig {
  constructor() {
    super()
    if (Config.mobile) {
      return
    }

    this.bindEvents()
    this.createAllBtn()
  }

  /** 当前缩略图的作品 id */
  protected currentId = ''
  /** 当前缩略图的作品元素 */
  protected workEL?: HTMLElement

  private hiddenBtnTimer = 0 // 使用定时器让按钮延迟消失。这是为了解决一些情况下按钮闪烁的问题
  private delay = 100

  /** 缩略图模块，用于订阅鼠标进入、移出缩略图的事件 */
  protected abstract getThumbnail(): WorkThumbnail

  /** 点击按钮时的具体行为 */
  protected abstract clickBtn(config: BtnConfig): void

  /** 要使用的按钮列表。默认使用全部按钮，子类可以过滤 */
  protected getBtnList(): BtnConfig[] {
    return this.btnsConfig
  }

  /** 判断一个按钮在这次显示时是否要显示。默认全部显示，子类可以按条件跳过 */
  protected shouldShowBtn(config: BtnConfig, el: HTMLElement): boolean {
    return true
  }

  private bindEvents() {
    const thumbnail = this.getThumbnail()

    thumbnail.onEnter((el: HTMLElement, id: string) => {
      this.currentId = id
      this.workEL = el
      this.showAllBtn()
    })

    thumbnail.onLeave(() => {
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
    this.getBtnList().forEach((config) => {
      config.btn = this.createBtn(config)

      // 鼠标移入按钮时取消隐藏按钮
      config.btn.addEventListener('mouseenter', () => {
        window.clearTimeout(this.hiddenBtnTimer)
      })

      // 鼠标移出按钮时，隐藏所有按钮
      config.btn.addEventListener('mouseleave', () => {
        this.hiddenBtnDelay()
      })

      // 点击按钮时
      config.btn.addEventListener('click', () => {
        // 点击按钮后不隐藏按钮，这样用户可以连续点击多个按钮
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
    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#${config.icon}"></use>
</svg>`
    btn.dataset.xztitle = config.title
    lang.register(btn)
    document.body.appendChild(btn)

    return btn
  }

  /** 收藏缩略图对应的作品 */
  protected async bookmarkWork() {
    const workId = this.workEL?.dataset.workid
    const workType = this.workEL?.dataset.worktype
    // 系列小说不是单个作品，不能收藏
    if (!workId || !workType || workType === 'novelSeries') {
      return
    }

    const isNovel = workType === 'novels'

    try {
      const workData = await cacheWorkData.getWorkDataAsync(
        workId,
        isNovel ? 'novel' : 'artwork'
      )
      await addBookmarkFromWorkThumb.add(workData, this.workEL, () => {
        // 用户确认收藏之后（没有启用收藏面板时就是点击按钮时）下载这个作品。
        // 这个回调在发送收藏请求之前执行，所以不会被收藏请求拖慢
        downloadOnClickBookmark.send(workId, isNovel ? 'novels' : 'illusts')
      })
    } catch {
      // 获取作品数据失败时，无法收藏这个作品
      toast.error(lang.transl('_添加收藏失败'))
    }
  }

  private showAllBtn() {
    window.clearTimeout(this.hiddenBtnTimer)
    const el = this.workEL!
    const rect = el.getBoundingClientRect()
    // 记录有几个按钮需要显示，用于设置按钮的位置（top 值）
    let order = 0

    for (const config of this.getBtnList()) {
      if (!this.shouldShowBtn(config, el)) {
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
    const top = window.scrollY + rect.top + size * order
    btn.style.top = top + 'px'
    btn.style.display = 'flex'
  }

  private hiddenAllBtn() {
    this.getBtnList().forEach((config) => {
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
}

export { ButtonsOnThumbOnPC }
