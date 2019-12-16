// 抓取用户页面
import { CrawlPageBase } from './CrawlPageBase'
import { BookmarkData } from './CrawlResult.d'
import { lang } from './Lang'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'
import { EVT } from './EVT'
import { DOM } from './DOM'
import { userWorksType } from './CrawlArgument.d'

class CrawlUserPage extends CrawlPageBase {
  private idList: string[] = [] // 储存从列表页获取到的 id

  private hasTag: boolean = false // 是否带 tag

  private tag = '' // 储存当前页面带的 tag，不过有时并没有

  private listType: number = 0 // pageType 2 里的页面类型，都是列表页

  private requsetNumber: number = 0 // 根据页数，计算要抓取的作品个数

  private readonly onceRequest: number = 100 // 每次请求多少个数量

  private offset: number = 0 // 要去掉的作品数量

  public crawlRecommended: boolean = false // 是否抓取推荐作品（收藏页面下方）

  protected getWantPage() {
    let pageTip = lang.transl('_checkWantPageRule1Arg7')
    if (this.crawlRecommended) {
      pageTip = lang.transl('_checkWantPageRule1Arg11')
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
    // 每次开始时重置一些条件
    this.offset = 0
    this.idList = []
    this.listType = 0

    // 每页个数
    let onceNumber = 48 // 新版每页 48 个作品（因为新版不显示无法访问的作品，所以有时候一页不足这个数量）
    // 旧版每页 20 个作品
    if (document.querySelector('.user-name')) {
      onceNumber = 20
    }

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

    // 设置列表页面的类型
    // listType:
    // 0 插画和漫画全都要，但是不带 tag
    // 4 插画和漫画全都要，带 tag
    // 1 只要插画
    // 2 只要漫画
    // 3 书签作品

    if (location.href.includes('member.php?id=')) {
      // 用户资料页主页
      this.listType = 0
    } else if (/member_illust\.php\?.*id=/.test(location.href)) {
      // 作品列表页
      if (API.getURLField(location.href, 'type') === 'illust') {
        // 插画分类
        this.listType = 1
      } else if (API.getURLField(location.href, 'type') === 'manga') {
        // 漫画分类
        this.listType = 2
      } else if (API.getURLField(location.href, 'tag')) {
        // url 里没有标识插画还是漫画，但是有 tag，则是在用户首页点击了 tag，需要同时获取插画和漫画
        this.listType = 4
      }
    } else if (location.href.includes('bookmark.php')) {
      // 书签页面，需要多次循环获取
      this.listType = 3
    }

    // 是否带有 tag
    this.tag = decodeURI(API.getURLField(location.href, 'tag'))
    if (this.listType === 3) {
      // 书签页面固定设置为有 tag（虽然有时候并没有带 tag，但数据结构和带 tag 是一样的）
      this.hasTag = true
    } else {
      this.hasTag = !!this.tag
    }

    // 根据不同的页面类型，选择不同的 API 来获取 id 列表
    /*
    1.非书签页
      1.1 无 tag 通过 profileAll 获取
      1.2 有 tag 通过指定的作品类型获取
    2.书签页，单独抓取
     */

    if (this.listType !== 3) {
      if (!this.hasTag) {
        this.getIdList()
      } else {
        if (this.listType === 1) {
          this.getIdListByTag('illusts')
        } else if (this.listType === 2) {
          this.getIdListByTag('manga')
        } else if (this.listType === 4) {
          this.getIdListByTag('illustmanga')
        } else {
          // 无法处理的情况
          EVT.fire(EVT.events.crawlError)
          throw new Error('Unknown instance.')
        }
      }
    } else {
      // 书签页面
      // 在“未分类”页面时，设置 tag
      if (parseInt(API.getURLField(location.href, 'untagged')) === 1) {
        this.tag = '未分類'
      }

      // 判断是公开收藏还是非公开收藏
      let hide = false
      if (API.getURLField(location.href, 'rest') === 'hide') {
        hide = true
      }

      this.getBookmarkIdList(hide)
    }

    log.log(lang.transl('_正在抓取'))

    if (this.listType === 3 && this.crawlNumber === -1) {
      log.log(lang.transl('_获取全部书签作品'))
    }
  }

  // 获取用户的全部作品列表
  protected async getIdList() {
    let type: userWorksType[] = []

    // 插画和漫画列表页
    if (this.listType === 0) {
      type = ['illusts', 'manga']
    } else if (this.listType === 1) {
      // 插画列表页，包含动图
      type = ['illusts']
    } else if (this.listType === 2) {
      // 漫画列表页
      type = ['manga']
    }

    this.idList = await API.getUserWorksByType(DOM.getUserId(), type)

    this.afterGetListPage()
  }

  // 获取用户某一类型的作品列表（附带 tag）
  private async getIdListByTag(type: 'illusts' | 'manga' | 'illustmanga') {
    let data = await API.getUserWorksByTypeWithTag(
      DOM.getUserId(),
      type,
      this.tag,
      this.offset,
      this.requsetNumber
    )

    data.body.works.forEach(data => this.idList.push(data.id))

    this.afterGetListPage()
  }

  // 获取用户的收藏作品列表
  private async getBookmarkIdList(isHide: boolean) {
    let bmkGetEnd = false // 书签作品是否获取完毕

    let data: BookmarkData
    try {
      data = await API.getBookmarkData(
        DOM.getUserId(),
        this.tag,
        this.offset,
        isHide
      )
    } catch (error) {
      this.getBookmarkIdList(isHide)
      return
    }

    if (
      data.body.works.length === 0 ||
      this.idList.length >= this.requsetNumber
    ) {
      bmkGetEnd = true // 书签页获取完毕
      this.afterGetListPage()
    }

    // 如果书签页没有获取完毕
    if (!bmkGetEnd) {
      // 没有抓取完毕时，才添加数据。抓取完毕之后不添加数据
      data.body.works.forEach(data => this.idList.push(data.id))

      this.offset += this.onceRequest // 每次增加偏移量
      // 重复抓取过程
      this.getBookmarkIdList(isHide)
    }
  }

  // 获取作品 id 列表完毕之后
  private afterGetListPage() {
    // 非书签页，并且非 tag 页
    if (this.listType !== 3 && !this.hasTag) {
      // 在获取全部作品时，由于 API 里不能设置 requset_number，所以在这里去掉多余的作品。

      // 把 id 从小到大排序
      let tempList: number[] = []
      // 转换成数字
      tempList = this.idList.map(id => {
        return parseInt(id)
      })
      // 升序排列
      tempList.sort(function(x, y) {
        return x - y
      })
      // 保存到结果中
      this.idList = tempList.map(id => {
        return id.toString()
      })

      // 删除后面的 id（删除不需要的近期作品）
      this.idList.splice(this.idList.length - this.offset, this.idList.length)
    }

    // 删除多余的作品
    if (this.idList.length > this.requsetNumber) {
      if (this.listType !== 3) {
        // 非书签页，删除前面部分（早期作品）
        this.idList.splice(0, this.idList.length - this.requsetNumber)
      } else {
        // 书签页，删除后面部分（较早收藏的）
        this.idList.splice(this.requsetNumber, this.idList.length)
        // 书签页面的 api 没有考虑页面上的排序顺序，获取到的 id 列表始终是按收藏顺序由最晚到最早排列的
      }
    }

    store.idList = store.idList.concat(this.idList)

    log.log(
      lang.transl('_列表抓取完成开始获取作品页', store.idList.length.toString())
    )

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
    this.listPageFinished = 0
    this.crawlRecommended = false // 解除下载推荐作品的标记
  }

  protected sortResult() {
    if (!location.href.includes('bookmark.php')) {
      // 如果是其他列表页，把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
      store.result.sort(API.sortByProperty('id'))
    } else {
      // 如果是书签页，把作品数据反转，这样可以先下载收藏时间早的，后下载收藏时间近的
      store.result.reverse()
    }
    // 这里如果在控制台打印 result，可能看到修改前后的数据是一样的，这时因为 result 是引用类型导致的，实际上正常。
  }
}
export { CrawlUserPage }
