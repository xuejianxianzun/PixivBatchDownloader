// 初始化 大家的新作品页面
import { InitPageBase } from './InitPageBase'
import { CrawlNewIllustPage } from './CrawlNewIllustPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'
import {  options} from "./Options";


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

  protected setFormOption() {
    
    // 设置“个数/页数”选项
    options.setWantPage({
      text:lang.transl('_个数'),
      tip:lang.transl('_要获取的作品个数2'),
      rangTip:`1 - ${this.crawler.maxCount}`,
      value:'100'
    })

    options.hideOption([15,18])
  }

  protected destroySelf() {}
}
export { InitNewIllustPage }
