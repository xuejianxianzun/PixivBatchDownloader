// 初始化地区排行榜页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { options } from '../setting/Options'
import { filter, FilterOption } from '../filter/Filter'
import { store } from '../store/Store'

class InitAreaRankingPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected initAny() {}

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取本页作品',
      '_抓取本页作品Title'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected setFormOption() {
    options.hideOption([1])
  }

  protected async getIdList() {
    const allPicArea = document.querySelectorAll('.ranking-item>.work_wrapper')

    for (const el of allPicArea) {
      const img = el.querySelector('._thumbnail')! as HTMLImageElement
      // img.dataset.type 全都是 "illust"，因此不能用来区分作品类型

      // 提取出 tag 列表
      const id = img.dataset.id!
      const tags = img.dataset.tags!.split(' ')
      // 有的作品没有收藏按钮，点进去之后发现这个作品已经被删除了，只是排行榜里没有及时更新。这样的作品没有收藏按钮。
      const bookmarkBtn = el.querySelector('._one-click-bookmark')
      const bookmarked = bookmarkBtn
        ? bookmarkBtn.classList.contains('on')
        : false

      const filterOpt: FilterOption = {
        id: id,
        tags: tags,
        bookmarkData: bookmarked,
      }

      if (await filter.check(filterOpt)) {
        const id = Tools.getIllustId(el.querySelector('a')!.href)
        store.idList.push({
          type: 'unknown',
          id,
        })
      }
    }

    this.getIdListFinished()
  }
}
export { InitAreaRankingPage }
