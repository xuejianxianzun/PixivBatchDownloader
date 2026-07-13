import { EVT } from '../../EVT'
import { lang } from '../../Language'
import { log } from '../../Log'
import { toast } from '../../Toast'
import { unBookmarkWorks } from '../../UnBookmarkWorks'
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

          // 同时正常保存收藏数据，在取消收藏时使用
          return this.createBookmarkData(workData, bookmarkTags)
        },
        onCollected: async (bookmarkDataList) => {
          this.exportBookmark404Ids()
          await unBookmarkWorks.start(bookmarkDataList)
        },
      })
    })
  }
}

export { UnBookmarkAll404WorksAction }
