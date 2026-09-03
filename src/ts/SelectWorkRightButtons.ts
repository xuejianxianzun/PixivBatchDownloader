import { Utils } from './utils/Utils'
import { EVT } from './EVT'
import { pageType } from './PageType'
import { rightButtonManager } from './RightButtonManager'
import { selectWork } from './SelectWork'

/** 定制功能：在部分页面类型上，于网页右侧添加“全选 / 退出全选”按钮。
 *
 * 这两个按钮是「手动选择作品」（SelectWork）模块的附加入口：
 * 创建与显隐、以及 Alt + A 快捷键都在此模块管理；
 * 实际的选择 / 退出行为委托给 SelectWork 的公开方法（selectAll / exitSelect）。 */
class SelectWorkRightButtons {
  /** 启用这两个按钮的页面类型 */
  private readonly selectAllPageType = [
    pageType.list.UserHome,
    pageType.list.NewNovelFromFollowing,
    pageType.list.NewArtworkFromFollowing,
  ]

  // 网页右侧的“全选”按钮。注意与“开始抓取”区域里的 selectAllBtn（全选当前显示的作品）区分开
  private rightSelectAllBtn!: HTMLButtonElement
  private exitSelectBtn!: HTMLButtonElement

  constructor() {
    if (Utils.isPixiv()) {
      this.addRightBtn()
      this.bindEvents()
      this.toggleRightBtn()
    }
  }

  private addRightBtn() {
    this.rightSelectAllBtn = rightButtonManager.register({
      id: 'rightSelectAllBtn',
      title: '_全选',
      icon: 'selectAll',
      order: 21,
    })

    this.exitSelectBtn = rightButtonManager.register({
      id: 'exitSelectBtn',
      title: '_退出全选',
      icon: 'cancel_selectAll',
      order: 22,
    })
  }

  private bindEvents() {
    // 页面切换后，根据当前页面类型显示或隐藏这两个按钮
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.toggleRightBtn()
    })

    this.rightSelectAllBtn.addEventListener('click', () => {
      selectWork.selectAll()
    })

    // 退出手动选择模式，并取消所有选择的作品
    this.exitSelectBtn.addEventListener('click', () => {
      selectWork.exitSelect()
    })

    // 使用 Alt + A 快捷键来全选
    window.addEventListener('keydown', (ev) => {
      if (ev.altKey && ev.code === 'KeyA') {
        this.rightSelectAllBtn.click()
      }
    })
  }

  /** 根据当前页面类型，显示或隐藏这两个按钮 */
  private toggleRightBtn() {
    const enable = this.selectAllPageType.includes(pageType.type)
    if (enable) {
      rightButtonManager.show(this.rightSelectAllBtn)
      rightButtonManager.show(this.exitSelectBtn)
    } else {
      rightButtonManager.hide(this.rightSelectAllBtn)
      rightButtonManager.hide(this.exitSelectBtn)
    }
  }
}

new SelectWorkRightButtons()

export {}
