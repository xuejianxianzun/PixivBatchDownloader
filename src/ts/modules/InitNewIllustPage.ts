// 初始化 大家的新作品页面
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { options } from './Options'
import { NewIllustOption } from './CrawlArgument.d'
import { NewIllustData } from './CrawlResult'
import { FilterOption } from './Filter.d'
import { filter } from './Filter'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'
import { DOM } from './DOM'

class InitNewIllustPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected appendCenterBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_下载大家的新作品')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  private timer = 0

  protected appendElseEl() {
    // 添加 R-18 页面的链接
    const r18Link = `<a href="/new_illust_r18.php" style="color:#179fdd;padding-left:20px;">R-18</a>`
    const target = document.querySelector('#root h1')

    if (target) {
      target.insertAdjacentHTML('beforeend', r18Link)
      clearTimeout(this.timer)
    } else {
      this.timer = window.setTimeout(() => {
        this.appendElseEl()
      }, 300)
    }
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_个数'),
      tip: lang.transl('_要获取的作品个数2'),
      rangTip: `1 - ${this.maxCount}`,
      value: '100',
    })
  }

  protected getWantPage() {
    const check = this.checkWantPageInputGreater0()
    if (check == undefined) {
      return
    }
    this.crawlNumber = check

    if (this.crawlNumber > this.maxCount) {
      this.crawlNumber = this.maxCount
    }

    log.warning(lang.transl('_抓取多少个作品', this.crawlNumber.toString()))
  }

  protected nextStep() {
    this.initFetchURL()
    this.getIdList()
  }

  private resetOption(): NewIllustOption {
    return {
      lastId: '0',
      limit: '20', // 每次请求的数量，可以比 20 小
      type: '',
      r18: '',
    }
  }

  private option: NewIllustOption = this.resetOption()

  private readonly limitMax = 20 // 每次请求的数量最大是 20

  private fetchCount = 0 // 已请求的作品数量

  // 组织要请求的 url
  private initFetchURL() {
    this.option = this.resetOption()

    if (this.crawlNumber < this.limitMax) {
      this.option.limit = this.crawlNumber.toString()
    } else {
      this.option.limit = this.limitMax.toString()
    }

    this.fetchCount = 0

    // 当前页面的作品类型，默认是 illust
    this.option.type = API.getURLField(location.href, 'type') || 'illust'
    // 是否是 R18 模式
    this.option.r18 = (location.href.includes('_r18.php') || false).toString()
  }

  protected async getIdList() {
    let data: NewIllustData
    try {
      data = await API.getNewIllustData(this.option)
    } catch (error) {
      this.getIdList()
      return
    }

    let useData = data.body.illusts

    for (const nowData of useData) {
      // 抓取够了指定的数量
      if (this.fetchCount + 1 > this.crawlNumber) {
        break
      } else {
        this.fetchCount++
      }

      // 排除广告信息
      if (nowData.isAdContainer) {
        continue
      }

      const filterOpt: FilterOption = {
        id: nowData.illustId,
        width: nowData.width,
        height: nowData.height,
        pageCount: nowData.pageCount,
        bookmarkData: nowData.bookmarkData,
        illustType: nowData.illustType,
        tags: nowData.tags,
      }

      if (filter.check(filterOpt)) {
        store.idList.push(nowData.illustId)
      }
    }

    log.log(lang.transl('_新作品进度', this.fetchCount.toString()), 1, false)

    // 抓取完毕
    if (
      this.fetchCount >= this.crawlNumber ||
      this.fetchCount >= this.maxCount
    ) {
      log.log(lang.transl('_开始获取作品页面'))
      this.getIdListFinished()
      return
    }

    // 继续抓取
    this.option.lastId = data.body.lastId
    this.getIdList()
  }

  protected resetGetIdListStatus() {}
}
export { InitNewIllustPage }
