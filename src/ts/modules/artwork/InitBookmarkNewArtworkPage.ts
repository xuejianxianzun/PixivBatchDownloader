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
    this.maxCount = 250

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
    this.r18 = location.pathname.includes('r18')

    const p = API.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    this.getIdList()
  }

  protected async getIdList() {
    let p = this.startpageNo + this.listPageFinished

    // 发起请求，获取列表页
    let data
    try {
      data = await API.getBookmarkNewIllustData(p, this.r18)
    } catch (error) {
      this.getIdList()
      return
    }

    const worksData = data.data

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
        userId: data.userId,
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
      false,
    )

    // 判断任务状态
    // 如果抓取到了最后一页，或者抓取完了指定页面
    if (
      data.lastPage ||
      p >= this.maxCount ||
      this.listPageFinished === this.crawlNumber
    ) {
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
