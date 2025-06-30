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
    // 虽然我想过获取变化前后的 URL 进行对比，以排除仅是锚点变化的情况
    // 例如在漫画页面里点击“阅读作品”后，网址后面会添加 '#1'
    // 如果可以对比 URL 的前后变化，就能排除这种状态，不触发 pageSwitch 事件
    // 但是要获取变化前的 URL，需要手动记录。因为无论是 popstate 事件还是 pushState 操作，浏览器原生 API 都不直接提供变化前的 URL 信息，所以我懒得做这个判断了
  }
}

new ListenPageSwitch()
