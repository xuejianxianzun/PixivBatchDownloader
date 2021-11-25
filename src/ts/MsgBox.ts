import { EVT } from './EVT'
import { Colors } from './config/Colors'
import { theme } from './Theme'
import { lang } from './Lang'

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

    document.body.insertAdjacentElement('afterbegin', wrap)
    btn.focus()
  }

  private remove(el: HTMLDivElement) {
    el && el.parentNode && el.parentNode.removeChild(el)
  }
}

const msgBox = new MsgBox()
export { msgBox }
