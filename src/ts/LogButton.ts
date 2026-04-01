import { lang } from './Language'
import { toast } from './Toast'
import { Utils } from './utils/Utils'
import { pageType } from './PageType'

export interface LogAreaContext {
  getShow(): boolean
  setShow(value: boolean): void
  getCount(): number
  getIsVisible(): boolean
}

// 页面顶部的"显示日志"按钮
class LogButton {
  private ctx!: LogAreaContext
  private logBtn!: HTMLDivElement

  public init(ctx: LogAreaContext) {
    this.ctx = ctx
    this.createBtn()
    this.bindBtnEvents()
    this.startBtnVisibilityTimer()
    this.bindScrollHide()
    this.bindKeydown()
  }

  private createBtn() {
    const html = `<div id="logBtn" class="logBtn"><span data-xztext="_显示日志"></span>&nbsp;<span>(L)</span></div>`
    document.body.insertAdjacentHTML('beforebegin', html)
    this.logBtn = document.getElementById('logBtn') as HTMLDivElement
    const text = this.logBtn.firstElementChild as HTMLSpanElement
    lang.register(text)
  }

  /**显示或隐藏顶部的"显示日志"按钮 */
  // 它默认是 opacity: 0，即不可见
  public setVisible(value: boolean) {
    // 在图像作品页面里，如果处于漫画页面里的阅读模式（检测特定的 a 元素），则不显示按钮。网址如：
    // https://www.pixiv.net/artworks/130919451#1
    // 这是因为即使用户之前已经把页面滚动了一部分（按钮是隐藏的），但点击"阅读全部"后，按钮就会显示出来
    // 但实际上在阅读时不应该显示按钮，所以特殊处理一下
    if (
      pageType.type === pageType.list.Artwork &&
      /#\d/.test(window.location.hash) &&
      document.querySelector('a.gtm-expand-full-size-illust')
    ) {
      this.logBtn.classList.remove('show')
      return
    }

    if (value) {
      if (this.ctx.getCount() > 0 && window.scrollY <= 10) {
        this.logBtn.classList.add('show')
      }
    } else {
      this.logBtn.classList.remove('show')
    }
  }

  private bindBtnEvents() {
    // 在"显示日志"按钮上触发这些事件时，显示日志区域
    const showEvents = ['click', 'mouseover', 'touchstart']
    showEvents.forEach((evt) => {
      this.logBtn.addEventListener(
        evt,
        () => {
          this.setVisible(false)
          this.ctx.setShow(true)
        },
        { passive: false }
      )
    })
  }

  /** 定时检查是否应该显示"显示日志"按钮 */
  private startBtnVisibilityTimer() {
    window.setInterval(() => {
      if (this.ctx.getShow() === false) {
        this.setVisible(true)
      }
    }, 100)
  }

  private bindScrollHide() {
    // 当页面滚动一定距离后，隐藏"显示日志"按钮
    const hideLogBtn = Utils.debounce(() => {
      if (window.scrollY > 10) {
        this.setVisible(false)
      }
    }, 100)
    window.addEventListener('scroll', () => {
      hideLogBtn()
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

      if (this.ctx.getCount() === 0) {
        toast.warning(lang.transl('_没有日志'))
        return
      }

      // 需要显示日志的情况：
      // 日志是隐藏的，或者不完全可见，则跳转到页面顶部，并显示日志
      if (this.ctx.getShow() === false || this.ctx.getIsVisible() === false) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        this.ctx.setShow(true)
      } else {
        // 如果日志完全可见，则隐藏日志区域
        this.ctx.setShow(false)
      }
    })
  }
}

const logButton = new LogButton()
export { logButton }
