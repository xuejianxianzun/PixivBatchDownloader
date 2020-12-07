import { EVT } from './EVT'

// 获取页面类型
class PageType {
  constructor() {
    this.type = this.getType()

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.checkTypeChange()
    })
  }

  public type = 0 // 如果 type 为 -1，说明处于不支持的页面

  private getType() {
    const url = window.location.href
    const pathname = window.location.pathname

    let type: number

    if (
      window.location.hostname === 'www.pixiv.net' &&
      ['/', '/manga', '/novel/', '/en/'].includes(pathname)
    ) {
      type = 0
    } else if (/\/artworks\/\d{1,10}/.test(url)) {
      type = 1
    } else if (/\/users\/\d+/.test(url) && !url.includes('/bookmarks')) {
      type = 2
      if (pathname.includes('/following')) {
        type = 20
      }
    } else if (pathname.endsWith('bookmark.php')) {
      type = 3
    } else if (pathname.includes('/bookmarks/')) {
      type = 4
    } else if (url.includes('/tags/')) {
      type = pathname.endsWith('/novels') ? 15 : 5
    } else if (pathname === '/ranking_area.php' && location.search !== '') {
      type = 6
    } else if (pathname === '/ranking.php') {
      type = 7
    } else if (
      url.includes('https://www.pixivision.net') &&
      url.includes('/a/')
    ) {
      type = 8
    } else if (
      url.includes('/bookmark_add.php?id=') ||
      url.includes('/bookmark_detail.php?illust_id=')
    ) {
      type = 9
    } else if (
      url.includes('/bookmark_new_illust.php') ||
      url.includes('/bookmark_new_illust_r18.php')
    ) {
      type = 10
    } else if (pathname === '/discovery') {
      type = 11
    } else if (
      url.includes('/new_illust.php') ||
      url.includes('/new_illust_r18.php')
    ) {
      type = 12
    } else if (pathname === '/novel/show.php') {
      type = 13
    } else if (pathname.startsWith('/novel/series/')) {
      type = 14
    } else if (pathname === '/novel/ranking.php') {
      type = 16
    } else if (pathname.startsWith('/novel/bookmark_new')) {
      type = 17
    } else if (pathname.startsWith('/novel/new')) {
      type = 18
    } else if (pathname.startsWith('/user/') && pathname.includes('/series/')) {
      type = 19
    } else {
      // 没有匹配到可用的页面类型
      // throw new Error('Unsupported page type')
      type = -1
    }

    return type
  }

  // 页面切换时，检查页面类型是否变化
  private checkTypeChange() {
    const old = this.type
    this.type = this.getType()
    if (this.type !== old) {
      EVT.fire(EVT.list.pageSwitchedTypeChange, this.type)
    } else {
      EVT.fire(EVT.list.pageSwitchedTypeNotChange, this.type)
    }
  }
}

const pageType = new PageType()
export { pageType }
