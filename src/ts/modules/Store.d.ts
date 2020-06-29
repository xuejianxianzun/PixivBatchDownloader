import { UgoiraInfo } from './CrawlResult'
export type IDListType = 'illusts' | 'manga' | 'novels' | 'ugoira' | 'unkown'

export interface IDData {
  type: IDListType
  id: string
}

// 保存每个要下载的作品的信息
export interface WorkInfo {
  idNum: number
  id: string
  url: string
  thumb: string
  pageCount: number
  dlCount: number
  title: string
  tags: string[]
  tagsTranslated: string[]
  user: string
  userId: string
  fullWidth: number
  fullHeight: number
  ext: string
  bmk: number
  bookmarked: boolean
  date: string
  type: 0 | 1 | 2 | 3
  rank: string
  ugoiraInfo: UgoiraInfo | null,
  seriesTitle: string | null
    seriesOrder: string | null
}

export interface WorkInfoOptional {
  idNum?: number
  id?: string
  url?: string
  thumb?: string
  pageCount?: number
  dlCount?: number
  title?: string
  tags?: string[]
  tagsTranslated?: string[]
  user?: string
  userId?: string
  fullWidth?: number
  fullHeight?: number
  ext?: string
  bmk?: number
  bookmarked?: boolean
  date?: string
  type?: 0 | 1 | 2 | 3
  rank?: string
  ugoiraInfo?: UgoiraInfo | null,
  seriesTitle?: string | null
    seriesOrder?: string | null
}

// 储存作品在排行榜中的排名
export interface RankList {
  [key: string]: string
}
