//初始化 artwork 作品页
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { store } from '../store/Store'
import { userWorksType } from '../crawl/CrawlArgument'
import { Tools } from '../Tools'
import { API } from '../API'
import { log } from '../Log'
import { Utils } from '../utils/Utils'
import './CrawlRecommendWorks'
import { pageType } from '../PageType'

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
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_从本页开始抓取new'
    ).addEventListener('click', () => {
      this.crawlDirection = -1
      this.readyCrawl()
    })

    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_从本页开始抓取old'
    ).addEventListener('click', () => {
      this.crawlDirection = 1
      this.readyCrawl()
    })

    const downRelatedBtn = Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_抓取相关作品'
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

  protected setFormOption() {
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: '_抓取多少作品',
      tip: '_从本页开始下载提示',
      rangTip: '_数字提示1',
      min: 1,
      max: -1,
    })
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
      this.crawlNumber = this.checkWantPageInput(
        lang.transl('_从本页开始下载x个'),
        crawlAllTip
      )
    } else {
      // 相关作品的提示
      this.crawlNumber = this.checkWantPageInput(
        lang.transl('_下载x个相关作品'),
        lang.transl('_下载所有相关作品')
      )
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
    let type: userWorksType[] = ['illusts', 'manga']
    let idList = await API.getUserWorksByType(
      Tools.getCurrentPageUserID(),
      type
    )

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

  // 下载相关作品时使用
  private async getRelatedList() {
    let data = await API.getRelatedData(Tools.getIllustId())
    // 相关作品的列表由两部分构成，所以要组合起来
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

    log.log(lang.transl('_相关作品抓取完毕', store.idList.length.toString()))
    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {
    this.crawlDirection = 0 // 解除下载方向的标记
    this.crawlRelated = false // 解除下载相关作品的标记
  }
}
export { InitArtworkPage }
