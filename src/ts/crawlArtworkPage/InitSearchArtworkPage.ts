// 初始化 artwork 搜索页
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { DeleteWorks } from '../pageFunciton/DeleteWorks'
import { EVT } from '../EVT'
import { SearchOption } from '../crawl/CrawlArgument'
import { filter, FilterOption } from '../filter/Filter'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { Result } from '../store/StoreType'
import { settings } from '../setting/Settings'
import { FastScreen } from '../pageFunciton/FastScreen'
import { Tools } from '../Tools'
import { BookmarkAllWorks } from '../pageFunciton/BookmarkAllWorks'
import { states } from '../store/States'
import { Utils } from '../utils/Utils'
import { idListWithPageNo } from '../store/IdListWithPageNo'
import { toast } from '../Toast'
import { msgBox } from '../MsgBox'
import { bookmark } from '../Bookmark'
import { crawlTagList } from '../crawlMixedPage/CrawlTagList'
import { pageType } from '../PageType'
import { Config } from '../Config'
import { downloadOnClickBookmark } from '../download/DownloadOnClickBookmark'
import { setTimeoutWorker } from '../SetTimeoutWorker'

type AddBMKData = {
  id: number
  tags: string[]
  el: Element
}

type FilterCB = (value: Result) => unknown

class InitSearchArtworkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private readonly worksWrapSelector = '#root section ul'
  private readonly listClass = 'searchList'
  private readonly multipleClass = 'multiplePart'
  private readonly ugoiraClass = 'ugoiraPart'
  private readonly addBMKBtnClass = 'bmkBtn'
  private readonly bookmarkedClass = 'bookmarked'
  private readonly countSelector = 'section h3+div span'
  private countEl?: HTMLElement

  private worksType = ''
  private option: SearchOption = {}
  private readonly worksNoPerPage = 60 // 每个页面有多少个作品
  private needCrawlPageCount = 0 // 需要抓取多少个列表页面
  private sendCrawlTaskCount = 0 // 发送抓取请求之前会自增，用于计算要抓取的页码。不是请求完成后自增
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
    'work_lang',
  ]

  private resultMeta: Result[] = [] // 每次“开始筛选”完成后，储存当时所有结果，以备“在结果中筛选”使用

  private worksWrap: HTMLUListElement | null = null

  private deleteId = 0 // 手动删除时，要删除的作品的 id

  private causeResultChange = ['firstFewImagesSwitch', 'firstFewImages'] // 这些选项变更时，可能会导致结果改变。但是过滤器 filter 不会检查，所以需要单独检测它的变更，手动处理

  private crawlStartBySelf = false // 这次抓取是否是由当前页面的“开始抓取”按钮发起的

  private previewCount = 0 // 共显示了多少个作品的预览图
  private showPreviewLimitTip = false // 当预览数量达到上限时显示一次提示

  // 储存预览搜索结果的元素
  private workPreviewBuffer = document.createDocumentFragment()

  protected setFormOption() {
    const isPremium = Tools.isPremium()
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: '_抓取多少页面',
      tip: '_从本页开始下载提示',
      rangTip: `1 - ${isPremium ? 5000 : 1000}`,
    })
  }

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_默认下载多页'
    ).addEventListener('click', () => {
      this.resultMeta = []
      this.crawlStartBySelf = true

      window.addEventListener(EVT.list.addResult, this.createPreview)
      this.readyCrawl()
    })

    this.addStartTimedCrawlBtn(this.readyCrawl.bind(this))
    this.addCancelTimedCrawlBtn()

    crawlTagList.init()

    Tools.addBtn(
      'crawlBtns',
      Colors.bgGreen,
      '_在结果中筛选',
      '_在结果中筛选说明'
    ).addEventListener('click', () => {
      this.screenInResult()
    })
  }

  protected addAnyElement() {
    const deleteWorks = new DeleteWorks(`.${this.listClass}`)

    deleteWorks.addClearMultipleBtn(`.${this.multipleClass}`, () => {
      EVT.fire('clearMultiple')
    })

    deleteWorks.addClearUgoiraBtn(`.${this.ugoiraClass}`, () => {
      EVT.fire('clearUgoira')
    })

    deleteWorks.addManuallyDeleteBtn((el: HTMLElement) => {
      EVT.fire('deleteWork', el)
    })

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
        const list = listWrap.querySelectorAll('li')
        // 被二次筛选过滤掉的作品会被隐藏，所以批量添加收藏时，过滤掉隐藏的作品
        const showList = Array.from(list).filter((el) => {
          return el.style.display !== 'none'
        })
        bookmarkAll.sendWorkList(showList)
      }
    })
  }

  protected initAny() {
    this.removeBlockOnHotBar()

    new FastScreen()

    window.addEventListener(
      EVT.list.pageSwitchedTypeNotChange,
      this.removeBlockOnHotBar
    )

    window.addEventListener(EVT.list.addResult, this.showCount)

    window.addEventListener('addBMK', this.addBookmark)

    window.addEventListener(EVT.list.crawlComplete, this.onCrawlFinish)

    window.addEventListener(EVT.list.clearMultiple, this.clearMultiple)

    window.addEventListener(EVT.list.clearUgoira, this.clearUgoira)

    window.addEventListener(EVT.list.deleteWork, this.deleteWork)

    window.addEventListener(EVT.list.settingChange, this.onSettingChange)

    window.addEventListener(EVT.list.crawlTag, this.crawlTag)

    // 定期将缓冲中的预览作品元素添加到页面上
    window.setInterval(() => {
      this.showPreview()
    }, 1000)
  }

  private showPreview() {
    if (this.workPreviewBuffer.firstChild && this.worksWrap) {
      this.worksWrap.appendChild(this.workPreviewBuffer)
    }
  }

  protected destroy() {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')

    window.removeEventListener(EVT.list.addResult, this.showCount)
    window.removeEventListener(EVT.list.crawlComplete, this.onCrawlFinish)
    window.removeEventListener(EVT.list.settingChange, this.onSettingChange)
    window.removeEventListener(EVT.list.crawlTag, this.crawlTag)
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_从本页开始下载x页'),
      lang.transl('_下载所有页面')
    )
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

    this.clearPreview()

    this.countEl = document.querySelector(this.countSelector) as HTMLElement
  }

  // 组织要请求的 url 中的参数
  private initFetchURL() {
    // 从 URL 中获取分类。可能有语言标识。
    /*
    https://www.pixiv.net/tags/Fate%2FGrandOrder/illustrations
    https://www.pixiv.net/en/tags/Fate%2FGrandOrder/illustrations
    */
    const URLType = location.pathname.split('tags/')[1].split('/')[1] ?? ''
    // 在“顶部”页面的时候是没有分类的，会是 undefined，此时使用空字符串

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
      case 's_tag':
        return lang.transl('_标签部分一致')
      case 's_tag_full':
        return lang.transl('_标签完全一致')
      case 's_tc':
        return lang.transl('_标题说明文字')
      default:
        return mode
    }
  }

  // 获取搜索页的数据。因为有多处使用，所以进行了封装
  private async getSearchData(p: number) {
    let data = await API.getSearchData(
      store.tag,
      this.worksType,
      p,
      this.option
    )
    return data.body.illust || data.body.illustManga || data.body.manga
  }

  private delayReTry(p: number) {
    window.setTimeout(() => {
      this.getIdList(p)
    }, Config.retryTime)
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
      // 排除广告信息
      if (nowData.isAdContainer) {
        continue
      }

      const filterOpt: FilterOption = {
        createDate: nowData.createDate,
        id: nowData.id,
        width: nowData.pageCount === 1 ? nowData.width : 0,
        height: nowData.pageCount === 1 ? nowData.height : 0,
        pageCount: nowData.pageCount,
        bookmarkData: nowData.bookmarkData,
        workType: nowData.illustType,
        tags: nowData.tags,
        userId: nowData.userId,
        xRestrict: nowData.xRestrict,
      }

      if (await filter.check(filterOpt)) {
        idListWithPageNo.add(
          pageType.type,
          {
            type: Tools.getWorkTypeString(nowData.illustType),
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

  private onSettingChange = (event: CustomEventInit) => {
    if (states.crawlTagList) {
      return
    }
    const data = event.detail.data
    if (this.causeResultChange.includes(data.name)) {
      if (store.result.length > 0) {
        this.reAddResult()
        EVT.fire('resultChange')
      }
    }
  }

  // 抓取完成后，保存结果的元数据，并重新添加抓取结果
  private onCrawlFinish = () => {
    // 有些操作也会触发抓取完毕的事件，但不应该调整搜索页面的结果。
    if (states.crawlTagList || states.quickCrawl) {
      return
    }
    if (!this.crawlStartBySelf) {
      return
    }

    this.resultMeta = [...store.resultMeta]

    // 在搜索页面抓取完毕之后，作品数据会按照收藏数量排序。所以这里需要清空之前的预览，重新生成预览
    this.clearPreview()
    this.reAddResult()
    this.showPreview()

    // 解绑创建作品元素的事件
    window.removeEventListener(EVT.list.addResult, this.createPreview)

    this.crawlStartBySelf = false

    setTimeout(() => {
      EVT.fire('worksUpdate')
    }, 0)
  }

  // 返回包含作品列表的 ul 元素
  private getWorksWrap() {
    const test = document.querySelectorAll(this.worksWrapSelector)
    if (test.length > 0) {
      if (test.length > 2) {
        // 大于 2 的情况是在搜索页的首页，或者小说页面
        return test[2] as HTMLUListElement
      }

      // 在插画、漫画、artworks 页面只有两个 ul 或者一个
      return test[test.length - 1] as HTMLUListElement
    }
    return null
  }

  // 显示抓取到的作品数量
  private showCount = () => {
    if (states.crawlTagList || !settings.previewResult) {
      return
    }

    if (settings.previewResult && this.countEl) {
      const count = this.resultMeta.length || store.resultMeta.length
      this.countEl.textContent = count.toString()
    }
  }

  // 生成抓取结果对应的作品元素
  private createPreview = (event: CustomEventInit) => {
    if (states.crawlTagList) {
      return
    }
    if (!settings.previewResult || !this.worksWrap) {
      return
    }

    // 检查显示的预览数量是否达到上限
    if (this.previewCount >= settings.previewResultLimit) {
      if (!this.showPreviewLimitTip) {
        const msg = lang.transl('_预览搜索结果的数量达到上限的提示')
        log.warning(msg)
        msgBox.warning(msg)
        this.showPreviewLimitTip = true
      }
      return
    }
    this.previewCount++

    const data = event.detail.data as Result

    let r18Text = ''
    if (data.xRestrict === 1) {
      r18Text = 'R-18'
    }
    if (data.xRestrict === 2) {
      r18Text = 'R-18G'
    }

    let r18HTML = r18Text
      ? `
      <div class="r18Part">
        <div class="child">
          <div class="text">${r18Text}</div>
        </div>
      </div>`
      : ''

    let multipleHTML = ''
    if (data.pageCount > 1) {
      multipleHTML = `
        <div class="${this.multipleClass}">
          <div class="child">
            <span class="span1">
              <span class="span2">
              <svg viewBox="0 0 9 10" size="9" class="multipleSvg">
                <path d="M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10
                C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1
                C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8
                0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z" transform=""></path>
                </svg>
              </span>
            </span>
            <span>${data.pageCount}</span>
          </div>  
        </div>`
    }

    let ugoiraHTML = ''
    if (data.ugoiraInfo) {
      ugoiraHTML = `
        <svg viewBox="0 0 24 24" class="${this.ugoiraClass}" style="width: 48px; height: 48px;">
        <circle cx="12" cy="12" r="10" class="ugoiraCircle"></circle>
          <path d="M9,8.74841664 L9,15.2515834 C9,15.8038681 9.44771525,16.2515834 10,16.2515834
              C10.1782928,16.2515834 10.3533435,16.2039156 10.5070201,16.1135176 L16.0347118,12.8619342
              C16.510745,12.5819147 16.6696454,11.969013 16.3896259,11.4929799
              C16.3034179,11.3464262 16.1812655,11.2242738 16.0347118,11.1380658 L10.5070201,7.88648243
              C10.030987,7.60646294 9.41808527,7.76536339 9.13806578,8.24139652
              C9.04766776,8.39507316 9,8.57012386 9,8.74841664 Z"></path>
        </svg>`
    }

    // 添加收藏的作品，让收藏图标变红
    const bookmarkedFlag = data.bookmarked ? this.bookmarkedClass : ''

    const html = `
    <div class="searchContent">
      <div class="searchImgArea">
        <div width="184" height="184" class="searchImgAreaContent">
          <a target="_blank" class="imgAreaLink" href="/artworks/${data.idNum}">
            <!--顶部横幅-->
            <div class="topbar">

            <!--R-18 标记-->
            ${r18HTML}

            <!--多图作品标记-->
            ${multipleHTML}
              
            </div>
            <!--图片部分-->
            <div class="imgWrap">
            <img src="${
              settings.replaceSquareThumb
                ? Tools.convertThumbURLTo540px(data.thumb)
                : data.thumb
            }" alt="${
      data.title
    }" style="object-fit: contain; object-position: center center;">
              <!-- 动图 svg -->
              ${ugoiraHTML}
              </div>
          </a>
          <!--添加显示收藏数-->
          <div class="bmkCount">${data.bmk}</div>
          <!--收藏按钮-->
          <div class="bmkBtnWrap">
            <div class="">
            <button type="button" class="${this.addBMKBtnClass}">
            <svg viewBox="0 0 1024 1024" width="32" height="32" class="bmkBtnSvg ${bookmarkedFlag}">
            <path d="M958.733019 411.348626 659.258367 353.59527 511.998465 85.535095 364.741633 353.59527 65.265958 411.348626 273.72878 634.744555 235.88794 938.463881 511.998465 808.479435 788.091594 938.463881 750.250754 634.744555Z" p-id="1106" class="path2"></path>
            <path d="M959.008 406.016l-308-47.008L512 64 372.992 359.008l-308 47.008 223.008 228-52.992 324L512 805.024l276.992 152.992-52.992-324zM512 740L304 856.992l40-235.008-179.008-182.016 242.016-32 104.992-224 104 224 240.992 34.016L680 622.976l36.992 235.008z" p-id="919"></path>
            </svg>
            </button>
            </div>
          </div>
        <!--收藏按钮结束-->
        </div>
      </div>
      <!--标题名-->
      <a target="_blank" class="titleLink" href="/artworks/${data.idNum}">${
      data.title
    }</a>
      <!--底部-->
      <div class="bottomBar">
      <!--作者信息-->
      <div class="userInfo">
          <a target="_blank" href="/users/${data.userId}">
            <div class="userName">${data.user}</div>
          </a>
        </div>
      </div>
    </div>
    `
    // 相比 pixiv 原本的作品预览区域，这里去掉了作者头像的部分，因为抓取到的数据里没有作者头像。

    // 生成预览元素
    const li = document.createElement('li')
    li.classList.add(this.listClass)
    li.dataset.id = data.idNum.toString()
    li.innerHTML = html

    // 绑定收藏按钮的事件
    const addBMKBtn = li!.querySelector(
      `.${this.addBMKBtnClass}`
    ) as HTMLButtonElement
    const bookmarkedClass = this.bookmarkedClass
    addBMKBtn.addEventListener('click', function () {
      // 添加收藏
      const e = new CustomEvent('addBMK', {
        detail: { data: { id: data.idNum, tags: data.tags, el: addBMKBtn } },
      })
      window.dispatchEvent(e)

      // 下载这个作品
      downloadOnClickBookmark.send(data.idNum.toString())
    })

    // 添加到缓冲中
    this.workPreviewBuffer.append(li)
  }

  // 清空预览作品的列表，在开始抓取时和作品抓取完毕时使用
  private clearPreview() {
    if (!settings.previewResult || !this.crawlStartBySelf) {
      return
    }
    this.worksWrap = this.getWorksWrap()
    if (this.worksWrap) {
      this.worksWrap.innerHTML = ''
    }
    // 同时重置一些变量
    this.previewCount = 0
    this.showPreviewLimitTip = false
    this.workPreviewBuffer = document.createDocumentFragment()
  }

  // 传递作品 id 列表，从页面上的作品列表里移除这些作品
  private removeWorks(idList: string[]) {
    // #root section ul .searchList
    const listSelector = `${this.worksWrapSelector} .${this.listClass}`
    const lists = document.querySelectorAll(
      listSelector
    ) as NodeListOf<HTMLLIElement>
    for (const li of lists) {
      if (li.dataset.id && idList.includes(li.dataset.id)) {
        li.style.display = 'none'
        // li.remove()
        // 推测隐藏元素可以更快的重绘好页面，因为删除元素修改了 dom 结构，花的时间可能会多一些
      }
    }
  }

  // 筛选抓取结果。传入函数，过滤符合条件的结果
  // 在抓取完成之后，所有会从结果合集中删除某些结果的操作都要经过这里
  private async filterResult(callback: FilterCB) {
    if (this.resultMeta.length === 0) {
      toast.error(lang.transl('_没有可用的抓取结果'))
      return
    }

    const beforeLength = this.resultMeta.length // 储存过滤前的结果数量
    const resultMetaTemp: Result[] = []
    const resultMetaRemoved: Result[] = []

    for (const meta of this.resultMeta) {
      if (await callback(meta)) {
        resultMetaTemp.push(meta)
      } else {
        resultMetaRemoved.push(meta)
      }
    }

    this.resultMeta = resultMetaTemp

    // 如果过滤后，作品元数据发生了改变则重排作品
    if (this.resultMeta.length !== beforeLength) {
      let ids: string[] = []
      for (const result of resultMetaRemoved) {
        ids.push(result.idNum.toString())
      }
      this.removeWorks(ids)
      this.reAddResult()
    }

    EVT.fire('resultChange')
  }

  // 重新添加抓取结果，执行时机：
  // 1 作品抓取完毕之后，添加抓取到的数据
  // 2 使用“在结果中筛选”或删除作品，使得作品数据变化了，改变作品列表视图
  // 3 修改了“多图下载设置”，导致作品数据变化
  private reAddResult() {
    store.reset()

    // store.addResult 会触发 addResult 事件，让本模块生成对应作品的预览，并显示作品数量
    for (let data of this.resultMeta) {
      store.addResult(data)
    }

    // showCount 依赖 addResult 事件，但如果清空了所有结果，则不会触发 addResult 事件，所以需要手动调用它
    if (this.resultMeta.length === 0) {
      this.showCount()
    }
  }

  // 在当前结果中再次筛选，会修改第一次筛选的结果
  private screenInResult() {
    if (states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    this.getMultipleSetting()

    this.filterResult((data) => {
      const filterOpt: FilterOption = {
        id: data.id,
        workType: data.type,
        pageCount: data.pageCount,
        tags: data.tags,
        bookmarkCount: data.bmk,
        bookmarkData: data.bookmarked,
        width: data.pageCount === 1 ? data.fullWidth : 0,
        height: data.pageCount === 1 ? data.fullHeight : 0,
        createDate: data.date,
        userId: data.userId,
        xRestrict: data.xRestrict,
      }

      return filter.check(filterOpt)
    })
  }

  // 清除多图作品
  private clearMultiple = () => {
    this.filterResult((data) => {
      return data.pageCount <= 1
    })
  }

  // 清除动图作品
  private clearUgoira = () => {
    this.filterResult((data) => {
      return !data.ugoiraInfo
    })
  }

  // 手动删除作品
  private deleteWork = (event: CustomEventInit) => {
    const el = event.detail.data as HTMLElement
    this.deleteId = parseInt(el.dataset.id!)

    this.filterResult((data) => {
      return data.idNum !== this.deleteId
    })
  }

  private addBookmark = async (event: CustomEventInit) => {
    const data = event.detail.data as AddBMKData

    for (const r of store.result) {
      if (r.idNum === data.id) {
        const res = await bookmark.add(data.id.toString(), 'illusts', data.tags)
        if (res !== 429) {
          // 同步数据
          r.bookmarked = true
          this.resultMeta.forEach((result) => {
            if (result.idNum === data.id) {
              result.bookmarked = true
            }
          })
          data.el.classList.add(this.bookmarkedClass)
        }

        break
      }
    }
  }

  // 去除覆盖在热门作品上面的会员购买链接
  private removeBlockOnHotBar() {
    // 需要重复执行，因为这个链接会生成不止一次
    window.setInterval(() => {
      if (pageType.type !== pageType.list.ArtworkSearch) {
        return
      }
      const hotWorksLink = document.querySelector('section a[href^="/premium"]')
      if (hotWorksLink) {
        hotWorksLink.remove()
      }
    }, 300)
  }

  private crawlTag = () => {
    if (states.crawlTagList) {
      this.readyCrawl()
    }
  }
}

export { InitSearchArtworkPage }
