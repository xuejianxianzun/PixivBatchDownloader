import { API } from './API'
import { ArtworkData } from './crawl/CrawlResult'
import { EVT } from './EVT'
import { mouseOverThumbnail } from './MouseOverThumbnail'
import { settings, setSetting } from './setting/Settings'
import { states } from './store/States'

interface Style {
  ml: number
  mt: number
  width: number
  height: number
  imgW: number
  imgH: number
}

// 鼠标经过作品的缩略图时，显示更大尺寸的缩略图
class ShowBigThumb {
  constructor() {
    this.createElements()
    this.bindEvents()
  }

  private readonly defaultSize = 1200
  // 预览作品的容器的元素
  private prewWrapId = 'bigThumbWrap'
  private prewWrap!: HTMLElement
  private prevWrapImg!: HTMLImageElement
  private readonly border = 8 // wrap 的 border 占据的空间

  // 保存当前鼠标经过的缩略图的数据
  private workId = ''
  private workData?: ArtworkData
  private workEL?: HTMLElement

  // 显示预览区域的延迟时间
  // 鼠标进入缩略图时，本模块会立即请求作品数据，但在请求完成后不会立即加载图片
  // 如果鼠标在缩略图上停留达到 delay 的时间，才会加载 regular 尺寸的图片
  // 这是因为要加载的图片体积比较大，regular 规格的图片的体积可能达到 800KB，如果立即加载的话会浪费网络资源
  private readonly showPrevDelay = 300
  private showPrevTimer = 0

  // 鼠标离开缩略图之后，经过指定的时间才会隐藏 wrap
  // 如果在这个时间内又进入缩略图，或者进入 wrap，则取消隐藏定时器，继续显示 wrap
  // 如果不使用延迟隐藏，而是立即隐藏的话，用户就不能滚动页面来查看完整的 wrap
  private readonly hiddenDelay = 50
  private hiddenTimer = 0

  // 预览 wrap 的状态
  private _prevShow = false

  private get prevShow() {
    return this._prevShow
  }

  private set prevShow(val: boolean) {
    if (val) {
      // 如果保存的作品数据不是最后一个鼠标经过的作品，可能是请求尚未完成，此时延长等待时间
      if (!this.workData || this.workData.body.id !== this.workId) {
        this.readyShowPrev()
      } else {
        this._prevShow = val
        this.showPrev()
      }
    } else {
      window.clearTimeout(this.showPrevTimer)
      this._prevShow = val
      this.prewWrap.style.display = 'none'
      // 隐藏 wrap 时，把 img 的 src 设置为空
      // 这样如果图片没有加载完就会停止加载，避免浪费网络资源
      this.prevWrapImg.src = ''
    }
  }

  // 原比例查看图片的容器的元素
  private originSizeWrapId = 'originSizeWrap'
  private originSizeWrap!: HTMLElement
  private originImg!: HTMLImageElement
  // 不可以把 left、top 设置为负值，否则超出屏幕的区域无法查看
  // 所以通过修改 margin 来达到定位的效果
  private oStyle: Style = {
    width: this.defaultSize,
    imgW: this.defaultSize,
    height: this.defaultSize,
    imgH: this.defaultSize,
    mt: 0,
    ml: 0,
  }

  private originShow = false
  private showOriginTimer = 0
  private zoom = 1
  private rightClickBeforeOriginShow = false

  private createElements() {
    this.prewWrap = document.createElement('div')
    this.prewWrap.id = this.prewWrapId
    this.prevWrapImg = document.createElement('img')
    this.prewWrap.appendChild(this.prevWrapImg)
    document.body.appendChild(this.prewWrap)

    this.originSizeWrap = document.createElement('div')
    this.originSizeWrap.id = this.originSizeWrapId
    this.originImg = document.createElement('img')
    this.originSizeWrap.appendChild(this.originImg)
    document.documentElement.appendChild(this.originSizeWrap)
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
      this.readyShowPrev()

      el.addEventListener('mousedown', this.readyShowOrigin)
      el.addEventListener('mouseup', this.cancelShowOrigin)
    })

    mouseOverThumbnail.onLeave((el: HTMLElement) => {
      if (this.prevShow) {
        settings.PreviewWorkMouseStay
          ? this.readyHiddenPrev()
          : (this.prevShow = false)

        el.removeEventListener('mousedown', this.readyShowOrigin)
        el.removeEventListener('mouseup', this.cancelShowOrigin)
      } else {
        this.prevShow = false
      }
    })

    this.prewWrap.addEventListener('mouseenter', () => {
      // 允许鼠标停留在预览图上的情况
      if (settings.PreviewWorkMouseStay && !states.selectWork) {
        window.clearTimeout(this.hiddenTimer)
      }
    })

    this.prewWrap.addEventListener('mouseleave', () => {
      this.prevShow = false
    })

    this.prewWrap.addEventListener('click', () => {
      this.prevShow = false
    })

    // 可以使用 Alt + P 快捷键来启用/禁用此功能
    window.addEventListener('keydown', (ev) => {
      if (ev.altKey && ev.code === 'KeyP') {
        setSetting('PreviewWork', !settings.PreviewWork)
      }
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.prevShow = false
    })

    window.addEventListener(EVT.list.centerPanelOpened, () => {
      this.prevShow = false
    })

    this.originSizeWrap.addEventListener('mouseleave', () => {
      // this.hiddenOrigin()
    })

    this.originSizeWrap.addEventListener('click', () => {
      this.hiddenOrigin()
    })

    this.originSizeWrap.addEventListener('mousewheel', (ev) => {
      ev.preventDefault()
      // 向上滚 deltaY 是负数（-125），向下滚是正数（125）
      const zoomAdd = (ev as WheelEvent).deltaY < 0

      // zoom 取值范围： 0.5 | 1 | 2 | 3 | 4
      if ((zoomAdd && this.zoom >= 4) || (!zoomAdd && this.zoom <= 0.5)) {
        return
      }

      const oldZoom = this.zoom

      if (zoomAdd) {
        this.zoom += (this.zoom === 0.5 ? 0.5 : 1)
      } else {
        this.zoom -= (this.zoom === 1 ? 0.5 : 1)
      }

      // 检查缩放后的图片的尺寸是否超出了限制
      const testWidth = this.oStyle.imgW * this.zoom
      const testHeight = this.oStyle.imgH * this.zoom
      const max = Math.max(testWidth, testHeight)
      // 如果超出了限制就取消对缩放比例的修改
      if (max < 600 || max > 15000) {
        this.zoom = oldZoom
        return
      }
      // client x y 是可视区域，不包含滚动区域
      this.setOriginWrap(ev as MouseEvent, oldZoom)
    })

    window.addEventListener('contextmenu', (ev) => {
      // 如果是在原图区域显示之前按下了右键，并且随后显示了原图区域，那么就屏蔽这一次右键菜单
      if (this.rightClickBeforeOriginShow) {
        ev.preventDefault()
        this.rightClickBeforeOriginShow = false
      }
    })
  }

  private async getWorkData() {
    const data = await API.getArtworkData(this.workId)
    if (data.body.id === this.workId) {
      this.workData = data
    }
  }

  private readyShowPrev() {
    this.showPrevTimer = window.setTimeout(() => {
      this.prevShow = true
    }, this.showPrevDelay)
  }

  private readyHiddenPrev() {
    window.clearTimeout(this.showPrevTimer)
    this.hiddenTimer = window.setTimeout(() => {
      this.prevShow = false
    }, this.hiddenDelay)
  }

  // 显示预览 wrap
  private showPrev() {
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
    this.prevWrapImg.src = this.getImageURL()
    const styleArray: string[] = []
    for (const [key, value] of Object.entries(cfg)) {
      styleArray.push(`${key}:${value}px;`)
    }
    styleArray.push('display:block;')
    this.prewWrap.setAttribute('style', styleArray.join(''))
  }

  private getImageURL() {
    return this.workData?.body.urls[settings.prevWorkSize] || ''
  }

  private readyShowOrigin = (ev: MouseEvent) => {
    // 当预览区域显示之后，在作品缩略图上长按鼠标右键，显示原尺寸图片
    // 0 左键 1 滚轮 2 右键
    if (ev.button === 2) {
      this.showOriginTimer = window.setTimeout(() => {
        this.rightClickBeforeOriginShow = true
        if (this.originShow || !this.workData || this.workData.body.id !== this.workId) {
          return
        }

        this.prevShow = false
        this.originShow = true
        this.originImg.src = this.getImageURL()
        this.setOriginWrap()
        this.originSizeWrap.style.display = 'block'
      }, 500)
    }
  }

  private cancelShowOrigin = (ev: MouseEvent) => {
    // 当鼠标右键弹起的时候，如果已经显示了原尺寸区域，就阻止右键的显示
    if (this.originShow) {
      ev.preventDefault()
    }
    window.clearTimeout(this.showOriginTimer)
  }

  // 当用户滚动鼠标滚轮时，传递鼠标相对于原图区域的坐标（不包含 border）
  private setOriginWrap(ev?: MouseEvent, oldZoom?: number) {
    if (!ev) {
      // 初次显示时，计算图片的原始宽高
      const originWidth = this.workData!.body.width
      const originHeight = this.workData!.body.height

      // 如果加载的是“普通”尺寸，需要根据原图的比例计算宽高
      if (settings.prevWorkSize === 'regular') {
        if (originWidth >= originHeight) {
          // 横图或者正方形
          this.oStyle.imgW = Math.min(originWidth, this.defaultSize)
          this.oStyle.imgH = this.oStyle.imgW / originWidth * originHeight
        } else {
          this.oStyle.imgH = Math.min(originHeight, this.defaultSize)
          this.oStyle.imgW = this.oStyle.imgH / originHeight * originWidth
        }
      }
    }

    console.log(this.oStyle, this.zoom)
    this.oStyle.width = this.oStyle.imgW * this.zoom
    this.oStyle.height = this.oStyle.imgH * this.zoom

    if (!ev) {
      // 初次显示
      // 设置水平位置，默认居中显示
      this.oStyle.ml = (window.innerWidth - 17 - this.oStyle.width - this.border) / 2
      // 设置垂直位置，默认居中显示
      this.oStyle.mt = (window.innerHeight - this.oStyle.height - this.border) / 2
    } else {
      // 进行缩放
      // 以鼠标所在位置为中心点缩放
      // 例如，鼠标放在角色的眼睛上面进行缩放，在缩放之后，依然把眼睛定位到鼠标所在位置

      // 计算这次缩放相对于上次缩放增加的倍率（容器的尺寸会增加多少倍）
      const zoom = (this.zoom - oldZoom!) / oldZoom!
      // 缩放之前，鼠标与容器顶点形成了一个矩形（0, 0, offsetX, offsetY）
      // 计算这个矩形在缩放之后，相比于缩放之前增加了多少像素
      const offsetXAdd = ev.offsetX * zoom
      const offsetYAdd = ev.offsetY * zoom

      // 对缩放之前的 margin 值加以修改，使缩放之前的鼠标位置的图像现在仍然位于鼠标位置
      this.oStyle.ml = this.oStyle.ml - offsetXAdd
      this.oStyle.mt = this.oStyle.mt - offsetYAdd
    }

    this.originSizeWrap.style.width = this.oStyle.width + 'px'
    this.originSizeWrap.style.height = this.oStyle.height + 'px'
    this.originSizeWrap.style.marginTop = this.oStyle.mt + 'px'
    this.originSizeWrap.style.marginLeft = this.oStyle.ml + 'px'
  }

  private hiddenOrigin() {
    this.originShow = false
    this.zoom = 1
    this.originSizeWrap.style.display = 'none'
    this.originImg.src = ''
    this.oStyle = {
      width: this.defaultSize,
      imgW: this.defaultSize,
      height: this.defaultSize,
      imgH: this.defaultSize,
      mt: 0,
      ml: 0,
    }
  }
}

new ShowBigThumb()
