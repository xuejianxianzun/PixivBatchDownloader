import { InitPageBase } from '../crawl/InitPageBase'
import { lang } from '../Language'
import { API } from '../API'
import { store } from '../store/Store'
import { EVT } from '../EVT'
import { log } from '../Log'
import { Tools } from '../Tools'
import { states } from '../store/States'
import '../pageFunciton/SaveAvatarIcon'
import '../pageFunciton/SaveAvatarImage'
import '../pageFunciton/SaveUserCover'
import { BookmarkAllWorks } from '../pageFunciton/BookmarkAllWorks'
import { Utils } from '../utils/Utils'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { toast } from '../Toast'

// 初始化用户主页里的约稿分类页面
// 文档：notes/适配用户主页的约稿分类页面.md
class InitUserRequestPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private bookmarkAll = new BookmarkAllWorks()

  // 添加中间按钮
  protected addCrawlBtns() {
    this.addInitPageBtn(
      'crawlBtns',
      '_抓取约稿作品',
      '_抓取约稿作品',
      'startCrawlRequestWorks',
      'brand'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })

    this.addStartTimedCrawlBtn(this.readyCrawl.bind(this))
    this.addCancelTimedCrawlBtn()
  }

  protected addAnyElement() {
    this.addInitPageBtn(
      'otherBtns',
      '_保存用户头像',
      '',
      'saveUserAvatar',
      'brand'
    ).addEventListener('click', () => {
      EVT.fire('saveAvatarImage')
    })

    this.addInitPageBtn(
      'otherBtns',
      '_保存用户头像为图标',
      '_保存用户头像为图标说明',
      'saveUserAvatarAsIcon',
      'brand'
    ).addEventListener('click', () => {
      EVT.fire('saveAvatarIcon')
    })

    this.addInitPageBtn(
      'otherBtns',
      '_保存用户封面',
      '',
      'saveUserCoverImage',
      'brand'
    ).addEventListener('click', () => {
      EVT.fire('saveUserCover')
    })

    const bookmarkAllBtn = this.addInitPageBtn(
      'otherBtns',
      '_收藏所有约稿作品',
      '',
      'bookmarkAllRequestWorks',
      'brand'
    )

    bookmarkAllBtn.addEventListener('click', async () => {
      if (states.busy) {
        toast.error(lang.transl('_当前任务尚未完成'))
        return
      }

      // 获取该用户在约稿页面里所有作品的 id 列表
      // 模拟了抓取流程，以获取相同的 id 列表
      EVT.fire('bookmarkModeStart')
      this.crawlNumber = -1 // 抓取所有约稿作品
      this.getIdList()
      toast.show(lang.transl('_正在抓取'))
    })

    this.bookmarkAll = new BookmarkAllWorks(bookmarkAllBtn)
    window.addEventListener(
      EVT.list.getIdListFinished,
      this.bookmarkAll.getBookmarkIdList
    )
  }

  protected getWantPage() {
    this.crawlNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlNumber === -1) {
      log.warning(lang.transl('_抓取所有约稿作品'))
    } else {
      log.warning(lang.transl('_抓取x个约稿作品', this.crawlNumber.toString()))
    }
  }

  protected async getIdList() {
    log.log(lang.transl('_正在抓取'))

    // 先获取约稿 ID 列表
    let worksType: 'artworks' | 'novels' | 'all' = 'all'
    const path = location.pathname
    if (path.includes('/artworks')) {
      worksType = 'artworks'
    } else if (path.includes('/novels')) {
      worksType = 'novels'
    }

    const userId = Tools.getCurrentPageUserId()
    const checkUser = await this.checkUserId(userId)
    if (!checkUser) {
      return this.getIdListFinished()
    }

    let requetIds: string[] = []
    /** 如果路径里带有 /sent，表示是该用户发出的约稿。如果没有则是自己创作的约稿 */
    if (location.pathname.includes('/sent')) {
      requetIds = await API.getUserRequestSentIds(
        userId,
        worksType,
        this.crawlNumber
      )
    } else {
      requetIds = await API.getUserRequestIds(
        userId,
        worksType,
        this.crawlNumber
      )
    }

    // 然后根据约稿 ID 获得作品 ID 列表
    // 由于约稿 ID 可能很多，所以需要分批请求，每批最多可以携带 50 个 ID
    const splitIds = Utils.splitArray(requetIds, 50)
    for (const ids of splitIds) {
      const idList = await API.getRequestWorksIdList(ids)
      if (states.stopCrawl) break
      store.idList = store.idList.concat(idList)
    }

    this.getIdListFinished()
  }

  protected sortResult() {
    // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
    store.result.sort(Utils.sortByProperty('id'))
  }

  protected destroy() {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')

    window.removeEventListener(
      EVT.list.getIdListFinished,
      this.bookmarkAll.getBookmarkIdList
    )
  }
}
export { InitUserRequestPage }
