import { EVT } from '../EVT'
import { lang } from '../Lang'
import { store } from '../store/Store'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'
import { theme } from '../Theme'
import { msgBox } from '../MsgBox'
import { toast } from '../Toast'

export type OutputData = {
  content: string
  title: string
}

// 输出面板
class OutputPanel {
  constructor() {
    this.addOutPutPanel()

    theme.register(this.outputPanel)
    lang.register(this.outputPanel)

    this.bindEvents()
  }

  private outputPanel!: HTMLDivElement // 输出面板

  private outputTitle!: HTMLDivElement // 标题容器

  private outputContent!: HTMLDivElement // 内容容器

  private copyBtn!: HTMLButtonElement

  private closeBtn!: HTMLDivElement

  private bindEvents() {
    this.closeBtn.addEventListener('click', () => {
      this.close()
    })

    this.outputPanel.addEventListener('click', (e) => {
      const ev = e || window.event
      ev.stopPropagation()
    })

    document.addEventListener('click', () => {
      if (this.outputPanel.style.display !== 'none') {
        this.close()
      }
    })

    window.addEventListener(EVT.list.closeCenterPanel, () => {
      this.close()
    })

    // 复制输出内容
    this.copyBtn.addEventListener('click', () => {
      const range = document.createRange()
      range.selectNodeContents(this.outputContent)
      window.getSelection()!.removeAllRanges()
      window.getSelection()!.addRange(range)
      document.execCommand('copy')
      toast.success(lang.transl('_已复制到剪贴板'))
    })

    window.addEventListener(EVT.list.output, (ev: CustomEventInit) => {
      this.output(ev.detail.data)
    })
  }

  private addOutPutPanel() {
    const html = `
    <div class="outputWrap">
    <div class="outputClose" data-xztitle="_关闭">×</div>
    <div class="outputTitle" data-xztext="_输出信息"></div>
    <div class="outputContent beautify_scrollbar"></div>
    <div class="outputFooter">
    <button class="outputCopy" data-xztext="_复制"></button>
    </div>
    </div>
    `
    document.body.insertAdjacentHTML('beforebegin', html)

    this.outputPanel = document.querySelector('.outputWrap')! as HTMLDivElement

    this.outputTitle = this.outputPanel.querySelector(
      '.outputTitle'
    )! as HTMLDivElement

    this.outputContent = this.outputPanel.querySelector(
      '.outputContent'
    )! as HTMLDivElement

    this.copyBtn = this.outputPanel.querySelector(
      '.outputCopy'
    )! as HTMLButtonElement

    this.closeBtn = this.outputPanel.querySelector(
      '.outputClose'
    )! as HTMLDivElement
  }

  // 输出内容
  private output(data: OutputData) {
    if (!data.content) {
      return toast.error(lang.transl('_没有数据可供使用'))
    }

    if (store.result.length < Config.outputMax) {
      this.copyBtn.disabled = false
      lang.updateText(this.outputTitle, data.title)
      this.outputContent.innerHTML = data.content
      this.outputPanel.style.display = 'block'
    } else {
      // 如果结果较多，则不直接输出，改为保存 txt 文件
      const file = new Blob([data.content], {
        type: 'text/plain',
      })
      const url = URL.createObjectURL(file)
      const fileName = `Output-${new Date().toLocaleString()}.txt`
      Utils.downloadFile(url, fileName)

      this.copyBtn.disabled = true
      msgBox.warning(lang.transl('_输出内容太多已经为你保存到文件'))
    }
  }

  // 关闭输出面板
  private close() {
    this.outputPanel.style.display = 'none'
    this.outputContent.innerHTML = ''
    lang.updateText(this.outputTitle, '_输出信息')
  }
}

new OutputPanel()
