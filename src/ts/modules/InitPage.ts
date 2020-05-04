// 初始化页面，初始化抓取流程
import { EVT } from './EVT'
import { pageType } from './PageType'

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
import { InitNovelPage } from './InitNovelPage'
import { InitNovelSeriesPage } from './InitNovelSeriesPage'
import { InitNovelSearchPage } from './InitNovelSearchPage'
import { InitNovelRankingPage } from './InitNovelRankingPage'
import { InitNovelBookmarkNewPage } from './InitNovelBookmarkNewPage'
import { InitNewNovelPage } from './InitNewNovelPage'

class InitPage {
  constructor() {
    this.initPage()

    // 页面类型变化时，初始化抓取流程
    window.addEventListener(EVT.events.pageTypeChange, () => {
      EVT.fire(EVT.events.destroy)
      this.initPage()
    })
  }

  private initPage() {
    switch (pageType.getPageType()) {
      case 0:
        return new InitIndexPage()
      case 1:
        return new InitWorksPage()
      case 2:
        return new InitUserPage()
      case 4:
        return new InitBookmarkPage()
      case 5:
        return new InitSearchPage()
      case 6:
        return new InitAreaRankingPage()
      case 7:
        return new InitRankingPage()
      case 8:
        return new InitPixivisionPage()
      case 9:
        return new InitBookmarkDetailPage()
      case 10:
        return new InitBookmarkNewIllustPage()
      case 11:
        return new InitDiscoverPage()
      case 12:
        return new InitNewIllustPage()
      case 13:
        return new InitNovelPage()
      case 14:
        return new InitNovelSeriesPage()
      case 15:
        return new InitNovelSearchPage()
      case 16:
        return new InitNovelRankingPage()
      case 17:
        return new InitNovelBookmarkNewPage()
      case 18:
        return new InitNewNovelPage()
      default:
        throw new Error('InitCrawlProcess error: Illegal pageType.')
    }
  }
}

new InitPage()
export {}
