import { settings, setSetting } from './Settings'
import { Utils } from '../utils/Utils'
import { FoldableSection, PageId, PersistedPageId } from './SettingsPanelTypes'

// - 管理持久化 section 的展开/折叠状态
// - 管理“展开/折叠全部”
// - 管理 sticky header 的显示、标题和图标同步
// - 协调搜索页 section 的展开统计和 sticky section
class SettingsPanelSections {
  constructor({
    main,
    getActivePage,
    getSearchExpandStats,
    setSearchAllExpanded,
    getSearchStickySections,
  }: {
    main: HTMLDivElement
    getActivePage: () => PageId
    getSearchExpandStats: () => { total: number; expanded: number }
    setSearchAllExpanded: (shouldExpand: boolean) => void
    getSearchStickySections: () => FoldableSection[]
  }) {
    this.main = main
    this.getActivePage = getActivePage
    this.getSearchExpandStats = getSearchExpandStats
    this.setSearchAllExpanded = setSearchAllExpanded
    this.getSearchStickySections = getSearchStickySections
  }

  private main: HTMLDivElement
  private getActivePage: () => PageId
  private getSearchExpandStats: () => { total: number; expanded: number }
  private setSearchAllExpanded: (shouldExpand: boolean) => void
  private getSearchStickySections: () => FoldableSection[]

  private foldableSections = new Map<string, FoldableSection>()
  private stickyEls = new Map<PageId, HTMLButtonElement>()
  private expandAllBtns: HTMLButtonElement[] = []
  private emptyHintsObserver?: MutationObserver

  public connect({
    foldableSections,
    stickyEls,
    expandAllBtns,
  }: {
    foldableSections: Map<string, FoldableSection>
    stickyEls: Map<PageId, HTMLButtonElement>
    expandAllBtns: HTMLButtonElement[]
  }) {
    this.foldableSections = foldableSections
    this.stickyEls = stickyEls
    this.expandAllBtns = expandAllBtns
    this.bindEmptyHintsObserver()
    this.refreshEmptyCategoryHints()
  }

  public makeSectionKey(page: PageId, id: string) {
    return `${page}__${id}`
  }

  public toggleSectionByKey(key: string) {
    const section = this.foldableSections.get(key)
    if (!section) {
      return false
    }
    this.toggleSection(section)
    return true
  }

  public getExpandedState(section: FoldableSection) {
    const pageState = this.getPersistedPageState(
      section.page as PersistedPageId
    )
    return !!pageState?.[section.id]
  }

  public applyExpandedState(section: FoldableSection, expanded: boolean) {
    section.root.classList.toggle('expanded', expanded)
    section.root.classList.toggle('collapsed', !expanded)
    section.header.setAttribute('aria-expanded', expanded ? 'true' : 'false')
    section.contentWrap.toggleAttribute('inert', !expanded)
    section.contentWrap.setAttribute('aria-hidden', expanded ? 'false' : 'true')
    this.updateEmptyCategoryHint(section)
  }

  public toggleSection(section: FoldableSection) {
    const expanded = !this.getExpandedState(section)
    this.setExpandedState(section, expanded)
    this.updateExpandAllButton()
    this.refreshStickyHeader()
  }

  public refreshPersistedSectionStates() {
    this.foldableSections.forEach((section) => {
      this.applyExpandedState(section, this.getExpandedState(section))
    })
    this.updateExpandAllButton()
    this.refreshStickyHeader()
  }

  /** 刷新所有二级分类没有可用设置时的提示 */
  public refreshEmptyCategoryHints() {
    this.foldableSections.forEach((section) => {
      this.updateEmptyCategoryHint(section)
    })
  }

  /** 展开/折叠所有区域，返回操作后的状态：true 为全部展开，false 为全部折叠 */
  public toggleAllSections(): boolean {
    const shouldExpand = !this.areAllSectionsExpanded()
    const nextExpandedCards = Utils.deepCopy(settings.expandedCards)

    this.foldableSections.forEach((section) => {
      const pageState = this.getPersistedPageState(
        section.page as PersistedPageId,
        nextExpandedCards
      )
      if (pageState) {
        pageState[section.id] = shouldExpand
      }
      this.applyExpandedState(section, shouldExpand)
    })

    this.setSearchAllExpanded(shouldExpand)

    setSetting('expandedCards', nextExpandedCards)
    this.updateExpandAllButton()
    this.refreshStickyHeader()
    return shouldExpand
  }

  public updateExpandAllButton() {
    if (this.expandAllBtns.length === 0) {
      return
    }
    const state = this.getExpandAllState()
    this.expandAllBtns.forEach((btn) => {
      btn.classList.toggle('expanded', state === 'expanded')
      btn.classList.toggle('partial', state === 'partial')
    })
  }

  public refreshStickyHeader() {
    const sticky = this.stickyEls.get(this.getActivePage())
    if (!sticky) {
      return
    }

    const sections = this.getStickySectionsForActivePage()
    if (sections.length === 0) {
      sticky.hidden = true
      return
    }

    const mainRect = this.main.getBoundingClientRect()
    let current: FoldableSection | undefined

    for (const section of sections) {
      const headerRect = section.header.getBoundingClientRect()
      const rootRect = section.root.getBoundingClientRect()
      if (
        headerRect.top <= mainRect.top &&
        rootRect.bottom > mainRect.top + headerRect.height
      ) {
        current = section
      }
    }

    if (!current) {
      sticky.hidden = true
      return
    }

    sticky.hidden = false
    sticky.dataset.sectionKey = this.makeSectionKey(current.page, current.id)

    const stickyTitle = sticky.querySelector(
      '.settingsPanel_sectionTitle'
    ) as HTMLSpanElement
    stickyTitle.textContent = current.title.textContent || ''

    const stickyIconWrap = sticky.querySelector(
      '.settingsPanel_sectionIconWrap'
    ) as HTMLSpanElement
    const stickyIconUse = sticky.querySelector(
      '.settingsPanel_sectionIconWrap use'
    ) as SVGUseElement
    if (current.iconUse) {
      stickyIconWrap.classList.remove('hidden')
      stickyIconUse.setAttribute(
        'xlink:href',
        current.iconUse.getAttribute('xlink:href') || ''
      )
    } else {
      stickyIconWrap.classList.add('hidden')
      stickyIconUse.setAttribute('xlink:href', '')
    }
  }

  private setExpandedState(section: FoldableSection, expanded: boolean) {
    const nextExpandedCards = Utils.deepCopy(settings.expandedCards)
    const pageState = this.getPersistedPageState(
      section.page as PersistedPageId,
      nextExpandedCards
    )
    if (pageState) {
      pageState[section.id] = expanded
    }
    setSetting('expandedCards', nextExpandedCards)
    this.applyExpandedState(section, expanded)
  }

  /** 监听设置项的显隐变化 */
  private bindEmptyHintsObserver() {
    this.emptyHintsObserver?.disconnect()
    this.emptyHintsObserver = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (mutation) =>
            mutation.target instanceof HTMLElement &&
            mutation.target.matches('div.option')
        )
      ) {
        this.refreshEmptyCategoryHints()
      }
    })
    this.emptyHintsObserver.observe(this.main, {
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    })
  }

  /** 根据二级分类里的设置项显示状态更新提示 */
  private updateEmptyCategoryHint(section: FoldableSection) {
    const hint = section.content.querySelector(
      '.settingsPanel_emptyCategoryHint'
    ) as HTMLDivElement | null
    if (!hint) {
      return
    }

    const options =
      section.contentWrap.querySelectorAll<HTMLDivElement>('div.option')
    const allOptionsHidden = [...options].every(
      (option) => option.style.display === 'none'
    )
    hint.classList.toggle(
      'is-hidden',
      !section.root.classList.contains('expanded') || !allOptionsHidden
    )
  }

  private areAllSectionsExpanded() {
    return this.getExpandAllState() === 'expanded'
  }

  private getExpandAllState(): 'collapsed' | 'partial' | 'expanded' {
    let total = 0
    let expanded = 0

    for (const section of this.foldableSections.values()) {
      total++
      if (this.getExpandedState(section)) {
        expanded++
      }
    }

    const searchStats = this.getSearchExpandStats()
    total += searchStats.total
    expanded += searchStats.expanded

    if (total === 0 || expanded === 0) {
      return 'collapsed'
    }
    if (expanded === total) {
      return 'expanded'
    }
    return 'partial'
  }

  private getStickySectionsForActivePage() {
    if (this.getActivePage() === 'search') {
      return this.getSearchStickySections()
    }

    return [...this.foldableSections.values()].filter(
      (section) =>
        section.page === this.getActivePage() &&
        section.stickyEligible &&
        this.getExpandedState(section)
    )
  }

  private getPersistedPageState(
    page: PersistedPageId,
    expandedCards = settings.expandedCards
  ) {
    return expandedCards[page]
  }
}

export { SettingsPanelSections }
