// 初始化地区排行榜页面
import { InitPageBase } from './InitPageBase'
import { CrawlAreaRankingPage } from './CrawlAreaRankingPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'
import { options } from './Options'

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

  protected setFormOption() {
    options.hideOption([1,15,18])
  }

  protected destroySelf() {}
}
export { InitAreaRankingPage }
