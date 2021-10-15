// 在搜索页面抓取 tag 列表，抓取完一个 tag 就开始下载，下载完毕后抓取下一个 tag
import { Tools } from "../Tools";
import { Colors } from "../config/Colors";
import { lang } from "../Lang";
import { msgBox } from "../MsgBox";
import { states } from "../store/States";
import { toast } from "../Toast";

interface TagListData {
  tag: string,
  /**-1 未抓取完毕
   * 0 抓取完毕但未下载完毕
   * 1 下载完毕
   */
  status: -1 | 0 | 1
}

class CrawlTagList {
  constructor() {
    this.addCrawlBtns()
    this.addElement()
    this.restoreData()
  }

  private tagList: TagListData[] = []
  private storeName = 'crawlTagList'

  private wrap!: HTMLDivElement
  private input!: HTMLTextAreaElement
  private startCrawlBtn!: HTMLButtonElement
  private clearCrawlBtn!: HTMLButtonElement

  private addCrawlBtns() {
    Tools.addBtn('crawlBtns', Colors.bgGreen, '抓取标签列表').addEventListener('click', () => {
      this.toggleWrap(true)
    })

  }

  private addElement() {
    const htmlText = `<textarea
      id="crawlTagListTextArea"
      placeholder="请输入要抓取的标签列表。多个标签之间使用换行分割"
    ></textarea>
    <button id="crawlTagListBtn">抓取标签列表</button>
    <button id="clearTagListBtn">停止抓取标签列表</button>
  `
    const wrap = document.createElement('div')
    wrap.id = 'crawlTagListInputWrap'
    wrap.innerHTML = htmlText
    this.wrap = Tools.insertToHead(wrap)
    this.input = this.wrap.querySelector('#crawlTagListTextArea')
    this.startCrawlBtn = this.wrap.querySelector('#crawlTagListBtn')
    this.startCrawlBtn.addEventListener('click', () => {
      this.checkInput()
    })

    this.clearCrawlBtn = this.wrap.querySelector('#clearTagListBtn')
    this.clearCrawlBtn.addEventListener('click', () => {
      this.clear()
    })
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

  private clear() {
    const confirm = window.confirm('你确定要停止抓取标签列表吗？')
    if (confirm) {
      this.tagList = []
      this.storeData()
    }
  }

  private checkInput() {
    if (states.busy) {
      return toast.error(lang.transl('_当前任务尚未完成'))
    }

    const value = this.input.value.trim()
    if (value === '') {
      return msgBox.error(lang.transl('_没有数据可供使用'))
    }

    const array = value.split('\n').filter(val => val !== '' && val !== ' ')
    if (array.length === 0) {
      return msgBox.error(lang.transl('_没有数据可供使用'))
    }

    this.tagList = array.map(val => {
      return {
        tag: val,
        status: -1
      }
    })
    this.storeData()
    this.readyCrawl()
  }

  private readyCrawl() {
    if (states.busy) {
      return toast.error(lang.transl('_当前任务尚未完成'))
    }

    states.crawlTagList = true
    
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
    this.tagList = JSON.parse(str)
    if (this.tagList.length > 0) {
      this.toggleWrap(true)
    }
  }
}
export { CrawlTagList }