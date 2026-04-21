import { settings } from '../setting/Settings'
import { pageType } from '../PageType'
import { lang } from '../Language'
import { log } from '../Log'
import { EVT } from '../EVT'
import { followingList } from '../FollowingList'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'

// 在搜索页面里移除已关注用户的作品
class RemoveWorksOfFollowedUsersOnSearchPage {
  constructor() {
    this.bindEvents()
    this.createObserver(document.body)
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (
        data.name === 'removeWorksOfFollowedUsersOnSearchPage' &&
        data.value
      ) {
        // 查找当前页面上的作品
        this.findWorks(document.body)
      }
    })

    window.addEventListener(EVT.list.followingUsersChange, () => {
      this.findWorks(document.body)
    })

    window.addEventListener(EVT.list.pageSwitch, async () => {
      this.showTip = true
      // 在来回切换页面时（例如之前进入了第 2 页，之后又从其他页面回到第 2 页），有时候 pixiv 的代码会报错：
      // Cannot remove a child from a different parent，并导致下载器没能成功移除该页面上应该移除的作品元素
      // 等待一段时间之后再重试，就可以正常移除元素了
      await Utils.sleep(1000)
      this.findWorks(document.body)
    })
  }

  private showTip = true

  // 在每个页面上只显示一次提示，切换页面后可以再次显示
  private showTipOnce() {
    if (!this.showTip) {
      return
    }

    this.showTip = false
    const tip = lang.transl('_在搜索页面里移除已关注用户的作品')
    log.warning(tip)
    toast.warning(tip)
  }

  private get enable() {
    return (
      settings.removeWorksOfFollowedUsersOnSearchPage &&
      (pageType.type === pageType.list.ArtworkSearch ||
        pageType.type === pageType.list.NovelSearch)
    )
  }

  /**传入作品元素，从中检查用户 ID，如果该用户已关注，就移除这个作品 */
  // 这里不能使用 ArtworkThumbnail 类（作品缩略图）所监听的元素来检查，因为 ArtworkThumbnail 监听的不是完整的作品元素，只是作品元素里的图片部分
  // 例如在搜索页面里，一个作品元素分为 3 个部分：1. 缩略图 2. 标题 3. 作者（用户名）
  // ArtworkThumbnail 获取的元素只是缩略图，不是完整的作品元素，所以不能用它来移除作品元素。而且缩略图里面有时可能没有用户信息，无法判断用户是否已关注。
  private check(el: HTMLElement) {
    // 作品列表的祖先元素有 data-ga4-label="works_content" 属性，不能删除，否则会导致所有作品都被删除
    // 另外，每个作品元素都有 data-ga4-label="thumbnail" 属性
    // 上面两点在图像搜索页面和小说搜索页面都是一样的
    if (el.dataset.ga4Label === 'works_content') {
      return
    }

    const userLink = el.querySelector('a[href*=users]') as HTMLAnchorElement
    if (!userLink) {
      return
    }

    // https://www.pixiv.net/users/9212166
    const userID = userLink.href.match(/\d+/)
    if (userID && followingList.following.includes(userID[0])) {
      el.remove()
      // console.log(el)
      this.showTipOnce()
    }
  }

  private findWorks(el: Element) {
    if (
      !this.enable ||
      el.nodeType !== 1 ||
      (el.nodeName !== 'BODY' && el.nodeName !== 'DIV' && el.nodeName !== 'LI')
    ) {
      return
    }

    // 新版搜索页面里的插画作品选择器
    let works = el.querySelectorAll('div.col-span-2')
    if (works.length === 0) {
      // 新版搜索页面里的插画作品选择器
      works = el.querySelectorAll('div[width="184"]')
    }
    if (works.length === 0) {
      // 旧版搜索页面里的插画作品选择器
      works = el.querySelectorAll('section ul li')
    }

    // 如果这些选择器都无效，需要考虑元素本身就是作品元素的情况，所以它没有符合要求的子元素
    if (works.length === 0) {
      // console.log(el)
      return this.check(el as HTMLElement)
    }

    for (const el of works) {
      this.check(el as HTMLElement)
    }
  }

  /**使用监视器，检查未来添加的作品元素 */
  protected createObserver(target: HTMLElement) {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.addedNodes.length > 0) {
          // 遍历被添加的元素，检查其中的作品元素
          for (const newEl of record.addedNodes) {
            this.findWorks(newEl as Element)
          }
        }
      }
    })

    observer.observe(target, {
      childList: true,
      subtree: true,
    })
  }
}

const removeWorksOfFollowedUsersOnSearchPage =
  new RemoveWorksOfFollowedUsersOnSearchPage()
export { removeWorksOfFollowedUsersOnSearchPage }
