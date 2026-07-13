import { Utils } from '../../utils/Utils'
import { log } from '../../Log'
import { lang } from '../../Language'
import { WorkBookmarkData } from '../../Bookmark'
import { BookmarkPageBatchActionBase } from './BookmarkPageBatchActionBase'
import { ArtworkCommonData, NovelCommonData } from '../../crawl/CrawlResult'

/** 继承了在收藏页面里的通用抓取流程，并添加了导出 404 作品列表的功能 */
abstract class Bookmark404ActionBase extends BookmarkPageBatchActionBase<WorkBookmarkData> {
  protected idList404: string[] = []

  protected reset() {
    this.idList404 = []
  }

  // 获取被删除的作品列表
  protected get404IdList(workData: ArtworkCommonData | NovelCommonData) {
    if (Number.parseInt(workData.userId) === 0) {
      this.idList404.push(workData.id)
      log.log(
        lang.transl(
          '_当前有x个已被删除的作品',
          this.idList404.length.toString()
        ),
        'Bookmark404IdListCount'
      )
    }
  }

  protected exportBookmark404Ids() {
    if (this.idList404.length === 0) {
      log.success(lang.transl('_没有找到已被删除的作品'))
      return
    }

    const blob = Utils.json2Blob(this.idList404)
    const url = URL.createObjectURL(blob)
    Utils.downloadFile(url, '404 bookmark ID list.json')
    log.success(lang.transl('_已导出被删除的作品的ID列表'))
  }
}

export { Bookmark404ActionBase }
