// 抓取发现页面
import { CrawlPageBase } from './CrawlPageBase'
import { lang } from './Lang'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'

class CrawlDiscoverPage extends CrawlPageBase {
  protected getWantPage() {}

  protected getIdList() {
    // 在发现页面，仅下载已有部分，所以不需要去获取列表页
    const nowIllust = document.querySelectorAll('figure>div>a') as NodeListOf<
      HTMLAnchorElement
    >
    // 获取已有作品的 id
    Array.from(nowIllust).forEach(el => {
      // discovery 列表的 url 是有额外后缀的，需要去掉
      const id = API.getIllustId(el.href.split('&uarea')[0])
      store.idList.push(id)
    })

    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {}

  public destroy() {}
}

export { CrawlDiscoverPage }
