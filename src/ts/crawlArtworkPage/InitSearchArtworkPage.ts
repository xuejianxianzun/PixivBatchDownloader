// 初始化 artwork 搜索页
import { InitPageBase } from '../crawl/InitPageBase'
import { lang } from '../Language'
import { DeleteWorks } from './DeleteWorks'
import { EVT } from '../EVT'
import { SearchOption } from '../crawl/CrawlArgument'
import { filter, FilterOption } from '../filter/Filter'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { settings } from '../setting/Settings'
import { FastScreen } from '../pageFunciton/FastScreen'
import { Tools } from '../Tools'
import { BookmarkAllWorks } from '../pageFunciton/BookmarkAllWorks'
import { states } from '../store/States'
import { Utils } from '../utils/Utils'
import { msgBox } from '../MsgBox'
import { crawlTagList } from '../crawlMixedPage/CrawlTagList'
import { pageType } from '../PageType'
import { Config } from '../Config'
import '../pageFunciton/RemoveWorksOfFollowedUsersOnSearchPage'
import { vipSearchOptimize } from '../crawl/VipSearchOptimize'
import '../filter/FilterSearchResults'
import { SearchResultPreview } from './SearchResultPreview'

// 用于测试抓取的 URL：
// 搜索图像作品的两种 URL：
// https://www.pixiv.net/tags/%E5%8E%9F%E7%A5%9E/illustrations?order=date&mode=r18&scd=2025-02-10&ecd=2026-02-10&wlt=3000&hlt=3000&ratio=0.5&tool=Photoshop&ai_type=1&csw=1
// https://www.pixiv.net/search?q=%E5%8E%9F%E7%A5%9E&s_mode=tag&type=illust_ugoira&order=date&mode=r18&scd=2025-02-10&ecd=2026-02-10&wlt=3000&hlt=3000&ratio=0.5&tool=Photoshop&ai_type=1&csw=1

class InitSearchArtworkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  /** 管理搜索页上的批量清除和手动删除操作 */
  private deleteWorks?: DeleteWorks

  /** 管理搜索页面上的抓取结果预览和二次筛选 */
  private readonly searchResultPreview = new SearchResultPreview(() => {
    this.deleteWorks?.exitDeleteMode()
  })

  protected getIdListLogKey = 'crawlArtworkSearchPageListPage'

  private APIPath: 'artworks' | 'illustrations' | 'manga' = 'artworks'
  private option: SearchOption = {}
  private readonly worksNoPerPage = 60 // 每个页面有多少个作品
  private needCrawlPageCount = 0 // 需要抓取多少个列表页面
  private sendCrawlTaskCount = 0 // 发送抓取请求之前会自增，用于计算要抓取的页码。不是请求完成后自增
  private readonly allOption = [
    // 搜索词
    'q',

    // 检索范围，有这些值：
    // tag            标签（部分一致）
    // tag_full       标签（完全一致）
    // tc             标题、说明文字
    // tag_tc         标签、标题、说明文字
    's_mode',

    // 作品类型，有这些值：
    // artwork        插画、漫画、动图（动态插画）
    // illust_ugoira  插画、动图
    // illust         插画
    // manga          漫画
    // ugoira         动图
    // novel          小说
    'type',

    // 排序方式，有这些值：
    // 无             从新到旧
    // date           从旧到新
    // popular_d      按欢迎度倒序排列
    // popular_male_d 受男性欢迎倒序排列
    // popular_female_d 受女性欢迎倒序排列
    'order',

    //  年龄范围，有这些值：
    // all            全部
    // safe           全年龄
    // r18            R-18
    'mode',

    // 起始日期，如 2025-02-10
    'scd',
    // 结束日期，如果无此参数则截止到现在
    'ecd',

    // 宽度需要大于这个值
    'wlt',
    // 宽度需要小于这个值
    'wgt',
    // 高度需要大于这个值
    'hlt',
    // 高度需要小于这个值
    'hgt',

    // 收藏数量需要大于这个值
    'blt',
    // 收藏数量需要小于这个值
    'bgt',

    // 比例
    // 无   所有比例的图片
    // 0.5  横图
    // -0.5 竖图
    // 0    方图
    'ratio',

    // 是否显示 AI 生成作品
    // 0 或者无此参数则显示
    // 1 不显示
    'ai_type',

    // 创作工具，是软件名，例如 Photoshop、SAI 等
    // 无此参数时则不筛选创作工具
    'tool',

    // 是否按作者整合
    // 0 或者无此参数则不整合
    // 1 按作者整合
    'csw',

    // 是否显示可能妨碍搜索的作品
    // 0 或者无此参数则不显示
    // 1 显示
    'dgw',
  ]

  private removeBlockIntervalId = 0 // removeBlockOnHotBar 定时器的 id

  /** 添加搜索页的抓取和结果筛选按钮 */
  protected addCrawlBtns() {
    this.addInitPageBtn(
      'crawlBtns',
      '_开始抓取',
      '_默认下载多页',
      'startCrawling',
      'brand'
    ).addEventListener('click', () => {
      this.searchResultPreview.startCrawl()
      this.readyCrawl()
    })

    this.addStartTimedCrawlBtn(this.readyCrawl.bind(this))
    this.addCancelTimedCrawlBtn()

    crawlTagList.init()

    this.addInitPageBtn(
      'crawlBtns',
      '_在结果中筛选',
      '_在结果中筛选说明',
      'filterResults',
      'brand'
    ).addEventListener('click', () => {
      this.searchResultPreview.filterResults()
    })
  }

  /** 添加搜索页结果的批量操作控件 */
  protected addAnyElement() {
    const deleteWorks = new DeleteWorks(`.${SearchResultPreview.listClass}`)
    this.deleteWorks = deleteWorks

    deleteWorks.addClearMultipleBtn(() => {
      EVT.fire('clearMultiple')
    })

    deleteWorks.addClearUgoiraBtn(() => {
      EVT.fire('clearUgoira')
    })

    deleteWorks.addManuallyDeleteBtn((el: HTMLElement) => {
      EVT.fire('deleteWork', el)
    })

    // 添加收藏本页所有作品的功能
    const bookmarkAllBtn = this.addInitPageBtn(
      'otherBtns',
      '_收藏本页面的所有作品',
      '',
      'bookmarkAllWorksOnSearchPage',
      'brand'
    )
    const bookmarkAll = new BookmarkAllWorks(bookmarkAllBtn)

    bookmarkAllBtn.addEventListener('click', () => {
      const listWrap = this.searchResultPreview.findWorksWrap()
      if (listWrap) {
        let list = listWrap.querySelectorAll<HTMLElement>(
          `li.${SearchResultPreview.listClass}`
        )

        // 原有搜索结果使用 li，新版页面则使用 div
        if (list.length === 0) {
          list = listWrap.querySelectorAll<HTMLElement>('li')
        }

        // 2026-02-10 改版后的选择器
        if (list.length === 0) {
          list = document.querySelectorAll<HTMLElement>(
            'div[data-ga4-label="works_content"]>div:last-child>div'
          )
        }

        // 只将当前页面实际显示的作品加入批量收藏。
        const showList = Array.from(list).filter((el) => {
          return el.style.display !== 'none'
        })

        if (list.length > 0) {
          bookmarkAll.sendWorkList(showList)
        }
      }
    })
  }

  /** 初始化搜索页特有的功能 */
  protected initAny() {
    this.removeBlockOnHotBar()

    new FastScreen()

    window.addEventListener(
      EVT.list.pageSwitchedTypeNotChange,
      this.removeBlockOnHotBar
    )

    this.searchResultPreview.init()

    window.addEventListener(
      EVT.list.crawlComplete,
      this.searchResultPreview.finishCrawl
    )
    window.addEventListener(EVT.list.settingChange, this.onSettingChange)
    window.addEventListener(EVT.list.crawlTag, this.crawlTag)
  }

  /**销毁页面切换后不再适用的元素、定时器和全局事件 */
  protected destroy() {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')

    window.removeEventListener(
      EVT.list.pageSwitchedTypeNotChange,
      this.removeBlockOnHotBar
    )
    window.removeEventListener(
      EVT.list.crawlComplete,
      this.searchResultPreview.finishCrawl
    )
    window.removeEventListener(EVT.list.settingChange, this.onSettingChange)
    window.removeEventListener(EVT.list.crawlTag, this.crawlTag)

    this.deleteWorks?.destroy()
    this.searchResultPreview.destroy()
    window.clearInterval(this.removeBlockIntervalId)
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

  /** 计算搜索结果页数并开始抓取列表 */
  protected async nextStep() {
    if (settings.previewResult && !states.timedCrawlMode) {
      log.warning(
        lang.transl('_提示启用预览搜索页面的筛选结果时不会自动开始下载')
      )
    }

    this.setSlowCrawl()
    this.initFetchURL()

    // 计算应该抓取多少页
    let data
    try {
      data = await this.getSearchData(1)
    } catch {
      EVT.fire('stopCrawl')
      return
    }
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

    this.searchResultPreview.prepareContainer()
  }

  // 初始化 API 里要使用的参数
  private initFetchURL() {
    // 从 URL 中获取发起请求时的分类路径
    let APIPath = 'illustrations'
    const path = location.pathname
    if (path.includes('/tags/')) {
      // 如果是包含 /tags/ 的 URL，分类路径在搜索词后面，例如：
      // https://www.pixiv.net/tags/Fate%2FGrandOrder/illustrations
      // 注意：这里的判断需要用 includes 而不是 startsWith，因为当 Pixiv 的页面语言为英语时， /tags 前面会有 /en
      // /search 前面则始终不会有 /en
      APIPath = path.split('tags/')[1].split('/')[1] ?? 'artworks'
      // 在“顶部”页面的时候，URL 里是没有分类的，会是 undefined，此时使用代表“顶部”的 'artworks'
    } else {
      // 处理以 /search 开头的 URL
      // 在“插画”分类页面里，参数里的 type 并不等同于分类路径。例如 type='illust_ugoira' 对应的路径是 'illustrations'
      // 在漫画、小说分类页面里，使用参数里的 type 即可
      APIPath =
        Utils.getURLSearchField(location.href, 'type') || 'illustrations'
      // 以 /search 开头时，没有“顶部”页面，所以默认值是“插画”页面的 'illustrations'，而不是“顶部”页面的 'artworks'
    }

    switch (APIPath) {
      case 'illustrations':
      case 'illust_ugoira':
      case 'illust_and_ugoira':
      case 'ugoira':
      case 'illust':
        // 插画（含动图）
        this.APIPath = 'illustrations'
        break
      case 'manga':
        // 漫画
        this.APIPath = 'manga'
        break

      default:
        // 顶部
        this.APIPath = 'artworks'
        break
    }

    let p = Utils.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    // 从页面 url 中获取可以使用的选项
    this.option = {}
    this.allOption.forEach((param) => {
      // 这里不获取 q，因为它储存在 store.tag 里，会添加到 API 参数里，不必重复获取
      // 这里不获取 p，因为它储存在 this.startpageNo 里
      if (param !== 'q' && param !== 'p') {
        let value = Utils.getURLSearchField(location.href, param)
        if (value !== '') {
          this.option[param] = value
        }

        if (param === 'type') {
          if (path.startsWith('/search')) {
            // 虽然 URL 里的 type 是 illust_ugoira，但查询时要使用 illust_and_ugoira
            // https://www.pixiv.net/search?q=%E5%8E%9F%E7%A5%9E&s_mode=tag&type=illust_ugoira
            // 我也不知道为什么，反正 Pixiv 官方的请求是这样的
            if (value === 'illust_ugoira') {
              this.option[param] = 'illust_and_ugoira'
            }
          }

          if (path.includes('/tags/')) {
            // https://www.pixiv.net/tags/%E5%8E%9F%E7%A5%9E/illustrations
            // 虽然上面的 URL 里没有 type 参数，但是 pixiv 的查询参数里附带了 type='illust_and_ugoira'
            // 下载器也照样处理一下
            if (value === '') {
              if (path.includes('/illustrations')) {
                this.option[param] = 'illust_and_ugoira'
              }
            }
          }
        }

        // 请求里的 s_mode 也不是 url 里的 s_mode
        if (param === 's_mode') {
          if (path.startsWith('/search')) {
            if (value === 'tag') {
              this.option[param] = 's_tag'
            }
            if (value === '') {
              this.option[param] = 's_tag_full'
            }
            if (value === 'tag_tc') {
              this.option[param] = 's_tag_tc'
            }
            if (value === 'tc') {
              this.option[param] = 's_tc'
            }
          }
        }
      }
    })

    // 如果 url 里没有显式指定标签匹配模式，则使用“完全一致”模式
    if (!this.option.s_mode) {
      // “完全一致”的 API 参数使用 s_tag_full 或 tag_full 都可以，但 s_tag_full 更严格，作品数量更少一些
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
      case 's_tag':
      case 'tag':
        return lang.transl('_标签部分一致')
      case 's_tag_full':
      case 'tag_full':
        return lang.transl('_标签完全一致')
      case 's_tc':
        return lang.transl('_标题说明文字')
      case 'tag_tc':
        return lang.transl('_标签标题说明文字')
      default:
        return mode
    }
  }

  /** 获取某一页的数据 */
  private async getSearchData(p: number) {
    let data = await API.getSearchData(store.tag, this.APIPath, p, this.option)
    // 如果请求出错，由调用方自行 catch 错误信息
    // 这里只检查请求成功后是否含有需要的数据
    const result = data.body.illust || data.body.illustManga || data.body.manga
    if (!result) {
      const msg = `No valid search data in API response for page ${p}`
      log.error(msg)
      throw new Error(msg)
    }
    return result
  }

  private async delayReTry(p: number) {
    log.error(lang.transl('_下载器会在几分钟后重试'))
    await Utils.sleep(Config.retryTime)
    this.getIdList(p)
  }

  private tipEmptyResult = Utils.debounce(() => {
    log.error(lang.transl('_抓取被限制时返回空结果的提示'))
    if (!settings.slowCrawl) {
      log.log(lang.transl('_提示启用减慢抓取速度功能'))
    }
  }, 1000)

  /**获取作品 id 列表（列表页数据） */
  // 仅当出错重试时，才会传递参数 p。此时直接使用传入的 p，而不是继续让 p 增加
  protected async getIdList(p?: number): Promise<void> {
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

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
      return this.delayReTry(p)
    }

    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    const worksData = data.data

    for (const work of worksData) {
      // 排除广告信息
      if (work.isAdContainer) {
        continue
      }

      const filterOpt: FilterOption = {
        aiType: work.aiType,
        createDate: work.createDate,
        id: work.id,
        isOriginal: work.isOriginal,
        width: work.pageCount === 1 ? work.width : 0,
        height: work.pageCount === 1 ? work.height : 0,
        pageCount: work.pageCount,
        bookmarkData: work.bookmarkData,
        workType: work.illustType,
        tags: work.tags,
        title: work.title,
        userId: work.userId,
        xRestrict: work.xRestrict,
      }

      if (await filter.check(filterOpt)) {
        store.idList.push({
          id: work.id,
          type: Tools.getWorkTypeString(work.illustType),
        })

        // idListWithPageNo.add(
        //   pageType.type,
        //   {
        //     type: Tools.getWorkTypeString(work.illustType),
        //     id: work.id,
        //   },
        //   p
        // )
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
        const check = await vipSearchOptimize.checkWork(lastWork.id, 'illusts')
        if (check) {
          log.log(lang.transl('_后续作品低于最低收藏数量要求跳过后续作品'))
          log.log(lang.transl('_列表页抓取完成'))
          return this.getIdListFinished()
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
      this.getIdListLogKey
    )

    if (this.sendCrawlTaskCount + 1 <= this.needCrawlPageCount) {
      // 继续发送抓取任务（+1 是因为 sendCrawlTaskCount 从 0 开始）
      if (states.slowCrawlMode) {
        await Utils.sleep(settings.slowCrawlDealy)
      }
      this.getIdList()
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

  // 去除覆盖在热门作品上面的会员购买链接
  private removeBlockOnHotBar() {
    // 需要重复执行，因为这个链接会生成不止一次
    // 清除可能存在的旧定时器，避免多个定时器叠加
    window.clearInterval(this.removeBlockIntervalId)
    this.removeBlockIntervalId = window.setInterval(() => {
      if (pageType.type !== pageType.list.ArtworkSearch) {
        return
      }

      // 移除覆盖在整个热门作品区域上的会员购买链接
      const hotWorksLink = document.querySelectorAll('a[href^="/premium/lead"]')
      hotWorksLink.forEach((link) => link.remove())

      // 移除热门作品列表右侧的提示购买会员的文字
      const workSpanList = document.querySelectorAll(
        'aside ul span[data-gtm-value]'
      ) as NodeListOf<HTMLSpanElement>
      if (workSpanList.length > 0) {
        // aside 元素的直接子元素有 iframe ul div button 元素，只需要保留 ul
        const aside = workSpanList[0].closest('aside')
        if (aside) {
          ;[...aside.children].forEach((el) => {
            if (el.nodeName !== 'UL') {
              el.remove()
            }
          })
        }

        // 每个缩略图元素里没有超链接，所以无法点击。为它们添加超链接
        workSpanList.forEach((span) => {
          if (span.dataset.addLink !== '1') {
            span.dataset.addLink = '1'
            const id = span.dataset.gtmValue
            if (id) {
              // 把 a 标签放到一个 div 元素里，让 ArtworkThumbnail 可以通过查找子元素来查找到它
              const div = document.createElement('div')
              const a = document.createElement('a')
              a.href = `https://www.pixiv.net/artworks/${id}`
              a.target = '_blank'
              a.classList.add('hotBarWorkLink')
              div.append(a)
              // 把 span 里原有的子元素都移动到 a 标签里
              ;[...span.children].forEach((el) => {
                if (el.nodeName !== 'A') {
                  a.appendChild(el)
                }
              })
              span.insertAdjacentElement('afterbegin', div)
            }
          }
        })
      }
    }, 300)
  }

  private crawlTag = () => {
    if (states.crawlTagList) {
      this.readyCrawl()
    }
  }

  /** 将抓取结果相关的设置变更交给预览模块处理 */
  private onSettingChange = (event: CustomEventInit) => {
    this.searchResultPreview.refreshResults(event)
  }
}

export { InitSearchArtworkPage }
