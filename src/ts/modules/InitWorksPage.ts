//初始化作品页
import { InitPageBase } from './InitPageBase'
import { CrawlWorksPage } from './CrawlWorksPage'
import { Colors } from './Colors'
import { EVT } from './EVT'
import { lang } from './Lang'
import { ui } from './UI'
import { store } from './Store'
import { QuickBookmark } from './QuickBookmark'
import { imgViewer } from './ImgViewer'

class InitWorksPage extends InitPageBase {
  constructor(crawler: CrawlWorksPage) {
    super(crawler)
    this.crawler = crawler

    // 初始化快速收藏功能和图片查看器
    new QuickBookmark()
    imgViewer.init()

    // 页面切换时初始化图片查看器
    window.addEventListener(EVT.events.pageSwitch, () => {
      imgViewer.init()
    })
  }

  protected crawler: CrawlWorksPage

  protected appendCenterBtns() {
    ui.addCenterButton(
      Colors.blue,
      lang.transl('_从本页开始抓取new')
    ).addEventListener('click', () => {
      this.crawler.crawlDirection = -1
      this.crawler.readyCrawl()
    })

    ui.addCenterButton(
      Colors.blue,
      lang.transl('_从本页开始抓取old')
    ).addEventListener('click', () => {
      this.crawler.crawlDirection = 1
      this.crawler.readyCrawl()
    })

    const downRelatedBtn = ui.addCenterButton(
      Colors.blue,
      lang.transl('_抓取相关作品')
    )
    downRelatedBtn.addEventListener(
      'click',
      () => {
        this.crawler.crawlRelated = true
        this.crawler.readyCrawl()
      },
      false
    )
  }

  protected appendElseEl() {
    // 在右侧创建快速下载按钮
    const quickDownBtn = document.createElement('div')
    quickDownBtn.id = 'quick_down_btn'
    quickDownBtn.textContent = '↓'
    quickDownBtn.setAttribute('title', lang.transl('_快速下载本页'))
    document.body.appendChild(quickDownBtn)
    quickDownBtn.addEventListener(
      'click',
      () => {
        store.states.quickDownload = true
        this.crawler.readyCrawl()
      },
      false
    )
  }

  protected setFormOptin() {
    // 设置抓取的作品数量
    this.setWantPageTip1.textContent = lang.transl('_个数')
    this.setWantPageTip1.dataset.tip =
      lang.transl('_checkWantPageRule1Arg8') +
      '<br>' +
      lang.transl('_相关作品大于0')
    this.setWantPageTip2.textContent = lang.transl('_数字提示1')
    this.setWantPage.value = '-1'

    this.showOption([1, 14])
  }
}
export { InitWorksPage }
