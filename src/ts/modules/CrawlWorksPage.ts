// 抓取作品页
import { CrawlPageBase } from './CrawlPageBase'
import { userWorksType } from './CrawlArgument.d'
import { DOM } from './DOM'
import { lang } from './Lang'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'

class CrawlWorksPage extends CrawlPageBase {
  public crawlDirection: number = 0 // 抓取方向，在作品页内指示抓取新作品还是旧作品
  /*
  -1 抓取新作品
  0 不设置抓取方向
  1 抓取旧作品
  */

  public crawlRelated: boolean = false // 是否下载相关作品（作品页内的）

  protected getWantPage() {
    if (store.states.quickDownload) {
      // 快速下载
      this.crawlNumber = 1
    } else {
      // 检查下载页数的设置
      if (!this.crawlRelated) {
        this.crawlNumber = this.checkWantPageInput(
          lang.transl('_checkWantPageRule1Arg3'),
          lang.transl('_checkWantPageRule1Arg4')
        )
      } else {
        // 相关作品的提示
        this.crawlNumber = this.checkWantPageInput(
          lang.transl('_checkWantPageRule1Arg9'),
          lang.transl('_checkWantPageRule1Arg10')
        )
      }
    }
  }

  protected nextStep() {
    // 下载相关作品
    if (this.crawlRelated) {
      this.getRelatedList()
    } else if (store.states.quickDownload) {
      // 快速下载
      store.idList.push(API.getIllustId(window.location.href))

      log.log(lang.transl('_开始获取作品页面'))

      this.getIdListFinished()
    } else {
      // 向前向后下载
      this.getIdList()
    }
  }

  public async getIdList() {
    let type: userWorksType[] = ['illusts', 'manga']
    let idList = await API.getUserWorksByType(DOM.getUserId(), type)

    // 储存符合条件的 id
    let nowId = parseInt(API.getIllustId(window.location.href))
    idList.forEach(id => {
      let idNum = parseInt(id)
      // 新作品
      if (idNum >= nowId && this.crawlDirection === -1) {
        store.idList.push(id)
      } else if (idNum <= nowId && this.crawlDirection === 1) {
        // 旧作品
        store.idList.push(id)
      }
    })

    // 当设置了下载个数时，进行裁剪
    if (this.crawlNumber !== -1) {
      // 新作品 升序排列
      if (this.crawlDirection === -1) {
        store.idList.sort(function(x, y) {
          return parseInt(x) - parseInt(y)
        })
      } else {
        // 旧作品 降序排列
        store.idList.sort(function(x, y) {
          return parseInt(y) - parseInt(x)
        })
      }

      store.idList = store.idList.splice(0, this.crawlNumber)
    }

    this.getIdListFinished()
  }

  // 下载相关作品时使用
  public async getRelatedList() {
    let data = await API.getRelatedData(API.getIllustId())
    const recommendData = data.body.recommendMethods
    // 取出相关作品的 id 列表
    let recommendIdList = Object.keys(recommendData)
    // 当设置了下载个数时，进行裁剪
    if (this.crawlNumber !== -1) {
      recommendIdList = recommendIdList.reverse().slice(0, this.crawlNumber)
    }
    store.idList = store.idList.concat(recommendIdList)

    log.log(lang.transl('_相关作品抓取完毕', store.idList.length.toString()))
    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {
    this.crawlDirection = 0 // 解除下载方向的标记
    this.crawlRelated = false // 解除下载相关作品的标记
  }

  public destroy() {}
}

export { CrawlWorksPage }
