// 初始化发现页面
import { InitPageBase } from './InitPageBase'
import { CrawlDiscoverPage } from './CrawlDiscoverPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'
import { DeleteWorks } from './DeleteWorks'

class InitDiscoverPage extends InitPageBase {
  constructor(crawler: CrawlDiscoverPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlDiscoverPage

  protected appendCenterBtns() {
    ui.addCenterButton(Colors.blue, lang.transl('_抓取当前作品'), [
      ['title', lang.transl('_抓取当前作品Title')]
    ]).addEventListener('click', () => {
      this.crawler.readyCrawl()
    })
  }

  protected setFormOptin() {
    this.hideNotNeedOption([1, 14])
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
