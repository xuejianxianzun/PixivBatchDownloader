import { EVT } from './EVT'
import { lang } from './Lang'

// 页面右侧的按钮，点击可以打开中间面板
class OpenCenterPanel {
  constructor() {
    this.addBtn()
    this.show()
    this.bindEvents()
  }

  private btn: HTMLButtonElement = document.createElement('button')

  private addBtn() {
    this.btn = document.createElement('button')
    this.btn.classList.add('rightButton')
    this.btn.id = 'openCenterPanelBtn'
    this.btn.setAttribute('data-xztitle', '_显示控制面板')
    this.btn.innerHTML = `<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-dakai"></use>
</svg>`
    document.body.append(this.btn)
    lang.register(this.btn)
  }

  private bindEvents() {
    // 这里阻止事件冒泡是为了配合 CenterPanel 的“点击页面其他部分隐藏 CenterPanel”的效果
    this.btn.addEventListener('click', (e) => {
      const ev = e || window.event
      ev.stopPropagation()
      EVT.fire('openCenterPanel')
    })

    window.addEventListener(EVT.list.centerPanelClosed, () => {
      this.show()
    })

    window.addEventListener(EVT.list.centerPanelOpened, () => {
      this.hide()
    })
  }

  private show() {
    this.btn.style.display = 'flex'
  }

  private hide() {
    this.btn.style.display = 'none'
  }
}

new OpenCenterPanel()
