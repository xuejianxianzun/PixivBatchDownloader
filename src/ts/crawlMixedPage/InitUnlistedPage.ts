//初始化 Unlisted 作品页
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { options } from '../setting/Options'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'
import { IDData } from '../store/StoreType'
import { store } from '../store/Store'

class InitUnlistedPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected addCrawlBtns() {
    Tools.addBtn('crawlBtns', Colors.bgBlue, '_抓取此作品').addEventListener(
      'click',
      () => {
        this.readyCrawl()
      }
    )
  }

  protected setFormOption() {
    options.hideOption([1])
  }

  protected destroy() {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')
  }

  protected nextStep() {
    this.getIdList()
  }

  protected getIdList() {
    const workId = Utils.getURLPathField(window.location.pathname, 'unlisted')
    const isNovel = window.location.href.includes('/novel')
    const idData: IDData = {
      type: isNovel ? 'novels' : 'illusts',
      id: workId,
    }
    store.idList = [idData]

    this.getIdListFinished()
  }
}

export { InitUnlistedPage }
