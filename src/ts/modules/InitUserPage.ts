// 初始化用户页面
import { InitPageBase } from './InitPageBase'
import { API } from './API'
import { CrawlUserPage } from './CrawlUserPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { centerButtons } from './CenterButtons'
import { options } from './Options'
import { bookmarksAddTag } from './BookmarksAddTag'

class InitUserPage extends InitPageBase {
  constructor(crawler: CrawlUserPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlUserPage

  protected appendCenterBtns() {
    centerButtons
      .add(Colors.blue, lang.transl('_开始抓取'), [
        ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')]
      ])
      .addEventListener('click', () => {
        this.crawler.readyCrawl()
      })

    // 添加下载推荐作品的按钮，只在旧版收藏页面使用
    const columnTitle = document.querySelector('.column-title')
    if (columnTitle) {
      const downRecmdBtn = centerButtons.add(
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
      let btn = centerButtons.add(Colors.green, lang.transl('_添加tag'), [
        ['title', lang.transl('_添加tag')]
      ])
      btn.id = 'add_tag_btn'

      bookmarksAddTag.init(btn)
    }
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_checkWantPageRule1Arg8'),
      rangTip: lang.transl('_数字提示1'),
      value: '1'
    })

    options.hideOption([15, 18])

    // 在书签页面隐藏只要书签选项
    if (location.href.includes('bookmark.php')) {
      options.hideOption([6])
    }
  }

  protected destroySelf() {}
}
export { InitUserPage }
