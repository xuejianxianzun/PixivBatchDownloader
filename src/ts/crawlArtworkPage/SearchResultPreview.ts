import { bookmark } from '../Bookmark'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { log } from '../Log'
import { downloadOnClickBookmark } from '../download/DownloadOnClickBookmark'
import { downloadStates } from '../download/DownloadStates'
import { filter, FilterOption } from '../filter/Filter'
import { settings } from '../setting/Settings'
import { states } from '../store/States'
import { Result } from '../store/StoreType'
import { store } from '../store/Store'
import { toast } from '../Toast'
import { Tools } from '../Tools'

type AddBMKData = {
  id: number
  tags: string[]
  el: Element
}

type FilterCB = (value: Result) => unknown

/** 在搜索页面中预览、筛选和维护抓取结果的模块 */
// 预览搜索页面的筛选结果
// 对应的设置：previewResult
// 预览列表的数据源就是 store.resultMeta，本模块不维护自己的副本。
// 需要筛选或删除作品时，直接改动 store 的结果列表，再用 reAddResult() 重建 store.result。
// 现在渲染预览卡片时是分页的。
// 我试过不用分页的方案：为卡片设置 content-visibility: auto; 使浏览器不渲染离屏内容，也不会立刻加载离屏的图片。首屏先渲染前 N 张、其余用 requestIdleCallback 分批补充渲染。但是当卡片数量很多时，几乎所有操作都会有明显的卡顿，因此改回了分页方案。
class SearchResultPreview {
  /** 预览作品列表项的类名 */
  public static readonly listClass = 'searchList'
  /** 多图作品标记的类名 */
  public static readonly multipleClass = 'multiplePart'
  /** 动图标记的类名 */
  public static readonly ugoiraClass = 'ugoiraPart'

  /** 搜索结果容器的自定义 id */
  private readonly workListWrapID = 'workListWrap'
  /** 预览作品收藏按钮的类名 */
  private readonly addBMKBtnClass = 'bmkBtn'
  /** 已收藏作品的类名 */
  private readonly bookmarkedClass = 'bookmarked'
  /** 显示作品数量的元素 */
  private countEl?: HTMLElement
  /** 搜索结果列表容器 */
  private worksWrap: HTMLElement | null = null
  /** 当前容器是否已由预览模块接管 */
  private previewContainerPrepared = false
  /** 当前显示的预览页 */
  private currentPage = 1
  /** 刷新预览缓冲区的动画帧 id */
  private showPreviewFrameId = 0
  /** 防止异步筛选任务重叠 */
  private isFiltering = false
  /** 异步筛选期间请求删除的作品 id */
  private pendingDeleteIds = new Set<number>()
  /** 分页控件列表项 */
  private paginationWrap?: HTMLLIElement
  /** 分页控件中的上一页按钮 */
  private previousPageBtn?: HTMLButtonElement
  /** 分页控件中的下一页按钮 */
  private nextPageBtn?: HTMLButtonElement
  /** 分页控件中的页码按钮容器 */
  private pageNumbersWrap?: HTMLSpanElement
  /** 已创建的页码按钮 */
  private pageButtons: HTMLButtonElement[] = []
  /** 当前高亮的页码按钮 */
  private activePageBtn?: HTMLButtonElement
  /** 修改这些设置后需要重新生成抓取结果 */
  private causeResultChange = [
    'onlyCrawlFirstFewImagesSwitch',
    'onlyCrawlFirstFewImagesCount',
  ]
  /** 当前抓取是否由搜索页的抓取按钮发起 */
  private crawlStartBySelf = false
  /** 缓存待插入页面的预览作品 */
  private workPreviewBuffer = document.createDocumentFragment()
  /** 本实例是否已经被销毁。销毁后不再执行恢复预览等延迟任务 */
  private destroyed = false
  /** 恢复预览时的已重试次数 */
  private restoredPreviewRetry = 0
  /** 恢复预览的重试定时器 id */
  private restoredPreviewTimer = 0
  /** 恢复预览的最大重试次数。pixiv 的作品列表可能比恢复流程更晚渲染出来 */
  private readonly restoredPreviewMaxRetry = 25

  /** 初始化退出手动删除模式的回调 */
  constructor(private readonly exitManualDeleteMode: () => void = () => {}) {}

  /** 初始化预览、结果变更和收藏相关事件 */
  public init() {
    this.destroyed = false
    this.createPaginationControls()
    window.addEventListener(EVT.list.addResult, this.showCount)
    window.addEventListener(EVT.list.resultChange, this.showCountOnLog)
    window.addEventListener(
      EVT.list.manuallyExcludeWork,
      this.onManuallyExcludeWork
    )
    // 下载结束后重绘预览列表，反映下载期间被排除的作品
    for (const ev of [EVT.list.downloadComplete, EVT.list.downloadStop]) {
      window.addEventListener(ev, this.renderAfterDownload)
    }
    window.addEventListener(EVT.list.langChange, this.updatePaginationLanguage)
    // 恢复了未完成的抓取结果之后，用恢复的数据绘制预览列表
    window.addEventListener(EVT.list.resume, this.renderRestoredPreview)
    window.addEventListener('addBMK', this.addBookmark)
  }

  /** 移除预览模块注册的事件和待执行的渲染任务 */
  public destroy() {
    window.removeEventListener(EVT.list.addResult, this.showCount)
    window.removeEventListener(EVT.list.resultChange, this.showCountOnLog)
    window.removeEventListener(
      EVT.list.manuallyExcludeWork,
      this.onManuallyExcludeWork
    )
    for (const ev of [EVT.list.downloadComplete, EVT.list.downloadStop]) {
      window.removeEventListener(ev, this.renderAfterDownload)
    }
    window.removeEventListener(
      EVT.list.langChange,
      this.updatePaginationLanguage
    )
    window.removeEventListener(EVT.list.resume, this.renderRestoredPreview)
    window.removeEventListener('addBMK', this.addBookmark)
    window.removeEventListener(EVT.list.addResult, this.onResultAdded)
    this.worksWrap?.removeEventListener('click', this.onPreviewClick)
    this.paginationWrap?.remove()
    this.previewContainerPrepared = false
    this.destroyed = true
    window.clearTimeout(this.restoredPreviewTimer)
    this.resetPreviewBuffer()
  }

  /** 开始由搜索页按钮发起的抓取，初始化预览结果状态 */
  public startCrawl() {
    this.exitManualDeleteMode()
    this.previewContainerPrepared = false
    // 不需要清空抓取结果：它在 store 里，store 会在 crawlStart 时重置
    this.crawlStartBySelf = true
    this.currentPage = 1
    this.resetPreviewBuffer()
    window.removeEventListener(EVT.list.addResult, this.onResultAdded)
    window.addEventListener(EVT.list.addResult, this.onResultAdded)
  }

  /** 找到搜索结果容器、清空旧预览并定位作品数量元素 */
  public prepareContainer() {
    this.clearPreview()

    // 第一个选择器是旧版页面的，以后可能不需要使用了
    // 第二个选择器是新版页面里的
    this.countEl =
      document.querySelector('section h3+div span') ||
      (document.querySelector(
        'div[data-ga4-label="works_content"]>div:first-child div:first-child span span'
      ) as HTMLElement)
  }

  /** 返回包含作品列表的容器元素 */
  public findWorksWrap() {
    let wrap: HTMLElement | null = null

    // 对于已经查找过的情况，直接定位到该元素
    const old = document.querySelector(`#${this.workListWrapID}`)
    if (old) {
      wrap = old as HTMLElement
    } else {
      // 重新查找
      // 先查找作品列表里最后一个作品链接，然后向上查找 UL 元素
      // 为什么用最后一个作品，而不是第一个作品：
      // 有时在作品列表上方会显示“热门作品”和“成为pixiv高级会员”按钮的板块
      // 如果使用第一个作品，就会选择到这个板块，而非其下方真正的作品列表
      let works = document.querySelectorAll(
        'li a[data-gtm-user-id][href^="/artworks"]'
      )
      if (works.length > 0) {
        const lastWork = Array.from(works).pop()!
        wrap = lastWork.closest('ul')
      }

      // 2026-02-10 改版后
      if (!wrap) {
        // 查找作品元素
        works = document.querySelectorAll('.col-span-2')
        if (works.length > 0) {
          const lastWork = Array.from(works).pop()!
          if (lastWork.querySelector('a[href^="/artworks"]')) {
            wrap = lastWork.parentElement!
          }
        }
      }

      if (!wrap) {
        // 查找作品缩略图
        works = document.querySelectorAll('div[width="184"]')
        if (works.length > 0) {
          const lastWork = Array.from(works).pop()!
          wrap =
            lastWork.closest('div.mx-auto') ||
            lastWork.closest('div[data-ga4-label="works_content"]')
        }
      }
    }

    // 查找到作品列表后，添加自定义的 ID，方便后续查找它
    if (wrap) {
      wrap.id = this.workListWrapID
      this.setWorksWrap(wrap)
    }

    return wrap
  }

  /** 是否存在可以操作的抓取结果 */
  public get hasResult() {
    return store.resultMeta.length > 0 || store.result.length > 0
  }

  /** 在抓取结果中应用当前筛选条件 */
  public async filterResults() {
    const canFilter = await this.filterResult((data) => {
      const filterOpt: FilterOption = {
        aiType: data.aiType,
        id: data.id,
        isOriginal: data.isOriginal,
        workType: data.type,
        pageCount: data.pageCount,
        tags: data.tags,
        title: data.title,
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

    if (canFilter) {
      toast.success(lang.transl('_已调整抓取结果'))
    }
  }

  /** 抓取完成后保存结果快照并按排序后的结果重建预览 */
  public finishCrawl = () => {
    // 有些操作也会触发抓取完毕的事件，但不应该调整搜索页面的结果。
    if (states.crawlTagList || states.quickCrawl) {
      return
    }
    if (!this.crawlStartBySelf) {
      return
    }

    window.removeEventListener(EVT.list.addResult, this.onResultAdded)

    // 搜索页面抓取完毕后会按收藏数量排序（排序在 crawlFinished 里完成），
    // 所以清空旧预览并按新的顺序重新生成当前页。
    // 这里不需要重建 store：本次抓取的结果已经在 store 里了
    this.clearPreview()
    this.crawlStartBySelf = false
    this.currentPage = 1
    this.renderCurrentPage()

    setTimeout(() => {
      EVT.fire('worksUpdate')
    }, 0)
  }

  /** 根据会影响结果的设置变更重新生成抓取结果 */
  public refreshResults(event: CustomEventInit) {
    if (states.crawlTagList) {
      return
    }
    const data = event.detail.data
    if (data.name === 'previewResultPageSize') {
      this.renderCurrentPage()
      return
    }

    if (
      !this.causeResultChange.includes(data.name) ||
      store.result.length === 0
    ) {
      return
    }

    // 这些设置会影响每个作品要下载哪些文件，所以要按当前的作品列表重建抓取结果
    this.reAddResult([...store.resultMeta])
    this.renderCurrentPage()
    EVT.fire('resultChange')
  }

  /** 查找并缓存搜索结果容器 */
  private setWorksWrap(wrap: HTMLElement) {
    if (this.worksWrap !== wrap) {
      this.worksWrap?.removeEventListener('click', this.onPreviewClick)
      this.worksWrap = wrap
      this.worksWrap.addEventListener('click', this.onPreviewClick)
    }
  }

  /** 创建搜索结果分页控件 */
  private createPaginationControls() {
    const wrap = document.createElement('li')
    wrap.className = 'searchResultPreviewPagination'

    const previousPageBtn = document.createElement('button')
    previousPageBtn.type = 'button'
    previousPageBtn.innerHTML = `
      <svg class="icon settingsPanel_sectionArrow" aria-hidden="true">
        <use xlink:href="#arrow-up"></use>
      </svg>
    `
    previousPageBtn.addEventListener('click', () => {
      this.changePage(-1)
    })

    const pageNumbersWrap = document.createElement('span')
    pageNumbersWrap.className = 'searchResultPreviewPages'

    const nextPageBtn = document.createElement('button')
    nextPageBtn.type = 'button'
    nextPageBtn.innerHTML = `
      <svg class="icon settingsPanel_sectionArrow" aria-hidden="true">
        <use xlink:href="#arrow-down"></use>
      </svg>
    `
    nextPageBtn.addEventListener('click', () => {
      this.changePage(1)
    })

    wrap.append(previousPageBtn, pageNumbersWrap, nextPageBtn)
    this.paginationWrap = wrap
    this.previousPageBtn = previousPageBtn
    this.nextPageBtn = nextPageBtn
    this.pageNumbersWrap = pageNumbersWrap
    this.updatePaginationLanguage()
  }

  /** 更新分页控件的多语言文本 */
  private updatePaginationLanguage = () => {
    if (!this.previousPageBtn || !this.nextPageBtn) {
      return
    }

    this.previousPageBtn.setAttribute('aria-label', lang.transl('_预览上一页'))
    this.nextPageBtn.setAttribute('aria-label', lang.transl('_预览下一页'))
    this.updatePagination()
  }

  /** 根据当前页码重新渲染预览作品，默认退出手动删除模式 */
  private renderCurrentPage(exitDeleteMode = true) {
    if (exitDeleteMode) {
      this.exitManualDeleteMode()
    }
    if (
      !settings.previewResult ||
      !this.worksWrap ||
      !this.previewContainerPrepared
    ) {
      return
    }

    this.resetPreviewBuffer()

    const results = store.resultMeta
    const resultCount = store.resultMeta.length
    const pageSize = this.getPageSize()
    const pageCount = Math.ceil(resultCount / pageSize)
    this.currentPage = Math.min(
      Math.max(this.currentPage, 1),
      Math.max(pageCount, 1)
    )

    const startIndex = (this.currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, resultCount)
    const fragment = document.createDocumentFragment()

    for (let index = startIndex; index < endIndex; index++) {
      fragment.append(this.createPreview(results[index]))
    }

    this.worksWrap.replaceChildren(fragment)
    this.updatePagination()
  }

  /** 切换预览页 */
  private changePage(change: number) {
    this.currentPage += change
    this.renderCurrentPage()
  }

  /** 跳转到指定页 */
  private changeToPage(page: number) {
    if (page === this.currentPage) {
      return
    }
    this.currentPage = page
    this.renderCurrentPage()
  }

  /** 更新分页按钮状态和结果数量 */
  private updatePagination() {
    if (
      !this.paginationWrap ||
      !this.previousPageBtn ||
      !this.nextPageBtn ||
      !this.pageNumbersWrap
    ) {
      return
    }

    const pageCount = Math.ceil(store.resultMeta.length / this.getPageSize())
    this.currentPage = Math.min(
      Math.max(this.currentPage, 1),
      Math.max(pageCount, 1)
    )

    this.previousPageBtn.disabled = this.currentPage <= 1
    this.nextPageBtn.disabled = pageCount === 0 || this.currentPage >= pageCount
    this.updatePageNumbers(pageCount > 1 ? pageCount : 0)

    if (pageCount > 1 && this.worksWrap) {
      if (
        this.paginationWrap.parentElement !== this.worksWrap ||
        this.worksWrap.firstChild !== this.paginationWrap
      ) {
        this.worksWrap.prepend(this.paginationWrap)
      }
    } else {
      this.paginationWrap.remove()
    }
  }

  /** 按页数增删页码按钮并更新当前页高亮 */
  private updatePageNumbers(pageCount: number) {
    if (!this.pageNumbersWrap) {
      return
    }

    while (this.pageButtons.length > pageCount) {
      const button = this.pageButtons.pop()!
      if (this.activePageBtn === button) {
        this.activePageBtn = undefined
      }
      button.remove()
    }

    while (this.pageButtons.length < pageCount) {
      const page = this.pageButtons.length + 1
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'searchResultPreviewPageNumber'
      button.textContent = page.toString()
      button.addEventListener('click', () => {
        this.changeToPage(page)
      })
      this.pageButtons.push(button)
      this.pageNumbersWrap.append(button)
    }

    const activePageBtn = this.pageButtons[this.currentPage - 1]
    if (this.activePageBtn !== activePageBtn) {
      this.activePageBtn?.classList.remove('currentPage')
      this.activePageBtn?.removeAttribute('aria-current')

      if (activePageBtn) {
        activePageBtn.classList.add('currentPage')
        activePageBtn.setAttribute('aria-current', 'page')
      }
      this.activePageBtn = activePageBtn
    }
  }

  /** 获取有效的每页显示数量 */
  private getPageSize() {
    return Math.max(1, settings.previewResultPageSize)
  }

  /** 将当前页新增的预览卡片合并插入页面 */
  private queuePreview(preview: HTMLLIElement) {
    this.workPreviewBuffer.append(preview)
    if (this.showPreviewFrameId) {
      return
    }

    this.showPreviewFrameId = window.requestAnimationFrame(() => {
      this.showPreviewFrameId = 0
      this.showPreview()
    })
  }

  /** 显示当前缓冲中的预览作品 */
  private showPreview() {
    if (this.workPreviewBuffer.firstChild && this.worksWrap) {
      this.worksWrap.append(this.workPreviewBuffer)
    }
  }

  /** 丢弃待插入的卡片并取消尚未执行的动画帧 */
  private resetPreviewBuffer() {
    if (this.showPreviewFrameId) {
      window.cancelAnimationFrame(this.showPreviewFrameId)
      this.showPreviewFrameId = 0
    }
    this.workPreviewBuffer = document.createDocumentFragment()
  }

  /** 更新搜索页面上显示的作品数量 */
  private showCount = () => {
    if (states.crawlTagList || !settings.previewResult) {
      return
    }

    if (settings.previewResult && this.countEl) {
      this.countEl.textContent = store.resultMeta.length.toString()
    }
  }

  private showCountOnLog = () => {
    const count = store.resultMeta.length
    log.success(
      lang.transl('_调整完毕', count.toString()),
      'showCountWhenResultChange'
    )
  }

  /** 按新增结果更新当前预览页 */
  private onResultAdded = (event: CustomEventInit) => {
    if (states.crawlTagList) {
      return
    }
    if (
      !settings.previewResult ||
      !this.worksWrap ||
      !this.previewContainerPrepared
    ) {
      return
    }

    const data = event.detail.data as Result
    const results = store.resultMeta
    const resultIndex = results.length - 1
    const pageSize = this.getPageSize()

    this.updatePagination()
    const startIndex = (this.currentPage - 1) * pageSize

    if (resultIndex < startIndex || resultIndex >= startIndex + pageSize) {
      return
    }

    this.queuePreview(this.createPreview(data))
  }

  /** 根据作品数据创建一张预览卡片 */
  private createPreview(data: Result) {
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
        <div class="${SearchResultPreview.multipleClass}">
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
        <svg viewBox="0 0 24 24" class="${SearchResultPreview.ugoiraClass}" style="width: 48px; height: 48px;">
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
            <img loading="lazy" decoding="async" src="${
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
    li.classList.add(SearchResultPreview.listClass)
    li.dataset.id = data.idNum.toString()
    li.innerHTML = html

    return li
  }

  /** 清空本次抓取生成的预览作品列表 */
  private clearPreview() {
    if (!settings.previewResult || !this.crawlStartBySelf) {
      return
    }
    this.preparePreviewContainer()
  }

  /** 清空搜索结果容器，并把它交给预览模块接管。
   *
   * 与 clearPreview 的区别：它不检查这次抓取是否由搜索页的按钮发起。
   * 因为恢复未完成的抓取结果时不会经过搜索页的抓取流程（见 renderRestoredPreview）。 */
  private preparePreviewContainer() {
    this.findWorksWrap()
    if (this.worksWrap) {
      this.worksWrap.replaceChildren()
      this.previewContainerPrepared = true
    } else {
      this.previewContainerPrepared = false
    }

    // 同时重置一些变量
    this.currentPage = 1
    this.resetPreviewBuffer()
  }

  /** 根据传入的条件筛选抓取结果。
   * @param callback 用于筛选每条抓取结果的回调函数，返回 true 表示保留该条目，返回 false 表示移除该条目
   * @returns 如果无法开始执行筛选任务，会返回 false；如果可以执行筛选任务则返回 true
   */
  private async filterResult(callback: FilterCB) {
    if (states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return false
    }

    if (this.isFiltering) {
      toast.warning(lang.transl('_当前任务尚未完成'))
      return false
    }

    if (store.resultMeta.length === 0) {
      // 可能的情况：
      // - 用户尚未开始抓取
      // - 用户已经开始抓取，但现在还没有任何抓取结果
      toast.warning(lang.transl('_缺少必要的数据'))
      return false
    }

    this.isFiltering = true
    try {
      const beforeLength = store.resultMeta.length // 储存过滤前的结果数量
      const resultMetaTemp: Result[] = []

      for (const meta of store.resultMeta) {
        try {
          if (await callback(meta)) {
            resultMetaTemp.push(meta)
          }
        } catch (err) {
          log.error(`filterResult error: ${err}`)
          resultMetaTemp.push(meta) // 出错时保留该条目，避免误删
        }
      }

      let newResultMeta = resultMetaTemp
      if (this.pendingDeleteIds.size > 0) {
        newResultMeta = resultMetaTemp.filter(
          (meta) => !this.pendingDeleteIds.has(meta.idNum)
        )
        this.pendingDeleteIds.clear()
      }

      // 如果过滤后，作品元数据发生了改变则重建抓取结果并刷新当前页
      if (newResultMeta.length !== beforeLength) {
        this.reAddResult(newResultMeta)
        this.renderCurrentPage()
      }

      EVT.fire('resultChange')
      return true
    } finally {
      this.isFiltering = false
    }
  }

  /** 按照传入的作品列表重新构建抓取结果。
   *
   * store.reset() 会清空 store 里的结果，所以传入的列表必须是一份独立的数组（不能直接传 store.resultMeta）。
   * @param resultMeta 要保留的作品列表 */
  private reAddResult(resultMeta: Result[]) {
    // 抓取结果会被整体重建，下载状态列表的下标随之失效（下载任务是按 store.result 的下标派发的）。
    // 所以先保存「文件 id → 下载状态」的映射，重建后按 id 还原：
    // 已经下载完成的文件不用重新下载，状态列表的长度也始终与 store.result 保持一致。
    const stateMap = downloadStates.createStateMap(store.result)

    store.reset()

    // 重新生成抓取结果并更新作品数量，预览卡片由 renderCurrentPage 单独创建。
    for (const data of resultMeta) {
      store.addResult(data)
    }

    downloadStates.remapTo(store.result, stateMap)

    // showCount 依赖 addResult 事件，但如果清空了所有结果，则不会触发 addResult 事件，所以需要手动调用它
    if (resultMeta.length === 0) {
      this.showCount()
    }
  }

  /** 从当前结果中移除多图作品（由“清除多图作品”按钮调用） */
  public async clearMultiple() {
    const canFilter = await this.filterResult((data) => {
      return data.pageCount <= 1
    })
    if (canFilter) {
      toast.success(lang.transl('_已调整抓取结果'))
    }
  }

  /** 从当前结果中移除动图作品（由“清除动图作品”按钮调用） */
  public async clearUgoira() {
    const canFilter = await this.filterResult((data) => {
      return !data.ugoiraInfo
    })
    if (canFilter) {
      toast.success(lang.transl('_已调整抓取结果'))
    }
  }

  /** 从当前结果中移除指定的作品（由“手动删除作品”调用）
   * @param idNum 作品的数字 id */
  public removeWork(idNum: number) {
    if (states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    if (Number.isNaN(idNum)) {
      return
    }

    if (this.isFiltering) {
      if (!this.pendingDeleteIds.has(idNum)) {
        this.pendingDeleteIds.add(idNum)
        toast.success(lang.transl('_已调整抓取结果'))
      }
      return
    }

    if (store.resultMeta.length === 0) {
      toast.warning(lang.transl('_缺少必要的数据'))
      return
    }

    const beforeLength = store.resultMeta.length
    const newResultMeta = store.resultMeta.filter(
      (result) => result.idNum !== idNum
    )
    if (newResultMeta.length === beforeLength) {
      return
    }

    this.reAddResult(newResultMeta)
    this.renderCurrentPage(false)
    EVT.fire('resultChange')
    toast.success(lang.transl('_已调整抓取结果'))
  }

  /** 处理“手动排除作品”功能排除的作品。
   *
   * 这里直接按 id 修改抓取结果，不再查找页面上对应的卡片：页面是分页显示的，
   * 被排除的作品可能位于其他页，此时页面上并没有它的元素。
   *
   * 抓取进行中时，ExcludeWork 已经把它从抓取结果里移除了，所以下面的过滤不会改变数量、会直接返回。
   *
   * 只有「正在传输」时不在这里处理，见方法内的判断。
   * 已暂停（包括恢复了未完成的抓取结果之后）时也会真正删除，与「手动删除作品」按钮的行为一致。 */
  private onManuallyExcludeWork = (event: CustomEventInit) => {
    // 正在传输时不在这里处理：这里会重建抓取结果，而下载任务是按 store.result 的下标派发的，
    // 重建结果会打乱下标。这种情况交给 DownloadControl 处理（它会把该作品尚未开始下载的文件
    // 标记为跳过），预览列表则在下载结束后由 renderAfterDownload 重绘。
    //
    // 除此之外（空闲、已暂停、恢复了未完成的抓取结果）都直接把作品从抓取结果里删掉，
    // 效果和「手动删除作品」按钮一样。已暂停时是安全的：reAddResult 会按文件 id 迁移下载状态，
    // 保持 store.result 与 downloadStates 长度一致；在飞文件回报时也会按 id 重新定位下标。
    if (states.downloading) {
      return
    }

    const id = event.detail.data.id as string
    const type = event.detail.data.type as string
    // 搜索页的预览列表里只有图像作品
    if (!id || type === 'novels' || type === 'novelSeries') {
      return
    }

    const deleteId = Number.parseInt(id)
    if (Number.isNaN(deleteId)) {
      return
    }

    const beforeLength = store.resultMeta.length
    const newResultMeta = store.resultMeta.filter(
      (result) => result.idNum !== deleteId
    )
    if (newResultMeta.length === beforeLength) {
      return
    }

    this.reAddResult(newResultMeta)
    this.renderCurrentPage(false)
    EVT.fire('resultChange')
    toast.success(lang.transl('_已调整抓取结果'))
  }

  /** 下载结束后重绘预览列表，让它反映下载期间被排除的作品。
   *
   * 下载期间用户可能排除了作品：DownloadControl 会把它们从 store 里移除，但刻意不发
   * resultChange（那会清空下载状态、并可能让下载器重新开始下载）。所以这里主动重绘一次。
   *
   * 只有 DOM 需要更新 —— 预览的数据源就是 store.resultMeta，数据本身已经是最新的了。
   *
   * 注意不要触发 resultChange：下载刚刚结束，它会让下载状态列表被清空（进度显示归零），
   * 也可能让下载器重新进入准备下载的流程。 */
  private renderAfterDownload = () => {
    // 延后到本轮事件处理完毕再重绘：DownloadControl 也监听这两个事件，它需要先改完 store
    window.setTimeout(() => {
      this.showCount()
      this.renderCurrentPage(false)
    }, 0)
  }

  /** 下载器恢复了未完成的抓取结果（见 Resume 模块）之后，用恢复的数据绘制预览列表。
   *
   * 恢复流程不会经过搜索页的抓取流程，所以预览容器还没有被本模块接管，需要在这里自己准备容器。
   * 而且恢复的时机可能早于 pixiv 渲染出作品列表，所以找不到容器时会延迟重试。 */
  private renderRestoredPreview = () => {
    if (this.destroyed) {
      return
    }

    if (
      this.crawlStartBySelf ||
      !settings.previewResult ||
      store.resultMeta.length === 0
    ) {
      return
    }

    if (!this.findWorksWrap()) {
      // pixiv 还没有渲染出作品列表，稍后再试
      if (this.restoredPreviewRetry < this.restoredPreviewMaxRetry) {
        this.restoredPreviewRetry++
        window.clearTimeout(this.restoredPreviewTimer)
        this.restoredPreviewTimer = window.setTimeout(
          this.renderRestoredPreview,
          200
        )
      }
      return
    }

    this.restoredPreviewRetry = 0

    // 作品列表出现之后再定位作品数量元素，它通常和作品列表一起渲染出来
    this.prepareContainer()
    this.preparePreviewContainer()
    this.showCount()
    this.renderCurrentPage()

    // pixiv 有可能在我们接管容器之后才完成它自己的渲染，把作品追加进容器里。
    // 所以稍后再确认重绘一次，确保页面上只留下预览卡片
    window.clearTimeout(this.restoredPreviewTimer)
    this.restoredPreviewTimer = window.setTimeout(
      this.confirmRestoredPreview,
      600
    )
  }

  /** 恢复预览的确认重绘。见 renderRestoredPreview 里的说明 */
  private confirmRestoredPreview = () => {
    if (
      this.destroyed ||
      this.crawlStartBySelf ||
      !settings.previewResult ||
      store.resultMeta.length === 0 ||
      !this.previewContainerPrepared
    ) {
      return
    }

    // pixiv 可能换掉了作品列表容器，这时需要重新接管它
    const oldWrap = this.worksWrap
    if (this.findWorksWrap() && this.worksWrap !== oldWrap) {
      this.preparePreviewContainer()
    }

    this.showCount()
    this.renderCurrentPage(false)
  }

  /** 通过容器事件委托处理预览卡片的收藏按钮 */
  private onPreviewClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) {
      return
    }

    const button = event.target.closest<HTMLButtonElement>(
      `.${this.addBMKBtnClass}`
    )
    if (!button || !this.worksWrap?.contains(button)) {
      return
    }

    const card = button.closest<HTMLLIElement>(
      `li.${SearchResultPreview.listClass}`
    )
    const id = Number.parseInt(card?.dataset.id || '')
    if (!card || Number.isNaN(id)) {
      return
    }

    const data = store.resultMeta.find((result) => result.idNum === id)
    if (!data) {
      return
    }

    const e = new CustomEvent('addBMK', {
      detail: { data: { id: data.idNum, tags: data.tags, el: button } },
    })
    window.dispatchEvent(e)

    downloadOnClickBookmark.send(data.idNum.toString())
  }

  /** 收藏搜索结果预览卡片中的作品 */
  private addBookmark = async (event: CustomEventInit) => {
    const data = event.detail.data as AddBMKData

    for (const r of store.result) {
      if (r.idNum === data.id) {
        const status = await bookmark.add(
          data.id.toString(),
          'illusts',
          data.tags
        )
        if (status === 200) {
          // 同步数据
          r.bookmarked = true
          store.resultMeta.forEach((result) => {
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
}

export { SearchResultPreview }
