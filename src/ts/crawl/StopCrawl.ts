import { EVT } from '../EVT'
import { lang } from '../Language'
import { log } from '../Log'
import { states } from '../store/States'
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
      // 抓取用户列表时，停止抓取会终止整个任务，所以需要让用户确认。
      // 用户取消时不会触发 stopCrawl 事件，也就不会有后续的停止流程
      if (states.crawlUserList) {
        if (!window.confirm(lang.transl('_停止抓取用户列表的提示'))) {
          return
        }
      }
      EVT.fire('stopCrawl')
    })
    // 触发 stopCrawl 事件之后，states.stopCrawl 会被设置为 true
    // 然后结束抓取流程，并触发抓取完成的事件（见 src/ts/crawl/InitPageBase.ts 里的 crawlFinished 方法）
  }

  /**绑定停止按钮和抓取生命周期事件 */
  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.show()
    })

    window.addEventListener(EVT.list.crawlComplete, () => {
      // 抓取用户列表的任务在下载阶段也需要显示停止按钮（它由该任务自己控制隐藏时机），所以此时不隐藏它
      if (states.crawlUserList) {
        return
      }
      this.hide()
    })

    window.addEventListener(EVT.list.stopCrawl, () => {
      this.hide()
      // 抓取用户列表的任务会自己输出停止的提示
      if (states.crawlUserList) {
        return
      }
      this.log()
    })
  }

  /**隐藏停止抓取按钮 */
  public hide() {
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

const stopCrawl = new StopCrawl()
export { stopCrawl }
