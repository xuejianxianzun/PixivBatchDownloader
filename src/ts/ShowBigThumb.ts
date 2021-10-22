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
  private readonly showDelay = 300
  private showTimer: number = 0

  // 鼠标离开缩略图之后，经过指定的时间才会隐藏 wrap
  // 如果在这个时间内又进入缩略图，或者进入 wrap，则取消隐藏定时器，继续显示 wrap
  // 如果不使用延迟隐藏，而是立即隐藏的话，用户就不能滚动页面来查看完整的 wrap
  private readonly hiddenDelay = 50
  private hiddenTimer: number = 0

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

      if (!settings.PreviewWork) {
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

  // 显示大缩略图。尽量不遮挡住小缩略图
  private showWrap() {
    if (!settings.PreviewWork || !this.workEL || !this.workData) {
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
    const w = this.workData.body.width
    const h = this.workData.body.height

    // 如果图片的宽高小于 wrap 的宽高，则让 wrap 缩小，适应图片的大小
    // 竖图
    if (w < h) {
      cfg.height = Math.min(maxSize, h)
      cfg.width = (cfg.height / h) * w
    } else if (w > h) {
      // 横图
      cfg.width = Math.min(maxSize, w)
      cfg.height = (cfg.width / w) * h
    } else {
      // 正方形图片
      cfg.height = Math.min(maxSize, h)
      cfg.width = Math.min(maxSize, w)
    }

    // 2. 计算位置
    const rect = this.workEL.getBoundingClientRect()
    // 下面注释掉的代码，思路是：
    // 如果是横图，优先把 wrap 显示在缩略图的上方或下方
    // 其他情况则把 wrap 显示在缩略图的左侧或右侧
    // 现在改为不再显示在上方、下方，只会在左侧、右侧显示
    // 这主要是因为在缩略图左侧、右侧显示的话，会让预览图更加靠近屏幕中心区域，位置变化不会很大，这样看起来不容易分散注意力，体验比较好。如果允许某些预览图显示在缩略图的上方、下方，那么预览图可能会脱离中心区域，导致体验变差
    // 另一个原因是：电脑屏幕大多是横向空间比纵向空间大，这导致上方或下方经常空间不够用，最终还是需要放到左右侧。

    // // 指示 wrap 是否应该显示在侧面
    // let showOnAside = false
    // if (cfg.width > cfg.height) {
    //   // 如果是横图，优先把 wrap 显示在缩略图的上方或下方
    //   // 先设置 top
    //   const topSpace = rect.top
    //   const bottomSpace = window.innerHeight - topSpace - rect.height
    //   // 如果上方空间可以容纳 wrap，就显示在上方
    //   if (topSpace >= cfg.height + this.border) {
    //     cfg.top = window.scrollY + rect.top - cfg.height - this.border
    //   } else if (bottomSpace >= cfg.height + this.border) {
    //     // 上方空间不够的情况下，如果下方可以容纳 wrap，就显示在下方
    //     cfg.top = window.scrollY + rect.top + rect.height
    //   } else {
    //     // 如果上下方都不能容纳 wrap，就把 wrap 显示在侧面
    //     showOnAside = true
    //   }

    //   if (!showOnAside) {
    //     // 然后设置 left
    //     // 让 wrap 相对于作品缩略图居中显示
    //     cfg.left =
    //       window.scrollX +
    //       rect.left -
    //       (cfg.width + this.border - rect.width) / 2

    //     // 检查 wrap 左侧是否超出了窗口可视区域
    //     if (cfg.left < window.scrollX) {
    //       cfg.left = window.scrollX
    //     }

    //     // 检查 wrap 右侧是否超出了窗口可视区域
    //     const scrollBarWidth =
    //       window.innerWidth - document.documentElement.clientWidth
    //     const num =
    //       window.innerWidth -
    //       scrollBarWidth +
    //       window.scrollX -
    //       (cfg.left + cfg.width + this.border)
    //     if (num < 0) {
    //       cfg.left = cfg.left + num
    //     }
    //   }
    // }

    // 如果是竖图或者正方形图片，或者需要放在侧面，就把 wrap 显示在缩略图的左侧或右侧
    // if (cfg.width <= cfg.height || showOnAside) {
      // 先设置 left
      const leftSpace = rect.left
      const rightSpace = window.innerWidth - rect.right
      // 如果左侧空间比右侧大，并且左侧空间可以容纳大部分（80%） wrap，就把 wrap 显示在左侧
      const left = rect.left - cfg.width - this.border + window.scrollX
      const leftCanUse = left >= 0 || cfg.width * 0.2 + left >= 0
      // 为什么要计算 leftCanUse？因为如果 left 是负值，就会导致 wrap 被隐藏了一部分，但是页面不可以向左滚动以显示隐藏的内容。所以如果被隐藏的部分比较多，就让 wrap 显示在右侧。页面可以向右滚动以显示隐藏的内容。
      if (leftSpace >= rightSpace && leftCanUse) {
        cfg.left = left
      } else {
        // 如果左侧空间没有右侧空间大，或者左侧空间不足以容纳 wrap，就把 wrap 显示在缩略图的右侧
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
          const scrollBarHeight =
            window.innerHeight - document.documentElement.clientHeight
          cfg.top =
            cfg.top - Math.min(bottomOver, topFreeSpace) - scrollBarHeight
        }
      }
    // }

    // 3. 显示 wrap
    this.wrap.innerHTML = `<img src="${this.workData?.body.urls.regular}" width="${cfg.width}" height="${cfg.height}">`
    const styleArray: string[] = []
    for (const [key, value] of Object.entries(cfg)) {
      styleArray.push(`${key}:${value}px;`)
    }
    styleArray.push('display:block;')
    this.wrap.setAttribute('style', styleArray.join(''))
  }
}

new ShowBigThumb()
