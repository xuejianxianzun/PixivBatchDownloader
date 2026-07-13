import { lang } from '../Language'
import { LangTextKey } from '../langText'
import { optionConfigs } from './OptionConfigs'
import { OptionCategoryLevel1 } from './Settings'
import { FormType } from './FormType'
import { SettingsPanelHelp } from './SettingsPanelHelp'
import { FoldableSection, PageId, pageIds } from './SettingsPanelTypes'

type SettingsPanelLayoutResult = {
  pageEls: Map<PageId, HTMLDivElement>
  stickyEls: Map<PageId, HTMLButtonElement>
  navEls: Map<PageId, HTMLButtonElement>
  foldableSections: Map<string, FoldableSection>
  canonicalContainers: Map<string, HTMLDivElement>
  homePinnedContent: HTMLDivElement
  searchRoot: HTMLDivElement
}

/** 设置面板的布局构建器 */
// - 负责页面容器创建
// - 首页 / 分类页 / 帮助页的 DOM 构建
// - 持久化 section 的 DOM 创建与注册
// - 首页“附加功能”区域显隐观察
class SettingsPanelLayout {
  constructor({
    form,
    centerPanel,
    optionElements,
    getExpandedState,
    applyExpandedState,
    toggleSection,
    makeSectionKey,
    makeCanonicalKey,
  }: {
    form: FormType
    centerPanel: HTMLDivElement
    optionElements: Map<number, HTMLElement>
    getExpandedState: (section: FoldableSection) => boolean
    applyExpandedState: (section: FoldableSection, expanded: boolean) => void
    toggleSection: (section: FoldableSection) => void
    makeSectionKey: (page: PageId, id: string) => string
    makeCanonicalKey: (level1: OptionCategoryLevel1, level2: string) => string
  }) {
    this.form = form
    this.centerPanel = centerPanel
    this.optionElements = optionElements
    this.getExpandedState = getExpandedState
    this.applyExpandedState = applyExpandedState
    this.toggleSection = toggleSection
    this.makeSectionKey = makeSectionKey
    this.makeCanonicalKey = makeCanonicalKey
  }

  private form: FormType
  private centerPanel: HTMLDivElement
  private optionElements: Map<number, HTMLElement>
  private getExpandedState: (section: FoldableSection) => boolean
  private applyExpandedState: (
    section: FoldableSection,
    expanded: boolean
  ) => void
  private toggleSection: (section: FoldableSection) => void
  private makeSectionKey: (page: PageId, id: string) => string
  private makeCanonicalKey: (
    level1: OptionCategoryLevel1,
    level2: string
  ) => string

  private readonly pageEls = new Map<PageId, HTMLDivElement>()
  private readonly pageInners = new Map<PageId, HTMLDivElement>()
  private readonly stickyEls = new Map<PageId, HTMLButtonElement>()
  private readonly navEls = new Map<PageId, HTMLButtonElement>()
  private readonly foldableSections = new Map<string, FoldableSection>()
  private readonly canonicalContainers = new Map<string, HTMLDivElement>()
  private homePinnedContent!: HTMLDivElement
  private otherBtnsVisibilityObserver?: MutationObserver

  public build(): SettingsPanelLayoutResult {
    const crawlBtnsBlock = this.createSlotBlock([
      'stopCrawl',
      'crawlBtns',
      'selectWorkBtns',
    ])
    const otherBtnsBlock = this.createSlotBlock(['otherBtns'])
    const downloadBtnsBlock = this.createSlotBlock([
      'exportResult',
      'namingBtns',
    ])
    const downloadEmptyHint = this.createDownloadEmptyHint()
    const downloadArea = this.createSlot('downloadArea')
    const progressBar = this.createSlot('progressBar')

    const pagesWrap = document.createElement('div')
    pagesWrap.className = 'settingsPanel_pages'

    this.form.classList.add('settingsPanel_form')
    this.form.replaceChildren(pagesWrap)

    this.cacheNavElements()

    pageIds.forEach((page) => {
      const pageEl = document.createElement('div')
      pageEl.className = 'settingsPanel_page'
      pageEl.dataset.page = page

      const sticky = document.createElement('button')
      sticky.type = 'button'
      sticky.className = 'settingsPanel_stickyHeader'
      sticky.hidden = true
      sticky.innerHTML = `
      <span class="settingsPanel_sectionHeadMain">
        <span class="settingsPanel_sectionIconWrap hidden">
          <svg class="icon" aria-hidden="true">
            <use xlink:href=""></use>
          </svg>
        </span>
        <span class="settingsPanel_sectionTitle"></span>
      </span>
      <svg class="icon settingsPanel_sectionArrow" aria-hidden="true">
        <use xlink:href="#arrow-down-2"></use>
      </svg>
      `
      pageEl.append(sticky)

      const inner = document.createElement('div')
      inner.className = 'settingsPanel_pageInner'
      pageEl.append(inner)

      pagesWrap.append(pageEl)
      this.pageEls.set(page, pageEl)
      this.pageInners.set(page, inner)
      this.stickyEls.set(page, sticky)
    })

    this.buildHomePage(
      crawlBtnsBlock,
      otherBtnsBlock,
      downloadBtnsBlock,
      downloadEmptyHint,
      downloadArea,
      progressBar
    )
    this.buildCategoryPages()
    this.buildHelpPage()

    for (const option of this.optionElements.values()) {
      option.classList.add('settingsPanel_optionCard')
    }

    lang.register(pagesWrap)

    return {
      pageEls: this.pageEls,
      stickyEls: this.stickyEls,
      navEls: this.navEls,
      foldableSections: this.foldableSections,
      canonicalContainers: this.canonicalContainers,
      homePinnedContent: this.homePinnedContent,
      searchRoot: this.pageInners.get('search') as HTMLDivElement,
    }
  }

  private cacheNavElements() {
    const navButtons = this.centerPanel.querySelectorAll(
      '.settingsPanel_navItem'
    ) as NodeListOf<HTMLButtonElement>
    navButtons.forEach((button) => {
      this.navEls.set(button.dataset.page as PageId, button)
    })
  }

  private buildHomePage(
    crawlBtnsBlock: HTMLDivElement,
    otherBtnsBlock: HTMLDivElement,
    downloadBtnsBlock: HTMLDivElement,
    downloadEmptyHint: HTMLDivElement,
    downloadArea: HTMLElement,
    progressBar: HTMLElement
  ) {
    const home = this.pageInners.get('home')!

    const homeTipsWrap = document.createElement('div')
    homeTipsWrap.className = 'settingsPanel_helpTips settingsPanel_homeTips'
    homeTipsWrap.innerHTML = `
    <div class="settingsPanel_tipCard" id="tipCloseAskFileSaveLocation">
      <svg class="icon settingsPanel_tipIcon" aria-hidden="true"><use xlink:href="#light-line"></use></svg>
      <div class="settingsPanel_tipText">
        <span class="settingsPanel_tipTextContent">
          <span data-xztext="_建议您关闭询问文件保存位置"></span>
          <button class="settingsPanel_tipConfirm" type="button" data-xztitle="_已确认">
            <svg class="icon" aria-hidden="true"><use xlink:href="#yes"></use></svg>
          </button>
        </span>
      </div>
    </div>
    `
    home.append(homeTipsWrap)

    const pinnedSection = this.createSection({
      page: 'home',
      id: 'pinnedOptions',
      titleKey: '_置顶的设置',
      iconId: 'pin-line',
      persisted: true,
      stickyEligible: true,
      type: 'title',
    })
    home.append(pinnedSection.root)
    this.homePinnedContent = pinnedSection.content

    const crawlBlock = this.createSection({
      page: 'home',
      id: 'crawlBtns',
      titleKey: '_开始抓取',
      iconId: 'rocket',
      persisted: true,
      stickyEligible: false,
      type: 'panel',
    })
    crawlBlock.content.append(crawlBtnsBlock)
    home.append(crawlBlock.root)

    const downloadBlock = this.createSection({
      page: 'home',
      id: 'downloadArea',
      titleKey: '_下载区域',
      iconId: 'download',
      persisted: true,
      stickyEligible: false,
      type: 'panel',
    })
    const downloadContentWrap = document.createElement('div')
    downloadContentWrap.className = 'settingsPanel_downloadContentWrap'
    downloadContentWrap.append(
      downloadBtnsBlock,
      downloadEmptyHint,
      downloadArea,
      progressBar
    )
    downloadBlock.content.append(downloadContentWrap)
    home.append(downloadBlock.root)

    const otherBlock = this.createSection({
      page: 'home',
      id: 'otherBtns',
      titleKey: '_附加功能',
      iconId: 'features',
      persisted: true,
      stickyEligible: false,
      type: 'panel',
    })
    otherBlock.content.append(otherBtnsBlock)
    home.append(otherBlock.root)
    this.bindHomeOtherBtnsVisibility(otherBlock, otherBtnsBlock)
  }

  private bindHomeOtherBtnsVisibility(
    otherBlock: FoldableSection,
    otherBtnsBlock: HTMLDivElement
  ) {
    const toggleOtherBlock = () => {
      const hasButtons = otherBtnsBlock.querySelector('button') !== null
      otherBlock.root.style.display = hasButtons ? '' : 'none'
    }

    toggleOtherBlock()

    this.otherBtnsVisibilityObserver?.disconnect()
    this.otherBtnsVisibilityObserver = new MutationObserver(() => {
      toggleOtherBlock()
    })
    this.otherBtnsVisibilityObserver.observe(otherBtnsBlock, {
      childList: true,
      subtree: true,
    })
  }

  private buildCategoryPages() {
    const allCategories = Object.keys(
      optionConfigs.categorySchema
    ) as OptionCategoryLevel1[]

    allCategories.forEach((page) => {
      const inner = this.pageInners.get(page)!
      const groups = Object.values(
        optionConfigs.categorySchema[page].level2
      ).sort((a, b) => a.order - b.order)

      groups.forEach((group) => {
        const section = this.createSection({
          page,
          id: group.id,
          titleKey: group.nameKey,
          iconId: group.icon,
          persisted: true,
          stickyEligible: true,
          type: 'title',
        })
        inner.append(section.root)
        this.canonicalContainers.set(
          this.makeCanonicalKey(page, group.id),
          section.content
        )
      })
    })
  }

  private buildHelpPage() {
    const help = this.pageInners.get('help')!
    new SettingsPanelHelp(help)
  }

  private createSection({
    page,
    id,
    titleKey,
    iconId,
    persisted,
    stickyEligible,
    type,
  }: {
    page: PageId
    id: string
    titleKey: LangTextKey
    iconId?: string
    persisted: boolean
    stickyEligible: boolean
    type: 'title' | 'panel'
  }) {
    const root = document.createElement('div')
    root.className =
      type === 'panel'
        ? 'settingsPanel_panelSection'
        : 'settingsPanel_titleSection'

    const header = document.createElement('button')
    header.type = 'button'
    header.className = 'settingsPanel_sectionHeader'
    root.append(header)

    const headerMain = document.createElement('span')
    headerMain.className = 'settingsPanel_sectionHeadMain'
    header.append(headerMain)

    let iconUse: SVGUseElement | undefined
    if (iconId) {
      const iconWrap = document.createElement('span')
      iconWrap.className = 'settingsPanel_sectionIconWrap'
      iconWrap.innerHTML = `
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#${iconId}"></use>
      </svg>
      `
      headerMain.append(iconWrap)
      iconUse = iconWrap.querySelector('use') as SVGUseElement
    }

    const title = document.createElement('span')
    title.className = 'settingsPanel_sectionTitle'
    title.dataset.xztext = titleKey
    headerMain.append(title)

    const arrow = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    ) as SVGSVGElement
    arrow.setAttribute('class', 'icon settingsPanel_sectionArrow')
    arrow.setAttribute('aria-hidden', 'true')
    const arrowUse = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'use'
    )
    arrowUse.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'xlink:href',
      '#arrow-down-2'
    )
    arrow.append(arrowUse)
    header.append(arrow)

    const contentShell = document.createElement('div')
    contentShell.className =
      type === 'panel'
        ? 'settingsPanel_sectionContentShell settingsPanel_panelContentShell'
        : 'settingsPanel_sectionContentShell settingsPanel_titleContentShell'
    root.append(contentShell)

    const contentWrap = document.createElement('div')
    contentWrap.className = 'settingsPanel_sectionContentWrap'
    contentShell.append(contentWrap)

    const content = document.createElement('div')
    content.className =
      type === 'panel'
        ? 'settingsPanel_panelContent'
        : 'settingsPanel_titleContent'
    contentWrap.append(content)

    const section: FoldableSection = {
      page,
      id,
      persisted,
      stickyEligible,
      root,
      header,
      contentShell,
      contentWrap,
      content,
      title,
      iconUse,
    }
    const key = this.makeSectionKey(page, id)
    this.foldableSections.set(key, section)
    header.dataset.sectionKey = key

    this.applyExpandedState(section, this.getExpandedState(section))

    header.addEventListener('click', () => this.toggleSection(section))
    header.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' || event.code === 'Space') {
        event.preventDefault()
        this.toggleSection(section)
      }
    })

    return section
  }

  private createSlot(name: string) {
    const slot = document.createElement('slot')
    slot.dataset.name = name
    return slot
  }

  private createSlotBlock(slotNames: string[]) {
    const block = document.createElement('div')
    block.className = 'centerWrap_btns'
    slotNames.forEach((name) => {
      block.append(this.createSlot(name))
    })
    return block
  }

  private createDownloadEmptyHint() {
    const hint = document.createElement('div')
    hint.classList.add('secondary_hint', 'settingsPanel_downloadEmptyHint')

    const text = document.createElement('span')
    text.dataset.xztext = '_目前没有可用的抓取结果提示'
    hint.append(text)

    return hint
  }
}

export { SettingsPanelLayout, SettingsPanelLayoutResult }
