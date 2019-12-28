// 针对不同页面类型，进行初始化
import { CrawlIndexPage } from './CrawlIndexPage'
import { CrawlDiscoverPage } from './CrawlDiscoverPage'
import { CrawlWorksPage } from './CrawlWorksPage'
import { CrawlUserPage } from './CrawlUserPage'
import { CrawlSearchPage } from './CrawlSearchPage'
import { CrawlAreaRankingPage } from './CrawlAreaRankingPage'
import { CrawlRankingPage } from './CrawlRankingPage'
import { CrawlPixivisionPage } from './CrawlPixivisionPage'
import { CrawlBookmarkDetailPage } from './CrawlBookmarkDetailPage'
import { CrawlBookmarkNewIllustPage } from './CrawlBookmarkNewIllustPage'
import { CrawlNewIllustPage } from './CrawlNewIllustPage'
import { lang } from './Lang'
import { ui } from './UI'

abstract class InitPageBase {
  constructor(
    crawler:
      | CrawlIndexPage
      | CrawlDiscoverPage
      | CrawlWorksPage
      | CrawlUserPage
      | CrawlSearchPage
      | CrawlAreaRankingPage
      | CrawlRankingPage
      | CrawlPixivisionPage
      | CrawlBookmarkDetailPage
      | CrawlBookmarkNewIllustPage
      | CrawlNewIllustPage
  ) {}

  protected abstract crawler:
    | CrawlIndexPage
    | CrawlDiscoverPage
    | CrawlWorksPage
    | CrawlUserPage
    | CrawlSearchPage
    | CrawlAreaRankingPage
    | CrawlRankingPage
    | CrawlPixivisionPage
    | CrawlBookmarkDetailPage
    | CrawlBookmarkNewIllustPage
    | CrawlNewIllustPage

  // 初始化
  public init() {
    this.appendCenterBtns()
    this.setFormOptin()
    this.appendElseEl()
  }

  protected abstract destroySelf(): void

  public destroy(): void {
    this.destroySelf()

    ui.clearCenterButton()

    this.crawler.destroy()
  }

  // 添加中间按钮
  protected appendCenterBtns() {}

  // 添加其他元素（如果有）
  protected appendElseEl(): void {}

  // 显示或隐藏指定的选项
  private toggleOption(no: number[], display: string) {
    for (const num of no) {
      const el = ui.form.querySelector(
        '.formOption' + num.toString()
      )! as HTMLParagraphElement
      el.style.display = display
    }
  }

  // 隐藏一些选项。参数是数组，传递设置项的编号。
  public hideNotNeedOption(no: number[]) {
    this.toggleOption(no, 'none')
  }

  // 显示一些选项。因为页面无刷新加载，所以一些选项被隐藏后，可能需要再次显示
  public showOption(no: number[]) {
    this.toggleOption(no, 'block')
  }

  // 设置表单里的选项。主要是设置页数，隐藏不需要的选项。
  protected setFormOptin(): void {
    // 设置页数
    this.setWantPageTip1.textContent = lang.transl('_页数')
    this.setWantPageTip1.dataset.tip = lang.transl('_checkWantPageRule1Arg8')
    this.setWantPageTip2.textContent = lang.transl('_数字提示1')
    this.setWantPage.value = '1'
  }

  protected setWantPageWrap = ui.form.querySelector('.formOption1')!
  protected setWantPage = this.setWantPageWrap.querySelector(
    '.setWantPage'
  )! as HTMLInputElement
  protected setWantPageTip1 = this.setWantPageWrap.querySelector(
    '.setWantPageTip1'
  )! as HTMLSpanElement
  protected setWantPageTip2 = this.setWantPageWrap.querySelector(
    '.setWantPageTip2'
  )! as HTMLSpanElement
}

export { InitPageBase }
