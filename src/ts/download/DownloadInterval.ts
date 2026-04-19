import { EVT } from '../EVT'
import { lang } from '../Language'
import { log } from '../Log'
import { settings } from '../setting/Settings'
import { store } from '../store/Store'
import { Utils } from '../utils/Utils'

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
        log.warning(msg, 'downloadInterval')
      }
    })
  }

  private reset() {
    this.allowDownloadTime = 0
  }

  private addTime() {
    this.allowDownloadTime = Date.now() + settings.downloadInterval * 1000
  }

  public async wait() {
    while (true) {
      // 首先检查此设置不应该生效的情况
      if (
        settings.downloadInterval === 0 ||
        store.result.length <= settings.downloadIntervalOnWorksNumber
      ) {
        // 如果用户启用了“把文件保存到用户上次选择的位置”，则强制添加 200 ms 的延迟
        // 因为启用此设置时，下载器会使用 a 标签的 download 属性来下载文件。如果不添加延迟时间，那么在极端情况下，1  秒内可能会下载几十个文件，这会造成部分文件丢失（浏览器实际上没有下载部分文件）
        if (settings.rememberTheLastSaveLocation) {
          await Utils.sleep(200)
        }
        // 放行
        return
      }

      // 可以立即开始下载
      if (Date.now() >= this.allowDownloadTime) {
        this.addTime()
        return
      }

      // 继续等待
      await Utils.sleep(50)
    }
  }
}

const downloadInterval = new DownloadInterval()
export { downloadInterval }
