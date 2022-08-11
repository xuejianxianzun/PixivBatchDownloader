import { settings } from '../setting/Settings'
import { lang } from '../Lang'
import { msgBox } from '../MsgBox'
import { log } from '../Log'
import { EVT } from '../EVT'
import { states } from '../store/States'

class TimedCrawl {
  constructor() {
    this.bindEvents()
  }

  private callback?: Function
  private time = 0
  private timer?: number
  /**定时器可用的最大延迟时间，这里计算为分钟 */
  // https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout#%E6%9C%80%E5%A4%A7%E5%BB%B6%E6%97%B6%E5%80%BC
  // max: 2147483647 / 60 / 1000
  private readonly timeMinuteMax = 35791
  /**这次抓取是否是由本模块发起的 */
  private crawlBySelf = false

  /**启动定时抓取任务。
   *
   * 只能有 1 个定时抓取任务，如果重复调用此方法，后传递的回调函数会覆盖之前的回调函数。
   */
  public start(cb: Function) {
    if (settings.timedCrawlInterval > this.timeMinuteMax) {
      msgBox.error(
        lang.transl('_定时抓取的时间超过最大值') +
          this.timeMinuteMax +
          lang.transl('_分钟')
      )
      return
    }

    if (settings.timedCrawlInterval < 1) {
      msgBox.error(lang.transl('_定时抓取的时间最小值'))
      return
    }

    this.reset()

    this.callback = cb
    this.time = settings.timedCrawlInterval * 60 * 1000
    this.timer = window.setInterval(() => {
      if (!this.callback) {
        return this.reset()
      }
      this.crawlBySelf = true
      states.quickCrawl = true
      this.callback()
    }, this.time)

    const msg = lang.transl(
      '_定时抓取已启动的提示',
      settings.timedCrawlInterval.toString()
    )
    msgBox.show(msg + '<br>' + lang.transl('_定时抓取已启动的提示2'))
    log.success(msg)
  }

  private reset() {
    this.callback = undefined
    window.clearTimeout(this.timer)
    this.crawlBySelf = false
    states.quickCrawl = false
  }

  private bindEvents() {
    window.addEventListener(EVT.list.pageSwitch, () => {
      if (!this.callback) {
        return
      }
      this.reset()
      msgBox.error(lang.transl('_因为URL变化取消定时抓取任务'))
    })

    window.addEventListener(EVT.list.crawlStart, () => {
      if (!this.crawlBySelf) {
        return
      }
      log.success(lang.transl('_定时抓取'))
      log.log(lang.transl('_当前时间') + new Date().toLocaleString())
    })

    window.addEventListener(EVT.list.crawlFinish, () => {
      this.crawlBySelf = false
    })
  }
}

const timedCrawl = new TimedCrawl()
export { timedCrawl }
