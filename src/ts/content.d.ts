interface ImgInfo {
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
  ugoiraInfo: object
}

interface TagSearchResult {
  id: number
  e: string
  num: number
}

declare enum Color {
  blue = '#0ea8ef',
  green = '#14ad27',
  red = '#f33939'
}

interface PageInfo {
  p_title: string
  p_user: string
  p_uid: string
  p_tag: string
}
