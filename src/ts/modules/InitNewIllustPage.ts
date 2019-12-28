// 初始化 大家的新作品页面
import { InitPageBase } from './InitPageBase'
import { CrawlNewIllustPage } from './CrawlNewIllustPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'

class InitNewIllustPage extends InitPageBase {
  constructor(crawler: CrawlNewIllustPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlNewIllustPage

  protected appendCenterBtns() {
    ui.addCenterButton(Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_下载大家的新作品')]
    ]).addEventListener('click', () => {
      this.crawler.readyCrawl()
    })
  }

  private timer = 0

  protected appendElseEl() {
    // 添加 R-18 页面的链接
    const r18Link = `<a href="/new_illust_r18.php" style="color:#179fdd;padding-left:20px;">R-18</a>`
    const target = document.querySelector('#root h1')

    if (target) {
      target.insertAdjacentHTML('beforeend', r18Link)
      clearTimeout(this.timer)
    } else {
      this.timer = window.setTimeout(() => {
        this.appendElseEl()
      }, 300)
    }
  }

  protected setFormOptin() {
    // 设置抓取的作品数量
    // 最大有 10000 个。但是输入框的默认值设置的少一些比较合理。
    this.crawler.maxCount = 10000
    this.setWantPageTip1.textContent = lang.transl('_个数')
    this.setWantPageTip1.dataset.tip = lang.transl('_要获取的作品个数2')
    this.setWantPageTip2.textContent = `1 - ${this.crawler.maxCount}`
    this.setWantPage.value = '100'

    this.hideNotNeedOption([14])
  }

  protected destroySelf() {}
}
export { InitNewIllustPage }
