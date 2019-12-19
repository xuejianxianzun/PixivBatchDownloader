// 抓取地区排行榜页面

import { CrawlPageBase } from './CrawlPageBase'
import { FilterOption } from './Filter.d'
import { filter } from './Filter'
import { lang } from './Lang'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'

class CrawlAreaRankingPage extends CrawlPageBase {
  protected getIdList() {
    // 地区排行榜
    const allPicArea = document.querySelectorAll('.ranking-item>.work_wrapper')

    for (const el of allPicArea) {
      const img = el.querySelector('._thumbnail')! as HTMLImageElement
      // img.dataset.type 全都是 "illust"，因此不能用来区分作品类型

      // 提取出 tag 列表
      const id = img.dataset.id!
      const tags = img.dataset.tags!.split(' ')
      const bookmarked = el
        .querySelector('._one-click-bookmark')!
        .classList.contains('on')

      const filterOpt: FilterOption = {
        id: id,
        tags: tags,
        bookmarkData: bookmarked
      }

      if (filter.check(filterOpt)) {
        const id = API.getIllustId(el.querySelector('a')!.href)
        store.idList.push(id)
      }
    }

    log.log(
      lang.transl('_列表抓取完成开始获取作品页', store.idList.length.toString())
    )
    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {}
}

export { CrawlAreaRankingPage }
