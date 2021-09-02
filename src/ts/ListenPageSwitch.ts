import { EVT } from './EVT'

// 监听页面的无刷新切换
class ListenPageSwitch {
  constructor() {
    this.supportListenHistory()
    this.listenPageSwitch()
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
        EVT.fire('pageSwitch')
      })
    })
  }
}

new ListenPageSwitch()
