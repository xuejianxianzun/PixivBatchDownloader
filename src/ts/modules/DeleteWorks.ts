// 删除页面上的作品
import { log } from './Log'
import { lang } from './Lang'
import { Colors } from './Colors'
import { DOM } from './DOM'
import { ui } from './UI'
import { store } from './Store'
import { EVT } from './EVT'

class DeleteWorks {
  constructor(worksSelectors: string) {
    this.worksSelector = worksSelectors

    // 作品列表更新后，需要重新给作品绑定删除事件
    window.addEventListener(EVT.events.worksUpdate, () => {
      if (this.delMode) {
        this.bindDeleteEvent()
      }
    })
  }

  private worksSelector: string = '' // 选择页面上所有作品的选择器

  private multipleSelector: string = '' // 多图作品特有的元素的标识

  private ugoiraSelector: string = '' // 动图作品特有的元素的标识

  private delMode: boolean = false // 是否处于删除作品状态

  private deleteWorkCallback: Function = () => {} // 保存手动删除作品的回调函数，因为可能会多次绑定手动删除事件，所以需要保存传入的 callback 备用

  private allowWork() {
    return store.states.allowWork
  }

  // 清除多图作品的按钮
  public addClearMultipleBtn(selector: string, callback: Function = () => {}) {
    this.multipleSelector = selector

    ui.addCenterButton(Colors.red, lang.transl('_清除多图作品'), [
      ['title', lang.transl('_清除多图作品Title')]
    ]).addEventListener(
      'click',
      () => {
        if (!this.allowWork()) {
          return alert(lang.transl('_当前任务尚未完成'))
        }
        ui.hideCenterPanel()
        this.clearMultiple()
        callback()
      },
      false
    )
  }

  // 清除动图作品的按钮
  public addClearUgoiraBtn(selector: string, callback: Function = () => {}) {
    this.ugoiraSelector = selector

    ui.addCenterButton(Colors.red, lang.transl('_清除动图作品'), [
      ['title', lang.transl('_清除动图作品Title')]
    ]).addEventListener(
      'click',
      () => {
        if (!this.allowWork()) {
          return alert(lang.transl('_当前任务尚未完成'))
        }
        ui.hideCenterPanel()
        this.ClearUgoira()
        callback()
      },
      false
    )
  }

  // 手动删除作品的按钮
  public addManuallyDeleteBtn(callback: Function = () => {}) {
    this.deleteWorkCallback = callback
    const delBtn = ui.addCenterButton(
      Colors.red,
      lang.transl('_手动删除作品'),
      [['title', lang.transl('_手动删除作品Title')]]
    )

    delBtn.addEventListener('click', () => {
      this.manuallyDelete(delBtn)
    })
  }

  // 清除多图作品
  private clearMultiple() {
    const allPicArea = document.querySelectorAll(this.worksSelector)
    allPicArea.forEach(el => {
      if (el.querySelector(this.multipleSelector)) {
        el.remove()
      }
    })
    this.showWorksCount()
  }

  // 清除动图作品
  private ClearUgoira() {
    const allPicArea = document.querySelectorAll(this.worksSelector)
    allPicArea.forEach(el => {
      if (el.querySelector(this.ugoiraSelector)) {
        el.remove()
      }
    })
    this.showWorksCount()
  }

  // 给作品绑定删除事件
  private bindDeleteEvent() {
    const listElement: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      this.worksSelector
    )
    listElement.forEach(el => {
      el.onclick = ev => {
        if (this.delMode) {
          ev.preventDefault()

          if (!this.allowWork()) {
            return alert(lang.transl('_当前任务尚未完成'))
          }

          const target = ev.currentTarget as HTMLElement
          DOM.removeEl(target)
          this.showWorksCount()
          this.deleteWorkCallback(target)
        }
      }
    })
  }

  // 手动删除作品
  // 回调函数可以接收到被删除的元素
  private manuallyDelete(delBtn: HTMLButtonElement) {
    this.delMode = !this.delMode

    this.bindDeleteEvent()

    if (this.delMode) {
      delBtn.textContent = lang.transl('_退出手动删除')
      setTimeout(() => {
        ui.hideCenterPanel()
      }, 300)
    } else {
      delBtn.textContent = lang.transl('_手动删除作品')
    }
  }

  // 显示调整后，列表里的作品数量
  private showWorksCount() {
    const selector = this.worksSelector
    log.success(
      lang.transl('_调整完毕', DOM.getVisibleEl(selector).length.toString()),
      2,
      false
    )
  }
}

export { DeleteWorks }
