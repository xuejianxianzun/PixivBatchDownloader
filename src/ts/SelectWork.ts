import { Tools } from './Tools'
import { lang } from './Language'
import { EVT } from './EVT'
import { workSelection } from './WorkSelection'
import { IDData, IDTypeString } from './store/StoreType'
import { toast } from './Toast'
import { msgBox } from './MsgBox'
import { Utils } from './utils/Utils'
import { artworkThumbnail } from './ArtworkThumbnail'
import { novelThumbnail } from './NovelThumbnail'
import { pageType } from './PageType'
import { showOneTimeMsg } from './ShowOneTimeMsg'
import { Config } from './Config'
import { displayThumbnailListOnMultiImageWorkPage } from './pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'

// 手动选择作品，图片作品和小说都可以选择
class SelectWork {
  constructor() {
    // 符合条件时才会创建“手动选择作品”的按钮
    // 注意：由于这个初始化步骤只会执行一次，所以如果在这里不创建按钮的话，之后即使切换到符合条件的页面里，也依然是没有按钮的
    if (Utils.isPixiv()) {
      this.selector = this.createSelectorEl()
      this.addBtn()
      this.bindEvents()
    }
  }

  private selector?: HTMLElement // 用于选择作品的指示器
  private selectorId = 'selectWorkEl'
  private left = 0
  private top = 0
  private half = 10 // 指示器的一半宽度（用于设置位置）

  private _start = false
  private _pause = false
  private _tempHide = false // 打开下载面板时临时隐藏。这个变量只会影响选择器的 display

  private disablePageList = [pageType.list.Unlisted]

  get start() {
    return workSelection.selectActive
  }

  set start(bool: boolean) {
    if (bool) {
      workSelection.enterSelectMode()
    } else {
      workSelection.exitSelectMode()
    }
  }

  get pause() {
    return workSelection.selectPaused
  }

  set pause(bool: boolean) {
    workSelection.setSelectPaused(bool)
  }

  get tempHide() {
    return this._tempHide
  }

  set tempHide(bool: boolean) {
    this._tempHide = bool
    this.updateSelectorEl()
  }

  private controlBtn: HTMLButtonElement = document.createElement('button') // 启动、暂停、继续选择的按钮
  private controlTextSpan: HTMLSpanElement = document.createElement('span') // 按钮里的文字
  private crawlBtn: HTMLButtonElement = document.createElement('button') // 抓取选择的作品的按钮，并且会退出选择模式
  private crawlTextSpan: HTMLSpanElement = document.createElement('span') // 按钮里的文字
  private clearBtn: HTMLButtonElement = document.createElement('button') // 清空选择的作品的按钮
  private selectAllBtn: HTMLButtonElement = document.createElement('button') // 全选当前显示的作品的按钮

  private selectedWorkFlagClass = 'selectedWorkFlag' // 给已选择的作品添加标记时使用的 class
  private positionValue = ['relative', 'absolute', 'fixed'] // 标记元素需要父元素拥有这些定位属性

  // 储存当前页面的作品列表容器
  private worksWrapper: HTMLElement = document.body
  private ob: MutationObserver | undefined = undefined

  /** 当前已手动选择的作品 id 列表 */
  private get idList() {
    return workSelection.selectIdList
  }

  private sendCrawl = false // 它用来判断抓取的是不是选择的作品。抓取选择的作品时激活此标记；当触发下一次的抓取完成事件时，表示已经抓取了选择的作品。
  private crawled = false // 是否已经抓取了选择的作品

  private readonly svg = `<svg class="icon" aria-hidden="true">
  <use xlink:href="#select"></use>
</svg>`

  private bindEscEvent!: (ev: KeyboardEvent) => void | undefined

  private bindEvents() {
    artworkThumbnail.onClick((el: HTMLElement, id: string, ev: Event) => {
      this.clickThumbnail(el, id, ev, 'illusts')
    })

    novelThumbnail.onClick(
      (
        el: HTMLElement,
        id: string,
        ev: Event,
        type: 'novels' | 'novelSeries'
      ) => {
        this.clickThumbnail(el, id, ev, type)
      }
    )

    document.body.addEventListener(
      Config.mobile ? 'touchend' : 'click',
      (ev: Event) => {
        this.clickElement(ev.target as HTMLElement, ev)
      },
      true
    )

    window.addEventListener(EVT.list.openSettingsPanel, () => {
      this.tempHide = true
    })

    window.addEventListener(EVT.list.closeSettingsPanel, () => {
      this.tempHide = false
    })

    window.addEventListener(EVT.list.crawlComplete, () => {
      if (this.sendCrawl) {
        this.sendCrawl = false
        this.crawled = true
      }
    })

    window.addEventListener(EVT.list.commandToggleSelectWork, () => {
      this.toggleSelectWork()
    })

    // 鼠标移动时保存鼠标的坐标
    window.addEventListener(
      'mousemove',
      (ev) => {
        this.moveEvent(ev)
      },
      true
    )

    // 离开页面前提示用户
    // 如果把此处的 window.onbeforeunload 换成 window.addEventListener('beforeunload') 会出现问题
    // 浏览器不会弹出询问对话框，而是直接关闭页面
    window.onbeforeunload = () => {
      // 如果存在选择的作品，并且选择的作品（全部或部分）没有被抓取，则进行提示
      if (this.idList.length > 0 && !this.crawled) {
        msgBox.error(lang.transl('_离开页面前提示选择的作品未抓取'), {
          btn: lang.transl('_我知道了'),
        })
        return false
      }
    }

    // 每次页面切换之后，查找新的作品列表容器并保存
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.worksWrapper = document.body
    })

    // 每次页面切换之后，查找新显示的作品里是否有之前被选择的作品，如果有则为其添加标记
    // 因为 pixiv 的页面切换会导致作品列表变化，之前添加的标记也就没有了，需要重新添加
    window.addEventListener(EVT.list.pageSwitch, () => {
      // 每次触发时都要断开之前绑定的观察器，否则会导致事件重复绑定
      // 因为 pageSwitch 事件可能会触发多次，如果不断开之前的观察器，那么每切换一次页面就会多绑定和执行一个回调
      this.ob && this.ob.disconnect()

      this.ob = new MutationObserver(
        Utils.debounce(() => {
          this.reAddAllFlag()
        }, 300)
      )

      this.ob.observe(this.worksWrapper, {
        childList: true,
        subtree: true,
      })
    })

    // 当“手动选择作品”或“手动排除作品”的状态变化时，同步 UI
    window.addEventListener(EVT.list.workSelectionChange, () => {
      this.updateSelectorEl()
      this.updateControlBtn()
    })

    // 当一个作品被排除、并且它之前被选择时，移除其选择标记
    window.addEventListener(
      EVT.list.selectWorkRemovedExternally,
      (ev: CustomEventInit) => {
        const id = ev.detail.data as string
        this.removeSelectedFlag(id)
        this.updateCrawlBtn()
      }
    )
  }

  private clearIdList() {
    // 清空标记需要使用 id 数据，所以需要执行之后才能清空 id
    this.removeAllSelectedFlag()
    workSelection.clearSelect()
    this.updateCrawlBtn()
  }

  private createSelectorEl() {
    const el = document.createElement('div')
    el.id = this.selectorId
    document.body.appendChild(el)
    return el
  }

  private updateSelectorEl() {
    if (!this.selector) {
      return
    }

    const show = this.canSelect() && !this.tempHide

    this.selector.style.display = show ? 'flex' : 'none'
    // 设置元素的 style 时，如果新的值和旧的值相同（例如：每次都设置 display 为 none），Chrome 会自动优化，此时不会导致节点发生变化。

    // 如果选择器处于隐藏状态，就不会更新其坐标。这样可以优化性能
    if (show) {
      this.selector.style.left = this.left - this.half + 'px'
      this.selector.style.top = this.top - this.half + 'px'
    }
  }

  private addBtn() {
    this.controlBtn = Tools.addBtn(
      'selectWorkBtns',
      '_手动选择作品',
      '',
      'manuallySelectWork',
      'secondary',
      'brand'
    )
    this.controlTextSpan = this.controlBtn.querySelector('span')!
    this.updateControlBtn()

    // 全选当前显示的作品。这个按钮始终显示，不依赖手动选择作品模式
    this.selectAllBtn = Tools.addBtn(
      'selectWorkBtns',
      '_全选当前显示的作品',
      '',
      'selectAllWorks',
      'secondary',
      'brand'
    )
    this.selectAllBtn.addEventListener('click', () => {
      this.selectAll()
    })

    this.crawlBtn = Tools.addBtn(
      'selectWorkBtns',
      '_抓取选择的作品',
      '',
      'crawlSelectedWork',
      'secondary',
      'brand'
    )
    this.crawlBtn.style.display = 'none'
    this.crawlBtn.addEventListener('click', (ev) => {
      this.sendDownload()
    })
    this.crawlTextSpan = this.crawlBtn.querySelector('span')!

    this.clearBtn = Tools.addBtn(
      'selectWorkBtns',
      '_清空选择的作品',
      '',
      'clearSelectedWork',
      'secondary',
      'danger'
    )
    this.clearBtn.style.display = 'none'
    this.clearBtn.addEventListener('click', () => {
      this.clearIdList()
      this.clearBtn.style.display = 'none'
      this.crawlBtn.style.display = 'none'
    })
  }

  // 切换控制按钮的文字和点击事件
  private updateControlBtn() {
    if (!this.start) {
      lang.updateText(this.controlTextSpan, '_手动选择作品')
      this.controlBtn.onclick = (ev) => {
        const disable = this.disablePageList.includes(pageType.type)
        if (disable) {
          msgBox.warning(lang.transl('_不支持在此页面上手动选择作品'), {
            title: lang.transl('_手动选择作品'),
          })
          return
        }

        this.startSelect(ev)
        this.clearBtn.style.display = 'flex'
        if (!Config.mobile) {
          showOneTimeMsg.show(
            'tipAltSToSelectWork',
            lang.transl('_快捷键ALTS手动选择作品')
          )
        }
      }
    } else {
      if (!this.pause) {
        lang.updateText(this.controlTextSpan, '_暂停选择')
        this.controlBtn.onclick = (ev) => {
          this.pauseSelect()
        }
      } else {
        lang.updateText(this.controlTextSpan, '_继续选择')
        this.controlBtn.onclick = (ev) => {
          this.startSelect(ev)
        }
      }
    }
  }

  // 在选择作品的数量改变时，在抓取按钮上显示作品数量
  private updateCrawlBtn() {
    this.crawlBtn.style.display =
      this.idList.length > 0 || this.start ? 'flex' : 'none'
    if (this.idList.length > 0) {
      lang.updateText(
        this.crawlTextSpan,
        '_抓取选择的作品2',
        this.idList.length.toString()
      )
      this.clearBtn.style.display = 'flex'
    } else {
      lang.updateText(this.crawlTextSpan, '_抓取选择的作品')
    }
  }

  private addId(el: HTMLElement, id: string, type: IDTypeString) {
    // 添加这个 id，或从列表里移除它（toggle）
    const title =
      type === 'novelSeries' ? Tools.getSeriesTitleFromElement(el, id) : ''
    const added = workSelection.toggleSelectId(id, type, title)
    if (added) {
      this.crawled = false
      this.addSelectedFlag(el, id, type)
    } else {
      this.removeSelectedFlag(id)
    }
    this.updateCrawlBtn()
  }

  /** 全选当前页面上显示的所有作品。
   * 仅添加，不反选，也不改变或退出任何模式状态（手动选择/排除等）。
   * 选择范围只限当前页面已显示的 .ppd-workThumbnail 作品。 */
  private selectAll() {
    const elements =
      document.querySelectorAll<HTMLElement>('.ppd-workThumbnail')
    for (const el of elements) {
      // 跳过多图作品的页面缩略图（这些是作品里的单张图片，而非作品本身）
      if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
        continue
      }

      let id = el.dataset.workid
      let type = el.dataset.worktype as IDTypeString
      if (!id || !type) {
        continue
      }

      // 对于小说或系列小说，尝试从元素里获取 id 和类型。因为在极少数情况下，一个小说或系列的缩略图里的内容可能会变化，导致传入的数据不再准确。
      if (type === 'novels' || type === 'novelSeries') {
        const idData = Tools.getNovelOrSeriesIDData(el)
        if (idData) {
          id = idData.id
          type = idData.type
        } else {
          continue
        }
      }

      const title =
        type === 'novelSeries' ? Tools.getSeriesTitleFromElement(el, id) : ''
      workSelection.addSelectId(id, type, title)
      this.crawled = false
      this.addSelectedFlag(el, id, type)
    }

    if (this.idList.length > 0) {
      // 有已选择的作品时，显示抓取按钮和清空按钮
      this.updateCrawlBtn()
      this.clearBtn.style.display = 'flex'
      toast.success(lang.transl('_已全选'))
    } else {
      toast.warning(lang.transl('_没有找到任何作品'))
    }
  }

  private clickThumbnail(
    el: HTMLElement,
    id: string,
    ev: Event,
    type: IDTypeString
  ) {
    if (!this.canSelect()) {
      return
    }

    // 如果点击的元素是作品缩略图里的收藏按钮，则不选择这个作品，这样可以让收藏按钮发挥作用
    // 注意这些 nodeName 是小写的
    const target = ev.target as HTMLElement
    if (target && (target.nodeName === 'svg' || target.nodeName === 'path')) {
      return
    }

    // 如果点击的是多图作品页面里的作品缩略图，则不选择这个作品
    if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
      return
    }

    // 真实点击的元素
    // console.log(ev.target)
    // 绑定了这个事件的元素
    // console.log(ev.currentTarget)

    if (!id || id === '0') {
      id = Tools.findWorkIdFromElement(
        el,
        type === 'novels' ? 'novels' : 'illusts'
      )
    }

    // 对于小说或系列小说，尝试从元素里获取 id 和类型。因为在极少数情况下，一个小说或系列的缩略图里的内容可能会变化，导致传入的数据不再准确。
    if (type === 'novels' || type === 'novelSeries') {
      const idData = Tools.getNovelOrSeriesIDData(el)
      if (idData) {
        id = idData.id
        type = idData.type
      } else {
        id = ''
      }
    }

    // 阻止默认事件，否则会进入作品页面，导致无法在当前页面继续选择
    ev.preventDefault()
    ev.stopPropagation()

    // 仅当有 id 时才添加到选择列表里
    id && this.addId(el, id, type)
  }

  private clickElement(el: HTMLElement, ev: Event) {
    if (!this.canSelect()) {
      return
    }

    if (!el) {
      return
    }

    // 添加已选择的标记的目标元素，通常是点击的元素的父元素
    let addFlagTarget = el.parentElement!
    // 查找 A 标签，获取作品 id
    let a: HTMLAnchorElement | null = null

    if (el.nodeName === 'A') {
      a = el as HTMLAnchorElement
    } else {
      // 处理点击在动图的播放图标上的情况
      // 如果不针对性处理，就会导致选择无效，并正常进入这个动图的作品页面，打断选择操作
      if (
        el.nodeName === 'svg' ||
        el.nodeName === 'path' ||
        el.nodeName === 'circle'
      ) {
        a = el.closest('a')
        if (a) {
          // 当在播放图标上点击时，把插入目标点设置为 a 的父元素，而非 svg 元素，否则会导致已选择的标记无法显示
          addFlagTarget = a!.parentElement!
        }
      }
    }

    if (!a || !a.href) {
      return
    }

    const href = a.href
    const artworkId = Tools.getIllustId(href)
    if (artworkId) {
      ev.preventDefault()
      // 如果查找到了作品 id，必须阻止冒泡，否则会执行 clickThumbnail
      ev.stopPropagation()
      this.addId(addFlagTarget, artworkId, 'illusts')
      return
    }

    const novelId = Tools.getNovelId(href)
    if (novelId) {
      ev.preventDefault()
      ev.stopPropagation()
      this.addId(addFlagTarget, novelId, 'novels')
      return
    }

    // 如果没有查找到小说 id，可能是系列小说，此时尝试查找系列 id
    const seriesId = Tools.getNovelSeriesId(href)
    if (seriesId) {
      ev.preventDefault()
      ev.stopPropagation()
      this.addId(addFlagTarget, seriesId, 'novelSeries')
      return
    }
  }

  // 监听鼠标移动
  // 鼠标移动时，由于事件触发频率很高，所以这里的代码也会执行很多次，但是这没有导致明显的性能问题，所以没有使用节流等加以限制
  private moveEvent(ev: MouseEvent) {
    this.left = ev.x
    this.top = ev.y
    this.updateSelectorEl()
  }

  // 按 Esc 键时暂停选择
  private escEvent(ev: KeyboardEvent) {
    if (ev.code === 'Escape') {
      this.pauseSelect()
    }
  }

  // 开始或继续选择
  private startSelect(ev: MouseEvent) {
    this.start = true
    // 进入选择模式时，确保处于“活动中、未暂停”的状态。
    // 不在这里清空已选择的作品，选择的列表会一直保留，直到用户点击“清空选择的作品”按钮为止。
    // 这样可以避免切换到“手动排除作品”模式再切回来时，之前选择的作品被误清空。
    this.pause = false

    this.bindEscEvent = this.escEvent.bind(this)
    window.addEventListener('keydown', this.bindEscEvent)

    EVT.fire('closeSettingsPanel')
  }

  private pauseSelect() {
    this.pause = true
    this.bindEscEvent &&
      window.removeEventListener('keydown', this.bindEscEvent)
  }

  private canSelect() {
    return this.start && !this.pause
  }

  /** 启动或暂停手动选择作品（模拟点击控制按钮） */
  private toggleSelectWork() {
    this.controlBtn.click()
  }

  // 抓取选择的作品，这会自动暂停手动选择作品
  private async sendDownload() {
    if (this.idList.length === 0) {
      return toast.warning(lang.transl('_没有数据可供使用'))
    }

    this.pauseSelect()

    EVT.fire('crawlIdList', this.idList)
    this.sendCrawl = true
    this.crawled = false
  }

  // 给这个作品添加标记
  private addSelectedFlag(
    wrap: HTMLElement,
    id: string,
    type: IDTypeString = 'illusts'
  ) {
    // 同一个作品可能有多个缩略图元素，所以要在每个缩略图上都添加标记
    let allThisIdWorks = document.querySelectorAll<HTMLElement>(
      `.ppd-workThumbnail[data-workid='${id}'][data-worktype='${type}']`
    )
    // 如果没有找到缩略图元素，可能是因为 type 是系列小说。系列小说没有上面的两个 data 属性
    if (allThisIdWorks.length === 0) {
      allThisIdWorks = [wrap] as any
    }

    for (const el of allThisIdWorks) {
      if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
        continue
      }

      // 如果这个缩略图里已经存在标记，就不需要重复添加
      const existingFlag = el.querySelector(`.${this.selectedWorkFlagClass}`)
      if (existingFlag) {
        continue
      }

      const i = document.createElement('i')
      i.classList.add(this.selectedWorkFlagClass)
      i.dataset.id = id
      i.dataset.type = type
      i.innerHTML = this.svg
      el.insertAdjacentElement('afterbegin', i)

      // 如果容器没有某些定位，可能会导致下载器添加的标记的位置异常。修复此问题
      const position = window.getComputedStyle(el)['position']
      if (!this.positionValue.includes(position)) {
        el.style.position = 'relative'
      }
    }
  }

  // 重新添加被选择的作品上的标记
  private reAddAllFlag() {
    if (this.idList.length === 0) {
      return
    }

    for (const { id, type } of this.idList) {
      let el: HTMLAnchorElement | null
      if (type === 'novels') {
        el = document.querySelector(`body a[href="/novel/show.php?id=${id}"]`)
      } else {
        el = document.querySelector(`body a[href="/artworks/${id}"]`)
      }

      if (el) {
        // 如果在当前页面查找到了选择的作品，就给它添加标记
        this.addSelectedFlag(el, id, type)
      }
    }
  }

  private getSelectedFlag(id: string) {
    return document.querySelectorAll(
      `.${this.selectedWorkFlagClass}[data-id='${id}']`
    )
  }

  // 清空指定作品的标记
  private removeSelectedFlag(id: string) {
    const els = this.getSelectedFlag(id)
    els.forEach((el) => el.remove())
  }

  // 清空所有标记
  private removeAllSelectedFlag() {
    for (const item of this.idList) {
      this.removeSelectedFlag(item.id)
    }
  }
}

const selectWork = new SelectWork()
export { selectWork }
