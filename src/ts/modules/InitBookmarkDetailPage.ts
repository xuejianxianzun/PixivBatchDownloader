// 初始化 bookmark_detail 页面
import { InitPageBase } from './InitPageBase'
import { CrawlBookmarkDetailPage } from './CrawlBookmarkDetailPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'

class InitBookmarkDetailPage extends InitPageBase {
  constructor(crawler: CrawlBookmarkDetailPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlBookmarkDetailPage

  protected appendCenterBtns() {
    ui.addCenterButton(Colors.blue, lang.transl('_抓取相似图片'), [
      ['title', lang.transl('_抓取相似图片')]
    ]).addEventListener(
      'click',
      () => {
        this.crawler.readyCrawl()
      },
      false
    )
  }

  protected setFormOptin() {
    // 设置抓取的作品数量
    // 实际上的数字可以更大，这里只是预设一个限制。
    this.crawler.maxCount = 500
    this.setWantPageTip1.textContent = lang.transl('_个数')
    this.setWantPageTip1.dataset.tip = lang.transl('_要获取的作品个数2')
    this.setWantPageTip2.textContent = `1 - ${this.crawler.maxCount}`
    this.setWantPage.value = this.crawler.maxCount.toString()

    this.hideNotNeedOption([14])
  }
}
export { InitBookmarkDetailPage }
