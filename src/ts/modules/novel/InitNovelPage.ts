//初始化小说作品页
import { InitPageBase } from '../InitPageBase'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { store } from '../Store'
import { QuickBookmark } from '../QuickBookmark'
import { userWorksType } from '../CrawlArgument'
import { DOM } from '../DOM'
import { API } from '../utils/API'
import { EVT } from '../EVT'
import { Tools } from '../Tools'

class InitNovelPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private crawlDirection: number = 0 // 抓取方向，指示抓取新作品还是旧作品
  /*
  -1 抓取新作品
  0 不设置抓取方向
  1 抓取旧作品
  */

  protected initAny() {
    this.initQuickBookmark()

    window.addEventListener(
      EVT.list.pageSwitchedTypeNotChange,
      this.initQuickBookmark
    )
  }

  private initQuickBookmark() {
    new QuickBookmark()
  }

  protected addCrawlBtns() {
    DOM.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      lang.transl('_从本页开始抓取new')
    ).addEventListener('click', () => {
      this.crawlDirection = -1
      this.readyCrawl()
    })

    DOM.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      lang.transl('_从本页开始抓取old')
    ).addEventListener('click', () => {
      this.crawlDirection = 1
      this.readyCrawl()
    })
  }

  protected setFormOption() {
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: lang.transl('_个数'),
      tip:
        lang.transl('_从本页开始下载提示') +
        '<br>' +
        lang.transl('_相关作品大于0'),
      rangTip: lang.transl('_数字提示1'),
    })
  }

  protected destroy() {
    DOM.clearSlot('crawlBtns')
    DOM.clearSlot('otherBtns')

    window.removeEventListener(
      EVT.list.pageSwitchedTypeNotChange,
      this.initQuickBookmark
    )
  }

  protected getWantPage() {
    // 检查下载页数的设置
    const crawlAllTip =
      this.crawlDirection === -1
        ? lang.transl('_从本页开始抓取new')
        : lang.transl('_从本页开始抓取old')
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_从本页开始下载x个'),
      crawlAllTip
    )
  }

  protected async getIdList() {
    let type: userWorksType[] = ['novels']
    let idList = await API.getUserWorksByType(DOM.getUserId(), type)

    // 储存符合条件的 id
    let nowId = parseInt(Tools.getIllustId(window.location.href))
    idList.forEach((id) => {
      let idNum = parseInt(id.id)
      // 新作品
      if (idNum >= nowId && this.crawlDirection === -1) {
        store.idList.push(id)
      } else if (idNum <= nowId && this.crawlDirection === 1) {
        // 旧作品
        store.idList.push(id)
      }
    })

    // 当设置了下载个数时，进行裁剪
    if (this.crawlNumber !== -1) {
      // 新作品 升序排列
      if (this.crawlDirection === -1) {
        store.idList.sort(Tools.sortByProperty('id')).reverse()
      } else {
        // 旧作品 降序排列
        store.idList.sort(Tools.sortByProperty('id'))
      }

      store.idList = store.idList.splice(0, this.crawlNumber)
    }

    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {
    this.crawlDirection = 0 // 解除下载方向的标记
  }
}
export { InitNovelPage }
