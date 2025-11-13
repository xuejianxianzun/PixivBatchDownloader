import { EVT } from '../EVT'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { DonwloadSkipData } from './DownloadType'
import { log } from '../Log'
import { Utils } from '../utils/Utils'
import { Colors } from '../Colors'

/**在日志里显示因为“不下载重复文件”而跳过下载的文件的列表 */
// 以前是每跳过一个文件就显示一条日志，但这样经常会占据太多日志版面
// 所以现在改成集中到一条日志里显示
class ShowDuplicateLog {
  constructor() {
    this.bindEvents()
  }

  private records: string[] = []

  private delayReset = false

  private output = Utils.debounce(this.showLog.bind(this), 500)

  private bindEvents() {
    window.addEventListener(EVT.list.skipDownload, (ev: CustomEventInit) => {
      const skipData = ev.detail.data as DonwloadSkipData
      if (skipData.reason === 'duplicate') {
        const link = Tools.createWorkLink(skipData.id, '', skipData.type !== 3)
        this.records.push(link)
        this.output()
      }
    })

    const resetEvents = [
      EVT.list.crawlComplete,
      EVT.list.downloadStop,
      EVT.list.downloadComplete,
    ]
    resetEvents.forEach((ev) => {
      window.addEventListener(ev, () => {
        // 下载完成后，延迟清除保存的记录
        // 这是因为输出日志时使用了防抖，有些数据会在下一次输出时才会显示，所以不能立即清除记录
        if (ev === 'downloadComplete') {
          this.delayReset = true
        } else {
          // 在抓取完成和下载停止时，立即清除保存的记录
          // 因为此时之前的记录已经完全没用了
          this.records = []
        }
      })
    })
  }

  private showLog() {
    if (this.records.length === 0 || document.hidden) {
      return
    }

    const msg =
      `<span style="color:${Colors.textWarning}">${lang.transl(
        '_因为不下载重复文件跳过了x个文件',
        this.records.length.toString()
      )} : </span><br>` + this.records.join(', ')
    log.log(msg, 1, false, 'showDuplicateLog')

    if (this.delayReset) {
      this.records = []
      this.delayReset = false
    }
  }
}

new ShowDuplicateLog()
