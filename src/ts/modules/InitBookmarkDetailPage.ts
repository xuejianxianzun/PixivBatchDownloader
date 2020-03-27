// 初始化 bookmark_detail 页面
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { DOM } from './DOM'
import { options } from './Options'
import { API } from './API'
import { store } from './Store'

class InitBookmarkDetailPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected appendCenterBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_抓取相似图片'), [
      ['title', lang.transl('_抓取相似图片')],
    ]).addEventListener(
      'click',
      () => {
        this.readyCrawl()
      },
      false
    )
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_个数'),
      tip: lang.transl('_要获取的作品个数2'),
      rangTip: `1 - ${this.maxCount}`,
      value: this.maxCount.toString(),
    })
  }

  protected getWantPage() {
    const check = this.checkWantPageInputGreater0()
    if (check == undefined) {
      return
    }
    this.crawlNumber = check

    if (this.crawlNumber > this.maxCount) {
      this.crawlNumber = this.maxCount
    }
  }

  // 获取相似的作品列表
  protected async getIdList() {
    let data = await API.getRecommenderData(API.getIllustId(), this.crawlNumber)

    for (const id of data.recommendations) {
      store.idList.push(id.toString())
    }

    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {}
}
export { InitBookmarkDetailPage }
