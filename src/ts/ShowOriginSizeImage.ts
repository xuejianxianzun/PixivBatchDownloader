import { ArtworkData } from './crawl/CrawlResult'
import { EVT } from './EVT'
import { settings } from './setting/Settings'

interface Style {
  ml: number
  mt: number
  width: number
  height: number
  imgW: number
  imgH: number
}

class ShowOriginSizeImage {
  constructor() {
    this.createElements()
    this.bindEvents()
  }

  // 原比例查看图片的容器的元素
  private wrapId = 'originSizeWrap'
  private wrap!: HTMLElement
  private img!: HTMLImageElement
  private readonly defaultSize = 1200
  private readonly border = 8 // wrap 的 border 占据的空间
  // 不可以把 left、top 设置为负值，否则超出屏幕的区域无法查看
  // 所以通过修改 margin 来达到定位的效果
  private style: Style = {
    width: this.defaultSize,
    imgW: this.defaultSize,
    height: this.defaultSize,
    imgH: this.defaultSize,
    mt: 0,
    ml: 0,
  }
  private zoom = 1

  private _show = false

  private get show() {
    return this._show
  }

  private set show(val: boolean) {
    this._show = val
    if (val) {
      EVT.fire('showOriginSizeImage')
    }
  }

  private showTimer = 0
  private rightClickBeforeShow = false

  private workData?: ArtworkData

  private createElements() {
    this.wrap = document.createElement('div')
    this.wrap.id = this.wrapId
    this.img = document.createElement('img')
    this.wrap.appendChild(this.img)
    document.documentElement.appendChild(this.wrap)
  }

  private bindEvents() {
    this.wrap.addEventListener('mouseleave', () => {
      // this.hiddenOrigin()
    })

    this.wrap.addEventListener('click', () => {
      this.hidden()
    })

    this.wrap.addEventListener('mousewheel', (ev) => {
      ev.preventDefault()
      // 向上滚 deltaY 是负数（-125），向下滚是正数（125）
      const zoomAdd = (ev as WheelEvent).deltaY < 0

      // zoom 取值范围： 0.5 | 1 | 2 | 3 | 4
      if ((zoomAdd && this.zoom >= 4) || (!zoomAdd && this.zoom <= 0.5)) {
        return
      }

      const oldZoom = this.zoom

      if (zoomAdd) {
        this.zoom += this.zoom === 0.5 ? 0.5 : 1
      } else {
        this.zoom -= this.zoom === 1 ? 0.5 : 1
      }

      // 检查缩放后的图片的尺寸是否超出了限制
      const testWidth = this.style.imgW * this.zoom
      const testHeight = this.style.imgH * this.zoom
      const max = Math.max(testWidth, testHeight)
      // 如果超出了限制就取消对缩放比例的修改
      if (max < 600 || max > 15000) {
        this.zoom = oldZoom
        return
      }
      // client x y 是可视区域，不包含滚动区域
      this.setWrap(ev as MouseEvent, oldZoom)
    })

    window.addEventListener('contextmenu', (ev) => {
      // 如果是在原图区域显示之前按下了右键，并且随后显示了原图区域，那么就屏蔽这一次右键菜单
      if (this.rightClickBeforeShow) {
        ev.preventDefault()
        this.rightClickBeforeShow = false
      }
    })
  }

  private readyShow = (ev: MouseEvent) => {
    // 当预览区域显示之后，在作品缩略图上长按鼠标右键，显示原尺寸图片
    // 0 左键 1 滚轮 2 右键
    if (ev.button === 2) {
      this.showTimer = window.setTimeout(() => {
        this.rightClickBeforeShow = true
        if (this.show || !this.workData) {
          return
        }

        const url = this.workData?.body.urls[settings.prevWorkSize]
        if (!url) {
          return
        }
        this.img.src = url
        this.show = true
        this.setWrap()
        this.wrap.style.display = 'block'
      }, 500)
    }
  }

  private cancelShow = (ev: MouseEvent) => {
    // 当鼠标右键弹起的时候，如果已经显示了原尺寸区域，就阻止右键的显示
    if (this.show) {
      ev.preventDefault()
    }
    window.clearTimeout(this.showTimer)
  }

  // 当用户滚动鼠标滚轮时，传递鼠标相对于原图区域的坐标（不包含 border）
  private setWrap(ev?: MouseEvent, oldZoom?: number) {
    if (!ev) {
      // 初次显示时，计算图片的原始宽高
      const originWidth = this.workData!.body.width
      const originHeight = this.workData!.body.height

      // 如果加载的是“普通”尺寸，需要根据原图的比例计算宽高
      if (settings.prevWorkSize === 'regular') {
        if (originWidth >= originHeight) {
          // 横图或者正方形
          this.style.imgW = Math.min(originWidth, this.defaultSize)
          this.style.imgH = (this.style.imgW / originWidth) * originHeight
        } else {
          this.style.imgH = Math.min(originHeight, this.defaultSize)
          this.style.imgW = (this.style.imgH / originHeight) * originWidth
        }
      }
    }

    this.style.width = this.style.imgW * this.zoom
    this.style.height = this.style.imgH * this.zoom

    if (!ev) {
      // 初次显示
      // 设置水平位置，默认居中显示
      this.style.ml =
        (window.innerWidth - 17 - this.style.width - this.border) / 2
      // 设置垂直位置，默认居中显示
      this.style.mt = (window.innerHeight - this.style.height - this.border) / 2
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
      this.style.ml = this.style.ml - offsetXAdd
      this.style.mt = this.style.mt - offsetYAdd
    }

    this.wrap.style.width = this.style.width + 'px'
    this.wrap.style.height = this.style.height + 'px'
    this.wrap.style.marginTop = this.style.mt + 'px'
    this.wrap.style.marginLeft = this.style.ml + 'px'
  }

  private hidden() {
    this.show = false
    this.zoom = 1
    this.wrap.style.display = 'none'
    this.img.src = ''
    this.style = {
      width: this.defaultSize,
      imgW: this.defaultSize,
      height: this.defaultSize,
      imgH: this.defaultSize,
      mt: 0,
      ml: 0,
    }
  }

  public setWorkData(data: ArtworkData) {
    this.workData = data
  }

  public enterEl(el: HTMLElement) {
    el.addEventListener('mousedown', this.readyShow)
    el.addEventListener('mouseup', this.cancelShow)
  }

  public leaveEl(el: HTMLElement) {
    el.removeEventListener('mousedown', this.readyShow)
    el.removeEventListener('mouseup', this.cancelShow)
  }
}

const showOriginSizeImage = new ShowOriginSizeImage()
export { showOriginSizeImage }
