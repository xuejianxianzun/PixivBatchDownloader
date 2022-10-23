// 初始化新版收藏页面
import { InitPageBase } from '../crawl/InitPageBase'
import { API } from '../API'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { IDData } from '../store/StoreType'
import { options } from '../setting/Options'
import { BookmarkData } from '../crawl/CrawlResult'
import { store } from '../store/Store'
import { log } from '../Log'
import { Tools } from '../Tools'
import { token } from '../Token'
import { BookmarksAddTag } from '../pageFunciton/BookmarksAddTag'
import { filter, FilterOption } from '../filter/Filter'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'
import { states } from '../store/States'
import { setTimeoutWorker } from '../SetTimeoutWorker'
import { toast } from '../Toast'
import { unBookmarkWorks } from '../UnBookmarkWorks'
import { EVT } from '../EVT'

class InitBookmarkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private idList: IDData[] = [] // 储存从列表页获取到的 id

  private type: 'illusts' | 'novels' = 'illusts' // 页面是图片还是小说

  private isHide = false // 当前页面是否显示的是非公开收藏

  private requsetNumber: number = 0 // 根据页数，计算要抓取的作品个数

  private filteredNumber = 0 // 记录检查了多少作品（不论结果是否通过都计入）

  private readonly onceRequest: number = 100 // 每次请求多少个数量

  private offset: number = 0 // 要去掉的作品数量

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

  protected setFormOption() {
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: '_抓取多少页面',
      tip: '_从本页开始下载提示',
      rangTip: '_数字提示1',
    })
  }

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_从本页开始下载x页'),
      lang.transl('_下载所有页面')
    )
  }

  protected addAnyElement() {
    // 如果不存在 token，则不添加与收藏相关的按钮
    if (!token.token) {
      return
    }

    // 判断这个收藏页面是不是用户自己的页面，如果不是，也不会添加相关按钮
    let ownPage = false
    const URLUserID = Utils.getURLPathField(window.location.pathname, 'users')
    if (!URLUserID) {
      ownPage = true
    } else {
      // 从特定标签中提取用户自己的 userID，与 URL 中的 userID 对比
      const element = document.querySelector('#qualtrics_user-id')
      if (!element || !element.textContent) {
        ownPage = false
      } else {
        ownPage =
          element.textContent ===
          Utils.getURLPathField(window.location.pathname, 'users')
      }

      // 为防止 pixiv 改版导致上一个标签失效，这里使用第二种方法作为备选项
      // 在 head 里的某个 script 标签里包含有自己的 userID。使用 URL 里的 userID 去尝试匹配
      // 'user_id', "1234567"
      if (!ownPage) {
        ownPage = document.head.innerHTML.includes(`'user_id', "${URLUserID}"`)
      }
    }

    if (!ownPage) {
      return
    }

    const btn = Tools.addBtn(
      'otherBtns',
      Colors.bgGreen,
      '_给未分类作品添加添加tag'
    )
    new BookmarksAddTag(btn)

    Tools.addBtn(
      'otherBtns',
      Colors.bgGreen,
      '_取消收藏本页面的所有作品'
    ).addEventListener('click', () => {
      this.unBookmarkAllWorksOnThisPage()
    })
  }

  // 取消收藏本页面的所有作品
  private unBookmarkMode = false
  private unBookmarkAllWorksOnThisPage() {
    if (states.busy || this.unBookmarkMode) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    // 走一遍简化的抓取流程
    this.unBookmarkMode = true
    log.warning(lang.transl('_取消收藏本页面的所有作品'))
    toast.warning(lang.transl('_取消收藏本页面的所有作品'), {
      position: 'topCenter',
    })
    EVT.fire('closeCenterPanel')
    // 设置抓取页数为 1
    this.crawlNumber = 1
    store.tag = Tools.getTagFromURL()
    this.readyGetIdList()
    this.getIdList()
  }

  protected nextStep() {
    this.setSlowCrawl()
    this.readyGetIdList()
    this.getIdList()
  }

  protected readyGetIdList() {
    if (window.location.pathname.includes('/novel')) {
      this.type = 'novels'
    }

    // 每页个作品数，插画 48 个，小说 24 个
    const onceNumber = window.location.pathname.includes('/novels') ? 24 : 48

    // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
    const nowPage = Utils.getURLSearchField(location.href, 'p') // 判断当前处于第几页，页码从 1 开始。也可能没有页码
    if (nowPage) {
      this.offset = (parseInt(nowPage) - 1) * onceNumber
    }
    if (this.offset < 0) {
      this.offset = 0
    }

    // 根据页数设置，计算要下载的个数
    if (this.crawlNumber === -1) {
      this.requsetNumber = Config.worksNumberLimit
    } else {
      this.requsetNumber = onceNumber * this.crawlNumber
    }

    // 判断是公开收藏还是非公开收藏
    // 在新旧版 url 里，rest 都是在查询字符串里的
    this.isHide = Utils.getURLSearchField(location.href, 'rest') === 'hide'

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
        Tools.getUserId(),
        this.type,
        store.tag,
        this.offset,
        this.isHide
      )
    } catch (error) {
      this.getIdList()
      return
    }

    if (
      data.body.works.length === 0 ||
      this.idList.length >= this.requsetNumber ||
      this.filteredNumber >= this.requsetNumber
    ) {
      // 书签页获取完毕
      return this.afterGetIdList()
    } else {
      // 没有抓取完毕时，添加数据
      const idType = this.type === 'illusts' ? 'unknown' : 'novels'
      for (const workData of data.body.works) {
        if (this.filteredNumber >= this.requsetNumber) {
          return this.afterGetIdList()
        }
        const filterOpt: FilterOption = {
          id: workData.id,
          tags: workData.tags,
          bookmarkData: workData.bookmarkData,
          createDate: workData.createDate,
          userId: workData.userId,
          xRestrict: workData.xRestrict,
        }

        this.filteredNumber++

        if (await filter.check(filterOpt)) {
          this.idList.push({
            type: idType,
            id: workData.id,
          })
        }
      }

      this.offset += this.onceRequest // 每次增加偏移量

      log.log(
        lang.transl('_当前作品个数', this.idList.length.toString()),
        1,
        false
      )

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

  // 获取作品 id 列表完毕之后
  private afterGetIdList() {
    // 因为书签页面一次获取 100 个作品，大于一页的数量。所以可能会抓取多了，需要删除多余的作品
    if (this.idList.length > this.requsetNumber) {
      // 删除后面部分（较早收藏的），留下近期收藏的
      this.idList.splice(this.requsetNumber, this.idList.length)
      // 书签页面的 api 没有考虑页面上的排序顺序，获取到的 id 列表始终是按收藏顺序由近期到早期排列的
    }

    if (!this.unBookmarkMode) {
      // 正常抓取时
      store.idList = store.idList.concat(this.idList)
      this.getIdListFinished()
    } else {
      // 取消收藏本页面的书签时
      // 复制本页作品的 id 列表，传递给指定模块
      const idList = Array.from(this.idList)
      this.resetGetIdListStatus()
      this.unBookmarkMode = false
      unBookmarkWorks.start(idList)
    }
  }

  protected resetGetIdListStatus() {
    this.type = 'illusts'
    this.idList = []
    this.offset = 0
    this.requsetNumber = 0
    this.filteredNumber = 0
  }
}
export { InitBookmarkPage }
