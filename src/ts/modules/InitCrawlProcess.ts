// 初始化页面，初始化抓取流程
import { EVT } from './EVT'
import { store } from './Store'
import { pageType } from './PageType'
import { log } from './Log'

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

import { InitIndexPage } from './InitIndexPage'
import { InitWorksPage } from './InitWorksPage'
import { InitUserPage } from './InitUserPage'
import { InitBookmarkPage } from './InitBookmarkPage'
import { InitSearchPage } from './InitSearchPage'
import { InitAreaRankingPage } from './InitAreaRankingPage'
import { InitRankingPage } from './InitRankingPage'
import { InitPixivisionPage } from './InitPixivisionPage'
import { InitBookmarkDetailPage } from './InitBookmarkDetailPage'
import { InitBookmarkNewIllustPage } from './InitBookmarkNewIllustPage'
import { InitDiscoverPage } from './InitDiscoverPage'
import { InitNewIllustPage } from './InitNewIllustPage'
import { CrawlBookmarkPage } from './CrawlBookmarkPage'

class InitCrawlProcess {
  constructor() {
    this.init = this.getInit()
    this.init.init()

    // 页面类型变化时，初始化抓取流程
    window.addEventListener(EVT.events.pageTypeChange, () => {
      this.reInit()

      // 切换不同页面时，如果任务已经完成，则清空输出区域，避免日志一直堆积。
      if (store.states.allowWork) {
        log.clear()
      }
    })
  }

  private init:
    | InitIndexPage
    | InitWorksPage
    | InitUserPage
    | InitBookmarkPage
    | InitSearchPage
    | InitAreaRankingPage
    | InitRankingPage
    | InitPixivisionPage
    | InitBookmarkDetailPage
    | InitBookmarkNewIllustPage
    | InitDiscoverPage
    | InitNewIllustPage

  private getInit() {
    switch (pageType.getPageType()) {
      case 0:
        return new InitIndexPage(new CrawlIndexPage())
      case 1:
        return new InitWorksPage(new CrawlWorksPage())
      case 2:
        return new InitUserPage(new CrawlUserPage())
      case 4:
        return new InitBookmarkPage(new CrawlBookmarkPage())
      case 5:
        return new InitSearchPage(new CrawlSearchPage())
      case 6:
        return new InitAreaRankingPage(new CrawlAreaRankingPage())
      case 7:
        return new InitRankingPage(new CrawlRankingPage())
      case 8:
        return new InitPixivisionPage(new CrawlPixivisionPage())
      case 9:
        return new InitBookmarkDetailPage(new CrawlBookmarkDetailPage())
      case 10:
        return new InitBookmarkNewIllustPage(new CrawlBookmarkNewIllustPage())
      case 11:
        return new InitDiscoverPage(new CrawlDiscoverPage())
      case 12:
        return new InitNewIllustPage(new CrawlNewIllustPage())

      default:
        throw new Error('InitCrawlProcess error: Illegal parameter.')
    }
  }

  private reInit() {
    this.init.destroy()
    this.init = this.getInit()
    this.init.init()
  }
}

new InitCrawlProcess()
export {}
