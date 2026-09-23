import { lang } from '../Language'
import { Tools } from '../Tools'
import { states } from '../store/States'
import { EVT } from '../EVT'
import { msgBox } from '../MsgBox'
import { Utils } from '../utils/Utils'
import { store } from '../store/Store'
import { toast } from '../Toast'

// 在搜索页面里添加批量清除和手动删除作品的按钮，具体的数据修改和页面重绘由 SearchResultPreview 模块处理。
class DeleteWorks {
  constructor(worksSelectors: string) {
    // .searchList
    this.worksSelector = worksSelectors

    this.icon = this.createDeleteIcon()

    this.bindEvents()
  }

  private worksSelector: string = '' // 选择页面上所有作品的选择器

  private delMode: boolean = false // 是否处于手动删除作品状态

  private delBtn: HTMLButtonElement = document.createElement('button')

  /** 手动删除模式下注册点击事件的作品容器 */
  private deleteEventTarget: HTMLElement | null = null

  private icon?: HTMLElement // 手动删除时，显示一个指示图标
  private readonly iconId = 'deleteWorkEl'
  private left = 0
  private top = 0
  private half = 12

  /** 手动删除作品时通知预览模块更新数据 */
  private deleteWorkCallback: (el: HTMLElement) => void = () => {}

  /** 鼠标移动事件处理函数 */
  private onMouseMove = (ev: MouseEvent) => {
    this.moveEvent(ev)
  }

  /** 同步“手动排除作品”操作与搜索结果预览 */
  private onManuallyExcludeWork = (ev: CustomEventInit) => {
    const id = ev.detail.data.id as string
    const type = ev.detail.data.type as string
    if (id && type !== 'novels' && type !== 'novelSeries') {
      const selector = `${this.worksSelector}[data-id="${id}"]`
      const el = document.querySelector(selector) as HTMLElement | null
      if (el) {
        el.remove()
        // SearchResultPreview 会同步更新抓取结果并重绘当前页。
        EVT.fire('deleteWork', el)
      }
    }
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

  private bindEvents() {
    // 切换页面时，退出手动删除模式
    window.addEventListener(EVT.list.pageSwitch, this.exitDeleteMode)

    // 鼠标移动时保存鼠标的坐标
    window.addEventListener('mousemove', this.onMouseMove, true)

    // 当用户使用“手动排除作品”功能排除了一个作品时，自动删除页面上对应的作品元素
    window.addEventListener(
      EVT.list.manuallyExcludeWork,
      this.onManuallyExcludeWork
    )
  }

  /** 监听鼠标移动并更新手动删除指示图标 */
  private moveEvent(ev: MouseEvent) {
    this.left = ev.clientX
    this.top = ev.clientY
    this.updateDeleteIcon()
  }

  /** 添加由结果预览模块处理的清除多图作品按钮 */
  public addClearMultipleBtn(callback: () => void = () => {}) {
    Tools.addBtn(
      'crawlBtns',
      '_清除多图作品',
      '',
      'clearMultiImageWork',
      'secondary',
      'danger'
    ).addEventListener(
      'click',
      () => {
        if (states.busy) {
          toast.error(lang.transl('_当前任务尚未完成'))
          return
        }

        if (!this.checkCanDelete()) {
          return
        }

        callback()
      },
      false
    )
  }

  /** 添加由结果预览模块处理的清除动图作品按钮 */
  public addClearUgoiraBtn(callback: () => void = () => {}) {
    Tools.addBtn(
      'crawlBtns',
      '_清除动图作品',
      '',
      'clearUgoiraWork',
      'secondary',
      'danger'
    ).addEventListener(
      'click',
      () => {
        if (states.busy) {
          toast.error(lang.transl('_当前任务尚未完成'))
          return
        }

        if (!this.checkCanDelete()) {
          return
        }

        callback()
      },
      false
    )
  }

  /** 添加手动删除作品按钮 */
  public addManuallyDeleteBtn(callback: (el: HTMLElement) => void = () => {}) {
    this.deleteWorkCallback = callback
    this.delBtn = Tools.addBtn(
      'crawlBtns',
      '_手动删除作品',
      '_手动删除作品Title',
      'manuallyDeleteWork',
      'secondary',
      'danger'
    )

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

    const findTarget = document.querySelector(this.worksSelector)
    if (!findTarget) {
      msgBox.warning(lang.transl('_提示当前页面上没有可以用于手动删除的元素'), {
        title: lang.transl('_手动删除作品'),
      })
      return
    }

    const eventTarget =
      findTarget.closest<HTMLElement>('#workListWrap') ||
      findTarget.parentElement
    if (!eventTarget) {
      msgBox.warning(lang.transl('_提示当前页面上没有可以用于手动删除的元素'), {
        title: lang.transl('_手动删除作品'),
      })
      return
    }

    this.delMode = true
    this.deleteEventTarget = eventTarget
    this.deleteEventTarget.addEventListener(
      'click',
      this.handleDeleteClick,
      true
    )
    this.updateDeleteIcon()

    const span = this.delBtn.querySelector('span')
    lang.updateText(span!, '_退出手动删除')
    await Utils.sleep(100)
    if (this.delMode) {
      EVT.fire('closeSettingsPanel')
    }
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

    const span = this.delBtn.querySelector('span')
    if (span) {
      lang.updateText(span, '_手动删除作品')
    }
  }

  /** 销毁手动删除模块及其全局事件 */
  public destroy() {
    this.exitDeleteMode()
    window.removeEventListener(EVT.list.pageSwitch, this.exitDeleteMode)
    window.removeEventListener('mousemove', this.onMouseMove, true)
    window.removeEventListener(
      EVT.list.manuallyExcludeWork,
      this.onManuallyExcludeWork
    )
    this.icon?.remove()
  }

  /** 在列表容器上委托处理手动删除操作 */
  private handleDeleteClick = (ev: MouseEvent) => {
    if (!this.delMode || !(ev.target instanceof Element)) {
      return
    }

    const target = ev.target.closest<HTMLElement>(this.worksSelector)
    if (!target) {
      return
    }

    ev.preventDefault()
    ev.stopPropagation()

    if (states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    this.deleteWorkCallback(target)
    target.remove()
  }

  private checkCanDelete() {
    if (store.resultMeta.length === 0 && store.result.length === 0) {
      toast.error(lang.transl('_没有可用的抓取结果'))
      return false
    }
    return true
  }
}

export { DeleteWorks }
