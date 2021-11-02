import { API } from './API'
import { ArtworkData } from './crawl/CrawlResult'
import { EVT } from './EVT'
import { mouseOverThumbnail } from './MouseOverThumbnail'
import { settings, setSetting } from './setting/Settings'
import { showOriginSizeImage } from './ShowOriginSizeImage'
import { cacheWorkData } from './store/CacheWorkData'

// 鼠标停留在作品的缩略图上时，预览作品
class PreviewWork {
  constructor() {
    this.createElements()
    this.bindEvents()
  }

  // 预览作品的容器的元素
  private wrapId = 'previewWorkWrap'
  private wrap!: HTMLElement
  private img!: HTMLImageElement
  private readonly border = 8 // border 占据的空间

  private tipId = 'previewWorkTip'
  private tip!: HTMLElement
  private readonly tipHeight = 26

  // 保存当前鼠标经过的缩略图的数据
  private workId = ''
  private workEL?: HTMLElement
  private workData?: ArtworkData
  private index = 1

  // 显示预览区域的延迟时间
  // 鼠标进入缩略图时，本模块会立即请求作品数据，但在请求完成后不会立即加载图片
  // 如果鼠标在缩略图上停留达到 delay 的时间，才会加载 regular 尺寸的图片
  // 这是因为要加载的图片体积比较大，regular 规格的图片的体积可能达到 800KB，如果立即加载的话会浪费网络资源
  private readonly showDelay = 300
  private showTimer = 0

  private _show = false

  private get show() {
    return this._show
  }

  private set show(val: boolean) {
    if (val) {
      this.workData = cacheWorkData.get(this.workId)
      // 如果保存的作品数据不是最后一个鼠标经过的作品，可能是请求尚未完成，此时延长等待时间
      if (!this.workData || this.workData.body.id !== this.workId) {
        this.readyShow()
      } else {
        this.sendData(this.workData)
        if (settings.PreviewWork) {
          this._show = val
          this.showWrap()
        }
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

    this.tip = document.createElement('div')
    this.tip.id = this.tipId
    this.wrap.appendChild(this.tip)

    this.img = document.createElement('img')
    this.wrap.appendChild(this.img)

    document.body.appendChild(this.wrap)
  }

  private bindEvents() {
    mouseOverThumbnail.onEnter((el: HTMLElement, id: string) => {
      // 如果重复进入同一个作品的缩略图，不会重复获取数据
      this.workId = id
      this.workEL = el
      if (!cacheWorkData.has(id)) {
        // 如果在缓存中没有找到这个作品的数据，则发起请求
        this.fetchWorkData()
      }

      this.readyShow()
    })

    mouseOverThumbnail.onLeave(() => {
      this.show = false
    })

    // 可以使用 Alt + P 快捷键来启用/禁用此功能
    window.addEventListener('keydown', (ev) => {
      if (ev.altKey && ev.code === 'KeyP') {
        setSetting('PreviewWork', !settings.PreviewWork)
      }
    })

    const hiddenEvtList = [
      EVT.list.pageSwitch,
      EVT.list.pageSwitch,
      EVT.list.showOriginSizeImage,
    ]
    hiddenEvtList.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.show = false
      })
    })
  }

  private async fetchWorkData() {
    const data = await API.getArtworkData(this.workId)
    cacheWorkData.set(data)
  }

  private readyShow() {
    this.showTimer = window.setTimeout(() => {
      this.show = true
    }, this.showDelay)
  }

  // 显示预览 wrap
  private showWrap() {
    if (!this.workEL || !this.workData) {
      return
    }

    const cfg = {
      width: 1200,
      height: 1200,
      left: 0,
      top: 0,
    }

    // 1. 计算图片显示的尺寸
    const w = this.workData.body.width
    const h = this.workData.body.height

    const rect = this.workEL.getBoundingClientRect()

    // 计算各个可用区域的尺寸，提前减去了 border、tip 等元素占据的空间
    const innerWidth = window.innerWidth - 17
    const leftSpace = rect.left - this.border
    const rightSpace = innerWidth - rect.right - this.border
    const xSpace = Math.max(leftSpace, rightSpace)

    const showPreviewWorkTip = true
    const tipHeight = showPreviewWorkTip ? this.tipHeight : 0
    const scrollBarHeight =
      window.innerHeight - document.documentElement.clientHeight
    const ySpace =
      window.innerHeight - scrollBarHeight - this.border - tipHeight

    // 宽高从图片宽高、可视区域的宽高中，取最小值，使图片不会超出可视区域外
    // 竖图
    if (w < h) {
      cfg.height = Math.min(ySpace, h)
      cfg.width = (cfg.height / h) * w
    } else if (w > h) {
      // 横图
      cfg.width = Math.min(xSpace, w)
      cfg.height = (cfg.width / w) * h
    } else {
      // 正方形图片
      cfg.height = Math.min(ySpace, xSpace, h)
      cfg.width = Math.min(w, ySpace)
    }

    // 如果 wrap 宽度超过了可视窗口宽度，则需要再次调整宽高
    if (cfg.width > xSpace) {
      cfg.height = (xSpace / cfg.width) * cfg.height
      cfg.width = xSpace
    }

    // 如果 wrap 高度超过了可视窗口高度，则需要再次调整宽高
    if (cfg.height > ySpace) {
      cfg.width = (ySpace / cfg.height) * cfg.width
      cfg.height = ySpace
    }

    // 上面计算的高度是图片的高度，现在设置 wrap 的宽高，需要加上内部其他元素的高度
    cfg.height = cfg.height + tipHeight

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

    // 3. 设置顶部提示区域的内容
    if (showPreviewWorkTip) {
      const text = []
      const body = this.workData.body
      text.push(`${this.index}/${body.pageCount}`)
      text.push(`${body.width}x${body.height}`)
      text.push(body.title)
      text.push(body.description)

      this.tip.innerHTML = text
        .map((str) => {
          return `<span>${str}</span>`
        })
        .join('')
      this.tip.style.display = 'block'
    } else {
      this.tip.style.display = 'none'
    }

    // 4. 显示 wrap
    const url = this.workData.body.urls[settings.prevWorkSize]
    if (!url) {
      return
    }
    this.img.src = url
    // css 设置了 img{height:auto}，但是有时候下面会有一点缝隙，可能是浮点数导致的。手动设置高度使其没有缝隙
    this.img.style.height = cfg.height - tipHeight + 'px'
    const styleArray: string[] = []
    for (const [key, value] of Object.entries(cfg)) {
      styleArray.push(`${key}:${value}px;`)
    }
    styleArray.push('display:block;')
    this.wrap.setAttribute('style', styleArray.join(''))
  }

  private sendData(data: ArtworkData) {
    showOriginSizeImage.setData({
      urls: {
        original: data.body.urls.original,
        regular: data.body.urls.regular,
      },
      img: {
        width: data.body.width,
        height: data.body.height,
      },
    })
  }
}

new PreviewWork()
