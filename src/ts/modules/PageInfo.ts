import { API } from './API'
import { EVT } from './EVT'
import { store } from './Store'

// 获取页面标题和页面的 tag，在抓取开始时保存。用于命名规则里
class PageInfo {
  constructor() {
    this.getPageInfo()

    this.bindEvent()
  }

  private _title = ''
  private _tag = ''

  public get tag() {
    return this._tag
  }

  // 重置
  // 切换页面时可能旧页面的一些标记在新页面没有了，所以要先重置
  private reset() {
    this._title = ''
    this._tag = ''
  }

  // 储存信息
  public store() {
    this.getPageInfo()
    store.pageInfo.pageTitle = this._title
    store.pageInfo.pageTag = this._tag
  }

  // 获取当前页面的一些信息，用于文件名中
  private getPageInfo() {
    this.reset()

    // 去掉标题上的下载状态、消息数量提示
    this._title = document.title
      .replace(/\[(↑|→|▶|↓|║|■|✓| )\] /, '')
      .replace(/^\(\d.*\) /, '')

    // 获取当前页面的 tag
    this._tag = decodeURIComponent(API.getTagFromURL(location.href))
  }

  private bindEvent() {
    // 页面切换时获取新的页面信息
    window.addEventListener(EVT.events.pageSwitch, () => {
      this.getPageInfo()
    })

    // 开始抓取时，把此时的页面信息保存到 store 里。这样即使下载时页面切换了，使用的还是刚开始抓取时的数据。
    window.addEventListener(EVT.events.crawlStart, () => {
      this.store()
    })

    // 当需要恢复下载时，保存页面信息
    window.addEventListener(
      EVT.events.crawlFinish,
      async (ev: CustomEventInit) => {
        if (ev.detail.data.initiator === EVT.InitiatorList.resume) {
          this.store()
        }
      }
    )
  }
}

const pageInfo = new PageInfo()
export { pageInfo }
