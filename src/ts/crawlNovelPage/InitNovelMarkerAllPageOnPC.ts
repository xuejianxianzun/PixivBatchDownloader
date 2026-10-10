import { API } from '../API'
import { InitPageBase } from '../crawl/InitPageBase'
import { EVT } from '../EVT'
import { FilterOption, filter } from '../filter/Filter'
import { lang } from '../Language'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { states } from '../store/States'
import { store } from '../store/Store'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'

// 初始化小说书签列表页面，用于 PC 端页面
// https://www.pixiv.net/novel/marker_all.php
// 该页面有页码。在 PC 端切换页面时会重新加载页面（不是无刷新加载）。
// 在 PC 端每页包含 6  篇小说，不使用 API，而是从 HTML 中解析数据
class InitNovelMarkerAllPageOnPC extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private urlBase = 'https://www.pixiv.net/novel/marker_all.php'
  protected getIdListLogKey = 'getIdListOnNovelMarkerAllPage'

  /** 请求列表页失败时的最大重试次数 */
  private readonly maxRetryCount = 3

  /** 当前列表页已经重试了多少次。请求成功后会清零 */
  private retryCount = 0

  protected addCrawlBtns() {
    this.addInitPageBtn(
      'crawlBtns',
      '_开始抓取',
      '',
      'crawlNovelMarkerAllWorks',
      'brand'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected nextStep() {
    if (this.crawlNumber === -1 || this.crawlNumber > 10) {
      this.setSlowCrawl()
    }

    // 设置起始页码
    const p = Utils.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    this.getIdList()
  }

  protected getWantPage() {
    this.crawlNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlNumber === -1) {
      log.warning(lang.transl('_抓取所有页面'))
    } else {
      log.warning(
        lang.transl(
          '_抓取x页_每页最多含有x个作品',
          this.crawlNumber.toString(),
          '6'
        )
      )
    }
  }

  /**
   * 请求列表页的 HTML。
   *
   * 请求失败时会退避重试，等待时间随着重试次数递增。
   * 重试次数用完后仍然失败则返回空字符串 —— 由调用方决定如何结束抓取，
   * 这里只负责请求，不参与其余流程，这样重试时不会重复处理已经抓取到的数据。
   */
  private async fetchListPage(url: string): Promise<string> {
    try {
      const text: string = await API.fetch(url, undefined, 'text')
      // 请求成功，清零重试次数
      this.retryCount = 0
      return text
    } catch (error) {
      if (this.retryCount >= this.maxRetryCount) {
        return ''
      }

      this.retryCount++
      log.error(lang.transl('_下载器会在几分钟后重试'))
      await Utils.sleep(Config.retryTime * this.retryCount)
      return this.fetchListPage(url)
    }
  }

  protected async getIdList() {
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    let url = this.urlBase
    let p = this.startpageNo + this.listPageFinished
    if (p > 0) {
      url = url + '?p=' + p
    }

    const text = await this.fetchListPage(url)
    // 重试次数用完后仍然失败，结束抓取
    if (!text) {
      log.error(lang.transl('_抓取列表页时遇到错误结束抓取'))
      EVT.fire('stopCrawl')
      return this.getIdListFinished()
    }
    this.listPageFinished++

    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    // 注意：这里以及之后的代码出错时不会重试。因为重新执行本页会重复处理作品，
    // 导致 store.idList 里出现重复的作品。
    try {
      // 保存本页面的作品的 id 列表
      const dom = new DOMParser().parseFromString(text, 'text/html')
      const list = dom.querySelectorAll(
        '.novel-items li'
      ) as NodeListOf<HTMLLIElement>
      // 如果进入了没有作品的页面，抓取完成。例如在只有 3 页时，抓取第 4 页就会这样。
      if (list.length === 0) {
        log.log(lang.transl('_列表页抓取完成'))
        return this.getIdListFinished()
      }

      // 如果一部小说属于一个系列，li 里面会同时包含系列链接和单篇小说链接。
      // 这里只获取单篇小说。
      for (const li of list) {
        const novelId = Tools.findWorkIdFromElement(li, 'novels')
        if (!novelId) {
          continue
        }

        const titleEl = li.querySelector('h1.title') as HTMLHeadingElement
        const title = titleEl ? titleEl.innerText?.trim() || '' : ''

        const userEl = li.querySelector('li.author a') as HTMLAnchorElement
        const userId = userEl ? Tools.getUserID(userEl.href) : ''

        const tags: string[] = []
        const tagEls = li.querySelectorAll(
          'ul.tags li'
        ) as NodeListOf<HTMLLIElement>
        for (const tagEl of tagEls) {
          const tag = tagEl.innerText?.trim() || ''
          if (tag) {
            tags.push(tag)
          }
        }

        const bookmarkCountEl = li.querySelector(
          'a.bookmark-count'
        ) as HTMLAnchorElement
        const bookmarkCount = bookmarkCountEl
          ? parseInt(bookmarkCountEl.innerText?.trim() || '0', 10)
          : undefined

        // 根据标签判断作品的限制等级（xRestrict）
        let xRestrict: 0 | 1 | 2 | undefined = undefined
        if (tags.includes('R-18')) {
          xRestrict = 1
        } else if (tags.includes('R-18G')) {
          xRestrict = 2
        } else {
          // 当没有 R-18 和 R-18G 标签时，将其视为普通等级（0）。
          xRestrict = 0
        }

        // 注意：这里没有传递 language，因为这个页面里没有小说的语言数据。
        // 小说的语言会在保存小说数据时（SaveNovelData）进行检查
        // 过滤器进行检查
        const filterOpt: FilterOption = {
          id: novelId,
          title,
          tags,
          bookmarkCount,
          workType: 3,
          userId: userId,
          xRestrict,
        }

        if (await filter.check(filterOpt)) {
          store.idList.push({
            type: 'novels',
            id: novelId,
          })
        }
      }

      // 抓取完毕
      if (this.listPageFinished === this.crawlNumber) {
        log.log(lang.transl('_列表页抓取完成'))
        return this.getIdListFinished()
      } else {
        // 继续抓取
        log.log(
          '➡️' +
            lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
          this.getIdListLogKey
        )

        if (states.slowCrawlMode) {
          await Utils.sleep(settings.slowCrawlDealy)
        }

        this.getIdList()
      }
    } catch (error) {
      log.error(lang.transl('_抓取列表页时遇到错误结束抓取'))
      EVT.fire('stopCrawl')
      return this.getIdListFinished()
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
    this.retryCount = 0
  }
}

export { InitNovelMarkerAllPageOnPC }
