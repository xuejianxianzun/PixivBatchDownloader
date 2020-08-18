import { EVT } from './EVT'
import { lang } from './Lang'
import { store } from './Store'
import { DOM } from './DOM'
import config from './Config'
import { themeColor } from './ThemeColor'

// 输出面板
class Output {
  constructor() {
    this.addOutPutPanel()

    themeColor.register(this.outputPanel)

    this.bindEvent()
  }

  private outputPanel!: HTMLDivElement // 输出面板

  private outputTitle!: HTMLDivElement // 输出面板的标题容器

  private outputContent!: HTMLDivElement // 输出文本的容器元素

  private copyBtn!: HTMLButtonElement

  private closeBtn!: HTMLDivElement

  private addOutPutPanel() {
    const outputPanelHTML = `
    <div class="outputWrap">
    <div class="outputClose" title="${lang.transl('_关闭')}">X</div>
    <div class="outputTitle">${lang.transl('_输出信息')}</div>
    <div class="outputContent"></div>
    <div class="outputFooter">
    <button class="outputCopy" title="">${lang.transl('_复制')}</button>
    </div>
    </div>
    `
    document.body.insertAdjacentHTML('beforeend', outputPanelHTML)

    this.outputPanel = document.querySelector('.outputWrap')! as HTMLDivElement

    this.outputTitle = this.outputPanel.querySelector('.outputTitle')! as HTMLDivElement

    this.outputContent = this.outputPanel.querySelector('.outputContent')! as HTMLDivElement

    this.copyBtn = this.outputPanel.querySelector('.outputCopy')! as HTMLButtonElement

    this.closeBtn = this.outputPanel.querySelector('.outputClose')! as HTMLDivElement

  }

  // 关闭输出面板
  private close() {
    this.outputPanel.style.display = 'none'
    this.outputContent.innerHTML = ''
  }

  private bindEvent() {
    this.closeBtn.addEventListener('click', () => {
      this.close()
    })

    window.addEventListener(EVT.events.centerPanelClosed, () => {
      this.close()
    })

    // 复制输出内容
    this.copyBtn.addEventListener('click', () => {
      const range = document.createRange()
      range.selectNodeContents(this.outputContent)
      window.getSelection()!.removeAllRanges()
      window.getSelection()!.addRange(range)
      document.execCommand('copy')

      // 改变提示文字
      this.copyBtn.textContent = lang.transl('_已复制到剪贴板')
      setTimeout(() => {
        window.getSelection()!.removeAllRanges()
        this.copyBtn.textContent = lang.transl('_复制')
      }, 1000)
    })

    window.addEventListener(EVT.events.output, (ev: CustomEventInit) => {
      this.output(ev.detail.data.content, ev.detail.data.title)
    })
  }

  // 输出内容
  private output(content: string, title = lang.transl('_输出信息')) {
    // 如果结果较多，则不直接输出，改为保存 txt 文件
    if (store.result.length > config.outputMax) {
      const con = content.replace(/<br>/g, '\n') // 替换换行符
      const file = new Blob([con], {
        type: 'text/plain',
      })
      const url = URL.createObjectURL(file)
      const fileName = new Date().toLocaleString() + '.txt'

      DOM.downloadFile(url, fileName)

      // 禁用复制按钮
      this.copyBtn.disabled = true
      content = lang.transl('_输出内容太多已经为你保存到文件')
    } else {
      this.copyBtn.disabled = false
    }

    if (content) {
      this.outputContent.innerHTML = content
      this.outputPanel.style.display = 'block'
      this.outputTitle.textContent = title
    }
  }
}

new Output()
export { }
