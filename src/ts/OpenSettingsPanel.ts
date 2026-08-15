import { EVT } from './EVT'
import { lang } from './Language'
import { rightButtonManager } from './RightButtonManager'

// 页面右侧的按钮，点击可以打开设置面板
class OpenSettingsPanel {
  constructor() {
    this.addBtn()
    this.show()
    this.bindEvents()
  }

  private btn: HTMLButtonElement = document.createElement('button')

  /**设置面板是否处于显示状态 */
  private panelOpened = false

  private addBtn() {
    this.btn = rightButtonManager.register({
      id: 'openCenterPanelBtn',
      title: '_显示设置面板',
      icon: 'open',
      order: 10,
    })
  }

  private bindEvents() {
    // 这里阻止事件冒泡是为了配合 CenterPanel 的“点击页面其他部分隐藏 CenterPanel”的效果
    this.btn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (this.panelOpened) {
        EVT.fire('closeCenterPanel')
      } else {
        EVT.fire('openCenterPanel')
      }
    })

    window.addEventListener(EVT.list.centerPanelOpened, () => {
      this.panelOpened = true
      this.btn.dataset.xztitle = '_隐藏设置面板'
      this.btn.title = lang.transl('_隐藏设置面板')
    })

    window.addEventListener(EVT.list.centerPanelClosed, () => {
      this.panelOpened = false
      this.btn.dataset.xztitle = '_显示设置面板'
      this.btn.title = lang.transl('_显示设置面板')
    })
  }

  private show() {
    rightButtonManager.show(this.btn)
  }
}

new OpenSettingsPanel()
