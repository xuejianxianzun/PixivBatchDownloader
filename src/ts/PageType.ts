import { EVT } from './EVT'
import { setTimeoutWorker } from './SetTimeoutWorker'
import { secretSignal } from './utils/SecretSignal'

// 所有页面类型及对应的数字编号
// 可以通过 pageType.list 使用
// 不能删除已有的页面类型，也不能调整顺序，只能在最后新增
// 否则就会导致数字编号对应的页面类型和之前不一样，产生问题
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
  Unlisted,
  DiscoverUsers,
}

// 获取页面类型
class PageType {
  constructor() {
    this.type = this.getType()
    document.body.dataset.pageType = this.type.toString()

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.checkTypeChange()
    })

    secretSignal.register('ppdtask3', () => {
      this.openAllTestPage()
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
      ['/', '/en/', '/illustration', '/manga', '/novel'].includes(pathname)
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
      (url.includes('/bookmark_add.php?id=') ||
        url.includes('/bookmark_detail.php?illust_id=')) &&
      !pathname.includes('/novel')
    ) {
      return PageName.BookmarkDetail
    } else if (
      url.includes('/bookmark_new_illust.php') ||
      url.includes('/bookmark_new_illust_r18.php') ||
      url.includes('/mypixiv_new_illust.php')
    ) {
      return PageName.NewArtworkBookmark
    } else if (
      pathname === '/discovery' ||
      pathname.startsWith('/novel/discovery')
    ) {
      return PageName.Discover
    } else if (pathname === '/discovery/users') {
      return PageName.DiscoverUsers
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
    } else if (
      pathname.startsWith('/novel/bookmark_new') ||
      pathname.startsWith('/novel/mypixiv_new.php')
    ) {
      return PageName.NewNovelBookmark
    } else if (pathname.startsWith('/novel/new')) {
      return PageName.NewNovel
    } else if (pathname.startsWith('/user/') && pathname.includes('/series/')) {
      return PageName.ArtworkSeries
    } else if (pathname.startsWith('/request')) {
      return PageName.Request
    } else if (pathname.includes('/unlisted')) {
      return PageName.Unlisted
    } else {
      // 没有匹配到可用的页面类型
      return PageName.Unsupported
    }
  }

  // 页面切换时，检查页面类型是否变化
  private checkTypeChange() {
    const old = this.type
    this.type = this.getType()
    document.body.dataset.pageType = this.type.toString()

    if (this.type !== old) {
      EVT.fire('pageSwitchedTypeChange', this.type)
    } else {
      EVT.fire('pageSwitchedTypeNotChange', this.type)
    }
  }

  private async openAllTestPage() {
    // 列出要打开的测试页面。不包含已经不存在的页面类型和 Pixivision
    const testPageList: { type: number; url: string }[] = [
      {
        type: PageName.Unsupported,
        url: 'https://www.pixiv.net/stacc?mode=unify',
      },
      {
        type: PageName.Home,
        url: 'https://www.pixiv.net',
      },
      {
        type: PageName.Artwork,
        url: 'https://www.pixiv.net/artworks/108271116',
      },
      {
        type: PageName.UserHome,
        url: 'https://www.pixiv.net/users/89469319',
      },
      {
        type: PageName.Bookmark,
        url: 'https://www.pixiv.net/users/96661459/bookmarks/artworks',
      },
      {
        type: PageName.ArtworkSearch,
        url: 'https://www.pixiv.net/tags/%E5%8E%9F%E7%A5%9E/artworks?s_mode=s_tag',
      },
      {
        type: PageName.AreaRanking,
        url: 'https://www.pixiv.net/ranking_area.php?type=state&no=0',
      },
      {
        type: PageName.ArtworkRanking,
        url: 'https://www.pixiv.net/ranking.php',
      },
      {
        type: PageName.NewArtworkBookmark,
        url: 'https://www.pixiv.net/bookmark_new_illust.php',
      },
      {
        type: PageName.Discover,
        url: 'https://www.pixiv.net/discovery',
      },
      {
        type: PageName.NewArtwork,
        url: 'https://www.pixiv.net/new_illust.php',
      },
      {
        type: PageName.ArtworkSeries,
        url: 'https://www.pixiv.net/user/3698796/series/61267',
      },
      {
        type: PageName.Following,
        url: 'https://www.pixiv.net/users/96661459/following',
      },
      {
        type: PageName.Request,
        url: 'https://www.pixiv.net/request',
      },
      {
        type: PageName.Unlisted,
        url: 'https://www.pixiv.net/artworks/unlisted/eE3fTYaROT9IsZmep386',
      },
      {
        type: PageName.Novel,
        url: 'https://www.pixiv.net/novel/show.php?id=12771688',
      },
      {
        type: PageName.NovelSeries,
        url: 'https://www.pixiv.net/novel/series/1090654',
      },
      {
        type: PageName.NovelSearch,
        url: 'https://www.pixiv.net/tags/%E7%99%BE%E5%90%88/novels',
      },
      {
        type: PageName.NovelRanking,
        url: 'https://www.pixiv.net/novel/ranking.php?mode=daily',
      },
      {
        type: PageName.NewNovelBookmark,
        url: 'https://www.pixiv.net/novel/bookmark_new.php',
      },
      {
        type: PageName.NewNovel,
        url: 'https://www.pixiv.net/novel/new.php',
      },
      {
        type: PageName.DiscoverUsers,
        url: 'https://www.pixiv.net/discovery/users',
      },
    ]

    const wait = (): Promise<void> => {
      return new Promise((resolve) => {
        setTimeoutWorker.set(() => {
          resolve()
        }, 500)
      })
    }

    for (const item of testPageList) {
      window.open(item.url)
      await wait()
    }
  }
}

const pageType = new PageType()

export { pageType }
