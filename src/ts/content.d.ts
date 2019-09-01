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

declare let zip: any

// 获取到的未分类书签的数据
interface BookmarkData {
  illustId: string
  illustTitle: string
  id: string
  title: string
  illustType: number
  xRestrict: number
  restrict: number
  sl: number
  url: string
  description: string
  tags: string[]
  userId: string
  userName: string
  width: number
  height: number
  pageCount: number
  isBookmarkable: boolean
  bookmarkData: {
    id: string
    private: boolean
  }
  profileImageUrl: string
}

// 从未分类书签中取出一些需要的数据
interface BookmarkResult {
  id: string
  tags: string
  restrict: boolean
}

// 动图每一帧的文件名和延迟
interface UgoiraInfo {
  frames: { file: string; delay: number }[]
  mimeType: string
}

declare let Whammy:any

// declare let Viewer:any

declare window.HTMLCollectio: []