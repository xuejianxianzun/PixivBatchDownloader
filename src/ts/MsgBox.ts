import { EVT } from './EVT'
import { Colors } from './Colors'
import { theme } from './Theme'
import { lang } from './Language'
import { bg } from './BG'
import { Config } from './Config'

interface MsgOptional {
  title?: string
  color?: string
  hiddenBtn?: boolean
  btn?: string
}

export type Msg = MsgOptional & {
  msg: string
}

// 简单的消息框
class MsgBox {
  constructor() {
    this.bindEvents()
  }

  private readonly typeColor: {
    [key: string]: Colors
  } = {
    success: Colors.textSuccess,
    warning: Colors.textWarning,
    error: Colors.textError,
  }

  private bindEvents() {
    window.addEventListener(EVT.list.showMsg, (ev: CustomEventInit) => {
      const msg = ev.detail.data as Msg
      this.create(msg)
    })
  }

  private onceFlags: string[] = []

  /** 在当前标签页中只会显示一次的消息
   */
  public once(
    flag: string,
    msg: string,
    type: 'show' | 'warning' | 'success' | 'error' = 'show',
    arg?: MsgOptional
  ) {
    if (this.onceFlags.includes(flag)) {
      return
    }
    this.onceFlags.push(flag)

    switch (type) {
      case 'show':
        this.show(msg, arg)
        break
      case 'warning':
        this.warning(msg, arg)
        break
      case 'success':
        this.success(msg, arg)
        break
      case 'error':
        this.error(msg, arg)
        break
      default:
        this.show(msg, arg)
        break
    }
  }

  /**
   * 清除某个 once 标记，使其对应的消息可以再次显示
   */
  public resetOnce(flag: string) {
    const index = this.onceFlags.findIndex((str) => str === flag)
    if (index > -1) {
      this.onceFlags.splice(index)
    }
  }

  public show(msg: string, arg?: MsgOptional) {
    return this.create(Object.assign({}, arg, { msg: msg }))
  }

  public success(msg: string, arg?: MsgOptional) {
    return this.create(
      Object.assign({ color: this.typeColor.success }, arg, { msg: msg })
    )
  }

  public warning(msg: string, arg?: MsgOptional) {
    return this.create(
      Object.assign({ color: this.typeColor.warning }, arg, { msg: msg })
    )
  }

  public error(msg: string, arg?: MsgOptional) {
    return this.create(
      Object.assign({ color: this.typeColor.error }, arg, { msg: msg })
    )
  }

  private create(data: Msg) {
    const wrap = document.createElement('div')
    wrap.classList.add('xz_msg_box')
    if (Config.mobile) {
      wrap.classList.add('mobile')
    }

    let colorStyle = ''
    if (data.color) {
      colorStyle = `style="color:${data.color}"`
    }

    wrap.innerHTML = `
        <div class="title">${data.title || Config.appName}</div>
        <div class="content beautify_scrollbar" ${colorStyle}>${data.msg}</div>
        ${
          data.hiddenBtn
            ? ''
            : `<button class="btn hasRippleAnimation" type="button">
              <span>${data.btn || lang.transl('_确定')}</span>
              <span class="ripple"></span>
              </button>`
        }
      `

    theme.register(wrap)
    lang.register(wrap)

    wrap.addEventListener('click', (ev) => {
      ev.stopPropagation()
    })

    window.addEventListener(EVT.list.closeCenterPanel, () => {
      this.remove(wrap)
    })

    document.body.append(wrap)

    if (!data.hiddenBtn) {
      const btn = wrap.querySelector('.btn') as HTMLButtonElement

      btn.addEventListener('click', () => {
        this.remove(wrap)
      })

      // btn.focus()
    }

    bg.useBG(wrap)

    return wrap
  }

  private remove(el: HTMLDivElement) {
    el && el.parentNode && el.parentNode.removeChild(el)
  }
}

const msgBox = new MsgBox()
export { msgBox }
