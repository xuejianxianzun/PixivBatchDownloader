import { log } from '../Log'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { pageType } from '../PageType'
import { options } from '../setting/Options'
import { settings } from '../setting/Settings'
import { IDData } from '../store/StoreType'

/**抓取每个用户最新的几个作品 */
class CrawlLatestFewWorks {
  constructor() {
    this.bindEvents()
  }

  // 仅在特定页面启用：关注页面
  private readonly enablePageType = [pageType.list.Following]

  private get enable() {
    return this.enablePageType.includes(pageType.type)
  }

  private get canUse() {
    return (
      this.enable &&
      settings.crawlLatestFewWorks &&
      settings.crawlLatestFewWorksNumber > 0
    )
  }

  private bindEvents() {
    // 在不启用的页面类型里，隐藏这个设置项
    window.addEventListener(EVT.list.settingInitialized, this.hideOption)
    window.addEventListener(EVT.list.pageSwitch, this.hideOption)
  }

  private hideOption() {
    if (!this.enable) {
      window.setTimeout(() => {
        options.hideOption([15])
      }, 0)
    }
  }

  public showLog() {
    if (this.canUse) {
      log.warning(
        `${lang.transl('_抓取每个用户最新的几个作品')}: ${settings.crawlLatestFewWorksNumber} `
      )
    }
  }

  public filter(idList: IDData[]) {
    if (this.canUse) {
      // 把 id 按照大小倒序排序，取出最新的几个作品（id 数字最大的几个）
      const sorted = idList.toSorted((a, b) => {
        return parseInt(b.id) - parseInt(a.id)
      })
      const needNumber = settings.crawlLatestFewWorksNumber
      const newIdList: IDData[] = []
      for (let i = 0; i < Math.min(needNumber, sorted.length); i++) {
        newIdList.push(sorted[i])
      }
      return newIdList
    }
    return idList
  }
}

const crawlLatestFewWorks = new CrawlLatestFewWorks()
export { crawlLatestFewWorks }
