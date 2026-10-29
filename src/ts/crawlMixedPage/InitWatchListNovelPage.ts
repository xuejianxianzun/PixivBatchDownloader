import { API } from '../API'
import { InitPageBase } from '../crawl/InitPageBase'
import { EVT } from '../EVT'
import { FilterOption, filter } from '../filter/Filter'
import { lang } from '../Language'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { states } from '../store/States'
import { store } from '../store/Store'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'

// 追更列表的小说分类页面
// 该页面里全都是系列作品，没有单篇作品。
class InitWatchListNovelPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected getIdListLogKey = 'getIdListOnWatchListNovelPage'

  protected addCrawlBtns() {
    this.addInitPageBtn(
      'crawlBtns',
      '_抓取追更列表',
      '',
      'crawlWatchList',
      'brand'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected nextStep() {
    if (this.crawlNumber === -1 || this.crawlNumber > 30) {
      this.setSlowCrawl()
    }

    // 设置起始页码
    const p = Utils.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    this.getIdList()
  }

  protected getWantPage() {
    this.crawlNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlNumber === -1) {
      log.warning(lang.transl('_抓取所有页面'))
    } else {
      log.warning(
        lang.transl(
          '_抓取x页_每页最多含有x个作品',
          this.crawlNumber.toString(),
          Config.mobile ? '10' : '24'
        )
      )
    }
  }

  protected async getIdList() {
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    const p = this.startpageNo + this.listPageFinished

    // 移动端和 PC 端使用的 API 不同
    const result = await this.getSeriesDataOnPage(p)
    this.listPageFinished++

    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    // 如果请求出错，或者没有获取到系列数据，则结束抓取
    if (!result) {
      log.error(lang.transl('_抓取列表页时遇到错误结束抓取'))
      EVT.fire('stopCrawl')
      return this.getIdListFinished()
    }

    // 保存本页面的系列 id 列表
    // 这个页面里全都是系列作品，没有单篇作品，所以只保存系列 id
    for (const series of result.seriesList) {
      // 注意：这里没有传递 tags，因为系列数据里的 tags 是它里面的小说的 tags，不能用来对整个系列进行过滤。
      // 系列小说也没有自己的语言，语言会在保存小说数据时（SaveNovelData）进行检查
      const filterOpt: FilterOption = {
        aiType: series.aiType,
        id: series.id,
        isOriginal: series.isOriginal,
        IDTypeString: 'novelSeries',
        seriesTitle: series.title,
        userId: series.userId,
        xRestrict: series.xRestrict,
      }

      if (await filter.check(filterOpt)) {
        store.idList.push({
          id: series.id,
          type: 'novelSeries',
          title: series.title,
        })
      }
    }

    // 判断是否到了最后一页，或者抓取到了指定的页数
    if (p >= result.maxPage || this.listPageFinished === this.crawlNumber) {
      log.log(lang.transl('_列表页抓取完成'))
      this.getIdListFinished()
    } else {
      // 继续抓取
      log.log(
        '➡️' + lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
        this.getIdListLogKey
      )

      if (states.slowCrawlMode) {
        await Utils.sleep(settings.slowCrawlDelay)
      }

      this.getIdList()
    }
  }

  /** 获取本页面的系列数据。
   *
   * 移动端和 PC 端使用的 API 不同，返回的数据结构也不同，所以需要分别处理。
   * 如果请求出错，返回 null */
  private async getSeriesDataOnPage(p: number) {
    if (Config.mobile) {
      // 移动端
      const data = await API.getTouchWatchListNovelData(p)
      if (data.error || !data.body?.novelSeries) {
        return null
      }
      return {
        seriesList: data.body.novelSeries,
        maxPage: data.body.maxPage,
      }
    } else {
      // PC 端
      const data = await API.getWatchListNovelData(p)
      if (data.error || !data.body?.thumbnails?.novelSeries) {
        return null
      }
      return {
        seriesList: data.body.thumbnails.novelSeries,
        maxPage: data.body.page.maxPage,
      }
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
  }
}

export { InitWatchListNovelPage }
