// 初始化排行榜页面
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { API } from './API'
import { lang } from './Lang'
import { DOM } from './DOM'
import { options } from './Options'
import { form } from './Settings'
import { RankingData } from './CrawlResult.d'
import { FilterOption } from './Filter.d'
import { filter } from './Filter'
import { store } from './Store'
import { log } from './Log'

class InitNovelRankingPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private pageCount: number = 2 // 排行榜的页数

  private pageUrls: string[] = []

  protected appendCenterBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_抓取本排行榜作品'), [
      ['title', lang.transl('_抓取本排行榜作品Title')],
    ]).addEventListener('click', () => {
      form.debut.value = '0'
      this.readyCrawl()
    })
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    this.maxCount = 100

    options.setWantPage({
      text: lang.transl('_个数'),
      tip: lang.transl('_要获取的作品个数2'),
      rangTip: `1 - ${this.maxCount}`,
      value: this.maxCount.toString(),
    })
  }

  private getPartData() {
    const ul = document.querySelector('.ui-selectbox-container ul')
    if (ul) {
      const li = ul.querySelectorAll('li')
      this.pageCount = li.length
      this.maxCount = this.pageCount * 50

      for (const el of li) {
        this.pageUrls.push(el.dataset.url!)
      }
    }
  }

  protected getWantPage() {
    this.listPageFinished = 0
    // 检查下载页数的设置
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_checkWantPageRule1Arg12'),
      lang.transl('_checkWantPageRule1Arg4')
    )
    // 如果设置的作品个数是 -1，则设置为下载所有作品
    if (this.crawlNumber === -1) {
      this.crawlNumber = 500
    }
  }

  protected nextStep() {
    this.startpageNo = 1

    this.getPartData()
    this.getIdList()
  }

  protected async getIdList() {
    alert('Not yet supported!')
    return
    // 发起请求，获取作品列表
    let data: RankingData
    try {
    } catch (error) {

      return
    }

    this.listPageFinished++

    const contents = data.contents // 取出作品信息列表
    for (const data of contents) {
      // 检查是否已经抓取到了指定数量的作品
      if (data.rank > this.crawlNumber) {
        return this.getIdListFinished()
      }

      // 目前，数据里并没有包含收藏数量，所以在这里没办法检查收藏数量要求
      const filterOpt: FilterOption = {
        id: data.illust_id,
        illustType: parseInt(data.illust_type) as any,
        tags: data.tags,
        pageCount: parseInt(data.illust_page_count),
        bookmarkData: data.is_bookmarked,
        width: data.width,
        height: data.height,
        yes_rank: data.yes_rank,
      }

      if (await filter.check(filterOpt)) {
        store.setRankList(data.illust_id.toString(), data.rank.toString())

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
export { InitNovelRankingPage }
