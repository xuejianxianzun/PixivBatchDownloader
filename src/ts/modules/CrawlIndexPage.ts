// 抓取首页
import { CrawlPageBase } from './CrawlPageBase'
import { lang } from './Lang'
import { store } from './Store'
import { log } from './Log'

class CrawlIndexPage extends CrawlPageBase {
  protected nextStep() {
    // 在主页通过id抓取时，不需要获取列表页，直接完成
    log.log(lang.transl('_开始获取作品页面'))
    this.getIdList()
  }

  protected getWantPage() {}

  protected getIdList() {
    const textarea = document.getElementById(
      'down_id_input'
    ) as HTMLTextAreaElement
    // 检查 id
    const tempSet = new Set(textarea.value.split('\n'))
    const idValue = Array.from(tempSet)
    for (const id of idValue) {
      // 如果有 id 不是数字，或者处于非法区间，中止任务
      const nowId = parseInt(id)
      if (isNaN(nowId) || nowId < 22 || nowId > 99999999) {
        log.error(lang.transl('_id不合法'), 0, false)
      } else {
        store.idList.push(nowId.toString())
      }
    }
    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {}
}
export { CrawlIndexPage }
