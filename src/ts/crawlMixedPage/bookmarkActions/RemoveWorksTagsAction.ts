import { EVT } from '../../EVT'
import { lang } from '../../Language'
import { LangTextKey } from '../../langText'
import { log } from '../../Log'
import { toast } from '../../Toast'
import { removeBookmarkTags } from '../../RemoveBookmarkTags'
import { WorkBookmarkData } from '../../Bookmark'
import { BookmarkPageBatchActionBase } from './BookmarkPageBatchActionBase'

type RemoveWorksTagsActionOptions = {
  title: LangTextKey
  crawlNumber: number
  resetOffset?: boolean
}

// 移除一页作品或全部作品的标签
class RemoveWorksTagsAction extends BookmarkPageBatchActionBase<WorkBookmarkData> {
  constructor(btn: HTMLButtonElement, options: RemoveWorksTagsActionOptions) {
    super()

    btn.addEventListener('click', () => {
      if (this.isRunning()) {
        toast.error(lang.transl('_当前任务尚未完成'))
        return
      }

      const msg = lang.transl(options.title)
      log.warning(msg)
      log.warning(lang.transl('_它们会变成未分类状态'))
      toast.warning(msg)
      EVT.fire('closeCenterPanel')

      void this.run({
        crawlNumber: options.crawlNumber,
        resetOffset: options.resetOffset,
        slowCrawl: true,
        collectWork: (workData, bookmarkTags) =>
          this.createBookmarkData(workData, bookmarkTags),
        onCollected: async (bookmarkDataList) => {
          // 在移除作品的收藏标签时，如果它本来就没有添加收藏标签，就不需要处理它，这样可以提高效率。
          // 所以在处理之前，先筛选出已经添加了收藏标签的作品。
          const haveTagsList = bookmarkDataList.filter(
            (data) => data.bookmarkTags && data.bookmarkTags.length > 0
          )
          await removeBookmarkTags.start(haveTagsList)
        },
      })
    })
  }
}

export { RemoveWorksTagsAction }
