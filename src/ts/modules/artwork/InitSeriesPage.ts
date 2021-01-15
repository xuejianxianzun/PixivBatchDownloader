// 初始化插画/漫画的系列作品页面
import { InitPageBase } from '../InitPageBase'
import { Colors } from '../Colors'
import { API } from '../API'
import { lang } from '../Lang'
import { DOM } from '../DOM'
import { options } from '../setting/Options'
import { FilterOption } from '../filter/Filter.d'
import { filter } from '../filter/Filter'
import { store } from '../Store'
import { log } from '../Log'

class InitSeriesPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private seriesId = ''

  protected addCrawlBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected initAny() {}

  protected setFormOption() {
    // 个数/页数选项的提示
    this.maxCount = 100

    options.setWantPageTip({
      text: lang.transl('_页数'),
      tip: lang.transl('_从本页开始下载提示'),
      rangTip: `1 - ${this.maxCount}`,
    })
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, true)
  }

  protected nextStep() {
    // 设置起始页码
    const p = API.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    // 获取系列 id
    this.seriesId = API.getURLPathField('series')

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
        width: work.width,
        height: work.height,
        illustType: work.illustType,
        userId: work.userId,
        createDate: work.createDate,
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
export { InitSeriesPage }
