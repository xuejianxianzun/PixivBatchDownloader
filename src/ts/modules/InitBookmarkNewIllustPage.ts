// 初始化 关注的新作品页面
import { InitPageBase } from './InitPageBase'
import { CrawlBookmarkNewIllustPage } from './CrawlBookmarkNewIllustPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'

class InitBookmarkNewIllustPage extends InitPageBase {
  constructor(crawler: CrawlBookmarkNewIllustPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlBookmarkNewIllustPage

  protected appendCenterBtns() {
    ui.addCenterButton(Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')]
    ]).addEventListener('click', () => {
      this.crawler.readyCrawl()
    })
  }

  protected appendElseEl() {
    // 添加 R-18 页面的链接
    const r18Link = `<li><a href="/bookmark_new_illust_r18.php">R-18</a></li>`
    const target = document.querySelector('.menu-items')
    if (target) {
      target.insertAdjacentHTML('beforeend', r18Link)
    }
  }

  protected setFormOptin() {
    // 设置页数
    this.crawler.maxCount = 100
    this.setWantPageTip1.textContent = lang.transl('_页数')
    this.setWantPageTip1.dataset.tip = lang.transl('_checkWantPageRule1Arg8')
    this.setWantPageTip2.textContent = `1 - ${this.crawler.maxCount}`
    this.setWantPage.value = this.crawler.maxCount.toString()

    this.hideNotNeedOption([14])
  }

  protected destroySelf() {}
}
export { InitBookmarkNewIllustPage }
