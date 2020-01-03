import { EVT } from './EVT'
import { centerPanel } from './CenterPanel'

// 中间面板添加按钮的区域
class CenterButtons {
  constructor() {
    window.addEventListener(EVT.events.destroy, () => {
      this.clear()
    })
  }

  public add(bg: string = '', text: string = '', attr: string[][] = []) {
    const e = document.createElement('button')
    e.type = 'button'
    e.style.backgroundColor = bg
    e.textContent = text

    for (const [key, value] of attr) {
      e.setAttribute(key, value)
    }

    centerPanel.useSlot('centerBtns', e)
    return e
  }

  private clear() {
    centerPanel.clearSlot('centerBtns')
  }
}

const centerButtons = new CenterButtons()
export { centerButtons }
