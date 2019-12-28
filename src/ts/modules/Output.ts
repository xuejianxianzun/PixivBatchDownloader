// 输出传递的文本
import { EVT } from './EVT'
import { lang } from './Lang'

class Output {
  constructor() {
    this.addOutPutPanel()

    this.bindEvent()
  }

  private outputPanel: HTMLDivElement = document.createElement('div') // 输出面板

  private outputContent: HTMLDivElement = document.createElement('div') // 输出文本的容器元素

  // 添加输出面板
  private addOutPutPanel() {
    const outputPanelHTML = `
    <div class="outputWrap">
    <div class="outputClose" title="${lang.transl('_关闭')}">X</div>
    <div class="outputTitle">${lang.transl('_输出信息')}</div>
    <div class="outputContent"></div>
    <div class="outputFooter">
    <div class="outputCopy" title="">${lang.transl('_复制')}</div>
    </div>
    </div>
    `
    document.body.insertAdjacentHTML('beforeend', outputPanelHTML)

    this.outputPanel = document.querySelector('.outputWrap')! as HTMLDivElement

    this.outputContent = document.querySelector(
      '.outputContent'
    )! as HTMLDivElement
  }

  private close() {
    this.outputPanel.style.display = 'none'
    this.outputContent.innerHTML = ''
  }

  private bindEvent() {
    // 关闭输出面板
    document.querySelector('.outputClose')!.addEventListener('click', () => {
      this.close()
    })

    window.addEventListener(EVT.events.hideCenterPanel, () => {
      this.close()
    })

    // 复制输出内容
    document.querySelector('.outputCopy')!.addEventListener('click', () => {
      const range = document.createRange()
      range.selectNodeContents(this.outputContent)
      window.getSelection()!.removeAllRanges()
      window.getSelection()!.addRange(range)
      document.execCommand('copy')

      // 改变提示文字
      document.querySelector('.outputCopy')!.textContent = lang.transl(
        '_已复制到剪贴板'
      )
      setTimeout(() => {
        window.getSelection()!.removeAllRanges()
        document.querySelector('.outputCopy')!.textContent = lang.transl(
          '_复制'
        )
      }, 1000)
    })

    window.addEventListener(EVT.events.output, (ev: CustomEventInit) => {
      this.output(ev.detail.data)
    })
  }

  // 输出内容
  private output(text: string) {
    if (text) {
      this.outputContent.innerHTML = text
      this.outputPanel.style.display = 'block'
    }
  }
}

new Output()
export {}
