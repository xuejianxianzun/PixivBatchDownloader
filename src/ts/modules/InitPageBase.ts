// 针对不同页面类型，进行初始化
import { CrawlIndexPage } from './CrawlIndexPage'
import { CrawlDiscoverPage } from './CrawlDiscoverPage'
import { CrawlWorksPage } from './CrawlWorksPage'
import { CrawlUserPage } from './CrawlUserPage'
import { CrawlBookmarkPage } from './CrawlBookmarkPage'
import { CrawlSearchPage } from './CrawlSearchPage'
import { CrawlAreaRankingPage } from './CrawlAreaRankingPage'
import { CrawlRankingPage } from './CrawlRankingPage'
import { CrawlPixivisionPage } from './CrawlPixivisionPage'
import { CrawlBookmarkDetailPage } from './CrawlBookmarkDetailPage'
import { CrawlBookmarkNewIllustPage } from './CrawlBookmarkNewIllustPage'
import { CrawlNewIllustPage } from './CrawlNewIllustPage'
import { lang } from './Lang'
import { centerButtons } from './CenterButtons'
import { options } from './Options'

type allCrawlPage =
  | CrawlIndexPage
  | CrawlDiscoverPage
  | CrawlWorksPage
  | CrawlUserPage
  | CrawlBookmarkPage
  | CrawlSearchPage
  | CrawlAreaRankingPage
  | CrawlRankingPage
  | CrawlPixivisionPage
  | CrawlBookmarkDetailPage
  | CrawlBookmarkNewIllustPage
  | CrawlNewIllustPage

abstract class InitPageBase {
  constructor(crawler: allCrawlPage) {
  }

  protected abstract crawler: allCrawlPage

  // 初始化
  public init() {
    options.showAllOption()
    this.setFormOption()
    this.appendCenterBtns()
    this.appendElseEl()
  }

  protected abstract destroySelf(): void
  
  // 销毁初始化页面时添加的元素和事件等
  public destroy(): void {
    this.destroySelf()

    centerButtons.clear()

    this.crawler.destroy()
  }

  // 添加中间按钮
  protected appendCenterBtns() {}

  // 添加其他元素（如果有）
  protected appendElseEl(): void {}

  // 设置表单里的选项。主要是设置页数，隐藏不需要的选项。
  protected setFormOption(): void {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_checkWantPageRule1Arg8'),
      rangTip: lang.transl('_数字提示1'),
      value: '1'
    })

    options.hideOption([15, 18])
  }
}

export { InitPageBase }
