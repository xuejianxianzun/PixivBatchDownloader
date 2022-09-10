// 初始化小说搜索页
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { SearchOption } from '../crawl/CrawlArgument'
import { filter, FilterOption } from '../filter/Filter'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { FastScreen } from '../pageFunciton/FastScreen'
import { Tools } from '../Tools'
import { BookmarkAllWorks } from '../pageFunciton/BookmarkAllWorks'
import { Utils } from '../utils/Utils'
import { idListWithPageNo } from '../store/IdListWithPageNo'
import { EVT } from '../EVT'
import { msgBox } from '../MsgBox'
import { crawlTagList } from '../crawlMixedPage/CrawlTagList'
import { states } from '../store/States'
import { pageType } from '../PageType'
import { Config } from '../Config'
import { setTimeoutWorker } from '../SetTimeoutWorker'

class InitSearchNovelPage extends InitPageBase {
  constructor() {
    super()
    this.init()
    new FastScreen()
    crawlTagList.init()
  }

  private readonly worksWrapSelector = '#root section>div>ul'

  private option: SearchOption = {}
  private readonly worksNoPerPage = 24 // 每个页面有多少个作品
  private needCrawlPageCount = 0 // 一共有有多少个列表页面
  private sendCrawlTaskCount = 0 // 已经抓取了多少个列表页面
  private readonly allOption = [
    'order',
    'type',
    'wlt',
    'wgt',
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
    'tlt',
    'tgt',
    'original_only',
    'work_lang',
  ]

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_默认下载多页'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })

    this.addStartTimedCrawlBtn(this.readyCrawl.bind(this))
    this.addCancelTimedCrawlBtn()
  }

  private getWorksWrap() {
    const test = document.querySelectorAll(this.worksWrapSelector)
    if (test.length > 0) {
      // 小说页面用这个选择器，只匹配到了一个 ul
      return test[test.length - 1] as HTMLUListElement
    }
    return null
  }

  protected addAnyElement() {
    // 添加收藏本页所有作品的功能
    const bookmarkAllBtn = Tools.addBtn(
      'otherBtns',
      Colors.bgGreen,
      '_收藏本页面的所有作品'
    )
    const bookmarkAll = new BookmarkAllWorks(bookmarkAllBtn)

    bookmarkAllBtn.addEventListener('click', () => {
      const listWrap = this.getWorksWrap()
      if (listWrap) {
        const list = document.querySelectorAll(
          '#root section>div>ul>li'
        ) as NodeListOf<HTMLLIElement>
        const showList = Array.from(list).filter((el) => {
          return el.style.display !== 'none'
        })
        bookmarkAll.sendWorkList(showList)
      }
    })
  }

  protected setFormOption() {
    const isPremium = Tools.isPremium()
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: '_抓取多少页面',
      tip: '_从本页开始下载提示',
      rangTip: `1 - ${isPremium ? 5000 : 1000}`,
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
      EVT.fire('crawlFinish')
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
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_从本页开始下载x页'),
      lang.transl('_下载所有页面')
    )
  }

  // 获取搜索页的数据。因为有多处使用，所以进行了封装
  private async getSearchData(p: number) {
    let data = await API.getNovelSearchData(store.tag, p, this.option)
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
    })

    // 抓取时始终关闭“以系列为单位显示”
    this.option.gs = '0'

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
    }, Config.retryTimer)
    // 限制时间大约是 3 分钟，这里为了保险起见，设置了更大的延迟时间。
  }

  private tipEmptyResult = Utils.debounce(() => {
    log.error(lang.transl('_抓取被限制时返回空结果的提示'))
  }, 1000)

  // 仅当出错重试时，才会传递参数 p。此时直接使用传入的 p，而不是继续让 p 增加
  protected async getIdList(p?: number): Promise<void> {
    if (p === undefined) {
      p = this.startpageNo + this.sendCrawlTaskCount
      this.sendCrawlTaskCount++
    }

    // 发起请求，获取列表页
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

    data = data.data
    for (const nowData of data) {
      const filterOpt: FilterOption = {
        createDate: nowData.createDate,
        id: nowData.id,
        bookmarkData: nowData.bookmarkData,
        bookmarkCount: nowData.bookmarkCount,
        workType: 3,
        tags: nowData.tags,
        userId: nowData.userId,
        xRestrict: nowData.xRestrict,
      }

      if (await filter.check(filterOpt)) {
        idListWithPageNo.add(
          pageType.type,
          {
            type: 'novels',
            id: nowData.id,
          },
          p
        )
      }
    }

    this.listPageFinished++

    log.log(
      lang.transl(
        '_列表页抓取进度2',
        this.listPageFinished.toString(),
        this.needCrawlPageCount.toString()
      ),
      1,
      false
    )

    if (this.sendCrawlTaskCount + 1 <= this.needCrawlPageCount) {
      // 继续发送抓取任务（+1 是因为 sendCrawlTaskCount 从 0 开始）
      if (states.slowCrawlMode) {
        setTimeoutWorker.set(() => {
          this.getIdList()
        }, Config.slowCrawlDealy)
      } else {
        this.getIdList()
      }
    } else {
      // 抓取任务已经全部发送
      if (this.listPageFinished === this.needCrawlPageCount) {
        // 抓取任务全部完成
        log.log(lang.transl('_列表页抓取完成'))

        idListWithPageNo.store(pageType.type)

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
