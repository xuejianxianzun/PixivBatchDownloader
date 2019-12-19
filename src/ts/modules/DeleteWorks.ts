// 删除页面上的作品
import { log } from './Log'
import { lang } from './Lang'
import { ui } from './UI'
import { Colors } from './Colors'
import { DOM } from './DOM'
import { store } from './Store'

class DeleteWorks {
  constructor(worksSelector: string) {
    this.worksSelector = worksSelector
  }

  private worksSelector: string = '' // 选择页面上所有作品的选择器

  private multipleSelector: string = '._3b8AXEx' // 多图作品特有的元素的标识

  private ugoiraSelector: string = '.AGgsUWZ' // 动图作品特有的元素的标识

  private delWork: boolean = false // 是否处于删除作品状态

  // 清除多图作品的按钮
  public addClearMultipleBtn() {
    ui.addCenterButton(Colors.red, lang.transl('_清除多图作品'), [
      ['title', lang.transl('_清除多图作品Title')]
    ]).addEventListener(
      'click',
      () => {
        ui.hideCenterPanel()
        this.clearMultiple()
      },
      false
    )
  }

  // 清除动图作品的按钮
  public addClearUgoiraBtn() {
    ui.addCenterButton(Colors.red, lang.transl('_清除动图作品'), [
      ['title', lang.transl('_清除动图作品Title')]
    ]).addEventListener(
      'click',
      () => {
        ui.hideCenterPanel()
        this.ClearUgoira()
      },
      false
    )
  }

  // 手动删除作品的按钮
  public addManuallyDeleteBtn() {
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
    this.outputNowResult()
  }

  // 清除动图作品
  private ClearUgoira() {
    const allPicArea = document.querySelectorAll(this.worksSelector)
    allPicArea.forEach(el => {
      if (el.querySelector(this.ugoiraSelector)) {
        el.remove()
      }
    })
    this.outputNowResult()
  }

  // 手动删除作品
  private manuallyDelete(delBtn: HTMLButtonElement) {
    this.delWork = !this.delWork

    // 给作品绑定删除属性
    const listElement: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      this.worksSelector
    )
    listElement.forEach(el => {
      el.onclick = ev => {
        if (this.delWork) {
          ev.preventDefault()

          DOM.removeEl(ev.currentTarget as HTMLElement)
          this.outputNowResult()
        }
      }
    })

    if (this.delWork) {
      delBtn.textContent = lang.transl('_退出手动删除')
      setTimeout(() => {
        ui.hideCenterPanel()
      }, 300)
    } else {
      delBtn.textContent = lang.transl('_手动删除作品')
    }
  }

  // 显示调整后，列表里的作品数量。仅在搜索页和发现页面中使用
  private outputNowResult() {
    const selector = this.worksSelector
    log.success(
      lang.transl('_调整完毕', DOM.getVisibleEl(selector).length.toString()),
      2,
      false
    )
  }
}

export { DeleteWorks }
