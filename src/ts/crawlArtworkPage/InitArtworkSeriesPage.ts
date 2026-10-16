// 初始化插画/漫画的系列作品页面
import { InitPageBase } from '../crawl/InitPageBase'
import { API } from '../API'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { saveSeriesWorks } from '../crawl/SaveSeriesWorks'
import { log } from '../Log'
import { Utils } from '../utils/Utils'
import { states } from '../store/States'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'

class InitArtworkSeriesPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected getIdListLogKey = 'crawlSeriesPageIdListProgress'

  private seriesId = ''

  protected addCrawlBtns() {
    this.addInitPageBtn(
      'crawlBtns',
      '_开始抓取',
      '_默认下载多页',
      'startCrawling',
      'brand'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected initAny() {}

  protected getWantPage() {
    this.crawlNumber = settings.crawlNumber[pageType.type].value
    log.warning(lang.transl('_从本页开始抓取x页', this.crawlNumber.toString()))
  }

  protected nextStep() {
    // 设置起始页码
    const p = Utils.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    // 获取系列 id
    this.seriesId = Tools.getSeriesId()

    this.getIdList()
  }

  protected async getIdList() {
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    let p = this.startpageNo + this.listPageFinished

    const data = await API.getSeriesData(this.seriesId, p)
    this.listPageFinished++

    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    // 保存本页面的作品
    await saveSeriesWorks.save(data.body)

    // 如果 data.body.page.series 为空，就是到了最后一页
    const endFlag = data.body.page.series.length === 0

    // 抓取完毕
    if (
      endFlag ||
      p >= this.maxCount ||
      this.listPageFinished === this.crawlNumber
    ) {
      log.log(lang.transl('_列表页抓取完成'))
      this.getIdListFinished()
    } else {
      // 继续抓取
      log.log(
        '➡️' + lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
        this.getIdListLogKey
      )

      this.getIdList()
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
  }
}
export { InitArtworkSeriesPage }
