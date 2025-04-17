import { settings } from '../setting/Settings'
import { pageType } from '../PageType'
import { store } from '../store/Store'
import { lang } from '../Lang'
import { log } from '../Log'
import { EVT } from '../EVT'

// 在搜索页面里移除已关注用户的作品
class RemoveWorksOfFollowedUsersOnSearchPage {
  constructor() {
    // 初始化时，页面上的作品元素尚未生成，所以不必使用 findAllWorks 方法
    // this.findAllWorks()

    this.createObserver(document.body)
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (
        data.name === 'removeWorksOfFollowedUsersOnSearchPage' &&
        data.value
      ) {
        this.findAllWorks()
      }
    })

    window.addEventListener(EVT.list.followingUsersChange, () => {
      this.findAllWorks()
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.showTip = false
    })
  }

  private showTip = false

  // 在每个页面上只显示一次提示
  private showTipOnce() {
    if (this.showTip) {
      return
    }

    this.showTip = true
    log.warning(lang.transl('_在搜索页面里移除已关注用户的作品'))
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
    if (!this.enable) {
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
      this.showTipOnce()
    }
  }

  // 搜索页面里的插画作品选择器
  private readonly worksSelector = 'section ul li'

  /**检查当前页面上的作品元素 */
  private findAllWorks() {
    if (!this.enable) {
      return
    }

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
      if (!this.enable) {
        return
      }

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
