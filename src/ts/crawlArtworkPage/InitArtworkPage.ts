//初始化 artwork 作品页
import { InitPageBase } from '../crawl/InitPageBase'
import { lang } from '../Language'
import { store } from '../store/Store'
import { userWorksType } from '../crawl/CrawlArgument'
import { Tools } from '../Tools'
import { API } from '../API'
import { log } from '../Log'
import { Utils } from '../utils/Utils'
import { pageType } from '../PageType'
import './CrawlRecommendWorksAfterBookmark'
import '../buttonsOnThumb/ButtonsOnArtworkPage'
import { settings } from '../setting/Settings'

class InitArtworkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private crawlDirection: number = 0 // 抓取方向，指示抓取新作品还是旧作品
  /*
  -1 抓取新作品
  0 不设置抓取方向
  1 抓取旧作品
  */

  private crawlRelated: boolean = false // 是否下载相关作品

  protected initAny(): void {
    this.findArtworkWrap()
  }

  private readonly artworkWrapID = 'XZArtworkWrap'
  private readonly contentWrapID = 'XZContentWrap'
  private timer?: number

  /**查找作品区域（左右两个板块）的父元素 */
  // 为其添加特定的 ID，以避免下载器设置的样式因为 Pixiv 改版而失效
  private findArtworkWrap() {
    window.clearInterval(this.timer)
    this.timer = window.setInterval(() => {
      if (pageType.type !== pageType.list.Artwork) {
        window.clearInterval(this.timer)
        return
      }
      const warp = document.querySelector(`#${this.artworkWrapID}`)
      if (warp) {
        return
      }
      // main 是作品区域左侧内容的元素
      const main = document.querySelector('main')
      if (main && main.parentElement) {
        // main 的父元素是作品区域的父元素，包含左侧 main 元素和右侧的 aside 元素
        const wrap = main.parentElement
        wrap.id = this.artworkWrapID
        // main 的祖父元素是作品区域和相关作品区域的父元素
        wrap.parentElement!.id = this.contentWrapID
      }
    }, 1000)
  }

  protected addCrawlBtns() {
    this.addInitPageBtn(
      'crawlBtns',
      '_从本页开始抓取new',
      '',
      'startCrawlingFromCurrentPageNew',
      'brand'
    ).addEventListener('click', () => {
      this.crawlDirection = -1
      this.readyCrawl()
    })

    this.addInitPageBtn(
      'crawlBtns',
      '_从本页开始抓取old',
      '',
      'startCrawlingFromCurrentPageOld',
      'brand'
    ).addEventListener('click', () => {
      this.crawlDirection = 1
      this.readyCrawl()
    })

    const downRelatedBtn = this.addInitPageBtn(
      'crawlBtns',
      '_抓取相关作品',
      '',
      'crawlRelatedWork',
      'brand'
    )
    downRelatedBtn.addEventListener(
      'click',
      () => {
        this.crawlRelated = true
        this.readyCrawl()
      },
      false
    )
  }

  protected destroy() {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')
  }

  protected getWantPage() {
    // 检查下载页数的设置
    if (!this.crawlRelated) {
      const crawlAllTip =
        this.crawlDirection === -1
          ? lang.transl('_从本页开始抓取new')
          : lang.transl('_从本页开始抓取old')
      this.crawlNumber = settings.crawlNumber[pageType.type].value
      if (this.crawlNumber === -1) {
        log.warning(crawlAllTip)
      } else {
        log.warning(
          lang.transl('_从本页开始抓取x个', this.crawlNumber.toString())
        )
      }
    } else {
      // 相关作品的提示
      this.crawlNumber = settings.crawlNumber[pageType.type].value
      if (this.crawlNumber === -1) {
        log.warning(lang.transl('_下载所有相关作品'))
      } else {
        log.warning(
          lang.transl('_下载x个相关作品', this.crawlNumber.toString())
        )
      }
    }
  }

  protected nextStep() {
    // 下载相关作品
    if (this.crawlRelated) {
      this.getRelatedList()
    } else {
      // 向前向后下载
      this.getIdList()
    }
  }

  protected async getIdList() {
    const userId = Tools.getCurrentPageUserId()
    const checkUser = await this.checkUserId(userId)
    if (!checkUser) {
      return this.getIdListFinished()
    }

    let type: userWorksType[] = ['illusts', 'manga']
    let idList = await API.getUserWorksByType(userId, type)

    // 储存符合条件的 id
    let nowId = parseInt(Tools.getIllustId(window.location.href))
    idList.forEach((id) => {
      let idNum = parseInt(id.id)
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
        store.idList.sort(Utils.sortByProperty('id')).reverse()
      } else {
        // 旧作品 降序排列
        store.idList.sort(Utils.sortByProperty('id'))
      }

      store.idList = store.idList.splice(0, this.crawlNumber)
    }

    this.getIdListFinished()
  }

  /**下载页面底部的相关作品时使用 */
  // 注意：新发表的作品，页面底部可能不是相关作品，而是推荐作品（其实就是发现页面里的推荐作品）
  // 详细说明可以查看这个文档：notes/作品详情页底部的推荐作品和相关作品.md
  // 下载器目前不会抓取推荐作品，因为它的作品是不会根据当前页面作品的内容变化的，这导致：
  // - 推荐作品与当前页面的作品没有相关性
  // - 底部的推荐作品数量有限，尤其是在图像作品页面里，固定显示 18 个
  // - 在不同的作品页面里，推荐作品的相似度很高，抓取它们的意义不大
  private async getRelatedList() {
    let data = await API.getRelatedData(Tools.getIllustId())
    // 相关作品的完整 id 列表由两部分组成：illusts 里的 id，以及 ids 里的 id
    // 需要组合起来
    let ids: string[] = []
    for (const illust of data.body.illusts) {
      if (illust.isAdContainer) {
        continue
      }
      ids.push(illust.id)
    }
    ids = ids.concat(data.body.nextIds)

    // 当设置了下载个数时，进行裁剪
    if (this.crawlNumber !== -1) {
      ids = ids.slice(0, this.crawlNumber)
    }

    for (const id of ids) {
      store.idList.push({
        type: 'illusts',
        id,
      })
    }

    const length = store.idList.length
    log.log(lang.transl('_相关作品抓取完毕', length.toString()))
    if (length === 0) {
      log.warning(lang.transl('_没有相关作品的提示'))
    }
    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {
    this.crawlDirection = 0 // 解除下载方向的标记
    this.crawlRelated = false // 解除下载相关作品的标记
  }
}
export { InitArtworkPage }
