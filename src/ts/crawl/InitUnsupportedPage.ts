import { InitPageBase } from './InitPageBase'

// 初始化不支持的页面类型
class InitUnsupportedPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  // 在不支持的页面类型里，不会添加专门用于当前页面的抓取按钮
  // 只能通过这些方式建立下载：
  // 1. 通用的“手动选择作品”功能，由 SelectWork 模块提供支持。
  // 2. 通用的快速下载功能（在作品缩略图上点击下载按钮），由以下模块提供支持：
  // ButtonsOnArtworkThumbOnPC
  // ButtonsOnNovelThumbOnPC
  // DownloadBtnOnThumbOnMobile
  // 备注：以上两种方式都依赖 WorkThumbnail 模块来识别作品缩略图，这样才能抓取作品。
  protected addCrawlBtns() {}
}

export { InitUnsupportedPage }
