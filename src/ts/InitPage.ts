// 根据页面类型来初始化抓取流程和一些特定的功能
import { EVT } from './EVT'
import { pageType } from './PageType'

import { InitHomePage } from './crawlMixedPage/InitHomePage'
import { InitArtworkPage } from './crawlArtworkPage/InitArtworkPage'
import { InitUserPage } from './crawlMixedPage/InitUserPage'
import { InitBookmarkLegacyPage } from './crawlMixedPage/InitBookmarkLegacyPage'
import { InitBookmarkPage } from './crawlMixedPage/InitBookmarkPage'
import { InitSearchArtworkPage } from './crawlArtworkPage/InitSearchArtworkPage'
import { InitAreaRankingPage } from './crawlArtworkPage/InitAreaRankingPage'
import { InitRankingArtworkPage } from './crawlArtworkPage/InitRankingArtworkPage'
import { InitPixivisionPage } from './crawlArtworkPage/InitPixivisionPage'
import { InitBookmarkDetailPage } from './crawlArtworkPage/InitBookmarkDetailPage'
import { InitBookmarkNewPage } from './crawlMixedPage/InitBookmarkNewPage'
import { InitDiscoverPage } from './crawlArtworkPage/InitDiscoverPage'
import { InitNewArtworkPage } from './crawlArtworkPage/InitNewArtworkPage'
import { InitNovelPage } from './crawlNovelPage/InitNovelPage'
import { InitNovelSeriesPage } from './crawlNovelPage/InitNovelSeriesPage'
import { InitSearchNovelPage } from './crawlNovelPage/InitSearchNovelPage'
import { InitRankingNovelPage } from './crawlNovelPage/InitRankingNovelPage'
import { InitNewNovelPage } from './crawlNovelPage/InitNewNovelPage'
import { InitArtworkSeriesPage } from './crawlArtworkPage/InitArtworkSeriesPage'
import { InitFollowingPage } from './crawlMixedPage/InitFollowingPage'
import { InitUnsupportedPage } from './crawl/InitUnsupportedPage'

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
      case pageType.list.ArtworkSearch:
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
        return new InitBookmarkNewPage()
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
        return new InitBookmarkNewPage()
      case pageType.list.NewNovel:
        return new InitNewNovelPage()
      case pageType.list.ArtworkSeries:
        return new InitArtworkSeriesPage()
      case pageType.list.Following:
        return new InitFollowingPage()
      default:
        return new InitUnsupportedPage()
    }
  }
}

new InitPage()
