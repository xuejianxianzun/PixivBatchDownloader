import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { filter, FilterOption } from '../filter/Filter'
import { store } from '../store/Store'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { API } from '../API'
import { Config } from '../Config'
import { NovelItem } from '../crawl/CrawlResult.d'

// 新版小说排行榜页面
// Pixiv 的更新是批量推送的，有些用户已经是新版页面，但也有很多用户还是旧版页面。
// 由于旧版的用户无法使用新版的 API（会返回 404），所以新版和旧版需要分开处理
class InitRankingNovelPageNew extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

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
    Tools.hiddenPremiumAD()
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

  // 这 3 种排行榜只有全年龄，没有 R-18 分类：
  // 本月、新人、原创
  // 这 5 种排行榜有全年龄和 R-18 两种分类：
  // 今日、本周、AI生成、受男性欢迎、受女性欢迎
  // 这 1 种排行榜有 R-18G 分类：
  // 本周
  // 所以一共有 14 种排行榜分类：8 种全年龄，5 种 R-18，1 种 R-18G
  private mode = 'daily'
  private date: string | null = null
  private page = 1
  /**在小说列表的右上角有个下拉菜单，可以选择小说的语言。
   * 但是 API 获取小说时是不区分语言的，这个下拉菜单选择的语言只是对 API 的结果进行过滤，
   * 在网页上只显示对应语言的小说。
   */
  private selectLang = ''

  /**检查了多少个小说 */
  private checkTotal = 0

  protected nextStep() {
    this.getParams()
    this.getIdList()
  }

  private getParams() {
    // 处理 url 如：
    // https://www.pixiv.net/novel/ranking.php?mode=weekly_r18&p=2&date=20251031
    const url = new URL(window.location.href)

    // 获取排行榜模式
    // 如果没有 mode 参数，则是默认的今日排行榜
    this.mode = url.searchParams.get('mode') || 'daily'

    // 获取日期
    // 如果没有日期则不设置默认值，由 pixiv 处理
    this.date = url.searchParams.get('date')

    // 获取当前页码
    const p = url.searchParams.get('p')
    if (p) {
      this.page = Number.parseInt(p!)
    } else {
      // 如果没有 p 参数，则默认为第 1 页
      this.page = 1
    }
    // 大部分小说排行榜都是 100 个作品。一页 50 个作品，一共有 2 页
    // “AI生成”的排行榜只有 50 个作品，所以只有 1 页

    // 获取当前显示的小说语言，也就是小说列表右上角的下拉框里选择的语言
    // pixiv 会把用户选择的语言标记保存到本地存储里。如果选择“所有语种”则值是 ''
    const value = window.localStorage.getItem('rankinglanguageFilterSetting')
    if (value !== null) {
      this.selectLang = value
    }
  }

  protected async getIdList() {
    try {
      const json = await API.getRankingDataNovel(
        this.mode,
        this.date,
        this.page
      )

      this.listPageFinished++

      log.log(
        lang.transl('_排行榜进度', this.listPageFinished.toString()),
        1,
        false
      )

      const display_a = json.body.display_a
      let list = display_a.rank_a

      // list 可能是数组，也可能是有数字编号的对象，所以使用下标来取值
      // 目前一页最多有 50 条小说数据，所以 length 是 50
      const length = 50
      for (let i = 0; i < length; i++) {
        const novel: NovelItem = (list as any)[i]

        // 注意：有些小说可能会被作者删除，所以排行榜的数据里也就没有它。在页面上显示时，也会直接跳过它的排名编号。
        // 2 页本来应该有 100 个作品，但有时可能只有 99 个，所以会有空值
        if (novel === undefined) {
          continue
        }

        const filterOpt: FilterOption = {
          id: novel.id,
          workType: 3,
          tags: novel.tag_a,
          bookmarkCount: novel.bookmark_count,
          bookmarkData: novel.is_bookmarked,
          userId: novel.user_id,
        }

        let checkLang = true
        if (this.selectLang) {
          checkLang = novel.language === this.selectLang
        }
        if (!checkLang) {
          log.warning(
            lang.transl(
              '_下载器根据你选择的语言排除了一些作品',
              this.selectLang
            ),
            1,
            false,
            'excludeNovelByUserSelectLanguage'
          )
        }

        if ((await filter.check(filterOpt)) && checkLang) {
          const id = novel.id.toString()
          store.setRankList(id, Number.parseInt(novel.rank as string))
          store.idList.push({
            type: 'novels',
            id: id,
          })
        }

        this.checkTotal++
        if (this.checkTotal >= this.crawlNumber) {
          return this.getIdListFinished()
        }
      }

      // 抓取完毕
      if (store.idList.length >= this.crawlNumber || display_a.next === null) {
        this.getIdListFinished()
      } else {
        // 继续抓取
        this.page = display_a.next
        this.getIdList()
      }
    } catch (error: Error | any) {
      if (error.status === 404) {
        // 如果发生了404错误，则中断抓取，直接下载已有部分。因为可能确实没有这一页了
        console.log('404错误，直接下载已有部分')
        this.getIdListFinished()
      }

      // 429 错误时延迟重试
      if (error.status === 429) {
        this.log429ErrorTip()
        window.setTimeout(() => {
          this.getIdList()
        }, Config.retryTime)
      }

      return
    }
  }

  protected resetGetIdListStatus() {
    this.checkTotal = 0
    this.listPageFinished = 0
  }
}
export { InitRankingNovelPageNew }
