// 声明 Pixiv API 返回的数据格式

// 插画、漫画的详细数据（在作品页内使用的）
export interface ArtworkData {
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
    /**公开范围
     *
     * 0 公开
     *
     * 1 仅好P友可见
     *
     * 2 不公开
     */
    restrict: 0 | 1 | 2
    xRestrict: 0 | 1 | 2
    sl: 0 | 2 | 4 | 6
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
        id: string
        title: string
        illustType: number
        xRestrict: 0 | 1 | 2
        restrict: 0 | 1 | 2
        sl: 0 | 2 | 4 | 6
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
    seriesNavData: null | {
      seriesType: string
      seriesId: string
      title: string
      order: number
      next: {
        title: string
        order: number
        id: string
      } | null
      prev: {
        title: string
        order: number
        id: string
      } | null
    }
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
    extraData: extraDataCommon
  }
}

// 插画、漫画的通用数据
export interface ArtworkCommonData {
  id: string
  title: string
  illustType: 0 | 1 | 2
  xRestrict: 0 | 1 | 2
  restrict: 0 | 1 | 2
  sl: 0 | 2 | 4 | 6
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
  titleCaptionTranslation: {
    workTitle: string
    workCaption: string
  }
  createDate: string
  updateDate: string
  isUnlisted: boolean
  profileImageUrl: string
}

// 画师信息的数据 user/id/profile/Top
export interface UserProfileTop {
  error: boolean
  message: string
  body: {
    illusts: {
      [key: string]: ArtworkCommonData[]
    }
    manga: {
      [key: string]: ArtworkCommonData[]
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

interface UserCommonData {
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
}

// 画师账户信息 user/id?full=1
export interface UserProfile {
  error: boolean
  message: '' | string
  body: UserCommonData & {
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
  tags: string[]
  restrict: boolean
  type?: 'illusts' | 'novels'
}

// 动图元数据
export interface UgoiraMetaBody {
  /**原图尺寸
   *
   * ugoira1920x1080.zip
   */
  originalSrc: string
  /**较小的尺寸
   *
   * ugoira600x600.zip
   */
  src: string
  /**"image/jpeg"
   *
   * 或许还有其他类型
   */
  mime_type: string
  /**{
    "file": "000000.jpg",
    "delay": 60
  } */
  frames: { file: string; delay: number }[]
}

export interface UgoiraMetaData {
  error: boolean
  message: string
  body: UgoiraMetaBody
}

export type BookMarkNewIllustData = ArtworkCommonData & {
  urls: {
    '250x250': string
    '360x360': string
    '540x540': string
  }
  isMasked: boolean
}

export type BookMarkNewNovelData = NovelCommonData & {
  isMasked: boolean
}

// 关注的用户的新作品的数据
export interface BookMarkNewData {
  error: boolean
  message: string | ''
  body: {
    page: {
      /**这一批数据里所有作品的 id 集合 */
      ids: string[]
      tags: []
    }
    /**这一批数据里所有作品的 tag 集合。如果请求的是小说则是空集合 */
    tagTranslation: {
      [key: string]: {
        en?: string | ''
        ko?: string | ''
        zh?: string | ''
        zh_tw?: string | ''
        romaji: string | ''
      }
    }
    thumbnails: {
      /**插画·漫画作品的数据集合 */
      illust: BookMarkNewIllustData[]
      /**小说作品的数据集合 */
      novel: BookMarkNewNovelData[]
      novelSeries: []
      novelDraft: []
    }
    illustSeries: []
    requests: []
    users: []
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
    }
  }
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
    works: ArtworkCommonData[] | NovelCommonData[]
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
    illusts: ArtworkCommonData[]
    nextIds: string[]
    details: {
      [key: string]: {
        methods:
          | ['illust_by_illust_table_bq_recommendation_c']
          | ['illust_by_illust_table_mf_tda']
          | [
              'illust_by_illust_table_bq_recommendation_c',
              'illust_by_illust_table_mf_tda'
            ]
        score: number
        seedIllustIds: string[]
      }
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
      data: ArtworkCommonData[]
      total: number
    }
  >
}

// 搜索页的小说的数据格式，删除了 body 里没有使用的部分
export interface NovelSearchData {
  error: boolean
  body: {
    novel: {
      data: (NovelCommonData & {
        isUnlisted: boolean
        profileImageUrl: string
        createDate: string
        updateDate: string
      })[]
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
    illusts: ArtworkCommonData[]
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
    works: ArtworkCommonData[]
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
  bookmarkCount: number
  bookmarkData: null | {
    id: string
    private: boolean
  }
  createDate: string
  description: string
  id: string
  isBookmarkable: boolean
  isUnlisted: boolean
  isOriginal: boolean
  marker: null
  profileImageUrl: string
  /**公开范围
   *
   * 0 公开
   *
   * 1 仅好P友可见
   *
   * 2 不公开
   */
  restrict: 0 | 1 | 2
  tags: string[]
  textCount: number
  title: string
  titleCaptionTranslation: {
    workTitle: string | null
    workCaption: string | null
  }
  updateDate: string
  xRestrict: 0 | 1 | 2
  url: string
  userId: string
  userName: string
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
    bookmarkData: null | {
      id: string
      private: boolean
    }
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
    isUnlisted: boolean
    language: string
    xRestrict: 0 | 1 | 2
    restrict: 0 | 1 | 2
    content: string
    coverUrl: string
    suggestedSettings: {
      viewMode: number
      themeBackground: number
      themeSize: null
      themeSpacing: null
    }
    isBookmarkable: boolean
    likeData: boolean
    pollData: null
    request: null
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
    seriesNavData: null | {
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
      } | null
      prev: {
        title: string
        order: number
        id: string
        available: boolean
      } | null
    }
    descriptionBoothId: null
    descriptionYoutubeId: null
    comicPromotion: null
    fanboxPromotion: null
    contestBanners: []
    contestData: null | {
      icon: string
      title: string
      url: string
    }
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
    /**小说正文里嵌入的图片资源。如果小说里没有嵌入的图片则为 null */
    textEmbeddedImages: null | {
      /**key 就是 novelImageId，图片的 id（小说正文里的图片标记里的数字 [uploadedimage:12136542] */
      [key: string]: {
        novelImageId: string
        sl: '0' | '2' | '4' | '6'
        urls: {
          '240mw': string
          '480mw': string
          '1200x1200': string
          '128x128': string
          original: string
        }
      }
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
      restrict: 0 | 1 | 2
      xRestrict: 0 | 1 | 2
      isOriginal: boolean
      textLength: number
      bookmarkCount: number
      url: string
      uploadTimestamp: number
      reuploadTimestamp: number
      isBookmarkable: boolean
      bookmarkData: null | {
        id: string
        private: boolean
      }
    }[]
  }
}

// 获取关注列表时的返回数据
// 每个用户数据里附带他最新的 4 个作品的数据。这里面的作品分类没有 manga，manga 作品会被放到 illusts 里
export interface FollowingResponse {
  error: boolean
  message: string
  body: {
    users: {
      userId: string
      userName: string
      profileImageUrl: string
      userComment: string
      following: boolean
      followed: boolean
      isBlocking: boolean
      isMypixiv: boolean
      illusts: []
      novels: []
    }[]
    total: number
    followUserTags: string[]
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
    extraData: extraDataCommon
  }
}

interface extraDataCommon {
  meta: {
    title: string
    description: string
    canonical: string
    alternateLanguages: {
      ja: string
      en: string
    }
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

// 系列数据，这个接口的数据结构里同时有插画系列和小说系列，但是小说系列目前使用的是另一套 api，这个 api 里的小说数据不知道是什么样，目前只有空数组
export interface SeriesData {
  error: boolean
  message: string | ''
  body: {
    tagTranslation: {
      [key: string]: {
        en?: string | ''
        ko?: string | ''
        zh?: string | ''
        zh_tw?: string | ''
        romaji: string | ''
      }
    }
    thumbnails: {
      illust: (ArtworkCommonData & {
        urls: {
          '250x250': string
          '360x360': string
          '540x540': string
        }
        seriesId: string
        seriesTitle: string
      })[]
      novel: []
    }
    illustSeries: [
      {
        id: string
        userId: string
        title: string
        description: string
        total: string
        url: string
        coverImageSl: number
        firstIllustId: string
        updateDate: string
      }
    ]
    novelSeries: []
    users: UserCommonData[]
    page: {
      series: {
        workId: string
        order: number
      }[]
      isSetCover: boolean
      seriesId: number
      otherSeriesId: string
      recentUpdatedWorkIds: number[]
      total: number
    }
    extraData: {
      meta: {
        title: string
        description: string | ''
      }
    }
    zoneConfig: {
      header: {
        url: string
      }
      footer: {
        url: string
      }
      responsive: {
        url: string
      }
      rectangle: {
        url: string
      }
    }
  }
}

interface muteItemUser {
  type: 'user'
  value: string
  label: string
  iconUrl: string
  enabled: boolean
  isMuted: boolean
  listType: 'existing' | 'candidate'
}

interface muteItemTag {
  type: 'tag'
  value: string
  label: string
  iconUrl: null
  enabled: boolean
  isMuted: boolean
  listType: 'existing' | 'candidate'
}

// 获取屏蔽的项目时返回的数据格式
export interface muteData {
  error: boolean
  message: string
  body: {
    mute_items: muteItemUser[] | muteItemTag[]
  }
}

type GlossaryCover = null | {
  novelImageId: string
  sl: string
  urls: {
    '240mw': string
    '480mw': string
    '1200x1200': string
    '128x128': string
    original: string
  }
}

export interface GlossaryItem {
  id: string
  seriesId: string
  categoryId: string
  name: string
  overview: string
  coverImage: GlossaryCover
  /**这条设定的详细说明，如果未设置，则为空字符串 */
  detail: string | ''
}

export interface GlossaryCategorie {
  id: string
  seriesId: string
  name: string
  items: {
    id: string
    seriesId: string
    categoryId: string
    name: string
    overview: string
    coverImage: GlossaryCover
    /**这里并没有包含设定的详细说明，即始终为 null */
    detail: null
  }[]
}

export interface NovelSeriesGlossary {
  error: boolean
  message: string
  body: {
    categories: GlossaryCategorie[]
    replaceeItemIds: []
    extraData: {
      meta: {
        title: string
        description: string
        canonical: string
        ogp: {
          type: string
          title: string
          description: string
          image: string
        }
        twitter: {
          card: string
          site: string
          title: string
          description: string
          image: string
        }
      }
    }
    zoneConfig: {
      header: {
        url: string
      }
      footer: {
        url: string
      }
    }
  }
}

export interface NovelSeriesGlossaryItem {
  error: boolean
  message: string
  body: {
    item: GlossaryItem
    extraData: {
      meta: {
        title: string
        description: string
        canonical: string
        ogp: {
          type: string
          title: string
          description: string
          image: string
        }
        twitter: {
          card: string
          site: string
          title: string
          description: string
          image: string
        }
      }
    }
    zoneConfig: {
      header: {
        url: string
      }
      footer: {
        url: string
      }
    }
  }
}

export interface LatestMessageData {
  error: boolean
  message: '' | string
  body: {
    /**本次返回的数据里的消息总数。不是历史消息总数。可能为 0 */
    total: number
    /**消息列表数组，如果没有消息则是空数组 */
    message_threads: [
      {
        /**消息 id */
        thread_id: string
        /**修改时间
         *
         * 值如 "1657999204"，这不是有效的时间戳，需要在后面加上 3 个 0 再解析
         */
        modified_at: string
        unread_num: string
        member_num: string
        /**这个对话里的最后一条消息的内容 */
        latest_content: string
        is_pair: boolean
        thread_name: string
        icon_url: {
          '100x100': string
        }
        followed: boolean
        is_official: boolean
        is_mendako: boolean
        is_active_thread: boolean
        is_fanbox_subscriber: boolean
      }
    ]
    /**获取后续消息的 URL，如果没有后续消息，则为 null */
    next_url: string | null
  }
}
