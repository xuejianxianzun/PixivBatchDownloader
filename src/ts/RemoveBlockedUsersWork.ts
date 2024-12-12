import { settings } from './setting/Settings'
import { EVT } from './EVT'
import { Tools } from './Tools'
import { pageType } from './PageType'
import { log } from './Log'
import { Utils } from './utils/Utils'
import { lang } from './Lang'

class RemoveBlockedUsersWork {
  constructor() {
    this.bindEvents()
  }

  // 当 Pixiv 语言设置为英语时，用户链接以 /en 开头，如
  // href="/en/users/277602"
  private readonly userLinkSelector = 'a[href*="/users/"]'

  private bindEvents() {
    // 当初始化时，以及用户修改了屏蔽列表时进行检查
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (
        data.name === 'userBlockList' ||
        data.name === 'blockList' ||
        data.name === 'removeBlockedUsersWork'
      ) {
        this.check()
      }
    })

    // 当页面内容变化时进行检查
    this.startMutationObserver()
  }

  private startMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const added of mutation.addedNodes) {
            // 如果添加的元素里含有用户链接，则进行检查
            if (
              added.nodeType === 1 &&
              (added as HTMLElement).querySelector(this.userLinkSelector)
            ) {
              this.check()
              break
            }
          }
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  // 在用户主页和作品页面里，不屏蔽这个用户自己的作品
  private dontRemoveCurrentUser = [
    pageType.list.UserHome,
    pageType.list.Bookmark,
    pageType.list.Artwork,
    pageType.list.ArtworkSeries,
    pageType.list.Novel,
    pageType.list.NovelSeries,
  ]

  private check = Utils.debounce(() => {
    if (
      document.hidden ||
      !settings.userBlockList ||
      !settings.removeBlockedUsersWork ||
      settings.blockList.length === 0
    ) {
      return
    }

    console.log('check')

    let currentUserID = ''
    if (this.dontRemoveCurrentUser.includes(pageType.type)) {
      currentUserID = Tools.getCurrentPageUserID()
    }

    const allUserLink = document.body.querySelectorAll(
      this.userLinkSelector
    ) as NodeListOf<HTMLAnchorElement>
    const removedUsers: Map<string, string> = new Map()
    for (const link of allUserLink) {
      // 在用户主页和作品页面里，不屏蔽这个用户本身的元素
      const userID = Tools.getUserID(link.href)
      if (userID === currentUserID) {
        continue
      }

      if (settings.blockList.includes(userID)) {
        // 查找用户链接的父元素，来移除这个作品，或者作品列表的容器
        this.findContainerEl(link).remove()
        // 保存记录
        // 有时候一个作者有 2 个链接，第一个是头像，没有用户名（textContent），第二个有用户名
        // 所以第二次添加它的记录时才能保存用户名
        const name = removedUsers.get(userID)
        if (!name) {
          // 如果没有获取到用户名，则更新。有用户名的话就不需要更新了
          removedUsers.set(userID, link.textContent || '')
        }
      }
    }

    // 输出日志
    const logText: string[] = []
    removedUsers.forEach((name, id) => {
      logText.push(
        lang.transl(
          '_移除了用户xxx的作品',
          `<a href="/users/${id}" target="blank">${name || id}</a>`
        )
      )
    })
    if (logText.length > 0) {
      log.warning(logText.join('<br>'))
    }
  }, 200)

  // 作品或作品列表元素的选择器
  private containerSelectors = ['li', 'ul>div']

  // li
  // 非常广泛

  // ul>div
  // 主要是首页里的元素，如 关注用户・好P友的作品 等。其他页面里也有一些地方是这个选择器

  private findContainerEl(link: HTMLAnchorElement) {
    let container: HTMLElement | null = null

    // 在某些页面里使用特定的选择器
    if (pageType.type === pageType.list.Following) {
      // 关注页面
      container = link.closest('section>div>div')
    } else if (pageType.type === pageType.list.ArtworkRanking) {
      // 排行榜页面
      container = link.closest('section.ranking-item')
    } else if (pageType.type === pageType.list.NovelRanking) {
      container = link.closest('div._ranking-item')
    }

    // 没有找到容器元素时（包括在其他页面里时），使用通用的选择器
    if (!container) {
      for (const selector of this.containerSelectors) {
        const find = link.closest(selector)
        if (find) {
          container = find as HTMLElement
          break
        }
      }
    }

    return container || link
  }
}

new RemoveBlockedUsersWork()
