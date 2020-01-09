// 获取页面类型
import { EVT } from './EVT'

class PageType {
  constructor() {
    this.type = this.getPageType()

    // 页面切换时检查新旧页面是否不同
    window.addEventListener(EVT.events.pageSwitch, () => {
      this.checkPageTypeIsNew()
    })
  }

  private type: number = 0

  // 判断页面类型
  // 有些页面类型（如小说）虽然不支持，但它和支持的页面是无刷新切换的，所以视为支持的页面。等到开始抓取时再次判断是否可以抓取
  public getPageType(): number {
    const url = window.location.href
    let type: number

    if (
      window.location.hostname === 'www.pixiv.net' &&
      (window.location.pathname === '/' || window.location.pathname === '/en/')
    ) {
      type = 0
    } else if (/\/artworks\/\d{1,10}/.test(url)) {
      type = 1
    } else if (
      (/\/users\/\d+/.test(url) && !url.includes('/bookmarks')) ||
      url.includes('member.php?id=') ||
      url.includes('member_illust.php?id=')
    ) {
      type = 2
    } else if (
      location.pathname === '/bookmark.php' ||
      url.includes('/bookmarks')
    ) {
      type = 4
    } else if (url.includes('tags.php?') || url.includes('/tags/')) {
      type = 5
    } else if (
      location.pathname === '/ranking_area.php' &&
      location.search !== ''
    ) {
      type = 6
    } else if (window.location.pathname === '/ranking.php') {
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
    } else if (window.location.pathname === '/discovery') {
      type = 11
    } else if (
      url.includes('/new_illust.php') ||
      url.includes('/new_illust_r18.php')
    ) {
      type = 12
    } else {
      // 没有匹配到可用的页面类型
      throw new Error('Page type matching failed')
    }

    return type
  }

  // 检查是不是进入到了新的页面类型
  private checkPageTypeIsNew() {
    let newType = this.getPageType()

    if (this.type !== newType) {
      EVT.fire(EVT.events.pageTypeChange, newType)
    }

    // 保存当前页面类型
    this.type = newType
  }
}

const pageType = new PageType()
export { pageType }
