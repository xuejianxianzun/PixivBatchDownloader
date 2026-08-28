import { theme } from '../Theme'
import { Tools } from '../Tools'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { EVT } from '../EVT'
import { ImageViewer } from '../ImageViewer'
import { Config } from '../Config'
import { cacheWorkData } from '../store/CacheWorkData'
import { states } from '../store/States'
import { lang } from '../Language'
import { msgBox } from '../MsgBox'
import { IDData, IDTypeString } from '../store/StoreType'

/**在多图作品页面里显示缩略图列表，并支持选择其中的部分图片进行下载 */
class DisplayThumbnailListOnMultiImageWorkPage {
  constructor() {
    this.bindEvents()
  }

  private readonly wrapperID = 'viewerWarpper'
  private readonly insertTarget = 'main figcaption'
  private readonly toolbarID = 'thumbnailListToolbar'
  private readonly selectorID = 'thumbnailListSelectorEl'
  private readonly selectedFlagClass = 'thumbnailSelectedFlag'
  /**选中标记里使用的 svg 图标，复用「手动选择作品」的图标 */
  private readonly selectFlagSvg =
    '<svg class="icon" aria-hidden="true"><use xlink:href="#select"></use></svg>'
  private waitTimer: number | undefined

  // 选择图片相关的状态
  /**是否处于手动选择图片的状态 */
  private selecting = false
  /**已选择的图片数据。每次 init 时重置为 undefined */
  private idData: IDData | undefined = undefined
  /**当前作品的 id */
  private workId = ''
  /**当前作品的类型（插画/漫画/动图） */
  private workType: IDTypeString = 'illusts'
  /** 这个作品里含有多少张图片。注意它不是索引，所以是从 1 开始的 */
  private pageCount = 1

  // 操作栏按钮
  private manualSelectBtn: HTMLButtonElement | undefined
  private selectAllBtn: HTMLButtonElement | undefined
  private clearBtn: HTMLButtonElement | undefined
  private helpBtn: HTMLButtonElement | undefined
  private downloadBtn: HTMLButtonElement | undefined
  // 光标跟随的选择标记
  private selectorEl: HTMLElement | undefined
  /**光标位置（始终跟踪，用于显示/定位选择标记） */
  private left = 0
  private top = 0
  /**选择标记的一半宽度，用于使其居中对齐光标 */
  private readonly half = 10

  private bindEvents() {
    // 持续跟踪光标位置，便于进入手动选择模式时让标记出现在当前光标处
    window.addEventListener('mousemove', this.onMouseMove, true)

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.init()
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'displayThumbnailListOnMultiImageWorkPage') {
        data.value ? this.init() : this.remove()
      }
    })
  }

  private init() {
    this.remove()

    if (!settings.displayThumbnailListOnMultiImageWorkPage) {
      return
    }

    if (
      pageType.type !== pageType.list.Artwork &&
      pageType.type !== pageType.list.Unlisted
    ) {
      return
    }

    // 每次进入页面都重置选择状态并退出选择模式
    this.selecting = false
    this.idData = undefined
    this.hideSelector()

    window.setTimeout(() => {
      this.display()
    }, 0)
  }

  private async display() {
    // 等待要插入的目标元素生成
    const target = document.querySelector(this.insertTarget)
    if (!target) {
      this.waitTimer = window.setTimeout(() => {
        this.display()
      }, 300)
      return
    }

    this.remove()

    // 把缩略图列表添加到页面上
    const id = Tools.getIllustId()
    const wrap = await this.createThumbList(id)
    if (wrap) {
      wrap.style.display = 'block'
      target.insertAdjacentElement('afterbegin', wrap)

      // 添加操作栏（全选 / 手动选择 / 清空 / 帮助 / 下载）
      this.addToolbar(wrap)

      // 为每个缩略图添加事件
      const images = wrap.querySelectorAll('li img')
      images.forEach((img) => {
        const li = img.parentElement as HTMLElement
        const index = Number.parseInt(li.dataset.index!)

        // 点击时打开图片查看器
        img.addEventListener('click', (ev) => {
          new ImageViewer({
            workId: id,
            initialViewIndex: index,
            imageSize: settings.magnifierSize,
            autoStart: true,
            showLoading: true,
          })
        })

        // 鼠标经过时把当前的 index 记录到 states 里，以便当用户预览这张图片或显示其大图时，能正确显示为这张图片
        img.addEventListener('mouseover', (ev) => {
          states.indexRecord[id] = index
        })
      })

      // 在容器上绑定捕获阶段的点击监听：进入手动选择模式后，拦截对图片的点击（阻止打开查看器），改为切换选中状态
      wrap.addEventListener('click', (ev) => this.onWrapClick(ev), true)
    }
  }

  private remove() {
    // 删除之前创建的元素，因为切换页面时它不会被自动清理
    document.querySelector(`#${this.wrapperID}`)?.remove()
    window.clearTimeout(this.waitTimer)
  }

  private async createThumbList(id: string): Promise<HTMLElement | undefined> {
    // 获取作品数据
    const unlisted = pageType.type === pageType.list.Unlisted
    const workData = await cacheWorkData.getWorkDataAsync(
      id,
      'artwork',
      unlisted
    )
    if (!workData) {
      return
    }
    const body = workData.body
    // 保存作品 id 与类型，供选择/下载时使用
    this.workId = id
    this.workType = Tools.getWorkTypeString(body.illustType)
    this.pageCount = body.pageCount || 1
    // 这个作品里至少有 2 张图片才会创建缩略图
    if (body.pageCount >= 2) {
      // 缩略图列表的结构： div#viewerWarpper > ul > li.xz-thumb-li > img + a
      const warpper = document.createElement('div')
      warpper.id = this.wrapperID
      const ul = document.createElement('ul')
      ul.classList.add('beautify_scrollbar')
      warpper.appendChild(ul)
      theme.register(warpper)

      // 生成 li 元素列表
      let liHtml: string[] = []
      for (let index = 0; index < body.pageCount; index++) {
        const thumbUrl = Tools.convertThumbURLTo540px(
          body.urls.thumb.replace('p0', 'p' + index)
        )
        const str = `<li data-index="${index}" class="${Config.ImageViewerLI}">
            <img src="${thumbUrl}" />
            <a href="${window.location.href}"></a>
          </li>`
        // a 标签是查找作品缩略图时用到的。如果没有 a 标签，就无法被识别为作品缩略图
        liHtml.push(str)
      }
      ul.innerHTML = liHtml.join('')
      return warpper
    }
  }

  /**在操作栏里添加选择/下载相关的按钮，并绑定事件 */
  private addToolbar(wrap: HTMLElement) {
    const toolbarHTML = `
      <div class="thumbnailListToolbar" id="${this.toolbarID}">
  <div class="thumbnailListToolbarLeft">
    <button
      class="blueTextBtn hasRippleAnimation"
      id="thumbnailListManualSelect"
      type="button"
    >
      <span data-xztext="_手动选择图片"></span><span class="ripple"></span>
    </button>
    <button
      class="blueTextBtn hasRippleAnimation"
      id="thumbnailListSelectAll"
      type="button"
    >
      <span data-xztext="_全选"></span><span class="ripple"></span>
    </button>
    <button
      class="blueTextBtn hasRippleAnimation thumbnailListClearBtn"
      id="thumbnailListClear"
      type="button"
    >
      <span data-xztext="_清空"></span><span class="ripple"></span>
    </button>
    <button class="thumbnailListHelpBtn" id="thumbnailListHelp" type="button">
      <span data-xztext="_帮助"></span><span class="ripple"></span>
    </button>
  </div>
  <div class="thumbnailListToolbarRight">
    <button
      class="blueTextBtn hasRippleAnimation"
      id="thumbnailListDownload"
      type="button"
    >
      <span data-xztext="_下载"></span><span class="ripple"></span>
    </button>
  </div>
</div>
`
    wrap.insertAdjacentHTML('afterbegin', toolbarHTML)

    // 应用 i18n
    const spans = wrap.querySelectorAll<HTMLElement>(
      `#${this.toolbarID} span[data-xztext]`
    )
    spans.forEach((span) => lang.register(span))

    // 获取按钮引用
    this.selectAllBtn = wrap.querySelector(
      '#thumbnailListSelectAll'
    ) as HTMLButtonElement
    this.manualSelectBtn = wrap.querySelector(
      '#thumbnailListManualSelect'
    ) as HTMLButtonElement
    this.clearBtn = wrap.querySelector(
      '#thumbnailListClear'
    ) as HTMLButtonElement
    this.helpBtn = wrap.querySelector('#thumbnailListHelp') as HTMLButtonElement
    this.downloadBtn = wrap.querySelector(
      '#thumbnailListDownload'
    ) as HTMLButtonElement

    // 绑定事件
    this.selectAllBtn.addEventListener('click', () => this.selectAllImages())
    this.manualSelectBtn.addEventListener('click', () => this.toggleSelecting())
    this.clearBtn.addEventListener('click', () => this.clearSelected())
    this.helpBtn.addEventListener('click', () => this.showHelp())
    this.downloadBtn.addEventListener('click', () => this.downloadSelected())
  }

  /**确保 idData 已存在，并建立基础的 id 与 type */
  private ensureIdData() {
    if (!this.idData) {
      this.idData = {
        id: this.workId,
        type: this.workType,
        downloadIndexes: [],
      }
    }
  }

  /**全选：选择所有图片 */
  private selectAllImages() {
    this.ensureIdData()
    this.idData!.downloadIndexes = this.getAllIndexes()
    this.updateImageFlags()
  }

  /**切换手动选择模式 */
  private toggleSelecting() {
    this.selecting = !this.selecting
    if (this.selecting) {
      this.showSelector()
      this.manualSelectBtn?.classList.add('active')
    } else {
      this.hideSelector()
      this.manualSelectBtn?.classList.remove('active')
    }
  }

  /**清空：重置 idData 并移除所有选择标记（不退出选择模式） */
  private clearSelected() {
    this.idData = undefined
    this.updateImageFlags()
  }

  /**显示帮助信息 */
  private showHelp() {
    msgBox.show(lang.transl('_为多图作品里的图片选择帮助'), {
      title: lang.transl('_手动选择图片'),
    })
  }

  /**下载：根据选择情况构造 idData 并触发抓取 */
  private downloadSelected() {
    let dataToSend: IDData
    if (
      this.idData &&
      this.idData.downloadIndexes &&
      this.idData.downloadIndexes.length > 0
    ) {
      // 有已选择的图片，使用带 downloadIndexes 的数据（只下载选中的图片）
      dataToSend = this.idData
    } else {
      // 没有选择任何图片（或未开始选择）：构造不含 downloadIndexes 的临时数据，下载作品里的全部图片
      dataToSend = {
        id: this.workId,
        type: this.workType,
      }
    }

    EVT.fire('crawlIdList', [dataToSend])
    // 退出选择模式
    this.exitSelecting()
  }

  /**退出手动选择模式 */
  private exitSelecting() {
    this.selecting = false
    this.hideSelector()
    this.manualSelectBtn?.classList.remove('active')
  }

  /**容器上的捕获阶段点击监听。进入手动选择模式后，拦截图片点击、切换选中状态并阻止打开查看器 */
  private onWrapClick(ev: MouseEvent) {
    if (!this.selecting) {
      return
    }

    // 只有点击在缩略图（li.xz-thumb-li）上时才处理，操作栏按钮的点击不拦截
    const li = (ev.target as HTMLElement).closest(
      `li.${Config.ImageViewerLI}`
    ) as HTMLElement | null
    if (!li) {
      return
    }

    const index = Number.parseInt(li.dataset.index!)
    if (Number.isNaN(index)) {
      return
    }

    // 阻止事件继续下传到 img 上的查看器监听，并阻止默认行为
    ev.stopPropagation()
    ev.preventDefault()
    this.toggleSelectImage(index)
  }

  /**切换单张图片的选中状态 */
  private toggleSelectImage(index: number) {
    this.ensureIdData()
    const list = this.idData!.downloadIndexes!
    const i = list.indexOf(index)
    if (i === -1) {
      list.push(index)
    } else {
      list.splice(i, 1)
    }
    this.updateImageFlags()
  }

  /**获取当前作品里所有图片的 index */
  private getAllIndexes(): number[] {
    const indexes: number[] = []
    for (let i = 0; i < this.pageCount; i++) {
      indexes.push(i)
    }
    return indexes
  }

  /**根据 idData.downloadIndexes，为列表里的图片同步选择标记 */
  private updateImageFlags() {
    const lis = document.querySelectorAll<HTMLElement>(
      `#${this.wrapperID} li.${Config.ImageViewerLI}`
    )
    const selected = this.idData?.downloadIndexes
    lis.forEach((li) => {
      const index = Number.parseInt(li.dataset.index!)
      const isSelected = selected ? selected.includes(index) : false
      this.setFlag(li, isSelected)
    })
  }

  /**为单个缩略图添加或移除选择标记 */
  private setFlag(li: HTMLElement, selected: boolean) {
    const existing = li.querySelector(`.${this.selectedFlagClass}`)
    if (selected && !existing) {
      const i = document.createElement('i')
      i.classList.add(this.selectedFlagClass)
      // 选中标记复用「手动选择作品」的图标（一个对号的 svg 符号）
      i.innerHTML = this.selectFlagSvg
      li.insertAdjacentElement('afterbegin', i)
      // 如果容器没有定位，会导致标记位置异常。修复此问题
      const position = window.getComputedStyle(li)['position']
      if (!['relative', 'absolute', 'fixed'].includes(position)) {
        li.style.position = 'relative'
      }
    } else if (!selected && existing) {
      existing.remove()
    }
  }

  /**显示光标跟随的选择标记 */
  private showSelector() {
    if (!this.selectorEl) {
      this.selectorEl = document.createElement('div')
      this.selectorEl.id = this.selectorID
      document.body.appendChild(this.selectorEl)
    }
    this.selectorEl.style.display = 'flex'
    // 立即定位到当前光标处（避免初始显示在左上角），并居中对齐光标
    this.selectorEl.style.left = this.left - this.half + 'px'
    this.selectorEl.style.top = this.top - this.half + 'px'
  }

  /**隐藏光标跟随的选择标记 */
  private hideSelector() {
    if (this.selectorEl) {
      this.selectorEl.style.display = 'none'
    }
  }

  /**跟踪光标位置；进入手动选择模式时让选择标记跟随光标并居中对齐 */
  private onMouseMove = (ev: MouseEvent) => {
    this.left = ev.clientX
    this.top = ev.clientY
    if (this.selecting && this.selectorEl) {
      this.selectorEl.style.left = this.left - this.half + 'px'
      this.selectorEl.style.top = this.top - this.half + 'px'
    }
  }

  /**检查目标元素是否是 ImageViewer 生成的 li 元素，以便进行特殊处理 */
  public checkLI(el?: HTMLElement) {
    return el?.classList.contains(Config.ImageViewerLI)
  }
}

const displayThumbnailListOnMultiImageWorkPage =
  new DisplayThumbnailListOnMultiImageWorkPage()
export { displayThumbnailListOnMultiImageWorkPage }
