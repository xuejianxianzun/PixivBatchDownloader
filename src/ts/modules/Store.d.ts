import { UgoiraInfo } from './CrawlResult'

// 保存每个要下载的图片的信息
export interface WorkInfo {
  id: string
  url: string
  title: string
  tags: string[]
  tagsTranslated: string[]
  user: string
  userid: string
  fullWidth: number
  fullHeight: number
  ext: string
  bmk: number
  date: string
  type: number
  rank: string
  ugoiraInfo: UgoiraInfo | null
}

export interface WorkInfoOptional {
  id?: string
  url?: string
  title?: string
  tags?: string[]
  tagsTranslated?: string[]
  user?: string
  userid?: string
  fullWidth?: number
  fullHeight?: number
  ext?: string
  bmk?: number
  date?: string
  type?: number
  rank?: string
  ugoiraInfo?: UgoiraInfo | null
}

// 储存作品在排行榜中的排名
export interface RankList {
  [key: string]: string
}
