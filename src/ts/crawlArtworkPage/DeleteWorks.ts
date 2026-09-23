import { lang } from '../Language'
import { Tools } from '../Tools'
import { states } from '../store/States'
import { EVT } from '../EVT'
import { msgBox } from '../MsgBox'
import { Utils } from '../utils/Utils'
import { store } from '../store/Store'
import { toast } from '../Toast'

// 在搜索页面里，删除下载器添加到页面上的作品
// 这个模块会添加一些按钮，当点击按钮时，以及手动删除作品时，在 2 个模块里共同工作：
// 1. 触发事件，通知 SearchResultPreview 模块过滤抓取结果（修改数据源）
// 2. 本模块负责删除页面上对应的作品元素（操作 DOM）
class DeleteWorks {
  constructor(worksSelectors: string) {
    // .searchList
    this.worksSelector = worksSelectors

    this.icon = this.createDeleteIcon()

    this.bindEvents()
  }

  private worksSelector: string = '' // 选择页面上所有作品的选择器

  private multipleSelector: string = '' // 多图作品特有的元素的标识

  private ugoiraSelector: string = '' // 动图作品特有的元素的标识

  private delMode: boolean = false // 是否处于手动删除作品状态

  private delBtn: HTMLButtonElement = document.createElement('button')

  private icon?: HTMLElement // 手动删除时，显示一个指示图标
  private readonly iconId = 'deleteWorkEl'
  private left = 0
  private top = 0
  private half = 12

  private deleteWorkCallback: Function = () => {} // 保存手动删除作品的回调函数，因为可能会多次绑定手动删除事件，所以需要保存传入的 callback 备用

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
    // 作品列表更新后，需要重新给作品绑定手动删除事件
    window.addEventListener(EVT.list.worksUpdate, () => {
      if (this.delMode) {
        this.bindDeleteEvent()
      }
    })

    // 切换页面时，退出手动删除模式
    window.addEventListener(EVT.list.pageSwitch, () => {
      if (this.delMode) {
        this.toggleDeleteMode()
      }
    })

    // 鼠标移动时保存鼠标的坐标
    window.addEventListener(
      'mousemove',
      (ev) => {
        this.moveEvent(ev)
      },
      true
    )

    // 当用户使用“手动排除作品”功能排除了一个作品时，自动删除页面上对应的作品元素
    window.addEventListener(
      EVT.list.manuallyExcludeWork,
      (ev: CustomEventInit) => {
        const id = ev.detail.data.id as string
        const type = ev.detail.data.type as string
        if (id && type !== 'novels' && type !== 'novelSeries') {
          const selector = `${this.worksSelector}[data-id="${id}"]`
          const el = document.querySelector(selector) as HTMLElement | null
          if (el) {
            el.remove()
            toast.success(lang.transl('_已调整抓取结果'))
            // 触发此事件是为了让“预览搜索页面的筛选结果的模块”的模块（SearchResultPreview）执行 deleteWork 方法，保持数据一致性
            EVT.fire('deleteWork', el)
          }
        }
      }
    )
  }

  // 监听鼠标移动
  private moveEvent(ev: MouseEvent) {
    this.left = ev.x
    this.top = ev.y
    this.updateDeleteIcon()
  }

  // 清除多图作品的按钮
  public addClearMultipleBtn(selector: string, callback: Function = () => {}) {
    this.multipleSelector = selector

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

        this.clearMultiple()
        callback()
      },
      false
    )
  }

  // 清除动图作品的按钮
  public addClearUgoiraBtn(selector: string, callback: Function = () => {}) {
    this.ugoiraSelector = selector

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

        this.ClearUgoira()
        callback()
      },
      false
    )
  }

  // 手动删除作品的按钮
  public addManuallyDeleteBtn(callback: Function = () => {}) {
    this.deleteWorkCallback = callback
    this.delBtn = Tools.addBtn(
      'crawlBtns',
      '_手动删除作品',
      '_手动删除作品Title',
      'manuallyDeleteWork',
      'secondary',
      'danger'
    )

    this.delBtn.addEventListener('click', () => {
      this.toggleDeleteMode()
    })
  }

  // 切换删除模式
  private async toggleDeleteMode() {
    if (!this.checkCanDelete()) {
      return
    }

    const findTarget = document.querySelector(this.worksSelector)
    if (!findTarget) {
      msgBox.warning(lang.transl('_提示当前页面上没有可以用于手动删除的元素'), {
        title: lang.transl('_手动删除作品'),
      })
      this.delMode = false
      return
    }

    this.delMode = !this.delMode

    this.bindDeleteEvent()

    this.updateDeleteIcon()

    const span = this.delBtn.querySelector('span')
    if (this.delMode) {
      lang.updateText(span!, '_退出手动删除')
      await Utils.sleep(100)
      EVT.fire('closeSettingsPanel')
    } else {
      lang.updateText(span!, '_手动删除作品')
    }
  }

  // 清除多图作品
  private clearMultiple() {
    const allPicArea = document.querySelectorAll(this.worksSelector)
    allPicArea.forEach((el) => {
      if (el.querySelector(this.multipleSelector)) {
        el.remove()
      }
    })
    toast.success(lang.transl('_已调整抓取结果'))
  }

  // 清除动图作品
  private ClearUgoira() {
    const allPicArea = document.querySelectorAll(this.worksSelector)
    allPicArea.forEach((el) => {
      if (el.querySelector(this.ugoiraSelector)) {
        el.remove()
      }
    })
    toast.success(lang.transl('_已调整抓取结果'))
  }

  // 给作品绑定手动删除事件
  // 删除作品后，回调函数可以接收到被删除的元素
  private bindDeleteEvent() {
    const listElement: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      this.worksSelector
    )
    listElement.forEach((el) => {
      el.onclick = (ev) => {
        if (this.delMode) {
          ev.preventDefault()

          if (states.busy) {
            toast.error(lang.transl('_当前任务尚未完成'))
            return
          }

          const target = ev.currentTarget as HTMLElement
          target.remove()
          toast.success(lang.transl('_已调整抓取结果'))
          this.deleteWorkCallback(target)
        }
      }
    })
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
