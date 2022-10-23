// 初始化 关注的用户的新作品页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { options } from '../setting/Options'
import { filter, FilterOption } from '../filter/Filter'
import { API } from '../API'
import { store } from '../store/Store'
import { log } from '../Log'
import { Utils } from '../utils/Utils'
import {
  BookMarkNewIllustData,
  BookMarkNewNovelData,
} from '../crawl/CrawlResult'
import { states } from '../store/States'
import { Config } from '../Config'
import { setTimeoutWorker } from '../SetTimeoutWorker'

class InitBookmarkNewPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected type: 'illust' | 'novel' = 'illust'
  protected tag = ''
  protected r18 = false
  protected newVer = false
  // 这次抓取任务最多可以抓取到多少个作品
  protected crawlWorksMaxNumber = 0
  // 裁剪 API 返回的作品数据时的偏移量
  protected firstOffset = 0
  // 总计抓取了多少个作品（被裁剪掉的不算）
  protected crawledWorksNumber = 0
  // 每当 API 返回数据时，保存第一个作品的 id，用来判断后面的数据是否出现重复
  // 如果数据重复就停止抓取，因为后面的每一页的数据都是完全相同的
  protected firstWorkId = ''

  protected addCrawlBtns() {
    Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_开始抓取',
      '_默认下载多页'
    ).addEventListener('click', () => {
      this.readyCrawl()
    })

    this.addStartTimedCrawlBtn(this.readyCrawl.bind(this))
    this.addCancelTimedCrawlBtn()
  }

  protected initAny() {}

  protected setFormOption() {
    // 个数/页数选项的提示
    this.maxCount = 100

    options.setWantPageTip({
      text: '_抓取多少页面',
      tip: '_从本页开始下载提示',
      rangTip: `1 - ${this.maxCount}`,
    })
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, true)
  }

  protected nextStep() {
    this.setSlowCrawl()

    this.type = window.location.pathname.includes('/novel') ? 'novel' : 'illust'
    this.tag = Utils.getURLSearchField(window.location.href, 'tag')
    this.r18 = location.pathname.includes('r18')
    this.newVer = !document.querySelector('h1')
    // 根据页数计算最多抓取多少个作品。新版一页 60 个作品，旧版一页 20 个作品
    this.crawlWorksMaxNumber = this.crawlNumber * (this.newVer ? 60 : 20)

    // 设置 API 里发起请求的页数
    const p = Utils.getURLSearchField(location.href, 'p')
    const pageNo = parseInt(p) || 1
    if (this.newVer) {
      // 新版页面里，由于 API 返回的就是这一页的作品，所以直接获取地址栏的页码就可以
      this.startpageNo = pageNo
    } else {
      // 旧版页面里，由于 API 一页会返回相当于旧版 3 页的数据，所以不能直接使用地址栏的页码
      // 例如用户在旧版页面的第 5 页开始抓取，实质上是从第 81 个作品开始抓取。所以 API 里要从第 2 页开始抓取（第 61 - 120 个作品），并且设置偏移量为 20
      // API 里开始抓取的页数，向上取整
      this.startpageNo = Math.ceil((pageNo * 20) / 60)
      // 计算 API 返回的 60 个数据里，可以保留多少个
      const howManyLeft = this.startpageNo * 60 - (pageNo - 1) * 20
      // 计算偏移量
      this.firstOffset = 60 - howManyLeft
    }

    this.getIdList()
  }

  protected async getIdList() {
    let p = this.startpageNo + this.listPageFinished

    let data
    try {
      data = await API.getBookmarkNewWorkData(this.type, p, this.tag, this.r18)
    } catch (error) {
      this.getIdList()
      return
    }

    let worksData = data.body.thumbnails[this.type]

    // 检查数据，如果数据为空，或者和上一页的数据重复，说明已经不需要继续抓取了
    if (worksData.length === 0 || this.firstWorkId === worksData[0].id) {
      log.log(lang.transl('_列表页抓取完成'))
      return this.getIdListFinished()
    } else {
      // 如果数据没有重复，则保存第一个作品的 id
      this.firstWorkId = worksData[0].id
    }

    // 旧版页面可能需要对 API 返回的数据进行裁剪
    if (!this.newVer) {
      // 使用偏移量移除不需要的数据（仅一次）
      if (this.firstOffset > 0) {
        worksData = worksData.slice(this.firstOffset)
        this.firstOffset = 0
      }
      // 计算还有多少个作品需要抓取，然后裁剪数组，避免抓取结果超出预定的数量
      const needCrawl = this.crawlWorksMaxNumber - this.crawledWorksNumber
      if (needCrawl < worksData.length) {
        worksData = worksData.slice(0, needCrawl)
      }
    }

    this.crawledWorksNumber += worksData.length

    // 过滤作品
    // 过滤插画·漫画
    if (this.type === 'illust') {
      for (const data of <BookMarkNewIllustData[]>worksData) {
        if (data.isAdContainer) {
          continue
        }

        const filterOpt: FilterOption = {
          id: data.id,
          width: data.pageCount === 1 ? data.width : 0,
          height: data.pageCount === 1 ? data.height : 0,
          pageCount: data.pageCount,
          bookmarkData: data.bookmarkData,
          workType: data.illustType,
          tags: data.tags,
          userId: data.userId,
          xRestrict: data.xRestrict,
        }

        if (await filter.check(filterOpt)) {
          store.idList.push({
            type: Tools.getWorkTypeString(data.illustType),
            id: data.id,
          })
        }
      }
    } else {
      // 过滤小说
      for (const data of <BookMarkNewNovelData[]>worksData) {
        const filterOpt: FilterOption = {
          id: data.id,
          workType: 3,
          tags: data.tags,
          bookmarkCount: data.bookmarkCount,
          bookmarkData: data.bookmarkData,
          userId: data.userId,
        }

        if (await filter.check(filterOpt)) {
          store.idList.push({
            type: 'novels',
            id: data.id,
          })
        }
      }
    }

    this.listPageFinished++

    log.log(
      lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
      1,
      false
    )

    // 判断任务状态
    // 如果抓取到了指定数量的作品，或者抓取到了最后一页，或者抓取完了指定的页面数量
    if (
      this.crawledWorksNumber >= this.crawlWorksMaxNumber ||
      p >= this.maxCount ||
      this.listPageFinished === this.crawlNumber
    ) {
      log.log(lang.transl('_列表页抓取完成'))
      this.getIdListFinished()
    } else {
      // 继续抓取
      if (states.slowCrawlMode) {
        setTimeoutWorker.set(() => {
          this.getIdList()
        }, Config.slowCrawlDealy)
      } else {
        this.getIdList()
      }
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
    this.firstOffset = 0
    this.crawledWorksNumber = 0
    this.firstWorkId = ''
  }
}
export { InitBookmarkNewPage }
