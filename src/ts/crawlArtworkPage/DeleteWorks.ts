import { lang } from '../Language'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { msgBox } from '../MsgBox'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { SearchResultPreview } from './SearchResultPreview'

// 在搜索页面里添加批量清除和手动删除作品的按钮
//
// 这个模块只负责界面部分：按钮、手动删除模式的指示器、在作品列表上委托点击。
// 它不接触抓取结果，而是直接调用 SearchResultPreview 的方法 —— 抓取结果、作品列表容器、
// 页面重绘都由预览模块负责，本模块通过它提供的少量方法取用。
// 之前这里是派发全局事件（clearMultiple / clearUgoira / deleteWork）来通知预览模块的，
// 但这两个模块只在搜索页面里一对一存在，用全局事件反而绕了一圈，所以改成了直接调用。
class DeleteWorks {
  constructor(private readonly preview: SearchResultPreview) {
    this.icon = this.createDeleteIcon()
    this.bindEvents()
  }

  /** 预览卡片的选择器 */
  private readonly cardSelector = `.${SearchResultPreview.listClass}`

  private delMode: boolean = false // 是否处于手动删除作品状态

  private icon?: HTMLElement // 手动删除时，显示一个指示图标
  private readonly iconId = 'deleteWorkEl'
  private left = 0
  private top = 0
  private readonly half = 12

  private delBtn!: HTMLButtonElement
  private delBtnText?: HTMLSpanElement

  /** 手动删除模式下注册点击事件的作品列表容器 */
  private deleteEventTarget: HTMLElement | null = null

  /** 添加本模块提供的全部按钮 */
  public addBtns() {
    this.addFilterBtn('_清除多图作品', 'clearMultiImageWork', () =>
      this.preview.clearMultiple()
    )
    this.addFilterBtn('_清除动图作品', 'clearUgoiraWork', () =>
      this.preview.clearUgoira()
    )
    this.addManuallyDeleteBtn()
  }

  /** 退出手动删除模式并移除列表级点击监听 */
  public exitDeleteMode = () => {
    if (!this.delMode) {
      return
    }

    this.delMode = false
    this.deleteEventTarget?.removeEventListener(
      'click',
      this.handleDeleteClick,
      true
    )
    this.deleteEventTarget = null
    this.updateDeleteIcon()

    if (this.delBtnText) {
      lang.updateText(this.delBtnText, '_手动删除作品')
    }
  }

  /** 销毁手动删除模块及其全局事件 */
  public destroy() {
    this.exitDeleteMode()
    window.removeEventListener(EVT.list.pageSwitch, this.exitDeleteMode)
    window.removeEventListener('mousemove', this.onMouseMove, true)
    this.icon?.remove()
  }

  private bindEvents() {
    // 切换页面时，退出手动删除模式
    window.addEventListener(EVT.list.pageSwitch, this.exitDeleteMode)

    // 鼠标移动时保存鼠标的坐标
    window.addEventListener('mousemove', this.onMouseMove, true)
  }

  /** 鼠标移动时保存鼠标的坐标 */
  private onMouseMove = (ev: MouseEvent) => {
    this.left = ev.clientX
    this.top = ev.clientY
    this.updateDeleteIcon()
  }

  /** 添加由预览模块处理的“清除某一类作品”的按钮 */
  private addFilterBtn(text: string, id: string, callback: () => void) {
    Tools.addBtn(
      'crawlBtns',
      text,
      '',
      id,
      'secondary',
      'danger'
    ).addEventListener(
      'click',
      () => {
        if (!this.checkCanDelete()) {
          return
        }

        callback()
      },
      false
    )
  }

  /** 添加手动删除作品按钮 */
  private addManuallyDeleteBtn() {
    this.delBtn = Tools.addBtn(
      'crawlBtns',
      '_手动删除作品',
      '_手动删除作品Title',
      'manuallyDeleteWork',
      'secondary',
      'danger'
    )
    this.delBtnText = this.delBtn.querySelector('span') ?? undefined

    this.delBtn.addEventListener('click', (ev: MouseEvent) => {
      if (ev.detail > 0) {
        this.left = ev.clientX
        this.top = ev.clientY
      }
      this.toggleDeleteMode()
    })
  }

  /** 切换手动删除模式 */
  private async toggleDeleteMode() {
    if (this.delMode) {
      this.exitDeleteMode()
      return
    }

    if (!this.checkCanDelete()) {
      return
    }

    // 直接向预览模块要作品列表容器，不再从某个卡片元素反查它的父元素
    const wrap = this.preview.findWorksWrap()
    if (!wrap || !wrap.querySelector(this.cardSelector)) {
      msgBox.warning(lang.transl('_提示当前页面上没有可以用于手动删除的元素'), {
        title: lang.transl('_手动删除作品'),
      })
      return
    }

    this.delMode = true
    this.deleteEventTarget = wrap
    wrap.addEventListener('click', this.handleDeleteClick, true)
    this.updateDeleteIcon()

    if (this.delBtnText) {
      lang.updateText(this.delBtnText, '_退出手动删除')
    }

    await Utils.sleep(100)
    if (this.delMode) {
      EVT.fire('closeSettingsPanel')
    }
  }

  /** 在作品列表容器上委托处理手动删除操作 */
  private handleDeleteClick = (ev: MouseEvent) => {
    if (!this.delMode || !(ev.target instanceof Element)) {
      return
    }

    const card = ev.target.closest<HTMLElement>(this.cardSelector)
    if (!card) {
      return
    }

    ev.preventDefault()
    ev.stopPropagation()

    // 只把作品 id 交给预览模块：它会修改抓取结果并重绘整个列表。
    // 所以这里不需要自己删除卡片元素，交给预览模块统一处理
    this.preview.removeWork(Number.parseInt(card.dataset.id || ''))
  }

  /** 检查是否存在可以操作的抓取结果 */
  private checkCanDelete() {
    if (!this.preview.hasResult) {
      toast.error(lang.transl('_没有可用的抓取结果'))
      return false
    }
    return true
  }

  private createDeleteIcon() {
    const el = document.createElement('div')
    el.id = this.iconId
    document.body.appendChild(el)
    return el
  }

  private updateDeleteIcon() {
    if (!this.icon) {
      return
    }

    this.icon.style.display = this.delMode ? 'block' : 'none'
    // 如果指示图标处于隐藏状态，就不会更新其坐标。这样可以优化性能
    if (this.delMode) {
      this.icon.style.left = this.left - this.half + 'px'
      this.icon.style.top = this.top - this.half + 'px'
    }
  }
}

export { DeleteWorks }
