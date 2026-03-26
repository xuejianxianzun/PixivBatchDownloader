// 初始化小说搜索页
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Language'
import { SearchOption } from '../crawl/CrawlArgument'
import { filter, FilterOption } from '../filter/Filter'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { FastScreen } from '../pageFunciton/FastScreen'
import { Tools } from '../Tools'
import { BookmarkAllWorks } from '../pageFunciton/BookmarkAllWorks'
import { Utils } from '../utils/Utils'
import { EVT } from '../EVT'
import { msgBox } from '../MsgBox'
import { crawlTagList } from '../crawlMixedPage/CrawlTagList'
import { states } from '../store/States'
import { Config } from '../Config'
import { setTimeoutWorker } from '../SetTimeoutWorker'
import { vipSearchOptimize } from '../crawl/VipSearchOptimize'
import { settings } from '../setting/Settings'
import { pageType } from '../PageType'
import '../filter/FilterSearchResults'
import { NovelSearchDataItem } from '../crawl/CrawlResult'

// 用于测试抓取的 URL：
// https://www.pixiv.net/tags/%E5%8E%9F%E7%A5%9E/novels?order=date&mode=r18&scd=2025-02-10&ecd=2026-02-10&wlt=20000&wgt=79999&ai_type=1
// https://www.pixiv.net/search?q=%E5%8E%9F%E7%A5%9E&s_mode=tag&type=novel&order=date&mode=r18&scd=2025-02-10&ecd=2026-02-10&wlt=20000&wgt=79999&ai_type=1
// 按系列整合：
// https://www.pixiv.net/search?q=%E3%83%90%E3%83%BC%E3%83%81%E3%83%A3%E3%83%ABYouTuber%201000users%E5%85%A5%E3%82%8A&s_mode=tag_tc&type=novel&gs=1

class InitSearchNovelPage extends InitPageBase {
  constructor() {
    super()
    this.init()
    new FastScreen()
    crawlTagList.init()
  }

  private option: SearchOption = {}
  private readonly worksNoPerPage = 30 // 每个页面有多少个作品
  private needCrawlPageCount = 0 // 一共有有多少个列表页面
  private sendCrawlTaskCount = 0 // 已经抓取了多少个列表页面
  private readonly allOption = [
    'q',
    'order',
    'type',
    'hlt',
    'hgt',
    'ratio',
    'tool',
    's_mode',
    'mode',
    'scd',
    'ecd',
    'blt',
    'bgt',
    'ai_type',

    // 作品的语言，只有小说搜索页面有这个参数
    'work_lang',

    // 字数需要大于这个值，只有小说搜索页面有这个参数
    'tlt',
    // 字数需要小于这个值，只有小说搜索页面有这个参数
    'tgt',

    // 单词数量需要大于这个值
    // 在搜索图像作品时也有这个参数，但含义不同
    'wlt',
    // 单词数量需要小于这个值，只有小说搜索页面有这个参数
    'wgt',

    // 阅读时间需要大于这个值，只有小说搜索页面有这个参数
    'rlt',
    // 阅读时间需要小于这个值，只有小说搜索页面有这个参数
    'rgt',

    // 是否仅限原创作品
    // 无此参数则不限制
    // 1  只显示原创作品
    'original_only',

    // 是否整合相同系列的作品
    // 0 或者无此参数则不整合
    // 1  整合相同系列的作品
    'gs',

    // 是否整合相同作者的作品
    // 0 或者无此参数则不整合
    // 1 按作者整合
    'csw',

    // 是否仅限支持单词置换的作品
    // 无此参数则不限制
    // 1  只显示支持单词置换的作品
    'replaceable_only',
  ]

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_默认下载多页',
      'startCrawling'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })

    this.addStartTimedCrawlBtn(this.readyCrawl.bind(this))
    this.addCancelTimedCrawlBtn()
  }

  private getWorksWrap() {
    // 2026-02-10 改版前的选择器
    let test = document.querySelectorAll('section>div ul')
    if (test.length > 0) {
      return test[test.length - 1] as HTMLUListElement
    }

    // 2026-02-10 改版后的选择器
    let test2 = document.querySelector('div[data-ga4-label="works_content"]')
    return test2 || null
  }

  protected addAnyElement() {
    // 添加收藏本页所有作品的功能
    const bookmarkAllBtn = Tools.addBtn(
      'otherBtns',
      Colors.bgGreen,
      '_收藏本页面的所有作品',
      '',
      'bookmarkAllWorksOnPage'
    )
    const bookmarkAll = new BookmarkAllWorks(bookmarkAllBtn)

    bookmarkAllBtn.addEventListener('click', () => {
      const listWrap = this.getWorksWrap()
      if (listWrap) {
        // 选择作品列表
        // 2026-02-10 改版前的选择器
        let list = document.querySelectorAll(
          'section>div ul>li'
        ) as NodeListOf<HTMLLIElement>

        // 2026-02-10 改版后的选择器
        if (list.length === 0) {
          list = document.querySelectorAll(
            'div[data-ga4-label="works_content"]>div:last-child>div'
          )
        }

        if (list.length > 0) {
          // 整合相同系列的作品时，提示只会收藏单篇小说
          if (window.location.href.includes('gs=1')) {
            log.warning(lang.transl('_提示只会收藏单篇小说'))
          }

          bookmarkAll.sendWorkList(list, 'novels')
        }
      }
    })
  }

  protected initAny() {
    window.addEventListener(EVT.list.crawlTag, this.crawlTag)
  }

  protected destroy() {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')

    window.removeEventListener(EVT.list.crawlTag, this.crawlTag)
  }

  protected async nextStep() {
    this.setSlowCrawl()
    this.initFetchURL()

    if (this.option.gs === '1') {
      log.warning(lang.transl('_启用了整合相同系列小说时的提示'))
    }

    // 计算应该抓取多少页
    const data = await this.getSearchData(1)
    // 计算总页数
    let pageCount = Math.ceil(data.total / this.worksNoPerPage)
    if (pageCount > 1000) {
      // 如果作品页数大于 1000 页，则判断当前用户是否是 pixiv 会员
      const isPremium = Tools.isPremium()
      if (!isPremium) {
        // 如果用户不是会员，则最多只能抓取到 1000 页
        pageCount = 1000
        log.warning(lang.transl('_搜索页面页数限制', pageCount.toString()))
      } else {
        // 如果用户是会员，最多可以抓取到 5000 页
        if (pageCount > 5000) {
          pageCount = 5000
          log.warning(lang.transl('_搜索页面页数限制', pageCount.toString()))
        }
      }
    }

    // 如果当前页面的页码大于有效页码，则不进行抓取
    if (this.startpageNo > pageCount) {
      EVT.fire('crawlComplete')
      EVT.fire('crawlEmpty')

      if (data.total === 0) {
        return msgBox.error(lang.transl('_作品总数为0'))
      }
      return msgBox.error(`${lang.transl('_超出最大页码')} ${pageCount}`)
    }

    if (this.crawlNumber === -1 || this.crawlNumber > pageCount) {
      this.crawlNumber = pageCount
    }

    // 计算从当前页面开始抓取的话，有多少页
    let needFetchPage = pageCount - this.startpageNo + 1
    // 比较用户设置的页数，取较小的那个数值
    this.needCrawlPageCount = Math.min(needFetchPage, this.crawlNumber)

    if (this.needCrawlPageCount === 0) {
      return this.noResult()
    }

    this.getIdList()
  }

  protected getWantPage() {
    this.crawlNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlNumber === -1) {
      log.warning(lang.transl('_抓取所有页面'))
    } else {
      log.warning(
        lang.transl('_从本页开始抓取x页', this.crawlNumber.toString())
      )
    }
  }

  // 获取搜索页的数据。因为有多处使用，所以进行了封装
  private async getSearchData(p: number) {
    let data = await API.getSearchData(store.tag, 'novels', p, this.option)
    return data.body.novel
  }

  // 组织要请求的 url 中的参数
  private initFetchURL() {
    let p = Utils.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    // 从页面 url 中获取可以使用的选项
    this.option = {}
    this.allOption.forEach((param) => {
      let value = Utils.getURLSearchField(location.href, param)
      if (value !== '') {
        this.option[param] = value
      }

      if (param === 's_mode') {
        // url 里的 s_mode 并不是请求时的 s_mode
        // 我也不知道为什么，反正 Pixiv 官方的请求是这样的。我只能照着做
        if (value === 'tag') {
          this.option[param] = 's_tag_only'
        }
        if (value === 'tag_tc') {
          this.option[param] = 's_tag'
        }
        if (value === 'text') {
          this.option[param] = 's_tc'
        }
        if (value === '') {
          this.option[param] = 's_tag_full'
        }
      }
    })

    // 如果 url 里没有显式指定标签匹配模式，则使用 完全一致 模式
    // 因为在这种情况下，pixiv 默认使用的就是 完全一致
    if (!this.option.s_mode) {
      this.option.s_mode = 's_tag_full'
    }

    // 在日志里显示标签匹配模式
    log.log(
      `${lang.transl('_搜索模式')}: ${this.tipSearchMode(this.option.s_mode)}`
    )
  }

  // 注意：同样的 mode，在搜索图片时和搜索小说时可能有不同的含义。所以这个方法不是通用的。
  private tipSearchMode(mode: string) {
    switch (mode) {
      case 's_tag_only':
        return lang.transl('_标签部分一致')
      case 's_tag_full':
        return lang.transl('_标签完全一致')
      case 's_tc':
        return lang.transl('_正文')
      case 's_tag':
        return lang.transl('_标签标题说明文字')
      default:
        return mode
    }
  }

  private delayReTry(p: number) {
    window.setTimeout(() => {
      this.getIdList(p)
    }, Config.retryTime)
  }

  private tipEmptyResult = Utils.debounce(() => {
    if (!settings.slowCrawl) {
      log.log(lang.transl('_提示启用减慢抓取速度功能'))
    }
    log.error(lang.transl('_抓取被限制时返回空结果的提示'))
  }, 1000)

  /** 如果数据是单篇小说，则返回其 id；如果数据是系列小说，返回 undefined */
  private getNovelId(data: NovelSearchDataItem) {
    // 如果未启用“整合系列作品”
    if (data.isOneshot === undefined) {
      return data.id
    }
    // 如果启用了“整合系列作品”，且为单篇小说
    if (data.isOneshot) {
      return data.novelId
    }
    // 如果启用了“整合系列作品”，且为系列小说，则无法返回单篇小说的 id
    return undefined
  }

  // 仅当出错重试时，才会传递参数 p。此时直接使用传入的 p，而不是继续让 p 增加
  protected async getIdList(p?: number): Promise<void> {
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    if (p === undefined) {
      p = this.startpageNo + this.sendCrawlTaskCount
      this.sendCrawlTaskCount++
    }

    // 获取列表页的数据
    let data
    try {
      data = await this.getSearchData(p)

      if (data.total === 0) {
        console.log(`page ${p}: total 0`)
        this.tipEmptyResult()
        return this.delayReTry(p)
      }
    } catch {
      return this.getIdList(p)
    }

    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    const worksData = data.data
    // 注意：由于此时用户启用了“整合系列作品”，所以每项数据可能是单篇完结小说，也可能是系列小说，需要注意区分
    for (const work of worksData) {
      const novelId = this.getNovelId(work)
      const filterOpt: FilterOption = {
        aiType: work.aiType,
        createDate: work.createDate || work.createDateTime,
        id: novelId,
        isOriginal: novelId ? work.isOriginal : null,
        // 只检查单篇小说的收藏数据。系列小说本身没有收藏数据，所以不进行检查。
        // PS：此时系列小说也有 bookmarkData，但其数字不是每篇小说的收藏数量之和，我不清楚这个数字怎么来的
        bookmarkData: novelId ? work.bookmarkData : undefined,
        bookmarkCount: novelId ? work.bookmarkCount : undefined,
        workType: 3,
        // 只检查单篇小说的 tags，如果是系列小说则不检查。因为此时系列数据里的 tags 是它里面第一篇小说的 tags，不能用来对整个系列进行过滤
        tags: novelId ? work.tags : undefined,
        title: novelId ? work.title : undefined,
        seriesTitle: novelId ? undefined : work.title,
        userId: work.userId,
        xRestrict: work.xRestrict,
      }

      if (await filter.check(filterOpt)) {
        // 如果这份数据是单篇小说
        if (novelId) {
          store.idList.push({
            id: novelId,
            type: 'novels',
          })
        } else {
          // 如果是系列小说
          store.idList.push({
            id: work.id,
            type: 'novelSeries',
            title: work.title,
          })
        }
      }
    }

    this.listPageFinished++

    // 每抓取 10 页，取出最后一个作品的 id，检查其是否符合要求
    // 如果不符合要求，就不再抓取剩余列表页
    // 这里使用本页 api 里返回的数据，而非 store.idList 的数据，
    // 因为如果作品被过滤掉了，就不会储存在 store.idList 里
    if (this.listPageFinished > 0 && this.listPageFinished % 10 === 0) {
      if (data.data.length > 0) {
        // console.log(
        //   `已抓取 ${this.listPageFinished} 页，检查最后一个作品的收藏数量`
        // )
        const lastWork = data.data[data.data.length - 1]
        // 如果不是系列小说，才进行这项检查
        // 如果是系列小说，则不进行检查（虽然系列小说的数据里含有最后一篇小说的 id，但不能用于这项检查）
        const novelId = this.getNovelId(lastWork)
        if (novelId) {
          const check = await vipSearchOptimize.checkWork(novelId, 'novels')
          if (check) {
            log.log(lang.transl('_后续作品低于最低收藏数量要求跳过后续作品'))
            log.log(lang.transl('_列表页抓取完成'))
            return this.getIdListFinished()
          }
        }
      }
    }

    log.log(
      '➡️' +
        lang.transl(
          '_列表页抓取进度2',
          this.listPageFinished.toString(),
          this.needCrawlPageCount.toString()
        ),
      'crawlNovelSearchPageListPage'
    )

    if (this.sendCrawlTaskCount + 1 <= this.needCrawlPageCount) {
      // 继续发送抓取任务（+1 是因为 sendCrawlTaskCount 从 0 开始）
      if (states.slowCrawlMode) {
        setTimeoutWorker.set(() => {
          this.getIdList()
        }, settings.slowCrawlDealy)
      } else {
        this.getIdList()
      }
    } else {
      // 抓取任务已经全部发送
      if (this.listPageFinished === this.needCrawlPageCount) {
        // 抓取任务全部完成
        log.log(lang.transl('_列表页抓取完成'))

        // idListWithPageNo.store(pageType.type)

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
    store.resultMeta.sort(Utils.sortByProperty('bmk'))
    store.result.sort(Utils.sortByProperty('bmk'))
  }

  private crawlTag = () => {
    if (states.crawlTagList) {
      this.readyCrawl()
    }
  }
}

export { InitSearchNovelPage }
