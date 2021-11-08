import { options } from '../setting/Options'
import { InitPageBase } from './InitPageBase'

// 初始化不支持的页面类型
class InitUnsupportedPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  // 在不支持的页面类型里，不会添加专门用于当前页面的抓取按钮
  // 只会由 SelectWork 模块添加通用的“手动抓取”功能
  protected addCrawlBtns() {}

  protected setFormOption() {
    options.hideOption([1])
  }
}

export { InitUnsupportedPage }
