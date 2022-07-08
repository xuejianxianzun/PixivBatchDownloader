// 初始化 本站的最新作品 artwork 页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { NewIllustOption } from '../crawl/CrawlArgument'
import { NewIllustData } from '../crawl/CrawlResult'
import { filter, FilterOption } from '../filter/Filter'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'

class InitNewArtworkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private option: NewIllustOption = this.resetOption()

  private readonly limitMax = 20 // 每次请求的数量最大是 20

  private fetchCount = 0 // 已请求的作品数量

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_下载大家的新作品'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected initAny() {}

  protected setFormOption() {
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: '_抓取多少作品',
      tip: '_想要获取多少个作品',
      rangTip: `1 - ${this.maxCount}`,
    })
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, false)
  }

  protected nextStep() {
    this.initFetchURL()
    this.getIdList()
  }

  private resetOption(): NewIllustOption {
    return {
      lastId: '0',
      limit: '20', // 每次请求的数量，可以比 20 小
      type: '',
      r18: '',
    }
  }

  // 组织要请求的 url
  private initFetchURL() {
    this.option = this.resetOption()

    if (this.crawlNumber < this.limitMax) {
      this.option.limit = this.crawlNumber.toString()
    } else {
      this.option.limit = this.limitMax.toString()
    }

    // 当前页面的作品类型，默认是 illust
    this.option.type =
      Utils.getURLSearchField(location.href, 'type') || 'illust'
    // 是否是 R18 模式
    this.option.r18 = (location.href.includes('_r18.php') || false).toString()
  }

  protected async getIdList() {
    let data: NewIllustData
    try {
      data = await API.getNewIllustData(this.option)
    } catch (error) {
      this.getIdList()
      return
    }

    let useData = data.body.illusts

    for (const nowData of useData) {
      // 抓取够了指定的数量
      if (this.fetchCount + 1 > this.crawlNumber) {
        break
      } else {
        this.fetchCount++
      }

      // 排除广告信息
      if (nowData.isAdContainer) {
        continue
      }

      const filterOpt: FilterOption = {
        id: nowData.id,
        width: nowData.pageCount === 1 ? nowData.width : 0,
        height: nowData.pageCount === 1 ? nowData.height : 0,
        pageCount: nowData.pageCount,
        bookmarkData: nowData.bookmarkData,
        workType: nowData.illustType,
        tags: nowData.tags,
        userId: nowData.userId,
        createDate: nowData.createDate,
        xRestrict: nowData.xRestrict,
      }

      if (await filter.check(filterOpt)) {
        store.idList.push({
          type: API.getWorkType(nowData.illustType),
          id: nowData.id,
        })
      }
    }

    log.log(lang.transl('_新作品进度', this.fetchCount.toString()), 1, false)

    // 抓取完毕
    if (
      this.fetchCount >= this.crawlNumber ||
      this.fetchCount >= this.maxCount
    ) {
      log.log(lang.transl('_开始获取作品页面'))
      this.getIdListFinished()
      return
    }

    // 继续抓取
    this.option.lastId = data.body.lastId
    this.getIdList()
  }

  protected resetGetIdListStatus() {
    this.fetchCount = 0
  }
}
export { InitNewArtworkPage }
