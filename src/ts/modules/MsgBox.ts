import { EVT } from './EVT'
import { Colors } from './Colors'
// import { theme } from './Theme'
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
    const el = document.createElement('div')
    el.classList.add('xz_msg_box')

    let colorStyle = ''
    if (data.color) {
      colorStyle = `style="color:${data.color}"`
    }

    el.innerHTML = `
        <p class="title">${data.title || ''}</p>
        <p class="content" ${colorStyle}>${data.msg}</p>
        <button class="btn" type="button">${
          data.btn || lang.transl('_确定')
        }</button>
      `

    // theme.register(el)

    document.body.insertAdjacentElement('afterbegin', el)

    const btn = el.querySelector('.btn') as HTMLButtonElement
    btn.focus()

    if (btn) {
      el.addEventListener('click', (ev) => {
        ev.stopPropagation()
      })

      btn.addEventListener('click', () => {
        this.remove(el)
      })

      window.addEventListener(EVT.list.closeCenterPanel, () => {
        this.remove(el)
      })
    }
  }

  private remove(el: HTMLDivElement) {
    el && el.parentNode && el.parentNode.removeChild(el)
  }
}

const msgBox = new MsgBox()
export { msgBox }
