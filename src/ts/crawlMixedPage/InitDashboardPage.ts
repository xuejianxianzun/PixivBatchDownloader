// 初始化数据分析（我的作品）页面
// https://www.pixiv.net/dashboard/works
import { InitPageBase } from '../crawl/InitPageBase'
import { Tools } from '../Tools'
import { lang } from '../Language'
import { toast } from '../Toast'
import { API } from '../API'
import { msgBox } from '../MsgBox'
import { createCSV } from '../utils/CreateCSV'
import { Utils } from '../utils/Utils'
import { DateFormat } from '../utils/DateFormat'
import { settings } from '../setting/Settings'
import { EVT } from '../EVT'

/** 作品的数据 */
interface ExportData {
  workId: string
  /** 作品类型，插画、漫画、动图都是 'illust' */
  workType: 'illust' | 'novel'
  illustType?: 0 | 1 | 2
  /**是否为 AI 生成。0 未知 1 否 2 是 */
  aiType: 0 | 1 | 2
  /** 标题 */
  title: string
  tags: string[]
  /** 赞! */
  ratingCount: number
  /** 收藏 */
  bookmarkCount: number
  /** 浏览量 */
  viewCount: number
  /** 评论 */
  commentCount: number
  /** 日期 */
  createDate: string
  /** 评级：0 是待评级，1 是全年龄，2 是限制级 */
  contentRating: 0 | 1 | 2
  /** 张数。仅当作品类型为 'illust' 时有此数据 */
  pageCount?: number
  /** 文字数，仅当作品类型为 'novel' 时有此数据 */
  textCount?: number
  /** 单词数，仅当作品类型为 'novel' 时有此数据。
   * 另外，即使有这个数据也不一定会在网页上显示出来，因为有个 useWordCount 属性。如果小说是某些语言（例如中文，那么 useWordCount 为 false，所以此时会显示为无数据的 '-'） */
  wordCount?: number
  /** 在每日排行榜上最高的名次。0 是没有名次 */
  dailyRankingBestRank: number
  /** 响应关联作品 */
  imageResponseCount: number
  /** 添加插图 */
  quotedIllustCount: number
}

/** 把作品的数据转换成 CSV 内容 */
type Schema = {
  title: string
  text: (data: ExportData) => string
}[]

// 需要使用 2 个相关 API：
// 1. 获取插画、漫画、动图作品，包含部分数据：
// https://www.pixiv.net/ajax/dashboard/works/illust/request_strategy
// 2. 获取所有小说作品，包含部分数据：
// https://www.pixiv.net/ajax/dashboard/works/novel/request_strategy

// 此外还有个用于仪表盘首页的 API，除了自己的作品外还包含了些其他人的作品。不需要使用它
// https://www.pixiv.net/ajax/dashboard/home

class InitDashboardPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected addCrawlBtns() {
    this.addInitPageBtn(
      'crawlBtns',
      '_导出作品数据CSV',
      '',
      'exportDashboardData',
      'brand'
    ).addEventListener('click', () => {
      this.export()
    })
  }

  protected getWantPage() {}

  protected getIdList() {}

  private busy = false

  /** 要导出哪些作品的数据 */
  // 共有 4 种分类：
  // 全部 插画 漫画 小说
  // 动图没有单独的分类，它和插画是放在一起的，类型都是 'illust'
  private exportType: 'all' | 'illust' | 'manga' | 'novel' = 'all'
  private exportScope = 'all'
  // 向 API 发送请求时，获取哪些类型
  private APIWorkTypes: [] | ['illust'] | ['novel'] | ['illust', 'novel'] = []

  private exportList: ExportData[] = []

  private schema: Schema = [
    { title: 'id', text: (data) => data.workId },
    {
      title: lang.transl('_类型'),
      text: (data) => {
        if (data.workType === 'novel') {
          return lang.transl('_小说')
        } else {
          switch (data.illustType) {
            case 0:
              return lang.transl('_插画')
            case 1:
              return lang.transl('_漫画')
            case 2:
              return lang.transl('_动图')
            default:
              return lang.transl('_插画')
          }
        }
      },
    },
    { title: lang.transl('_标题'), text: (data) => data.title },
    {
      title: lang.transl('_标签'),
      text: (data) => data.tags.join(settings.tagsSeparator),
    },
    {
      title: lang.transl('_赞'),
      text: (data) => Utils.formatNumber(data.ratingCount),
    },
    {
      title: lang.transl('_收藏'),
      text: (data) => Utils.formatNumber(data.bookmarkCount),
    },
    {
      title: lang.transl('_浏览量'),
      text: (data) => Utils.formatNumber(data.viewCount),
    },
    {
      title: lang.transl('_评论'),
      text: (data) => Utils.formatNumber(data.commentCount),
    },
    // 日期原本是包含了时间的，例如 "2022-06-26 20:39:11"，只输出前面的日期部分
    {
      title: lang.transl('_日期'),
      text: (data) => data.createDate.split(' ')[0],
    },
    {
      title: lang.transl('_评级'),
      text: (data) => {
        switch (data.contentRating) {
          case 0:
            return '待评级'
          case 1:
            // 全年龄输出为 '-'
            return '-'
          default:
            return '限制级'
        }
      },
    },
    {
      title: lang.transl('_张数'),
      text: (data) => {
        if (data.pageCount !== undefined) {
          return data.pageCount.toString()
        } else {
          return '-'
        }
      },
    },
    {
      title: lang.transl('_文字数'),
      text: (data) => {
        if (data.textCount !== undefined) {
          return Utils.formatNumber(data.textCount)
        } else {
          return '-'
        }
      },
    },
    {
      title: lang.transl('_单词数'),
      text: (data) => {
        if (data.wordCount !== undefined) {
          return Utils.formatNumber(data.wordCount)
        } else {
          return '-'
        }
      },
    },
    {
      title: lang.transl('_排名'),
      text: (data) => {
        if (data.dailyRankingBestRank === 0) {
          return '-'
        } else {
          return data.dailyRankingBestRank.toString()
        }
      },
    },
    {
      title: lang.transl('_响应关联作品'),
      text: (data) => data.imageResponseCount.toString(),
    },
    {
      title: lang.transl('_添加插图'),
      text: (data) => data.quotedIllustCount.toString(),
    },
    {
      title: 'url',
      text: (data) => {
        return `https://www.pixiv.net/${data.workType === 'illust' ? 'i' : 'n'}/${data.workId}`
      },
    },
  ]

  private async export() {
    if (this.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }
    this.busy = true
    EVT.fire('closeCenterPanel')

    this.reset()

    try {
      await this.extractData()
    } catch (error: Error | any) {
      this.busy = false
      const msg = lang.transl('_出现错误请稍后重试')
      msgBox.error(msg)
      console.log(error)
      return
    }

    this.output()

    this.busy = false
  }

  private reset() {
    this.exportList = []
    this.APIWorkTypes = []

    // 根据当前页面的 URL，判断要获取插画、漫画、小说，还是全部
    let needGetIllust = false
    let needGetNovel = false
    const path = window.location.pathname
    if (path.includes('/works/illustrations')) {
      this.exportType = 'illust'
      this.exportScope = lang.transl('_插画')
      needGetIllust = true
      needGetNovel = false
    } else if (path.includes('/works/manga')) {
      this.exportType = 'manga'
      this.exportScope = lang.transl('_漫画')
      needGetIllust = true
      needGetNovel = false
    } else if (path.includes('/works/novels')) {
      this.exportType = 'novel'
      this.exportScope = lang.transl('_小说')
      needGetIllust = false
      needGetNovel = true
    } else {
      this.exportType = 'all'
      this.exportScope = lang.transl('_全部')
      needGetIllust = true
      needGetNovel = true
    }

    // 判断 API 应该获取哪些分类的数据
    if (needGetIllust && needGetNovel) {
      this.APIWorkTypes = ['illust', 'novel']
    } else {
      if (needGetIllust) {
        this.APIWorkTypes = ['illust']
      }
      if (needGetNovel) {
        this.APIWorkTypes = ['novel']
      }
    }
  }

  private async extractData() {
    for (const getWorkType of this.APIWorkTypes) {
      const dashboardData = await API.getDashboardData(getWorkType)
      // 提取数据
      // 每个作品的完整的“数据分析”数据，需要从 work 和 thumbnail 里结合起来
      // 先遍历 work，然后从 thumbnail 里查找对应 id 的数据
      const thumbnails = dashboardData.body.thumbnails[getWorkType]
      dashboardData.body.data.works.forEach((work) => {
        const thumb = thumbnails.find((t) => t.id === work.workId)
        if (thumb) {
          const data: ExportData = {
            workId: work.workId,
            workType: work.workType,
            illustType: 'illustType' in thumb ? thumb.illustType : undefined,
            aiType: thumb.aiType,
            title: thumb.title,
            tags: thumb.tags,
            ratingCount: work.ratingCount,
            bookmarkCount: work.bookmarkCount,
            viewCount: work.viewCount,
            commentCount: work.commentCount,
            createDate: work.createDate,
            contentRating: work.contentRating,
            pageCount: 'pageCount' in thumb ? thumb.pageCount : undefined,
            textCount: 'textCount' in thumb ? thumb.textCount : undefined,
            wordCount: 'wordCount' in thumb ? thumb.wordCount : undefined,
            dailyRankingBestRank: work.dailyRankingBestRank,
            imageResponseCount: work.imageResponseCount,
            quotedIllustCount: work.imageResponseCount,
          }
          this.exportList.push(data)
        }
      })
    }
  }

  /** 输出为 CSV 文件 */
  private output() {
    if (this.exportList.length === 0) {
      const msg = lang.transl('_没有数据可供使用')
      msgBox.warning(msg)
      return
    }

    // 判断结果里是否含有小说，来确定是否输出小说特有的属性
    // 如果有小说则输出所有数据（文字数、单词数）
    // 如果没有小说就不输出小说特有的数据，因为图像作品不需要显示这些数据
    const hasNovel = this.exportList.some((data) => data.workType === 'novel')
    const novelTitles = [lang.transl('_文字数'), lang.transl('_单词数')]

    /** 构造 CSV 数据 */
    const csvContent: string[][] = []

    // 添加标题列
    const titleArray: string[] = []
    this.schema.forEach((cfg) => {
      // 添加小说特有的数据
      if (novelTitles.includes(cfg.title)) {
        if (hasNovel) {
          titleArray.push(cfg.title)
        }
      } else {
        // 添加通用数据
        titleArray.push(cfg.title)
      }
    })
    csvContent.push(titleArray)

    // 根据当前页面类型，导出对应的数据。可能是以下四种情况之一：
    // 全部 插画 漫画 小说
    let useData = this.exportList.filter((data) => {
      switch (this.exportType) {
        case 'all':
          return true
        case 'illust':
          return data.illustType === 0 || data.illustType === 2
        case 'manga':
          return data.illustType === 1
        case 'novel':
          return data.workType === 'novel'
      }
    })

    // 添加作品数据
    useData.forEach((data) => {
      const contentArray: string[] = []
      this.schema.forEach((cfg) => {
        // 添加小说特有的数据
        if (novelTitles.includes(cfg.title)) {
          if (hasNovel) {
            contentArray.push(cfg.text(data))
          }
        } else {
          // 添加通用数据
          contentArray.push(cfg.text(data))
        }
      })
      csvContent.push(contentArray)
    })

    // 生成文件并保存
    const blob = createCSV.create(csvContent)
    const url = URL.createObjectURL(blob)
    const date = DateFormat.format(new Date())
    const fileName = `${lang.transl('_数据分析')} - ${this.exportScope} - ${date}.csv`
    Utils.downloadFile(url, fileName)
    URL.revokeObjectURL(url)

    const msg = lang.transl('_导出成功') + `:<br>${fileName}`
    msgBox.success(msg)
  }
}

export { InitDashboardPage }
