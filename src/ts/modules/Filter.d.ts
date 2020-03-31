// 过滤器的选项
export interface FilterOption {
  id?: number | string
  illustType?: 0 | 1 | 2
  pageCount?: number
  tags?: string[]
  bookmarkCount?: number
  bookmarkData?: any
  width?: number
  height?: number
  yes_rank?: number
  createDate?: string
  mini?: string
}

export interface FilterWh {
  andOr: '&' | '|'
  width: number
  height: number
}
