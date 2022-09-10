import { EVT } from './EVT'
import { Colors } from './Colors'
import { theme } from './Theme'
import { lang } from './Lang'
import { bg } from './BG'

interface MsgOptional {
  btn?: string
  title?: string
  color?: string
}

export interface Msg {
  title?: string
  msg: string
  btn?: string
  color?: string
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
    this.create(Object.assign({}, arg, { msg: msg }))
  }

  public success(msg: string, arg?: MsgOptional) {
    this.create(
      Object.assign({ color: this.typeColor.success }, arg, { msg: msg })
    )
  }

  public warning(msg: string, arg?: MsgOptional) {
    this.create(
      Object.assign({ color: this.typeColor.warning }, arg, { msg: msg })
    )
  }

  public error(msg: string, arg?: MsgOptional) {
    this.create(
      Object.assign({ color: this.typeColor.error }, arg, { msg: msg })
    )
  }

  private create(data: Msg) {
    const wrap = document.createElement('div')
    wrap.classList.add('xz_msg_box')

    let colorStyle = ''
    if (data.color) {
      colorStyle = `style="color:${data.color}"`
    }

    wrap.innerHTML = `
        <p class="title" ${colorStyle}>${data.title || ''}</p>
        <p class="content" ${colorStyle}>${data.msg}</p>
        <button class="btn" type="button">${
          data.btn || lang.transl('_确定')
        }</button>
      `

    theme.register(wrap)
    lang.register(wrap)

    const btn = wrap.querySelector('.btn') as HTMLButtonElement

    if (btn) {
      wrap.addEventListener('click', (ev) => {
        ev.stopPropagation()
      })

      btn.addEventListener('click', () => {
        this.remove(wrap)
      })

      window.addEventListener(EVT.list.closeCenterPanel, () => {
        this.remove(wrap)
      })
    }

    document.body.append(wrap)
    btn.focus()

    bg.useBG(wrap)
  }

  private remove(el: HTMLDivElement) {
    el && el.parentNode && el.parentNode.removeChild(el)
  }
}

const msgBox = new MsgBox()
export { msgBox }
