// 抓取关注的新作品页面
import { CrawlPageBase } from './CrawlPageBase'
import { BookMarkNewData } from './CrawlResult.d'
import { FilterOption } from './Filter.d'
import { filter } from './Filter'
import { lang } from './Lang'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'

class CrawlBookmarkNewIllustPage extends CrawlPageBase {
  private r18 = false
  protected getWantPage() {
    const check = this.checkWantPageInputGreater0()
    if (check == undefined) {
      return
    }
    this.crawlNumber = check

    if (this.crawlNumber > this.maxCount) {
      this.crawlNumber = this.maxCount
    }

    this.listPageFinished = 0
    log.warning(lang.transl('_任务开始1', this.crawlNumber.toString()))
  }

  protected nextStep() {
    this.r18 = location.pathname.includes('r18')

    const p = API.getURLField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    this.getIdList()
  }

  protected async getIdList() {
    let p = this.startpageNo + this.listPageFinished

    // 发起请求，获取列表页
    let worksData: BookMarkNewData[]
    try {
      worksData = await API.getBookmarkNewIllustData(p, this.r18)
    } catch (error) {
      this.getIdList()
      return
    }

    // 检查一些此时可以进行检查的设置项
    for (const data of worksData) {
      const filterOpt: FilterOption = {
        width: data.width,
        height: data.height,
        pageCount: data.pageCount,
        bookmarkData: data.isBookmarked,
        illustType: parseInt(data.illustType) as any,
        tags: data.tags
      }

      if (filter.check(filterOpt)) {
        store.idList.push(data.illustId)
      }
    }

    this.listPageFinished++

    log.log(
      lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
      1,
      false
    )

    // 判断任务状态
    // 如果抓取了所有页面，或者抓取完指定页面
    if (p >= 100 || this.listPageFinished === this.crawlNumber) {
      log.log(lang.transl('_列表页抓取完成'))
      this.getIdListFinished()
    } else {
      // 继续抓取
      this.getIdList()
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
  }
}
export { CrawlBookmarkNewIllustPage }
