import { EVT } from '../EVT'
import { pageType } from '../PageType'
import { options } from '../setting/Options'
import { InitPageBase } from './InitPageBase'

// 投稿页面
class InitRequestPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected initAny() {
    // 约稿页面 和 已完成的约稿页面 互相切换时，需要重新隐藏第一个选项
    window.addEventListener(EVT.list.pageSwitch, () => {
      if (pageType.type === pageType.list.Request) {
        this.setFormOption()
      }
    })
  }

  protected addCrawlBtns() {}

  protected setFormOption() {
    options.hideOption([1])
  }
}

export { InitRequestPage }
