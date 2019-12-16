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
import { InitSearchPage } from './InitSearchPage'
import { InitAreaRankingPage } from './InitAreaRankingPage'
import { InitRankingPage } from './InitRankingPage'
import { InitPixivisionPage } from './InitPixivisionPage'
import { InitBookmarkDetailPage } from './InitBookmarkDetailPage'
import { InitBookmarkNewIllustPage } from './InitBookmarkNewIllustPage'
import { InitDiscoverPage } from './InitDiscoverPage'
import { InitNewIllustPage } from './InitNewIllustPage'

class InitCrawlProcess {
  constructor() {
    this.initPage()

    // 页面类型变化时，初始化抓取流程
    window.addEventListener(EVT.events.pageTypeChange, () => {
      this.initPage()

      // 切换不同页面时，如果任务已经完成，则清空输出区域，避免日志一直堆积。
      if (store.states.allowWork) {
        log.clear()
      }
    })
  }

  private initPage() {
    let result
    switch (pageType.getPageType()) {
      case 0:
        result = new InitIndexPage(new CrawlIndexPage())
        break
      case 1:
        result = new InitWorksPage(new CrawlWorksPage())
        break
      case 2:
        result = new InitUserPage(new CrawlUserPage())
        break
      case 5:
        result = new InitSearchPage(new CrawlSearchPage())
        break
      case 6:
        result = new InitAreaRankingPage(new CrawlAreaRankingPage())
        break
      case 7:
        result = new InitRankingPage(new CrawlRankingPage())
        break
      case 8:
        result = new InitPixivisionPage(new CrawlPixivisionPage())
        break
      case 9:
        result = new InitBookmarkDetailPage(new CrawlBookmarkDetailPage())
        break
      case 10:
        result = new InitBookmarkNewIllustPage(new CrawlBookmarkNewIllustPage())
        break
      case 11:
        result = new InitDiscoverPage(new CrawlDiscoverPage())
        break
      case 12:
        result = new InitNewIllustPage(new CrawlNewIllustPage())
        break

      default:
        throw new Error('InitCrawlProcess error: Illegal parameter.')
    }

    result.init()
  }
}

new InitCrawlProcess()
export {}
