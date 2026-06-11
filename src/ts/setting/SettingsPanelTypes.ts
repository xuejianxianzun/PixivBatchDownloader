import { OptionCategoryLevel1 } from './Settings'

type PageId = 'home' | OptionCategoryLevel1 | 'help' | 'search'
type PersistedPageId = 'home' | OptionCategoryLevel1
const pageIds: PageId[] = [
  'home',
  'crawl',
  'naming',
  'download',
  'enhance',
  'general',
  'help',
  'search',
]

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

export { FoldableSection, PageId, PersistedPageId, pageIds }
