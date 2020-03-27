// 初始化地区排行榜页面
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { DOM } from './DOM'
import { options } from './Options'
import { FilterOption } from './Filter.d'
import { filter } from './Filter'
import { API } from './API'
import { store } from './Store'

class InitAreaRankingPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected appendCenterBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_抓取本页作品'), [
      ['title', lang.transl('_抓取本页作品Title')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected setFormOption() {
    options.hideOption([1])
  }

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
        bookmarkData: bookmarked,
      }

      if (filter.check(filterOpt)) {
        const id = API.getIllustId(el.querySelector('a')!.href)
        store.idList.push(id)
      }
    }

    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {}
}
export { InitAreaRankingPage }
