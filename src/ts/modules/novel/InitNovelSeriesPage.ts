//初始化小说系列作品页面
import { InitPageBase } from '../InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { store } from '../Store'
import { DOM } from '../DOM'
import { API } from '../API'

class InitNovelSeriesPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private seriesId: string = ''
  private readonly limit = 30
  private last = 0

  protected addCrawlBtns() {
    DOM.addBtn(
      'crawlBtns',
      Colors.blue,
      lang.transl('_抓取系列小说')
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected setFormOption() {
    // 隐藏“个数/页数”选项
    options.hideOption([1])
  }

  protected getWantPage() {}

  protected nextStep() {
    this.seriesId = API.getURLPathField('series')

    this.getIdList()
  }

  protected async getIdList() {
    const seriesData = await API.getNovelSeriesData(
      this.seriesId,
      this.limit,
      this.last,
      'asc'
    )

    const list = seriesData.body.seriesContents
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
    this.seriesId = ''
    this.last = 0
  }
}
export { InitNovelSeriesPage }
