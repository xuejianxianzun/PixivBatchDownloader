import { settings } from '../setting/Settings'
import { pageType } from '../PageType'
import { store } from '../store/Store'

// 在搜索页面里移除已关注用户的作品
class RemoveWorksOfFollowedUsersOnSearchPage {
  constructor() {
    // 初始化时，页面上的作品元素尚未生成，所以不必使用 findWorks 方法
    // this.findWorks()

    this.createObserver(document.body)
  }

  /**传入作品元素，从中检查用户 ID，如果该用户已关注，就移除这个作品 */
  // 这里不能使用 ArtworkThumbnail 类（作品缩略图）所监听的元素来检查，因为 ArtworkThumbnail 监听的不是完整的作品元素，只是作品元素里的图片部分
  // 例如在搜索页面里，一个作品元素分为 3 个部分：1. 缩略图 2. 标题 3. 作者（用户名）
  // ArtworkThumbnail 获取的元素只是缩略图，不是完整的作品元素，所以不能用它来移除作品元素。而且缩略图里面有时可能没有用户信息，无法判断用户是否已关注。
  private check(el: HTMLElement) {
    if (
      !settings.removeWorksOfFollowedUsersOnSearchPage ||
      pageType.type !== pageType.list.ArtworkSearch
    ) {
      return
    }

    const userLink = el.querySelector('a[href*=users]') as HTMLAnchorElement
    if (!userLink) {
      return
    }

    // https://www.pixiv.net/users/9212166
    const userID = userLink.href.match(/\d+/)
    if (userID && store.followingUserIDList.includes(userID[0])) {
      el.remove()
    }
  }

  // 搜索页面里的插画作品选择器
  private readonly worksSelector = '#root section ul li'

  /**检查当前页面上的作品元素 */
  private findWorks() {
    const allLI = document.body.querySelectorAll(
      this.worksSelector
    ) as NodeListOf<HTMLLIElement>
    for (const LI of allLI) {
      this.check(LI)
    }
  }

  /**使用监视器，检查未来添加的作品元素 */
  protected createObserver(target: HTMLElement) {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.addedNodes.length > 0) {
          // 遍历被添加的元素，检查其中的作品元素
          for (const newEl of record.addedNodes) {
            if (newEl.nodeType !== 1) {
              continue
            }

            if (newEl.nodeName === 'LI') {
              this.check(newEl as HTMLElement)
            } else {
              const allLI = (newEl as HTMLElement).querySelectorAll('li')
              for (const LI of allLI) {
                this.check(LI)
              }
            }
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
