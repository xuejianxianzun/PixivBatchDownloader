export type userWorksType = 'illusts' | 'manga' | 'novels'

export type tagPageFlag = 'illusts' | 'manga' | 'illustmanga' | 'novels'

// 大家的新作品的 API 参数
export interface NewIllustOption {
  lastId: string
  limit: string
  type: string
  r18: string
}

// 排行榜的 API 参数
export interface RankingOption {
  mode: string
  p: number
  worksType?: string
  date?: string
}

// 搜索 api 使用的选项（过滤选项）
export interface SearchOption {
  order?: string
  type?: string
  wlt?: string
  hlt?: string
  ratio?: string
  tool?: string
  s_mode?: string
  mode?: string
  scd?: string
  ecd?: string
  blt?: string
  bgt?: string
  [key: string]: string | undefined
}
