// 抓取 bookmark_detail 页面
import { CrawlPageBase } from './CrawlPageBase'
import { lang } from './Lang'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'

class CrawlBookmarkDetailPage extends CrawlPageBase {
  protected getWantPage() {
    const check = this.checkWantPageInputGreater0()
    if (check == undefined) {
      return
    }
    this.crawlNumber = check

    if (this.crawlNumber > this.maxCount) {
      this.crawlNumber = this.maxCount
    }
  }

  // 获取相似的作品列表
  protected async getIdList() {
    let data = await API.getRecommenderData(API.getIllustId(), this.crawlNumber)

    for (const id of data.recommendations) {
      store.idList.push(id.toString())
    }

    log.log(lang.transl('_排行榜任务完成', store.idList.length.toString()))
    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {}
}
export { CrawlBookmarkDetailPage }
