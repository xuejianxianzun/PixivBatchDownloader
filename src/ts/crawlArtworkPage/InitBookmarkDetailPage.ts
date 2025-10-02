// 初始化 bookmark_detail 页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'

class InitBookmarkDetailPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取相似图片',
      '_抓取相似图片',
      'crawlSimilarImage'
    ).addEventListener(
      'click',
      () => {
        this.readyCrawl()
      },
      false
    )
  }

  protected initAny() {}

  protected getWantPage() {
    this.crawlNumber = settings.crawlNumber[pageType.type].value
    log.warning(lang.transl('_从本页开始下载x个', this.crawlNumber.toString()))
  }

  // 获取相似的作品列表
  protected async getIdList() {
    let data = await API.getRecommenderData(
      Tools.getIllustId(),
      this.crawlNumber
    )

    for (const id of data.recommendations) {
      store.idList.push({
        type: 'illusts',
        id: id.toString(),
      })
    }

    this.getIdListFinished()
  }
}
export { InitBookmarkDetailPage }
