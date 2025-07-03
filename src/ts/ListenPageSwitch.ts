import { EVT } from './EVT'

// 监听页面的无刷新切换
class ListenPageSwitch {
  constructor() {
    this.nowURL = window.location.href
    this.supportListenHistory()
    this.listenPageSwitch()
  }

  private nowURL = ''

  private saveURL(url: string): string {
    // 保存 URL 时，截断 hash
    return url.split('#')[0]
    // 这是为了应对漫画页面里 hash 变化的情况
    // 漫画页面的网址默认是没有 hash 的：
    // https://www.pixiv.net/artworks/130919451
    // 当点击“阅读作品”之后，会产生 hash：
    // https://www.pixiv.net/artworks/130919451#1
    // 这不应该被视为页面切换了，所以移除 hash 部分，让网址保持一致

    // 注意：不需要移除 ? 后面的查询字符串，这主要会出现在 tag 搜索页面和有页码的时候，如 ?p=1
    // 因为查询字符串变化后，页面内容会变化，所以应该视为不同的网址

    // 同时带有两者时，查询字符串在前，hash 在后，如：
    // https://www.pixiv.net/user/3698796/series/61267?p=3#seriesContents
    // 这是因为查询字符串会影响页面的内容，而 hash 通常不会影响页面的内容，只是负责跳转显示位置
    // 或者显示/隐藏漫画阅读部分的元素

  }

  // 为监听 url 变化的事件提供支持
  private supportListenHistory() {
    const s = document.createElement('script')
    const url = chrome.runtime.getURL('lib/listen_history_change.js')
    s.src = url
    document.head.appendChild(s)
  }

  // 无刷新切换页面时派发事件
  private listenPageSwitch() {
    // 点击浏览器的前进或后退按钮会触发 popstate 事件
    // 点击链接进入一个 url 不同的页面是 pushState 操作
    // 现在还没有遇到 replaceState 操作
    ;['pushState', 'popstate', 'replaceState'].forEach((item) => {
      window.addEventListener(item, () => {
        const now = this.saveURL(window.location.href)
        if (now !== this.nowURL) {
          this.nowURL = now
          EVT.fire('pageSwitch')
        }
      })
    })
  }
}

new ListenPageSwitch()
