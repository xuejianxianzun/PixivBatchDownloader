// 初始化小说排行榜页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { options } from '../setting/Options'
import { filter, FilterOption } from '../filter/Filter'
import { store } from '../store/Store'
import { log } from '../Log'

class InitRankingNovelPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private pageUrlList: string[] = []

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取本排行榜作品',
      '_抓取本排行榜作品Title'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected initAny() {}

  protected setFormOption() {
    // 个数/页数选项的提示
    this.maxCount = 100

    options.setWantPageTip({
      text: '_抓取多少作品',
      tip: '_想要获取多少个作品',
      rangTip: `1 - ${this.maxCount}`,
    })
  }

  protected getWantPage() {
    // 检查下载页数的设置
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_下载排行榜前x个作品'),
      lang.transl('_向下获取所有作品')
    )
    // 如果设置的作品个数是 -1，则设置为下载所有作品
    if (this.crawlNumber === -1) {
      this.crawlNumber = this.maxCount
    }
  }

  private getPageUrl() {
    const ul = document.querySelector('.ui-selectbox-container ul')
    if (ul) {
      const li = ul.querySelectorAll('li')
      this.maxCount = li.length * 50

      for (const el of li) {
        this.pageUrlList.push(el.dataset.url!)
      }
    } else {
      // 只有一页的话，没有页码部分的 ul li
      this.pageUrlList.push(location.href)
    }
  }

  protected nextStep() {
    this.getPageUrl()
    this.getIdList()
  }

  protected async getIdList() {
    let dom: Document
    try {
      const res = await fetch(this.pageUrlList[this.listPageFinished])
      const text = await res.text()
      const parse = new DOMParser()
      dom = parse.parseFromString(text, 'text/html')
    } catch (error) {
      this.getIdList()
      return
    }

    this.listPageFinished++

    const rankingItem = dom.querySelectorAll(
      '._ranking-items>div[id]'
    ) as NodeListOf<HTMLDivElement>

    // 检查每个作品的信息
    for (const item of rankingItem) {
      const rank = parseInt(item.querySelector('h1')!.innerText)
      // 检查是否已经抓取到了指定数量的作品
      if (rank > this.crawlNumber) {
        return this.getIdListFinished()
      }

      // https://www.pixiv.net/novel/show.php?id=12831389
      const link = (item.querySelector('.imgbox a') as HTMLAnchorElement)!.href
      const id = parseInt(link.split('id=')[1])

      const bmkEl = item.querySelector('.bookmark-count') as HTMLAnchorElement
      let bmk: number = bmkEl ? parseInt(bmkEl.innerText) : 0

      const tags: string[] = []
      const tagsA = item.querySelectorAll(
        '.tags>li>a'
      ) as NodeListOf<HTMLAnchorElement>
      for (const a of tagsA) {
        tags.push(a.innerText.trim())
      }

      const userId = item.querySelector('img')!.dataset.userId

      // 有的作品没有收藏按钮，点进去之后发现这个作品已经被删除了，只是排行榜里没有及时更新。这样的作品没有收藏按钮。
      const bookmarkBtn = item.querySelector('._one-click-bookmark')
      const bookmarked = bookmarkBtn
        ? bookmarkBtn.classList.contains('on')
        : false

      const filterOpt: FilterOption = {
        id: id,
        workType: 3,
        tags: tags,
        bookmarkCount: bmk,
        bookmarkData: bookmarked,
        userId: userId,
      }

      if (await filter.check(filterOpt)) {
        store.setRankList(id.toString(), rank)

        store.idList.push({
          type: 'novels',
          id: id.toString(),
        })
      }
    }

    log.log(
      lang.transl('_排行榜进度', this.listPageFinished.toString()),
      1,
      false
    )

    // 抓取完毕
    if (
      store.idList.length >= this.crawlNumber ||
      this.listPageFinished === this.pageUrlList.length
    ) {
      this.getIdListFinished()
    } else {
      // 继续抓取
      this.getIdList()
    }
  }

  protected resetGetIdListStatus() {
    this.pageUrlList = []
    this.listPageFinished = 0
  }
}
export { InitRankingNovelPage }
