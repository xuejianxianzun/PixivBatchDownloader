interface MouseArg {
  type: number
  x: number
  y: number
}

// 显示提示内容
class Tip {
  constructor() {
    this.addTipEl()
    this.bindEvent()
  }
  private tipEl: HTMLDivElement = document.createElement('div') // tip 元素

  private addTipEl() {
    this.tipEl = document.createElement('div')
    this.tipEl.id = 'tip'
    document.body.insertAdjacentElement('afterbegin', this.tipEl)
  }

  private bindEvent(){
    const tips = document.querySelectorAll('.has_tip') as NodeListOf<
      HTMLElement
    >
    for (const el of tips) {
      for (const ev of ['mouseenter', 'mouseleave']) {
        el.addEventListener(ev, (event) => {
          const e = (event || window.event) as MouseEvent
          const text = el.dataset.tip
          this.showTip(text, {
            type: ev === 'mouseenter' ? 1 : 0,
            x: e.clientX,
            y: e.clientY,
          })
        })
      }
    }
  }

  // 显示中间面板上的提示。参数 mouse 指示鼠标是移入还是移出，并包含鼠标坐标
  private showTip(text: string | undefined, mouse: MouseArg) {
    if (!text) {
      throw new Error('No tip text.')
    }

    if (mouse.type === 1) {
      this.tipEl.innerHTML = text
      this.tipEl.style.left = mouse.x + 30 + 'px'
      this.tipEl.style.top = mouse.y - 30 + 'px'
      this.tipEl.style.display = 'block'
    } else if (mouse.type === 0) {
      this.tipEl.style.display = 'none'
    }
  }
}

new Tip()
export {}
