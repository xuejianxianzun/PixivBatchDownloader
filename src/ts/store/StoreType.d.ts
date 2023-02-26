import { UgoiraInfo } from '../crawl/CrawlResult'

export type WorkTypeString =
  | 'illusts'
  | 'manga'
  | 'ugoira'
  | 'novels'
  | 'unknown'

export interface IDData {
  id: string
  type: WorkTypeString
}

export interface NovelMeta {
  id: string
  title: string
  content: string
  description: string
  coverUrl: string
  createDate: string
  userName: string
  /**嵌入的图片 id 以及其原图 URL。例如：
   *
   * "12136542": "https://i.pximg.net/novel-cover-original/img/2022/07/20/00/09/34/tei441171884625_be457733c2b6806cee908f7a39498c9f.png"
   */
  embeddedImages: null | {
    [key: string]: string
  }
  meta: string
}

/**保存每个要下载的作品的信息。这是下载器内部保存的抓取结果 */
export interface Result {
  /**是否为 AI 创作。0 未知 1 否 2 是 */
  aiType: 0 | 1 | 2
  /**作品的数字 id。这个属性不是唯一的，多图作品会产生多个抓取结果，它们的 idNum 是相同的 */
  idNum: number
  /**这个抓取结果的唯一标志，包含 id 和序号，如 44920385_p0 */
  id: string
  /**原图的 URL */
  original: string
  /**方形缩略图 (250px) 的 URL */
  thumb: string
  /**普通图片 (1200px) 的 URL */
  regular: string
  /**小尺寸图片 (540px) 的 URL */
  small: string
  /**这个作品共有多少张图片 */
  pageCount: number
  /**这个文件在作品中的索引，从 0 开始 */
  index: number
  /**这个作品的标题 */
  title: string
  /**这个作品的描述（简介） */
  description: string
  /**这个作品的 tag 列表（未翻译） */
  tags: string[]
  /**这个作品的 tag 列表（附带翻译） */
  tagsWithTransl: string[]
  /**这个作品的 tag 列表（仅翻译） */
  tagsTranslOnly: string[]
  /**这个作品的用户名（画师名） */
  user: string
  /**这个作品的用户 id */
  userId: string
  /**这个图片的原图的宽度（小说作品这个值为 0） */
  fullWidth: number
  /**这个图片的原图的高度（小说作品这个值为 0） */
  fullHeight: number
  /**这个文件的扩展名。插画和漫画是图片原本的扩展名；动图和小说使用用户设置的扩展名 */
  ext: string
  /**这个作品的收藏数量 */
  bmk: number
  /**如果当前用户收藏了这个作品，这个值会是一个字符串标志。如果用户未收藏这个作品，则是空字符串*/
  bmkId: string
  /**当前用户是否收藏了这个作品 */
  bookmarked: boolean
  /**这个作品的创建日期（也就是初次上传的日期） */
  date: string
  /**这个作品的最后一次上传（修改）日期 */
  uploadDate: string
  /**作品类型
   *  0 插画
   * 1 漫画
   * 2 动图
   * 3 小说
   */
  type: 0 | 1 | 2 | 3
  /**这个作品在排行榜里的排名。用户抓取排行榜里的作品之后才会有值，否则是 null */
  rank: number | null
  /**这个作品的动画信息。如果这个作品不是动图，则为 null */
  ugoiraInfo: UgoiraInfo | null
  /**这个作品所属的的系列名称。如果这个作品不属于一个系列，则为 null */
  seriesTitle: string | null
  /**这个作品在系列里的序号。如果这个作品不属于一个系列，则为 null */
  seriesOrder: number | null
  /**这个作品所属的的系列的 Id。如果这个作品不属于一个系列，则为 null */
  seriesId: string | null
  /**这个小说作品的元数据。小说的正文也在这里面 */
  novelMeta: NovelMeta | null
  /**这个作品的点赞数量 */
  likeCount: number
  /**这个作品的浏览数量 */
  viewCount: number
  /**这个作品的评论数量 */
  commentCount: number
  /**这个作品的年龄限制
   * 0 全年龄
   * 1 R-18
   * 2 R-18G
   */
  xRestrict: 0 | 1 | 2
  /**这个作品的色情等级（未确认）
   * 0 该作品尚未进行此项检测
   * 2 没有明显的色情元素
   * 4 有稍微明显的色情元素
   * 6 有很明显的色情元素
   * 注意，即使值为 6，也不一定是 R-18 作品
   */
  sl: 0 | 2 | 4 | 6 | null
}

/**ResultOptional 里没有 index 属性 */
export interface ResultOptional {
  aiType?: 0 | 1 | 2
  idNum?: number
  id?: string
  original?: string
  thumb?: string
  regular?: string
  small?: string
  pageCount?: number
  title?: string
  description?: string
  tags?: string[]
  tagsWithTransl?: string[]
  tagsTranslOnly?: string[]
  user?: string
  userId?: string
  fullWidth?: number
  fullHeight?: number
  ext?: string
  bmk?: number
  bmkId?: string
  bookmarked?: boolean
  date?: string
  uploadDate?: string
  type?: 0 | 1 | 2 | 3
  rank?: number | null
  ugoiraInfo?: UgoiraInfo | null
  seriesTitle?: string | null
  seriesOrder?: number | null
  seriesId?: string | null
  novelMeta?: NovelMeta | null
  likeCount?: number
  viewCount?: number
  commentCount?: number
  xRestrict?: 0 | 1 | 2
  sl?: 0 | 2 | 4 | 6 | null
}

// 储存作品在排行榜中的排名
export interface RankList {
  [key: string]: number
}
