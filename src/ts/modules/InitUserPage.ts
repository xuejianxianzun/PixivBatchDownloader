// 初始化用户页面
import { InitPageBase } from './InitPageBase'
import { CrawlUserPage } from './CrawlUserPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { centerButtons } from './CenterButtons'
import { options } from './Options'

class InitUserPage extends InitPageBase {
  constructor(crawler: CrawlUserPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlUserPage

  protected appendCenterBtns() {
    centerButtons
      .add(Colors.blue, lang.transl('_开始抓取'), [
        ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')]
      ])
      .addEventListener('click', () => {
        this.crawler.readyCrawl()
      })
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_checkWantPageRule1Arg8'),
      rangTip: lang.transl('_数字提示1'),
      value: '-1'
    })

    options.hideOption([15, 18])
  }

  protected destroySelf() {}
}
export { InitUserPage }
