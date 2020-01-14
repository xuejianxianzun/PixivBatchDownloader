// 获取页面上的一些信息，用于文件名中
import { API } from './API'
import { DOM } from './DOM'
import { EVT } from './EVT'
import { store } from './Store'
import { pageType } from './PageType'

class PageInfo {
  constructor() {
    this.getPageInfo()

    // 页面切换时获取新的页面信息
    window.addEventListener(EVT.events.pageSwitch, () => {
      this.getPageInfo()
    })
  }

  private pageTitle = ''
  private pageUserName = ''
  private pageUserID = ''
  private pageTag = ''

  public get getPageTag() {
    return this.pageTag
  }

  // 重置
  // 切换页面时可能旧页面的一些标记在新页面没有了，所以要先重置
  private reset() {
    this.pageTitle = ''
    this.pageUserName = ''
    this.pageUserID = ''
    this.pageTag = ''
  }

  // 储存信息
  // 开始抓取时，把此时的页面信息保存到 store 里。这样即使下载时页面切换了，使用的刚开始抓取时的信息。
  public async store() {
    await this.getPageInfo()
    store.pageInfo.pageTitle = this.pageTitle
    store.pageInfo.pageUserName = this.pageUserName
    store.pageInfo.pageUserID = this.pageUserID
    store.pageInfo.pageTag = this.pageTag
  }

  // 获取当前页面的一些信息，用于文件名中
  private async getPageInfo() {
    const type = pageType.getPageType()

    this.reset()

    // 去掉标题上的下载状态、消息数量提示
    this.pageTitle = document.title
      .replace(/\[(↑|→|▶|↓|║|■|√| )\] /, '')
      .replace(/^\(\d.*\) /, '')

    // 设置用户信息
    if (type === 1 || type === 2) {
      // 只有 1 和 2 可以使用页面上的用户信息
      // 执行时可能 DOM 加载完成了，但主要内容没有加载出来，需要等待
      try {
        const data = await API.getUserProfile(DOM.getUserId())
        this.pageUserID = data.body.userId
        this.pageUserName = data.body.name
      } catch (error) {
        return window.setTimeout(() => {
          this.getPageInfo()
        }, 300)
      }
    }

    // 获取当前页面的 tag
    this.pageTag = decodeURIComponent(API.getTagFromURL(location.href))

    // 将可用选项添加到下拉选项里
    this.initPageInfoSelector()
  }

  private initPageInfoSelector() {
    let optionHtml = '<option value="default">…</option>'

    const info = new Map([
      ['p_title', this.pageTitle],
      ['p_user', this.pageUserName],
      ['p_uid', this.pageUserID],
      ['p_tag', this.pageTag]
    ])

    for (let [key, value] of info.entries()) {
      if (value) {
        optionHtml += `<option value="{${key}}">{${key}}</option>`
      }
    }
    const target = document.getElementById('pageInfoSelect')
    if (target) {
      target.innerHTML = optionHtml
    }
  }
}

const pageInfo = new PageInfo()
export { pageInfo }
