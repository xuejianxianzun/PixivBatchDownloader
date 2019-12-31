// 初始化排行榜页面
import { InitPageBase } from './InitPageBase'
import { CrawlRankingPage } from './CrawlRankingPage'
import { Colors } from './Colors'
import { API } from './API'
import { lang } from './Lang'
import { centerButtons } from './CenterButtons'
import { options } from './Options'
import { form } from './Settings'

class InitRankingPage extends InitPageBase {
  constructor(crawler: CrawlRankingPage) {
    super(crawler)
    this.crawler = crawler
    this.crawler.maxCount = 500
  }
  protected crawler: CrawlRankingPage

  protected appendCenterBtns() {
    centerButtons
      .add(Colors.blue, lang.transl('_抓取本排行榜作品'), [
        ['title', lang.transl('_抓取本排行榜作品Title')]
      ])
      .addEventListener('click', () => {
        form.debut.value = '0'
        this.crawler.readyCrawl()
      })

    // 判断当前页面是否有“首次登场”标记
    let debutModes = ['daily', 'daily_r18', 'rookie', '']
    let mode = API.getURLField(location.href, 'mode')

    if (debutModes.includes(mode)) {
      centerButtons
        .add(Colors.blue, lang.transl('_抓取首次登场的作品'), [
          ['title', lang.transl('_抓取首次登场的作品Title')]
        ])
        .addEventListener('click', () => {
          form.debut.value = '1'
          this.crawler.readyCrawl()
        })
    }
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_个数'),
      tip: lang.transl('_要获取的作品个数2'),
      rangTip: `1 - ${this.crawler.maxCount}`,
      value: this.crawler.maxCount.toString()
    })

    options.hideOption([15, 18])
  }

  protected destroySelf() {}
}
export { InitRankingPage }
