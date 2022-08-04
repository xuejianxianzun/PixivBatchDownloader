// 删除页面上的作品
import { log } from '../Log'
import { lang } from '../Lang'
import { Colors } from '../config/Colors'
import { Tools } from '../Tools'
import { states } from '../store/States'
import { EVT } from '../EVT'
import { msgBox } from '../MsgBox'
import { Utils } from '../utils/Utils'
import { store } from '../store/Store'
import { toast } from '../Toast'

class DeleteWorks {
  constructor(worksSelectors: string) {
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
      Colors.bgRed,
      '_清除多图作品',
      '_清除多图作品Title'
    ).addEventListener(
      'click',
      () => {
        if (states.busy) {
          msgBox.error(lang.transl('_当前任务尚未完成'))
          return
        }

        if (store.resultMeta.length === 0) {
          toast.error(lang.transl('_没有可用的抓取结果'))
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
      Colors.bgRed,
      '_清除动图作品',
      '_清除动图作品Title'
    ).addEventListener(
      'click',
      () => {
        if (states.busy) {
          msgBox.error(lang.transl('_当前任务尚未完成'))
          return
        }

        if (store.resultMeta.length === 0) {
          toast.error(lang.transl('_没有可用的抓取结果'))
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
      Colors.bgRed,
      '_手动删除作品',
      '_手动删除作品Title'
    )

    this.delBtn.addEventListener('click', () => {
      this.toggleDeleteMode()
    })
  }

  // 切换删除模式
  private toggleDeleteMode() {
    if (store.resultMeta.length === 0) {
      toast.error(lang.transl('_没有可用的抓取结果'))
      return
    }
    this.delMode = !this.delMode

    this.bindDeleteEvent()

    this.updateDeleteIcon()

    if (this.delMode) {
      lang.updateText(this.delBtn, '_退出手动删除')
      window.setTimeout(() => {
        EVT.fire('closeCenterPanel')
      }, 100)
    } else {
      lang.updateText(this.delBtn, '_手动删除作品')
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
    this.showWorksCount()
  }

  // 清除动图作品
  private ClearUgoira() {
    const allPicArea = document.querySelectorAll(this.worksSelector)
    allPicArea.forEach((el) => {
      if (el.querySelector(this.ugoiraSelector)) {
        el.remove()
      }
    })
    this.showWorksCount()
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
            msgBox.error(lang.transl('_当前任务尚未完成'))
            return
          }

          const target = ev.currentTarget as HTMLElement
          target.remove()
          this.showWorksCount()
          this.deleteWorkCallback(target)
        }
      }
    })
  }

  // 显示调整后，列表里的作品数量
  private showWorksCount() {
    const selector = this.worksSelector
    log.success(
      lang.transl('_调整完毕', Utils.getVisibleEl(selector).length.toString()),
      2,
      false
    )
  }
}

export { DeleteWorks }
