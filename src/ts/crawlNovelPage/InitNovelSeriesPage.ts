//初始化小说系列作品页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { options } from '../setting/Options'
import { store } from '../store/Store'
import { Tools } from '../Tools'
import { API } from '../API'
import { states } from '../store/States'
import { settings } from '../setting/Settings'
import { getNovelGlossarys } from './GetNovelGlossarys'
import { Utils } from '../utils/Utils'

class InitNovelSeriesPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private seriesId: string = ''
  private readonly limit = 30
  private last = 0

  protected addCrawlBtns() {
    Tools.addBtn('crawlBtns', Colors.bgBlue, '_抓取系列小说').addEventListener(
      'click',
      () => {
        this.readyCrawl()
      }
    )
  }

  protected addAnyElement() {
    Tools.addBtn('crawlBtns', Colors.bgBlue, '_合并系列小说').addEventListener(
      'click',
      () => {
        states.mergeNovel = true
        this.readyCrawl()
      }
    )
  }

  protected initAny() {}

  protected setFormOption() {
    // 隐藏“个数/页数”选项
    options.hideOption([1])
  }

  protected getWantPage() {}

  protected async nextStep() {
    this.seriesId = Utils.getURLPathField(window.location.pathname, 'series')

    if (states.mergeNovel && settings.saveNovelMeta) {
      const data = await getNovelGlossarys.getGlossarys(this.seriesId)
      store.novelSeriesGlossary = getNovelGlossarys.storeGlossaryText(data)
    }

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
