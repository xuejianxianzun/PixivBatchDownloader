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
import { lang } from './Language'
import { Colors } from './Colors'
import { DateFormat } from './utils/DateFormat'
import { showHelp } from './ShowHelp'
import { store } from './store/Store'
import { Config } from './Config'
import { previewWorkDetailInfo } from './PreviewWorkDetailInfo'
import { Tools } from './Tools'
import { bookmark } from './Bookmark'
import { pageType } from './PageType'
import { copyWorkInfo } from './CopyWorkInfo'
import { displayThumbnailListOnMultiImageWorkPage } from './pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'

// 鼠标停留在作品的缩略图上时，预览作品
class PreviewWork {
  constructor() {
    if (Config.mobile) {
      return
    }

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
  private readonly tipHeight = 23

  // 保存当前鼠标经过的缩略图的数据
  private workId = ''
  private workEL?: HTMLElement
  private workData?: ArtworkData

  // 显示作品中的第几张图片
  private index = 0
  // 保存每个预览过的作品的 index。当用户再次预览这个作品时，可以恢复上次的进度
  private indexHistory: { [key: string]: number } = {}

  /**切换页面后，在一定时间内（500 ms）不允许触发图片预览功能 */
  // 这是为了缓解有时新页面加载后，会显示旧页面里的图片的预览的问题。
  // 触发方式是：先点击一个作品，然后快速把鼠标移动到相邻的另一个作品上面
  // 在点击第一个作品后，会打开它的页面，但这需要一定的加载时间
  // 所以旧页面上的内容依然会存在一段时间，不会立即消失（这就是触发 BUG 的窗口期）
  // 在此期间把鼠标移动到另一个作品上面，就可能触发它的预览
  // 之后新页面加载出来了，但另一个作品的预览也显示出来了
  // 所以我设置了一个延迟时间来缓解此问题，使其出现频率大幅下降
  private dontShowAfterPageSwitch = false
  // PS：新页面加载的时间越久，越容易出现这个问题，因为窗口期变长了
  // 如果点击作品后，很快就加载了新的页面内容，那就不容易触发此问题
  // PS：点击超链接之后，浏览器地址栏里的 URL 是立即变化的，也就是立即触发了 pageSwitch 事件，
  // 但页面内容需要时间来加载，所以不能用 pageSwitch 事件来解决此问题，因为在它触发之后是有窗口期的

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
      // 这两个判断条件其实是等价的
      // 因为在 show 之前会先获取作品数据
      // 所以如果在这里获取不到作品数据，说明用户在等待请求期间移动了鼠标到另一个没有获取过数据的作品上
      // 现在的作品已经不是前面请求的那个作品了
      if (!this.workData || this.workData.body.id !== this.workId) {
        this.readyShow()
      } else {
        // 准备显示预览
        if (this.dontShowAfterPageSwitch) {
          return
        }

        // 显示作品的详细信息
        if (
          settings.PreviewWorkDetailInfo &&
          displayThumbnailListOnMultiImageWorkPage.checkLI(this.workEL) ===
            false
        ) {
          EVT.fire('showPreviewWorkDetailPanel', this.workData)
        }

        this.sendURLs()

        this._show = true
        showOriginSizeImage.hide()
        this.showWrap()
        window.clearTimeout(this.delayHiddenTimer)
        if (!Config.mobile) {
          showHelp.show(
            'tipPreviewWork',
            lang.transl('_预览作品的快捷键说明'),
            lang.transl('_预览作品')
          )
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

      EVT.fire('previewEnd')
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
      if (this.dontShowAgain || this.dontShowAfterPageSwitch) {
        return
      }
      // 当鼠标进入到不同作品时
      // 隐藏之前的预览图
      if (this.workId !== id) {
        this.show = false
        // 设置 index
        this.index = this.indexHistory[id] || 0
      }

      // 在在多图作品的缩略图列表上触发时，使用 data-index 属性的值作为 index
      if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
        const _index = Number.parseInt(el.dataset!.index!)
        this.index = _index
      }

      this.workId = id
      this.workEL = el

      // 判断是插画还是动图，然后根据设置决定是否加载作品数据
      // 动图有一个特定元素：circle，就是播放按钮的圆形背景
      // 需要注意：在某些页面里没有这个元素，比如浏览历史里。
      // 不过现在下载器也没有支持浏览历史页面，所以没有影响。
      const ugoira = el.querySelector('circle')
      const show = ugoira ? settings.previewUgoira : settings.PreviewWork
      show && this.readyShow()

      el.addEventListener('wheel', this.onWheelScroll, {
        passive: false,
      })
    })

    artworkThumbnail.onLeave((el: HTMLElement) => {
      // 当鼠标离开作品缩略图时，有可能是因为显示了作品详细信息的面板。此时让预览图保持显示
      if (previewWorkDetailInfo.show) {
        return
      }

      if (this.overThumb) {
        // 如果预览图遮挡了作品缩略图，就需要延迟隐藏预览图。
        // 因为预览图显示之后，鼠标可能处于预览图上，这会触发此事件。
        // 如果不延迟隐藏，预览图就会马上消失，无法查看
        this.delayHiddenTimer = window.setTimeout(() => {
          this.show = false
          el.removeEventListener('wheel', this.onWheelScroll)
        }, 100)
      } else {
        this.show = false
        el.removeEventListener('wheel', this.onWheelScroll)
      }
    })

    window.addEventListener(
      'keydown',
      (ev) => {
        // 当用户按下 Ctrl 时，不启用下载器的热键，以避免快捷键冲突或重复生效
        // 例如，预览作品时按 C 可以下载，但是当用户按下 Ctrl + C 时其实是想复制，此时不应该下载
        if (ev.ctrlKey || ev.shiftKey || ev.metaKey) {
          return
        }

        // 当用户按下 Alt 时
        if (ev.altKey) {
          // 可以使用 Alt + P 快捷键来启用/禁用此功能
          if (ev.code === 'KeyP') {
            setSetting('PreviewWork', !settings.PreviewWork)
            // 显示提示信息
            if (settings.PreviewWork) {
              const msg = 'Preview works - On'
              toast.success(msg)
            } else {
              const msg = 'Preview works - Off'
              toast.warning(msg)
            }
            return
          } else if (ev.code === 'KeyC') {
            // 使用快捷键 Alt + C 调用复制功能
            if (this.show && this.workData) {
              //在预览时按下的话需要阻止传播，因为在作品页面里也监听了 Alt + C，需要避免多次执行。
              ev.stopPropagation()
              ev.preventDefault()
              copyWorkInfo.receive(
                {
                  type: 'illusts',
                  id: this.workData!.body.id,
                },
                this.index
              )
            }
            return
          }
        }

        // 使用 Esc 键关闭当前预览
        if (ev.code === 'Escape' && this.show) {
          this.show = false
          // 并且不再显示这个作品的预览图，否则如果鼠标依然位于这个作品上，就会马上再次显示缩略图了
          // 当鼠标移出这个作品的缩略图之后会取消此限制
          this.dontShowAgain = true
        }

        // 翻页时关闭当前预览
        // 这是为了处理边界情况。常见的触发方式是预览一个横图作品，且鼠标处于预览图之上
        // 此时翻页的话，虽然作品区域已经变化，但由于鼠标一直停留在预览图上，预览图就不会消失
        // 此时需要强制关闭预览
        if (ev.code === 'PageUp' || ev.code === 'PageDown') {
          if (this.show) {
            this.show = false
          }
        }

        // 预览作品时，可以使用快捷键 D 下载这个作品
        if (ev.code === 'KeyD' && this.show) {
          EVT.fire('crawlIdList', [
            {
              type: 'illusts',
              id: this.workData!.body.id,
            },
          ])
        }

        // 预览作品时，可以使用快捷键 C 仅下载当前显示的图片
        if (ev.code === 'KeyC' && this.show) {
          // 在作品页面内按 C 时，Pixiv 会把焦点定位到评论输入框里，这里阻止此行为
          ev.stopPropagation()

          if (this.workData!.body.pageCount > 1) {
            store.setDownloadOnlyPart(Number.parseInt(this.workData!.body.id), [
              this.index,
            ])
          }

          EVT.fire('crawlIdList', [
            {
              type: 'illusts',
              id: this.workData!.body.id,
            },
          ])
        }

        // 预览作品时，可以使用快捷键 B 收藏这个作品
        if (ev.code === 'KeyB' && this.show) {
          // 阻止 Pixiv 对按下 B 键的行为
          ev.stopPropagation()
          this.addBookmark()
        }

        // 预览作品时，可以使用方向键切换图片，也可以使用空格键切换到下一张图片
        if (
          ev.code === 'ArrowLeft' ||
          ev.code === 'ArrowRight' ||
          ev.code === 'ArrowUp' ||
          ev.code === 'ArrowDown' ||
          ev.code === 'Space'
        ) {
          if (this.show && settings.swicthImageByKeyboard) {
            // 阻止事件冒泡和默认事件
            // 阻止事件冒泡用来阻止 Pixiv 使用左右键来切换作品的功能
            // 阻止默认事件用来阻止上下键和空格键滚动页面的功能
            ev.stopPropagation()
            ev.preventDefault()
            const prev = ev.code === 'ArrowLeft' || ev.code === 'ArrowUp'
            this.swicthImage(prev ? 'prev' : 'next')
          }
        }
      },
      true
    )

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

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.dontShowAfterPageSwitch = true
      window.setTimeout(() => {
        this.dontShowAfterPageSwitch = false
      }, 500)
    })

    // 当作品的详情面板隐藏时，鼠标位置可能在作品缩略图之外。所以此时需要检测鼠标位置，决定是否需要隐藏预览图
    window.addEventListener(
      EVT.list.PreviewWorkDetailPanelClosed,
      (ev: CustomEventInit) => {
        const data = ev.detail?.data as {
          x: number
          y: number
        }

        if (this.mouseInElementArea(this.workEL, data.x, data.y) === false) {
          this.show = false
        }
      }
    )

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
      // 当鼠标移出这个作品的缩略图之后会取消此限制
      if (this.mouseInElementArea(this.workEL, ev.clientX, ev.clientY)) {
        this.dontShowAgain = true
      }
    })

    this.wrap.addEventListener(
      'wheel',
      (ev) => {
        this.overThumb && this.onWheelScroll(ev)
      },
      {
        passive: false,
      }
    )

    window.addEventListener(
      EVT.list.wheelScrollSwitchPreviewImage,
      (ev: CustomEventInit) => {
        const mouseEvent = ev.detail.data
        mouseEvent && this.onWheelScroll(mouseEvent)
      }
    )
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
  // 此事件必须使用节流，因为有时候鼠标滚轮短暂的滚动一下就会触发 2 次 wheel 事件
  private swicthImageByMouse = Utils.throttle(() => {
    const up = this.wheelEvent!.deltaY < 0
    this.swicthImage(up ? 'prev' : 'next')
  }, 100)

  private swicthImage(operate: 'prev' | 'next') {
    const count = this.workData!.body.pageCount
    if (operate === 'prev') {
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

    this.indexHistory[this.workId] = this.index

    this.showWrap()
  }

  private onWheelScroll = (ev: Event) => {
    if (
      this.show &&
      settings.wheelScrollSwitchImageOnPreviewWork &&
      this.workData!.body.pageCount > 1
    ) {
      ev.preventDefault()
      this.wheelEvent = ev as WheelEvent
      this.swicthImageByMouse()
    }
  }

  private async addBookmark() {
    if (this.workData?.body.illustId === undefined) {
      return
    }

    toast.show(lang.transl('_收藏'), {
      bgColor: Colors.bgBlue,
    })

    const status = await bookmark.add(
      this.workData.body.illustId,
      'illusts',
      Tools.extractTags(this.workData!)
    )

    if (status === 200) {
      toast.success(lang.transl('_已收藏'))
    }

    if (status === 403) {
      toast.error(`403 Forbidden, ${lang.transl('_你的账号已经被Pixiv限制')}`)
      return
    }

    // 将作品缩略图上的收藏按钮变成红色
    const allSVG = this.workEL!.querySelectorAll('svg')
    if (allSVG.length > 0) {
      // 如果有多个 svg，一般最后一个是收藏按钮
      let useSVG = allSVG[allSVG.length - 1]

      // 但有些特殊情况是第一个
      if (pageType.type === pageType.list.Request) {
        useSVG = allSVG[0]
      }

      // 多图作品里可能有两个 svg，一个是右上角的图片数量，一个是收藏按钮
      // 区别是收藏按钮在 button 元素里
      const btnSVG = this.workEL!.querySelector('button svg') as SVGSVGElement
      if (btnSVG) {
        useSVG = btnSVG
      }

      useSVG.style.color = 'rgb(255, 64, 96)'
      const allPath = useSVG.querySelectorAll('path')
      for (const path of allPath) {
        path.style.fill = 'currentcolor'
      }
    }

    // 排行榜页面的收藏按钮
    const btn = this.workEL!.querySelector('._one-click-bookmark')
    if (btn) {
      btn.classList.add('on')
    }
  }

  private readyShow() {
    this.delayShowTimer = window.setTimeout(async () => {
      if (!cacheWorkData.has(this.workId)) {
        // 如果在缓存中没有找到这个作品的数据，则发起请求
        try {
          const data = await API.getArtworkData(this.workId)
          cacheWorkData.set(data)
        } catch (error: Error | any) {
          if (error.status && error.status === 429) {
            toast.error('429 Error')
          }
          this.show = false
          return
        }
      }

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

    const url = this.replaceURL(this.workData!.body.urls[settings.prevWorkSize])
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
      const text: string[] = []
      const body = this.workData.body

      if (body.pageCount > 1) {
        text.push(`<span class="index flag">
          <svg viewBox="0 0 10 10" width="12" height="12"><path fill="currentColor" d="M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10
    C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1
    C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8
    0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z"></path></svg>
    ${this.index + 1}/${body.pageCount}
    </span>`)
      }

      if (
        body.aiType === 2 ||
        body.tags.tags.some((tag) => tag.tag === 'AI生成')
      ) {
        text.push('<span class="ai flag">AI</span>')
      }

      if (body.xRestrict === 1) {
        text.push('<span class="r18 flag">R-18</span>')
      } else if (body.xRestrict === 2) {
        text.push('<span class="r18 flag">R-18G</span>')
      }

      // 显示收藏数量
      text.push(`<span class="bmk flag">
        <svg viewBox="0 0 12 12" width="12" height="12"><path fill="currentColor" d="
      M9,0.75 C10.6568542,0.75 12,2.09314575 12,3.75 C12,6.68851315 10.0811423,9.22726429 6.24342696,11.3662534
      L6.24342863,11.3662564 C6.09210392,11.4505987 5.90790324,11.4505988 5.75657851,11.3662565
      C1.9188595,9.22726671 0,6.68851455 0,3.75 C1.1324993e-16,2.09314575 1.34314575,0.75 3,0.75
      C4.12649824,0.75 5.33911281,1.60202454 6,2.66822994 C6.66088719,1.60202454 7.87350176,0.75 9,0.75 Z"></path></svg>
      ${body.bookmarkCount.toString()}
      </span>`)

      // 加载原图时，可以获取到每张图片的真实尺寸
      if (settings.prevWorkSize === 'original') {
        text.push(`${w}x${h}`)
      } else {
        // 如果加载的是普通尺寸，则永远显示第一张图的原始尺寸
        // 因为此时获取不到后续图片的原始尺寸
        text.push(`${this.workData.body.width}x${this.workData.body.height}`)
      }
      text.push(DateFormat.format(body.createDate, 'YYYY/MM/DD'))
      text.push(body.title)
      // 把简介里的换行替换成空格。因为简介区域只有一行，为了尽量多的显示简介文本，所以取消换行
      text.push(body.description.replaceAll('<br />', '&nbsp;'))

      this.tip.innerHTML = text
        .map((str) => {
          if (str.startsWith('<span')) {
            return str
          }
          return `<span>${str}</span>`
        })
        .join('')
      this.tip.style.display = 'flex'
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
    this.sendURLs()

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

  private replaceURL(url: string) {
    return url.replace('p0', `p${this.index}`)
  }

  private sendURLs() {
    const data = this.workData
    if (!data) {
      return
    }
    // 传递图片的 url，但是不传递尺寸。
    // 因为预览图片默认加载“普通”尺寸的图片，但是 showOriginSizeImage 默认显示“原图”尺寸。
    // 而且对于第一张之后的图片，加载“普通”尺寸的图片时，无法获取“原图”的尺寸。
    showOriginSizeImage.setData(
      {
        original: this.replaceURL(data.body.urls.original),
        regular: this.replaceURL(data.body.urls.regular),
      },
      data,
      this.index
    )
  }
}

new PreviewWork()
