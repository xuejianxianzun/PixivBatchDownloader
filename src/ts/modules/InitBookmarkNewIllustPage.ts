// 初始化 关注的新作品页面
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { centerButtons } from './CenterButtons'
import { options } from './Options'
import { BookMarkNewData } from './CrawlResult.d'
import { FilterOption } from './Filter.d'
import { filter } from './Filter'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'

class InitBookmarkNewIllustPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected appendCenterBtns() {
    centerButtons
      .add(Colors.blue, lang.transl('_开始抓取'), [
        ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')]
      ])
      .addEventListener('click', () => {
        this.readyCrawl()
      })
  }

  protected appendElseEl() {
    // 添加 R-18 页面的链接
    const r18Link = `<li><a href="/bookmark_new_illust_r18.php">R-18</a></li>`
    const target = document.querySelector('.menu-items')
    if (target) {
      target.insertAdjacentHTML('beforeend', r18Link)
    }
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_checkWantPageRule1Arg8'),
      rangTip: `1 - ${this.maxCount}`,
      value: this.maxCount.toString()
    })

    options.hideOption([15, 18])
  }

  protected destroy() {}

  private r18 = false
  protected getWantPage() {
    const check = this.checkWantPageInputGreater0()
    if (check == undefined) {
      return
    }
    this.crawlNumber = check

    if (this.crawlNumber > this.maxCount) {
      this.crawlNumber = this.maxCount
    }

    this.listPageFinished = 0
    log.warning(lang.transl('_任务开始1', this.crawlNumber.toString()))
  }

  protected nextStep() {
    this.r18 = location.pathname.includes('r18')

    const p = API.getURLField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    this.getIdList()
  }

  protected async getIdList() {
    let p = this.startpageNo + this.listPageFinished

    // 发起请求，获取列表页
    let worksData: BookMarkNewData[]
    try {
      worksData = await API.getBookmarkNewIllustData(p, this.r18)
    } catch (error) {
      this.getIdList()
      return
    }

    // 检查一些此时可以进行检查的设置项
    for (const data of worksData) {
      const filterOpt: FilterOption = {
        id: data.illustId,
        width: data.width,
        height: data.height,
        pageCount: data.pageCount,
        bookmarkData: data.isBookmarked,
        illustType: parseInt(data.illustType) as any,
        tags: data.tags
      }

      if (filter.check(filterOpt)) {
        store.idList.push(data.illustId)
      }
    }

    this.listPageFinished++

    log.log(
      lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
      1,
      false
    )

    // 判断任务状态
    // 如果抓取了所有页面，或者抓取完指定页面
    if (p >= 100 || this.listPageFinished === this.crawlNumber) {
      log.log(lang.transl('_列表页抓取完成'))
      this.getIdListFinished()
    } else {
      // 继续抓取
      this.getIdList()
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
  }
}
export { InitBookmarkNewIllustPage }
