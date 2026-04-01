import { EVT } from './EVT'
import { lang } from './Language'
import { store } from './store/Store'
import { toast } from './Toast'
import { Tools } from './Tools'
import { Utils } from './utils/Utils'
import { settings } from './setting/Settings'
import { DateFormat } from './utils/DateFormat'

export interface RecordItem {
  html: string
  level: number
  key: string
}

class ExportLog {
  constructor() {
    const clearRecordEvents = [EVT.list.clearLog, EVT.list.downloadStop]
    clearRecordEvents.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.record = []
      })
    })

    window.addEventListener(EVT.list.crawlComplete, () => {
      if (settings.exportLog && settings.exportLogTiming === 'crawlComplete') {
        this.export()
      }
    })

    window.addEventListener(EVT.list.downloadComplete, () => {
      if (
        settings.exportLog &&
        settings.exportLogTiming === 'downloadComplete'
      ) {
        this.export()
      }
    })
  }

  private record: RecordItem[] = []

  public push(data: RecordItem) {
    if (!settings.exportLog) {
      return
    }

    // 对于持久的日志，直接添加到记录里
    if (data.key === '') {
      this.record.push(data)
    } else {
      // 对于刷新的日志，如果已经存在相同 key 的记录，则更新它，因为一个 key 只对应一条日志插槽
      const index = this.record.findIndex((item) => item.key === data.key)
      if (index === -1) {
        this.record.push(data)
      } else {
        this.record[index] = data
      }
    }
  }

  /** 当持久化一条日志时，在记录里找到对应的条目，将其 key 清空。这样之后可以再次添加相同 key 的日志 */
  public unsetKey(key: string) {
    const index = this.record.findIndex((item) => item.key === key)
    if (index !== -1) {
      this.record[index].key = ''
    }
  }

  private export() {
    const logs: string[] = []

    for (const record of this.record) {
      let html = ''
      if (record.level !== 3 && settings.exportLogNormal) {
        html = record.html
      }
      if (record.level === 3 && settings.exportLogError) {
        html = record.html
      }

      // 检查排除的关键字
      if (html) {
        let shouldExport = true
        if (settings.exportLogExclude.length > 0) {
          let checkStr = html
          // 如果含有作品链接，则只检查链接后面的部分。这是为了避免因作品 id 中包含要排除的关键字而导致错误的排除
          if (html.includes('<a href')) {
            const array = html.split('</a>')
            checkStr = array[array.length - 1]
          }
          const index = settings.exportLogExclude.findIndex((val) => {
            return checkStr.includes(val)
          })
          shouldExport = index === -1
        }
        if (shouldExport) {
          logs.push(html)
        }
      }
    }

    if (logs.length === 0) {
      return
    }

    const fileName = `log-${Utils.replaceUnsafeStr(
      Tools.getPageTitle()
    )}-${Utils.replaceUnsafeStr(
      DateFormat.format(store.crawlCompleteTime, settings.dateFormat)
    )}.html`

    const content = `<!DOCTYPE html>
        <html>
        <body>
        <div id="logWrap">
        ${logs.join('\n')}
        </div>
        </body>
        </html>`

    const blob = new Blob([content], {
      type: 'text/html',
    })
    const url = URL.createObjectURL(blob)
    Utils.downloadFile(url, fileName)

    toast.success(lang.transl('_导出日志成功'), {
      position: 'center',
    })
  }
}

const exportLog = new ExportLog()
export { exportLog }
