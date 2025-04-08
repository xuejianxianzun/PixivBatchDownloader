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
  protected initAny() {
    this.replaceSmallThumb()
  }

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

  // 把地区排行榜里原本很小的缩略图替换成更大的缩略图
  // 原本的：
  // https://i.pximg.net/c/150x150/img-master/img/2025/03/29/02/47/17/128713029_p0_master1200.jpg
  // 替换成：
  // https://i.pximg.net/img-master/img/2025/03/29/02/47/17/128713029_p0_master1200.jpg
  private replaceSmallThumb() {
    window.setTimeout(() => {
      const allImage = document.querySelectorAll(
        '.ranking-item img'
      ) as NodeListOf<HTMLImageElement>
      if (allImage.length === 0) {
        return this.replaceSmallThumb()
      }

      allImage.forEach((img) => {
        // 当前视图里的 img 会加载，直接替换
        img.src = img.src.replace('/c/150x150', '')
        // 当前视图外的 img 是懒加载，需要替换 data-src 属性里的值
        img.dataset.src = img.dataset.src!.replace('/c/150x150', '')
      })
    }, 1000)
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
          type: 'illusts',
          id,
        })
      }
    }

    this.getIdListFinished()
  }
}
export { InitAreaRankingPage }
