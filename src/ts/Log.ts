import { EVT } from './EVT'
import { theme } from './Theme'
import { Colors } from './Colors'
import { bg } from './BG'
import { lang } from './Language'
import { store } from './store/Store'
import { toast } from './Toast'
import { Tools } from './Tools'
import { Utils } from './utils/Utils'
import { settings } from './setting/Settings'
import { DateFormat } from './utils/DateFormat'
import { Config } from './Config'
import { pageType } from './PageType'

// 日志
class Log {
  constructor() {
    this.createToggleBtn()

    // this.test(300)

    // 日志区域限制了最大高度，可能会出现滚动条
    // 所以使用定时器，让日志滚动到底部
    window.setInterval(() => {
      this.scrollToBottom(this.logContent)
    }, 500)

    window.addEventListener(EVT.list.clearLog, () => {
      this.removeAll()
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

  /**每个日志区域显示多少条日志 */
  // 如果日志条数超出最大值，下载器会创建多个日志区域
  private max = 200

  /**最新的日志区域里的日志条数。刷新的日志不会计入；换行标签也不会计入（虽然连续的换行会产生空行，看起来有一行空白，但这只是某一条日志内部的换行，所以不会增加日志条数） */
  private count = 0

  private logWrap = document.createElement('div') // 日志容器的区域，当日志条数很多时，会产生多个日志容器
  private activeLogWrapID = 'logWrap' // 当前活跃的日志容器的 id，也是最新的一个日志容器
  private logContent = document.createElement('div') // 日志的主体区域，始终指向最新的那个日志容器内部
  private readonly logContentClassName = 'logContent' // 日志主体区域的类名
  private readonly logWrapClassName = 'logWrap' // 日志容器的类名，只负责样式
  private readonly logWrapFlag = 'logWrapFlag' // 日志容器的标志，当需要查找日志区域时，使用这个类名而不是 logWrap，因为其他元素可能也具有 logWrap 类名（为了应用其样式）。

  /**储存会刷新的日志所使用的元素（插槽），可以传入 key 来区分多个刷新区域 */
  // 每个刷新区域使用一个 span 元素，里面的文本会变化
  // 通常用于显示进度，例如 0/10, 1/10, 2/10... 10/10
  // 如果不传入 key，那么所有的刷新内容会共用 default 插槽
  private slots: Record<string, HTMLElement> = {
    default: document.createElement('span'),
  }

  /**页面顶部的“显示日志”按钮，点击之后会显示日志区域 */
  private logBtn = document.createElement('div')

  /**显示或隐藏顶部的“显示日志”按钮 */
  // 它默认是 opacity: 0，即不可见
  private set logBtnShow(value: boolean) {
    // 在图像作品页面里，如果处于漫画页面里的阅读模式（检测特定的 a 元素），则不显示按钮。网址如：
    // https://www.pixiv.net/artworks/130919451#1
    // 这是因为即使用户之前已经把页面滚动了一部分（按钮是隐藏的），但点击“阅读全部”后，按钮就会显示出来
    // 但实际上在阅读时不应该显示按钮，所以特殊处理一下
    if (
      pageType.type === pageType.list.Artwork &&
      /#\d/.test(window.location.hash) &&
      document.querySelector('a.gtm-expand-full-size-illust')
    ) {
      this.logBtn.classList.remove('show')
      return
    }

    if (value) {
      if (this.count > 0 && window.scrollY <= 10) {
        this.logBtn.classList.add('show')
      }
    } else {
      this.logBtn.classList.remove('show')
    }
  }

  /** 保存日志历史。刷新的日志不会保存 */
  private record: { html: string; level: number }[] = []

  /** 指示是否需要把日志滚动到底部 */
  // 当有日志被添加或刷新，则为 true。滚动到底部之后复位到 false
  private toBottom = false

  /** 鼠标是否进入、停留在日志区域，如果是，则不自动滚动到底部 */
  private mouseover = false

  /**日志区域是否显示（即 display 状态）*/
  private _show = false

  private set show(value: boolean) {
    if (value) {
      // 显示所有日志区域
      this.showAll()
      this.logBtnShow = false
    } else {
      // 隐藏当前日志区域。至于以前的区域，不需要处理
      this.hideAll()
      this.logBtnShow = true
    }

    this._show = value
  }

  private get show() {
    return this._show
  }

  /**最新一个日志区域在视口里是否可见。注意这判断的不是 display 状态，而是可见性（也就是日志区域与其他元素的交叉状态）。
   * 当它符合可见条件为 true，否则为 false。
   * 注意：在 PC 端页面里需要完全可见；在移动端页面里只需要部分可见，当然完全可见也可以。
   * 这是因为在移动端页面里，下载器右侧的悬浮按钮经常会显示在日志区域上方，导致日志区域永远只有部分可见。
   */
  private isVisible = false

  /**不同日志等级的文字颜色 */
  private readonly levelColor = [
    'inherit',
    Colors.textSuccess,
    Colors.textWarning,
    Colors.textError,
  ]

  /**
  添加一条日志
  @param str 日志文本
  @param level 日志等级。0: normal, 1: success, 2: warning, 3: error
  @param key 每个 key 对应一条专用的日志插槽。重复调用这个方法并传入同样的 key，就会刷新这个日志区域里的内容，而不是新建一条日志。
  
  需要设置 key 的情况：1. 显示进度，每当进度更新时，更新对应插槽里的内容。 2. 避免一些日志因为多次输出而产生多条相同内容。使用相同的 key 的日志始终只有一条，不会输出多条日志。
  */
  private add(str: string, level: number, key: string = '') {
    this.createLogArea()
    let span = document.createElement('span')
    if (key) {
      // 为需要刷新的日志创建插槽
      if (this.slots[key] === undefined) {
        this.slots[key] = span
      } else {
        span = this.slots[key]
      }
      // 虽然刷新的日志不计入总数，但如果某个日志区域里的第一条日志就是刷新日志，就必须把 count 加 1
      // 否则会因为 count 为 0 而导致这个日志区域被判断为没有内容，从而不会显示
      if (this.count === 0) {
        this.count++
      }
    } else {
      this.count++

      // 如果页面上的日志条数达到最大值，则生成一个新的日志区域
      // 日志数量太多的话会占用很大的内存，同时显示 8000 条日志可能占用接近 1 GB 的内存
      if (this.count >= this.max) {
        // 移除 id 属性，也就是 this.activeLogWrapID
        // 下次输出日志时查找不到这个 id，就会新建一个日志区域
        this.logWrap.removeAttribute('id')
        // 滚动到底部。这是该区域里最后一条日志，之后该区域会被解除引用，所以需要立即执行一次
        this.scrollToBottom(this.logContent)
      }
    }

    span.innerHTML = str
    span.style.color = this.levelColor[level]
    span.appendChild(document.createElement('br'))

    this.logContent.appendChild(span)
    this.toBottom = true // 需要把日志滚动到底部

    // 把持久日志保存到记录里
    if (key === '') {
      this.record.push({ html: span.outerHTML, level })
    }
  }

  public log(str: string, key = '') {
    this.add(str, 0, key)
  }

  public success(str: string, key = '') {
    this.add(str, 1, key)
  }

  public warning(str: string, key = '') {
    this.add(str, 2, key)
  }

  public error(str: string, key = '') {
    this.add(str, 3, key)
  }

  /**把特定日志插槽里的日志持久化显示。当以后再次输出相同 key 的日志时，会生成一个新的 span 元素使用；旧的日志插槽不再使用，所以内容会保持不变 */
  // 常见的使用场景：当某个进度完成之后（例如显示到 10/10）就不会再变化了，此时可以将其持久化，这样下次从 0 输出进度时，会使用新的日志插槽，不会影响之前已完成了进度的日志
  // 但也不是每个进度完成后都需要调用此方法。如果日志的 key 具有唯一性（例如携带了作品 id），就没有必要调用此方法。只有当 key 不具有唯一性，或者考虑到用户可能会重复抓取同一个作品时（此时即使携带了 id，也依然会重复输出日志），才有必要调用此方法。
  public persistentRefresh(key: string) {
    this.slots[key] = document.createElement('span')
  }

  /**在页面顶部创建一个“显示日志”按钮 */
  private createToggleBtn() {
    const html = `<div id="logBtn" class="logBtn"><span data-xztext="_显示日志"></span>&nbsp;<span>(L)</span></div>`
    document.body.insertAdjacentHTML('beforebegin', html)
    this.logBtn = document.getElementById('logBtn') as HTMLDivElement
    const text = this.logBtn.firstElementChild as HTMLSpanElement
    lang.register(text)

    // 在“显示日志”按钮上触发这些事件时，显示日志区域
    const showEvents = ['click', 'mouseover', 'touchstart']
    showEvents.forEach((evt) => {
      this.logBtn.addEventListener(
        evt,
        () => {
          this.logBtnShow = false
          this.show = true
        },
        {
          passive: false,
        }
      )
    })

    // 定时检查是否应该显示“显示日志”按钮
    window.setInterval(() => {
      if (this.show === false) {
        this.logBtnShow = true
      }
    }, 100)

    /**当页面滚动一定距离后，隐藏“显示日志”按钮 */
    const hideLogBtn = Utils.debounce(() => {
      if (window.scrollY > 10) {
        this.logBtnShow = false
      }
    }, 100)
    window.addEventListener('scroll', () => {
      hideLogBtn()
    })

    // 按快捷键 L 显示/隐藏日志区域
    window.addEventListener('keydown', (ev) => {
      if (ev.code !== 'KeyL' || ev.ctrlKey || ev.altKey || ev.metaKey) {
        return
      }

      if (ev.target) {
        const target = ev.target as HTMLElement
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return
        }
      }

      ev.preventDefault()

      if (this.count === 0) {
        toast.warning(lang.transl('_没有日志'), {
          position: 'mouse',
        })
        return
      }

      // 需要显示日志的情况：
      // 日志是隐藏的，或者不完全可见，则跳转到页面顶部，并显示日志
      // 这两个判断条件其实是等价的，因为当元素为 display: none 时，
      // IntersectionObserver 的回调始终返回 isIntersecting: false
      // 不过判断 this.show 更加直接一些
      if (this.show === false || this.isVisible === false) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        this.show = true
      } else {
        // 如果日志完全可见，则隐藏日志区域
        this.show = false
      }
    })
  }

  /**创建新的日志区域 */
  private createLogArea() {
    // 先检查是否存在日志区域
    let test = document.getElementById(this.activeLogWrapID)

    // 创建日志区域
    if (test === null) {
      this.count = 0
      this.isVisible = false

      // 判断这是不是第一个日志区域
      const exist = document.querySelector('.' + this.logWrapFlag)
      const isFirst = exist === null

      const logWrap = document.createElement('div')
      logWrap.id = this.activeLogWrapID
      logWrap.classList.add(this.logWrapClassName, this.logWrapFlag)
      const logContent = document.createElement('div')
      logContent.classList.add(this.logContentClassName, 'beautify_scrollbar')
      if (Config.mobile) {
        logWrap.classList.add('mobile')
      }
      logWrap.append(logContent)
      this.logWrap = logWrap
      this.logContent = logContent

      // 点击日志区域两侧的空白处，可以隐藏日志区域
      logWrap.addEventListener('click', (ev) => {
        if (ev.target === logWrap) {
          this.show = false
        }
      })

      // 当鼠标进入日志区域时，不自动滚动到底部，这样可以保持显示区域的内容不变，便于用户查看和选择需要的日志
      this.logWrap.addEventListener('mouseenter', () => {
        this.mouseover = true
      })

      this.logWrap.addEventListener('mouseleave', () => {
        this.mouseover = false
      })
      // 当用户切换到其他标签页或其他应用程序时（不论是使用鼠标还是快捷键），浏览器都会自动触发 mouseleave 事件，所以 mouseover 会自动变成 false。

      // 添加到 body 前面
      document.body.insertAdjacentElement('beforebegin', this.logWrap)
      theme.register(this.logWrap)
      // 虽然可以应用背景图片，但是由于日志区域比较狭长，背景图片的视觉效果不佳，看起来比较粗糙，所以还是不应用背景图片了
      // bg.useBG(this.wrap, 0.9)

      // 如果这是第一个日志区域，则为其应用“日志区域的默认可见性”设置
      if (isFirst) {
        this.show = settings.logVisibleDefault === 'show'
      } else {
        // 如果这不是第一个日志区域，则让它的显示状态与上一个日志区域保持一致
        this.show = this.show
      }

      // 监听新的日志区域的可见性
      Utils.observeElement(
        this.logWrap,
        (value: boolean) => {
          this.isVisible = value
        },
        Config.mobile ? 0 : 1
      )
    }
  }

  private scrollToBottom(el: HTMLElement) {
    if (this.show && this.toBottom && !this.mouseover) {
      el.scrollTop = el.scrollHeight
      this.toBottom = false
    }
  }

  public removeAll() {
    const allLogWrap = document.querySelectorAll(`.${this.logWrapFlag}`)
    allLogWrap.forEach((wrap) => wrap.remove())

    this.count = 0
    this.show = false
    this.logBtnShow = false
    this.isVisible = false
  }

  public showAll() {
    const allLogWrap = document.querySelectorAll(
      `.${this.logWrapFlag}`
    ) as NodeListOf<HTMLDListElement>
    allLogWrap.forEach((wrap) => {
      wrap.style.display = 'block'
      // 把内容滚动到底部
      const logContent = wrap.querySelector(
        `.${this.logContentClassName}`
      ) as HTMLDivElement
      if (logContent) {
        logContent.scrollTop = logContent.scrollHeight
      }
    })
  }

  public hideAll() {
    const allLogWrap = document.querySelectorAll(`.${this.logWrapFlag}`)
    allLogWrap.forEach(
      (wrap) => ((wrap as HTMLDListElement).style.display = 'none')
    )
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

    const msg = '✅' + lang.transl('_导出日志成功')
    log.success(msg)
    toast.success(msg, {
      position: 'topCenter',
    })
  }

  /** 调试用：连续输出大量日志
   * @param total 指定输出多少条日志。默认值为 1000
   */
  private test(total = 1000) {
    window.setTimeout(async () => {
      let num = 0
      while (num < total) {
        await Utils.sleep(100)
        this.log('saber')
        num++
      }
    }, 1000)
  }
}

const log = new Log()
export { log }
