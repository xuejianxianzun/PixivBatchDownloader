// 过滤器的选项
export interface FilterOption {
  illustType?: 0 | 1 | 2
  tags?: string[]
  bookmarkCount?: number
  bookmarkData?: any
  width?: number
  height?: number
  yes_rank?: number
}

export interface FilterWh {
  andOr: '&' | '|'
  width: number
  height: number
}
