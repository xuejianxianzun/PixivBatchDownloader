import { EVT } from './EVT'
import { lang } from './Language'
import { toast } from './Toast'
import { Tools } from './Tools'
import { Utils } from './utils/Utils'
import { settings } from './setting/Settings'

export interface RecordItem {
  html: string
  level: number
  key: string
}

class ExportLog {
  constructor() {
    const clearRecordEvents = [EVT.list.clearLog]
    clearRecordEvents.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.record = []
      })
    })

    // 虽然导出日志的时机设置可以选择“抓取完毕”或者“下载完毕”其中之一，但有些任务可能不会触发对应的事件，或者与用户的预期不符。所以在必要时，可以触发此事件来导出日志，它不会判断导出时机的设置。
    // 目前这个事件是为了处理合并系列小说的任务。合并系列小说有时只会触发抓取完毕的事件，有时甚至不会触发这个事件。有些用户以为合并完成就算是下载完毕，所以选择了“下载完毕”的时机，结果没有导出日志。所以我针对性处理一下。
    window.addEventListener(EVT.list.exportLogsTiming, () => {
      if (settings.exportLog) {
        this.export()
      }
    })

    window.addEventListener(EVT.list.forceExportLogs, () => {
      this.export(true)
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

  /** 清除所有记录（用户清空日志区域时调用） */
  public clear() {
    this.record = []
  }

  /** 所有日志的纯文本。一条日志占一行，日志内部的 <br> 也是一个换行
   *
   * 复制日志时使用它。和导出日志不同，这里不做日志等级的筛选，也不检查排除的关键字：
   * 用户要复制的是他看到的这些日志。
   */
  public getText() {
    const lines: string[] = []
    for (const record of this.record) {
      // 每条日志的 html 末尾都有一个 <br>（Log.add 添加的），它只表示「这条日志结束」，
      // 换成换行之后会变成多余的空白行，所以去掉
      lines.push(ExportLog.htmlToText(record.html).replace(/\n$/, ''))
    }
    return lines.join('\n')
  }

  /** 把一条日志的 HTML 还原成纯文本：去掉标签，<br> 换成换行
   *
   * 这里只需要还原 &amp;：日志写入时只转义了裸的 &（见 Log.add），
   * 其他实体是日志文本里本来就有的，原样保留即可。
   */
  private static htmlToText(html: string) {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
  }

  /**导出日志。手动导出时忽略自动导出的筛选设置 */
  private export(force = false) {
    const logs: string[] = []
    console.log(this.record)
    for (const record of this.record) {
      let html = ''
      if (force || (record.level !== 3 && settings.exportLogNormal)) {
        html = record.html
      }
      if (force || (record.level === 3 && settings.exportLogError)) {
        html = record.html
      }

      // 检查排除的关键字
      if (html) {
        let shouldExport = true
        if (
          !force &&
          settings.exportLog &&
          settings.exportLogExclude.length > 0
        ) {
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
    )}-${Tools.formatDateTimeInFilename()}.html`

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
