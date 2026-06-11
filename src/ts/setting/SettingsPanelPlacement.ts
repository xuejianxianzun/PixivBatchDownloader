import { optionConfigs } from './OptionConfigs'
import { OptionCategoryLevel1, settings } from './Settings'
import { FoldableSection, PageId } from './SettingsPanelTypes'

// - 负责选项卡片回填：当前激活的页面不是搜索页时，把每个设置卡片重新放回它正常所属的位置。
// - 负责 pinnedOptions 区域的放置与显隐
// - 负责 canonical container 查找
class SettingsPanelPlacement {
  constructor({
    optionElements,
    canonicalContainers,
    homePinnedContent,
    foldableSections,
    makeSectionKey,
    resetSearchHighlight,
  }: {
    optionElements: Map<number, HTMLElement>
    canonicalContainers: Map<string, HTMLDivElement>
    homePinnedContent: HTMLDivElement
    foldableSections: Map<string, FoldableSection>
    makeSectionKey: (page: PageId, id: string) => string
    resetSearchHighlight: () => void
  }) {
    this.optionElements = optionElements
    this.canonicalContainers = canonicalContainers
    this.homePinnedContent = homePinnedContent
    this.foldableSections = foldableSections
    this.makeSectionKey = makeSectionKey
    this.resetSearchHighlight = resetSearchHighlight
  }

  private optionElements: Map<number, HTMLElement>
  private canonicalContainers: Map<string, HTMLDivElement>
  private homePinnedContent: HTMLDivElement
  private foldableSections: Map<string, FoldableSection>
  private makeSectionKey: (page: PageId, id: string) => string
  private resetSearchHighlight: () => void

  public placeOptionsToDefaultContainers(showPinnedOnHome: boolean) {
    for (const option of optionConfigs.options) {
      const element = this.optionElements.get(option.no)
      if (!element) {
        continue
      }

      const target =
        showPinnedOnHome && settings.pinnedOptionsV2.includes(option.no)
          ? this.homePinnedContent
          : this.getCanonicalContainer(
              option.categoryLevel1,
              option.categoryLevel2
            )
      target.append(element)
    }

    this.resetSearchHighlight()
  }

  public updatePinnedSectionVisibility() {
    const pinnedSection = this.foldableSections.get(
      this.makeSectionKey('home', 'pinnedOptions')
    )
    if (!pinnedSection) {
      return
    }
    pinnedSection.root.style.display =
      settings.pinnedOptionsV2.length > 0 ? 'block' : 'none'
  }

  public getCanonicalContainer(level1: OptionCategoryLevel1, level2: string) {
    return this.canonicalContainers.get(
      this.makeCanonicalKey(level1, level2)
    ) as HTMLDivElement
  }

  private makeCanonicalKey(level1: OptionCategoryLevel1, level2: string) {
    return `${level1}__${level2}`
  }
}

export { SettingsPanelPlacement }
