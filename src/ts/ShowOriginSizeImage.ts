import { EVT } from './EVT'
import { settings } from './setting/Settings'
import { Utils } from './utils/Utils'
import { mouseOverThumbnail } from './MouseOverThumbnail'
import { PreviewUgoira } from './PreviewUgoira'
import { ArtworkData } from './crawl/CrawlResult'
import { states } from './store/States'
import { toast } from './Toast'
import { lang } from './Lang'
import { Colors } from './config/Colors'

interface Style {
  imgW: number
  imgH: number
  width: number
  height: number
  mt: number
  ml: number
}

interface Urls {
  original: string
  regular: string
}

class ShowOriginSizeImage {
  constructor() {
    this.createElements()
    this.bindEvents()
  }

  private urls = {
    original: '',
    regular: '',
  }

  private workData?: ArtworkData

  // 原比例查看图片的容器的元素
  private wrapId = 'originSizeWrap'
  private wrap!: HTMLElement
  private img!: HTMLImageElement
  private readonly defaultSize = 1200
  private readonly border = 4 // wrap 的 border 占据的空间
  // 不可以把 left、top 设置为负值，否则超出屏幕的区域无法查看
  // 所以通过修改 margin 来达到定位的效果
  private style: Style = {
    imgW: this.defaultSize,
    imgH: this.defaultSize,
    width: this.defaultSize,
    height: this.defaultSize,
    mt: 0,
    ml: 0,
  }
  private readonly defaultStyle = Utils.deepCopy(this.style)
  private readonly zoomList = [
    0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5,
  ]
  private zoomIndex = 6
  // 默认的缩放比例为 1
  private zoom = this.zoomList[this.zoomIndex]
  private testImg = new Image()
  private getImageSizeTimer = 0

  // 定义当鼠标移动 1 像素时，wrap 移动多少像素
  private onePxMove = 10
  private moveX = 0
  private moveY = 0

  private previewUgoira?: PreviewUgoira

  private _show = false

  private get show() {
    return this._show
  }

  private set show(val: boolean) {
    this._show = val
    if (val) {
      EVT.fire('showOriginSizeImage')
      this.wrap.style.display = 'block'

      // 预览动图
      if (settings.previewUgoira && this.workData?.body.illustType === 2) {
        this.previewUgoira = new PreviewUgoira(
          this.workData.body.id,
          this.wrap,
          settings.showOriginImageSize
        )
      }
    } else {
      this.img.src = ''
      this.wrap.style.display = 'none'

      // 销毁预览动图的模块
      if (this.previewUgoira) {
        this.previewUgoira.destroy()
        this.previewUgoira = null as unknown as PreviewUgoira
      }
    }
  }

  private showTimer = 0
  private rightClickBeforeShow = false

  private createElements() {
    this.wrap = document.createElement('div')
    this.wrap.id = this.wrapId
    this.img = document.createElement('img')
    this.wrap.appendChild(this.img)
    document.documentElement.appendChild(this.wrap)
  }

  private bindEvents() {
    mouseOverThumbnail.onEnter((el: HTMLElement) => {
      if (settings.showOriginImage) {
        // 这里测试在 CentBrowser（内核版本 86）中存在问题，因为 CentBrowser 里鼠标右键松开时才会触发 mousedown 事件，导致根本没法做鼠标长按的效果
        el.addEventListener('mousedown', this.readyShow)
        el.addEventListener('mouseup', this.cancelReadyShow)
      }
    })

    mouseOverThumbnail.onLeave((el: HTMLElement) => {
      el.removeEventListener('mousedown', this.readyShow)
      el.removeEventListener('mouseup', this.cancelReadyShow)
    })

    this.wrap.addEventListener('click', () => {
      this.show = false
    })

    document.body.addEventListener('click', () => {
      this.show = false
    })

    this.wrap.addEventListener('mousewheel', (ev) => {
      ev.preventDefault()
      // 向上滚 deltaY 是负数（-125），向下滚是正数（125）
      const zoomAdd = (ev as WheelEvent).deltaY < 0
      this.zoomWrap(ev as MouseEvent, zoomAdd)
    })

    this.wrap.addEventListener('mousemove', (ev) => {
      if (this.moveX === 0) {
        // client x y 是可视区域，不包含滚动区域
        this.moveX = ev.clientX
        this.moveY = ev.clientY
      }

      // 本来我对此事件进行了节流处理，但是节流的话容易显得画面不流畅。
      // 而且我试了试，不节流也不会产生太高的 CPU 负荷。所以现在不再做节流处理
      this.moveWrap(ev)
      this.moveX = ev.clientX
      this.moveY = ev.clientY
    })

    window.addEventListener('contextmenu', (ev) => {
      // 如果是在原图区域显示之前按下了右键，并且随后显示了原图区域，那么就屏蔽这一次右键菜单
      if (this.rightClickBeforeShow) {
        ev.preventDefault()
        this.rightClickBeforeShow = false
        this.moveX = ev.clientX
        this.moveY = ev.clientY
      }
    })

    // 预览大图时，可以使用快捷键 D 下载这个作品
    window.addEventListener('keydown', (ev) => {
      if (ev.code === 'KeyD' && this.show) {
        EVT.fire('crawlIdList', [
          {
            type: 'illusts',
            id: this.workData!.body.id,
          },
        ])

        // 下载时不显示下载面板
        states.quickCrawl = true
        toast.show(lang.transl('_已发送下载请求'), {
          bgColor: Colors.bgBlue,
          position: 'center',
        })
      }
    })
  }

  private readyShow = (ev: MouseEvent) => {
    window.clearTimeout(this.showTimer)
    // 当预览区域显示之后，在作品缩略图上长按鼠标右键，显示原尺寸图片
    // 0 左键 1 滚轮 2 右键
    if (ev.button === 2) {
      this.showTimer = window.setTimeout(() => {
        this.rightClickBeforeShow = true
        this.initWrap(ev)
      }, 500)
    }
  }

  private cancelReadyShow = (ev: MouseEvent) => {
    window.clearTimeout(this.showTimer)
  }

  private async getImage(url: string): Promise<HTMLImageElement> {
    window.clearInterval(this.getImageSizeTimer)
    this.testImg.src = ''

    return new Promise((resolve) => {
      this.testImg = new Image()
      this.testImg.src = url
      this.getImageSizeTimer = window.setInterval(() => {
        if (this.testImg.naturalWidth > 0) {
          window.clearInterval(this.getImageSizeTimer)
          return resolve(this.testImg)
        }
      }, 50)
    })
  }

  // 初次显示一个图片时，初始化 wrap 的样式
  private async initWrap(ev: MouseEvent) {
    const url = this.urls[settings.showOriginImageSize]
    if (!url) {
      return
    }

    this.zoomIndex = 6
    this.zoom = this.zoomList[this.zoomIndex]
    this.style = this.defaultStyle

    // 获取图片的原始宽高
    this.img = await this.getImage(url)
    this.style.imgW = this.img.naturalWidth
    this.style.imgH = this.img.naturalHeight
    this.style.width = this.style.imgW
    this.style.height = this.style.imgH

    // 替换 img 元素
    this.wrap.querySelector('img')!.remove()
    this.wrap.appendChild(this.img)

    // 设置定位
    const innerWidth = window.innerWidth - 17
    // 在水平方向上，总是居中显示
    this.style.ml = (innerWidth - this.style.width - this.border) / 2
    // 在垂直方向上
    if (this.style.height > window.innerHeight) {
      // 如果图片高度超过了可视区域，则从顶部显示
      this.style.mt = 0
    } else {
      // 否则垂直居中显示
      this.style.mt = (window.innerHeight - this.style.height - this.border) / 2
    }

    // 计算鼠标移动 1 像素时，图片应该移动多少像素
    // 计算横向的 onePxMove
    let onePxMoveX = this.style.imgW / innerWidth
    if (this.style.imgW > innerWidth) {
      // 如果图片宽度超出窗口可视宽度，计算鼠标左侧和右侧的图像宽度分别是多少
      const hiddenHalf = (this.style.imgW - innerWidth) / 2
      const leftWidth = ev.clientX + hiddenHalf
      const rightWidth = this.style.imgW - leftWidth
      // 计算鼠标向左或向右移动 1 像素时，图片应该移动多少像素。取比较大的一个值
      onePxMoveX = Math.max(
        leftWidth / ev.clientX,
        rightWidth / (innerWidth - ev.clientX)
      )
    }
    // 计算纵向的 onePxMove
    let onePxMoveY = this.style.imgH / window.innerHeight
    if (this.style.imgH > window.innerHeight) {
      // 如果图片高度超出窗口可视高度，下载器会把图片从顶部显示。此时需要特殊处理 onePxMove
      // 让鼠标从当前位置向下到窗口底部时，可以完整查看整个图片
      onePxMoveY =
        (this.style.imgH - ev.clientY) / (window.innerHeight - ev.clientY)
    }
    // 比较水平方向和垂直方向的计算结果，取比较大的一个值
    // onePxMove 乘以修正系数，进行放大
    // 这样可以让用户在移动鼠标时，不需要移动到边界上就可以查看到图片的边界
    this.onePxMove = Math.max(onePxMoveX, onePxMoveY) * 1.1

    // 设置样式，显示图片
    this.setWrapStyle()
    this.show = true
  }

  // 以鼠标所在位置为中心点缩放
  // 例如，鼠标放在角色的眼睛上面进行缩放，在缩放之后，依然把眼睛定位到鼠标所在位置
  // 当用户滚动鼠标滚轮时，传递鼠标相对于原图区域的坐标（不包含 border）
  private zoomWrap(ev: MouseEvent, zoomAdd: boolean) {
    // 设置 zoom 等级
    const oldZoom = this.zoom
    const oldZoomIndex = this.zoomIndex
    let cancel = false

    this.zoomIndex += zoomAdd ? 1 : -1
    this.zoom = this.zoomList[this.zoomIndex]
    if (this.zoom === undefined) {
      cancel = true
    }

    // 检查缩放后的图片的尺寸是否超出了限制
    const testWidth = this.style.imgW * this.zoom
    const testHeight = this.style.imgH * this.zoom
    if (Math.max(testWidth, testHeight) > 30000) {
      cancel = true
    }

    if (cancel) {
      this.zoom = oldZoom
      this.zoomIndex = oldZoomIndex
      return
    }

    // 启动缩放
    this.style.width = this.style.imgW * this.zoom
    this.style.height = this.style.imgH * this.zoom

    // 计算这次缩放相对于上次缩放增加的倍率（容器的尺寸会增加多少倍）
    const zoom = (this.zoom - oldZoom!) / oldZoom!
    // 缩放之前，鼠标与容器顶点形成了一个矩形（0, 0, offsetX, offsetY）
    // 计算这个矩形在缩放之后，相比于缩放之前增加了多少像素
    const offsetXAdd = ev.offsetX * zoom
    const offsetYAdd = ev.offsetY * zoom

    // 对缩放之前的 margin 值加以修改，使缩放之前的鼠标位置的图像现在仍然位于鼠标位置
    this.style.ml = this.style.ml - offsetXAdd
    this.style.mt = this.style.mt - offsetYAdd
    this.setWrapStyle()
  }

  private moveWrap(ev: MouseEvent) {
    // 计算鼠标距离上次执行时，移动的距离
    const mouseMoveX = ev.clientX - this.moveX
    const mouseMoveY = ev.clientY - this.moveY

    // 在水平方向上应该移动多少像素
    let moveX = mouseMoveX * this.onePxMove * this.zoom
    // 在垂直方向上应该移动多少像素
    let moveY = mouseMoveY * this.onePxMove * this.zoom

    // 设置容差值，允许图像的边界与可视区域之间存在空隙
    // 例如，本来图片的左侧与可视区域的左侧重合时，就不应该允许图片继续向右移动了。
    // 现在设置了容差值，使图片可以继续向右移动 tolerance 像素。
    // 这样可以让用户知道已经移动到了图片的边缘，避免用户产生疑惑。
    const tolerance = 10
    let ml: number | undefined
    let mt: number | undefined

    // 鼠标向左移动，wrap 向右移动，ml 增加
    if (mouseMoveX < 0) {
      // 如果 wrap 左侧还有被隐藏的部分，才允许向右移动
      if (this.style.ml < tolerance) {
        ml = this.style.ml - moveX
      }
    }
    // 鼠标向右移动，wrap 向左移动，ml 减少
    if (mouseMoveX > 0) {
      // 如果 wrap 右侧还有被隐藏的部分，才允许向左移动
      if (this.style.ml + this.style.width > window.innerWidth - tolerance) {
        ml = this.style.ml - moveX
      }
    }

    // 鼠标向上移动，warp 向下移动，mt 增加
    if (mouseMoveY < 0) {
      // 如果 wrap 顶部还有被隐藏的部分，才允许向下移动
      if (this.style.mt < tolerance) {
        mt = this.style.mt - moveY
      }
    }
    // 鼠标向下移动，warp 向上移动，mt 减少
    if (mouseMoveY > 0) {
      // 如果 wrap 底部还有被隐藏的部分，才允许向上移动
      if (this.style.mt + this.style.height > window.innerHeight - tolerance) {
        mt = this.style.mt - moveY
      }
    }

    // 设置 margin 时，需要检查容器是否处于可视区域之外。如果超出了可视区域则不赋值
    if (ml !== undefined) {
      if (
        (ml > 0 && ml < window.innerWidth) ||
        (ml < 0 && ml + this.style.width > tolerance)
      ) {
        // 如果 ml 小于 0，其右边的坐标不可以小于 0
        this.style.ml = ml
      }
    }
    if (mt !== undefined) {
      if (
        (mt > 0 && mt < window.innerHeight) ||
        (mt < 0 && mt + this.style.height > tolerance)
      ) {
        // 如果 mt 小于 0，其底边的坐标不可以小于 0
        this.style.mt = mt
      }
    }

    this.setWrapStyle()
  }

  private setWrapStyle() {
    this.wrap.style.width = this.style.width + 'px'
    this.wrap.style.height = this.style.height + 'px'
    this.wrap.style.marginTop = this.style.mt + 'px'
    this.wrap.style.marginLeft = this.style.ml + 'px'
  }

  public setData(urls: Urls, data: ArtworkData) {
    this.urls = urls
    this.workData = data
  }
}

const showOriginSizeImage = new ShowOriginSizeImage()
export { showOriginSizeImage }
