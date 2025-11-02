import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { filter, FilterOption } from '../filter/Filter'
import { store } from '../store/Store'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'

// 旧版小说排行榜页面，加载页面源码并从中获取数据
class InitRankingNovelPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private pageUrlList: string[] = []

  private page = 1

  /**在小说列表的右上角有个下拉菜单，可以选择小说的语言。
   * 但是 API 获取小说时是不区分语言的，这个下拉菜单选择的语言只是对 API 的结果进行过滤，
   * 在网页上只显示对应语言的小说。
   */
  private selectLang = ''

  /**检查了多少个小说 */
  private checkTotal = 0

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取本排行榜作品',
      '_抓取本排行榜作品Title',
      'crawlRankingWork'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected initAny() {
    // 移除 Pixiv 高级会员的广告横幅元素
    const ads = document.querySelectorAll('a[href^="/premium/lead/lp/"]')
    ads.forEach((ad) => {
      ;(ad as HTMLElement).style.display = 'none'
    })
  }

  protected getWantPage() {
    // 检查下载页数的设置
    this.crawlNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlNumber === -1) {
      log.warning(lang.transl('_向下获取所有作品'))
    } else {
      log.warning(
        lang.transl('_下载排行榜前x个作品', this.crawlNumber.toString())
      )
    }
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

    // 处理 url 如：
    // https://www.pixiv.net/novel/ranking.php?mode=weekly_r18&p=2&date=20251031
    const url = new URL(window.location.href)

    // 获取当前页码
    const p = url.searchParams.get('p')
    if (p) {
      this.page = Number.parseInt(p!)
    } else {
      // 如果没有 p 参数，则默认为第 1 页
      this.page = 1
    }

    // 获取当前显示的小说语言，也就是小说列表右上角的下拉框里选择的语言
    // pixiv 会把用户选择的语言标记保存到本地存储里。如果选择“所有语种”则值是 ''
    const value = window.localStorage.getItem('rankinglanguageFilterSetting')
    if (value !== null) {
      // 在旧版页面里，这个储存的字符串额外添加了双引号，值是
      // '"ja"' 或 '""' 这样。需要移除双引号
      this.selectLang = value.replaceAll('"', '')
    }

    this.getIdList()
  }

  protected async getIdList() {
    let dom: Document
    try {
      const res = await fetch(this.pageUrlList[this.page - 1])
      const text = await res.text()
      const parse = new DOMParser()
      dom = parse.parseFromString(text, 'text/html')
    } catch (error) {
      this.getIdList()
      return
    }

    this.page++
    this.listPageFinished++

    log.log(
      lang.transl('_排行榜进度', this.listPageFinished.toString()),
      1,
      false
    )

    const rankingItem = dom.querySelectorAll(
      '._ranking-items>div[id]'
    ) as NodeListOf<HTMLDivElement>

    // 检查每个作品的信息
    for (const item of rankingItem) {
      const rank = parseInt(item.querySelector('h1')!.innerText)
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

      // item 上有语言标记，使用它来过滤小说
      let checkLang = true
      if (this.selectLang && item.dataset.language) {
        checkLang = item.dataset.language === this.selectLang
      }
      if (!checkLang) {
        log.warning(
          lang.transl('_下载器根据你选择的语言排除了一些作品', this.selectLang),
          1,
          false,
          'excludeNovelByUserSelectLanguage'
        )
      }

      if ((await filter.check(filterOpt)) && checkLang) {
        store.setRankList(id.toString(), rank)

        store.idList.push({
          type: 'novels',
          id: id.toString(),
        })
      }

      this.checkTotal++
      if (this.checkTotal >= this.crawlNumber) {
        return this.getIdListFinished()
      }
    }

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
    this.checkTotal = 0
    this.listPageFinished = 0
  }
}
export { InitRankingNovelPage }
