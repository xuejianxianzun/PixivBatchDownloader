import { lang } from '../Language'
import { Utils } from '../utils/Utils'
import { optionConfigs } from './OptionConfigs'
import { OptionCategoryLevel1 } from './Settings'
import { FoldableSection } from './SettingsPanelTypes'

type SearchMatch = {
  matchedByName: boolean
}

type SearchRestorePage = 'home' | OptionCategoryLevel1 | 'help'

class SettingsPanelSearch {
  constructor({
    root,
    input,
    clearButton,
    navButton,
    optionElements,
    getCanonicalContainer,
    onSectionStateChange,
  }: {
    root: HTMLDivElement
    input: HTMLInputElement
    clearButton: HTMLButtonElement
    navButton: HTMLButtonElement
    optionElements: Map<number, HTMLElement>
    getCanonicalContainer: (
      level1: OptionCategoryLevel1,
      level2: string
    ) => HTMLDivElement
    onSectionStateChange: () => void
  }) {
    this.root = root
    this.input = input
    this.clearButton = clearButton
    this.navButton = navButton
    this.optionElements = optionElements
    this.getCanonicalContainer = getCanonicalContainer
    this.onSectionStateChange = onSectionStateChange

    this.summary = document.createElement('p')
    this.summary.className = 'settingsPanel_searchSummary'
    this.groupsWrap = document.createElement('div')
    this.groupsWrap.className = 'settingsPanel_searchGroups'
    this.root.append(this.summary, this.groupsWrap)

    this.updateControlState()
  }

  private root: HTMLDivElement
  private input: HTMLInputElement
  private clearButton: HTMLButtonElement
  private navButton: HTMLButtonElement
  private summary: HTMLParagraphElement
  private groupsWrap: HTMLDivElement
  private keyword = ''
  private lastNonSearchPage: SearchRestorePage = 'home'
  private onResultChange?: () => void
  private onSectionStateChange: () => void

  private readonly optionElements: Map<number, HTMLElement>
  private readonly getCanonicalContainer: (
    level1: OptionCategoryLevel1,
    level2: string
  ) => HTMLDivElement
  private readonly sections = new Map<string, FoldableSection>()
  private readonly sectionState = new Map<string, boolean>()
  private readonly debouncedResultChange = Utils.debounce(() => {
    this.onResultChange?.()
  }, 200)

  public bindEvents(onResultChange: () => void) {
    this.onResultChange = onResultChange

    this.input.addEventListener('input', () => {
      this.debouncedResultChange()
      this.updateClearButton()
    })

    this.clearButton.addEventListener('click', () => {
      this.clear()
      this.onResultChange?.()
    })
  }

  public setLastNonSearchPage(page: SearchRestorePage) {
    this.lastNonSearchPage = page
  }

  public getLastNonSearchPage() {
    return this.lastNonSearchPage
  }

  public hasKeyword() {
    return this.keyword !== ''
  }

  public updateResult() {
    this.keyword = this.input.value.trim()
    this.navButton.hidden = this.keyword === ''

    if (this.keyword === '') {
      this.updateSearchOptionHighlight(new Map())
      return false
    }

    return true
  }

  public clear() {
    this.input.value = ''
    this.keyword = ''
    this.updateControlState()
    this.resetOptionHighlight()
  }

  public renderPage() {
    this.sections.clear()
    this.groupsWrap.innerHTML = ''

    const matchMap = this.findSearchMatches(this.keyword)
    const groupOrder: string[] = []

    optionConfigs.options.forEach((option) => {
      const match = matchMap.get(option.no)
      if (!match) {
        return
      }

      const optionElement = this.optionElements.get(option.no)
      if (!optionElement || this.isOptionCardHidden(optionElement)) {
        return
      }

      const groupKey = this.makeSectionKey(
        `${option.categoryLevel1}__${option.categoryLevel2}`
      )
      if (!this.sections.has(groupKey)) {
        const section = this.createSearchSection(
          option.categoryLevel1,
          option.categoryLevel2
        )
        this.sections.set(groupKey, section)
        groupOrder.push(groupKey)
        this.groupsWrap.append(section.root)
      }

      this.sections.get(groupKey)!.content.append(optionElement)
    })

    this.placeUnmatchedOptionsBack(matchMap)
    this.updateSearchOptionHighlight(matchMap)

    if (groupOrder.length === 0) {
      this.summary.dataset.xztext = '_没有找到符合条件的设置的提示'
      this.summary.innerHTML = lang.transl('_没有找到符合条件的设置的提示')
      return
    }

    delete this.summary.dataset.xztext
    this.summary.innerHTML = lang.transl(
      '_找到x条与搜索词有关的设置',
      groupOrder
        .map((key) => this.sections.get(key)!.content.children.length)
        .reduce((total, count) => total + count, 0)
        .toString(),
      this.escapeHTML(this.keyword)
    )
  }

  public toggleSectionByKey(key: string) {
    const section = this.sections.get(key)
    if (!section) {
      return false
    }
    this.toggleSection(section)
    return true
  }

  public setAllExpanded(shouldExpand: boolean) {
    this.sections.forEach((section, key) => {
      this.sectionState.set(key, shouldExpand)
      this.applyExpandedState(section, shouldExpand)
    })
  }

  public getExpandStats() {
    let expanded = 0
    for (const section of this.sections.values()) {
      if (this.getExpandedState(section)) {
        expanded++
      }
    }
    return {
      total: this.sections.size,
      expanded,
    }
  }

  public getStickySections() {
    return [...this.sections.values()].filter(
      (section) => section.stickyEligible && this.getExpandedState(section)
    )
  }

  public resetOptionHighlight() {
    this.updateSearchOptionHighlight(new Map())
  }

  private updateControlState() {
    this.updateClearButton()
    this.navButton.hidden = this.input.value.trim() === ''
  }

  private updateClearButton() {
    this.clearButton.classList.toggle('visible', this.input.value.trim() !== '')
  }

  private findSearchMatches(keyword: string) {
    const result = new Map<number, SearchMatch>()
    const lowerKeyword = keyword.toLowerCase()

    for (const option of optionConfigs.options) {
      const element = this.optionElements.get(option.no)
      if (!element || this.isOptionCardHidden(element)) {
        continue
      }

      const name = option.name.toLowerCase()
      if (name.includes(lowerKeyword)) {
        result.set(option.no, { matchedByName: true })
        continue
      }

      let matched = false
      for (const searchWord of option.searchWords) {
        const word = searchWord.toLowerCase()
        if (word.includes(lowerKeyword) || lowerKeyword.includes(word)) {
          matched = true
          break
        }
      }

      if (matched) {
        result.set(option.no, { matchedByName: false })
      }
    }

    return result
  }

  private isOptionCardHidden(option: HTMLElement) {
    return option.style.display === 'none'
  }

  private placeUnmatchedOptionsBack(matchMap: Map<number, SearchMatch>) {
    for (const option of optionConfigs.options) {
      if (matchMap.has(option.no)) {
        continue
      }

      const element = this.optionElements.get(option.no)
      if (!element) {
        continue
      }

      this.getCanonicalContainer(
        option.categoryLevel1,
        option.categoryLevel2
      ).append(element)
    }
  }

  private updateSearchOptionHighlight(matchMap: Map<number, SearchMatch>) {
    optionConfigs.options.forEach((option) => {
      const element = this.optionElements.get(option.no)
      if (!element) {
        return
      }

      const target = this.findOptionNameTarget(element)
      if (!target) {
        return
      }

      const match = matchMap.get(option.no)
      if (!match || !match.matchedByName || this.keyword === '') {
        lang.updateText(target, option.nameKey)
        return
      }

      delete target.dataset.xztext
      delete target.dataset.xztextargs
      target.innerHTML = this.highlightText(option.name, this.keyword)
    })
  }

  private findOptionNameTarget(option: HTMLElement) {
    const direct = option.querySelector(
      '.settingNameStyle.optionName'
    ) as HTMLElement | null
    if (direct) {
      return direct
    }

    const nameLink = option.querySelector(
      '.settingNameStyle'
    ) as HTMLElement | null
    if (!nameLink) {
      return null
    }

    return (
      (nameLink.querySelector(
        '.optionName, .textTip, [data-xztext]'
      ) as HTMLElement | null) || nameLink
    )
  }

  private highlightText(text: string, keyword: string) {
    const lowerText = text.toLowerCase()
    const lowerKeyword = keyword.toLowerCase()

    if (!lowerKeyword) {
      return this.escapeHTML(text)
    }

    let cursor = 0
    let html = ''
    while (cursor < text.length) {
      const index = lowerText.indexOf(lowerKeyword, cursor)
      if (index === -1) {
        html += this.escapeHTML(text.slice(cursor))
        break
      }

      html += this.escapeHTML(text.slice(cursor, index))
      html += `<mark class="settingsPanel_searchMark">${this.escapeHTML(
        text.slice(index, index + keyword.length)
      )}</mark>`
      cursor = index + keyword.length
    }

    return html
  }

  private escapeHTML(text: string) {
    return text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
  }

  private createSearchSection(level1: OptionCategoryLevel1, level2: string) {
    const group = optionConfigs.categorySchema[level1].level2[level2]
    const title = `${lang.transl(
      optionConfigs.categorySchema[level1].nameKey
    )} / ${lang.transl(group.nameKey)}`

    const root = document.createElement('div')
    root.className = 'settingsPanel_titleSection'

    const header = document.createElement('button')
    header.type = 'button'
    header.className = 'settingsPanel_sectionHeader'
    header.innerHTML = `
      <span class="settingsPanel_sectionHeadMain"></span>
      <svg class="icon settingsPanel_sectionArrow" aria-hidden="true">
        <use xlink:href="#arrow-down-2"></use>
      </svg>
    `
    root.append(header)

    const headerMain = header.querySelector(
      '.settingsPanel_sectionHeadMain'
    ) as HTMLSpanElement
    let iconUse: SVGUseElement | undefined
    if (group.icon) {
      const iconWrap = document.createElement('span')
      iconWrap.className = 'settingsPanel_sectionIconWrap'
      iconWrap.innerHTML = `
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#${group.icon}"></use>
        </svg>
      `
      headerMain.append(iconWrap)
      iconUse = iconWrap.querySelector('use') as SVGUseElement
    }

    const titleEl = document.createElement('span')
    titleEl.className = 'settingsPanel_sectionTitle'
    headerMain.append(titleEl)

    const contentShell = document.createElement('div')
    contentShell.className =
      'settingsPanel_sectionContentShell settingsPanel_titleContentShell'
    root.append(contentShell)

    const contentWrap = document.createElement('div')
    contentWrap.className = 'settingsPanel_sectionContentWrap'
    contentShell.append(contentWrap)

    const content = document.createElement('div')
    content.className = 'settingsPanel_titleContent'
    contentWrap.append(content)

    const section: FoldableSection = {
      page: 'search',
      id: `${level1}__${level2}`,
      persisted: false,
      stickyEligible: true,
      root,
      header,
      contentShell,
      contentWrap,
      content,
      title: titleEl,
      iconUse,
    }
    section.title.textContent = title

    this.applyExpandedState(
      section,
      this.sectionState.get(this.makeSectionKey(section.id)) ?? true
    )

    header.dataset.sectionKey = this.makeSectionKey(section.id)
    header.addEventListener('click', () => this.toggleSection(section))
    header.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' || event.code === 'Space') {
        event.preventDefault()
        this.toggleSection(section)
      }
    })

    return section
  }

  private toggleSection(section: FoldableSection) {
    const expanded = !this.getExpandedState(section)
    this.sectionState.set(this.makeSectionKey(section.id), expanded)
    this.applyExpandedState(section, expanded)
    this.onSectionStateChange()
  }

  private getExpandedState(section: FoldableSection) {
    return this.sectionState.get(this.makeSectionKey(section.id)) ?? true
  }

  private applyExpandedState(section: FoldableSection, expanded: boolean) {
    section.root.classList.toggle('expanded', expanded)
    section.root.classList.toggle('collapsed', !expanded)
    section.header.setAttribute('aria-expanded', expanded ? 'true' : 'false')
    section.contentWrap.toggleAttribute('inert', !expanded)
    section.contentWrap.setAttribute('aria-hidden', expanded ? 'false' : 'true')
  }

  private makeSectionKey(id: string) {
    return `search__${id}`
  }
}

export { SearchRestorePage, SettingsPanelSearch }
