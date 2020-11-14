// 初始化插画/漫画的系列作品页面
import { InitPageBase } from '../InitPageBase'
import { Colors } from '../Colors'
import { API } from '../API'
import { lang } from '../Lang'
import { DOM } from '../DOM'
import { options } from '../setting/Options'
import { FilterOption } from '../Filter.d'
import { filter } from '../Filter'
import { store } from '../Store'
import { log } from '../Log'

class InitSeriesPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  // 目前存在新版和旧版共存的情况，对这新旧页面采取不同的抓取方式
  // 一个主要的原因是，旧版一页 18 个作品，新版一页 12 个作品，所以旧版还是继续使用之前的方式比较省事
  private baseUrl = ''

  private seriesId = ''

  protected addCrawlBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected setFormOption() {
    // 个数/页数选项的提示
    this.maxCount = 100

    options.setWantPageTip({
      text: lang.transl('_页数'),
      tip: lang.transl('_从本页开始下载提示'),
      rangTip: `1 - ${this.maxCount}`,
    })
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, true)
  }

  protected nextStep() {
    // 设置起始页码
    const p = API.getURLSearchField(location.href, 'p')
    this.startpageNo = parseInt(p) || 1

    // 判断是否是旧版
    let old = !!document.querySelector('.badge')

    if (old) {
      // 旧版
      // 设置起始网址
      const url = new URL(window.location.href)
      url.searchParams.set('p', '1')
      this.baseUrl = url.toString()

      this.getIdListOld()
    } else {
      // 新版
      // 获取系列 id
      this.seriesId = API.getURLPathField('series')

      this.getIdList()
    }
  }

  protected async getIdListOld() {
    let p = this.startpageNo + this.listPageFinished

    let dom: HTMLDocument
    try {
      const res = await fetch(this.baseUrl.replace('p=1', 'p=' + p))
      const text = await res.text()
      const parse = new DOMParser()
      dom = parse.parseFromString(text, 'text/html')
    } catch (error) {
      this.getIdListOld()
      return
    }

    this.listPageFinished++

    if (dom.querySelector('.no-content')) {
      // 此页没有内容，也就没有后续内容了
      return this.getIdListFinished()
    }

    const workList = dom.querySelectorAll('.works .image-item') as NodeListOf<
      HTMLLIElement
    >

    // 检查每个作品的信息
    for (const item of workList) {
      // https://www.pixiv.net/user/3698796/series/61267
      const link = (item.querySelector('a') as HTMLAnchorElement)!.href
      const id = parseInt(link.split('/artworks/')[1])

      const tagString = item.querySelector('img')!.dataset.tags
      const tags: string[] = tagString ? tagString.split(' ') : []

      const bookmarkBtn = item.querySelector('._one-click-bookmark')
      const bookmarked = bookmarkBtn
        ? bookmarkBtn.classList.contains('on')
        : false

      const filterOpt: FilterOption = {
        id: id,
        tags: tags,
        bookmarkData: bookmarked,
      }

      // 其实 type 这里有个存疑的地方。如果插画没有系列页面，只有漫画有系列页面，那么这里可以直接断言 type 为 manga。但是这一点尚不能完全确定，所以这里 type 是 unknown
      if (await filter.check(filterOpt)) {
        store.idList.push({
          type: 'unknown',
          id: id.toString(),
        })
      }
    }

    log.log(
      lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
      1,
      false,
    )

    // 抓取完毕
    if (p >= this.maxCount || this.listPageFinished === this.crawlNumber) {
      log.log(lang.transl('_列表页抓取完成'))
      this.getIdListFinished()
    } else {
      // 继续抓取
      this.getIdListOld()
    }
  }

  protected async getIdList() {
    let p = this.startpageNo + this.listPageFinished

    const data = await API.getSeriesData(this.seriesId, p)
    this.listPageFinished++

    // 保存本页面的作品的 id 列表
    const idList: string[] = []
    for (const info of data.body.page.series) {
      idList.push(info.workId)
    }
    // data.body.page.series 里的才是本页面的作品，illust 里则不同，有时它的作品数量比页面上的更多

    // 从 illust 里查找 id 对应的数据，进行过滤
    for (const work of data.body.thumbnails.illust) {
      if (!idList.includes(work.id)) {
        continue
      }
      if (work.isAdContainer) {
        continue
      }

      // 过滤器进行检查
      const filterOpt: FilterOption = {
        id: work.id,
        tags: work.tags,
        bookmarkData: !!work.bookmarkData,
        width: work.width,
        height: work.height,
        illustType: work.illustType,
        userid: work.userId
      }

      // 因为这个 api 的 illust 数据可能是插画也可能是漫画，所以 type 是 unknown
      if (await filter.check(filterOpt)) {
        store.idList.push({
          type: 'unknown',
          id: work.id,
        })
      }
    }

    // 如果 data.body.page.series 为空，就是到了最后一页
    const endFlag = data.body.page.series.length === 0

    // 抓取完毕
    if (
      endFlag ||
      p >= this.maxCount ||
      this.listPageFinished === this.crawlNumber
    ) {
      log.log(lang.transl('_列表页抓取完成'))
      this.getIdListFinished()
    } else {
      // 继续抓取
      log.log(
        lang.transl('_列表页抓取进度', this.listPageFinished.toString()),
        1,
        false,
      )

      this.getIdList()
    }
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
  }
}
export { InitSeriesPage }
