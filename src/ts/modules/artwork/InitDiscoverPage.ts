// 初始化发现页面
import { InitPageBase } from '../InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { DOM } from '../DOM'
import { options } from '../setting/Options'
import { DeleteWorks } from '../DeleteWorks'
import { API } from '../API'
import { store } from '../Store'

class InitDiscoverPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected addCrawlBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_抓取当前作品'), [
      ['title', lang.transl('_抓取当前作品Title')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected initAny() {}

  protected setFormOption() {
    options.hideOption([1])
  }

  protected addAnyElement() {
    const deleteWorks = new DeleteWorks('._2RNjBox')

    deleteWorks.addClearMultipleBtn('._3b8AXEx')

    deleteWorks.addClearUgoiraBtn('.AGgsUWZ')

    deleteWorks.addManuallyDeleteBtn()
  }

  protected getWantPage() {}

  protected getIdList() {
    // 在发现页面，仅下载已有部分，所以不需要去获取列表页
    const nowIllust = document.querySelectorAll(
      'figure>div>a'
    ) as NodeListOf<HTMLAnchorElement>
    // 获取已有作品的 id
    Array.from(nowIllust).forEach((el) => {
      // discovery 列表的 url 是有额外后缀的，需要去掉
      const id = API.getIllustId(el.href.split('&uarea')[0])
      store.idList.push({
        type: 'unknown',
        id,
      })
    })

    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {}
}
export { InitDiscoverPage }
