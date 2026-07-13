import { EVT } from '../../EVT'
import { lang } from '../../Language'
import { log } from '../../Log'
import { toast } from '../../Toast'
import { unBookmarkWorks } from '../../UnBookmarkWorks'
import { WorkBookmarkData } from '../../Bookmark'
import { BookmarkPageBatchActionBase } from './BookmarkPageBatchActionBase'
import { LangTextKey } from '../../langText'

type CrawlRangeOptions = {
  title: LangTextKey
  crawlNumber: number
  resetOffset?: boolean
}

class UnBookmarkSomeWorksAction extends BookmarkPageBatchActionBase<WorkBookmarkData> {
  constructor(btn: HTMLButtonElement, option: CrawlRangeOptions) {
    super()

    btn.addEventListener('click', () => {
      const title = lang.transl(option.title)
      log.warning(title)
      toast.warning(title)
      EVT.fire('closeCenterPanel')

      void this.run({
        crawlNumber: option.crawlNumber,
        resetOffset: option.resetOffset,
        slowCrawl: true,
        collectWork: (workData, bookmarkTags) =>
          this.createBookmarkData(workData, bookmarkTags),
        onCollected: async (bookmarkDataList) => {
          await unBookmarkWorks.start(bookmarkDataList)
        },
      })
    })
  }
}

export { UnBookmarkSomeWorksAction }
