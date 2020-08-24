import { EVT } from './EVT'
import { lang } from './Lang'

// 右侧的下载按钮
class DownloadButton {
  constructor() {
    this.addBtn()
    this.bindEvents()
  }

  private btn: HTMLButtonElement = document.createElement('button')

  private addBtn() {
    this.btn = document.createElement('button')
    this.btn.id = 'rightButton'
    this.btn.textContent = '↓'
    this.btn.setAttribute('title', lang.transl('_显示下载面板') + ' (Alt + X)')
    document.body.insertAdjacentElement('afterbegin', this.btn)
  }

  private bindEvents() {
    this.btn.addEventListener('click', () => {
      EVT.fire(EVT.events.clickRightIcon)
    })

    window.addEventListener(EVT.events.centerPanelClosed, () => {
      this.show()
    })

    window.addEventListener(EVT.events.centerPanelOpened, () => {
      this.hide()
    })
  }

  private show() {
    this.btn.style.display = 'block'
  }

  private hide() {
    this.btn.style.display = 'none'
  }
}

new DownloadButton()
export {}
