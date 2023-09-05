import { setSetting, settings } from '../setting/Settings'
import { lang } from '../Lang'
import { msgBox } from '../MsgBox'
import { log } from '../Log'
import { EVT } from '../EVT'
import { states } from '../store/States'
import { Input } from '../Input'
import { toast } from '../Toast'

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
  public async start(cb: Function) {
    const input = new Input({
      instruction: `${lang.transl('_定时抓取的间隔时间2')} (${lang.transl(
        '_分钟'
      )})`,
      value: settings.timedCrawlInterval.toString(),
      width: 500,
    })
    const value = await input.submit()
    if (!value) {
      return toast.warning(lang.transl('_本次操作已取消'))
    }

    const number = Number.parseInt(value)
    if (isNaN(number)) {
      return toast.error(lang.transl('_参数不合法本次操作已取消'))
    }

    if (number > this.timeMinuteMax) {
      msgBox.error(
        lang.transl('_定时抓取的时间超过最大值') +
          this.timeMinuteMax +
          lang.transl('_分钟')
      )
      return
    }

    if (number < 1) {
      msgBox.error(lang.transl('_定时抓取的时间最小值'))
      return
    }

    setSetting('timedCrawlInterval', number)

    this.reset()
    this.callback = cb
    this.execute()

    EVT.fire('startTimedCrawl')
    const msg = lang.transl(
      '_定时抓取已启动的提示',
      settings.timedCrawlInterval.toString()
    )
    msgBox.show(
      msg +
        '<br><br>' +
        lang.transl('_定时抓取的推荐用法') +
        '<br><br>' +
        lang.transl('_定时抓取已启动的提示2')
    )
    log.success(msg)
  }

  private execute() {
    this.time = settings.timedCrawlInterval * 60 * 1000
    this.timer = window.setTimeout(() => {
      if (!this.callback) {
        return
      }
      this.crawlBySelf = true
      states.quickCrawl = true
      this.callback()

      this.execute()
    }, this.time)
  }

  private reset() {
    this.callback = undefined
    window.clearTimeout(this.timer)
    this.crawlBySelf = false
    states.quickCrawl = false
  }

  private bindEvents() {
    // 当抓取结果为空，或者下载中止、完成时复位标记
    const resetCrawlBySelf = [
      EVT.list.crawlEmpty,
      EVT.list.downloadStop,
      EVT.list.downloadPause,
      EVT.list.downloadComplete,
      EVT.list.downloadCancel,
    ]

    for (const ev of resetCrawlBySelf) {
      window.addEventListener(ev, () => {
        window.setTimeout(() => {
          // 需要延迟执行，在日志提示显示之后再复位状态
          this.crawlBySelf = false
        }, 50)
      })
    }

    // 显示一些提示
    window.addEventListener(EVT.list.crawlStart, () => {
      if (!this.crawlBySelf) {
        return
      }
      log.success(lang.transl('_开始定时抓取'))
      log.log(lang.transl('_当前时间') + new Date().toLocaleString())
    })

    const tipWaitNextCrawl = [EVT.list.crawlEmpty, EVT.list.downloadComplete]

    for (const ev of tipWaitNextCrawl) {
      window.addEventListener(ev, () => {
        window.setTimeout(() => {
          if (this.crawlBySelf) {
            log.log(lang.transl('_当前时间') + new Date().toLocaleString())
            log.success(lang.transl('_等待下一次定时抓取'))
          }
        }, 0)
      })
    }

    window.addEventListener(EVT.list.cancelTimedCrawl, () => {
      this.reset()
      const msg = lang.transl('_已取消定时抓取')
      log.success(msg)
      msgBox.success(msg)
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      if (!this.callback) {
        return
      }
      this.reset()
      const msg = lang.transl('_因为URL变化取消定时抓取任务')
      log.error(msg)
      msgBox.error(msg)
    })
  }
}

const timedCrawl = new TimedCrawl()
export { timedCrawl }
