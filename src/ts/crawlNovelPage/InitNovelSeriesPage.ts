//初始化小说系列作品页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { store } from '../store/Store'
import { Tools } from '../Tools'
import { API } from '../API'
import { Utils } from '../utils/Utils'
import { MergeNovel } from '../download/MergeNovel'

class InitNovelSeriesPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private readonly limit = 30
  private last = 0

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取系列小说',
      '',
      'crawlSeriesNovel'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected addAnyElement() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_合并系列小说',
      '',
      'mergeSeriesNovel'
    ).addEventListener('click', () => {
      const seriesId = Utils.getURLPathField(window.location.pathname, 'series')
      new MergeNovel(seriesId)
    })
  }

  protected async nextStep() {
    this.getIdList()
  }

  protected async getIdList() {
    const seriesId = Utils.getURLPathField(window.location.pathname, 'series')
    const seriesData = await API.getNovelSeriesContent(
      seriesId,
      this.limit,
      this.last,
      'asc'
    )

    const list = seriesData.body.page.seriesContents
    for (const item of list) {
      store.idList.push({
        type: 'novels',
        id: item.id,
      })
    }

    this.last += list.length

    // 如果这一次返回的作品数量达到了每批限制，可能这次没有请求完，继续请求后续的数据
    if (list.length === this.limit) {
      this.getIdList()
    } else {
      this.getIdListFinished()
    }
  }

  protected resetGetIdListStatus() {
    this.last = 0
  }
}

export { InitNovelSeriesPage }
