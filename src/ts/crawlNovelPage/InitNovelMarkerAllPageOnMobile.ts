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
import { Utils } from '../utils/Utils'
import { Config } from '../Config'
import { NovelMarkerAllData } from '../crawl/CrawlResult'
import { msgBox } from '../MsgBox'

// 初始化小说书签列表页面，用于移动端页面
// https://www.pixiv.net/novel/marker_all.php
// 该页面有页码。
// 在移动端使用 API 请求，无刷新加载，每页包含 10 个小说
// 包含已失效的小说，API 里包含已失效小说的 id、用户 id、用户名。
class InitNovelMarkerAllPageOnMobile extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

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
      if (!store.loggedUserID) {
        const msg = lang.transl('_未登录用户无法抓取')
        log.error(msg)
        msgBox.error(msg)
        return
      }

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
          '10'
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
  private async fetchListPage(p: number): Promise<NovelMarkerAllData> {
    try {
      const data = await API.getNovelMarkerAllData(store.loggedUserID, p)
      // 请求成功，清零重试次数
      this.retryCount = 0
      return data
    } catch (error) {
      if (this.retryCount >= this.maxRetryCount) {
        return []
      }

      this.retryCount++
      log.error(lang.transl('_下载器会在几分钟后重试'))
      await Utils.sleep(Config.retryTime * this.retryCount)
      return this.fetchListPage(p)
    }
  }

  protected async getIdList() {
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    let p = this.startpageNo + this.listPageFinished
    const data = await this.fetchListPage(p)
    // 重试次数用完后仍然失败，结束抓取
    if (this.retryCount >= this.maxRetryCount) {
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
      // 如果进入了没有作品的页面，抓取完成。例如在只有 3 页时，抓取第 4 页就会这样。
      if (data.length === 0) {
        log.log(lang.transl('_列表页抓取完成'))
        return this.getIdListFinished()
      }

      // 如果一部小说属于一个系列，数据里会含有系列 id 和标题。
      // 这里只获取单篇小说。
      for (const item of data) {
        // 跳过已失效的作品
        if (!item.viewable) {
          continue
        }
        // 过滤器进行检查
        const filterOpt: FilterOption = {
          id: item.id,
          aiType: Number.parseInt(item.ai_type) as 0 | 1 | 2,
          title: item.title,
          tags: item.tag_a,
          bookmarkCount: item.bookmark_count,
          workType: 3,
          userId: item.user_id,
          xRestrict: Number.parseInt(item.x_restrict) as 0 | 1 | 2,
          isOriginal: item.is_original === '1',
        }

        if (await filter.check(filterOpt)) {
          store.idList.push({
            type: 'novels',
            id: item.id,
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

export { InitNovelMarkerAllPageOnMobile }
