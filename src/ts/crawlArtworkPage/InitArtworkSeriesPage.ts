// 初始化插画/漫画的系列作品页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { API } from '../API'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { options } from '../setting/Options'
import { filter, FilterOption } from '../filter/Filter'
import { store } from '../store/Store'
import { log } from '../Log'
import { Utils } from '../utils/Utils'

class InitArtworkSeriesPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private seriesId = ''

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_默认下载多页'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected initAny() {}

  protected setFormOption() {
    // 个数/页数选项的提示
    this.maxCount = 100

    options.setWantPageTip({
      text: '_抓取多少页面',
      tip: '_从本页开始下载提示',
      rangTip: `1 - ${this.maxCount}`,
    })
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, true)
  }

  protected nextStep() {
    // 设置起始页码
    const p = Utils.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    // 获取系列 id
    this.seriesId = Utils.getURLPathField(window.location.pathname, 'series')

    this.getIdList()
  }

  protected async getIdList() {
    let p = this.startpageNo + this.listPageFinished

    const data = await API.getSeriesData(this.seriesId, p)
    this.listPageFinished++

    // 保存本页面的作品的 id 列表
    const idList: string[] = []
    for (const info of data.body.page.series) {
      idList.push(info.workId)
    }
    // data.body.page.series 里的才是本页面的作品，illust 里则不同，有时它的作品数量比页面上的更多

    // 从 illust 里查找 id 对应的数据，进行过滤
    for (const work of data.body.thumbnails.illust) {
      if (!idList.includes(work.id)) {
        continue
      }
      if (work.isAdContainer) {
        continue
      }

      // 过滤器进行检查
      const filterOpt: FilterOption = {
        id: work.id,
        tags: work.tags,
        bookmarkData: !!work.bookmarkData,
        width: work.pageCount === 1 ? work.width : 0,
        height: work.pageCount === 1 ? work.height : 0,
        workType: work.illustType,
        userId: work.userId,
        createDate: work.createDate,
        xRestrict: work.xRestrict,
      }

      // 因为这个 api 的 illust 数据可能是插画也可能是漫画，所以 type 是 unknown
      if (await filter.check(filterOpt)) {
        store.idList.push({
          type: 'unknown',
          id: work.id,
        })
      }
    }

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
        lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
        1,
        false
      )

      this.getIdList()
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
  }
}
export { InitArtworkSeriesPage }
