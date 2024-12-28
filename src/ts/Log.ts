import { EVT } from './EVT'
import { theme } from './Theme'
import { Colors } from './Colors'
import { bg } from './BG'
import { lang } from './Lang'
import { store } from './store/Store'
import { toast } from './Toast'
import { Tools } from './Tools'
import { Utils } from './utils/Utils'
import { settings } from './setting/Settings'
import { DateFormat } from './utils/DateFormat'
import { Config } from './Config'

// 日志
class Log {
  constructor() {
    this.scrollToBottom()

    window.addEventListener(EVT.list.clearLog, () => {
      this.remove()
    })

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

  private wrap = document.createElement('div') // 日志容器的区域，当日志条数很多时，会产生多个日志容器
  private activeLogWrapID = 'logWrap'
  private logWrapClassName = 'logWrap'
  private logContent = document.createElement('div') // 日志主体区域，这个指针始终指向最新的那个日志容器内部
  /**会刷新的日志所使用的元素，可以传入 flag 来设置多条用于刷新日志的元素 */
  private refresh: { [key: string]: HTMLElement } = {
    default: document.createElement('span'),
  }
  /**不同日志等级的字体颜色 */
  private readonly levelColor = [
    'inherit',
    Colors.textSuccess,
    Colors.textWarning,
    Colors.textError,
  ]

  /**每个日志区域允许显示多少条日志 */
  private max = 300
  /**日志条数。刷新的日志不会计入 */
  private count = 0

  /** 保存日志历史。刷新的日志不会保存 */
  private record: { html: string; level: number }[] = []

  private toBottom = false // 指示是否需要把日志滚动到底部。当有日志被添加或刷新，则为 true。滚动到底部之后复位到 false，避免一直滚动到底部。

  // 添加日志
  /*
  str 日志文本
  level 日志等级
  br 换行标签的个数
  keepShow 是否为持久日志。默认为 true，把这一条日志添加后不再修改。false 则会刷新显示这条日志。

  level 日志等级：
  0 normal
  1 success
  2 warning
  3 error
  */
  private add(
    str: string,
    level: number,
    br: number,
    keepShow: boolean,
    refreshFlag: string = 'default'
  ) {
    this.checkElement()
    let span = document.createElement('span')
    if (!keepShow) {
      if (this.refresh[refreshFlag] === undefined) {
        this.refresh[refreshFlag] = span
      } else {
        span = this.refresh[refreshFlag]
      }
    } else {
      this.count++

      // 如果页面上的日志条数超过指定数量，则生成一个新的日志区域
      // 因为日志数量太多的话会占用很大的内存。同时显示 8000 条日志可能占用接近 1 GB 的内存
      if (this.count >= this.max) {
        // 移除 id 属性，下次输出日志时查找不到日志区域，就会新建一个
        this.wrap.removeAttribute('id')
        this.count = 0
      }
    }

    span.innerHTML = str

    span.style.color = this.levelColor[level]

    while (br > 0) {
      span.appendChild(document.createElement('br'))
      br--
    }

    this.logContent.appendChild(span)
    this.toBottom = true // 需要把日志滚动到底部

    // 把持久日志保存到记录里
    if (keepShow) {
      this.record.push({ html: span.outerHTML, level })
    }
  }

  public log(
    str: string,
    br: number = 1,
    keepShow: boolean = true,
    refreshFlag = 'default'
  ) {
    this.add(str, 0, br, keepShow, refreshFlag)
  }

  public success(
    str: string,
    br: number = 1,
    keepShow: boolean = true,
    refreshFlag = 'default'
  ) {
    this.add(str, 1, br, keepShow, refreshFlag)
  }

  public warning(
    str: string,
    br: number = 1,
    keepShow: boolean = true,
    refreshFlag = 'default'
  ) {
    this.add(str, 2, br, keepShow, refreshFlag)
  }

  public error(
    str: string,
    br: number = 1,
    keepShow: boolean = true,
    refreshFlag = 'default'
  ) {
    this.add(str, 3, br, keepShow, refreshFlag)
  }

  /**将刷新的日志元素持久化 */
  // 刷新区域通常用于显示进度，例如 0/10, 1/10, 2/10... 10/10
  // 它们使用同一个 span 元素，并且同时只能存在一个刷新区域
  // 当显示 10/10 的时候，进度就不会再变化了，此时应该将其“持久化”。生成一个新的 span 元素作为新的刷新区域
  // 这样如果后续又需要显示刷新的元素，不会影响之前已完成“持久化”的日志
  public persistentRefresh(refreshFlag: string = 'default') {
    this.refresh[refreshFlag] = document.createElement('span')
  }

  private checkElement() {
    // 如果日志区域没有被添加到页面上，则添加
    let test = document.getElementById(this.activeLogWrapID)
    if (test === null) {
      this.wrap = document.createElement('div')
      this.wrap.id = this.activeLogWrapID
      this.wrap.classList.add(this.logWrapClassName)
      this.logContent = document.createElement('div')
      this.logContent.classList.add('beautify_scrollbar', 'logContent')
      if (Config.mobile) {
        this.wrap.classList.add('mobile')
      }
      this.wrap.append(this.logContent)
      document.body.insertAdjacentElement('beforebegin', this.wrap)
      theme.register(this.wrap)
      // 虽然可以应用背景图片，但是由于日志区域比较狭长，背景图片的视觉效果不佳，看起来比较粗糙，所以还是不应用背景图片了
      // bg.useBG(this.wrap, 0.9)
    }
  }

  /**移除所有日志区域 */
  public remove() {
    this.count = 0
    const allLogWrap = document.querySelectorAll(`.${this.logWrapClassName}`)
    allLogWrap.forEach((wrap) => wrap.remove())
  }

  // 因为日志区域限制了最大高度，可能会出现滚动条，这里使日志总是滚动到底部
  private scrollToBottom() {
    window.setInterval(() => {
      if (this.toBottom) {
        this.logContent.scrollTop = this.logContent.scrollHeight
        this.toBottom = false
      }
    }, 500)
  }

  private export() {
    const data: string[] = []

    for (const record of this.record) {
      let html = ''
      if (record.level !== 3 && settings.exportLogNormal) {
        html = record.html
      }
      if (record.level === 3 && settings.exportLogError) {
        html = record.html
      }

      // 检查排除的关键字
      if (html && settings.exportLogExclude.length > 0) {
        let checkStr = html
        // 如果含有作品链接，则只检查链接后面的部分。这是为了避免因作品 id 中包含要排除的关键字而导致错误的排除
        if (html.includes('<a href')) {
          const array = html.split('</a>')
          checkStr = array[array.length - 1]
        }
        const index = settings.exportLogExclude.findIndex((val) => {
          return checkStr.includes(val)
        })
        if (index === -1) {
          data.push(html)
        }
      }
    }

    if (data.length === 0) {
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
${data.join('\n')}
</div>
</body>
</html>`

    const blob = new Blob([content], {
      type: 'text/html',
    })

    const url = URL.createObjectURL(blob)

    Utils.downloadFile(url, fileName)

    const msg = lang.transl('_导出日志成功')
    log.success(msg)
    toast.success(msg, {
      position: 'topCenter',
    })
  }
}

const log = new Log()
export { log }
