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
      case pageType.list.Home:
        return new InitHomePage()
      case pageType.list.Artwork:
        return new InitArtworkPage()
      case pageType.list.UserHome:
        return new InitUserPage()
      case pageType.list.BookmarkLegacy:
        return new InitBookmarkLegacyPage()
      case pageType.list.Bookmark:
        return new InitBookmarkPage()
      case pageType.list.ArtworkSerach:
        return new InitSearchArtworkPage()
      case pageType.list.AreaRanking:
        return new InitAreaRankingPage()
      case pageType.list.ArtworkRanking:
        return new InitRankingArtworkPage()
      case pageType.list.Pixivision:
        return new InitPixivisionPage()
      case pageType.list.BookmarkDetail:
        return new InitBookmarkDetailPage()
      case pageType.list.NewArtworkBookmark:
        return new InitBookmarkNewArtworkPage()
      case pageType.list.Discover:
        return new InitDiscoverPage()
      case pageType.list.NewArtwork:
        return new InitNewArtworkPage()
      case pageType.list.Novel:
        return new InitNovelPage()
      case pageType.list.NovelSeries:
        return new InitNovelSeriesPage()
      case pageType.list.NovelSearch:
        return new InitSearchNovelPage()
      case pageType.list.NovelRanking:
        return new InitRankingNovelPage()
      case pageType.list.NewNovelBookmark:
        return new InitBookmarkNewNovelPage()
      case pageType.list.NewNovel:
        return new InitNewNovelPage()
      case pageType.list.ArtworkSeries:
        return new InitSeriesPage()
      case pageType.list.Following:
        return new InitFollowingPage()
      default:
        return
    }
  }
}

new InitPage()
