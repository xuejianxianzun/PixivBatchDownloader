// 在搜索页面抓取 tag 列表，抓取完一个 tag 就立即开始下载。下载完毕后再抓取下一个 tag
// 这是个单例类，为了控制其执行时机，需要手动执行 init 方法来进行一部分初始化
import { Tools } from '../Tools'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { msgBox } from '../MsgBox'
import { states } from '../store/States'
import { toast } from '../Toast'
import { EVT } from '../EVT'
import { pageType } from '../PageType'

class CrawlTagList {
  constructor() {}

  public init() {
    this.addCrawlBtns()
    this.addElement()
    this.bindEvents()
    this.restoreData()
  }

  private bindEventFlag = false

  private EnablPage = [pageType.list.ArtworkSearch, pageType.list.NovelSearch]

  private _tagList: string[] = []

  private get tagList() {
    return this._tagList
  }
  private set tagList(val: string[]) {
    this._tagList = val
    this.storeData()
    this.showTagList()
    this.toggleWrap(true)
  }

  private storeName = 'crawlTagList'

  private wrap!: HTMLDivElement
  private readonly wrapId = 'crawlTagListInputWrap'
  private input!: HTMLTextAreaElement
  private startCrawlBtn!: HTMLButtonElement
  private clearCrawlBtn!: HTMLButtonElement
  private showTagListWrap!: HTMLUListElement

  private addCrawlBtns() {
    Tools.addBtn('crawlBtns', Colors.bgBlue, '_抓取标签列表').addEventListener(
      'click',
      () => {
        EVT.fire('closeCenterPanel')
        this.toggleWrap(true)
        // 跳转到页面顶部，否则用户可能看不到输入区域
        window.scrollTo(0, 0)
      }
    )
  }

  private addElement() {
    const htmlText = `<textarea
      id="crawlTagListTextArea"
      data-xzplaceholder="_抓取标签列表的输入框提示"
    ></textarea>
    <p id="crawlTagListTip" data-xztext="_抓取标签列表的文件夹提示"></p>
    <div id="crawlTagListBtnsWrap">
      <button id="crawlTagListBtn" data-xztext="_抓取标签列表"></button>
      <button id="clearTagListBtn" data-xztext="_停止抓取标签列表"></button>
    </div>
    <div id="tagListWrap">
      <p data-xztext="_等待下载的标签"></p>
      <ul id="showTagList">
      <ul>
    </div>
  `

    // 创建输入标签列表的区域。如果页面上已存在该区域，则移除它，重新创建
    const test = document.getElementById(this.wrapId)
    if (test !== null) {
      test.remove()
    }

    const wrap = document.createElement('div')
    wrap.id = this.wrapId
    wrap.innerHTML = htmlText
    this.wrap = Tools.insertToHead(wrap)
    lang.register(this.wrap)

    this.input = this.wrap.querySelector(
      '#crawlTagListTextArea'
    )! as HTMLTextAreaElement
    this.startCrawlBtn = this.wrap.querySelector(
      '#crawlTagListBtn'
    )! as HTMLButtonElement
    this.clearCrawlBtn = this.wrap.querySelector(
      '#clearTagListBtn'
    )! as HTMLButtonElement
    this.showTagListWrap = this.wrap.querySelector(
      '#showTagList'
    )! as HTMLUListElement

    this.startCrawlBtn.addEventListener('click', () => {
      this.checkInput()
    })

    this.clearCrawlBtn.addEventListener('click', () => {
      this.clear()
    })
  }

  private bindEvents() {
    // 防止事件重复绑定
    if (this.bindEventFlag) {
      return
    }
    this.bindEventFlag = true

    window.addEventListener(EVT.list.downloadComplete, this.onDownloadComplete)
    window.addEventListener(EVT.list.crawlEmpty, this.onDownloadComplete)
    // 当页面类型变化时，如果进入到了不支持的页面类型，则隐藏输入区域
    window.addEventListener(EVT.list.pageSwitch, () => {
      if (
        !this.EnablPage.includes(pageType.type) &&
        this._tagList.length === 0
      ) {
        this.toggleWrap(false)
      }
    })
  }

  private onDownloadComplete = () => {
    window.setTimeout(() => {
      if (states.crawlTagList) {
        this._tagList.shift()
        this.tagList = this._tagList

        if (this._tagList.length === 0) {
          states.crawlTagList = false
          // 输出提示
          this.showTagListWrap.innerHTML = `<span style="color:${
            Colors.textSuccess
          }">${lang.transl('_下载完毕')}</span>`
          return
        }

        // 继续抓取下一个标签
        this.readyCrawl()
      }
    }, 0)
  }

  private checkInput() {
    if (states.busy) {
      return toast.error(lang.transl('_当前任务尚未完成'))
    }

    const value = this.input.value.trim()
    if (value === '') {
      return msgBox.error(lang.transl('_没有数据可供使用'))
    }

    const array = value.split('\n').filter((val) => val !== '' && val !== ' ')
    if (array.length === 0) {
      return msgBox.error(lang.transl('_没有数据可供使用'))
    }

    this.tagList = array
    this.readyCrawl()
  }

  private readyCrawl() {
    if (states.busy) {
      return toast.error(lang.transl('_当前任务尚未完成'))
    }

    if (!this.EnablPage.includes(pageType.type)) {
      return msgBox.error(
        lang.transl('_抓取标签列表') +
          '<br>' +
          lang.transl('_只能在搜索页面使用')
      )
    }

    states.crawlTagList = true
    const tag = this._tagList[0]
    // 修改 title，便于使用 P_title 建立文件夹
    document.title = tag
    // 修改 url，使用当前抓取的标签替换原本 url 里的标签，便于使用 p_tag  建立文件夹
    const urlTag = Tools.getTagFromURL()
    const newURL = location.href.replace(
      encodeURIComponent(urlTag),
      encodeURIComponent(tag)
    )
    history.pushState({ p_tag: tag }, tag, newURL)
    // 触发抓取事件
    EVT.fire('crawlTag', tag)
  }

  // 控制 wrap 的显示，如果不传入参数，则自行切换显示/隐藏状态
  private toggleWrap(flag?: boolean) {
    if (flag !== undefined) {
      this.wrap.style.display = flag ? 'block' : 'none'
    } else {
      const now = this.wrap.style.display
      this.wrap.style.display = now === 'block' ? 'none' : 'block'
    }
  }

  private showTagList() {
    const text = this.tagList.map((val) => `<li>${val}</li>`)
    this.showTagListWrap.innerHTML = text.join('')
  }

  private clear() {
    if (this.tagList.length === 0) {
      return
    }
    const confirm = window.confirm(lang.transl('_你确定要停止抓取吗'))
    if (confirm) {
      this.tagList = []
      // states.busy 有可能是因为下载器正在抓取作品，通过刷新页面可以取消抓取。
      if (states.busy) {
        location.reload()
      }
    }
  }

  // 每当 tagList 状态变化时，保存 tagList 到本地存储
  private storeData() {
    if (this.tagList.length === 0) {
      return localStorage.removeItem(this.storeName)
    }
    localStorage.setItem(this.storeName, JSON.stringify(this.tagList))
  }

  // 启动时从本地存储里读取 tagList 数据
  private restoreData() {
    const str = localStorage.getItem(this.storeName)
    if (!str) {
      return
    }
    const data = JSON.parse(str)
    if (str.length === 0) {
      return
    }
    this.tagList = data

    // 在输入框里显示需要抓取的标签列表
    this.input.value = this.tagList.map((val) => val).join('\n')

    // 不会自动开始抓取未完成的标签。这是基于以下考虑：
    // 1. 如果之前有未完成的下载，那么下载器会自动恢复下载。如果此时自动开始抓取，会造成冲突
    // 2. 如果自动开始抓取，那么用户每打开一个新的搜索页面，下载器都会自动开始抓取，影响用户正常使用
  }
}

const crawlTagList = new CrawlTagList()
export { crawlTagList }
