import { lang } from './Lang'
import { EVT } from './EVT'
import { theme } from './Theme'
import { Color} from './Colors'

export interface Msg {
  title?: string
  msg: string
  btn?: string
  type?: "success" | "warning" | "error"
}

// 一个简单的消息框
class MsgBox {
  constructor() {
    this.bindEvents()
  }

  private readonly typeColor: {
    [key: string]: Color
  } = {
      success: Color.textSuccess,
      warning: Color.textWarning,
      error: Color.textError
    }

  private bindEvents() {
    window.addEventListener(EVT.list.showMsg, (ev: CustomEventInit) => {
      const msg = ev.detail.data as Msg
      this.create(msg)
    })
  }

  private create(data: Msg) {
    const el = document.createElement('div')
    el.classList.add('xz_msg_box')

    let colorStyle = ''
    if (data.type) {
      colorStyle = `style="color:${this.typeColor[data.type]}"`
    }

    el.innerHTML = `
        <p class="title">${data.title || ''}</p>
        <p class="content" ${colorStyle}>${data.msg}</p>
        <button class="btn" type="button">${data.btn || lang.transl('_确定')
      }</button>
      `

    theme.register(el)

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

new MsgBox()
