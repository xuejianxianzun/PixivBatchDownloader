import { EVT } from './EVT'

// 所有页面类型及对应的数字编号
// 可以通过 pageType.list 使用
enum PageName {
  Unsupported = -1,
  Home,
  Artwork,
  UserHome,
  BookmarkLegacy,
  Bookmark,
  ArtworkSearch,
  AreaRanking,
  ArtworkRanking,
  Pixivision,
  BookmarkDetail,
  NewArtworkBookmark,
  Discover,
  NewArtwork,
  Novel,
  NovelSeries,
  NovelSearch,
  NovelRanking,
  NewNovelBookmark,
  NewNovel,
  ArtworkSeries,
  Following,
  Request,
}

// 获取页面类型
class PageType {
  constructor() {
    this.type = this.getType()

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.checkTypeChange()
    })
  }

  // 当前页面类型
  public type = PageName.Unsupported

  // 所有页面类型
  public readonly list = PageName

  private getType(): PageName {
    const url = window.location.href
    const pathname = window.location.pathname

    if (
      window.location.hostname === 'www.pixiv.net' &&
      ['/', '/manga', '/novel/', '/en/'].includes(pathname)
    ) {
      return PageName.Home
    } else if (
      (pathname.startsWith('/artworks') ||
        pathname.startsWith('/en/artworks')) &&
      /\/artworks\/\d{1,10}/.test(url)
    ) {
      return PageName.Artwork
    } else if (/\/users\/\d+/.test(url) && !url.includes('/bookmarks')) {
      if (
        pathname.includes('/following') ||
        pathname.includes('/mypixiv') ||
        pathname.includes('/followers')
      ) {
        return PageName.Following
      } else {
        return PageName.UserHome
      }
    } else if (pathname.endsWith('bookmark.php')) {
      return PageName.BookmarkLegacy
    } else if (pathname.includes('/bookmarks/')) {
      return PageName.Bookmark
    } else if (url.includes('/tags/')) {
      return pathname.endsWith('/novels')
        ? PageName.NovelSearch
        : PageName.ArtworkSearch
    } else if (pathname === '/ranking_area.php' && location.search !== '') {
      return PageName.AreaRanking
    } else if (pathname === '/ranking.php') {
      return PageName.ArtworkRanking
    } else if (
      url.includes('https://www.pixivision.net') &&
      url.includes('/a/')
    ) {
      return PageName.Pixivision
    } else if (
      url.includes('/bookmark_add.php?id=') ||
      url.includes('/bookmark_detail.php?illust_id=')
    ) {
      return PageName.BookmarkDetail
    } else if (
      url.includes('/bookmark_new_illust.php') ||
      url.includes('/bookmark_new_illust_r18.php')
    ) {
      return PageName.NewArtworkBookmark
    } else if (
      pathname === '/discovery' ||
      pathname.startsWith('/novel/discovery')
    ) {
      return PageName.Discover
    } else if (
      url.includes('/new_illust.php') ||
      url.includes('/new_illust_r18.php')
    ) {
      return PageName.NewArtwork
    } else if (pathname === '/novel/show.php') {
      return PageName.Novel
    } else if (pathname.startsWith('/novel/series/')) {
      return PageName.NovelSeries
    } else if (pathname === '/novel/ranking.php') {
      return PageName.NovelRanking
    } else if (pathname.startsWith('/novel/bookmark_new')) {
      return PageName.NewNovelBookmark
    } else if (pathname.startsWith('/novel/new')) {
      return PageName.NewNovel
    } else if (pathname.startsWith('/user/') && pathname.includes('/series/')) {
      return PageName.ArtworkSeries
    } else if (pathname.startsWith('/request')) {
      return PageName.Request
    } else {
      // 没有匹配到可用的页面类型
      return PageName.Unsupported
    }
  }

  // 页面切换时，检查页面类型是否变化
  private checkTypeChange() {
    const old = this.type
    this.type = this.getType()
    if (this.type !== old) {
      EVT.fire('pageSwitchedTypeChange', this.type)
    } else {
      EVT.fire('pageSwitchedTypeNotChange', this.type)
    }
  }
}

const pageType = new PageType()

export { pageType }
