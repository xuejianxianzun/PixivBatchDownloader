import { EVT } from './EVT'
import { theme } from './Theme'
import { settings } from './setting/Settings'
import { ArtworkData } from './crawl/CrawlResult'
import { Tools } from './Tools'
import { Utils } from './utils/Utils'
import { lang } from './Language'
import { toast } from './Toast'
import { copyWorkInfo } from './CopyWorkInfo'
import { artworkThumbnail } from './ArtworkThumbnail'
import { displayThumbnailListOnMultiImageWorkPage } from './pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'
import { cacheWorkData } from './store/CacheWorkData'
import { states } from './store/States'
import { previewWork } from './PreviewWork'

// 当鼠标停留在作品缩略图上时，显示详细信息
class PreviewWorkDetailInfo {
  constructor() {
    this.bindEvents()
  }

  // 在进入缩略图时，如果 workId 与上一次显示时的 workId 相同，就不会再次显示详情面板
  private workId = ''
  private workEl: HTMLElement | null = null

  private resetWorkIdTimer: number | undefined = undefined
  // 启动延迟清除 workId 的定时器的时机：1. 关闭详情面板之后 2. 鼠标移出了作品缩略图区域（这可能是因为面板显示了）
  // 但是期间一旦触发了特定事件，就取消重置操作：1. 显示详情面板 2. 鼠标进入了作品缩略图（这可能是因为面板被关闭了）
  // 这样短时间内在同一个作品的缩略图上重复触发 onEnter 事件时，不会重复显示详情面板

  // 保存鼠标位置
  private mouseX = 0
  private mouseY = 0

  public show = false
  private delayShowTimer: number | undefined = undefined

  /** 是否由图片查看器打开。这种模式下：面板总是显示（不受 PreviewWorkDetailInfo 设置限制）、
   * 固定在图片查看器的按钮上方、总是使用暗色主题。
   * 关闭方式与平时相同：点击面板（包括它上面的按钮）就会关闭；只是鼠标移出时不关闭，
   * 因为鼠标需要从按钮移动到面板上 */
  private fromImageViewer = false
  /** 图片查看器里的「作品信息」按钮，面板显示在它的上方 */
  private viewerAnchor: HTMLElement | null = null

  /** 面板与预览区域之间保留的间距 */
  private readonly gapWithPreview = 10
  /** 面板与屏幕边缘之间保留的最小间距 */
  private readonly edgeSpace = 10

  /** 当前显示的面板的位置和尺寸（视口坐标）。面板没有显示时为 null */
  private panelArea: {
    left: number
    top: number
    width: number
    height: number
  } | null = null

  /** 面板是否被移动到了鼠标之外的位置（例如为了避开预览区域）。
   * 此时鼠标不在面板上，面板接收不到 mouseleave 事件，需要用其他方式关闭面板 */
  private panelDetachedFromMouse = false

  /** 当前显示的面板对应的作品缩略图。鼠标在这个缩略图上时，面板应该保持显示 */
  private panelWorkEl: HTMLElement | null = null

  /** 当前显示的面板元素 */
  private panelEl: HTMLDivElement | null = null

  /** 等待预览区域出现的最长时间（毫秒）。
   * 超过这个时间还没等到（例如图片加载比较慢、或者加载失败），就直接显示面板，避免面板长时间不出现。
   * 此时面板会先显示在鼠标处，等预览区域出现后可能再移动一次位置，这是可以接受的 */
  private readonly waitPreviewAreaTimeout = 500

  /** 正在等待预览区域出现的面板。等待期间面板是隐藏的，避免显示之后又跳位置 */
  private pendingPanel: {
    wrap: HTMLDivElement
    rect: DOMRect
    timer: number
  } | null = null

  private bindEvents() {
    artworkThumbnail.onEnter((el: HTMLElement, id: string, ev: MouseEvent) => {
      window.clearTimeout(this.resetWorkIdTimer)

      if (id === '') {
        return
      }

      if (id === this.workId) {
        // 鼠标经过缩略图上的按钮时，会取消详情面板的延迟显示；
        // 之后如果鼠标从按钮上回到（落入）缩略图时，需要重新启动延迟显示，否则这次就不会显示详情面板
        if (
          ev.relatedTarget instanceof HTMLElement &&
          ev.relatedTarget.classList.contains('btnOnThumb')
        ) {
          this.workEl = el
          this.readyShow()
        }
        return
      }

      // 在多图作品的缩略图列表上触发时，不执行
      if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
        return
      }

      this.workId = id
      this.workEl = el
      this.readyShow()
    })

    artworkThumbnail.onLeave(() => {
      window.clearTimeout(this.delayShowTimer)
      // 面板还没显示出来时，鼠标就离开了缩略图，此时不需要再显示面板了
      this.cancelPendingPanel()
      this.delayResetWorkId()
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.remove()
    })

    // 图片查看器里点击「作品信息」按钮：切换详情面板的显示 / 隐藏
    window.addEventListener(
      EVT.list.toggleImageViewerDetailInfo,
      (ev: CustomEventInit) => {
        const data = ev.detail?.data as {
          anchor: HTMLElement
          workData?: ArtworkData
        }
        if (!data?.anchor || !data.workData) {
          return
        }
        this.toggleFromImageViewer(data.anchor, data.workData)
      }
    )

    // 点击图片查看器里的其他按钮、关闭图片查看器：隐藏详情面板
    window.addEventListener(EVT.list.hideImageViewerDetailInfo, () => {
      this.hideFromImageViewer()
    })

    window.addEventListener('mousemove', (ev) => {
      this.mouseX = ev.clientX
      this.mouseY = ev.clientY
      this.checkCloseWhenDetached(ev.clientX, ev.clientY)
    })

    // 预览区域显示出来、或者切换了预览图之后，预览区域的位置和尺寸会发生变化，
    // 此时详情面板可能又遮挡了预览区域，所以需要重新调整面板的位置
    window.addEventListener(EVT.list.previewWorkWrapPositioned, () => {
      // 面板正在等待预览区域出现：现在可以显示它了
      if (this.pendingPanel) {
        this.showPendingPanel()
        return
      }

      this.adjustPosition()
    })

    window.addEventListener(
      'keydown',
      (ev) => {
        // 从图片查看器打开时，Esc 留给查看器（查看器会因此关闭，面板随之关闭）。
        // 否则两个监听器都会响应同一次 Esc，导致面板和查看器一起关闭
        if (ev.key === 'Escape' && this.show && !this.fromImageViewer) {
          ev.stopPropagation()
          ev.preventDefault()
          this.remove()
        }
      },
      {
        capture: true,
        passive: true,
      }
    )
  }

  /** 由图片查看器的「作品信息」按钮调用：显示或隐藏详情面板。
   *
   * 从查看器打开时总是显示，不检查 PreviewWorkDetailInfo 设置。
   * @param anchor 图片查看器里的按钮，面板显示在它的上方
   * @param workData 作品数据。查看器里已经有这个数据了，不需要再次请求 */
  public async toggleFromImageViewer(
    anchor: HTMLElement,
    workData: ArtworkData
  ) {
    if (this.show) {
      const openedFromViewer = this.fromImageViewer
      this.remove()
      // 这次点击是「隐藏」，不要再打开
      if (openedFromViewer) {
        return
      }
    }

    this.fromImageViewer = true
    this.viewerAnchor = anchor
    await this.create(workData)
  }

  /** 隐藏由图片查看器打开的详情面板。
   * 点击图片查看器里的其他按钮、关闭图片查看器时调用 */
  public hideFromImageViewer() {
    if (this.fromImageViewer) {
      this.remove()
    }
  }

  private readyShow() {
    window.clearTimeout(this.delayShowTimer)
    this.delayShowTimer = window.setTimeout(async () => {
      this.create()
    }, settings.previewWorkWait)
  }

  // 关闭详情面板之后，延迟一段时间再重置 workId，避免在同一个作品上重复显示详情面板
  private delayResetWorkId() {
    window.clearTimeout(this.resetWorkIdTimer)

    // 如果详情面板是显示的，则不重置 workId。这样在关闭面板之后，如果鼠标落到下方的同一个缩略图上，不会重复触发显示面板的事件
    if (this.show) {
      return
    }

    this.resetWorkIdTimer = window.setTimeout(() => {
      // 处理三层重叠元素的情况：作品缩略图（最底层）- 预览作品或缩略图上的按钮（中间层）- 详情面板（最上层）
      // 有时详情面板会重叠在其他元素上方。当点击面板使其消失时，如果鼠标仍处于缩略图区域内，不应该重置 workId，因为此时不满足重置条件。此时重置的话，当中间的元素消失，或者鼠标从中间元素移动到缩略图上时，，就会再次触发显示详情面板的事件，导致面板再次出现
      const mouseInThumbnailArea = Utils.mouseInElementArea(
        this.workEl || undefined,
        this.mouseX,
        this.mouseY
      )
      if (mouseInThumbnailArea) {
        return
      }

      this.workId = ''
    }, 300)
  }

  private async create(viewerWorkData?: ArtworkData) {
    // 从图片查看器打开时总是显示，不检查 PreviewWorkDetailInfo 设置
    if (this.show || (!viewerWorkData && !settings.PreviewWorkDetailInfo)) {
      return
    }

    this.show = true
    states.previewWorkDetailInfoPanelIsShow = true
    window.clearTimeout(this.resetWorkIdTimer)
    // 记录这个面板对应的缩略图。鼠标位于这个缩略图上时，即使面板被移动到鼠标之外也应该保持显示
    // 从图片查看器打开的面板不对应任何缩略图
    this.panelWorkEl = viewerWorkData ? null : this.workEl

    // 请求作品数据。失败时返回 undefined（不抛出），由下面统一处理
    let fetchedData: ArtworkData | undefined = viewerWorkData
    if (!fetchedData) {
      try {
        fetchedData = await cacheWorkData.getWorkDataAsync(
          this.workId,
          'artwork'
        )
      } catch {
        fetchedData = undefined
      }
    }

    // 等待数据期间面板可能已经被关闭了（例如用户又点了一次按钮），此时不要再创建
    if (!this.show) {
      return
    }

    // 获取数据失败（或者数据不完整）时不要创建面板，并且要复位状态，
    // 否则 show 和 states 会一直是 true，导致预览作品一直保持显示
    if (!fetchedData || !fetchedData.body) {
      this.remove()
      return
    }

    const workData = fetchedData

    const wrap = document.createElement('div')

    // 设置文字内容
    // 生成 tag 内容
    const tagsHTML: string[] = []
    for (const item of workData.body.tags.tags) {
      const array: string[] = []
      const link = `https://www.pixiv.net/tags/${item.tag}/artworks`
      array.push(
        `<span class="origin"><a href="${link}" target="_blank">#${item.tag}</a></span>`
      )
      if (item.translation?.en) {
        array.push(
          `<span class="transl"><a href="${link}" target="_blank">${item.translation?.en}</a></span>`
        )
      }
      tagsHTML.push(`<span>${array.join('')}</span>`)
    }

    // 生成收藏数、点赞数、浏览量一栏
    const bmkHTML: string[] = []
    const schema = [
      {
        title: 'bookmark',
        icon: `<svg viewBox="0 0 12 12" width="12" height="12"><path fill="currentColor" d="
      M9,0.75 C10.6568542,0.75 12,2.09314575 12,3.75 C12,6.68851315 10.0811423,9.22726429 6.24342696,11.3662534
      L6.24342863,11.3662564 C6.09210392,11.4505987 5.90790324,11.4505988 5.75657851,11.3662565
      C1.9188595,9.22726671 0,6.68851455 0,3.75 C1.1324993e-16,2.09314575 1.34314575,0.75 3,0.75
      C4.12649824,0.75 5.33911281,1.60202454 6,2.66822994 C6.66088719,1.60202454 7.87350176,0.75 9,0.75 Z"></path></svg>`,
        number: workData.body.bookmarkCount,
      },
      {
        title: 'like',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path fill="#858585" d="M2 6a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4zM2.11 8.89a1 1 0 011.415-1.415 3.5 3.5 0 004.95 0 1 1 0 011.414 1.414 5.5 5.5 0 01-7.778 0z"/></svg>`,
        number: workData.body.likeCount,
      },
      {
        title: 'view',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 12" width="12" height="12"><path fill="#858585" d="M0 6c2-3.333 4.333-5 7-5s5 1.667 7 5c-2 3.333-4.333 5-7 5S2 9.333 0 6z"/><path fill="#fff" d="M7 8.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm0-1a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>`,
        number: workData.body.viewCount,
      },
    ]

    for (const cfg of schema) {
      bmkHTML.push(`
      <span class="item" title="${cfg.title}">
        <span>${cfg.icon}</span>
        <span>${Tools.numberToString(cfg.number)}</span>
      </span class="item">
      `)
    }

    // 生成 R-18(G) 标记
    let r18HTML = ''
    if (workData.body.xRestrict === 1) {
      r18HTML = '<span class="r18">R-18</span>'
    } else if (workData.body.xRestrict === 2) {
      r18HTML = '<span class="r18">R-18G</span>'
    }

    // 判断是不是 AI 生成的作品
    let aiHTML = ''
    const tagsWithTransl: string[] = Tools.extractTags(
      workData,
      'both',
      'check'
    )
    let aiType = workData.body.aiType
    if (aiType !== 2) {
      if (Tools.checkAIFromTags(tagsWithTransl)) {
        aiType = 2
      }
    }

    if (aiType === 2) {
      aiHTML = '<span class="ai">AI</span>'
    }

    // 添加“原创”标记
    let originHTML = ''
    if (workData.body.isOriginal) {
      const originalMark = Tools.getOriginalMark()
      originHTML = `<span class="origin">${originalMark}</span>`
    }

    wrap.innerHTML = `
        <div class="content">
          <p class="flags">${r18HTML} ${aiHTML} ${originHTML}</p>
          <p class="title">${workData.body.title}</p>
          <p class="desc">${workData.body.description}</p>
          <p class="tags">${tagsHTML.join('')}</p>
          <p class="size">${workData.body.width} x ${workData.body.height}</p>
          <p class="bmk">${bmkHTML.join('')}</p>
          <p class="date">${new Date(
            workData.body.uploadDate
          ).toLocaleString()}</p>
          <p class="buttons">
            <button class="textButton" id="copyTXT">Copy TXT</button>
            <button class="textButton" id="copyJSON">Copy JSON</button>
            <button class="textButton" id="copyURL">Copy URL</button>
            <button class="textButton" id="copyBtn">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#copy"></use>
              </svg>
            </button>
          </p>
        </div>
      `

    // 按钮功能
    wrap.querySelector('#copyTXT')!.addEventListener('click', () => {
      this.copyTXT(workData, aiType)
    })

    wrap.querySelector('#copyJSON')!.addEventListener('click', () => {
      this.copyJSON(workData)
    })

    wrap.querySelector('#copyURL')!.addEventListener('click', () => {
      const url = `https://www.pixiv.net/artworks/${workData.body.id}`
      this.copy(url)
    })

    wrap.querySelector('#copyBtn')!.addEventListener('click', () => {
      copyWorkInfo.receive({
        id: workData.body.id,
        type: 'illusts',
      })
    })

    // 取消超链接的跳转确认，也就是把跳转链接替换为真正的链接
    const allLink = wrap.querySelectorAll('a')
    for (const a of allLink) {
      if (a.href.includes('jump.php')) {
        a.href = a.innerText
      }
    }

    // 设置样式
    wrap.classList.add('xz_PreviewWorkDetailPanel', 'beautify_scrollbar')
    wrap.style.width = settings.PreviewDetailInfoWidth + 'px'

    // 点击面板的任何位置（包括它上面的按钮）都关闭面板。
    // 按钮自己的点击处理绑在按钮上，会先执行，所以复制之类的功能不受影响
    wrap.addEventListener('click', (ev) => {
      this.remove(wrap, ev.clientX, ev.clientY)
    })

    // 由缩略图触发的面板，鼠标移出时也关闭。
    // 从查看器打开时不这样做：鼠标需要从按钮移动到面板上，中途会短暂离开面板区域
    if (!this.fromImageViewer) {
      wrap.addEventListener('mouseleave', (ev) => {
        // 面板为了避开预览区域而被移动到鼠标之外时，会因此触发一次 mouseleave。
        // 这种情况下面板本来就不在鼠标上，不能关闭它（关闭后这个功能就没意义了）。
        // 此时由 checkCloseWhenDetached 在鼠标移动时判断是否需要关闭面板
        if (this.panelDetachedFromMouse) {
          return
        }
        // 必须把事件里的坐标传给 remove：mouseleave 比 mousemove 先派发，
        // 此时 this.mouseX/mouseY 还是上一次移动时的旧坐标
        this.remove(wrap, ev.clientX, ev.clientY)
      })
    }

    wrap.addEventListener(
      'wheel',
      (ev) => {
        // 只有预览作品时的滚轮才用于切换预览图；查看器里的面板只需要正常滚动
        if (this.show && !this.fromImageViewer) {
          ev.preventDefault()
          EVT.fire('wheelScrollSwitchPreviewImage', ev)
        }
      },
      {
        passive: false,
      }
    )

    if (this.fromImageViewer) {
      // 图片查看器总是暗色模式，所以它也总是使用暗色主题。
      // 这里不使用 theme.register()，因为它会跟随下载器的主题设置
      wrap.classList.add('theme-dark')
    } else {
      theme.register(wrap)
    }

    document.body.append(wrap)
    this.panelEl = wrap

    const rect = wrap.getBoundingClientRect()

    if (this.fromImageViewer && this.viewerAnchor) {
      this.positionAboveViewerAnchor(wrap, rect)
      wrap.style.opacity = '1'
      return
    }

    // 启用了预览作品时，等预览区域出现之后才显示面板。
    // 否则面板会先显示在鼠标处，等预览区域出现后再被移动到它外侧，出现一次位置跳变
    if (this.shouldWaitPreviewArea(workData)) {
      this.waitPreviewArea(wrap, rect)
      return
    }

    this.positionAtMouse(wrap, rect)
    wrap.style.opacity = '1'
  }

  /** 是否应该等预览区域出现之后再显示面板。
   * 只有在启用了预览作品、这个作品可以预览、并且预览区域还没有显示时才需要等待 */
  private shouldWaitPreviewArea(workData: ArtworkData) {
    if (!previewWork.canPreview(workData)) {
      return false
    }

    // 预览区域已经显示出来了（例如鼠标重新进入了同一个缩略图），不需要等待
    return previewWork.getPreviewAreaRect() === null
  }

  /** 先隐藏面板，等预览区域出现之后再显示它。
   * 如果一直等不到（例如预览图加载失败），超时之后直接显示面板 */
  private waitPreviewArea(wrap: HTMLDivElement, rect: DOMRect) {
    // 等待期间面板不能显示，也不能接收鼠标事件：
    // 否则鼠标会被面板挡住，缩略图的悬停状态也会丢失
    wrap.style.display = 'none'

    const timer = window.setTimeout(() => {
      this.showPendingPanel()
    }, this.waitPreviewAreaTimeout)

    this.pendingPanel = { wrap, rect, timer }
  }

  /** 显示等待中的面板。此时预览区域已经出现（或者已经等待超时）。
   * 等待期间鼠标可能移动过，所以按照最新的位置重新计算 */
  private showPendingPanel() {
    const pending = this.pendingPanel
    if (!pending) {
      return
    }

    this.pendingPanel = null
    window.clearTimeout(pending.timer)

    pending.wrap.style.display = ''
    this.positionAtMouse(pending.wrap, pending.rect)
    pending.wrap.style.opacity = '1'
  }

  /** 取消正在等待显示的面板 */
  private cancelPendingPanel() {
    const pending = this.pendingPanel
    if (!pending) {
      return
    }

    this.pendingPanel = null
    window.clearTimeout(pending.timer)
    this.remove(pending.wrap)
  }

  /** 视口宽度（不包含垂直滚动条的宽度）。
   *
   * 面板是 position: fixed，left 是相对于「不包含滚动条」的视口计算的，
   * 所以不能使用 window.innerWidth（它包含滚动条的宽度），
   * 否则面板显示在屏幕右侧时，右侧边缘会压到滚动条上、被裁掉一部分 */
  private get viewportWidth() {
    return document.documentElement.clientWidth
  }

  /** 视口高度（不包含横向滚动条的高度）。理由同 viewportWidth */
  private get viewportHeight() {
    return document.documentElement.clientHeight
  }

  /** 把面板以鼠标为中心显示，并且不让它遮挡预览作品的图片区域 */
  private positionAtMouse(wrap: HTMLDivElement, rect: DOMRect) {
    // 获取宽高，以鼠标为中心显示
    // 设置 left
    let left = this.mouseX - rect.width / 2
    // 最小的 left 为 edgeSpace，避免其紧贴左侧，看不到左边界。其他四边也同理
    if (left < this.edgeSpace) {
      left = this.edgeSpace
    }

    // 如果面板右侧超出屏幕，则把面板向左移动
    let right = left + rect.width
    if (right > this.viewportWidth) {
      left = left + (this.viewportWidth - right) - this.edgeSpace
    }

    // 设置 top
    let top = this.mouseY - rect.height / 2
    if (top < this.edgeSpace) {
      top = this.edgeSpace
    }

    // 如果面板底部超出屏幕，则把面板向上移动
    let bottom = top + rect.height
    if (bottom > this.viewportHeight) {
      top = top + (this.viewportHeight - bottom) - this.edgeSpace
    }

    // 如果面板遮挡了预览图，则把它水平移动到预览图的外侧
    left = this.avoidPreviewArea(left, top, rect)

    this.setPanelPosition(wrap, left, top, rect)
  }

  /** 计算面板的 left，使面板不会遮挡预览作品的图片区域。
   *
   * 面板遮挡了预览区域时，按照面板所在的方位（左侧或右侧）水平移动面板，直到它不再遮挡预览区域。
   * 如果那一侧没有足够的空间（例如预览区域很宽），则不强制避免遮挡：
   * 此时面板会尽量向那一侧移动，贴着屏幕边缘显示，但仍然可能遮挡一部分预览区域
   */
  private avoidPreviewArea(left: number, top: number, rect: DOMRect): number {
    const previewRect = previewWork.getPreviewAreaRect()
    if (!previewRect) {
      return left
    }

    // 只有在水平和垂直方向上都重叠时，面板才会遮挡预览区域
    const overlapX =
      left < previewRect.right && left + rect.width > previewRect.left
    const overlapY =
      top < previewRect.bottom && top + rect.height > previewRect.top
    if (!overlapX || !overlapY) {
      return left
    }

    // 比较面板和预览区域的中心点，判断面板在预览区域的左侧还是右侧，之后按照同样的方向移动面板
    const panelCenterX = left + rect.width / 2
    const previewCenterX = previewRect.left + previewRect.width / 2
    if (panelCenterX <= previewCenterX) {
      // 面板在左侧：让面板的右侧贴着预览区域的左侧
      left = previewRect.left - this.gapWithPreview - rect.width
    } else {
      // 面板在右侧：让面板的左侧贴着预览区域的右侧
      left = previewRect.right + this.gapWithPreview
    }

    // 不让面板超出屏幕的左右两侧。空间不足时面板会贴着屏幕边缘显示
    const maxLeft = this.viewportWidth - rect.width - this.edgeSpace
    left = Math.max(left, this.edgeSpace)
    left = Math.min(left, Math.max(maxLeft, this.edgeSpace))
    return left
  }

  /** 设置面板的位置，并记录面板的位置和尺寸。
   * checkDetached 为 true 时还会判断鼠标是否位于面板之外（从图片查看器打开的面板固定在按钮上方，不需要判断） */
  private setPanelPosition(
    wrap: HTMLDivElement,
    left: number,
    top: number,
    rect: DOMRect,
    checkDetached = true
  ) {
    wrap.style.left = left + 'px'
    wrap.style.top = top + 'px'
    this.panelArea = {
      left,
      top,
      width: rect.width,
      height: rect.height,
    }

    // 面板可能被移动到了鼠标之外的位置（例如为了避开预览区域）。
    // 此时鼠标不在面板上，面板就不会收到 mouseleave 事件，所以需要额外的检测来关闭它
    this.panelDetachedFromMouse =
      checkDetached && !this.isPointInPanel(this.mouseX, this.mouseY)
  }

  /** 检查指定的位置（视口坐标）是否在面板上。padding 用于把面板的外围也算作面板区域 */
  private isPointInPanel(x: number, y: number, padding = 0) {
    if (!this.panelArea) {
      return false
    }

    const { left, top, width, height } = this.panelArea
    return (
      x >= left - padding &&
      x <= left + width + padding &&
      y >= top - padding &&
      y <= top + height + padding
    )
  }

  /** 预览区域的位置或尺寸变化之后，重新调整当前显示的面板的位置，避免面板遮挡预览区域 */
  private adjustPosition() {
    // 从图片查看器打开的面板不会显示预览区域，不需要处理
    if (!this.show || this.fromImageViewer) {
      return
    }

    if (!this.panelEl || !this.panelArea) {
      return
    }

    const rect = this.panelEl.getBoundingClientRect()
    const left = this.avoidPreviewArea(
      this.panelArea.left,
      this.panelArea.top,
      rect
    )
    this.setPanelPosition(this.panelEl, left, this.panelArea.top, rect)
  }

  /** 面板被移动到鼠标之外的位置时，鼠标不在面板上，面板接收不到 mouseleave 事件。
   * 所以在鼠标移动时检查：如果鼠标既不在面板上（包括面板与缩略图之间的空隙），也不在作品缩略图上，就关闭面板 */
  private checkCloseWhenDetached(x: number, y: number) {
    if (!this.show || !this.panelDetachedFromMouse || !this.panelArea) {
      return
    }

    // 面板和缩略图之间留有空隙，把空隙也算作面板区域，避免鼠标从缩略图移向面板的途中被误关闭
    if (this.isPointInPanel(x, y, this.gapWithPreview)) {
      return
    }

    // 鼠标依然在面板对应的缩略图上时，说明用户还在查看这个作品，保持显示
    if (Utils.mouseInElementArea(this.panelWorkEl || undefined, x, y)) {
      return
    }

    this.panelEl && this.remove(this.panelEl, x, y)
  }

  /** 把详情面板放在图片查看器按钮的上方，并与按钮水平居中对齐 */
  private positionAboveViewerAnchor(wrap: HTMLDivElement, rect: DOMRect) {
    const anchorRect = this.viewerAnchor!.getBoundingClientRect()

    // 水平居中，并且不超出屏幕左右两侧
    const centered = anchorRect.left + anchorRect.width / 2 - rect.width / 2
    const left = Math.max(
      this.edgeSpace,
      Math.min(centered, this.viewportWidth - rect.width - this.edgeSpace)
    )

    // 面板的底部位于按钮上方，留出一点间距（10px，与屏幕边缘的间距含义不同）。
    // 如果上方空间不足，就贴着屏幕顶部显示
    const top = Math.max(this.edgeSpace, anchorRect.top - rect.height - 10)

    // 从图片查看器打开的面板总是固定在按钮上方，不需要判断鼠标是否在面板之外
    this.setPanelPosition(wrap, left, top, rect, false)
  }

  /** 关闭面板。
   *
   * 关闭时会派发 PreviewWorkDetailPanelClosed 事件，让预览作品模块判断是否需要隐藏预览区域。
   * 坐标应该传入「触发关闭的事件」里的坐标：如果是 mouseleave 触发的关闭，
   * mouseX/mouseY 还是上一次 mousemove 的旧坐标（mouseleave 先于 mousemove 派发），
   * 会导致预览作品误判鼠标还在缩略图上，从而不隐藏预览区域
   * @param el 要移除的面板元素。不传时会查找页面上的面板
   * @param mouseX 关闭时鼠标的水平坐标
   * @param mouseY 关闭时鼠标的垂直坐标
   */
  private remove(
    el?: HTMLDivElement,
    mouseX = this.mouseX,
    mouseY = this.mouseY
  ) {
    el =
      el ||
      (document.querySelector('.xz_PreviewWorkDetailPanel') as HTMLDivElement)
    el && el.parentNode && el.parentNode.removeChild(el)
    this.show = false
    this.fromImageViewer = false
    this.viewerAnchor = null
    this.panelEl = null
    this.panelArea = null
    this.panelDetachedFromMouse = false
    this.panelWorkEl = null

    // 清除等待中的面板（例如等待期间切换了页面）
    if (this.pendingPanel) {
      window.clearTimeout(this.pendingPanel.timer)
      this.pendingPanel = null
    }

    states.previewWorkDetailInfoPanelIsShow = false

    this.delayResetWorkId()

    EVT.fire('PreviewWorkDetailPanelClosed', {
      x: mouseX,
      y: mouseY,
    })
  }

  private copyTXT(workData: ArtworkData, aiType: 0 | 1 | 2) {
    // 组织输出的内容
    const array: string[] = []
    const body = workData.body
    const tags = Tools.extractTags(workData).map((tag) => `#${tag}`)
    array.push(`ID\n${body.id}`)
    array.push(`URL\nhttps://www.pixiv.net/artworks/${body.id}`)
    array.push(`Original\n${body.urls?.original}`)
    array.push(`xRestrict\n${Tools.getXRestrictText(body.xRestrict)}`)
    array.push(`AI\n${Tools.getAITypeTextEnglish(aiType)}`)
    array.push(`User\n${body.userName}`)
    array.push(`UserID\n${body.userId}`)
    array.push(`Title\n${body.title}`)
    if (body.description) {
      array.push(
        `Description\n${Utils.htmlToText(
          Tools.replaceATag(Utils.htmlDecode(body.description))
        )}`
      )
    }
    array.push(`Tags\n${tags.join('\n')}`)
    array.push(`Size\n${body.width} x ${body.height}`)
    array.push(`Bookmark\n${body.bookmarkCount}`)
    array.push(`Date\n${new Date(body.uploadDate).toLocaleString()}`)

    const text = array.join('\n\n')
    this.copy(text)
  }

  private copyJSON(workData: ArtworkData) {
    const text = JSON.stringify(workData, null, 2)
    this.copy(text)
  }

  private async copy(text: string) {
    const copied = await Utils.writeClipboardText(text)
    if (copied) {
      toast.success(lang.transl('_已复制到剪贴板'))
    } else {
      toast.error(lang.transl('_写入剪贴板失败'))
    }
  }
}

new PreviewWorkDetailInfo()
