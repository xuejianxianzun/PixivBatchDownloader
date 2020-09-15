//初始化 artwork 作品页
import { InitPageBase } from '../InitPageBase'
import { Colors } from '../Colors'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { store } from '../Store'
import { QuickBookmark } from '../QuickBookmark'
import { ImgViewer } from '../ImgViewer'
import { userWorksType } from '../CrawlArgument'
import { DOM } from '../DOM'
import { API } from '../API'
import { log } from '../Log'
import { QuickDownloadBtn } from '../QuickDownloadBtn'
import { states } from '../States'
import '../SaveAvatarIcon'

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

  protected initAny() {
    // 初始化快速收藏功能和图片查看器
    this.initQuickBookmark()
    this.initImgViewer()

    // 页面切换再次初始化
    window.addEventListener(
      EVT.events.pageSwitchedTypeNotChange,
      this.initQuickBookmark
    )
    window.addEventListener(
      EVT.events.pageSwitchedTypeNotChange,
      this.initImgViewer
    )

    // 初始化快速下载按钮
    new QuickDownloadBtn()
    window.addEventListener(EVT.events.QuickDownload, this.startQuickDownload)
  }

  private initImgViewer() {
    new ImgViewer()
  }

  private initQuickBookmark() {
    new QuickBookmark()
  }

  protected addCrawlBtns() {
    DOM.addBtn(
      'crawlBtns',
      Colors.blue,
      lang.transl('_从本页开始抓取new')
    ).addEventListener('click', () => {
      this.crawlDirection = -1
      this.readyCrawl()
    })

    DOM.addBtn(
      'crawlBtns',
      Colors.blue,
      lang.transl('_从本页开始抓取old')
    ).addEventListener('click', () => {
      this.crawlDirection = 1
      this.readyCrawl()
    })

    const downRelatedBtn = DOM.addBtn(
      'crawlBtns',
      Colors.blue,
      lang.transl('_抓取相关作品')
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

  protected addAnyElement() {
    DOM.addBtn('otherBtns', Colors.green, lang.transl('_保存用户头像为图标'), [
      ['title', lang.transl('_保存用户头像为图标说明')],
    ]).addEventListener('click', () => {
      EVT.fire(EVT.events.saveAvatarIcon)
    })
  }

  private startQuickDownload = () => {
    this.readyCrawl()
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_个数'),
      tip:
        lang.transl('_从本页开始下载提示') +
        '<br>' +
        lang.transl('_相关作品大于0'),
      rangTip: lang.transl('_数字提示1'),
      value: '-1',
    })
  }

  protected destroy() {
    DOM.clearSlot('crawlBtns')
    DOM.clearSlot('otherBtns')

    // 解除切换页面时绑定的事件
    window.removeEventListener(
      EVT.events.pageSwitchedTypeNotChange,
      this.initQuickBookmark
    )

    window.removeEventListener(
      EVT.events.pageSwitchedTypeNotChange,
      this.initImgViewer
    )

    window.removeEventListener(
      EVT.events.QuickDownload,
      this.startQuickDownload
    )
  }

  protected getWantPage() {
    if (states.quickDownload) {
      // 快速下载
      this.crawlNumber = 1
    } else {
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
  }

  protected nextStep() {
    // 下载相关作品
    if (this.crawlRelated) {
      this.getRelatedList()
    } else if (states.quickDownload) {
      // 快速下载
      store.idList.push({
        type: 'unknown',
        id: API.getIllustId(window.location.href),
      })

      log.log(lang.transl('_开始获取作品页面'))

      this.getIdListFinished()
    } else {
      // 向前向后下载
      this.getIdList()
    }
  }

  protected async getIdList() {
    let type: userWorksType[] = ['illusts', 'manga']
    let idList = await API.getUserWorksByType(DOM.getUserId(), type)

    // 储存符合条件的 id
    let nowId = parseInt(API.getIllustId(window.location.href))
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
        store.idList.sort(API.sortByProperty('id')).reverse()
      } else {
        // 旧作品 降序排列
        store.idList.sort(API.sortByProperty('id'))
      }

      store.idList = store.idList.splice(0, this.crawlNumber)
    }

    this.getIdListFinished()
  }

  // 下载相关作品时使用
  private async getRelatedList() {
    let data = await API.getRelatedData(API.getIllustId())
    const recommendData = data.body.recommendMethods
    // 取出相关作品的 id 列表
    let recommendIdList = Object.keys(recommendData)
    // 当设置了下载个数时，进行裁剪
    if (this.crawlNumber !== -1) {
      recommendIdList = recommendIdList.reverse().slice(0, this.crawlNumber)
    }
    for (const id of recommendIdList) {
      store.idList.push({
        type: 'unknown',
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
