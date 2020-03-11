//初始化作品页
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { EVT } from './EVT'
import { lang } from './Lang'
import { centerButtons } from './CenterButtons'
import { options } from './Options'
import { store } from './Store'
import { QuickBookmark } from './QuickBookmark'
import { imgViewer } from './ImgViewer'
import { userWorksType } from './CrawlArgument.d'
import { DOM } from './DOM'
import { API } from './API'
import { log } from './Log'

class InitWorksPage extends InitPageBase {
  constructor() {
    super()
    this.quickDownBtn = document.createElement('div')
    this.init()
  }

  private quickDownBtn: HTMLDivElement

  protected initElse() {
    // 初始化快速收藏功能和图片查看器
    new QuickBookmark()
    imgViewer.init()

    // 页面切换时初始化图片查看器
    window.addEventListener(EVT.events.pageSwitch, this.initImgViewer)
  }

  private initImgViewer() {
    imgViewer.init()
  }

  protected appendCenterBtns() {
    centerButtons
      .add(Colors.blue, lang.transl('_从本页开始抓取new'))
      .addEventListener('click', () => {
        this.crawlDirection = -1
        this.readyCrawl()
      })

    centerButtons
      .add(Colors.blue, lang.transl('_从本页开始抓取old'))
      .addEventListener('click', () => {
        this.crawlDirection = 1
        this.readyCrawl()
      })

    const downRelatedBtn = centerButtons.add(
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

  protected appendElseEl() {
    // 在右侧创建快速下载按钮
    this.quickDownBtn.id = 'quick_down_btn'
    this.quickDownBtn.textContent = '↓'
    this.quickDownBtn.setAttribute('title', lang.transl('_快速下载本页'))
    document.body.appendChild(this.quickDownBtn)
    this.quickDownBtn.addEventListener(
      'click',
      () => {
        store.states.quickDownload = true
        this.readyCrawl()
      },
      false
    )
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_个数'),
      tip:
        lang.transl('_checkWantPageRule1Arg8') +
        '<br>' +
        lang.transl('_相关作品大于0'),
      rangTip: lang.transl('_数字提示1'),
      value: '-1'
    })

    options.hideOption([18])
  }

  protected destroy() {
    // 删除快速下载按钮
    DOM.removeEl(this.quickDownBtn)

    // 解除切换页面时初始化图片查看器
    window.removeEventListener(EVT.events.pageSwitch, this.initImgViewer)
  }

  private crawlDirection: number = 0 // 抓取方向，在作品页内指示抓取新作品还是旧作品
  /*
  -1 抓取新作品
  0 不设置抓取方向
  1 抓取旧作品
  */

  private crawlRelated: boolean = false // 是否下载相关作品（作品页内的）

  protected getWantPage() {
    if (store.states.quickDownload) {
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
          lang.transl('_checkWantPageRule1Arg3'),
          crawlAllTip
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

  protected async getIdList() {
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
  private async getRelatedList() {
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
}
export { InitWorksPage }
