import { lang } from './Lang'
import { EVT } from './EVT'
import { themeColor } from './ThemeColor'

interface Msg {
  title?: string
  msg: string
  btn?: string
}

// 一个简单的对话框
class MsgBox {
  constructor() {
    this.bindEvent()
  }

  private data: Msg = {
    title: 'Powerful Pixiv Downloader',
    msg: '',
    btn: lang.transl('_确定')
  }

  private bindEvent() {
    window.addEventListener(EVT.list.showMsg, (ev: CustomEventInit) => {
      const msg = ev.detail.data as Msg
      this.create(msg)
    })
  }

  private create(data: Msg) {
    const el = document.createElement('div')
    el.classList.add('xz_msg_box')
    el.innerHTML = `
        <p class="title">${data.title || this.data.title}</p>
        <p class="content">${data.msg}</p>
        <button class="btn" type="button">${data.btn || this.data.btn}</button>
      `

    themeColor.register(el)

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