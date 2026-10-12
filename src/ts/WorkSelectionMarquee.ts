import { Config } from './Config'
import { EVT } from './EVT'
import { selectWork } from './SelectWork'
import { excludeWork } from './ExcludeWork'
import { displayThumbnailListOnMultiImageWorkPage } from './pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'
import { Utils } from './utils/Utils'
import {
  Rect,
  rectFromPoints,
  rectsIntersect,
  toDocRect,
} from './utils/MarqueeMath'

// 为「手动选择作品」和「手动排除作品」提供框选功能。
// 文档：notes/为选择作品的功能添加框选功能.md
//
// 桌面端：按下鼠标左键后移动超过阈值即开始框选，松开提交。
// 移动端：单指拖动是滚动页面的手势，所以需要长按后再拖动才会开始框选。
// 框选的提交语义与单击相同：toggle（已选择的作品会被取消选择，未选择的作品会被选中）。
// 处于选择 / 排除模式时，会阻止浏览器默认的文本选择和原生拖拽。
// 另外，拖动结束后需要拦截一次 click，避免误触发作品的选择 / 排除。
class WorkSelectionMarquee {
  constructor() {
    if (Utils.isPixiv()) {
      this.bindEvents()
    }
  }

  /** 位移超过这个距离（px）视为已开始拖动。与 TapDetector 的阈值一致 */
  private readonly moveThreshold = 10
  /** 移动端需要先长按这么久（ms）再拖动。与 Utils.longPress 的默认值一致 */
  private readonly longPressTime = 500
  /** 自动滚动：鼠标距离视口上下边缘多少像素内时触发 */
  private readonly autoScrollEdge = 50
  /** 自动滚动的最大速度（px / 帧） */
  private readonly autoScrollMaxSpeed = 20
  /** 拖动结束后，在这个时长（ms）内拦截一次 click */
  private readonly clickSuppressTime = 300

  /** 手势状态。
   * idle：空闲。
   * pressing：已按下，等待移动（移动端还会等待长按计时）。
   * armed：移动端长按达成，等待拖动（桌面端不会出现这个状态）。
   * dragging：正在框选。 */
  private state: 'idle' | 'pressing' | 'armed' | 'dragging' = 'idle'

  /** 本次手势开始时所在的模式。手势期间模式发生变化时会取消本次手势 */
  private mode: 'select' | 'exclude' | null = null

  /** 按下时的 client 坐标（用于判断位移） */
  private startClientX = 0
  private startClientY = 0
  /** 按下时的文档坐标（框选矩形的起点）。按下时计算一次，之后保持不变 */
  private startDocX = 0
  private startDocY = 0
  /** 当前的 client 坐标（框选矩形的终点） */
  private currentClientX = 0
  private currentClientY = 0

  /** 长按计时器（移动端） */
  private longPressTimer: number | null = null
  /** 拖动时 rAF 循环的 id */
  private tickId: number | null = null

  /** 拖动结束后，在这个时间戳之前拦截一次 click（桌面端）。
   * 拦截后、或者下一次按下时重置为 0 */
  private suppressClickUntil = 0

  /** 框选矩形的元素。第一次拖动时创建，之后复用 */
  private marqueeEl?: HTMLElement
  /** 当前被临时高亮的缩略图集合，以及使用的高亮 class */
  private highlightSet = new Set<HTMLElement>()
  private highlightClass = 'ppdMarqueeHighlightSelect'

  private bindEvents() {
    if (Config.mobile) {
      // 移动端
      window.addEventListener('touchstart', this.onTouchStart, true)
      // 阻止页面滚动时需要调用 preventDefault，所以必须设置 passive: false
      window.addEventListener('touchmove', this.onTouchMove, {
        capture: true,
        passive: false,
      })
      window.addEventListener('touchend', this.onTouchEnd, true)
      window.addEventListener('touchcancel', this.onTouchCancel, true)
      // 阻止长按弹出的上下文菜单，避免打断「长按后拖动」的手势
      window.addEventListener('contextmenu', this.onContextMenu, true)
    } else {
      // 桌面端
      window.addEventListener('mousedown', this.onMouseDown, true)
      window.addEventListener('mousemove', this.onMouseMove, true)
      window.addEventListener('mouseup', this.onMouseUp, true)
      // 拖动结束后需要拦截一次 click，避免这个 click 被当作点击作品
      document.addEventListener('click', this.onClickCapture, true)
    }

    window.addEventListener('blur', this.onBlur)
    window.addEventListener('keydown', this.onKeyDown, true)

    // 处于选择 / 排除模式时，阻止浏览器默认的文本选择和原生拖拽。
    // 拖动可能在按下的下一个瞬间就发生，没有「长按成功」之类的提前时机，
    // 所以守卫需要覆盖整个模式激活期，而不是只在拖动期间
    document.addEventListener('selectstart', this.onSelectStart, true)
    document.addEventListener('dragstart', this.onDragStart, true)

    // 页面切换、模式状态变化时取消手势
    window.addEventListener(EVT.list.pageSwitch, this.onCancelEvent)
    window.addEventListener(
      EVT.list.workSelectionChange,
      this.onSelectionChange
    )
  }

  /** 当前是否有任一模式处于活动状态（模式激活、未暂停、未打开设置面板）。
   * 与两个模块里指示器的显示条件一致 */
  private getActiveMode(): 'select' | 'exclude' | null {
    if (selectWork.canSelect() && !selectWork.tempHide) {
      return 'select'
    }
    if (excludeWork.canExclude() && !excludeWork.tempHide) {
      return 'exclude'
    }
    return null
  }

  /** 目标是否位于输入类元素内。是的话应放行，使搜索框等可以正常使用 */
  private isExcludedTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) {
      return false
    }
    return !!target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
    )
  }

  /** 是否可以从这个目标上开始一次框选手势 */
  private canStart(target: EventTarget | null): boolean {
    if (this.getActiveMode() === null) {
      return false
    }
    if (this.isExcludedTarget(target)) {
      return false
    }
    return true
  }

  /** 移动的距离是否已经超过阈值 */
  private moveEnough(clientX: number, clientY: number): boolean {
    return (
      Math.abs(clientX - this.startClientX) > this.moveThreshold ||
      Math.abs(clientY - this.startClientY) > this.moveThreshold
    )
  }

  /** 开始一次手势。记录起始坐标、模式，并添加会话期间使用的 class */
  private startSession(clientX: number, clientY: number) {
    this.mode = this.getActiveMode()
    this.startClientX = clientX
    this.startClientY = clientY
    this.startDocX = clientX + window.scrollX
    this.startDocY = clientY + window.scrollY
    this.currentClientX = clientX
    this.currentClientY = clientY
    this.highlightClass =
      this.mode === 'exclude'
        ? 'ppdMarqueeHighlightExclude'
        : 'ppdMarqueeHighlightSelect'
    // 会话期间禁止文本选择和长按 callout（作为阻止默认行为的双保险）
    document.documentElement.classList.add('ppdMarqueeActive')
  }

  /** 进入拖动状态，开始显示框选矩形 */
  private beginDrag() {
    // 如果在按下之后、开始拖动之前，模式被关闭或切换了，则放弃本次手势
    if (this.getActiveMode() !== this.mode) {
      this.cleanup()
      return
    }

    this.state = 'dragging'
    this.showMarqueeEl()
    this.updateMarqueeRect()
    this.updateHits()
    this.tickId = requestAnimationFrame(this.tick)
  }

  /** 拖动期间的 rAF 循环：更新矩形、命中检测和自动滚动 */
  private tick = () => {
    if (this.state !== 'dragging') {
      this.tickId = null
      return
    }
    this.updateMarqueeRect()
    this.updateHits()
    this.updateAutoScroll()
    this.tickId = requestAnimationFrame(this.tick)
  }

  /** 用文档坐标返回当前的框选矩形 */
  private getDocRect(): Rect {
    return rectFromPoints(
      this.startDocX,
      this.startDocY,
      this.currentClientX + window.scrollX,
      this.currentClientY + window.scrollY
    )
  }

  /** 显示框选矩形（第一次使用时创建元素） */
  private showMarqueeEl() {
    if (!this.marqueeEl) {
      this.marqueeEl = document.createElement('div')
      this.marqueeEl.classList.add('ppdMarqueeRect')
      document.body.appendChild(this.marqueeEl)
    }
    this.marqueeEl.classList.toggle(
      'ppdMarqueeRectExclude',
      this.mode === 'exclude'
    )
    this.marqueeEl.style.display = 'block'
  }

  /** 更新框选矩形的位置和尺寸。显示坐标 = 文档坐标 - 当前滚动量，
   * 这样滚动页面时矩形看起来会跟着页面内容移动 */
  private updateMarqueeRect() {
    if (!this.marqueeEl) {
      return
    }
    const docRect = this.getDocRect()
    this.marqueeEl.style.left = docRect.left - window.scrollX + 'px'
    this.marqueeEl.style.top = docRect.top - window.scrollY + 'px'
    this.marqueeEl.style.width = docRect.right - docRect.left + 'px'
    this.marqueeEl.style.height = docRect.bottom - docRect.top + 'px'
  }

  /** 更新命中检测，并高亮 / 取消高亮对应的缩略图 */
  private updateHits() {
    const docRect = this.getDocRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const elements =
      document.querySelectorAll<HTMLElement>('.ppd-workThumbnail')
    const hits = new Set<HTMLElement>()

    for (const el of elements) {
      // 跳过多图作品的页面缩略图（这些是作品里的单张图片，而非作品本身）
      if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
        continue
      }

      const rect = el.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) {
        // 不可见的元素（尺寸为 0），跳过
        continue
      }

      const docElRect = toDocRect(
        {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
        },
        scrollX,
        scrollY
      )
      if (rectsIntersect(docRect, docElRect)) {
        hits.add(el)
      }
    }

    // 更新高亮：新进入的加上 class，离开的移除 class
    for (const el of this.highlightSet) {
      if (!hits.has(el)) {
        el.classList.remove(this.highlightClass)
      }
    }
    for (const el of hits) {
      if (!this.highlightSet.has(el)) {
        el.classList.add(this.highlightClass)
      }
    }
    this.highlightSet = hits
  }

  /** 拖动到视口上下边缘时自动滚动页面 */
  private updateAutoScroll() {
    const y = this.currentClientY
    const edge = this.autoScrollEdge
    const bottomEdge = window.innerHeight - edge
    let speed = 0

    if (y < edge) {
      // 向上滚动
      speed = -Math.ceil(((edge - y) / edge) * this.autoScrollMaxSpeed)
    } else if (y > bottomEdge) {
      // 向下滚动
      speed = Math.ceil(((y - bottomEdge) / edge) * this.autoScrollMaxSpeed)
    }

    if (speed !== 0) {
      window.scrollBy(0, speed)
    }
  }

  /** 结束手势并提交框选结果（仅 dragging 状态会提交）。
   * 提交后由两个模块执行 toggle（与单击作品的行为一致） */
  private finish() {
    // 按最后一刻的矩形同步更新一次命中。
    // 拖动结束前，最后一次移动之后 rAF 可能还没有执行过，
    // 直接用当前高亮集合会漏掉最后移动的一小段
    this.updateHits()

    const elements = Array.from(this.highlightSet)
    const mode = this.mode
    this.cleanup()

    if (elements.length === 0) {
      return
    }
    if (mode === 'select') {
      selectWork.toggleElements(elements)
    } else if (mode === 'exclude') {
      excludeWork.toggleElements(elements)
    }
  }

  /** 清理当前手势的状态和界面 */
  private cleanup() {
    this.state = 'idle'
    this.mode = null

    if (this.longPressTimer !== null) {
      window.clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
    if (this.tickId !== null) {
      cancelAnimationFrame(this.tickId)
      this.tickId = null
    }

    if (this.marqueeEl) {
      this.marqueeEl.style.display = 'none'
    }

    for (const el of this.highlightSet) {
      el.classList.remove(this.highlightClass)
    }
    this.highlightSet.clear()

    document.documentElement.classList.remove('ppdMarqueeActive')
  }

  // ---- 桌面端事件 ----

  private onMouseDown = (ev: MouseEvent) => {
    if (ev.button !== 0) {
      // 只响应鼠标左键
      return
    }

    // 这一次按下属于新的手势：重置拖动结束时设置的 click 拦截
    this.suppressClickUntil = 0

    // 上一次手势的残留（例如在窗口外松开导致 mouseup 丢失）此时清理
    if (this.state !== 'idle') {
      this.cleanup()
    }

    if (!this.canStart(ev.target)) {
      return
    }

    this.state = 'pressing'
    this.startSession(ev.clientX, ev.clientY)
  }

  private onMouseMove = (ev: MouseEvent) => {
    if (this.state === 'idle') {
      return
    }

    // 鼠标左键已被松开（例如在窗口外松开、mouseup 丢失）时，清理并放弃本次手势
    if (ev.buttons === 0) {
      this.cleanup()
      return
    }

    this.currentClientX = ev.clientX
    this.currentClientY = ev.clientY

    if (this.state === 'pressing' && this.moveEnough(ev.clientX, ev.clientY)) {
      // 位移超过阈值，开始框选
      this.beginDrag()
    }
  }

  private onMouseUp = (ev: MouseEvent) => {
    if (ev.button !== 0 || this.state === 'idle') {
      return
    }

    if (this.state === 'dragging') {
      this.finish()
      // 拖动结束后，浏览器仍可能基于这次按下 / 松开发出 click，需要拦截它
      this.suppressClickUntil = Date.now() + this.clickSuppressTime
    } else {
      // 没有移动（或移动距离很小）：不框选，本次操作按原有的单击逻辑处理
      this.cleanup()
    }
  }

  /** 拦截拖动结束后跟随而来的 click，避免误触发作品的选择 / 排除 */
  private onClickCapture = (ev: MouseEvent) => {
    if (Date.now() < this.suppressClickUntil) {
      this.suppressClickUntil = 0
      ev.stopPropagation()
      ev.preventDefault()
    }
  }

  // ---- 移动端事件 ----

  private onTouchStart = (ev: TouchEvent) => {
    // 多指触摸（缩放等）：取消手势，并忽略这次触摸
    if (ev.touches.length > 1) {
      if (this.state !== 'idle') {
        this.cleanup()
      }
      return
    }

    if (this.state !== 'idle') {
      return
    }
    if (!this.canStart(ev.target)) {
      return
    }

    const touch = ev.touches[0]
    this.state = 'pressing'
    this.startSession(touch.clientX, touch.clientY)

    // 长按计时。达成后进入 armed，等待拖动
    this.longPressTimer = window.setTimeout(() => {
      this.longPressTimer = null
      if (this.state === 'pressing') {
        this.state = 'armed'
      }
    }, this.longPressTime)
  }

  private onTouchMove = (ev: TouchEvent) => {
    if (this.state === 'idle') {
      return
    }

    // 多指触摸：取消手势
    if (ev.touches.length > 1) {
      this.cleanup()
      return
    }

    const touch = ev.touches[0]

    if (this.state === 'pressing') {
      // 长按计时期间移动过多，说明用户想滚动页面：取消手势，
      // 并且不阻止默认行为，让浏览器正常滚动
      if (this.moveEnough(touch.clientX, touch.clientY)) {
        this.cleanup()
      }
      return
    }

    // armed / dragging：阻止页面滚动
    if (ev.cancelable) {
      ev.preventDefault()
    }

    this.currentClientX = touch.clientX
    this.currentClientY = touch.clientY

    if (
      this.state === 'armed' &&
      this.moveEnough(touch.clientX, touch.clientY)
    ) {
      // 长按后移动超过阈值，开始框选
      this.beginDrag()
    }
  }

  private onTouchEnd = (ev: TouchEvent) => {
    if (this.state === 'idle') {
      return
    }

    const wasArmed = this.state === 'armed'
    const wasDragging = this.state === 'dragging'

    if (wasArmed || wasDragging) {
      // 长按达成后，本次触摸不应该再被当作点击处理。
      // 两个模块和 WorkThumbnail 的点击处理都挂在 touchend 上，这里阻止它们
      ev.stopPropagation()
      ev.preventDefault()
    }

    if (wasDragging) {
      this.finish()
    } else {
      this.cleanup()
    }
  }

  private onTouchCancel = () => {
    if (this.state !== 'idle') {
      this.cleanup()
    }
  }

  /** 移动端长按的上下文菜单会打断「长按后拖动」的手势，需要阻止。
   * 只在有活动手势时阻止，不影响正常情况下的长按菜单 */
  private onContextMenu = (ev: Event) => {
    if (this.state !== 'idle' && this.getActiveMode() !== null) {
      ev.preventDefault()
    }
  }

  // ---- 公共事件 ----

  private onBlur = () => {
    if (this.state !== 'idle') {
      this.cleanup()
    }
  }

  /** 手势进行中按 Esc：只取消当前框选，不触发「Esc 暂停模式」的原有行为 */
  private onKeyDown = (ev: KeyboardEvent) => {
    if (ev.code !== 'Escape' || this.state === 'idle') {
      return
    }
    this.cleanup()
    ev.stopPropagation()
  }

  /** 选择 / 排除模式激活时，阻止浏览器默认的文本选择 */
  private onSelectStart = (ev: Event) => {
    if (this.getActiveMode() === null || this.isExcludedTarget(ev.target)) {
      return
    }
    ev.preventDefault()
  }

  /** 选择 / 排除模式激活时，阻止浏览器原生的拖拽 */
  private onDragStart = (ev: Event) => {
    if (this.getActiveMode() === null || this.isExcludedTarget(ev.target)) {
      return
    }
    ev.preventDefault()
  }

  private onCancelEvent = () => {
    if (this.state !== 'idle') {
      this.cleanup()
    }
  }

  private onSelectionChange = () => {
    if (this.state === 'idle') {
      return
    }
    // 手势期间模式被关闭或切换时，取消本次手势
    if (this.getActiveMode() !== this.mode) {
      this.cleanup()
    }
  }
}

const workSelectionMarquee = new WorkSelectionMarquee()
export { workSelectionMarquee }
