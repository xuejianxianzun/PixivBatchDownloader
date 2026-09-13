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

    EVT.fire('closeSettingsPanel')
    const msg = lang.transl('_导出收藏列表')
    log.success('🚀' + msg)
    log.log(lang.transl('_导出时会包含已删除或非公开的作品'))
    toast.show(msg)
    // 测试用：该用户的收藏里有一些已删除的作品
    // https://www.pixiv.net/users/3902314/bookmarks/artworks?rest=show

    const crawlNumber = settings.crawlNumber[pageType.type].value
    log.warning(
      lang.transl('_抓取多少页面') + ': ' + crawlNumber,
      'exportBookmarkListCrawlNumber'
    )

    await this.run({
      crawlNumber: crawlNumber,
      slowCrawl: true,
      collectWork: async (workData, bookmarkTags) => {
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

        const checkAITag = workData.tags.includes('AI生成')
        const AIWork = Tools.getAITypeTextEnglish(
          checkAITag ? 2 : workData.aiType || 0
        )

        // 这里返回的数据类型是 BookmarkResult 的超集
        return {
          id: workData.id,
          type:
            (workData as ArtworkCommonData).illustType === undefined
              ? 'novels'
              : 'illusts',
          title: workData.title,
          aiType: workData.aiType,
          AIWork,
          xRestrict: Tools.getXRestrictText(workData.xRestrict),
          createDate: workData.createDate,
          userId: workData.userId,
          userName: workData.userName,
          tags: workData.tags,
          bookmarkTags: bookmarkTags || [],
          bookmarkId: workData.bookmarkData?.id || '',
          // 收藏的隐私状态
          bookmarkRestrict: workData.bookmarkData?.private
            ? 'private'
            : 'public',
          // 作品是否为私密收藏。由于 restrict 这个名字的含义不够准确（用户可能误以是作品本身的私密状态），因此我在上面添加了 bookmarkRestrict 字段
          restrict: workData.bookmarkData?.private || false,
        }
      },
      onCollected: async (bookmarkDataList) => {
        if (bookmarkDataList.length === 0) {
          return
        }

        const resultList = await Utils.json2BlobSafe(bookmarkDataList)
        for (const result of resultList) {
          Utils.downloadFile(
            result.url,
            `Bookmark list-total ${
              result.total
            }-from ${Tools.getPageTitle()}-${Tools.formatDateTimeInFilename()}.json`
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
