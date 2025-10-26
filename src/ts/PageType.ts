import { EVT } from './EVT'
import { setTimeoutWorker } from './SetTimeoutWorker'
import { secretSignal } from './utils/SecretSignal'

// 所有页面类型及对应的数字编号
// 可以通过 pageType.list 使用
// 不能删除已有的页面类型，也不能调整顺序，只能在最后新增
// 否则就会导致数字编号对应的页面类型和之前不一样，产生问题
enum PageName {
  /** 不支持的页面 */
  Unsupported = -1,
  /** 主页 */
  Home,
  /** 插画详情页面 */
  Artwork,
  /** 用户主页 */
  UserHome,
  // BookmarkLegacy 页面类型已经不存在了，但是必须保留它以避免兼容性问题
  // 因为有些设置是使用页面类型的数字编号作为键名的
  // 如果删除这个页面类型，会导致它后面所有页面类型的数字发生变化（例如 Bookmark 会从 4 变成 3）
  // 这会导致从设置项里取值时，会取到错误的值
  /** 旧版收藏页面，现已被 Bookmark 页面取代 */
  BookmarkLegacy,
  /** 收藏页面 */
  Bookmark,
  /** 插画搜索页面 */
  ArtworkSearch,
  /** 地区排行榜 */
  AreaRanking,
  /** 插画排行榜 */
  ArtworkRanking,
  Pixivision,
  /** 收藏后的详情页面，现在基本不会用到 */
  BookmarkDetail,
  /** 已关注用户的心作品 - 插画 */
  NewArtworkBookmark,
  /** 发现页面 */
  Discover,
  /** 大家的新作 - 插画 */
  NewArtwork,
  /** 小说详情页面 */
  Novel,
  /** 小说系列作品目录页 */
  NovelSeries,
  /** 小说搜索页面 */
  NovelSearch,
  /** 小说排行榜 */
  NovelRanking,
  /** 已关注用户的心作品 - 小说 */
  NewNovelBookmark,
  /** 大家的新作 - 小说 */
  NewNovel,
  /** 插画系列作品目录页 */
  ArtworkSeries,
  /** 关注的用户 */
  Following,
  /** 约稿 */
  Request,
  /** 不公开的作品 */
  Unlisted,
  /** 发现页面 - 推荐用户 */
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
        url: 'https://www.pixiv.net/artworks/62751951',
      },
      {
        type: PageName.UserHome,
        url: 'https://www.pixiv.net/users/89469319',
      },
      {
        type: PageName.BookmarkLegacy,
        url: 'https://www.pixiv.net/users/96661459/bookmarks/artworks',
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
        type: PageName.Pixivision,
        url: 'https://www.pixivision.net/zh/a/4537',
      },
      {
        type: PageName.BookmarkDetail,
        url: 'https://www.pixiv.net/bookmark_detail.php?illust_id=63148723',
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

export { pageType, PageName }
