import { EVT } from './EVT'

// 右侧的下载图标
class DownloadButton {
  constructor() {
    this.addIcon()
    this.bindEvents()
  }

  private btn: HTMLButtonElement = document.createElement('button')

  // 添加右侧下载按钮
  private addIcon() {
    this.btn = document.createElement('button')
    this.btn.textContent = '↓'
    this.btn.id = 'rightButton'
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
