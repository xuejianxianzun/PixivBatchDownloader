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
    this.clearOldElements()
    this.appendCenterBtns()
    this.setFormOptin()
    this.appendElseEl()
  }

  // 清空之前添加的元素
  private clearOldElements(): void {
    document.getElementById('centerWrap_btns_free')!.innerHTML = ''

    // 删除右侧的快速下载按钮
    const quickDownBtn = document.getElementById('quick_down_btn')
    if (quickDownBtn) {
      quickDownBtn.remove()
    }

    // 删除快速筛选元素
    const fastScreen = document.querySelector('.fastScreenArea')
    if (fastScreen) {
      fastScreen.remove()
    }
  }

  // 添加中间按钮
  protected appendCenterBtns() {}

  // 添加其他元素（如果有）
  protected appendElseEl(): void {}

  // 在某些页面里，隐藏不需要的选项。参数是数组，传递设置项的编号。
  public hideNotNeedOption(no: number[]) {
    for (const num of no) {
      const el = ui.form.querySelector(
        '.formOption' + num.toString()
      )! as HTMLParagraphElement
      el.style.display = 'none'
    }
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
