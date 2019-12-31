// 初始化发现页面
import { InitPageBase } from './InitPageBase'
import { CrawlDiscoverPage } from './CrawlDiscoverPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { centerPanel} from './CenterPanel'
import { options } from './Options'

import { DeleteWorks } from './DeleteWorks'

class InitDiscoverPage extends InitPageBase {
  constructor(crawler: CrawlDiscoverPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlDiscoverPage

  protected appendCenterBtns() {
    centerPanel.addButton(Colors.blue, lang.transl('_抓取当前作品'), [
      ['title', lang.transl('_抓取当前作品Title')]
    ]).addEventListener('click', () => {
      this.crawler.readyCrawl()
    })
  }

  protected setFormOption() {
    options.hideOption([1, 15, 18])
  }

  protected appendElseEl() {
    const deleteWorks = new DeleteWorks('._2RNjBox')

    deleteWorks.addClearMultipleBtn('._3b8AXEx')

    deleteWorks.addClearUgoiraBtn('.AGgsUWZ')

    deleteWorks.addManuallyDeleteBtn()
  }

  protected destroySelf() {}
}
export { InitDiscoverPage }
