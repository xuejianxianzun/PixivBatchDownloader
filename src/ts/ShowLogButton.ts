import { lang } from './Language'
import { toast } from './Toast'
import { rightButtonManager } from './RightButtonManager'
import { EVT } from './EVT'

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
    this.bindCommand()
  }

  private createBtn() {
    this.showLogBtn = rightButtonManager.register({
      id: 'showLogBtn',
      title: '_查看日志',
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

  private bindCommand() {
    // 日志区域的快捷键（默认 L）由 HotkeyListener 统一捕获并派发 commandToggleLogArea
    window.addEventListener(EVT.list.commandToggleLogArea, () => {
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
