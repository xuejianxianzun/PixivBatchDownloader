import { Config } from '../Config'
import { settings } from './Settings'
import { SearchRestorePage, SettingsPanelSearch } from './SettingsPanelSearch'
import { PageId } from './SettingsPanelTypes'

// - 管理导航按钮事件
// - 管理页面切换
// - 管理搜索页进入/退出
// - 管理“当前页渲染”触发
class SettingsPanelNavigation {
  constructor({
    pageEls,
    navEls,
    searchPanel,
    getActivePage,
    setActivePage,
    renderSearchPage,
    renderDefaultPage,
    afterRender,
    playNavRipple,
  }: {
    pageEls: Map<PageId, HTMLDivElement>
    navEls: Map<PageId, HTMLButtonElement>
    searchPanel: SettingsPanelSearch
    getActivePage: () => PageId
    setActivePage: (page: PageId) => void
    renderSearchPage: () => void
    renderDefaultPage: (showPinnedOnHome: boolean) => void
    afterRender: () => void
    playNavRipple: (button: HTMLButtonElement) => void
  }) {
    this.pageEls = pageEls
    this.navEls = navEls
    this.searchPanel = searchPanel
    this.getActivePage = getActivePage
    this.setActivePage = setActivePage
    this.renderSearchPage = renderSearchPage
    this.renderDefaultPage = renderDefaultPage
    this.afterRender = afterRender
    this.playNavRipple = playNavRipple
  }

  private pageEls: Map<PageId, HTMLDivElement>
  private navEls: Map<PageId, HTMLButtonElement>
  private searchPanel: SettingsPanelSearch
  private getActivePage: () => PageId
  private setActivePage: (page: PageId) => void
  private renderSearchPage: () => void
  private renderDefaultPage: (showPinnedOnHome: boolean) => void
  private afterRender: () => void
  private playNavRipple: (button: HTMLButtonElement) => void

  public bindEvents() {
    this.navEls.forEach((button, page) => {
      button.addEventListener('click', () => {
        this.playNavRipple(button)
        this.handleNavRequest(page)
      })
      button.addEventListener('keydown', (event) => {
        if (
          (event.code === 'Enter' || event.code === 'Space') &&
          event.target === button
        ) {
          event.preventDefault()
          this.playNavRipple(button)
          this.handleNavRequest(page)
        }
      })

      if (!Config.mobile) {
        button.addEventListener('mouseenter', () => {
          if (settings.switchTabBar !== 'click') {
            this.handleNavRequest(page)
          }
        })
      }
    })

    this.searchPanel.bindEvents(() => this.updateSearchResult())
  }

  public switchPage(page: PageId) {
    this.setActivePage(page)
    if (page !== 'search') {
      this.searchPanel.setLastNonSearchPage(page as SearchRestorePage)
    }

    this.pageEls.forEach((pageEl, key) => {
      pageEl.classList.toggle('active', key === page)
    })
    this.navEls.forEach((button, key) => {
      button.classList.toggle('active', key === page)
    })

    this.renderCurrentPage()
  }

  public renderCurrentPage() {
    if (this.getActivePage() === 'search') {
      this.renderSearchPage()
    } else {
      this.renderDefaultPage(this.getActivePage() === 'home')
    }

    this.afterRender()
  }

  public updateSearchResult() {
    if (!this.searchPanel.updateResult()) {
      this.switchPage(this.searchPanel.getLastNonSearchPage())
      return
    }

    this.switchPage('search')
  }

  private handleNavRequest(page: PageId) {
    if (page === 'search' && !this.searchPanel.hasKeyword()) {
      return
    }

    if (this.searchPanel.hasKeyword() && page !== 'search') {
      this.searchPanel.setLastNonSearchPage(page as SearchRestorePage)
      if (this.getActivePage() === 'search') {
        this.searchPanel.clear()
        this.updateSearchResult()
      }
      return
    }

    this.switchPage(page)
  }
}

export { SettingsPanelNavigation }
