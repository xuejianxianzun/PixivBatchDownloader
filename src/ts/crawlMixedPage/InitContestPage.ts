// 初始化比赛页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { Tools } from '../Tools'
import { store } from '../store/Store'
import { lang } from '../Language'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'
import { API } from '../API'
import { filter, FilterOption } from '../filter/Filter'
import { msgBox } from '../MsgBox'

class InitContestPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected getIdListLogKey = 'crawlApplicationWorkIdList'

  /** applications: 抓取应募作品；winning: 抓取获奖作品 */
  private scope: 'applications' | 'winning' = 'applications'
  private type: 'illust' | 'novel' = 'illust'
  private page = 1
  /** 比赛名称 */
  private name = ''
  /** 作品列表的排序方式 */
  private order: 'date_d' | 'date' | 'popular_d' = 'date_d'
  // order 的含义：
  // date_d: 按最新排序（默认），新作品在前
  // date: 按旧排序，旧作品在前
  // popular_d: 按热门度排序，热度高的作品在前
  // 注意：popular_d 需要开通 premium 会员才能使用。如果不是 premium 会员，那么在选择排序方式的控件里，popular_d 的值会变成 redirect_premium，点击会跳转到购买 premium 的页面。
  // 尝试在 API 里使用 popular_d 来绕过付费限制是无效的：
  // 如果页面是插画类型，请求会成功，但内容和默认的 date_d 一模一样。
  // 如果页面是小说类型，请求会返回 400 错误。

  private readonly matchIllustId = /id="illust:(\d+)"/g
  private readonly matchNovelId = /id="novel:(\d+)"/g

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取应募作品',
      '',
      'crawlApplicationWork'
    ).addEventListener('click', () => {
      this.scope = 'applications'
      this.readyCrawl()
    })

    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取获奖作品',
      '',
      'crawlWinningWork'
    ).addEventListener('click', () => {
      this.scope = 'winning'
      this.readyCrawl()
    })
  }

  protected initAny(): void {
    // 在 html 元素上添加标记，以便针对性调整日志区域的 z-index
    document.documentElement.classList.add('contest')
  }

  protected getWantPage() {
    if (this.scope === 'applications') {
      this.crawlNumber = settings.crawlNumber[pageType.type].value
      if (this.crawlNumber === -1) {
        log.warning(lang.transl('_抓取所有页面'))
      } else {
        log.warning(
          lang.transl(
            '_抓取x页_每页最多含有50个作品',
            this.crawlNumber.toString()
          )
        )
      }
    }
  }

  protected nextStep() {
    this.type = location.pathname.includes('/novel') ? 'novel' : 'illust'

    // 页码重置为从 1 开始
    this.page = 1

    this.name = Utils.getURLPathField(location.pathname, 'contest')

    // 获取排序方式
    this.order = 'date_d'
    const select = document.querySelector('select.order') as HTMLSelectElement
    if (select?.value) {
      if (select.value === 'redirect_premium') {
        this.order = 'date_d'
      } else {
        this.order = select.value as any
      }
    }

    if (this.scope === 'applications') {
      this.getIdList()
    } else {
      this.crawlWinning()
    }
  }

  protected async getIdList(): Promise<void> {
    const data = await API.getContestWorksData(
      this.type,
      this.name,
      this.page,
      this.order
    )
    if (data.error) {
      log.error(lang.transl('_API返回了错误信息') + data.error)
      return this.getIdListFinished()
    }

    // 提取作品 id
    const reg = this.type === 'illust' ? this.matchIllustId : this.matchNovelId
    let result: RegExpExecArray | null
    while ((result = reg.exec(data.body.html))) {
      if (result[1]) {
        const id = result[1]
        const filterOpt: FilterOption = { id }
        if (await filter.check(filterOpt)) {
          store.idList.push({
            type: this.type === 'illust' ? 'illusts' : 'novels',
            id,
          })
        }
      }
    }

    log.log(
      '➡️' + lang.transl('_已抓取x页应募作品', this.page.toString()),
      this.getIdListLogKey
    )

    // 判断是否抓取完毕
    this.page += 1
    if (
      (this.crawlNumber > -1 && this.page > this.crawlNumber) ||
      data.body.next_url === null
    ) {
      log.log(lang.transl('_开始获取作品页面'))
      return this.getIdListFinished()
    } else {
      return this.getIdList()
    }
  }

  private async crawlWinning() {
    log.log(lang.transl('_抓取获奖作品'))

    // 获奖作品直接存在于页面源码里，所以直接获取即可，不需要请求 API
    // 从作品的 a 标签上提取 id
    // 插画作品的 id 在 dataset 里
    // https://www.pixiv.net/contest/starseed
    // 小说作品的 id 没有在 dataset 里，所以需要从链接里提取
    // https://www.pixiv.net/novel/contest/uroko2025
    const allLink = this.getWinningLinks()
    for (const link of allLink) {
      const id = this.getWorkId(link)
      if (id) {
        const filterOpt: FilterOption = { id }
        if (await filter.check(filterOpt)) {
          store.idList.push({
            type: this.type === 'illust' ? 'illusts' : 'novels',
            id,
          })
        }
      }
    }

    return this.getIdListFinished()
  }

  private getWinningLinks(): NodeListOf<HTMLAnchorElement> {
    let selector = ''
    if (this.type === 'illust') {
      selector = '.winner .thumbnail-container a'
    } else {
      selector = '.winner a.novel-title'
    }

    const links = document.querySelectorAll(
      selector
    ) as NodeListOf<HTMLAnchorElement>
    if (links.length === 0) {
      const msg = lang.transl('_没有找到任何获奖作品_可能是因为比赛尚未结束')
      log.warning(msg)
      msgBox.warning(msg)
    }
    return links
  }

  private getWorkId(a: HTMLAnchorElement): string | undefined {
    if (this.type === 'illust') {
      return a.dataset.workId
    } else {
      return Tools.getNovelId(a.href)
    }
  }
}

export { InitContestPage }
