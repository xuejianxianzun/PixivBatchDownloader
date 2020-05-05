// 声明 Pixiv API 返回的数据格式

// 作品的数据
export interface IllustData {
  error: boolean
  message: string
  body: {
    illustId: string
    illustTitle: string
    illustComment: string
    id: string
    title: string
    description: string
    illustType: 0 | 1 | 2
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
    bookmarkData: null | {
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
export interface WorksInfo {
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

// 画师信息的数据 user/id/profile/Top
export interface UserProfileTop {
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

// 画师账户信息 user/id?full=1
export interface UserProfile {
  error: boolean
  message: '' | string
  body: {
    userId: string
    name: string
    image: string
    imageBig: string
    premium: boolean
    isFollowed: boolean
    isMypixiv: boolean
    isBlocking: boolean
    background: null | {
      repeat: null
      color: null
      url: string
      isPrivate: boolean
    }
    partial: number
    following: number
    followedBack: boolean
    comment: string
    commentHtml: string
    webpage: null | string
    social: null | {
      twitter?: {
        url: string
      }
      facebook?: {
        url: string
      }
      pawoo?: {
        url: string
      }
    }
    region: {
      name: null | string
      privacyLevel: null | string
    }
    birthDay: {
      name: null | string
      privacyLevel: null | string
    }
    gender: {
      name: null | string
      privacyLevel: null | string
    }
    job: {
      name: null | string
      privacyLevel: null | string
    }
    workspace: null | {
      userWorkspaceMonitor?: string
      userWorkspaceTool?: string
      userWorkspaceScanner?: string
      userWorkspaceTablet?: string
      userWorkspaceMouse?: string
      userWorkspacePrinter?: string
      userWorkspaceDesktop?: string
    }
    official: boolean
    group:
      | null
      | {
          id: string
          title: string
          iconUrl: string
        }[]
  }
}

// 动图每一帧的文件名和延迟
export interface UgoiraInfo {
  mime_type: string
  frames: { file: string; delay: number }[]
}

// 从未分类书签中取出一些需要的数据
export interface BookmarkResult {
  id: string
  tags: string
  restrict: boolean
}

// 动图信息
export interface UgoiraData {
  error: boolean
  message: string
  body: {
    originalSrc: string
    src: string
    mime_type: string
    frames: { file: string; delay: number }[]
  }
}

// 获取书签的数据里，图片作品的数据
export interface BookmarkArtworkData {
  illustId: string
  illustTitle: string
  id: string
  title: string
  illustType: 0 | 1 | 2
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

// tag 搜索页里，作品信息的数据
export interface BookMarkNewData {
  bookmarkCount: number
  height: number
  illustId: string
  illustTitle: string
  illustType: '0' | '1' | '2'
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
export interface UserProfileAllData {
  error: boolean
  message: string
  body: {
    illusts:
      | []
      | {
          [key: string]: null
        }
    manga:
      | []
      | {
          [key: string]: null
        }
    novels:
      | []
      | {
          [key: string]: null
        }
    mangaSeries: [] | {}
    novelSeries: [] | {}
    pickup: object
    bookmarkCount: object
    externalSiteWorksStatus: object
  }
}

// 获取书签数据
export interface BookmarkData {
  error: boolean
  message: string
  body: {
    works: BookmarkArtworkData[]|NovelCommonData[]
    total: number
    zoneConfig: {
      '500x500': {
        url: string
      }
      header: {
        url: string
      }
      footer: {
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

// 获取作品下方的相关作品数据。只有 recommendMethods 里的 id 列表是完整的。最多有 180 个，但经常会少一些。
export interface RecommendData {
  error: false | true
  message: string
  body: {
    illusts: WorksInfo[]
    nextIds: string[]
    recommendMethods: {
      [key: string]: string
    }
  }
}

export interface RankingData {
  contents: [
    {
      title: string
      date: string
      tags: string[]
      url: string
      illust_type: '0' | '1' | '2'
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
    }
  ]
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

// 收藏后的相似作品数据
export interface RecommenderData {
  recommendations: number[]
}

// 搜索页的数据格式，删除了 body 里没有使用的部分
export interface SearchData {
  error: boolean
  body: Record<
    'illustManga' | 'manga' | 'illust',
    {
      data: {
        illustId: string
        illustTitle: string
        id: string
        title: string
        illustType: 0 | 1 | 2
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
        isAdContainer: boolean
        profileImageUrl: string
      }[]
      total: number
    }
  >
}

// 搜索页的小说的数据格式，删除了 body 里没有使用的部分
export interface NovelSearchData {
  error: boolean
  body: {
    novel: {
      data: NovelCommonData[]
      total: number
    }
  }
}

// 大家的新作小说的数据格式
export interface NewNovelData {
  error: boolean
  message: ''
  body: {
    novels: NovelCommonData[]
    lastId: string
    zoneConfig: {
      header: string
      logo: string
    }
    extraData: {
      meta: {
        title: string
        description: string
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

// 大家的新作品的数据格式
export interface NewIllustData {
  error: boolean
  message: string
  body: {
    illusts: {
      illustId: string
      illustTitle: string
      id: string
      title: string
      illustType: 0 | 1 | 2
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
      isAdContainer: boolean
      profileImageUrl: string
      type: string
    }[]
    lastId: string
    zoneConfig: {
      header: {
        url: string
      }
      logo: {
        url: string
      }
    }
  }
}

// 画师列表页的列表数据，带 tag。一些不需要使用的数据就简化了
export interface UserImageWorksWithTag {
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

export interface NovelCommonData {
  id: string
  title: string
  xRestrict: number
  restrict: number
  url: string
  tags: string[]
  userId: string
  userName: string
  textCount: number
  description: string
  isBookmarkable: boolean
  bookmarkData:
    | null
    | {
        id: string
        private: boolean
      }
  bookmarkCount: number
  isOriginal: boolean
  marker: null
  titleCaptionTranslation: {
    workTitle: string | null
    workCaption: string | null
  }
  seriesId?: string
  seriesTitle?: string
}

export interface UserNovelsWithTag {
  error: boolean
  message: string
  body: {
    works: NovelCommonData[]
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

// 请求单个小说时返回的数据
export interface NovelData {
  error: boolean
  message: string
  body: {
    bookmarkCount: number
    commentCount: number
    markerCount: number
    createDate: string
    uploadDate: string
    description: string
    id: string
    title: string
    likeCount: number
    pageCount: string
    userId: string
    userName: string
    viewCount: number
    isOriginal: boolean
    isBungei: boolean
    xRestrict: number
    restrict: number
    content: string
    coverUrl: string | null
    suggestedSettings: {
      viewMode: number
      themeBackground: number
      themeSize: null
      themeSpacing: null
    }
    isBookmarkable: boolean
    bookmarkData:
      | null
      | {
          id: string
          private: boolean
        }
    likeData: boolean
    pollData: null
    marker: null
    tags: {
      authorId: string
      isLocked: boolean
      tags: {
        tag: string
        locked: boolean
        deletable: boolean
        userId: string
        userName: string
      }[]
      writable: boolean
    }
    seriesNavData: {
      seriesType: string
      seriesId: string
      title: string
      isConcluded: boolean
      isReplaceable: boolean
      order: number
      next: {
        title: string
        order: number
        id: string
        available: boolean
      }
      prev: {
        title: string
        order: number
        id: string
        available: boolean
      }
    }
    descriptionBoothId: null
    descriptionYoutubeId: null
    comicPromotion: null
    fanboxPromotion: null
    contestBanners: []
    contestData: null
    imageResponseOutData: []
    imageResponseData: []
    imageResponseCount: number
    userNovels: {
      [key: string]: null | NovelCommonData
    }
    hasGlossary: boolean
    zoneConfig: {
      responsive: {
        url: string
      }
      rectangle: {
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
    titleCaptionTranslation: {
      workTitle: null
      workCaption: null
    }
  }
}

// 小说的系列信息
export interface NovelSeriesData {
  error: boolean
  message: string
  body: {
    seriesContents: {
      id: string
      userId: string
      series: {
        id: number
        viewableType: number
        contentOrder: number
      }
      title: string
      commentHtml: string
      tags: string[]
      restrict: number
      xRestrict: number
      isOriginal: boolean
      textLength: number
      bookmarkCount: number
      url: string
      uploadTimestamp: number
      reuploadTimestamp: number
      isBookmarkable: boolean
      bookmarkData:
        | null
        | {
            id: string
            private: boolean
          }
    }[]
  }
}
