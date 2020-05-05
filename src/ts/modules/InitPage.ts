// 初始化页面，初始化抓取流程
import { EVT } from './EVT'
import { pageType } from './PageType'

import { InitIndexPage } from './InitIndexPage'
import { InitArtworkPage } from './InitArtworkPage'
import { InitUserPage } from './InitUserPage'
import { InitBookmarkArtworkPage } from './InitBookmarkArtworkPage'
import { InitSearchArtworkPage } from './InitSearchArtworkPage'
import { InitAreaRankingPage } from './InitAreaRankingPage'
import { InitRankingArtworkPage } from './InitRankingArtworkPage'
import { InitPixivisionPage } from './InitPixivisionPage'
import { InitBookmarkDetailPage } from './InitBookmarkDetailPage'
import { InitBookmarkNewArtworkPage } from './InitBookmarkNewArtworkPage'
import { InitDiscoverPage } from './InitDiscoverPage'
import { InitNewArtworkPage } from './InitNewArtworkPage'
import { InitNovelPage } from './InitNovelPage'
import { InitNovelSeriesPage } from './InitNovelSeriesPage'
import { InitSearchNovelPage } from './InitSearchNovelPage'
import { InitRankingNovelPage } from './InitRankingNovelPage'
import { InitBookmarkNewNovelPage } from './InitBookmarkNewNovelPage'
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
        return new InitArtworkPage()
      case 2:
        return new InitUserPage()
      case 4:
        return new InitBookmarkArtworkPage()
      case 5:
        return new InitSearchArtworkPage()
      case 6:
        return new InitAreaRankingPage()
      case 7:
        return new InitRankingArtworkPage()
      case 8:
        return new InitPixivisionPage()
      case 9:
        return new InitBookmarkDetailPage()
      case 10:
        return new InitBookmarkNewArtworkPage()
      case 11:
        return new InitDiscoverPage()
      case 12:
        return new InitNewArtworkPage()
      case 13:
        return new InitNovelPage()
      case 14:
        return new InitNovelSeriesPage()
      case 15:
        return new InitSearchNovelPage()
      case 16:
        return new InitRankingNovelPage()
      case 17:
        return new InitBookmarkNewNovelPage()
      case 18:
        return new InitNewNovelPage()
      default:
        throw new Error('InitCrawlProcess error: Illegal pageType.')
    }
  }
}

new InitPage()
export {}
