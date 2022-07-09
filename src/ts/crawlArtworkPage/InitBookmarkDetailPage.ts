// 初始化 bookmark_detail 页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { options } from '../setting/Options'
import { API } from '../API'
import { store } from '../store/Store'

class InitBookmarkDetailPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取相似图片',
      '_抓取相似图片'
    ).addEventListener(
      'click',
      () => {
        this.readyCrawl()
      },
      false
    )
  }

  protected initAny() {}

  protected setFormOption() {
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: '_抓取多少作品',
      tip: '_想要获取多少个作品',
      rangTip: `1 - ${this.maxCount}`,
    })
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, false)
  }

  // 获取相似的作品列表
  protected async getIdList() {
    let data = await API.getRecommenderData(
      Tools.getIllustId(),
      this.crawlNumber
    )

    for (const id of data.recommendations) {
      store.idList.push({
        type: 'unknown',
        id: id.toString(),
      })
    }

    this.getIdListFinished()
  }
}
export { InitBookmarkDetailPage }
