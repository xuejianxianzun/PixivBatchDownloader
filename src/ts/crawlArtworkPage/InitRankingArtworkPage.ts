// 初始化 artwork 排行榜页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { API } from '../API'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { options } from '../setting/Options'
import { RankingOption } from '../crawl/CrawlArgument'
import { RankingData } from '../crawl/CrawlResult'
import { filter, FilterOption } from '../filter/Filter'
import { store } from '../store/Store'
import { log } from '../Log'
import { states } from '../store/States'
import { Utils } from '../utils/Utils'

class InitRankingArtworkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private pageCount: number = 10 // 排行榜的页数

  private option: RankingOption = this.resetOption()

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取本排行榜作品',
      '_抓取本排行榜作品Title'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })

    // 判断当前页面是否有“首次登场”标记
    const debutModes = ['daily', 'daily_r18', 'rookie', '']
    const mode = Utils.getURLSearchField(location.href, 'mode')

    if (debutModes.includes(mode)) {
      Tools.addBtn(
        'crawlBtns',
        Colors.bgBlue,
        '_抓取首次登场的作品',
        '_抓取首次登场的作品Title'
      ).addEventListener('click', () => {
        states.debut = true
        this.readyCrawl()
      })
    }
  }

  protected initAny() {
    // 抓取完成后，复位 debut 标记
    // 因为 debut 只在抓取阶段被过滤器使用，所以抓取完成后就可以复位
    window.addEventListener(EVT.list.crawlFinish, () => {
      states.debut = false
    })
  }

  protected setFormOption() {
    // 个数/页数选项的提示
    this.maxCount = 500

    options.setWantPageTip({
      text: '_抓取多少作品',
      tip: '_想要获取多少个作品',
      rangTip: `1 - ${this.maxCount}`,
    })
  }

  private resetOption(): RankingOption {
    return { mode: 'daily', p: 1, worksType: '', date: '' }
  }

  private setPartNum() {
    // 设置页数。排行榜页面一页有50张作品，当页面到达底部时会加载下一页
    if (location.pathname.includes('r18g')) {
      // r18g 只有1个榜单，固定1页
      this.pageCount = 1
    } else if (location.pathname.includes('_r18')) {
      // r18 模式，这里的6是最大值，有的排行榜并没有6页
      this.pageCount = 6
    } else {
      // 普通模式，这里的10也是最大值。如果实际没有10页，则在检测到404页面的时候停止抓取下一页
      this.pageCount = 10
    }
  }

  protected getWantPage() {
    this.listPageFinished = 0
    // 检查下载页数的设置
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_下载排行榜前x个作品'),
      lang.transl('_向下获取所有作品')
    )
    // 如果设置的作品个数是 -1，则设置为下载所有作品
    if (this.crawlNumber === -1) {
      this.crawlNumber = 500
    }
  }

  protected nextStep() {
    // 设置 option 信息
    // mode 一定要有值，其他字段不需要一定有值
    this.option = this.resetOption()
    this.option.mode = Utils.getURLSearchField(location.href, 'mode') || 'daily'
    this.option.worksType = Utils.getURLSearchField(location.href, 'content')
    this.option.date = Utils.getURLSearchField(location.href, 'date')

    this.startpageNo = 1

    this.setPartNum()
    this.getIdList()
  }

  protected async getIdList() {
    this.option.p = this.startpageNo + this.listPageFinished

    // 发起请求，获取作品列表
    let data: RankingData
    try {
      data = await API.getRankingData(this.option)
    } catch (error) {
      if (error.status === 404) {
        // 如果发生了404错误，则中断抓取，直接下载已有部分。因为可能确实没有下一部分了
        console.log('404错误，直接下载已有部分')
        this.getIdListFinished()
      }

      return
    }

    this.listPageFinished++

    const contents = data.contents // 取出作品信息列表
    for (const data of contents) {
      // 检查是否已经抓取到了指定数量的作品
      if (data.rank > this.crawlNumber) {
        return this.getIdListFinished()
      }

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
          type: API.getWorkType(data.illust_type),
          id: data.illust_id.toString(),
        })
      }
    }

    log.log(
      lang.transl('_排行榜进度', this.listPageFinished.toString()),
      1,
      false
    )

    // 抓取完毕
    if (this.listPageFinished === this.pageCount) {
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
export { InitRankingArtworkPage }
