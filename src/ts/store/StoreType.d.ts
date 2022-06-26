import { UgoiraInfo } from '../crawl/CrawlResult'
export type IDListType = 'illusts' | 'manga' | 'novels' | 'ugoira' | 'unknown'

export interface IDData {
  type: IDListType
  id: string
}

export interface NovelMeta {
  id: string
  title: string
  content: string
  description: string
  coverUrl: string
  createDate: string
  userName: string
  meta: string
}

// 保存每个要下载的作品的信息
export interface Result {
  idNum: number
  id: string
  original: string
  thumb: string
  regular: string
  small: string
  pageCount: number
  dlCount: number
  /**该文件在作品中的索引，从 0 开始。所有类型的文件都有这个值
   */
  index: number
  title: string
  description: string
  tags: string[]
  tagsWithTransl: string[]
  tagsTranslOnly: string[]
  user: string
  userId: string
  fullWidth: number
  fullHeight: number
  ext: string
  bmk: number
  bmkId: string
  bookmarked: boolean
  /**创建日期 */
  date: string
  /**最后上传（修改）日期 */
  uploadDate: string
  /** 0 插画
   * 1 漫画
   * 2 动图
   * 3 小说
   */
  type: 0 | 1 | 2 | 3
  rank: number | null
  ugoiraInfo: UgoiraInfo | null
  seriesTitle: string | null
  seriesOrder: number | null
  seriesId: string | null
  novelMeta: NovelMeta | null
  likeCount: number
  viewCount: number
  commentCount: number
  xRestrict: 0 | 1 | 2
  sl: 0 | 2 | 4 | 6 | null
}

export interface ResultOptional {
  idNum?: number
  id?: string
  original?: string
  thumb?: string
  regular?: string
  small?: string
  pageCount?: number
  dlCount?: number
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
