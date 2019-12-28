// 初始化首页
import { InitPageBase } from './InitPageBase'
import { CrawlIndexPage } from './CrawlIndexPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'
import { DOM } from './DOM'

class InitIndexPage extends InitPageBase {
  constructor(crawler: CrawlIndexPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlIndexPage

  private downIdButton = document.createElement('button')
  private downIdInput = document.createElement('textarea')
  private ready = false

  protected appendCenterBtns() {
    this.downIdButton = ui.addCenterButton(
      Colors.blue,
      lang.transl('_输入id进行抓取'),
      [['id', 'down_id_button']]
    )
    this.downIdButton.addEventListener(
      'click',
      () => {
        if (!this.ready) {
          // 还没准备好
          ui.hideCenterPanel()
          this.downIdInput.style.display = 'block'
          this.downIdInput.focus()
          document.documentElement.scrollTop = 0
        } else {
          this.crawler.readyCrawl()
        }
      },
      false
    )
  }

  protected appendElseEl() {
    // 用于输入id的输入框
    this.downIdInput = document.createElement('textarea')
    this.downIdInput.id = 'down_id_input'
    this.downIdInput.style.display = 'none'
    this.downIdInput.setAttribute(
      'placeholder',
      lang.transl('_输入id进行抓取的提示文字')
    )
    DOM.insertToHead(this.downIdInput)
    this.downIdInput.addEventListener('change', () => {
      // 当输入框内容改变时检测，非空值时显示下载区域
      if (this.downIdInput.value !== '') {
        this.ready = true
        ui.showCenterPanel()
        this.downIdButton.textContent = lang.transl('_开始抓取')
      } else {
        this.ready = false
        ui.hideCenterPanel()
        this.downIdButton.textContent = lang.transl('_输入id进行抓取')
      }
    })
  }

  protected setFormOptin() {
    this.hideNotNeedOption([1, 14])
  }

  protected destroySelf() {}
}

export { InitIndexPage }
