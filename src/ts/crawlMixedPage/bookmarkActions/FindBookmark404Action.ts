import { EVT } from '../../EVT'
import { lang } from '../../Language'
import { log } from '../../Log'
import { toast } from '../../Toast'
import { Bookmark404ActionBase } from './Bookmark404ActionBase'

class FindBookmark404Action extends Bookmark404ActionBase {
  constructor(btn: HTMLButtonElement) {
    super()

    btn.addEventListener('click', () => {
      const title = lang.transl('_查找所有已被删除的作品')
      log.log(title)
      toast.show(title, {
        position: 'topCenter',
      })
      EVT.fire('closeCenterPanel')

      this.reset()

      void this.run({
        crawlNumber: -1,
        resetOffset: true,
        slowCrawl: true,
        collectWork: (workData) => {
          this.get404IdList(workData)

          return null
        },
        onCollected: async (bookmarkDataList) => {
          this.exportBookmark404Ids()
        },
      })
    })
  }
}

export { FindBookmark404Action }
