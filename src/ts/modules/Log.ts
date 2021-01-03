import { DOM } from './DOM'
import { EVT } from './EVT'
import { theme } from './Theme'
import { Colors, colorType } from './Colors'

// 日志
class Log {
  constructor() {
    this.scrollToBottom()

    window.addEventListener(EVT.list.clearLog, () => {
      this.clear()
    })
  }

  private logArea = document.createElement('div') // 输出日志的区域
  private id = 'logWrap' // 日志区域元素的 id
  private refresh = document.createElement('span') // 刷新时使用的元素
  private readonly level: colorType[] = ['success', 'warning', 'error']

  private toBottom = false // 指示是否需要把日志滚动到底部。当有日志被添加或刷新，则为 true。滚动到底部之后复位到 false，避免一直滚动到底部。

  // 如果日志区域没有被添加到页面上，则添加上
  private checkElement() {
    let test = document.getElementById(this.id)
    if (test === null) {
      this.logArea.id = this.id
      this.logArea.classList.add('beautify_scrollbar')
      DOM.insertToHead(this.logArea)
      theme.register(this.logArea)
    }
  }

  // 清空日志
  public clear() {
    this.logArea.innerHTML = ''
  }

  // 添加日志
  /*
  str 日志文本
  level 日志等级
  br 换行标签的个数
  keepShow 追加日志的模式，默认为 true，把这一条日志添加后不再修改。false 则是刷新显示这条消息。

  level 日志等级：
  -1 auto 不设置颜色
  0 success 绿色
  1 warning 黄色
  2 error 红色
  */
  private add(str: string, level: number, br: number, keepShow: boolean) {
    this.checkElement()
    let span = document.createElement('span')
    if (!keepShow) {
      span = this.refresh
    }

    span.innerHTML = str

    if (level > -1) {
      span.style.color = Colors[this.level[level]]
    }

    while (br > 0) {
      span.appendChild(document.createElement('br'))
      br--
    }

    this.logArea.appendChild(span)

    this.toBottom = true // 需要把日志滚动到底部
  }

  public log(str: string, br: number = 1, keepShow: boolean = true) {
    this.add(str, -1, br, keepShow)
  }

  public success(str: string, br: number = 1, keepShow: boolean = true) {
    this.add(str, 0, br, keepShow)
  }

  public warning(str: string, br: number = 1, keepShow: boolean = true) {
    this.add(str, 1, br, keepShow)
  }

  public error(str: string, br: number = 1, keepShow: boolean = true) {
    this.add(str, 2, br, keepShow)
  }

  // 因为日志区域限制了最大高度，可能会出现滚动条，这里使日志总是滚动到底部
  private scrollToBottom() {
    window.setInterval(() => {
      if (this.toBottom) {
        this.logArea.scrollTop = this.logArea.scrollHeight
        this.toBottom = false
      }
    }, 800)
  }
}

const log = new Log()
export { log }
