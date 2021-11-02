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
  private readonly tipHeight = 22

  // 保存当前鼠标经过的缩略图的数据
  private workId = ''
  private workEL?: HTMLElement
  private workData?: ArtworkData

  // 显示作品中的第几张图片
  private index = 0

  // 显示预览区域的延迟时间
  // 鼠标进入缩略图时，本模块会立即请求作品数据，但在请求完成后不会立即加载图片
  // 如果鼠标在缩略图上停留达到 delay 的时间，才会加载 regular 尺寸的图片
  // 这是因为要加载的图片体积比较大，regular 规格的图片的体积可能达到 800KB，如果立即加载的话会浪费网络资源
  private readonly showDelay = 300
  private showTimer = 0

  private testImg = document.createElement('img')
  private getImageSizeTimer = 0

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
        this.sendData()
        if (settings.PreviewWork) {
          this._show = true
          this.showWrap()
        }
      }
    } else {
      // 隐藏时重置一些变量
      window.clearTimeout(this.showTimer)
      this._show = false
      this.wrap.style.display = 'none'
      // 隐藏 wrap 时，把 img 的 src 设置为空
      // 这样图片会停止加载，避免浪费网络资源
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
      if (this.workId !== id) {
        // 切换到不同作品时，重置 index
        this.index = 0
      }
      this.workId = id
      this.workEL = el
      if (!cacheWorkData.has(id)) {
        // 如果在缓存中没有找到这个作品的数据，则发起请求
        this.fetchWorkData()
      } else {
        this.workData = cacheWorkData.get(id)!
      }

      this.readyShow()

      el.addEventListener('mousewheel', this.mouseScroll)
    })

    mouseOverThumbnail.onLeave((el: HTMLElement) => {
      this.show = false
      el.removeEventListener('mousewheel', this.mouseScroll)
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

  private mouseScroll = (ev: Event) => {
    // 此事件没有必要使用节流
    // 因为每次执行时，后续代码里都会重置定时器，停止图片加载，不会造成严重的性能问题
    if (this.show) {
      const count = this.workData!.body.pageCount
      if (count === 1) {
        return
      }
      ev.preventDefault()

      const up = (ev as WheelEvent).deltaY < 0
      if (up) {
        if (this.index > 0) {
          this.index--
        } else {
          this.index = count - 1
        }
      } else {
        if (this.index < count - 1) {
          this.index++
        } else {
          this.index = 0
        }
      }
      this.showWrap()
    }
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

  // 通过 img 元素加载图片，等到可以获取到宽高信息时返回这个 img
  private async getImageSize(url: string): Promise<HTMLImageElement> {
    // 鼠标滚轮滚动时，此方法可能会在短时间内触发多次。所以每次执行前需要重置一些变量
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
      }, 100)
    })
  }

  // 显示预览 wrap
  private async showWrap() {
    if (!this.workEL || !this.workData) {
      return
    }

    const url = this.replaceUrl(this.workData!.body.urls[settings.prevWorkSize])
    this.img = await this.getImageSize(url)

    const w = this.img.naturalWidth
    const h = this.img.naturalHeight

    const cfg = {
      width: w,
      height: h,
      left: 0,
      top: 0,
    }

    // 1. 计算图片显示的尺寸
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
      text.push(`${this.index + 1}/${body.pageCount}`)
      text.push(`${w}x${h}`)
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

    // 4. 替换 img 元素
    this.wrap.querySelector('img')!.remove()
    this.wrap.appendChild(this.img)
    this.img.style.height = cfg.height - tipHeight + 'px'

    // 5. 显示 wrap
    const styleArray: string[] = []
    for (const [key, value] of Object.entries(cfg)) {
      styleArray.push(`${key}:${value}px;`)
    }
    styleArray.push('display:block;')
    this.wrap.setAttribute('style', styleArray.join(''))

    // 每次显示图片后，传递图片的 url
    this.sendData()
  }

  private replaceUrl(url: string) {
    return url.replace('p0', `p${this.index}`)
  }

  private sendData() {
    const data = this.workData
    if (!data) {
      return
    }
    // 传递图片的 url，但是不传递尺寸。
    // 因为预览图片默认加载“普通”尺寸的图片，但是 showOriginSizeImage 默认显示“原图”尺寸。
    // 而且对于第一张之后的图片，加载“普通”尺寸的图片时，无法获取“原图”的尺寸。
    showOriginSizeImage.setData({
      original: this.replaceUrl(data.body.urls.original),
      regular: this.replaceUrl(data.body.urls.regular),
    })
  }
}

new PreviewWork()
