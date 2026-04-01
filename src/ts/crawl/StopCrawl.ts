import { Colors } from '../Colors'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { log } from '../Log'
import { toast } from '../Toast'
import { Tools } from '../Tools'
import { states } from '../store/States'

class StopCrawl {
  constructor() {
    this.addBtn()
    this.bindEvents()
  }
  private btn!: HTMLButtonElement

  private addBtn() {
    this.btn = Tools.addBtn(
      'stopCrawl',
      Colors.bgRed,
      '_停止抓取',
      '',
      'stopCrawling'
    )
    this.hide()

    this.btn.addEventListener('click', () => {
      EVT.fire('stopCrawl')
      states.stopCrawl = true
    })
  }

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.show()
    })

    window.addEventListener(EVT.list.crawlComplete, () => {
      this.hide()
    })

    window.addEventListener(EVT.list.stopCrawl, () => {
      this.hide()
      this.log()
    })
  }

  private hide() {
    this.btn.style.display = 'none'
  }

  private show() {
    this.btn.style.display = 'flex'
  }

  private log() {
    const msg = lang.transl('_已停止抓取')
    log.error('🛑' + msg)
    toast.error(msg)
  }
}

new StopCrawl()
