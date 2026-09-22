import { EVT } from '../EVT'
import { lang } from '../Language'
import { log } from '../Log'
import { toast } from '../Toast'
import { Tools } from '../Tools'

class StopCrawl {
  constructor() {
    this.addBtn()
    this.bindEvents()
  }
  private btn!: HTMLButtonElement

  /**创建停止抓取按钮 */
  private addBtn() {
    this.btn = Tools.addBtn(
      'stopCrawl',
      '_停止抓取',
      '',
      'stopCrawling',
      'secondary',
      'danger'
    )
    this.hide()

    this.btn.addEventListener('click', () => {
      EVT.fire('stopCrawl')
    })
  }

  /**绑定停止按钮和抓取生命周期事件 */
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
