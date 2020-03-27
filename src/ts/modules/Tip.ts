interface TipArg {
  type: number
  x: number
  y: number
}

// 显示自定义的提示
class Tip {
  constructor() {
    this.addTipEl()
  }
  private tipEl: HTMLDivElement = document.createElement('div') // tip 元素

  // 显示提示
  private addTipEl() {
    const tipHTML = `<div id="tip"></div>`
    document.body.insertAdjacentHTML('beforeend', tipHTML)
    this.tipEl = document.getElementById('tip') as HTMLDivElement

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

  // 显示中间面板上的提示。参数 arg 指示鼠标是移入还是移出，并包含鼠标位置
  private showTip(text: string | undefined, arg: TipArg) {
    if (!text) {
      throw new Error('No tip text.')
    }

    if (arg.type === 1) {
      this.tipEl.innerHTML = text
      this.tipEl.style.left = arg.x + 30 + 'px'
      this.tipEl.style.top = arg.y - 30 + 'px'
      this.tipEl.style.display = 'block'
    } else if (arg.type === 0) {
      this.tipEl.style.display = 'none'
    }
  }
}

new Tip()
export {}
