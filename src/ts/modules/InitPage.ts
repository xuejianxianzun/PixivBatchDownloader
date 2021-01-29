// 根据不同的页面，初始化下载器的功能
import { EVT } from './EVT'
import { pageType } from './PageType'

import { InitHomePage } from './InitHomePage'
import { InitArtworkPage } from './artwork/InitArtworkPage'
import { InitUserPage } from './InitUserPage'
import { InitBookmarkLegacyPage } from './InitBookmarkLegacyPage'
import { InitBookmarkPage } from './InitBookmarkPage'
import { InitSearchArtworkPage } from './artwork/InitSearchArtworkPage'
import { InitAreaRankingPage } from './artwork/InitAreaRankingPage'
import { InitRankingArtworkPage } from './artwork/InitRankingArtworkPage'
import { InitPixivisionPage } from './InitPixivisionPage'
import { InitBookmarkDetailPage } from './artwork/InitBookmarkDetailPage'
import { InitBookmarkNewArtworkPage } from './artwork/InitBookmarkNewArtworkPage'
import { InitDiscoverPage } from './artwork/InitDiscoverPage'
import { InitNewArtworkPage } from './artwork/InitNewArtworkPage'
import { InitNovelPage } from './novel/InitNovelPage'
import { InitNovelSeriesPage } from './novel/InitNovelSeriesPage'
import { InitSearchNovelPage } from './novel/InitSearchNovelPage'
import { InitRankingNovelPage } from './novel/InitRankingNovelPage'
import { InitBookmarkNewNovelPage } from './novel/InitBookmarkNewNovelPage'
import { InitNewNovelPage } from './novel/InitNewNovelPage'
import { InitSeriesPage } from './artwork/InitSeriesPage'
import { InitFollowingPage } from './InitFollowingPage'

class InitPage {
  constructor() {
    this.initPage()

    // 页面类型变化时，初始化抓取流程
    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      setTimeout(() => {
        this.initPage()
      }, 0)
    })
  }

  private initPage() {
    switch (pageType.type) {
      case -1:
        return
      case 0:
        return new InitHomePage()
      case 1:
        return new InitArtworkPage()
      case 2:
        return new InitUserPage()
      case 3:
        return new InitBookmarkLegacyPage()
      case 4:
        return new InitBookmarkPage()
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
      case 19:
        return new InitSeriesPage()
      case 20:
        return new InitFollowingPage()
      default:
        throw new Error('InitPage error: Illegal pageType.')
    }
  }
}

new InitPage()
export {}
