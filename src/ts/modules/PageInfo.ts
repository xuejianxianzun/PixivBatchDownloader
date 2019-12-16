// 获取页面上的一些信息，用于文件名中
import { API } from './API'
import { DOM } from './DOM'
import { EVT } from './EVT'
import { store } from './Store'
import { pageType } from './PageType'

class PageInfo {
  constructor() {
    this.getPageInfo(pageType.getPageType())

    // 页面切换时获取新的页面信息
    window.addEventListener(EVT.events.pageSwitch, () => {
      this.getPageInfo(pageType.getPageType())
    })
  }

  // 预设为 1 是为了指示这个标记有值，这样在获取到实际值之前，就可以把它插入到下拉框里。
  private pageTitle = '1'
  private pageUserName = ''
  private pageUserID = ''
  private pageTag = ''

  public get getPageTag() {
    return this.pageTag
  }

  // 重置
  // 切换页面时可能旧页面的一些标记在新页面没有了，所以要先重置
  private reset() {
    this.pageUserName = ''
    this.pageUserID = ''
    this.pageTag = ''
  }

  // 储存信息
  // 开始抓取时，把此时的页面信息保存到 store 里。这样即使下载时页面切换了，使用的刚开始抓取时的信息。
  public async store() {
    await this.getPageInfo(pageType.getPageType())
    store.pageInfo.pageUserName = this.pageUserName
    store.pageInfo.pageUserID = this.pageUserID
    store.pageInfo.pageTag = this.pageTag
  }

  // 获取当前页面的一些信息，用于文件名中
  private async getPageInfo(type: number) {
    this.reset()

    // 设置用户信息
    if (type === 1 || type === 2) {
      // 只有 1 和 2 可以使用页面上的用户信息
      let data = await API.getUserProfile(DOM.getUserId())
      this.pageUserID = data.body.userId
      this.pageUserName = data.body.name
    }

    // 获取当前页面的 tag
    if (type === 5) {
      // pathname 获取到的 tag 不需要再编码
      this.pageTag = decodeURIComponent(
        location.pathname.split('tags/')[1].split('/')[0]
      )
    } else {
      this.pageTag = decodeURIComponent(
        API.getURLField(window.location.href, 'tag')
      )
    }

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
    let target = document.getElementById('pageInfoSelect')
    if (target) {
      target.innerHTML = optionHtml
    }
  }
}

const pageInfo = new PageInfo()
export { pageInfo }
