import { lang } from './Language'
import { toast } from './Toast'
import { rightButtonManager } from './RightButtonManager'

export interface LogAreaContext {
  getShow(): boolean
  setShow(value: boolean): void
  getCount(): number
  getIsVisible(): boolean
}

// 页面右侧的"显示日志"按钮
class ShowLogButton {
  private ctx!: LogAreaContext
  private showLogBtn!: HTMLButtonElement

  public init(ctx: LogAreaContext) {
    this.ctx = ctx
    this.createBtn()
    this.bindBtnEvents()
    this.bindKeydown()
  }

  private createBtn() {
    this.showLogBtn = rightButtonManager.register({
      id: 'showLogBtn',
      title: '_查看日志附带快捷键L',
      icon: 'list',
      order: 20,
    })
    rightButtonManager.show(this.showLogBtn)
  }

  private bindBtnEvents() {
    // click 事件同时覆盖鼠标点击和触摸确认，避免与 touchstart 重复触发
    this.showLogBtn.addEventListener('click', () => {
      this.toggleLog()
    })
  }

  private bindKeydown() {
    // 按快捷键 L 显示/隐藏日志区域
    window.addEventListener('keydown', (ev) => {
      if (ev.code !== 'KeyL' || ev.ctrlKey || ev.altKey || ev.metaKey) {
        return
      }

      if (ev.target) {
        const target = ev.target as HTMLElement
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return
        }
      }

      ev.preventDefault()
      this.toggleLog()
    })
  }

  /**显示或隐藏日志区域 */
  private toggleLog() {
    if (this.ctx.getCount() === 0) {
      toast.warning(lang.transl('_没有日志'))
      return
    }

    // 日志隐藏或不完全可见时，跳转到页面顶部并显示日志
    if (this.ctx.getShow() === false || this.ctx.getIsVisible() === false) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.ctx.setShow(true)
    } else {
      this.ctx.setShow(false)
    }
  }
}

const showLogButton = new ShowLogButton()
export { showLogButton }
