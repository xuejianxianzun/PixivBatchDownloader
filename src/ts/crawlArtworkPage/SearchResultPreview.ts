import { bookmark } from '../Bookmark'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { log } from '../Log'
import { msgBox } from '../MsgBox'
import { downloadOnClickBookmark } from '../download/DownloadOnClickBookmark'
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

/** 搜索页面中预览、筛选和维护抓取结果的模块 */
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
  /** 每次抓取完成后，储存当时所有结果，以备“在结果中筛选”使用 */
  private resultMeta: Result[] = []
  /** 搜索结果列表容器 */
  private worksWrap: HTMLElement | null = null
  /** 显示缓冲预览的定时器 */
  private showPreviewIntervalId = 0
  /** 修改这些设置后需要重新生成抓取结果 */
  private causeResultChange = [
    'onlyCrawlFirstFewImagesSwitch',
    'onlyCrawlFirstFewImagesCount',
  ]
  /** 当前抓取是否由搜索页的抓取按钮发起 */
  private crawlStartBySelf = false
  /** 当前抓取过程中已生成预览的作品数量 */
  private previewCount = 0
  /** 是否已提示预览数量达到上限 */
  private showPreviewLimitTip = false
  /** 缓存待插入页面的预览作品 */
  private workPreviewBuffer = document.createDocumentFragment()

  /** 初始化预览、结果变更和收藏相关事件 */
  public init() {
    window.addEventListener(EVT.list.addResult, this.showCount)
    window.addEventListener(EVT.list.resultChange, this.showCountOnLog)
    window.addEventListener('addBMK', this.addBookmark)
    window.addEventListener(EVT.list.clearMultiple, this.clearMultiple)
    window.addEventListener(EVT.list.clearUgoira, this.clearUgoira)
    window.addEventListener(EVT.list.deleteWork, this.deleteWork)

    this.showPreviewIntervalId = window.setInterval(() => {
      this.showPreview()
    }, 1000)
  }

  /** 移除预览模块注册的事件和定时器 */
  public destroy() {
    window.removeEventListener(EVT.list.addResult, this.showCount)
    window.removeEventListener(EVT.list.resultChange, this.showCountOnLog)
    window.removeEventListener('addBMK', this.addBookmark)
    window.removeEventListener(EVT.list.clearMultiple, this.clearMultiple)
    window.removeEventListener(EVT.list.clearUgoira, this.clearUgoira)
    window.removeEventListener(EVT.list.deleteWork, this.deleteWork)
    window.removeEventListener(EVT.list.addResult, this.createPreview)

    window.clearInterval(this.showPreviewIntervalId)
  }

  /** 开始由搜索页按钮发起的抓取，初始化预览结果状态 */
  public startCrawl() {
    this.resultMeta = []
    this.crawlStartBySelf = true

    window.addEventListener(EVT.list.addResult, this.createPreview)
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
    }

    return wrap
  }

  /** 在抓取结果中应用当前筛选条件 */
  public async filterResults() {
    if (states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

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

    this.resultMeta = [...store.resultMeta]

    // 搜索页面抓取完毕后会按收藏数量排序，因此清空旧预览并重新生成。
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

  /** 根据会影响结果的设置变更重新生成抓取结果 */
  public refreshResults(event: CustomEventInit) {
    if (states.crawlTagList) {
      return
    }
    const data = event.detail.data
    if (
      !this.causeResultChange.includes(data.name) ||
      store.result.length === 0
    ) {
      return
    }

    this.reAddResult()
    EVT.fire('resultChange')
  }

  /** 显示当前缓冲中的预览作品 */
  private showPreview() {
    if (this.workPreviewBuffer.firstChild && this.worksWrap) {
      this.worksWrap.appendChild(this.workPreviewBuffer)
    }
  }

  /** 更新搜索页面上显示的作品数量 */
  private showCount = () => {
    if (states.crawlTagList || !settings.previewResult) {
      return
    }

    if (settings.previewResult && this.countEl) {
      const count = this.resultMeta.length || store.resultMeta.length
      this.countEl.textContent = count.toString()
    }
  }

  private showCountOnLog = () => {
    const count = this.resultMeta.length || store.resultMeta.length
    log.success(
      lang.transl('_调整完毕', count.toString()),
      'showCountWhenResultChange'
    )
  }

  /** 根据新增的抓取结果创建预览卡片 */
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
    li.classList.add(SearchResultPreview.listClass)
    li.dataset.id = data.idNum.toString()
    li.innerHTML = html

    // 绑定收藏按钮的事件
    const addBMKBtn = li.querySelector(
      `.${this.addBMKBtnClass}`
    ) as HTMLButtonElement
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

  /** 清空本次抓取生成的预览作品列表 */
  private clearPreview() {
    if (!settings.previewResult || !this.crawlStartBySelf) {
      return
    }
    this.worksWrap = this.findWorksWrap()
    if (this.worksWrap) {
      this.worksWrap.innerHTML = ''
    }
    // 同时重置一些变量
    this.previewCount = 0
    this.showPreviewLimitTip = false
    this.workPreviewBuffer = document.createDocumentFragment()
  }

  /** 隐藏已从抓取结果中移除的预览作品 */
  private removeWorks(idList: string[]) {
    const listSelector = `#${this.workListWrapID} .${SearchResultPreview.listClass}`
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

  /** 根据传入的条件筛选抓取结果。
   * @param callback 用于筛选每条抓取结果的回调函数，返回 true 表示保留该条目，返回 false 表示移除该条目
   * @returns 如果无法开始执行筛选任务，会返回 false；如果可以执行筛选任务则返回 true
   */
  private async filterResult(callback: FilterCB) {
    if (this.resultMeta.length === 0) {
      // 可能的情况：
      // - 用户尚未开始抓取
      // - 用户已经开始抓取，但现在还没有任何抓取结果
      // - 用户刷新了页面之后，下载器会恢复保存的抓取结果，但不会恢复 resultMeta 数据，导致 this.resultMeta 为空
      toast.warning(lang.transl('_缺少必要的数据'))
      return false
    }

    if (store.resultMeta.length === 0 && store.result.length === 0) {
      toast.error(lang.transl('_没有可用的抓取结果'))
      return false
    }

    const beforeLength = this.resultMeta.length // 储存过滤前的结果数量
    const resultMetaTemp: Result[] = []
    const resultMetaRemoved: Result[] = []

    for (const meta of this.resultMeta) {
      try {
        if (await callback(meta)) {
          resultMetaTemp.push(meta)
        } else {
          resultMetaRemoved.push(meta)
        }
      } catch (err) {
        log.error(`filterResult error: ${err}`)
        resultMetaTemp.push(meta) // 出错时保留该条目，避免误删
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
    return true
  }

  /** 按照当前元数据重新构建抓取结果 */
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

  /** 从当前结果中移除多图作品 */
  private clearMultiple = () => {
    this.filterResult((data) => {
      return data.pageCount <= 1
    })
  }

  /** 从当前结果中移除动图作品 */
  private clearUgoira = () => {
    this.filterResult((data) => {
      return !data.ugoiraInfo
    })
  }

  /** 从当前结果中移除手动删除的作品 */
  private deleteWork = (event: CustomEventInit) => {
    const el = event.detail.data as HTMLElement
    const deleteId = parseInt(el.dataset.id!)

    this.filterResult((data) => {
      return data.idNum !== deleteId
    })
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
}

export { SearchResultPreview }
