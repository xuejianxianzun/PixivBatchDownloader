import { EVT } from '../../EVT'
import { ArtworkCommonData, BookmarkResult } from '../../crawl/CrawlResult'
import { filter, FilterOption } from '../../filter/Filter'
import { lang } from '../../Language'
import { log } from '../../Log'
import { states } from '../../store/States'
import { toast } from '../../Toast'
import { Tools } from '../../Tools'
import { Utils } from '../../utils/Utils'
import { BookmarkPageBatchActionBase } from './BookmarkPageBatchActionBase'
import { pageType } from '../../PageType'
import { settings } from '../../setting/Settings'

// 导出收藏的作品列表。会包含已被删除的作品
class ExportBookmarkListAction extends BookmarkPageBatchActionBase<BookmarkResult> {
  private exportList: BookmarkResult[] = []

  constructor(btn: HTMLButtonElement) {
    super()

    btn.addEventListener('click', () => {
      void this.exportBookmarkList()
    })
  }

  private async exportBookmarkList() {
    if (states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    this.exportList = []
    EVT.fire('closeCenterPanel')
    const msg = lang.transl('_导出收藏列表')
    log.log(msg)
    log.log('')
    toast.show(msg)

    const crawlNumber = settings.crawlNumber[pageType.type].value
    log.warning(
      lang.transl('_抓取多少页面') + ': ' + crawlNumber,
      'exportBookmarkListCrawlNumber'
    )

    await this.run({
      crawlNumber: crawlNumber,
      slowCrawl: true,
      collectWork: async (workData) => {
        const filterOpt: FilterOption = {
          aiType: workData.aiType,
          id: workData.id,
          isOriginal: workData.isOriginal,
          tags: workData.tags,
          title: workData.title,
          bookmarkData: workData.bookmarkData,
          createDate: workData.createDate,
          userId: workData.userId,
          xRestrict: workData.xRestrict,
        }

        if (!(await filter.check(filterOpt))) {
          return null
        }

        return {
          id: workData.id,
          type:
            (workData as ArtworkCommonData).illustType === undefined
              ? 'novels'
              : 'illusts',
          tags: workData.tags,
          restrict: workData.bookmarkData?.private || false,
        }
      },
      onCollected: async (bookmarkDataList) => {
        this.exportList = bookmarkDataList
        if (this.exportList.length === 0) {
          return
        }

        const resultList = await Utils.json2BlobSafe(this.exportList)
        for (const result of resultList) {
          Utils.downloadFile(
            result.url,
            `Bookmark list-total ${
              result.total
            }-from ${Tools.getPageTitle()}-${Utils.replaceUnsafeStr(
              new Date().toLocaleString()
            )}.json`
          )
        }

        const msg = lang.transl('_导出收藏列表')
        log.success('✅' + msg)
        toast.success(msg)
      },
    })
  }
}

export { ExportBookmarkListAction }
