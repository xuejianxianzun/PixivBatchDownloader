import { EVT } from './EVT'
import { pageType } from './PageType'
import { Tools } from './Tools'
import { Utils } from './utils/Utils'
import { settings } from './setting/Settings'
import { Config } from './Config'
import { followingList } from './FollowingList'

// 备注：
// 有个 API 也可以获取关注总数量，即获取用户在 PC 端页面的额外数据：
// https://www.pixiv.net/ajax/user/extra?is_smartphone=0&lang=zh
// 包含已关注数量、粉丝数量、好 P 友数量

class HighlightFollowingUsers {
  constructor() {
    if (!Utils.isPixiv()) {
      return
    }

    window.addEventListener(EVT.list.followingUsersChange, () => {
      this.makeHighlight()
    })

    window.setTimeout(() => {
      this.startMutationObserver()
    }, 0)

    // 每当下载器获取了页面的主题颜色时
    window.addEventListener(EVT.list.getPageTheme, (ev: CustomEventInit) => {
      if (ev.detail.data) {
        if (this.pageTheme !== ev.detail.data) {
          // 当用户改变页面主题时，一些页面元素会重新生成，但是目前的代码不能监听到这个变化
          // 所以需要来更新高亮状态
          window.setTimeout(() => {
            this.makeHighlight()
          }, 0)
        }
        this.pageTheme = ev.detail.data
        // 给 html 标签添加自定义 data 属性，这是因为原本的 html 标签在没有任何 data 属性的时候，
        // 可能是普通模式，也可能是夜间模式，所以下载器必须自行添加一个属性，
        // 才能让高亮样式在不同模式中有不同的效果
        document.documentElement.setAttribute(
          'data-xzpagetheme',
          this.pageTheme
        )
      }
    })

    // 在作品页内，切换到另一个作者的作品时，作者名字会变化，需要重新设置高亮状态
    // 但是监视器无法监测到变化，尤其是右侧的名字，所以使用定时器执行
    window.addEventListener(EVT.list.pageSwitch, () => {
      if (
        !Config.mobile &&
        (pageType.type === pageType.list.Artwork ||
          pageType.type === pageType.list.Novel)
      ) {
        let time = 0
        let interval = 500
        let timer = window.setInterval(() => {
          time = time + interval
          if (time > 5000) {
            window.clearInterval(timer)
          }
          const leftA = document.querySelectorAll('main section a[href*=user]')
          const rightA = document.querySelectorAll('main+aside a[href*=user]')
          const allA = Array.from(leftA).concat(Array.from(rightA))
          this.makeHighlight(allA as HTMLAnchorElement[])
        }, interval)
      }
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'highlightFollowingUsers') {
        if (!data.value) {
          this.clearHighlight()
        } else {
          this.makeHighlight()
        }
      }
    })
  }

  private pageTheme = ''
  private readonly highlightClassName = 'pbdHighlightFollowing'

  // 检查包含用户 id 的链接，并且需要以 id 结束
  // 这是因为 id 之后还有字符的链接是不需要的，例如：
  // https://www.pixiv.net/en/users/17207914/artworks
  // 下载器只匹配用户主页的链接，不匹配用户子页面的链接
  private readonly checkUserLinkReg = /\/users\/(\d+)$/

  private makeHighlight(aList?: HTMLAnchorElement[]) {
    if (!settings.highlightFollowingUsers) {
      return
    }

    // 这里不需要检查 this.followingList.length === 0 的情况
    // 因为可能之前的数量是 1，之后用户取消关注，变成了 0，那么下面的代码依然需要执行
    // 以把之前高亮过的元素取消高亮

    const allA = aList || document.querySelectorAll('a')
    for (const a of allA) {
      let match = false
      if (a.href) {
        // 小说排行榜里的用户链接普遍带有 /novels 后缀，所以不要求以用户 id 结尾
        const test = a.href.match(
          pageType.type === pageType.list.NovelRanking
            ? /\/users\/(\d+)/
            : this.checkUserLinkReg
        )
        if (test && test.length > 1) {
          // 如果匹配到了用户链接，则检查 href 的原始值。这是因为当原始 href 值为空字符串时(<a href=''></a>)，a.href 的值会被浏览器自动解析成当前页面的 URL，这可能导致误判。需要排除这种情况
          if (!a.getAttribute('href')) {
            continue
          }

          match = followingList.following.includes(test[1])

          // 要高亮的元素
          let target: Element = a

          // 如果用户链接的 a 标签包含子元素，则将 className 添加到它的某个子元素上
          // 这是为了尽量精确的只高亮用户链接，避免高亮区域里包含其他不必要的元素
          // 但是有些页面里不适合这样做，例如在排行榜页面里，a 标签的第一个元素是用户头像
          // 此时如果只高亮第一个元素，那么效果就很不明显，所以就需要高亮整个 a 标签

          // 在多数情况下，高亮第一个子元素
          if (a.firstChild && a.firstChild.nodeType === 1) {
            target = a.firstChild as HTMLElement
          }

          // 在某些页面里高亮最后一个子元素
          if (
            pageType.type === pageType.list.ArtworkRanking ||
            pageType.type === pageType.list.AreaRanking
          ) {
            if (a.lastChild && a.lastChild.nodeType === 1) {
              target = a.lastChild as HTMLElement
            }
          }

          target.classList[match ? 'add' : 'remove'](this.highlightClassName)
        }
      }
    }

    this.handleUserHomePage()
  }

  private startMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const addedNodes of mutation.addedNodes) {
            if (addedNodes.nodeName === 'A') {
              // 直接是 A 标签的情况
              this.makeHighlight(Array.from([addedNodes as HTMLAnchorElement]))
            } else {
              // addedNodes 也会包含纯文本，所以需要判断 nodeType
              // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
              if (addedNodes.nodeType === 1) {
                // 如果是元素，则查找里面的 A 标签
                const allA = (addedNodes as HTMLElement).querySelectorAll('a')
                this.makeHighlight(Array.from(allA))
              } else {
                // 如果不是元素，而且它也不是 A 标签，则尝试查找它的父元素是不是 A 标签
                // 这是因为在作品页内，作品大图下方和右侧的作者名字变化时，上面的代码无法监测到
                // 但是这段代码只能检测到下方的，右侧的还是监测不到。而且可能拖累性能，所以我注释掉了
                // const parent = mutation.target.parentElement
                // if (parent && parent.nodeName === 'A') {
                //   this.makeHighlight([parent as HTMLAnchorElement])
                // }
              }
            }
          }
        }
      }
    })

    // 注意：本模块最好不要监听 attributes 变化，因为本模块自己就会修改元素的 attributes
    // 监听 attributes 并进行处理可能导致一些代码重复执行，或者死循环
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  private handleUserHomePage() {
    if (pageType.type === pageType.list.UserHome) {
      // 在用户主页里，高亮用户名（因为用户名没有超链接，需要单独处理）
      const userID = Tools.getCurrentPageUserID()
      const flag = followingList.following.includes(userID)
      const h1 = document.querySelector('h1') as HTMLHeadingElement
      if (h1) {
        h1.classList[flag ? 'add' : 'remove'](this.highlightClassName)
      }

      // 取消用户主页里“主页”按钮的高亮，它具有用户主页链接，但它不是用户名
      const selector = Config.mobile ? '.v-nav-tabs a' : 'nav a'
      const homeBtn = document.querySelector(selector)
      if (homeBtn) {
        homeBtn.classList.remove(this.highlightClassName)
      }
    }
  }

  private clearHighlight() {
    const allElement = document.querySelectorAll('.' + this.highlightClassName)
    for (const el of allElement) {
      el.classList.remove(this.highlightClassName)
    }
  }
}

new HighlightFollowingUsers()
