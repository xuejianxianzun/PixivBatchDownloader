/** 设置面板里所有页面的 id。
 * 它是导航项、页面分区、展开/折叠状态的唯一来源。
 * 需要与页面一一对应的配置都应该以它为 key，这样修改这里之后，类型检查会直接提示其他关联处需要同步修改。 */
const PageIds = [
  'home',
  'filter',
  'naming',
  'download',
  'enhance',
  'general',
  'help',
  'search',
] as const

type PageId = (typeof PageIds)[number]

/** 需要保存展开/折叠状态的页面：首页和一级分类（帮助、搜索不需要保存） */
type PersistedPageId = Exclude<PageId, 'help' | 'search'>

type FoldableSection = {
  page: PageId
  id: string
  persisted: boolean
  stickyEligible: boolean
  root: HTMLDivElement
  header: HTMLButtonElement
  contentShell: HTMLDivElement
  contentWrap: HTMLDivElement
  content: HTMLDivElement
  title: HTMLSpanElement
  iconUse?: SVGUseElement
}

export { FoldableSection, PageId, PersistedPageId, PageIds }
