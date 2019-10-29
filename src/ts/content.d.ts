declare let zip: any

declare let Whammy: any

declare let GIF: any

// 下载时要使用的作品信息
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
  type: number
  rank: string
  ugoiraInfo: UgoiraInfo
}

// tag 搜索页的作品数据
interface TagSearchResult {
  id: number
  e: string
  num: number
}

// 页面上的信息
interface PageInfo {
  pageUser: string
  pageUserID: string
  pageTag: string
}

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
  frames?: { file: string; delay: number }[]
  mimeType?: string
}

// tag 搜索页里，作品信息的数据
interface TagSearchData {
  bookmarkCount: number
  height: number
  illustId: string
  illustTitle: string
  illustType: string
  isBookmarkable: boolean
  isBookmarked: boolean
  isPrivateBookmark: boolean
  isAdContainer: boolean
  pageCount: number
  responseCount: number
  tags: string[]
  url: string
  userId: string
  userImage: string
  userName: string
  width: number
}

// 画师列表页的列表数据，不带 tag。一些不需要使用的数据就简化了
interface Type2ListDataNoTag {
  error: boolean
  message: string
  body: {
    illusts: {
      [key: string]: null
    }
    manga: {
      [key: string]: null
    }
    novels: []
    mangaSeries: []
    novelSeries: []
    pickup: object
    bookmarkCount: object
    externalSiteWorksStatus: object
  }
}

// 画师列表页的列表数据，带 tag。一些不需要使用的数据就简化了
interface Type2ListDataHaveTag {
  error: boolean
  message: string
  body: {
    works: {
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
      bookmarkData: null | {
        id: string
        private: boolean
      }
    }[]
    total: number
    zoneConfig: {
      [key: string]: {
        [key: string]: string
      }
    }
    extraData: {
      meta: {
        [key: string]: {
          [key: string]: string
        }
      }
    }
  }
}

// 作品的数据
interface IllustData {
  error: boolean
  message: string
  body: {
    illustId: string
    illustTitle: string
    illustComment: string
    id: string
    title: string
    description: string
    illustType: number
    createDate: string
    uploadDate: string
    restrict: number
    xRestrict: number
    sl: number
    urls: {
      mini: string
      thumb: string
      small: string
      regular: string
      original: string
    }
    tags: {
      authorId: string
      isLocked: boolean
      tags: {
        tag: string
        locked: boolean
        deletable: boolean
        userId: string
        romaji: string
        translation?: {
          en: string
        }
        userName: string
      }[]
      writable: boolean
    }
    storableTags: string[]
    userId: string
    userName: string
    userAccount: string
    userIllusts: {
      [key: string]: null | {
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
        bookmarkData: null | {
          id: string
          private: boolean
        }
      }
    }
    likeData: boolean
    width: number
    height: number
    pageCount: number
    bookmarkCount: number
    likeCount: number
    commentCount: number
    responseCount: number
    viewCount: number
    isHowto: boolean
    isOriginal: boolean
    imageResponseOutData: []
    imageResponseData: []
    imageResponseCount: number
    pollData: null
    seriesNavData: null
    descriptionBoothId: null
    descriptionYoutubeId: null
    comicPromotion: null
    contestBanners: []
    isBookmarkable: boolean
    bookmarkData: {
      id: string
      private: boolean
    }
    contestData: null
    zoneConfig: {
      responsive: {
        url: string
      }
      '300x250': {
        url: string
      }
      '500x500': {
        url: string
      }
      header: {
        url: string
      }
      footer: {
        url: string
      }
      expandedFooter: {
        url: string
      }
      logo: {
        url: string
      }
    }
    extraData: {
      meta: {
        title: string
        description: string
        canonical: string
        alternateLanguages: []
        descriptionHeader: string
        ogp: {
          description: string
          image: string
          title: string
          type: string
        }
        twitter: {
          description: string
          image: string
          title: string
          card: string
        }
      }
    }
  }
}

// 作品信息的通用格式
interface WorksInfo {
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
  bookmarkData: null | {
    id: string
    private: boolean
  }
  alt: string
}

// 画师信息的数据
interface UserProfileTop {
  error: boolean
  message: string
  body: {
    illusts: {
      [key: string]: WorksInfo
    }
    manga: {
      [key: string]: WorksInfo
    }
    novels: []
    zoneConfig: {
      header: {
        url: string
      }
      footer: {
        url: string
      }
      logo: {
        url: string
      }
      '500x500': {
        url: string
      }
    }
    extraData: {
      meta: {
        title: string
        description: string
        canonical: string
        ogp: {
          description: string
          image: string
          title: string
          type: string
        }
        twitter: {
          description: string
          image: string
          title: string
          card: string
        }
      }
    }
  }
}

// xzTip 的参数
interface XzTipArg {
  type: number
  x: number
  y: number
}

// 表单
interface XzForm extends HTMLFormElement {
  setWantPage: HTMLInputElement
  setPNo: HTMLInputElement
  setWorkType0: HTMLInputElement
  setWorkType1: HTMLInputElement
  setWorkType2: HTMLInputElement
  ugoiraSaveAs: RadioNodeList
  setFavNum: HTMLInputElement
  setOnlyBmk: HTMLInputElement
  setWidth: HTMLInputElement
  setWidthAndOr: RadioNodeList
  setHeight: HTMLInputElement
  ratio: RadioNodeList
  userRatio: HTMLInputElement
  setTagNeed: HTMLInputElement
  setTagNotNeed: HTMLInputElement
  setQuietDownload: HTMLInputElement
  setThread: HTMLInputElement
  fileNameRule: HTMLInputElement
  pageInfoSelect: HTMLSelectElement
  fileNameSelect: HTMLSelectElement
  setTagNameToFileName: HTMLInputElement
  setDisplayCover: HTMLInputElement
}

// xzSetting
interface XzSetting {
  imgNumberPerWork: number
  notdownType: string
  ugoiraSaveAs: string
  needTag: string
  notNeedTag: string
  displayCover: boolean
  quietDownload: boolean
  downloadThread: number
  userSetName: string
  tagNameToFileName: boolean
  showOptions: boolean
  [key: string]: string| number | boolean
}

// 是否处于全屏状态
interface IsFullscreen {
  [key: string]: Element | null
}

// 前台向后台发送的任务信息
interface SendInfo {
  msg: string
  fileUrl: string
  fileName: string
  no: number
  thisIndex: number
  taskBatch: number
}

// 浏览器下载时每个任务的信息
interface DonwloadInfo {
  no: number
  url: string
  thisIndex: number
  tabId: number
}

// 所有任务的信息
interface DonwloadListData {
  [key: number]: DonwloadInfo | null
}

// 下载完成后返回的信息
interface DownloadedMsg {
  msg: string
  data: DonwloadInfo
  err?: string
}

// 书签页面下方推荐作品的格式
interface Recommendations {
  recommendations: number[]
}

// 排行榜 api 返回的数据
interface Rank {
  contents: {
    title: string
    date: string
    tags: string[]
    url: string
    illust_type: string
    illust_book_style: string
    illust_page_count: string
    user_name: string
    profile_img: string
    illust_content_type: {
      sexual: number
      lo: boolean
      grotesque: boolean
      violent: boolean
      homosexual: boolean
      drug: boolean
      thoughts: boolean
      antisocial: boolean
      religion: boolean
      original: boolean
      furry: boolean
      bl: boolean
      yuri: boolean
    }
    illust_series: boolean
    illust_id: number
    width: number
    height: number
    user_id: number
    rank: number
    yes_rank: number
    rating_count: number
    view_count: number
    illust_upload_timestamp: number
    attr: string
    is_bookmarked: boolean
    bookmarkable: boolean
  }[]
  mode: string
  content: string
  page: number
  prev: boolean
  next: number
  date: string
  prev_date: string
  next_date: boolean
  rank_total: number
}

// 储存作品在排行榜中的排名
interface RankList {
  [key: string]: string
}
