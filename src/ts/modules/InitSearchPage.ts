// 初始化搜索页
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { options } from './Options'
import { centerButtons } from './CenterButtons'
import { pageInfo } from './PageInfo'
import { DeleteWorks } from './DeleteWorks'
import { EVT } from './EVT'
import { SearchOption } from './CrawlArgument.d'
import { FilterOption } from './Filter.d'
import { filter } from './Filter'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'
import { WorkInfo } from './Store.d'
import { centerPanel } from './CenterPanel'
import { titleBar } from './TitleBar'
import { form } from './Settings'
import { FastScreen } from './FastScreen'

type AddBMKData = {
  id: number
  tags: string
}

type FilterCB = (value: WorkInfo) => unknown

class InitSearchPage extends InitPageBase {
  constructor() {
    super()
    this.init()
    new FastScreen()
  }

  protected initElse() {
    this.setPreviewResult(form.previewResult.checked)

    window.addEventListener(EVT.events.addResult, this.addWork)

    window.addEventListener('addBMK', this.addBookmark)

    window.addEventListener(EVT.events.crawlFinish, this.onCrawlFinish)
    window.addEventListener(EVT.events.crawlFinish, this.showCount)

    window.addEventListener(EVT.events.clearMultiple, this.clearMultiple)

    window.addEventListener(EVT.events.clearUgoira, this.clearUgoira)

    window.addEventListener(EVT.events.deleteWork, this.deleteWork)

    window.addEventListener(EVT.events.settingChange, this.onSettingChange)
  }

  protected appendCenterBtns() {
    centerButtons
      .add(Colors.green, lang.transl('_开始筛选'), [
        ['title', lang.transl('_开始筛选Title')]
      ])
      .addEventListener('click', () => {
        this.startScreen()
      })

    centerButtons
      .add(Colors.red, lang.transl('_在结果中筛选'), [
        ['title', lang.transl('_在结果中筛选Title')]
      ])
      .addEventListener('click', () => {
        this.screenInResult()
      })
  }

  protected appendElseEl() {
    const deleteWorks = new DeleteWorks('.lmXjIY')

    deleteWorks.addClearMultipleBtn('.fjaNWC', () => {
      EVT.fire(EVT.events.clearMultiple)
    })

    deleteWorks.addClearUgoiraBtn('.bAzGJL', () => {
      EVT.fire(EVT.events.clearUgoira)
    })

    deleteWorks.addManuallyDeleteBtn((el: HTMLElement) => {
      EVT.fire(EVT.events.deleteWork, el)
    })
  }

  protected setFormOption() {
    this.maxCount = 1000

    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_checkWantPageRule1Arg8'),
      rangTip: `1 - ${this.maxCount}`,
      value: this.maxCount.toString()
    })

    options.hideOption([15])
  }

  protected destroy() {
    window.removeEventListener(EVT.events.addResult, this.addWork)
    window.removeEventListener(EVT.events.crawlFinish, this.onCrawlFinish)
    window.removeEventListener(EVT.events.crawlFinish, this.showCount)

    // 离开下载页面时，取消设置“不自动下载”
    store.states.notAutoDownload = false
  }

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

  private resultMeta: WorkInfo[] = [] // 每次“开始筛选”完成后，储存当时所有结果，以备“在结果中筛选”使用

  private worksWrap: HTMLUListElement | null = null

  private deleteId = 0 // 手动删除时，要删除的作品的 id

  private crawlWorks = false // 是否在抓取作品数据（“开始筛选”时改为 true）

  private crawled = false // 是否已经进行过抓取

  private previewResult = true // 是否预览结果

  private optionsCauseResultChange = ['multipleImageWorks', 'firstFewImages'] // 这些选项变更时，需要重新添加结果。例如多图作品“只下载前几张” firstFewImages 会影响生成的结果，但是过滤器 filter 不会检查，所以需要单独检测它的变更

  private needReAdd = false // 是否需要重新添加结果（并且会重新渲染）

  private startScreen() {
    if (!store.states.allowWork) {
      return alert(lang.transl('_当前任务尚未完成'))
    }

    this.crawlWorks = true

    this.readyCrawl()
  }

  protected async nextStep() {
    this.initFetchURL()

    this.needCrawlPageCount = await this.calcNeedCrawlPageCount()

    if (this.needCrawlPageCount === 0) {
      return this.noResult()
    }

    this.startGetIdList()

    this.clearWorks()
  }

  // 返回包含作品列表的 ul 元素
  private getWorksWrap() {
    const test = document.querySelectorAll('#root section ul')
    if (test.length > 0) {
      return test[test.length - 1] as HTMLUListElement
    }
    return null
  }

  private showCount = () => {
    const count = this.resultMeta.length.toString()
    log.success(lang.transl('_调整完毕', count))

    const countEl = document.querySelector('.bihUFO')
    if (countEl) {
      countEl.textContent = count
    }
  }

  private clearWorks() {
    this.worksWrap = this.getWorksWrap()

    if (!this.previewResult || !this.worksWrap) {
      return
    }

    this.worksWrap.innerHTML = ''
  }

  // 在页面显示作品
  private addWork = (event: CustomEventInit) => {
    if (!this.previewResult || !this.worksWrap) {
      return
    }

    const data = event.detail.data as WorkInfo

    let multipleHTML = ''
    if (data.pageCount > 1) {
      multipleHTML = `
        <div class="sc-fzXfOZ gOXMgf">
                  <svg viewBox="0 0 9 10" width="9" height="10" class="sc-fzXfOY cqMBzB">
                      <path d="M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10
        C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1
        C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8 0,7.55228475 0,7 L0,2
        C0,1.44771525 0.44771525,1 1,1 Z"></path>
                    </svg><span class="sc-fzXfOX cqEeVs">${data.pageCount}</span></div>
                    `
    }

    let ugoiraHTML = ''
    if (data.ugoiraInfo) {
      ugoiraHTML = `
        <svg viewBox="0 0 24 24" class="sc-fzXfOy jYSyFz sc-fzXfPK ctQOAQ" style="width: 48px; height: 48px;">
          <circle cx="12" cy="12" r="10" class="sc-fzXfOz cweSHm"></circle>
          <path d="M9,8.74841664 L9,15.2515834 C9,15.8038681 9.44771525,16.2515834 10,16.2515834
              C10.1782928,16.2515834 10.3533435,16.2039156 10.5070201,16.1135176 L16.0347118,12.8619342
              C16.510745,12.5819147 16.6696454,11.969013 16.3896259,11.4929799
              C16.3034179,11.3464262 16.1812655,11.2242738 16.0347118,11.1380658 L10.5070201,7.88648243
              C10.030987,7.60646294 9.41808527,7.76536339 9.13806578,8.24139652
              C9.04766776,8.39507316 9,8.57012386 9,8.74841664 Z"></path>
        </svg>`
    }

    let r18HTML = ''

    if (data.tags.includes('R-18') || data.tags.includes('R-18G')) {
      r18HTML = `
      <div class="sc-fzXfPe cycdFq">
        <div class="sc-fzXfPf cykAjz">
          <div class="sc-fzXfPb hGAKiq">R-18</div>
        </div>
      </div>`
    }

    const tagString = encodeURI(data.tags.join(' '))

    // 添加收藏的作品，让收藏图标变红
    const bookmarkedClass = 'bookmarked'
    const bookmarkedFlag = data.bookmarked ? bookmarkedClass : ''

    const html = `
    <li class="sc-LzNRw cflRkx" data-id="${data.idNum}">
    <div class="sc-fzXfQr loDYFF">
      <div class="sc-fzXfQp eLdrxs">
        <div width="184" height="184" class="sc-fzXfPc gqLFEG"><a target="_blank" class="sc-fzXfPH lgBvYG" href="/artworks/${data.idNum}">
            <!--顶部横幅-->
            <div class="sc-fzXfPd cxTHbh">

            <!--R-18 标记-->
            ${r18HTML}

            <!--多图作品标记-->
            ${multipleHTML}
              
            </div>
            <!--图片部分-->
            <div class="sc-fzXfPL jHchkG"><img
                   src="${data.thumb}"
                   alt="${data.title}" class="sc-fzXfPM eCelYP"
                   style="object-fit: cover; object-position: center center;">
              <!-- 动图 svg -->
              ${ugoiraHTML}
              </div>
          </a>
          <!--添加显示收藏数-->
          <div class="xz-bmkCount">${data.bmk}</div>
          <!--收藏按钮-->
          <div class="sc-fzXfQq cFrFLf">
            <div class="">
            <!-- button 添加了私有的 xz-addBMK 需要保留-->
            <button type="button" class="sc-fzXfOw cvFCUL xz-addBMK">
            <svg viewBox="0 0 32 32" width="32" height="32" class="sc-fzXfOs IJedw ${bookmarkedFlag}">
                  <path d="
    M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183
    C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5
    C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366
    C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path>
                  <path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5
    C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328
    C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5
    C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z"
                        class="sc-fzXfOr cuPtZS"></path>
                </svg></button></div>
          </div>
        <!--收藏按钮结束-->
        </div>
      </div>
      <!--标题名-->
      <a target="_blank" class="sc-fzXfQs cdGUCF" href="/artworks/${data.idNum}">${data.title}</a>
      <!--底部-->
      <div class="sc-fzXfQl cEBwQm">
      <!--作者信息-->
      <div class="sc-fzXfQm cEJTuv">
      <!--相比原代码，这里去掉了作者头像的 html 代码。因为抓取到的数据里没有作者头像。-->
          <a target="_blank" href="/member.php?id=${data.userid}">
            <div class="sc-fzXfQo ejPfKA">${data.user}</div>
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
    const addBMKBtn = li!.querySelector('.xz-addBMK') as HTMLButtonElement
    addBMKBtn.addEventListener('click', function() {
      const e = new CustomEvent('addBMK', {
        detail: { data: { id: data.idNum, tags: tagString } }
      })
      window.dispatchEvent(e)
      this.classList.add(bookmarkedClass)
    })
  }

  private addBookmark = (event: CustomEventInit) => {
    const data = event.detail.data as AddBMKData
    API.addBookmark(data.id.toString(), data.tags, API.getToken(), false)
    this.resultMeta.forEach(result => {
      if (result.idNum === data.id) {
        result.bookmarked = true
      }
    })
    // this.reAddResult()
  }

  // “开始筛选”完成后，保存筛选结果的元数据，并重排结果
  private onCrawlFinish = () => {
    if (this.crawlWorks) {
      this.crawled = true
      this.resultMeta = [...store.resultMeta]
      this.reAddResult()
    }
  }

  // 传入函数，过滤符合条件的结果
  private filterResult(callback: FilterCB) {
    if (!this.crawled) {
      return alert(lang.transl('_尚未开始筛选'))
    }
    if (this.resultMeta.length === 0) {
      return alert(lang.transl('_没有数据可供使用'))
    }

    centerPanel.close()

    log.clear()

    const nowLength = this.resultMeta.length // 储存过滤前的结果数量

    this.resultMeta = this.resultMeta.filter(callback)

    // 如果过滤后，作品元数据发生了改变，或者强制要求重新生成结果，才会重排作品。以免浪费资源。
    if (this.resultMeta.length !== nowLength || this.needReAdd) {
      this.reAddResult()
    }

    this.needReAdd = false
    this.crawlWorks = false
    // 发布 crawlFinish 事件，会在日志上显示下载数量。
    EVT.fire(EVT.events.crawlFinish)
  }

  // 当筛选结果的元数据改变时，重新生成抓取结果
  // 在此过程中，会清空之前的作品元素，重新生成作品元素
  private reAddResult() {
    store.resetResult()

    this.clearWorks()

    this.resultMeta.forEach(data => {
      const pNo = this.getPNo(data.pageCount)
      store.addResult(data, pNo)
    })

    EVT.fire(EVT.events.worksUpdate)

    titleBar.change('→')
  }

  // 在当前结果中再次筛选，会修改第一次筛选的结果
  private screenInResult() {
    if (!store.states.allowWork) {
      return alert(lang.transl('_当前任务尚未完成'))
    }

    log.clear()

    filter.init()

    this.getMultipleSetting()

    this.filterResult(data => {
      const filterOpt: FilterOption = {
        id: data.id,
        illustType: data.type,
        pageCount: data.pageCount,
        tags: data.tags,
        bookmarkCount: data.bmk,
        bookmarkData: data.bookmarked,
        width: data.fullWidth,
        height: data.fullHeight,
        createDate: data.date
      }

      return filter.check(filterOpt)
    })
  }

  // 清除多图作品
  private clearMultiple = () => {
    this.filterResult(data => {
      return data.pageCount <= 1
    })
  }

  // 清除动图作品
  private clearUgoira = () => {
    this.filterResult(data => {
      return !data.ugoiraInfo
    })
  }

  // 手动删除作品
  private deleteWork = (event: CustomEventInit) => {
    const el = event.detail.data as HTMLElement
    this.deleteId = parseInt(el.dataset.id!)

    this.filterResult(data => {
      return data.idNum !== this.deleteId
    })
  }

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
        id: nowData.illustId,
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
    store.resultMeta.sort(API.sortByProperty('bmk'))
    store.result.sort(API.sortByProperty('bmk'))
  }

  private onSettingChange = (event: CustomEventInit) => {
    const data = event.detail.data

    if (data.name === 'previewResult') {
      this.setPreviewResult(data.value)
    }

    if (this.optionsCauseResultChange.includes(data.name)) {
      this.needReAdd = true
    }
  }

  private setPreviewResult(value: boolean) {
    this.previewResult = value

    // 如果设置了“预览搜索结果”，则“不自动下载”。否则允许自动下载
    store.states.notAutoDownload = value ? true : false
  }
}

export { InitSearchPage }
