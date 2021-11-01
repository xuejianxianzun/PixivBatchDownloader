import { API } from './API'
import { ArtworkData } from './crawl/CrawlResult'
import { EVT } from './EVT'
import { mouseOverThumbnail } from './MouseOverThumbnail'
import { settings, setSetting } from './setting/Settings'
import { states } from './store/States'
import { showOriginSizeImage } from './ShowOriginSizeImage'

// 鼠标经过作品的缩略图时，显示更大尺寸的缩略图
class PreviewWork {
  constructor() {
    this.createElements()
    this.bindEvents()
  }

  private readonly defaultSize = 1200
  // 预览作品的容器的元素
  private wrapId = 'bigThumbWrap'
  private wrap!: HTMLElement
  private img!: HTMLImageElement
  private readonly border = 8 // wrap 的 border 占据的空间

  // 保存当前鼠标经过的缩略图的数据
  private workId = ''
  private workData?: ArtworkData
  private workEL?: HTMLElement

  // 显示预览区域的延迟时间
  // 鼠标进入缩略图时，本模块会立即请求作品数据，但在请求完成后不会立即加载图片
  // 如果鼠标在缩略图上停留达到 delay 的时间，才会加载 regular 尺寸的图片
  // 这是因为要加载的图片体积比较大，regular 规格的图片的体积可能达到 800KB，如果立即加载的话会浪费网络资源
  private readonly showDelay = 300
  private showTimer = 0

  // 鼠标离开缩略图之后，经过指定的时间才会隐藏 wrap
  // 如果在这个时间内又进入缩略图，或者进入 wrap，则取消隐藏定时器，继续显示 wrap
  // 如果不使用延迟隐藏，而是立即隐藏的话，用户就不能滚动页面来查看完整的 wrap
  private readonly hiddenDelay = 50
  private hiddenTimer = 0

  // 预览 wrap 的状态
  private _show = false

  private get show() {
    return this._show
  }

  private set show(val: boolean) {
    if (val) {
      // 如果保存的作品数据不是最后一个鼠标经过的作品，可能是请求尚未完成，此时延长等待时间
      if (!this.workData || this.workData.body.id !== this.workId) {
        this.readyShow()
      } else {
        this._show = val
        this.showWrap()
      }
    } else {
      window.clearTimeout(this.showTimer)
      this._show = val
      this.wrap.style.display = 'none'
      // 隐藏 wrap 时，把 img 的 src 设置为空
      // 这样如果图片没有加载完就会停止加载，避免浪费网络资源
      this.img.src = ''
    }
  }

  private createElements() {
    this.wrap = document.createElement('div')
    this.wrap.id = this.wrapId
    this.img = document.createElement('img')
    this.wrap.appendChild(this.img)
    document.body.appendChild(this.wrap)
  }

  private bindEvents() {
    mouseOverThumbnail.onEnter((el: HTMLElement, id: string) => {
      window.clearTimeout(this.hiddenTimer)

      if (!settings.PreviewWork) {
        return
      }

      this.workId = id
      this.getWorkData()
      this.workEL = el
      // 一定时间后，显示容器，加载大图
      this.readyShow()

      showOriginSizeImage.enterEl(el)
    })

    mouseOverThumbnail.onLeave((el: HTMLElement) => {
      if (this.show) {
        settings.PreviewWorkMouseStay ? this.readyHidden() : (this.show = false)

        showOriginSizeImage.leaveEl(el)
      } else {
        this.show = false
      }
    })

    this.wrap.addEventListener('mouseenter', () => {
      // 允许鼠标停留在预览图上的情况
      if (settings.PreviewWorkMouseStay && !states.selectWork) {
        window.clearTimeout(this.hiddenTimer)
      }
    })

    this.wrap.addEventListener('mouseleave', () => {
      this.show = false
    })

    this.wrap.addEventListener('click', () => {
      this.show = false
    })

    // 可以使用 Alt + P 快捷键来启用/禁用此功能
    window.addEventListener('keydown', (ev) => {
      if (ev.altKey && ev.code === 'KeyP') {
        setSetting('PreviewWork', !settings.PreviewWork)
      }
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.show = false
    })

    window.addEventListener(EVT.list.centerPanelOpened, () => {
      this.show = false
    })

    window.addEventListener(EVT.list.showOriginSizeImage, () => {
      this.show = false
    })
  }

  private async getWorkData() {
    const data = await API.getArtworkData(this.workId)
    if (data.body.id === this.workId) {
      this.workData = data
      showOriginSizeImage.setWorkData(this.workData)
    }
  }

  private readyShow() {
    this.showTimer = window.setTimeout(() => {
      this.show = true
    }, this.showDelay)
  }

  private readyHidden() {
    window.clearTimeout(this.showTimer)
    this.hiddenTimer = window.setTimeout(() => {
      this.show = false
    }, this.hiddenDelay)
  }

  // 显示预览 wrap
  private showWrap() {
    if (!settings.PreviewWork || !this.workEL || !this.workData) {
      return
    }

    const cfg = {
      width: this.defaultSize,
      height: this.defaultSize,
      left: 0,
      top: 0,
    }

    // 1. 设置宽高
    const w = this.workData.body.width
    const h = this.workData.body.height

    const rect = this.workEL.getBoundingClientRect()

    const innerWidth = window.innerWidth - 17
    const leftSpace = rect.left
    const rightSpace = innerWidth - rect.right
    const xSpace = Math.max(leftSpace, rightSpace)

    const scrollBarHeight =
      window.innerHeight - document.documentElement.clientHeight
    const innerHeight = window.innerHeight - scrollBarHeight

    // 宽高从图片宽高、wrap 宽高、可视区域的宽高中，取最小值，使图片不会超出可视区域外
    // 竖图
    if (w < h) {
      cfg.height = Math.min(this.defaultSize, innerHeight, h)
      cfg.width = (cfg.height / h) * w
    } else if (w > h) {
      // 横图
      cfg.width = Math.min(this.defaultSize, xSpace, w)
      cfg.height = (cfg.width / w) * h
    } else {
      // 正方形图片
      cfg.height = Math.min(this.defaultSize, innerHeight, xSpace, h)
      cfg.width = Math.min(this.defaultSize, w, innerHeight)
    }

    // 如果 wrap 宽度超过了可视窗口宽度，则需要再次调整宽高
    if (cfg.width > xSpace) {
      cfg.height = (xSpace / cfg.width) * cfg.height
      cfg.width = xSpace
    }

    // 如果 wrap 高度超过了可视窗口高度，则需要再次调整宽高
    if (cfg.height > innerHeight) {
      cfg.width = (innerHeight / cfg.height) * cfg.width
      cfg.height = innerHeight
    }

    // 减去 border 的空间
    cfg.height = cfg.height - this.border
    cfg.width = cfg.width - this.border

    // 2. 计算位置
    // 在页面可视区域内，比较缩略图左侧和右侧空间，把 wrap 显示在空间比较大的那一侧
    if (leftSpace >= rightSpace) {
      cfg.left = rect.left - cfg.width - this.border + window.scrollX
    } else {
      cfg.left = rect.right + window.scrollX
    }

    // 然后设置 top
    // 让 wrap 和缩略图在垂直方向上居中对齐
    cfg.top = window.scrollY + rect.top
    const wrapHalfHeight = (cfg.height + this.border) / 2
    const workHalfHeight = rect.height / 2
    cfg.top = cfg.top - wrapHalfHeight + workHalfHeight

    // 检查 wrap 顶端是否超出了窗口可视区域
    if (cfg.top < window.scrollY) {
      cfg.top = window.scrollY
    }

    // 检查 wrap 底部是否超出了窗口可视区域
    const bottomOver =
      cfg.top + cfg.height + this.border - window.scrollY - window.innerHeight
    if (bottomOver > 0) {
      // 如果底部超出了窗口可视区域，则计算顶部是否还有可用空间
      const topFreeSpace = cfg.top - window.scrollY
      if (topFreeSpace > 0) {
        // 如果顶部还有空间可用，就尽量向上移动，但不会导致顶端超出可视区域
        cfg.top = cfg.top - Math.min(bottomOver, topFreeSpace) - scrollBarHeight
      }
    }

    // 3. 显示 wrap
    const url = this.workData?.body.urls[settings.prevWorkSize]
    if (!url) {
      return
    }
    this.img.src = url
    const styleArray: string[] = []
    for (const [key, value] of Object.entries(cfg)) {
      styleArray.push(`${key}:${value}px;`)
    }
    styleArray.push('display:block;')
    this.wrap.setAttribute('style', styleArray.join(''))
  }
}

new PreviewWork()
