interface MouseArg {
  type: number
  x: number
  y: number
}

// 给下载器的界面元素添加提示文本，当鼠标移动到元素上时会显示提示
// 用法：
// 如果要给某个元素添加提示，先给它添加 has_tip 的 className，然后用 data-tip 设置提示内容，例如：
// <div class="has_tip" data-tip="提示"></div>
// 如果要让 tip 文本支持多语言动态切换，可以使用 data-xztip 设置提示内容的 i18n key，例如：
// <div class="has_tip" data-xztip="_提示"></div>
// 然后在语言模块里注册这个元素：lang.register(el)
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
        el.addEventListener(ev, (e: MouseEventInit) => {
          const text = el.dataset.tip
          this.showTip(text, {
            type: ev === 'mouseenter' ? 1 : 0,
            x: e.clientX || 0,
            y: e.clientY || 0,
          })
        })
      }
    }
  }

  // 显示设置面板上的提示。参数 mouse 指示鼠标是移入还是移出，并包含鼠标坐标
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
