//初始化小说作品页
import { InitPageBase } from '../InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { options } from '../Options'
import { store } from '../Store'
import { QuickBookmark } from '../QuickBookmark'
import { userWorksType } from '../CrawlArgument'
import { DOM } from '../DOM'
import { API } from '../API'
import { log } from '../Log'
import { EVT } from '../EVT'
import { states } from '../States'
import { QuickDownloadBtn } from '../QuickDownloadBtn'
import '../SaveAvatarIcon'

class InitNovelPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private quickDownBtn: HTMLButtonElement = document.createElement('button')

  private crawlDirection: number = 0 // 抓取方向，指示抓取新作品还是旧作品
  /*
  -1 抓取新作品
  0 不设置抓取方向
  1 抓取旧作品
  */

  protected initElse() {
    this.initQuickBookmark()

    window.addEventListener(
      EVT.events.pageSwitchedTypeNotChange,
      this.initQuickBookmark
    )

    // 初始化快速下载按钮
    new QuickDownloadBtn()
    window.addEventListener(EVT.events.QuickDownload, this.startQuickDownload)
  }

  private initQuickBookmark() {
    new QuickBookmark()
  }

  protected appendCenterBtns() {
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

    // 删除快速下载按钮
    DOM.removeEl(this.quickDownBtn)

    window.removeEventListener(
      EVT.events.pageSwitchedTypeNotChange,
      this.initQuickBookmark
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
      const crawlAllTip =
        this.crawlDirection === -1
          ? lang.transl('_从本页开始抓取new')
          : lang.transl('_从本页开始抓取old')
      this.crawlNumber = this.checkWantPageInput(
        lang.transl('_从本页开始下载x个作品'),
        crawlAllTip
      )
    }
  }

  protected nextStep() {
    if (states.quickDownload) {
      // 快速下载
      store.idList.push({
        type: 'novels',
        id: API.getNovelId(window.location.href),
      })

      log.log(lang.transl('_开始获取作品页面'))

      this.getIdListFinished()
    } else {
      // 向前向后下载
      this.getIdList()
    }
  }

  protected async getIdList() {
    let type: userWorksType[] = ['novels']
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

  protected resetGetIdListStatus() {
    this.crawlDirection = 0 // 解除下载方向的标记
  }
}
export { InitNovelPage }
