//初始化作品页
import { InitPageBase } from './InitPageBase'
import { CrawlWorksPage } from './CrawlWorksPage'
import { Colors } from './Colors'
import { EVT } from './EVT'
import { lang } from './Lang'
import { centerPanel} from './CenterPanel'
import { options } from './Options'
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
    centerPanel.addButton(
      Colors.blue,
      lang.transl('_从本页开始抓取new')
    ).addEventListener('click', () => {
      this.crawler.crawlDirection = -1
      this.crawler.readyCrawl()
    })

    centerPanel.addButton(
      Colors.blue,
      lang.transl('_从本页开始抓取old')
    ).addEventListener('click', () => {
      this.crawler.crawlDirection = 1
      this.crawler.readyCrawl()
    })

    const downRelatedBtn = centerPanel.addButton(
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

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_个数'),
      tip:
        lang.transl('_checkWantPageRule1Arg8') +
        '<br>' +
        lang.transl('_相关作品大于0'),
      rangTip: lang.transl('_数字提示1'),
      value: '-1'
    })

    options.hideOption([18])
  }

  protected destroySelf() {
    // 删除快速下载按钮
    const quickDownBtn = document.getElementById('quick_down_btn')
    if (quickDownBtn) {
      quickDownBtn.remove()
    }
  }
}
export { InitWorksPage }
