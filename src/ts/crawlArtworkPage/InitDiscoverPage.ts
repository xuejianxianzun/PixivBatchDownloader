// 初始化发现页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { options } from '../setting/Options'
import { store } from '../store/Store'
import { EVT } from '../EVT'

class InitDiscoverPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected addCrawlBtns() {
    Tools.addBtn('crawlBtns', Colors.bgBlue, lang.transl('_抓取当前作品'), [
      ['title', lang.transl('_抓取当前作品Title')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected initAny() {
    window.addEventListener(EVT.list.pageSwitchedTypeNotChange, () => {
      options.hideOption([1])
    })
  }

  protected setFormOption() {
    options.hideOption([1])
  }

  protected getWantPage() {}

  protected getIdList() {
    // 在发现页面，直接获取页面上显示的作品，不需要获取列表页
    if (location.pathname.includes('/novel')) {
      // 小说页面
      const allWork = document.querySelectorAll(
        '.gtm-novel-work-recommend-link'
      )
      allWork.forEach((div) => {
        const a = div.querySelector('a')
        if (a) {
          const id = Tools.getNovelId(a.href)
          store.idList.push({
            type: 'novels',
            id,
          })
        }
      })
    } else {
      // 插画漫画页面
      const allLink = document.querySelectorAll(
        'div[width="184"]>a'
      ) as NodeListOf<HTMLAnchorElement>
      // 获取已有作品的 id
      allLink.forEach((a) => {
        const id = Tools.getIllustId(a.href)
        store.idList.push({
          type: 'unknown',
          id,
        })
      })
    }
    this.getIdListFinished()
  }
}
export { InitDiscoverPage }
