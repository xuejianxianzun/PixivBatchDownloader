// 初始化收藏的新作小说页面
import { InitPageBase } from '../InitPageBase'
import { Color } from '../Colors'
import { API } from '../API'
import { lang } from '../Lang'
import { DOM } from '../DOM'
import { options } from '../setting/Options'
import { FilterOption } from '../filter/Filter.d'
import { filter } from '../filter/Filter'
import { store } from '../Store'
import { log } from '../Log'

class InitBookmarkNewNovelPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private baseUrl = ''

  protected addCrawlBtns() {
    DOM.addBtn('crawlBtns', Color.bgBlue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected initAny() { }

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

  private getPageUrl() {
    // 设置起始页面
    const p = API.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    const url = new URL(window.location.href)
    url.searchParams.set('p', '1')
    this.baseUrl = url.toString()
    // https://www.pixiv.net/novel/bookmark_new.php?p=1
    // https://www.pixiv.net/novel/bookmark_new_r18.php?p=1
  }

  protected nextStep() {
    this.getPageUrl()
    this.getIdList()
  }

  protected async getIdList() {
    let p = this.startpageNo + this.listPageFinished

    let dom: HTMLDocument
    try {
      const res = await fetch(this.baseUrl.replace('p=1', 'p=' + p))
      const text = await res.text()
      const parse = new DOMParser()
      dom = parse.parseFromString(text, 'text/html')
    } catch (error) {
      this.getIdList()
      return
    }

    this.listPageFinished++

    if (dom.querySelector('._no-item')) {
      // 此页没有内容，也就没有后续内容了
      return this.getIdListFinished()
    }

    const NovelItem = dom.querySelectorAll(
      '.novel-items>li'
    ) as NodeListOf<HTMLLIElement>

    // 检查每个作品的信息
    for (const item of NovelItem) {
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
        illustType: 3,
        tags: tags,
        bookmarkCount: bmk,
        bookmarkData: bookmarked,
        userId: userId,
      }

      if (await filter.check(filterOpt)) {
        store.idList.push({
          type: 'novels',
          id: id.toString(),
        })
      }
    }

    log.log(
      lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
      1,
      false
    )

    // 抓取完毕
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
export { InitBookmarkNewNovelPage }
