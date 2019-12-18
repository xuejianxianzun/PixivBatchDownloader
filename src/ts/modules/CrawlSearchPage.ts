// 抓取搜索页
import { CrawlPageBase } from './CrawlPageBase'
import { SearchOption } from './CrawlArgument.d'
import { FilterOption } from './Filter.d'
import { filter } from './Filter'
import { lang } from './Lang'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'
import { pageInfo } from './PageInfo'

class CrawlSearchPage extends CrawlPageBase {
  private worksType = ''
  private option: SearchOption = {}
  private readonly worksNoPerPage = 60 // 每个页面有多少个作品
  private needCrawlPageCount = 0 // 一共有有多少个列表页面
  private sendCrawlTaskCount = 0 // 已经抓取了多少个列表页面
  private readonly allOption = [
    'order',
    'type',
    'wlt',
    'hlt',
    'ratio',
    'tool',
    's_mode',
    'mode',
    'scd',
    'ecd',
    'blt',
    'bgt'
  ]

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_checkWantPageRule1Arg6'),
      lang.transl('_checkWantPageRule1Arg7')
    )

    if (this.crawlNumber === -1 || this.crawlNumber > this.maxCount) {
      this.crawlNumber = this.maxCount
    }
  }

  // 获取搜索页的数据。因为有多处使用，所以进行了封装
  private async getSearchData(p: number) {
    let data = await API.getSearchData(
      pageInfo.getPageTag,
      this.worksType,
      p,
      this.option
    )
    return data.body.illust || data.body.illustManga || data.body.manga
  }

  protected async nextStep() {
    this.initFetchURL()

    this.needCrawlPageCount = await this.calcNeedCrawlPageCount()

    if (this.needCrawlPageCount === 0) {
      return this.noResult()
    }

    this.startGetIdList()
  }

  // 组织要请求的 url 中的参数
  private initFetchURL() {
    // 从 URL 中获取分类。网址中可能有语言标识。
    /*
    https://www.pixiv.net/tags/Fate%2FGrandOrder/illustrations
    https://www.pixiv.net/en/tags/Fate%2FGrandOrder/illustrations
    */
    let URLType = location.pathname.split('tags/')[1].split('/')[1]
    // 但在“顶部”页面的时候是没有分类的，会是 undefined
    if (URLType === undefined) {
      URLType = ''
    }

    switch (URLType) {
      case '':
        this.worksType = 'artworks'
        break
      case 'illustrations':
      case 'illust_and_ugoira':
      case 'ugoira':
      case 'illust':
        this.worksType = 'illustrations'
        break
      case 'manga':
        this.worksType = 'manga'
        break

      default:
        this.worksType = 'artworks'
        break
    }

    let p = API.getURLField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    // 从页面 url 中获取可以使用的选项
    this.option = {}
    this.allOption.forEach(param => {
      let value = API.getURLField(location.href, param)
      if (value !== '') {
        this.option[param] = value
      }
    })
  }

  // 计算应该抓取多少页
  private async calcNeedCrawlPageCount() {
    let data = await this.getSearchData(1)
    // 计算总页数
    let pageCount = Math.ceil(data.total / this.worksNoPerPage)
    if (pageCount > this.maxCount) {
      // 最大为 1000
      pageCount = this.maxCount
    }
    // 计算从本页开始抓取的话，有多少页
    let needFetchPage = pageCount - this.startpageNo + 1
    // 比较用户设置的页数，取较小的那个数值
    if (needFetchPage < this.crawlNumber) {
      return needFetchPage
    } else {
      return this.crawlNumber
    }
  }

  // 计算页数之后，准备建立并发抓取线程
  private startGetIdList() {
    if (this.needCrawlPageCount <= this.ajaxThreadsDefault) {
      this.ajaxThreads = this.needCrawlPageCount
    } else {
      this.ajaxThreads = this.ajaxThreadsDefault
    }

    for (let i = 0; i < this.ajaxThreads; i++) {
      this.getIdList()
    }
  }

  protected async getIdList() {
    let p = this.startpageNo + this.sendCrawlTaskCount

    this.sendCrawlTaskCount++

    // 发起请求，获取列表页
    let data
    try {
      data = await this.getSearchData(p)
    } catch {
      this.getIdList()
      return
    }

    data = data.data

    for (const nowData of data) {
      // 排除广告信息
      if (nowData.isAdContainer) {
        continue
      }

      const filterOpt: FilterOption = {
        width: nowData.width,
        height: nowData.height,
        pageCount: nowData.pageCount,
        bookmarkData: nowData.bookmarkData,
        illustType: nowData.illustType,
        tags: nowData.tags
      }

      if (filter.check(filterOpt)) {
        store.idList.push(nowData.illustId)
      }
    }

    this.listPageFinished++

    log.log(
      lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
      1,
      false
    )

    if (this.sendCrawlTaskCount + 1 <= this.needCrawlPageCount) {
      // 继续发送抓取任务（+1 是因为 sendCrawlTaskCount 从 0 开始）
      this.getIdList()
    } else {
      // 抓取任务已经全部发送
      if (this.listPageFinished === this.needCrawlPageCount) {
        // 抓取任务全部完成
        log.log(lang.transl('_列表页抓取完成'))
        this.getIdListFinished()
      }
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
    this.sendCrawlTaskCount = 0
  }

  // 搜索页把下载任务按收藏数从高到低下载
  protected sortResult() {
    store.result.sort(API.sortByProperty('bmk'))
  }
}
export { CrawlSearchPage }
