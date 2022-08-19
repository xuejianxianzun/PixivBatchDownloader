// 初始化旧版收藏页面
// 该页面类型已不复存在，这个类仅做占位之用。
// 在 PageType 里不能删除 BookmarkLegacy 枚举成员，因为有些代码里硬编码了它的枚举值 3
// 例如：settings.wantPageArr[pageType.type]
// settings.nameRuleForEachPageType[pageType.type]
import { InitPageBase } from '../crawl/InitPageBase'

class InitBookmarkLegacyPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }
}
export { InitBookmarkLegacyPage }
