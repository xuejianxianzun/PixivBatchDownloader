import { EVT } from '../../EVT'
import { lang } from '../../Language'
import { log } from '../../Log'
import { toast } from '../../Toast'
import { unBookmarkWorks } from '../../UnBookmarkWorks'
import { Utils } from '../../utils/Utils'
import { Bookmark404ActionBase } from './Bookmark404ActionBase'

class UnBookmarkAll404WorksAction extends Bookmark404ActionBase {
  constructor(btn: HTMLButtonElement) {
    super()

    btn.addEventListener('click', () => {
      const msg = lang.transl('_取消收藏所有已被删除的作品')
      log.warning(msg)
      toast.warning(msg)
      EVT.fire('closeCenterPanel')

      this.reset()

      void this.run({
        crawlNumber: -1,
        resetOffset: true,
        slowCrawl: true,
        collectWork: (workData, bookmarkTags) => {
          this.get404IdList(workData)

          // 保存所有收藏的作品的数据
          return this.createBookmarkData(workData, bookmarkTags)
        },
        onCollected: async (bookmarkDataList) => {
          this.exportBookmark404Ids()
          // 过滤出 404 作品的数据，并取消收藏
          const bookmarkData404 = bookmarkDataList.filter((data) =>
            this.idList404.includes(data.workID)
          )
          await unBookmarkWorks.start(bookmarkData404)
        },
      })
    })
  }
}

export { UnBookmarkAll404WorksAction }
