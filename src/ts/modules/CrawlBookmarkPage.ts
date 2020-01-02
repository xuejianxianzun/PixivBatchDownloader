// 抓取收藏页面
import { CrawlPageBase } from './CrawlPageBase'
import { BookmarkData } from './CrawlResult'
import { lang } from './Lang'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'
import { DOM } from './DOM'

class CrawlBookmarkPage extends CrawlPageBase {
  private idList: string[] = [] // 储存从列表页获取到的 id

  private tag = '' // 储存当前页面带的 tag，不过有时并没有

  private isHide = false // 当前页面是否显示的是非公开收藏

  private requsetNumber: number = 0 // 根据页数，计算要抓取的作品个数

  private readonly onceRequest: number = 100 // 每次请求多少个数量

  private offset: number = 0 // 要去掉的作品数量

  public crawlRecommended: boolean = false // 是否抓取推荐作品（收藏页面下方）

  protected getWantPage() {
    let pageTip = ''
    if (this.crawlRecommended) {
      pageTip = lang.transl('_checkWantPageRule1Arg11')
    } else {
      pageTip = lang.transl('_checkWantPageRule1Arg7')
    }

    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_checkWantPageRule1Arg6'),
      pageTip
    )
  }

  protected nextStep() {
    if (this.crawlRecommended) {
      // 下载推荐图片
      this.getRecommendedList()
    } else {
      this.readyGetIdList()
    }
  }

  protected readyGetIdList() {
    // 每页个数
    // 旧版每页 20 个作品，新版每页 48 个作品（因为新版不显示无法访问的作品，所以有时候一页不足 48 个）
    const isOldPage = !!document.querySelector('.user-name')
    const onceNumber = isOldPage ? 20 : 48

    // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
    const nowPage = API.getURLField(location.href, 'p') // 判断当前处于第几页，页码从 1 开始。也可能没有页码
    if (nowPage) {
      this.offset = (parseInt(nowPage) - 1) * onceNumber
    }
    if (this.offset < 0) {
      this.offset = 0
    }

    // 根据页数设置，计算要下载的个数
    this.requsetNumber = 0
    if (this.crawlNumber === -1) {
      this.requsetNumber = 9999999
    } else {
      this.requsetNumber = onceNumber * this.crawlNumber
    }

    // 设置 tag
    if (parseInt(API.getURLField(location.href, 'untagged')) === 1) {
      // 在“未分类”页面时
      this.tag = '未分類'
    } else {
      this.tag = API.getURLField(location.href, 'tag')
    }

    // 判断是公开收藏还是非公开收藏
    this.isHide = API.getURLField(location.href, 'rest') === 'hide'

    // 获取 id 列表
    this.getIdList()

    log.log(lang.transl('_正在抓取'))

    if (this.crawlNumber === -1) {
      log.log(lang.transl('_获取全部书签作品'))
    }
  }

  // 获取用户的收藏作品列表
  protected async getIdList() {
    let data: BookmarkData
    try {
      data = await API.getBookmarkData(
        DOM.getUserId(),
        this.tag,
        this.offset,
        this.isHide
      )
    } catch (error) {
      this.getIdList()
      return
    }

    if (
      data.body.works.length === 0 ||
      this.idList.length >= this.requsetNumber
    ) {
      // 书签页获取完毕
      return this.afterGetListPage()
    } else {
      // 没有抓取完毕时，添加数据
      data.body.works.forEach(data => this.idList.push(data.id))
      this.offset += this.onceRequest // 每次增加偏移量
      // 重复抓取过程
      this.getIdList()
    }
  }

  // 获取作品 id 列表完毕之后
  private afterGetListPage() {
    // 删除多余的作品
    if (this.idList.length > this.requsetNumber) {
      // 书签页，删除后面部分（较早收藏的）
      this.idList.splice(this.requsetNumber, this.idList.length)
      // 书签页面的 api 没有考虑页面上的排序顺序，获取到的 id 列表始终是按收藏顺序由最晚到最早排列的
    }

    store.idList = store.idList.concat(this.idList)

    this.getIdListFinished()
  }

  // 获取书签页面下方的推荐作品列表
  private getRecommendedList() {
    // 获取下方已经加载出来的作品
    const elements = document.querySelectorAll(
      '#illust-recommend .image-item'
    ) as NodeListOf<HTMLLIElement>
    if (elements.length === 0) {
      this.crawlRecommended = false
      return this.noResult()
    }
    // 添加作品列表
    for (const li of elements) {
      const a = li.querySelector('a') as HTMLAnchorElement
      store.idList.push(API.getIllustId(a.href))
    }

    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {
    this.idList = []
    this.offset = 0
    this.listPageFinished = 0
    this.crawlRecommended = false // 解除下载推荐作品的标记
  }

  protected sortResult() {
    // 把作品数据反转，这样可以先下载收藏时间早的，后下载收藏时间近的
    store.result.reverse()
  }

  public destroy() {}
}
export { CrawlBookmarkPage }
