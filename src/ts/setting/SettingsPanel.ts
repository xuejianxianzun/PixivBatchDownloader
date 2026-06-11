import { EVT } from '../EVT'
import { OptionCategoryLevel1 } from './Settings'
import { FormType } from './FormType'
import { SettingsPanelDownloadSummary } from './SettingsPanelDownloadSummary'
import {
  SettingsPanelLayout,
  SettingsPanelLayoutResult,
} from './SettingsPanelLayout'
import { SettingsPanelNavigation } from './SettingsPanelNavigation'
import { SettingsPanelPlacement } from './SettingsPanelPlacement'
import { SettingsPanelSections } from './SettingsPanelSections'
import { SettingsPanelShell } from './SettingsPanelShell'
import { SettingsPanelSearch } from './SettingsPanelSearch'
import { FoldableSection, PageId } from './SettingsPanelTypes'
import '../OpenSettingsPanel'

class SettingsPanel {
  private form: FormType
  private centerPanel: HTMLDivElement
  private main: HTMLDivElement

  private activePage: PageId = 'home'
  private readonly optionElements = new Map<number, HTMLElement>()
  private canonicalContainers!: Map<string, HTMLDivElement>
  private pageEls!: Map<PageId, HTMLDivElement>
  private stickyEls!: Map<PageId, HTMLButtonElement>
  private navEls!: Map<PageId, HTMLButtonElement>
  private foldableSections!: Map<string, FoldableSection>
  private expandAllBtn!: HTMLButtonElement
  private homePinnedContent!: HTMLDivElement
  private downloadSummary!: SettingsPanelDownloadSummary
  private searchPanel!: SettingsPanelSearch
  private navigationController!: SettingsPanelNavigation
  private placementController!: SettingsPanelPlacement
  private sectionController!: SettingsPanelSections

  constructor(form: FormType) {
    this.form = form
    this.centerPanel = SettingsPanelShell.get()
    this.main = this.centerPanel.querySelector(
      '.settingsPanel_main'
    ) as HTMLDivElement

    if (!this.centerPanel || !this.main) {
      throw new Error('SettingsPanel shell not found')
    }

    this.sectionController = new SettingsPanelSections({
      main: this.main,
      getActivePage: () => this.activePage,
      getSearchExpandStats: () =>
        this.searchPanel?.getExpandStats() ?? { total: 0, expanded: 0 },
      setSearchAllExpanded: (shouldExpand) =>
        this.searchPanel?.setAllExpanded(shouldExpand),
      getSearchStickySections: () =>
        this.searchPanel?.getStickySections() ?? [],
    })

    for (const option of this.form.querySelectorAll('.option')) {
      const no = Number.parseInt((option as HTMLElement).dataset.no || '-1')
      if (no > -1) {
        this.optionElements.set(no, option as HTMLElement)
      }
    }
    this.buildLayout()
    this.downloadSummary = new SettingsPanelDownloadSummary(
      this.centerPanel.querySelector(
        '#settingsPanelDownloadSummary'
      ) as HTMLDivElement,
      this.form
    )
    this.bindEvents()
    this.navigationController.switchPage('home')
    this.navigationController.updateSearchResult()
  }

  private buildLayout() {
    const layout: SettingsPanelLayoutResult = new SettingsPanelLayout({
      form: this.form,
      centerPanel: this.centerPanel,
      optionElements: this.optionElements,
      getExpandedState: (section) =>
        this.sectionController.getExpandedState(section),
      applyExpandedState: (section, expanded) =>
        this.sectionController.applyExpandedState(section, expanded),
      toggleSection: (section) => this.sectionController.toggleSection(section),
      makeSectionKey: (page, id) =>
        this.sectionController.makeSectionKey(page, id),
      makeCanonicalKey: (level1, level2) =>
        this.makeCanonicalKey(level1, level2),
    }).build()

    this.pageEls = layout.pageEls
    this.stickyEls = layout.stickyEls
    this.navEls = layout.navEls
    this.foldableSections = layout.foldableSections
    this.canonicalContainers = layout.canonicalContainers
    this.homePinnedContent = layout.homePinnedContent
    this.expandAllBtn = this.centerPanel.querySelector(
      '#settingsPanelToggleExpand'
    ) as HTMLButtonElement
    this.sectionController.connect({
      foldableSections: this.foldableSections,
      stickyEls: this.stickyEls,
      expandAllBtn: this.expandAllBtn,
    })
    this.searchPanel = new SettingsPanelSearch({
      root: layout.searchRoot,
      input: this.centerPanel.querySelector(
        '#settingsPanelSearchInput'
      ) as HTMLInputElement,
      clearButton: this.centerPanel.querySelector(
        '#settingsPanelClearSearch'
      ) as HTMLButtonElement,
      navButton: this.centerPanel.querySelector(
        '.settingsPanel_navItem[data-page="search"]'
      ) as HTMLButtonElement,
      optionElements: this.optionElements,
      getCanonicalContainer: (level1, level2) =>
        this.getCanonicalContainer(level1, level2),
      onSectionStateChange: () => {
        this.sectionController.updateExpandAllButton()
        this.sectionController.refreshStickyHeader()
      },
    })
    this.placementController = new SettingsPanelPlacement({
      optionElements: this.optionElements,
      canonicalContainers: this.canonicalContainers,
      homePinnedContent: this.homePinnedContent,
      foldableSections: this.foldableSections,
      makeSectionKey: (page, id) =>
        this.sectionController.makeSectionKey(page, id),
      resetSearchHighlight: () => this.searchPanel.resetOptionHighlight(),
    })
    this.navigationController = new SettingsPanelNavigation({
      pageEls: this.pageEls,
      navEls: this.navEls,
      searchPanel: this.searchPanel,
      getActivePage: () => this.activePage,
      setActivePage: (page) => {
        this.activePage = page
      },
      renderSearchPage: () => this.searchPanel.renderPage(),
      renderDefaultPage: (showPinnedOnHome) =>
        this.placementController.placeOptionsToDefaultContainers(
          showPinnedOnHome
        ),
      afterRender: () => {
        this.placementController.updatePinnedSectionVisibility()
        this.sectionController.updateExpandAllButton()
        window.setTimeout(() => this.sectionController.refreshStickyHeader(), 0)
      },
      playNavRipple: (button) => this.playNavRipple(button),
    })
  }

  private bindEvents() {
    this.stickyEls.forEach((sticky) => {
      sticky.addEventListener('click', () => {
        const key = sticky.dataset.sectionKey
        if (!key) {
          return
        }
        if (this.sectionController.toggleSectionByKey(key)) {
          return
        }
        this.searchPanel.toggleSectionByKey(key)
      })
    })

    this.navigationController.bindEvents()

    this.expandAllBtn.addEventListener('click', () =>
      this.sectionController.toggleAllSections()
    )

    this.main.addEventListener('scroll', () =>
      this.sectionController.refreshStickyHeader()
    )

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'pinnedOptionsV2') {
        this.navigationController.renderCurrentPage()
      }

      if (data.name === 'expandedCards') {
        this.sectionController.refreshPersistedSectionStates()
      }
    })

    window.addEventListener(EVT.list.langChange, () => {
      window.setTimeout(() => {
        this.navigationController.renderCurrentPage()
      }, 0)
    })
  }

  private playNavRipple(button: HTMLButtonElement) {
    this.playRipple(button)
  }

  private playRipple(button: HTMLButtonElement) {
    if (!button.querySelector('.ripple')) {
      return
    }
    button.classList.remove('ripple-active')
    void button.offsetWidth
    button.classList.add('ripple-active')
    window.setTimeout(() => {
      button.classList.remove('ripple-active')
    }, 650)
  }

  private makeCanonicalKey(level1: string, level2: string) {
    return `${level1}__${level2}`
  }

  private getCanonicalContainer(level1: OptionCategoryLevel1, level2: string) {
    return this.canonicalContainers.get(
      this.makeCanonicalKey(level1, level2)
    ) as HTMLDivElement
  }
}

SettingsPanelShell.init()

export { SettingsPanel }
