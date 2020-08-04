import { EVT } from './EVT'

// 右侧的下载图标
class RightIcon {
  constructor() {
    this.addIcon()
    this.bindEvents()
  }

  private icon: HTMLDivElement = document.createElement('div')

  // 添加右侧下载按钮
  private addIcon() {
    this.icon = document.createElement('div')
    this.icon.textContent = '↓'
    this.icon.id = 'rightButton'
    document.body.appendChild(this.icon)
  }

  private bindEvents() {
    this.icon.addEventListener('click', () => {
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
    this.icon.style.display = 'block'
  }

  private hide() {
    this.icon.style.display = 'none'
  }
}

new RightIcon()
export {}
