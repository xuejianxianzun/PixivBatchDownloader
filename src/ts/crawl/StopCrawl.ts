import { Colors } from '../Colors'
import { EVT } from '../EVT'
import { lang } from '../Lang'
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
    this.btn = Tools.addBtn('stopCrawl', Colors.bgRed, '_停止抓取')
    this.hide()

    this.btn.addEventListener('click', () => {
      this.hide()
      const msg = lang.transl('_已停止抓取')
      log.error(msg)
      toast.error(msg)
      EVT.fire('stopCrawl')
      states.stopCrawl = true
    })
  }

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.show()
    })

    const hiddenEvents = [EVT.list.crawlComplete, EVT.list.stopCrawl]
    hiddenEvents.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.hide()
      })
    })
  }

  private hide() {
    this.btn.style.display = 'none'
  }

  private show() {
    this.btn.style.display = 'flex'
  }
}

new StopCrawl()
