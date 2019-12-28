// 初始化地区排行榜页面
import { InitPageBase } from './InitPageBase'
import { CrawlAreaRankingPage } from './CrawlAreaRankingPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'

class InitAreaRankingPage extends InitPageBase {
  constructor(crawler: CrawlAreaRankingPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlAreaRankingPage

  protected appendCenterBtns() {
    ui.addCenterButton(Colors.blue, lang.transl('_抓取本页作品'), [
      ['title', lang.transl('_抓取本页作品Title')]
    ]).addEventListener('click', () => {
      this.crawler.readyCrawl()
    })
  }

  protected setFormOptin() {
    this.hideNotNeedOption([1, 14])
  }

  protected destroySelf() {}
}
export { InitAreaRankingPage }
