// 初始化 bookmark_detail 页面
import { InitPageBase } from './InitPageBase'
import { CrawlBookmarkDetailPage } from './CrawlBookmarkDetailPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { centerPanel} from './CenterPanel'
import {  options} from "./Options";

class InitBookmarkDetailPage extends InitPageBase {
  constructor(crawler: CrawlBookmarkDetailPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlBookmarkDetailPage

  protected appendCenterBtns() {
    centerPanel.addButton(Colors.blue, lang.transl('_抓取相似图片'), [
      ['title', lang.transl('_抓取相似图片')]
    ]).addEventListener(
      'click',
      () => {
        this.crawler.readyCrawl()
      },
      false
    )
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text:lang.transl('_个数'),
      tip:lang.transl('_要获取的作品个数2'),
      rangTip:`1 - ${this.crawler.maxCount}`,
      value:this.crawler.maxCount.toString()
    })

    options.hideOption([15,18])
  }

  protected destroySelf() {}
}
export { InitBookmarkDetailPage }
