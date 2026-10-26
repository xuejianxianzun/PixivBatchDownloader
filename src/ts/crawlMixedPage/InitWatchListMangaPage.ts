import { API } from '../API'
import { InitPageBase } from '../crawl/InitPageBase'
import { saveSeriesWorks } from '../crawl/SaveSeriesWorks'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { states } from '../store/States'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'

// 追更列表的漫画分类页面
// 该页面里全都是系列作品，没有单篇作品。
// 备注：有些系列里没有任何作品，这样的系列不会显示出来。所以肉眼看到的一页里的系列数量可能少于最大值。
class InitWatchListMangaPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected getIdListLogKey = 'getIdListOnWatchListMangaPage'

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

    // 逐个获取每个系列里的所有作品。
    // 注意：不对漫画系列使用过滤器检查。过滤器会在获取作品时对每个作品进行检查
    for (const series of result.seriesList) {
      await this.getWorksOfSeries(series.id)

      if (states.stopCrawl) {
        return this.getIdListFinished()
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
        await Utils.sleep(settings.slowCrawlDealy)
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
      const data = await API.getTouchWatchListMangaData(p)
      if (data.error || !data.body?.illustSeries) {
        return null
      }
      return {
        seriesList: data.body.illustSeries,
        maxPage: data.body.maxPage,
      }
    } else {
      // PC 端
      const data = await API.getWatchListMangaData(p)
      if (data.error || !data.body?.illustSeries) {
        return null
      }
      return {
        seriesList: data.body.illustSeries,
        maxPage: data.body.page.maxPage,
      }
    }
  }

  /** 获取一个系列里的所有作品。
   *
   * 一个系列里可能有多个作品，分为多个页面。
   * 这里总是抓取这个系列里所有页数的作品，直到最后一页 */
  private async getWorksOfSeries(seriesId: string) {
    let page = 1

    while (true) {
      if (states.stopCrawl) {
        return
      }

      // 输出日志，让用户知道下载器正在抓取
      log.log(lang.transl('_正在抓取'), 'crawlWatchListMangaSeries')

      const data = await API.getSeriesData(seriesId, page)

      // 如果请求出错，则结束抓取
      if (data.error || !data.body?.page) {
        log.error(lang.transl('_抓取列表页时遇到错误结束抓取'))
        EVT.fire('stopCrawl')
        return
      }

      // 保存这个页面里的作品
      await saveSeriesWorks.save(data.body)

      // 如果 data.body.page.series 为空，就是到了最后一页
      if (data.body.page.series.length === 0) {
        break
      }

      page++

      if (states.slowCrawlMode) {
        await Utils.sleep(settings.slowCrawlDealy)
      }
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
  }
}

export { InitWatchListMangaPage }
