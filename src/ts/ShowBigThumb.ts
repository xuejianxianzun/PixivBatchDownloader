import { API } from './API'
import { ArtworkData } from './crawl/CrawlResult'
import { EVT } from './EVT'
import { mouseOverThumbnail } from './MouseOverThumbnail'
import { settings, setSetting } from './setting/Settings'
import { states } from './store/States'

// 鼠标经过作品的缩略图时，显示更大尺寸的缩略图
class ShowBigThumb {
  constructor() {
    this.createWrap()
    this.bindEvents()
  }

  // 容器元素的相关数据
  private wrapId = 'bigThumbWrap'
  private wrap!: HTMLElement
  private readonly border = 8 // wrap 的 border 占据的空间

  // 保存最后一个缩略图的作品的 id
  private workId = ''
  private workData?: ArtworkData
  private workEL?: HTMLElement

  // 显示/隐藏
  private _show = false

  // 加载图像的延迟时间
  // 鼠标进入缩略图时，本模块会立即请求作品数据，但在请求完成后不会立即加载图片
  // 如果鼠标在缩略图上停留达到 delay 的时间，才会加载 regular 尺寸的图片
  // 这是因为要加载的图片体积比较大，regular 规格的图片的体积可能达到 800KB，如果立即加载的话会浪费网络资源
  private readonly showDelay = 400
  private showTimer: number = 0

  // 鼠标离开缩略图之后，经过指定的时间才会隐藏 wrap
  // 如果在这个时间内又进入缩略图，或者进入 wrap，则取消隐藏定时器，继续显示 wrap
  // 如果不使用延迟隐藏，而是立即隐藏的话，用户就不能滚动页面来查看完整的 wrap
  private readonly hiddenDelay = 100
  private hiddenTimer: number = 0

  // 鼠标点击 wrap 可以隐藏 wrap。在之后的一段时间里，临时禁用预览功能
  private afterClick = false
  private afterClickDisable = 100

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
      this.workData = undefined
      this.workEL = undefined
    }
  }

  private bindEvents() {
    mouseOverThumbnail.onEnter((el: HTMLElement, id: string) => {
      window.clearTimeout(this.hiddenTimer)

      if (!settings.PreviewWork || states.selectWork || this.afterClick) {
        return
      }

      this.workId = id
      this.getWorkData()
      this.workEL = el
      // 一定时间后，显示容器，加载大图
      this.readyShow()
    })

    mouseOverThumbnail.onLeave(() => {
      this.readyHidden()
    })

    this.wrap.addEventListener('mouseenter', () => {
      window.clearTimeout(this.hiddenTimer)
    })

    this.wrap.addEventListener('mouseleave', () => {
      this.readyHidden()
    })

    this.wrap.addEventListener('click', () => {
      this.show = false
      this.afterClick = true
      window.setTimeout(() => {
        this.afterClick = false
      }, this.afterClickDisable)
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
  }

  private createWrap() {
    this.wrap = document.createElement('div')
    this.wrap.id = this.wrapId
    document.body.appendChild(this.wrap)
  }

  private async getWorkData() {
    const data = await API.getArtworkData(this.workId)
    if (data.body.id === this.workId) {
      this.workData = data
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

  private showWrap() {
    if (!settings.PreviewWork || !this.workEL) {
      return
    }

    const maxSize = settings.PreviewWorkSize

    const cfg = {
      width: maxSize,
      height: maxSize,
      left: 0,
      top: 0,
    }

    // 1. 设置宽高
    const w = this.workData!.body.width
    const h = this.workData!.body.height

    // 竖图
    if (w < h) {
      cfg.height = maxSize
      cfg.width = (maxSize / h) * w
    } else if (w > h) {
      // 横图
      cfg.width = maxSize
      cfg.height = (maxSize / w) * h
    } else {
      // 正方形图片
      cfg.height = maxSize
      cfg.width = maxSize
    }

    // 2. 计算位置
    const rect = this.workEL.getBoundingClientRect()

    // top 位置：从元素的顶端坐标 减去 wrap 的高度
    // 让 wrap 显示在缩略图的上面
    cfg.top = window.scrollY + rect.top - cfg.height - this.border
    // 检查 wrap 是否超出了窗口可视宽度的顶端
    if (cfg.top < window.scrollY) {
      cfg.top = window.scrollY
    }

    // left 位置：让 wrap 相对于作品缩略图居中显示
    cfg.left =
      window.scrollX + rect.left - (cfg.width + this.border - rect.width) / 2

    // 检查 wrap 是否超出了窗口可视宽度的左侧
    if (cfg.left < window.scrollX) {
      cfg.left = window.scrollX
    }

    // 检查 wrap 是否超出了窗口可视宽度的右侧
    // 17 是 Chrome 滚动条的宽度。因为 window.innerWidth 包含滚动条，所以要减去它
    const num =
      window.innerWidth -
      17 +
      window.scrollX -
      (cfg.left + cfg.width + this.border)
    if (num < 0) {
      cfg.left = cfg.left + num
    }

    // 3. 设置 wrap 的 style
    const styleArray: string[] = []
    for (const [key, value] of Object.entries(cfg)) {
      styleArray.push(`${key}:${value}px;`)
    }
    styleArray.push(
      `background-image:url("${this.workData?.body.urls.regular}");`
    )
    styleArray.push('display:block;')
    this.wrap.setAttribute('style', styleArray.join(''))
  }
}

new ShowBigThumb()
