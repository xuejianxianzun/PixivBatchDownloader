// 初始化排行榜页面
import { InitPageBase } from './InitPageBase'
import { CrawlRankingPage } from './CrawlRankingPage'
import { Colors } from './Colors'
import { API } from './API'
import { lang } from './Lang'
import { ui } from './UI'

class InitRankingPage extends InitPageBase {
  constructor(crawler: CrawlRankingPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlRankingPage

  protected appendCenterBtns() {
    ui.addCenterButton(Colors.blue, lang.transl('_抓取本排行榜作品'), [
      ['title', lang.transl('_抓取本排行榜作品Title')]
    ]).addEventListener('click', () => {
      this.crawler.readyCrawl()
    })

    // 判断当前页面是否有“首次登场”标记
    let debutModes = ['daily', 'daily_r18', 'rookie', '']
    let mode = API.getURLField(location.href, 'mode')

    if (debutModes.includes(mode)) {
      ui.addCenterButton(Colors.blue, lang.transl('_抓取首次登场的作品'), [
        ['title', lang.transl('_抓取首次登场的作品Title')]
      ]).addEventListener('click', () => {
        ui.form.debut.value = '1'
        this.crawler.readyCrawl()
      })
    }
  }

  protected setFormOptin() {
    // 设置抓取的作品数量
    this.crawler.maxCount = 500
    this.setWantPageTip1.textContent = lang.transl('_个数')
    this.setWantPageTip1.dataset.tip = lang.transl('_要获取的作品个数2')
    this.setWantPageTip2.textContent = `1 - ${this.crawler.maxCount}`
    this.setWantPage.value = this.crawler.maxCount.toString()
  }
}
export { InitRankingPage }
