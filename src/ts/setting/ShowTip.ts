interface MouseArg {
  type: number
  x: number
  y: number
}

// 给下载器的界面元素添加提示文本，当鼠标移动到元素上时会显示提示
// 用法：
// 给元素添加 data-xztip，值是 i18n 文本的 key，例如：
// <div data-xztip="_提示"></div>
// 语言模块会把 data-xztip 翻译成实际文本并写入 data-tip，这里在鼠标移入时读取 data-tip 显示。
// 所以添加元素之后需要在语言模块里注册它：lang.register(el)
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
      '[data-xztip]'
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
