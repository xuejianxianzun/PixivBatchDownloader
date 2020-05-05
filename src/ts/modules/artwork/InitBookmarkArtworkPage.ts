// 初始化收藏页面
import { InitPageBase } from '../InitPageBase'
import { API } from '../API'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { IDData } from '../Store.d'
import { options } from '../Options'
import { BookmarksAddTag } from '../BookmarksAddTag'
import { BookmarkData } from '../CrawlResult'
import { store } from '../Store'
import { log } from '../Log'
import { DOM } from '../DOM'
import { pageInfo } from '../PageInfo'

class InitBookmarkArtworkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected appendCenterBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })

    // 添加下载推荐作品的按钮，只在旧版收藏页面使用
    const isOldPage = !!document.querySelector('.user-name')
    if (isOldPage) {
      const downRecmdBtn = DOM.addBtn(
        'crawlBtns',
        Colors.blue,
        lang.transl('_抓取推荐作品'),
        [['title', lang.transl('_抓取推荐作品Title')]]
      )
      downRecmdBtn.addEventListener(
        'click',
        () => {
          this.crawlRecommended = true
          this.readyCrawl()
        },
        false
      )
    }

    // 如果存在 token，则添加“添加 tag”按钮
    if (API.getToken()) {
      const btn = DOM.addBtn(
        'otherBtns',
        Colors.green,
        lang.transl('_添加tag'),
        [['title', lang.transl('_添加tag')]]
      )

      new BookmarksAddTag(btn)
    }
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_从本页开始下载提示'),
      rangTip: lang.transl('_数字提示1'),
      value: '-1',
    })

    // 在书签页面隐藏只要书签选项
    options.hideOption([6])

    if (location.href.includes('bookmark.php')) {
      options.hideOption([6])
    }
  }

  private idList: IDData[] = [] // 储存从列表页获取到的 id

  private tag = '' // 储存当前页面带的 tag，不过有时并没有

  private isHide = false // 当前页面是否显示的是非公开收藏

  private requsetNumber: number = 0 // 根据页数，计算要抓取的作品个数

  private readonly onceRequest: number = 100 // 每次请求多少个数量

  private offset: number = 0 // 要去掉的作品数量

  private crawlRecommended: boolean = false // 是否抓取推荐作品（收藏页面下方）

  protected getWantPage() {
    let pageTip = ''
    if (this.crawlRecommended) {
      pageTip = lang.transl('_下载推荐作品')
    } else {
      pageTip = lang.transl('_下载所有页面')
    }

    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_从本页开始下载x页'),
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
    const nowPage = API.getURLSearchField(location.href, 'p') // 判断当前处于第几页，页码从 1 开始。也可能没有页码
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

    this.tag = pageInfo.getPageTag

    // 判断是公开收藏还是非公开收藏
    // 在新旧版 url 里，rest 都是在查询字符串里的
    this.isHide = API.getURLSearchField(location.href, 'rest') === 'hide'

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
      return this.afterGetIdList()
    } else {
      // 没有抓取完毕时，添加数据
      data.body.works.forEach((data) =>
        this.idList.push({
          type: API.getWorkType(data.illustType),
          id: data.id,
        })
      )
      this.offset += this.onceRequest // 每次增加偏移量
      // 重复抓取过程
      this.getIdList()
    }
  }

  // 获取作品 id 列表完毕之后
  private afterGetIdList() {
    // 因为书签页面一次获取 100 个作品，大于一页的数量。所以可能会抓取多了，需要删除多余的作品
    if (this.idList.length > this.requsetNumber) {
      // 删除后面部分（较早收藏的），留下近期收藏的
      this.idList.splice(this.requsetNumber, this.idList.length)
      // 书签页面的 api 没有考虑页面上的排序顺序，获取到的 id 列表始终是按收藏顺序由近期到早期排列的
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
      store.idList.push({
        type: 'unkown',
        id: API.getIllustId(a.href),
      })
    }

    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {
    this.idList = []
    this.offset = 0
    this.tag = ''
    this.listPageFinished = 0
    this.crawlRecommended = false // 解除下载推荐作品的标记
  }

  protected sortResult() {
    // 把作品数据反转，这样可以先下载收藏时间早的，后下载收藏时间近的
    store.result.reverse()
  }
}
export { InitBookmarkArtworkPage }
