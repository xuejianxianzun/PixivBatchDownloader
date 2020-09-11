// 初始化 关注的新作品 artwork 页面
import { InitPageBase } from '../InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { DOM } from '../DOM'
import { options } from '../setting/Options'
import { BookMarkNewData } from '../CrawlResult.d'
import { FilterOption } from '../Filter.d'
import { filter } from '../Filter'
import { API } from '../API'
import { store } from '../Store'
import { log } from '../Log'

class InitBookmarkNewArtworkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private r18 = false

  protected appendCenterBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected appendElseEl() {}

  protected setFormOption() {
    // 设置“个数/页数”选项
    this.maxCount = 100

    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_从本页开始下载提示'),
      rangTip: `1 - ${this.maxCount}`,
      value: this.maxCount.toString(),
    })
  }

  protected getWantPage() {
    const check = this.checkWantPageInputGreater0()
    if (check == undefined) {
      return
    }
    this.crawlNumber = check

    if (this.crawlNumber > this.maxCount) {
      this.crawlNumber = this.maxCount
    }

    log.warning(lang.transl('_任务开始1', this.crawlNumber.toString()))
  }

  protected nextStep() {
    this.r18 = location.pathname.includes('r18')

    const p = API.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    this.getIdList()
  }

  protected async getIdList() {
    let p = this.startpageNo + this.listPageFinished

    // 发起请求，获取列表页
    let worksData: BookMarkNewData[]
    try {
      worksData = await API.getBookmarkNewIllustData(p, this.r18)
    } catch (error) {
      this.getIdList()
      return
    }

    // 检查一些此时可以进行检查的设置项
    for (const data of worksData) {
      const filterOpt: FilterOption = {
        id: data.illustId,
        width: data.width,
        height: data.height,
        pageCount: data.pageCount,
        bookmarkData: data.isBookmarked,
        illustType: parseInt(data.illustType) as any,
        tags: data.tags,
      }

      if (await filter.check(filterOpt)) {
        store.idList.push({
          type: API.getWorkType(data.illustType),
          id: data.illustId,
        })
      }
    }

    this.listPageFinished++

    log.log(
      lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
      1,
      false
    )

    // 判断任务状态
    // 如果抓取了所有页面，或者抓取完指定页面
    if (p >= this.maxCount || this.listPageFinished === this.crawlNumber) {
      log.log(lang.transl('_列表页抓取完成'))
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
export { InitBookmarkNewArtworkPage }
