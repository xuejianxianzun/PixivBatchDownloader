interface MouseArg {
  type: number
  x: number
  y: number
}

// 给下载器的界面元素添加提示文本，当鼠标移动到元素上时会显示提示
// 如果要给某个元素添加提示，先给它添加 has_tip 的 className，然后用 data-tip 设置提示内容
class Tip {
  constructor() {
    this.addTipEl()
    this.bindEvents()
  }
  private tipEl!: HTMLDivElement

  private addTipEl() {
    this.tipEl = document.createElement('div')
    this.tipEl.id = 'tip'
    document.body.append(this.tipEl)
  }

  private bindEvents() {
    const tips = document.querySelectorAll(
      '.has_tip'
    ) as NodeListOf<HTMLElement>
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
