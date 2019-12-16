// 初始化用户页面
import { InitPageBase } from './InitPageBase'
import { API } from './API'
import { CrawlUserPage } from './CrawlUserPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'
import { bookmarksAddTag } from './BookmarksAddTag'

class InitUserPage extends InitPageBase {
  constructor(crawler: CrawlUserPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlUserPage

  protected appendCenterBtns() {
    ui.addCenterButton(Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')]
    ]).addEventListener('click', () => {
      this.crawler.readyCrawl()
    })

    // 添加下载推荐作品的按钮，只在旧版收藏页面使用
    const columnTitle = document.querySelector('.column-title')
    if (columnTitle) {
      const downRecmdBtn = ui.addCenterButton(
        Colors.blue,
        lang.transl('_抓取推荐作品'),
        [['title', lang.transl('_抓取推荐作品Title')]]
      )
      downRecmdBtn.addEventListener(
        'click',
        () => {
          this.crawler.crawlRecommended = true
          this.crawler.readyCrawl()
        },
        false
      )
    }

    // 如果存在 token，则添加“添加 tag”按钮
    if (API.getToken()) {
      let btn = ui.addCenterButton(Colors.green, lang.transl('_添加tag'), [
        ['title', lang.transl('_添加tag')]
      ])
      btn.id = 'add_tag_btn'

      bookmarksAddTag.init(btn)
    }
  }

  protected setFormOptin() {
    // 设置页数
    this.setWantPageTip1.textContent = lang.transl('_页数')
    this.setWantPageTip1.dataset.tip = lang.transl('_checkWantPageRule1Arg8')
    this.setWantPageTip2.textContent = lang.transl('_数字提示1')
    this.setWantPage.value = '-1'

    // 在书签页面隐藏只要书签选项
    if (location.href.includes('bookmark.php')) {
      this.hideNotNeedOption([11])
    }
  }
}
export { InitUserPage }
