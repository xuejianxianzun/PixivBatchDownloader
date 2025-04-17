import { API } from './API'
import { EVT } from './EVT'
import { pageType } from './PageType'
import { Tools } from './Tools'
import { store } from './store/Store'
import { Utils } from './utils/Utils'
import { List } from './ManageFollowing'
import { settings } from './setting/Settings'
import { toast } from './Toast'
import { lang } from './Lang'
import { Config } from './Config'

class HighlightFollowingUsers {
  constructor() {
    if (!Utils.isPixiv()) {
      return
    }

    this.delayCheckUpdate()

    window.setTimeout(() => {
      this.startMutationObserver()
    }, 0)

    chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
      if (msg.msg === 'dispathFollowingData') {
        this.receiveData(msg.data)
        EVT.fire('followingUsersChange')
      }

      if (msg.msg === 'updateFollowingData') {
        const following = await this.getList()

        console.log(lang.transl('_已更新关注用户列表'))
        toast.success(lang.transl('_已更新关注用户列表'), {
          position: 'topCenter',
        })

        chrome.runtime.sendMessage({
          msg: 'setFollowingData',
          data: {
            user: store.loggedUserID,
            following: following,
            total: this.total,
          },
        })
      }

      if (msg.msg === 'getLoggedUserID') {
        sendResponse({ loggedUserID: store.loggedUserID })
      }
    })

    if (store.loggedUserID) {
      chrome.runtime.sendMessage({
        msg: 'requestFollowingData',
      })
    }

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

  /**当前登录用户的关注用户列表 */
  private following: string[] = []

  /**当前登录用户的关注用户总数 */
  private total = 0

  private checkUpdateTimer?: number

  private readonly highlightClassName = 'pbdHighlightFollowing'

  private async receiveData(list: List) {
    const thisUserData = list.find((data) => data.user === store.loggedUserID)
    if (thisUserData) {
      this.following = thisUserData.following
      store.followingUserIDList = this.following
      this.total = thisUserData.total

      this.makeHighlight()
    } else {
      // 恢复的数据里没有当前用户的数据，需要获取
      this.checkNeedUpdate()
    }
  }

  /**全量获取当前用户的所有关注列表 */
  private async getList(): Promise<string[]> {
    toast.show(lang.transl('_正在加载关注用户列表'), {
      position: 'topCenter',
    })

    // 需要获取公开关注和私密关注
    const publicList = await this.getFollowingList('show')
    const privateList = await this.getFollowingList('hide')

    const followingIDList = publicList.concat(privateList)
    return followingIDList
  }

  /**获取公开或私密关注的用户 ID 列表 */
  private async getFollowingList(rest: 'show' | 'hide'): Promise<string[]> {
    const ids: string[] = []
    let offset = 0
    let total = await this.getFollowingTotal(rest)

    if (total === 0) {
      return ids
    }

    // 每次请求 100 个关注用户的数据
    const limit = 100

    while (ids.length < total) {
      const res = await API.getFollowingList(
        store.loggedUserID,
        rest,
        '',
        offset,
        limit
      )
      offset = offset + limit

      for (const users of res.body.users) {
        ids.push(users.userId)
      }

      if (res.body.users.length === 0) {
        // 实际获取到的关注用户数量可能比 total 少，这是正常的
        // 例如 toal 是 3522，实际上获取到的可能是 3483 个，再往后都是空数组了
        break
      }
    }

    return ids
  }

  /**只请求第一页的数据，以获取 total */
  private async getFollowingTotal(rest: 'show' | 'hide') {
    // 关注页面一页显示 24 个作者
    const res = await API.getFollowingList(store.loggedUserID, rest, '', 0, 24)

    return res.body.total
  }

  private getUpdateTime() {
    // 每次检查更新的最低时间间隔是 5 分钟
    // 如果用户打开了多个标签页，它们都会加载关注列表的第一页来检查数量
    // 所以间隔不宜太短
    const base = 300000

    // 产生一个 10 分钟内的随机数
    const random = Math.random() * 600000

    // 通常不需要担心间隔时间太大导致数据更新不及时
    // 因为多个标签页里只要有一个更新了数据，所有的标签页都会得到新数据
    return base + random
  }

  private async delayCheckUpdate() {
    window.clearTimeout(this.checkUpdateTimer)
    this.checkUpdateTimer = window.setTimeout(async () => {
      this.checkNeedUpdate()
      return this.delayCheckUpdate()
    }, this.getUpdateTime())
  }

  /**检查关注用户的数量，如果数量发生变化则执行全量更新 */
  private async checkNeedUpdate() {
    // 在搜索页面里移除已关注用户的作品 功能依赖关注用户列表，所以如果用户启用了该功能，也需要更新关注列表
    if (
      !settings.highlightFollowingUsers &&
      !settings.removeWorksOfFollowedUsersOnSearchPage
    ) {
      return
    }

    // 因为本程序不区分公开和非公开关注，所以只储存总数
    let newTotal = 0
    for (const rest of ['show', 'hide']) {
      const total = await this.getFollowingTotal(rest as 'show' | 'hide')
      newTotal = newTotal + total
    }

    if (newTotal !== this.total) {
      // console.log(`关注用户总数量变化 ${this.total} -> ${newTotal}`)
      this.total = newTotal
      chrome.runtime.sendMessage({
        msg: 'needUpdateFollowingData',
        user: store.loggedUserID,
      })
    }
  }

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
          match = this.following.includes(test[1])

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
      const flag = this.following.includes(userID)
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
