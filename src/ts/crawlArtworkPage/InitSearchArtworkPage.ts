// 初始化 artwork 搜索页
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { token } from '../Token'
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

type AddBMKData = {
  id: number
  tags: string[]
}

type FilterCB = (value: Result) => unknown

class InitSearchArtworkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
    new FastScreen()
  }

  private readonly worksWrapSelector = '#root section ul'
  private readonly listClass = 'searchList'
  private readonly multipleClass = 'multiplePart'
  private readonly ugoiraClass = 'ugoiraPart'
  private readonly addBMKBtnClass = 'bmkBtn'
  private readonly bookmarkedClass = 'bookmarked'
  private readonly countSelector = 'section h3+div span'
  private readonly hotWorkAsideSelector = 'section aside'

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

  private readonly flag = 'searchArtwork'

  protected setFormOption() {
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: lang.transl('_页数'),
      tip: lang.transl('_从本页开始下载提示'),
      rangTip: `1 - ${this.maxCount}`,
    })
  }

  protected addCrawlBtns() {
    Tools.addBtn('crawlBtns', Colors.bgGreen, lang.transl('_开始筛选'), [
      ['title', lang.transl('_开始筛选Title')],
    ]).addEventListener('click', () => {
      this.resultMeta = []

      window.addEventListener(EVT.list.addResult, this.createWork)

      this.readyCrawl()
    })

    Tools.addBtn('crawlBtns', Colors.bgGreen, lang.transl('_在结果中筛选'), [
      ['title', lang.transl('_在结果中筛选Title')],
    ]).addEventListener('click', () => {
      this.screenInResult()
    })
  }

  protected addAnyElement() {
    const deleteWorks = new DeleteWorks(`.${this.listClass}`)

    deleteWorks.addClearMultipleBtn(`.${this.multipleClass}`, () => {
      EVT.fire(EVT.list.clearMultiple)
    })

    deleteWorks.addClearUgoiraBtn(`.${this.ugoiraClass}`, () => {
      EVT.fire(EVT.list.clearUgoira)
    })

    deleteWorks.addManuallyDeleteBtn((el: HTMLElement) => {
      EVT.fire(EVT.list.deleteWork, el)
    })

    // 添加收藏本页所有作品的功能
    const bookmarkAllBtn = Tools.addBtn(
      'otherBtns',
      Colors.bgGreen,
      lang.transl('_收藏本页面的所有作品')
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
    this.hotBar()

    this.setNotAutoDownload()

    window.addEventListener(EVT.list.addResult, this.showCount)

    window.addEventListener('addBMK', this.addBookmark)

    window.addEventListener(EVT.list.crawlFinish, this.onCrawlFinish)

    window.addEventListener(EVT.list.clearMultiple, this.clearMultiple)

    window.addEventListener(EVT.list.clearUgoira, this.clearUgoira)

    window.addEventListener(EVT.list.deleteWork, this.deleteWork)

    window.addEventListener(EVT.list.settingChange, this.onSettingChange)
  }

  protected destroy() {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')

    window.removeEventListener(EVT.list.addResult, this.showCount)
    window.removeEventListener(EVT.list.crawlFinish, this.onCrawlFinish)
    window.removeEventListener(EVT.list.settingChange, this.onSettingChange)

    // 离开下载页面时，取消设置“不自动下载”
    states.notAutoDownload = false
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_从本页开始下载x页'),
      lang.transl('_下载所有页面')
    )

    if (this.crawlNumber === -1 || this.crawlNumber > this.maxCount) {
      this.crawlNumber = this.maxCount
    }
  }

  protected async nextStep() {
    this.initFetchURL()

    if (this.startpageNo > 1000) {
      msgBox.error(`${lang.transl('_超出最大页码')} ${this.maxCount}`)
      return this.noResult()
    }

    this.needCrawlPageCount = await this.calcNeedCrawlPageCount()

    if (this.needCrawlPageCount === 0) {
      return this.noResult()
    }

    this.startGetIdList()

    this.clearWorks()
  }

  // 组织要请求的 url 中的参数
  private initFetchURL() {
    // 从 URL 中获取分类。可能有语言标识。
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

    // 如果没有指定搜索模式，则是精确匹配标签，设置对应的值
    if (this.option.s_mode === undefined) {
      this.option.s_mode = 's_tag_full'
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

  // 建立并发抓取线程
  private startGetIdList() {
    if (this.needCrawlPageCount <= this.ajaxThreadsDefault) {
      this.ajaxThread = this.needCrawlPageCount
    } else {
      this.ajaxThread = this.ajaxThreadsDefault
    }

    for (let i = 0; i < this.ajaxThread; i++) {
      this.getIdList()
    }
  }

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
        width: nowData.width,
        height: nowData.height,
        pageCount: nowData.pageCount,
        bookmarkData: nowData.bookmarkData,
        workType: nowData.illustType,
        tags: nowData.tags,
        userId: nowData.userId,
        xRestrict: nowData.xRestrict,
      }

      if (await filter.check(filterOpt)) {
        idListWithPageNo.add(
          this.flag,
          {
            type: API.getWorkType(nowData.illustType),
            id: nowData.id,
          },
          p
        )
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

        idListWithPageNo.store(this.flag)

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
    const data = event.detail.data

    if (data.name === 'previewResult') {
      this.setNotAutoDownload()
    }

    if (this.causeResultChange.includes(data.name)) {
      if (store.result.length > 0) {
        this.reAddResult()
        EVT.fire(EVT.list.resultChange)
      }
    }
  }

  private setNotAutoDownload() {
    // 如果设置了“预览搜索结果”，则不启用自动下载
    states.notAutoDownload = settings.previewResult ? true : false
  }

  // 抓取完成后，保存结果的元数据，并重排结果
  private onCrawlFinish = () => {
    this.resultMeta = [...store.resultMeta]

    this.clearWorks()

    this.reAddResult()

    // 解绑创建作品元素的事件
    window.removeEventListener(EVT.list.addResult, this.createWork)

    setTimeout(() => {
      EVT.fire(EVT.list.worksUpdate)
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
    const count = this.resultMeta.length || store.resultMeta.length
    const countEl = document.querySelector(this.countSelector)
    if (countEl) {
      countEl.textContent = count.toString()
    }
  }

  // 在页面上生成抓取结果对应的作品元素
  private createWork = (event: CustomEventInit) => {
    if (!settings.previewResult || !this.worksWrap) {
      return
    }

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
        </div>
                    `
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
    <li class="${this.listClass}" data-id="${data.idNum}">
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
            <img src="${data.thumb}" alt="${data.title}" style="object-fit: cover; object-position: center center;">
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
      <a target="_blank" class="titleLink" href="/artworks/${data.idNum}">${data.title}</a>
      <!--底部-->
      <div class="bottomBar">
      <!--作者信息-->
      <div class="userInfo">
      <!--相比原代码，这里去掉了作者头像的 html 代码。因为抓取到的数据里没有作者头像。-->
          <a target="_blank" href="/users/${data.userId}">
            <div class="userName">${data.user}</div>
          </a>
        </div>
      </div>
    </div>
  </li>
    `
    // 添加作品
    const li2 = document.createElement('li')
    li2.innerHTML = html
    const li = li2.children[0]
    this.worksWrap.appendChild(li)

    // 绑定收藏按钮的事件
    const addBMKBtn = li!.querySelector(
      `.${this.addBMKBtnClass}`
    ) as HTMLButtonElement
    const bookmarkedClass = this.bookmarkedClass
    addBMKBtn.addEventListener('click', function () {
      const e = new CustomEvent('addBMK', {
        detail: { data: { id: data.idNum, tags: data.tags } },
      })
      window.dispatchEvent(e)
      this.classList.add(bookmarkedClass)
    })
  }

  // 清空作品列表，只在作品抓取完毕时使用。之后会生成根据收藏数排列的作品列表。
  private clearWorks() {
    this.worksWrap = this.getWorksWrap()

    if (!settings.previewResult || !this.worksWrap) {
      return
    }

    this.worksWrap.innerHTML = ''
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
      toast.error(lang.transl('_没有数据可供使用'))
      return
    }

    EVT.fire(EVT.list.closeCenterPanel)

    log.clear()

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

    EVT.fire(EVT.list.resultChange)
  }

  // 重新添加抓取结果，执行时机：
  // 1 作品抓取完毕之后，添加抓取到的数据
  // 2 使用“在结果中筛选”或删除作品，使得作品数据变化了，改变作品列表视图
  // 3 修改了“多图下载设置”，导致作品数据变化
  private reAddResult() {
    store.reset()

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

    log.clear()

    this.getMultipleSetting()

    this.filterResult((data) => {
      const filterOpt: FilterOption = {
        id: data.id,
        workType: data.type,
        pageCount: data.pageCount,
        tags: data.tags,
        bookmarkCount: data.bmk,
        bookmarkData: data.bookmarked,
        width: data.fullWidth,
        height: data.fullHeight,
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

  private addBookmark = (event: CustomEventInit) => {
    const data = event.detail.data as AddBMKData

    API.addBookmark(
      'illusts',
      data.id.toString(),
      settings.widthTag === 'yes' ? data.tags : [],
      settings.restrict === 'yes',
      token.token
    )
    this.resultMeta.forEach((result) => {
      if (result.idNum === data.id) {
        result.bookmarked = true
      }
    })
  }

  // 去除热门作品上面的遮挡
  private hotBar() {
    // 因为热门作品里的元素是延迟加载的，所以使用定时器检查
    const timer = window.setInterval(() => {
      const hotWorkAside = document.querySelector(this.hotWorkAsideSelector)

      if (hotWorkAside) {
        window.clearInterval(timer)

        // 去掉遮挡作品的购买链接
        const premiumLink = hotWorkAside.nextSibling
        premiumLink && premiumLink.remove()

        // 去掉遮挡后两个作品的 after。因为是伪元素，所以要通过 css 控制
        const style = `
        section aside ul::after{
          display:none !important;
        }
        `
        Utils.addStyle(style)
      }
    }, 300)
  }
}

export { InitSearchArtworkPage }
