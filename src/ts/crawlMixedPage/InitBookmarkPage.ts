// 初始化新版收藏页面
import { InitPageBase } from '../crawl/InitPageBase'
import { API } from '../API'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { IDData } from '../store/StoreType'
import { options } from '../setting/Options'
import {
  ArtworkCommonData,
  BookmarkData,
  BookmarkResult,
} from '../crawl/CrawlResult'
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
import { removeWorksTagsInBookmarks } from '../RemoveWorksTagsInBookmarks'
import { EVT } from '../EVT'
import { WorkBookmarkData, bookmark } from '../Bookmark'
import { showHelp } from '../ShowHelp'
import { msgBox } from '../MsgBox'
import { settings } from '../setting/Settings'

class InitBookmarkPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private idList: IDData[] = [] // 储存从列表页获取到的 id

  private bookmarkDataList: WorkBookmarkData[] = []

  private exportList: BookmarkResult[] = []

  private type: 'illusts' | 'novels' = 'illusts' // 页面是图片还是小说

  private isHide = false // 当前页面是否显示的是非公开收藏

  private requsetNumber: number = 0 // 根据页数，计算要抓取的作品个数

  private filteredNumber = 0 // 记录检查了多少作品（不论结果是否通过都计入）

  private readonly onceRequest: number = 100 // 每次请求多少个数量

  private offset: number = 0 // 每次请求的偏移量

  // 点击不同的功能按钮时，设定抓取模式
  private crawlMode: 'normal' | 'removeTags' | 'unBookmark' | 'unBookmark404' =
    'normal'

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
      min: 1,
      max: -1,
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

    // 显示提示
    window.setTimeout(() => {
      showHelp.show(
        'tipBookmarkManage',
        lang.transl('_在收藏页面里提示有辅助功能可用')
      )
    }, 1000)

    // 有些功能按钮只能在用户自己的页面里使用
    // 判断这个收藏页面是不是用户自己的页面
    const URLUserID = Utils.getURLPathField(window.location.pathname, 'users')
    const ownPage = URLUserID && URLUserID === store.loggedUserID
    if (ownPage) {
      const btn = Tools.addBtn(
        'otherBtns',
        Colors.bgGreen,
        '_给未分类作品添加添加tag'
      )
      new BookmarksAddTag(btn)

      Tools.addBtn(
        'otherBtns',
        Colors.bgYellow,
        '_移除本页面中所有作品的标签'
      ).addEventListener('click', () => {
        this.removeWorksTagsOnThisPage()
      })

      Tools.addBtn(
        'otherBtns',
        Colors.bgRed,
        '_取消收藏本页面的所有作品'
      ).addEventListener('click', () => {
        this.unBookmarkAllWorksOnThisPage()
      })

      Tools.addBtn(
        'otherBtns',
        Colors.bgRed,
        '_取消收藏所有已被删除的作品'
      ).addEventListener('click', () => {
        this.unBookmarkAll404Works()
      })
    }

    // 下面的功能按钮在所有人的收藏页面里都可以使用

    const showTip = () => {
      showHelp.show(
        'tipExportAndImportBookmark',
        lang.transl('_同步收藏列表的说明')
      )
    }

    const btnExport = Tools.addBtn('otherBtns', Colors.bgGreen, '_导出收藏列表')
    btnExport.addEventListener('click', () => {
      showTip()
      this.exportBookmarkList()
    })

    const btnImport = Tools.addBtn('otherBtns', Colors.bgGreen, '_导入收藏列表')
    btnImport.addEventListener('click', () => {
      this.importBookmarkIDList()
    })

    for (const btn of [btnExport, btnImport]) {
      btn.addEventListener('mouseover', showTip)
    }
  }

  // 移除本页面中所有作品的标签
  private removeWorksTagsOnThisPage() {
    if (states.busy || this.crawlMode !== 'normal') {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    // 走一遍简化的抓取流程
    this.crawlMode = 'removeTags'
    log.warning(lang.transl('_移除本页面中所有作品的标签'))
    log.warning(lang.transl('_它们会变成未分类状态'))
    toast.warning(lang.transl('_移除本页面中所有作品的标签'), {
      position: 'topCenter',
    })
    EVT.fire('closeCenterPanel')
    // 设置抓取页数为 1
    this.crawlNumber = 1
    this.readyGetIdList()
    this.getIdList()
  }

  // 取消收藏本页面的所有作品
  private unBookmarkAllWorksOnThisPage() {
    if (states.busy || this.crawlMode !== 'normal') {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    // 走一遍简化的抓取流程
    this.crawlMode = 'unBookmark'
    log.warning(lang.transl('_取消收藏本页面的所有作品'))
    toast.warning(lang.transl('_取消收藏本页面的所有作品'), {
      position: 'topCenter',
    })
    EVT.fire('closeCenterPanel')
    // 设置抓取页数为 1
    this.crawlNumber = 1
    this.readyGetIdList()
    this.getIdList()
  }

  private unBookmarkAll404Works() {
    if (states.busy || this.crawlMode !== 'normal') {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    // 走一遍简化的抓取流程
    this.crawlMode = 'unBookmark404'
    log.warning(lang.transl('_取消收藏所有已被删除的作品'))
    toast.warning(lang.transl('_取消收藏所有已被删除的作品'), {
      position: 'topCenter',
    })
    EVT.fire('closeCenterPanel')
    // 设置抓取页数为 -1
    this.crawlNumber = -1
    this.setSlowCrawl()
    this.readyGetIdList()
    // 抓取全部收藏
    this.offset = 0
    this.getIdList()
  }

  private bindExportEvent = false
  private exportBookmarkList() {
    if (states.busy || this.crawlMode !== 'normal') {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    states.exportIDList = true
    this.exportList = []
    EVT.fire('closeCenterPanel')

    // 走一遍完整的抓取流程
    // 此时的 crawlMode 是 normal
    // 这会应用用户设置的抓取页数和过滤条件
    this.readyCrawl()
    log.log(lang.transl('_导出收藏列表'), 2)

    // 绑定事件，在抓取完成后执行导出动作
    if (this.bindExportEvent === false) {
      window.addEventListener(EVT.list.getIdListFinished, async () => {
        if (states.exportIDList) {
          window.setTimeout(() => {
            states.exportIDList = false
          }, 500)

          if (this.exportList.length === 0) {
            return
          }

          const resultList = await Utils.json2BlobSafe(this.exportList)
          for (const result of resultList) {
            Utils.downloadFile(
              result.url,
              `Bookmark list-total ${
                result.total
              }-from ${Tools.getPageTitle()}-${Utils.replaceUnsafeStr(
                new Date().toLocaleString()
              )}.json`
            )
          }

          const msg = '✓ ' + lang.transl('_导出收藏列表')
          log.success(msg)
          toast.success(msg)
        }
      })

      this.bindExportEvent = true
    }
  }

  private async importBookmarkIDList() {
    const loadedJSON = (await Utils.loadJSONFile().catch((err) => {
      return msgBox.error(err)
    })) as BookmarkResult[]
    if (!loadedJSON) {
      return
    }

    // 要求是数组并且要有内容
    if (!Array.isArray(loadedJSON) || !loadedJSON.length || !loadedJSON[0]) {
      return toast.error(lang.transl('_格式错误'))
    }

    // 检查是否含有必须的字段（只检查了一部分）
    const keys = Object.keys(loadedJSON[0])
    const need = ['id', 'type', 'tags']
    for (const field of need) {
      if (!keys.includes(field)) {
        return toast.error(lang.transl('_格式错误'))
      }
    }

    const tip = lang.transl('_导入收藏列表')
    toast.success(tip)
    log.success(tip)
    EVT.fire('closeCenterPanel')

    log.log(lang.transl('_作品数量') + ` ${loadedJSON.length}`, 2)

    // 如果要收藏的作品数量较多，则先加载现有的收藏列表，以避免重复添加收藏，浪费时间
    // 如果要收藏的作品数量较少，则会直接进行收藏，而不先加载现有的收藏列表。
    // 这是因为当已收藏的作品数量较多的话，加载列表所花费的时间可能就已经超过了添加收藏的时间
    // 其实在导出收藏列表时，是可以知道这个作品有没有被【当时登录的用户】收藏的。
    // 但是在导入收藏的时候，用户可能换了另一个账号，此时无法直接知道这个作品是否被这个账号所收藏。
    // 所以要想避免重复添加收藏，还是必须在导入时先获取当前登录账号的收藏列表
    let oldList: BookmarkResult[] = []
    if (loadedJSON.length > 200) {
      log.log(lang.transl('_加载收藏列表'))
      // 注意，这里使用的必须是当前登录用户的 ID
      // 由于用户可能会在其他用户的页面上执行这个功能，所以不能使用 Tools.getUserId()
      const userID = store.loggedUserID
      let loadIllust = loadedJSON.some((item) => item.type === 'illusts')
      let loadNovel = loadedJSON.some((item) => item.type === 'novels')
      if (loadIllust) {
        log.log(lang.transl('_插画') + ', ' + lang.transl('_公开'))
        const illustsPublic = await bookmark.getAllBookmarkList(
          userID,
          'illusts',
          '',
          0,
          false
        )

        log.log(lang.transl('_插画') + ', ' + lang.transl('_不公开'))
        const illustsPrivate = await bookmark.getAllBookmarkList(
          userID,
          'illusts',
          '',
          0,
          true
        )

        oldList = oldList.concat(illustsPublic, illustsPrivate)
      }
      if (loadNovel) {
        log.log(lang.transl('_小说') + ', ' + lang.transl('_公开'))
        const novelsPublic = await bookmark.getAllBookmarkList(
          userID,
          'novels',
          '',
          0,
          false
        )

        log.log(lang.transl('_小说') + ', ' + lang.transl('_不公开'))
        const novelsPrivate = await bookmark.getAllBookmarkList(
          userID,
          'novels',
          '',
          0,
          true
        )

        oldList = oldList.concat(novelsPublic, novelsPrivate)
      }

      log.log(lang.transl('_一共有x个', oldList.length.toString()), 2)
    }

    // 开始批量添加收藏
    bookmark.addBookmarksInBatchs(loadedJSON, oldList)
  }

  protected nextStep() {
    this.crawlMode = 'normal'
    this.setSlowCrawl()
    this.readyGetIdList()
    this.getIdList()
  }

  protected readyGetIdList() {
    if (window.location.pathname.includes('/novel')) {
      this.type = 'novels'
    }

    store.tag = Tools.getTagFromURL()

    // 每页个作品数，插画 48 个，小说 30 个
    const onceNumber = window.location.pathname.includes('/novels') ? 30 : 48

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
    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    let data: BookmarkData
    try {
      data = await API.getBookmarkData(
        Tools.getCurrentPageUserID(),
        this.type,
        store.tag,
        this.offset,
        this.isHide
      )
    } catch (error) {
      // 一种特殊的错误情况：
      // 如果一个用户被封禁了，那么在他的小说收藏页面里抓取，会返回 html 源代码，
      // 就是显示“找不到该用户”的错误页面。此时无法解析为 JSON，报错信息如下：
      // SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
      // 此时应该终止抓取。
      // 注：这个错误只在小说收藏页面出现。在插画收藏页面依旧可以正常抓取
      if ((error as any).message.includes('not valid JSON')) {
        if (lang.type.includes('zh')) {
          log.error(`预期的数据格式为 JSON，但抓取结果不是 JSON。已取消抓取。<br>
一种可能的原因：您已被 Pixiv 封禁。`)
        } else {
          log.error(`Expected data format is JSON, but the fetch result is not JSON. Fetch has been canceled. <br>
One possible reason: You have been banned from Pixiv.`)
        }
        return this.getIdListFinished()
      }
      this.getIdList()
      return
    }

    if (states.stopCrawl) {
      return this.getIdListFinished()
    }

    if (
      data.body.works.length === 0 ||
      this.bookmarkDataList.length >= this.requsetNumber ||
      this.idList.length >= this.requsetNumber ||
      this.filteredNumber >= this.requsetNumber
    ) {
      // 书签页获取完毕
      return this.afterGetIdList()
    } else {
      // 没有抓取完毕时，添加数据
      for (const workData of data.body.works) {
        if (this.filteredNumber >= this.requsetNumber) {
          return this.afterGetIdList()
        }

        if (workData.bookmarkData) {
          if (
            this.crawlMode === 'unBookmark' ||
            this.crawlMode === 'removeTags' ||
            (this.crawlMode === 'unBookmark404' &&
              Number.parseInt(workData.userId) == 0)
          ) {
            this.bookmarkDataList.push({
              workID: Number.parseInt(workData.id),
              type:
                (workData as ArtworkCommonData).illustType === undefined
                  ? 'novels'
                  : 'illusts',
              bookmarkID: workData.bookmarkData.id,
              private: workData.bookmarkData.private,
            })
          }
        }

        if (this.crawlMode === 'normal') {
          const filterOpt: FilterOption = {
            aiType: workData.aiType,
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
              type:
                (workData as ArtworkCommonData).illustType === undefined
                  ? 'novels'
                  : Tools.getWorkTypeString(
                      (workData as ArtworkCommonData).illustType
                    ),
              id: workData.id,
            })

            if (states.exportIDList) {
              this.exportList.push({
                id: workData.id,
                type:
                  (workData as ArtworkCommonData).illustType === undefined
                    ? 'novels'
                    : 'illusts',
                tags: workData.tags,
                restrict: workData.bookmarkData?.private || false,
              })
            }
          }
        }
      }

      this.offset += this.onceRequest

      const length =
        this.crawlMode === 'normal'
          ? this.idList.length
          : this.bookmarkDataList.length
      log.log(lang.transl('_当前作品个数', length.toString()), 1, false)

      // 继续抓取
      if (states.slowCrawlMode) {
        setTimeoutWorker.set(() => {
          this.getIdList()
        }, settings.slowCrawlDealy)
      } else {
        this.getIdList()
      }
    }
  }

  // 获取作品 id 列表完毕之后
  private afterGetIdList() {
    // 裁剪作品
    if (this.crawlMode === 'normal') {
      // 因为书签页面一次获取 100 个作品，大于一页的数量。所以可能会抓取多了，需要删除多余的作品
      if (this.idList.length > this.requsetNumber) {
        // 删除后面部分（较早收藏的），留下近期收藏的
        this.idList.splice(this.requsetNumber, this.idList.length)
        // 书签页面的 api 没有考虑页面上的排序顺序，获取到的 id 列表始终是按收藏顺序由近期到早期排列的
      }

      if (this.exportList.length > this.requsetNumber) {
        this.exportList.splice(this.requsetNumber, this.exportList.length)
      }
    } else {
      if (this.bookmarkDataList.length > this.requsetNumber) {
        this.bookmarkDataList.splice(
          this.requsetNumber,
          this.bookmarkDataList.length
        )
      }
    }

    if (this.crawlMode === 'normal') {
      // 正常抓取
      store.idList = store.idList.concat(this.idList)
      this.getIdListFinished()
    } else if (
      this.crawlMode === 'unBookmark' ||
      this.crawlMode === 'unBookmark404'
    ) {
      // 取消收藏

      // 导出已被删除的收藏的 ID 列表
      if (
        this.crawlMode === 'unBookmark404' &&
        this.bookmarkDataList.length > 0
      ) {
        const IDList = []
        for (const item of this.bookmarkDataList) {
          IDList.push(item.workID)
        }
        const blob = Utils.json2Blob(IDList)
        const url = URL.createObjectURL(blob)
        Utils.downloadFile(url, '404 bookmark ID list.txt')
        log.success(lang.transl('_已导出被删除的作品的ID列表'))
      }

      const bookmarkDataList = Array.from(this.bookmarkDataList)
      this.resetGetIdListStatus()
      unBookmarkWorks.start(bookmarkDataList)
    } else if (this.crawlMode === 'removeTags') {
      // 移除本页面作品的标签
      const bookmarkDataList = Array.from(this.bookmarkDataList)
      this.resetGetIdListStatus()
      removeWorksTagsInBookmarks.start(bookmarkDataList)
    }
  }

  protected resetGetIdListStatus() {
    this.type = 'illusts'
    this.crawlMode = 'normal'
    this.idList = []
    this.bookmarkDataList = []
    this.offset = 0
    this.requsetNumber = 0
    this.filteredNumber = 0
  }
}

export { InitBookmarkPage }
