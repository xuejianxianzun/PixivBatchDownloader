import { API } from './API'
import { ArtworkData } from './crawl/CrawlResult'
import { EVT } from './EVT'
import { artworkThumbnail } from './ArtworkThumbnail'
import { settings, setSetting } from './setting/Settings'
import { showOriginSizeImage } from './ShowOriginSizeImage'
import { cacheWorkData } from './store/CacheWorkData'
import { states } from './store/States'
import { Utils } from './utils/Utils'
import { PreviewUgoira } from './PreviewUgoira'
import { toast } from './Toast'
import { lang } from './Lang'
import { Colors } from './config/Colors'

// 鼠标停留在作品的缩略图上时，预览作品
class PreviewWork {
  constructor() {
    this.createElements()
    this.bindEvents()
  }

  // 预览作品的容器的元素
  private wrapId = 'previewWorkWrap'
  private wrap!: HTMLElement
  private img = document.createElement('img')
  private border = 4 // border 占据的空间

  private tipId = 'previewWorkTip'
  private tip!: HTMLElement
  private readonly tipHeight = 22

  // 保存当前鼠标经过的缩略图的数据
  private workId = ''
  private workEL?: HTMLElement
  private workData?: ArtworkData

  // 显示作品中的第几张图片
  private index = 0

  // 延迟显示预览区域的定时器
  // 鼠标进入缩略图时，本模块会立即请求作品数据，但在请求完成后不会立即加载图片，这是为了避免浪费网络资源
  private delayShowTimer: number | undefined = undefined

  // 延迟隐藏预览区域的定时器
  private delayHiddenTimer: number | undefined = undefined

  // 当用户点击预览图使预览图隐藏时，不再显示这个作品的预览图（切换作品可以解除限制）
  private dontShowAgain = false

  // 是否允许预览区域遮挡作品缩略图
  private allowOverThumb = true

  // 当前预览图是否遮挡了作品缩略图
  private overThumb = false

  private previewUgoira?: PreviewUgoira

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
        this.sendUrls()
        if (settings.PreviewWork) {
          this._show = true
          this.showWrap()
          window.clearTimeout(this.delayHiddenTimer)
        }
      }
    } else {
      // 隐藏时重置一些变量
      window.clearTimeout(this.delayShowTimer)
      window.clearTimeout(this.delayHiddenTimer)
      this.overThumb = false
      this._show = false
      this.dontShowAgain = false
      this.wrap.style.display = 'none'
      // 隐藏 wrap 时，把 img 的 src 设置为空
      // 这样图片会停止加载，避免浪费网络资源
      this.img.src = ''

      // 销毁预览动图的模块
      if (this.previewUgoira) {
        this.previewUgoira.destroy()
        this.previewUgoira = null as unknown as PreviewUgoira
      }
    }
  }

  private createElements() {
    this.wrap = document.createElement('div')
    this.wrap.id = this.wrapId

    this.tip = document.createElement('div')
    this.tip.id = this.tipId
    this.wrap.appendChild(this.tip)

    document.body.appendChild(this.wrap)
  }

  private bindEvents() {
    artworkThumbnail.onEnter((el: HTMLElement, id: string) => {
      if (this.dontShowAgain) {
        return
      }
      // 当鼠标进入到不同作品时
      // 隐藏之前的预览图
      // 重置 index
      if (this.workId !== id) {
        this.show = false
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

      el.addEventListener('mousewheel', this.onWheelScroll)
    })

    artworkThumbnail.onLeave((el: HTMLElement) => {
      if (this.overThumb) {
        // 如果预览图遮挡了作品缩略图，就需要延迟隐藏预览图。
        // 因为预览图显示之后，鼠标可能处于预览图上，这会触发此事件。
        // 如果不延迟隐藏，预览图就会马上消失，无法查看
        this.delayHiddenTimer = window.setTimeout(() => {
          this.show = false
          el.removeEventListener('mousewheel', this.onWheelScroll)
        }, 100)
      } else {
        this.show = false
        el.removeEventListener('mousewheel', this.onWheelScroll)
      }
    })

    // 可以使用 Alt + P 快捷键来启用/禁用此功能
    // 预览作品时，可以使用快捷键 D 下载这个作品
    window.addEventListener('keydown', (ev) => {
      if (ev.altKey && ev.code === 'KeyP') {
        setSetting('PreviewWork', !settings.PreviewWork)
      }

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

    const hiddenEvtList = [
      EVT.list.pageSwitch,
      EVT.list.centerPanelOpened,
      EVT.list.showOriginSizeImage,
    ]
    hiddenEvtList.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.show = false
      })
    })

    this.wrap.addEventListener('mouseenter', () => {
      window.clearTimeout(this.delayHiddenTimer)
    })

    this.wrap.addEventListener('mousemove', (ev) => {
      // 鼠标在预览图上移动出缩略图区域时，隐藏预览图
      if (
        this.mouseInElementArea(this.workEL, ev.clientX, ev.clientY) === false
      ) {
        this.show = false
      }
    })

    this.wrap.addEventListener('click', (ev) => {
      this.show = false
      // 点击预览图使预览图消失时，如果鼠标仍处于缩略图区域内，则不再显示这个作品的预览图
      // 当鼠标移出这个作品的缩略图之后取消此限制
      if (this.mouseInElementArea(this.workEL, ev.clientX, ev.clientY)) {
        this.dontShowAgain = true
      }
    })

    this.wrap.addEventListener('mousewheel', (ev) => {
      this.overThumb && this.onWheelScroll(ev)
    })
  }

  // 判断鼠标是否处于某个元素的范围内
  private mouseInElementArea(el: Element | undefined, x: number, y: number) {
    if (!el) {
      return false
    }
    const rect = el.getBoundingClientRect()
    return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom
  }

  private preload() {
    // 如果下载器正在下载文件，则不预加载
    if (this.show && !states.downloading) {
      const count = this.workData!.body.pageCount
      if (count > this.index + 1) {
        let url = this.workData!.body.urls[settings.prevWorkSize]
        url = url.replace('p0', `p${this.index + 1}`)
        let img = new Image()
        // 在预加载过程中，如果查看的图片变化了，或者不显示预览区域了，则立即中断预加载
        const nowIndex = this.index
        const timer = window.setInterval(() => {
          if (this.index !== nowIndex || !this.show) {
            window.clearInterval(timer)
            img && (img.src = '')
            img = null as any
          }
        }, 50)
        img.onload = () => {
          window.clearInterval(timer)
          img && (img = null as any)
        }
        img.src = url
      }
    }
  }

  private wheelEvent?: WheelEvent

  // 当鼠标滚轮滚动时，切换显示的图片
  // 此事件必须使用节流，因为有时候鼠标滚轮短暂的滚动一下就会触发 2 次 mousewheel 事件
  private swicthImage = Utils.throttle(() => {
    const count = this.workData!.body.pageCount
    const up = this.wheelEvent!.deltaY < 0
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
  }, 100)

  private onWheelScroll = (ev: Event) => {
    if (
      this.show &&
      settings.wheelScrollSwitchImageOnPreviewWork &&
      this.workData!.body.pageCount > 1
    ) {
      ev.preventDefault()
      this.wheelEvent = ev as WheelEvent
      this.swicthImage()
    }
  }

  private async fetchWorkData() {
    const data = await API.getArtworkData(this.workId)
    cacheWorkData.set(data)
  }

  private readyShow() {
    this.delayShowTimer = window.setTimeout(() => {
      this.show = true
    }, settings.previewWorkWait)
  }

  // 通过 img 元素加载图片，获取图片的原始尺寸
  private async getImageSize(url: string): Promise<{
    width: number
    height: number
    available: boolean
  }> {
    return new Promise((resolve) => {
      // 鼠标滚轮滚动时，此方法可能会在短时间内触发多次。通过 index 判断当前请求是否应该继续
      let testImg = new Image()
      testImg.src = url
      const bindIndex = this.index
      const timer = window.setInterval(() => {
        if (this.index !== bindIndex) {
          // 如果要显示的图片发生了变化，则立即停止加载当前图片，避免浪费网络流量
          window.clearInterval(timer)
          testImg.src = ''
          testImg = null as any
          // 本来这里应该 reject 的，但是那样就需要在 await 的地方处理这个错误
          // 我不想处理错误，所以用 available 标记来偷懒
          return resolve({
            width: 0,
            height: 0,
            available: false,
          })
        } else {
          // 如果获取到了图片的宽高，也立即停止加载当前图片，并返回结果
          if (testImg.naturalWidth > 0) {
            const width = testImg.naturalWidth
            const height = testImg.naturalHeight
            window.clearInterval(timer)
            testImg.src = ''
            testImg = null as any
            return resolve({
              width,
              height,
              available: true,
            })
          }
        }
      }, 50)
    })
  }

  // 显示预览 wrap
  private async showWrap() {
    if (!this.workEL || !this.workData) {
      return
    }

    const url = this.replaceUrl(this.workData!.body.urls[settings.prevWorkSize])
    const size = await this.getImageSize(url)

    // getImageSize 可能需要花费比较长的时间。有时候在 getImageSize 之前是要显示 wrap 的，但是之后鼠标移出，需要隐藏 wrap，再之后 getImageSize 才执行完毕。
    // 所以此时需要再次判断是否要显示 wrap。如果不再次判断的话，可能有时候需要隐藏预览图，但是预览图却显示出来了
    if (!size.available || !this.show) {
      return
    }

    const w = size.width
    const h = size.height
    const cfg = {
      width: w,
      height: h,
      left: 0,
      top: 0,
    }

    // 每次显示图片时，都销毁旧的 img 元素，然后重新生成一个 img 元素，而不是修改之前的 img 元素的 src
    // 因为修改 src 的方式存在严重的问题：虽然 src 已经变化了，但是 img 元素显示的还是上一张图片（不管上一张图片是否加载完成）。等到新的图片完全加载完成后，img 才会变化。
    // 这会导致一些问题：
    // 1. 在新图片的加载过程中，用户无法看到加载进度。只能等到图片加载完成后瞬间完全显示出来。
    // 2. 在新图片的加载过程中，图片的宽高是新图片的宽高，但是显示的内容还是旧的图片。如果这两张图片的尺寸不一致，此时显示的（旧）图片看上去是变形的
    // 只有生成新的 img 元素，才能解决上面的问题
    this.img.src = ''
    this.img.remove()
    this.img = document.createElement('img')
    // 当图片加载完成时，预加载下一张图片
    this.img.onload = () => this.preload()
    this.img.src = url
    this.wrap.appendChild(this.img)

    // 1. 计算图片显示的尺寸
    const rect = this.workEL.getBoundingClientRect()

    // 不显示摘要信息时，也不显示边框，所以此时把 border 设置为 0
    this.border = settings.showPreviewWorkTip ? 4 : 0

    // 计算各个可用区域的尺寸，提前减去了 border、tip 等元素占据的空间
    const innerWidth = window.innerWidth - 17
    const leftSpace = rect.left - this.border
    const rightSpace = innerWidth - rect.right - this.border
    const xSpace = Math.max(leftSpace, rightSpace)

    const tipHeight = settings.showPreviewWorkTip ? this.tipHeight : 0
    const scrollBarHeight =
      window.innerHeight - document.documentElement.clientHeight
    const ySpace =
      window.innerHeight - scrollBarHeight - this.border - tipHeight

    // 宽高从图片宽高、可用区域的宽高中取最小值，使图片不会超出可视区域外
    // 竖图
    if (w < h) {
      cfg.height = Math.min(ySpace, h)
      cfg.width = (cfg.height / h) * w
      // 此时宽度可能会超过水平方向上的可用区域，则需要再次调整宽高
      if (cfg.width > xSpace) {
        cfg.height = (xSpace / cfg.width) * cfg.height
        cfg.width = xSpace
      }
    } else if (w > h) {
      // 横图
      if (this.allowOverThumb) {
        // 如果允许预览图覆盖在作品缩略图上，则预览图的最大宽度可以等于视口宽度
        if (w > innerWidth) {
          cfg.width = innerWidth
        }
      } else {
        // 否则，预览图的宽度不可以超过图片两侧的空白区域的宽度
        cfg.width = Math.min(xSpace, w)
      }

      cfg.height = (cfg.width / w) * h
      // 此时高度可能会超过垂直方向上的可用区域，则需要再次调整宽高
      if (cfg.height > ySpace) {
        cfg.width = (ySpace / cfg.height) * cfg.width
        cfg.height = ySpace
      }
    } else {
      // 正方形图片
      cfg.height = Math.min(ySpace, xSpace, h)
      cfg.width = cfg.height
    }

    // 上面计算的高度是图片的高度，现在计算 wrap 的宽高，需要加上内部其他元素的高度
    cfg.height = cfg.height + tipHeight

    // 2. 计算位置
    // 在页面可视区域内，比较缩略图左侧和右侧空间，把 wrap 显示在空间比较大的那一侧
    if (leftSpace >= rightSpace) {
      // 左侧空间大
      // 先让预览图的右侧贴着图片左侧边缘显示
      cfg.left = rect.left - cfg.width - this.border + window.scrollX
      // 如果预览图超出可视范围，则向右移动
      if (cfg.left < 0) {
        this.overThumb = true
        cfg.left = 0
      }
    } else {
      // 右侧空间大
      // 先让预览图的左侧贴着图片右侧边缘显示
      cfg.left = rect.right + window.scrollX
      // 如果预览图超出可视范围，则向左移动
      if (cfg.width > rightSpace) {
        this.overThumb = true
        cfg.left = cfg.left - (cfg.left + cfg.width - innerWidth) - this.border
      }
    }

    // 然后设置 top
    // 让 wrap 和缩略图在垂直方向上居中对齐
    cfg.top = rect.top
    const wrapHalfHeight = (cfg.height + this.border) / 2
    const workHalfHeight = rect.height / 2
    cfg.top = cfg.top - wrapHalfHeight + workHalfHeight

    // 检查 wrap 顶端是否超出了窗口可视区域
    if (cfg.top < 0) {
      cfg.top = 0
    }

    // 检查 wrap 底部是否超出了窗口可视区域
    const bottomOver = cfg.top + cfg.height + this.border - window.innerHeight
    if (bottomOver > 0) {
      // 如果底部超出了窗口可视区域，则计算顶部是否还有可用空间
      if (cfg.top > 0) {
        // 如果顶部还有空间可用，就尽量向上移动，但不会导致顶端超出可视区域
        cfg.top = cfg.top - Math.min(bottomOver, cfg.top) - scrollBarHeight
      }
    }

    // 3. 设置顶部提示区域的内容
    if (settings.showPreviewWorkTip) {
      const text = []
      const body = this.workData.body
      if (body.pageCount > 1) {
        text.push(`${this.index + 1}/${body.pageCount}`)
      }

      text.push(body.bookmarkCount)

      // 加载原图时，可以获取到每张图片的真实尺寸
      if (settings.prevWorkSize === 'original') {
        text.push(`${w}x${h}`)
      } else {
        // 如果加载的是普通尺寸，则永远显示第一张图的原始尺寸
        // 因为此时获取不到后续图片的原始尺寸
        text.push(`${this.workData.body.width}x${this.workData.body.height}`)
      }
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
    this.img.style.height = cfg.height - tipHeight + 'px'
    const styleArray: string[] = []
    for (const [key, value] of Object.entries(cfg)) {
      styleArray.push(`${key}:${value}px;`)
    }
    styleArray.push('display:block;')

    // 如果不显示摘要信息，覆写一些样式
    if (!settings.showPreviewWorkTip) {
      styleArray.push('border:none;')
      styleArray.push('box-shadow:none;')
    }

    this.wrap.setAttribute('style', styleArray.join(''))

    // 每次显示图片后，传递图片的 url
    this.sendUrls()

    // 预览动图
    if (settings.previewUgoira && this.workData.body.illustType === 2) {
      this.previewUgoira = new PreviewUgoira(
        this.workData.body.id,
        this.wrap,
        settings.prevWorkSize,
        cfg.width,
        cfg.height - tipHeight
      )
      // 需要显式传递 wrap 的宽高，特别是高度。因为需要减去顶部提示区域的高度
    }
  }

  private replaceUrl(url: string) {
    return url.replace('p0', `p${this.index}`)
  }

  private sendUrls() {
    const data = this.workData
    if (!data) {
      return
    }
    // 传递图片的 url，但是不传递尺寸。
    // 因为预览图片默认加载“普通”尺寸的图片，但是 showOriginSizeImage 默认显示“原图”尺寸。
    // 而且对于第一张之后的图片，加载“普通”尺寸的图片时，无法获取“原图”的尺寸。
    showOriginSizeImage.setData(
      {
        original: this.replaceUrl(data.body.urls.original),
        regular: this.replaceUrl(data.body.urls.regular),
      },
      data
    )
  }
}

new PreviewWork()
