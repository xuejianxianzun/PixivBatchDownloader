// 初始化 pixivision 页面
import { InitPageBase } from './InitPageBase'
import { CrawlPixivisionPage } from './CrawlPixivisionPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { centerButtons } from './CenterButtons'
import { options } from './Options'
import { form } from './Settings'

class InitPixivisionPage extends InitPageBase {
  constructor(crawler: CrawlPixivisionPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlPixivisionPage

  protected appendCenterBtns() {
    const typeA = document.querySelector(
      'a[data-gtm-action=ClickCategory]'
    )! as HTMLAnchorElement
    const type = typeA.dataset.gtmLabel

    if (type === 'illustration' || type === 'manga' || type === 'cosplay') {
      // 在插画、漫画、cosplay类型的页面上创建下载功能
      centerButtons
        .add(Colors.blue, lang.transl('_抓取该页面的图片'))
        .addEventListener(
          'click',
          () => {
            this.crawler.readyCrawl()
          },
          false
        )
    }
  }

  protected setFormOption() {
    options.hideOption([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18])

    // pixivision 里，文件名只有 id 标记会生效，所以把文件名部分替换成 id
    form.userSetName.value = '{p_title}/{id}'
  }

  protected destroySelf() {}
}
export { InitPixivisionPage }
