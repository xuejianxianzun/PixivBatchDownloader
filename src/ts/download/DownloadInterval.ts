import { EVT } from '../EVT'
import { lang } from '../Lang'
import { log } from '../Log'
import { settings } from '../setting/Settings'
import { store } from '../store/Store'

class DownloadInterval {
  constructor() {
    this.bindEvents()
  }

  /**允许开始下载的时间戳 */
  // 不管设置里的值是多少，初始值都是 0，即允许第一次下载立即开始
  // 在开始下载第一个文件后，才会有实际的值
  private allowDownloadTime = 0

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'downloadInterval') {
        if (data.value === 0) {
          this.reset()
        }
      }
    })

    const resetEvents = [
      EVT.list.crawlComplete,
      EVT.list.downloadStart,
      EVT.list.downloadPause,
      EVT.list.downloadStop,
      EVT.list.downloadComplete,
    ]
    resetEvents.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.reset()
      })
    })

    window.addEventListener(EVT.list.downloadStart, () => {
      // 在开始下载时，如果应用了间隔时间，则显示一条日志提醒
      if (
        store.result.length > settings.downloadIntervalOnWorksNumber &&
        settings.downloadInterval > 0
      ) {
        const msg =
          lang.transl('_下载间隔') +
          `: ${settings.downloadInterval} ` +
          lang.transl('_秒')
        log.warning(msg, 1, false, 'downloadInterval')
      }
    })
  }

  private reset() {
    this.allowDownloadTime = 0
  }

  private addTime() {
    this.allowDownloadTime =
      new Date().getTime() + settings.downloadInterval * 1000
  }

  public wait() {
    return new Promise(async (resolve) => {
      // 首先检查此设置不应该生效的情况，立即放行
      if (
        settings.downloadInterval === 0 ||
        store.result.length <= settings.downloadIntervalOnWorksNumber
      ) {
        return resolve(true)
      }

      // 可以立即开始下载
      if (new Date().getTime() >= this.allowDownloadTime) {
        this.addTime()
        return resolve(true)
      }

      // 需要等待
      const timer = window.setInterval(() => {
        if (new Date().getTime() >= this.allowDownloadTime) {
          window.clearInterval(timer)
          this.addTime()
          return resolve(true)
        }
      }, 50)
    })
  }
}

const downloadInterval = new DownloadInterval()
export { downloadInterval }
