// 初始化 artwork 排行榜页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { API } from '../API'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { RankingOption } from '../crawl/CrawlArgument'
import { RankingImageWorkData } from '../crawl/CrawlResult'
import { filter, FilterOption } from '../filter/Filter'
import { store } from '../store/Store'
import { log } from '../Log'
import { states } from '../store/States'
import { Utils } from '../utils/Utils'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { Config } from '../Config'
import { nameRuleManager } from '../setting/NameRuleManager'

class InitRankingArtworkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取本排行榜作品',
      '_抓取本排行榜作品Title',
      'crawlRankingWork'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })

    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取首次登场的作品',
      '_抓取首次登场的作品Title',
      'crawlDebutWork'
    ).addEventListener('click', () => {
      states.debut = true
      log.warning(lang.transl('_抓取首次登场的作品'))
      this.readyCrawl()
    })
  }

  protected initAny() {
    Tools.hiddenPremiumAD()

    // 抓取完成后，复位 debut 标记
    // 因为 debut 只在抓取阶段被过滤器使用，所以抓取完成后就可以复位
    window.addEventListener(EVT.list.crawlComplete, () => {
      states.debut = false
    })
  }

  // 抓取完成后，对结果进行排序
  protected sortResult() {
    // 如果用户在命名规则里使用了 {rank}，则按照 rank 排序
    if (nameRuleManager.rule.includes('{rank}')) {
      store.result.sort(Utils.sortByProperty('rank', 'asc'))
      store.resultMeta.sort(Utils.sortByProperty('rank', 'asc'))
    }
  }

  private option: RankingOption = {
    mode: 'daily',
    p: 1,
    worksType: '',
    date: '',
  }

  /**检查了多少个小说 */
  private checkTotal = 0

  protected getWantPage() {
    this.listPageFinished = 0
    // 检查下载页数的设置
    this.crawlNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlNumber === -1) {
      log.warning(lang.transl('_向下获取所有作品'))
    } else {
      log.warning(
        lang.transl('_下载排行榜前x个作品', this.crawlNumber.toString())
      )
    }
    // 如果设置的作品个数是 -1，则设置为下载所有作品
    if (this.crawlNumber === -1) {
      this.crawlNumber = 500
    }
  }

  protected nextStep() {
    this.getParams()
    this.getIdList()
  }

  private getParams() {
    // URL 可能没有附带任何查询参数，也可能有最多 4 个查询参数
    // https://www.pixiv.net/ranking.php
    // https://www.pixiv.net/ranking.php?mode=daily_r18&content=all&date=20251101&p=2
    const url = new URL(window.location.href)

    // 设置 option 里的参数
    this.option.mode = url.searchParams.get('mode') || 'daily'
    this.option.worksType = url.searchParams.get('content') || 'all'
    this.option.date = url.searchParams.get('date') || undefined

    const p = url.searchParams.get('p')
    if (p) {
      this.option.p = Number.parseInt(p!)
    } else {
      // 如果没有 p 参数，则默认为第 1 页
      this.option.p = 1
    }
  }

  protected async getIdList() {
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    // 发起请求，获取作品列表
    let data: RankingImageWorkData
    try {
      data = await API.getRankingDataImageWork(this.option)
    } catch (error: Error | any) {
      if (error.status === 404) {
        // 如果发生了404错误，则中断抓取，直接下载已有部分。因为可能确实没有下一部分了
        console.log('404错误，直接下载已有部分')
        this.getIdListFinished()
      }

      // 429 错误时延迟重试
      if (error.status === 429) {
        this.log429ErrorTip()
        window.setTimeout(() => {
          this.getIdList()
        }, Config.retryTime)
      }

      return
    }

    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    this.listPageFinished++

    log.log(
      lang.transl('_排行榜进度', this.listPageFinished.toString()),
      1,
      false
    )

    const contents = data.contents // 取出作品信息列表
    for (const data of contents) {
      const pageCount = parseInt(data.illust_page_count)
      // 目前这个数据里并没有包含收藏数量，所以在这里没办法检查收藏数量要求
      const filterOpt: FilterOption = {
        id: data.illust_id,
        workType: parseInt(data.illust_type) as any,
        tags: data.tags,
        pageCount: pageCount,
        bookmarkData: data.is_bookmarked,
        width: pageCount === 1 ? data.width : 0,
        height: pageCount === 1 ? data.height : 0,
        yes_rank: data.yes_rank,
        userId: data.user_id.toString(),
      }

      if (await filter.check(filterOpt)) {
        store.setRankList(data.illust_id.toString(), data.rank)

        store.idList.push({
          type: Tools.getWorkTypeString(data.illust_type),
          id: data.illust_id.toString(),
        })
      }

      this.checkTotal++
      if (this.checkTotal >= this.crawlNumber) {
        return this.getIdListFinished()
      }
    }

    // 抓取完毕
    if (store.idList.length >= this.crawlNumber || !data.next) {
      this.getIdListFinished()
    } else {
      // 继续抓取
      this.option.p = data.next
      this.getIdList()
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
    this.checkTotal = 0
  }
}
export { InitRankingArtworkPage }
