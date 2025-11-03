// 声明 Pixiv API 返回的数据格式

// 插画、漫画的详细数据（在作品页内使用的）
export interface ArtworkData {
  error: boolean
  message: string
  body: {
    /**是否为 AI 生成。0 未知 1 否 2 是 */
    aiType: 0 | 1 | 2
    /**作品 id */
    illustId: string
    /**作品标题*/
    illustTitle: string
    /**作品简介*/
    illustComment: string
    /**作品 id */
    id: string
    /**作品标题*/
    title: string
    /**作品简介*/
    description: string
    /**作品类型
     *
     * 0 插画
     *
     * 1 漫画
     *
     * 2 动图
     */
    illustType: 0 | 1 | 2
    /**作品的创建日期*/
    createDate: string
    /**作品主体内容最后一次上传（修改）的日期*/
    uploadDate: string
    /**作品的公开范围
     *
     * 0 公开
     *
     * 1 仅好P友可见
     *
     * 2 不公开
     */
    restrict: 0 | 1 | 2
    /**作品的年龄限制
     *
     * 0 全年龄（普通）
     *
     * 1 R-18
     *
     * 2 R-18G
     */
    xRestrict: 0 | 1 | 2
    /**作品的色情指数（程度）*/
    sl: 0 | 2 | 4 | 6
    /**作品的第一张图片（或压缩包）的 URL*/
    urls: {
      /**48px 的最小尺寸的小图 */
      mini: string
      /**250px 的缩略图 */
      thumb: string
      /**540px 的缩略图 */
      small: string
      /**1200px 的预览图 */
      regular: string
      /**原图 */
      original: string
    }
    /**作品的标签数据 */
    tags: {
      /**作者的用户 id */
      authorId: string
      /**作者是否设置了“不允许其他用户编辑标签” */
      isLocked: boolean
      /**作品的标签列表 */
      tags: {
        /**标签名字 */
        tag: string
        /**这个标签是否被锁定（被锁定的就不能修改） */
        locked: boolean
        /**当前用户（浏览者）是否可以删除这个标签*/
        deletable: boolean
        /**作者的用户 id */
        userId: string
        /**罗马音，现在这个字段或许已经被移除了 */
        romaji?: string
        /**这个标签的翻译 */
        translation?: {
          /**翻译后的文字。
           * 
           * 注意翻译后的文字并不总是英文。
           * 
           根据用户设置的 pixiv 页面语言的不同（如中文、日文、韩语、英文等），en 会返回对应语言的翻译。

           所以用户语言不同时，en 可能不同。

           也可能同一个标签在某些语言时会有 translation 字段，另一些语言时没有 translation 字段。
           */
          en: string
        }
        /**作者的用户名 */
        userName: string
      }[]
      /**当前用户（浏览者）是否可以编辑这个作品的标签。未登录时总是不能编辑 */
      writable: boolean
    }
    /**作品的描述文字。当进入作品页面后会作为页面标题 */
    alt: string
    /**不清楚 */
    storableTags: string[]
    /**作者的用户 id */
    userId: string
    /**作者的用户名 */
    userName: string
    /**作者的账户名（登录时使用的账户名） */
    userAccount: string
    /**作者的所有图像作品的 id 列表 */
    userIllusts: {
      /**其中大部分作品的数据是 null
       *
       * 只有最多 3 个作品有精简的数据，这是在作品页面内显示在作品大图右侧的 3 个作品
       */
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
    /**你是否给这个作品点赞过 */
    likeData: boolean
    /**作品里第一张图片的宽度 */
    width: number
    /**作品里第一张图片的高度 */
    height: number
    /**总共有几张图片（分 p） */
    pageCount: number
    /**这个作品的收藏数量 */
    bookmarkCount: number
    /**这个作品的点赞数量 */
    likeCount: number
    /**这个作品的评论数量 */
    commentCount: number
    /**这个作品的响应关联作品的数量 */
    responseCount: number
    /**这个作品的浏览量 */
    viewCount: number
    /**读书模式
     *
     * 0 不设置
     *
     * 1 右开(←)
     *
     * 2 左开(→)
     */
    bookStyle: 0 | 1 | 2
    /**不清楚 */
    isHowto: boolean
    /**是否为原创作品 */
    isOriginal: boolean
    /**推测为响应关联作品的数据，但是具体尚不清楚 */
    imageResponseOutData: []
    imageResponseData: []
    imageResponseCount: number
    /**投票数据。大部分作品没有投票所以为 null */
    pollData: null | {
      /**投票的标题 */
      question: string
      choices: {
        /**选项序号，从 1 开始 */
        id: number
        /**选项文字 */
        text: string
        /**选择此选项的人数 */
        count: number
      }[]
      /**你选择的值 */
      selectedValue: null
      /**一共有多少人参与投票 */
      total: 0
    }
    /**系列导航数据
     *
     * 当这个作品属于一个系列时才有值，否则为 null
     */
    seriesNavData: null | {
      /**系列类型*/
      seriesType: 'manga' | string
      /**系列 id */
      seriesId: string
      /**系列标题 */
      title: string
      /**这个作品在系列里的序号。从 1 开始*/
      order: number
      /**当前用户是否把这个系列添加到了追更列表 */
      isWatched: false
      /**当前用户是否对这个系列开启了系列更新通知 */
      isNotifying: false
      /**系列中下一个作品的信息
       *
       * 如果这个作品是系列中的最后一个作品，则没有 next 字段
       */
      next?: {
        title: string
        order: number
        id: string
      }
      /**系列中上一个作品的信息
       *
       * 如果这个作品是系列中的第一个作品，则没有 prev 字段
       */
      prev?: {
        title: string
        order: number
        id: string
      }
    }
    descriptionBoothId: null
    descriptionYoutubeId: null
    comicPromotion: null
    fanboxPromotion: null
    contestBanners: []
    /**当前用户是否可以将这个作品添加到收藏 */
    isBookmarkable: boolean
    /**当前用户对此作品的收藏数据
     *
     * 如果未收藏则是 null
     */
    bookmarkData: null | {
      /**收藏的 id。是一个数字字符串 */
      id: string
      /**是否为私密（非公开）收藏 */
      private: boolean
    }
    contestData: null
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
      relatedworks: {
        url: string
      }
    }
    extraData: extraDataCommon
    titleCaptionTranslation: {
      workTitle: null | string
      workCaption: null | string
    }
    /**这个作品是否未列出
     *
     * 如果这个作品仅可由链接浏览，则是 true，这不会显示到作者的作品列表里。如：
     *
     * https://www.pixiv.net/artworks/unlisted/CbLRCId2sY3ZzQDqnQj6
     *
     * 大部分作品都是 false
     */
    isUnlisted: boolean
    /**这个作品的约稿数据
     *
     * 如果这个作品不是根据约稿创作的，则为 null
     *
     * 如果是根据约稿创作的，则包含约稿数据。
     *
     * 约稿数据的格式可以参阅 https://www.pixiv.net/ajax/illust/101342830
     */
    request: null | {}
    /**作者是否关闭了评论区
     *
     * 0 未关闭
     *
     * 1 关闭
     */
    commentOff: 0 | 1
  }
}

// 插画、漫画的通用数据
export interface ArtworkCommonData {
  /**是否为 AI 生成。0 未知 1 否 2 是 */
  aiType: 0 | 1 | 2
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
  /**如果为 true，就是已删除或不公开作品 */
  isMasked: boolean
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
              'illust_by_illust_table_mf_tda',
            ]
        score: number
        seedIllustIds: string[]
      }
    }
  }
}

export interface RankingImageWorkData {
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
    },
  ]
  mode: string
  content: string
  page: number
  prev: boolean
  /** 下一页的页码。如果这就是最后一页，则 next 为 false */
  // 这与小说排行榜里的 next 有所不同，小说排行榜里没有下一页时，值是 null 而不是 false
  // 为了防止 pixiv 混用这些 falsy 值，在判断“没有下一页时”我直接使用 !next 取反，而不使用全等符号 ===
  next: number | false
  date: string
  prev_date: string
  next_date: boolean
  rank_total: number
}

export interface RankingNovelData {
  error: boolean
  body: {
    display_a: DisplayA
    /**如果这个排行榜的数据是一定天数范围（如周榜或月榜），则会有 start 和 end */
    // 具体有这些排行榜：本周、本月、新人、原创、AI生成
    start: string | null
    end: string | null
    /** 如果这个排行榜的数据是某一天的（而非一周），则会有 date，值如 "2025年11月1日"*/
    // 具体有这些排行榜：今日、受男性欢迎、受女性欢迎
    date: string | null
    /** 排行榜的名字，例如 "[pixiv] 小说 今日排行榜"，但并未在网页中使用 */
    h_title: string
    zoneConfig: ZoneConfig
  }
  /**只有出现错误时才会有 message，正常时没有 */
  message?: '不在排行榜统计范围内'
}

interface DisplayA {
  /**储存排行榜里每篇小说的摘要数据。注意：不包含正文内容。
   * 目前在有些排行榜里返回的是数组，有些排行榜（新人）里返回的是类数组对象（但没有 length 属性）
   */
  rank_a: NovelItem[] | { number: NovelItem }
  /**这个排行榜的标记，例如 "daily"、"weekly" */
  mode: string
  /**也许是被屏蔽的作品的数量，通常为 0 */
  muted_count: number
  /**第几页。值为 1 或 2 */
  page: number
  /**设置网页标题，以及 head 里的一些标签 */
  title: string
  /**储存每个页码及其排名范围的描述。在新版页面里应该是用不到了 */
  page_a: { 1: '1-50位'; 2: '51-100位' }
  /** 上一页的页码。如果这就是第一页，则 prev 为 null */
  prev: number | null
  /** 下一页的页码。如果这就是最后一页，则 next 为 null */
  next: number | null
  /**返回数据里的日期的上一天，总是有值。值如 "20251031" */
  prev_date: string
  /**返回数据里的日期的第二天。如果日期是今天，则为 null。值如 "20251101" */
  next_date: string | null
  /**年龄限制？似乎总是 '2', 不管是全年龄还是 R-18，它的值都是 '2' */
  x_restrict: string
  /**是否为 R18 页面。在全年龄时为 false，R-18 时为 true */
  is_r18_page: boolean
  /**不清楚是什么作用，似乎总是 1 */
  header_bnr_ranking: number
  /**设置 head 里的一些标签，不用管 */
  meta_ogp: {
    description: string
    image: string
    title: string
  }
  /**分享到推特时使用的一些标语和图片 */
  twitter_card: TwitterCard
  /**包含了小说排行榜里每一种分类的 mode、name、url */
  ranking_header: RankingHeader
}

export interface NovelItem {
  /**这个小说在排行榜里的排名，如 '1'、'2'。根据排行榜不同，返回的数据类型也不同 */
  rank: string | number
  id: string
  title: string
  /**创建日期，值如 "2025-10-31 00:24" */
  create_date: string
  user_id: string
  user_name: string
  /**用户头像图片 */
  profile_img: string
  /**作品简介（完整版） */
  comment: string
  /**作品是否公开。'0' 是公开，'1' 是非公开  */
  restrict: '0' | '1'
  /**指示作品是全年龄的还是 R-18 */
  x_restrict: '0' | '1'
  /**似乎总是 '0' */
  is_original: '0'
  /**小说的语言，如 "zh-cn"、"ja" */
  language: string
  /**字数，就是在页面里显示的字数 */
  character_count: string
  /**词数？不知道用在什么地方 */
  word_count: string
  /**是否为 AI 生成。'0' 无标记（早期作品），'1' 不是，'2' 是 */
  ai_type: '0' | '1' | '2'
  /**tag 列表 */
  tag_a: string[]
  /**小说的封面图片 */
  url: string
  /**小说的系列 id。如果不属于某个系列，则为 0 */
  series_id: 0 | number
  /**小说的系列标题。如果不属于某个系列，则为 null */
  series_title: string | null
  /**小说的类别，'0' 为原创。似乎大部分都是 '0' */
  genre: string
  /**阅读时间，单位是秒。在页面上显示时会被转换成分钟 */
  reading_time: number
  /** 是否添加了进度标记（即在第几页打了标记）。如果没有添加过标记则是 null，否则就是标记所在的页数，如 1、2*/
  marker: null | number
  /**收藏数量 */
  bookmark_count: number
  /** 是否已收藏 */
  is_bookmarked: boolean
  /**是否可以收藏 */
  bookmarkable: boolean
  /**书签 ID。收藏之后才会有这个属性，值为字符串数字，如 "3336362557" */
  bookmark_id?: string
  /**是否公开收藏。收藏之后才会有这个属性，'0' 是公开收藏，'1' 是非公开收藏 */
  bookmark_restrict?: '0' | '1'
}

interface TwitterCard {
  card: string
  site: string
  description: string
  image: string
  title: string
}

interface RankingHeader {
  general: RankingMode[]
  r18: RankingMode[]
}

interface RankingMode {
  mode: string
  name: string
  url: string
}

interface ZoneConfig {
  header: {
    url: string
  }
  footer: {
    url: string
  }
  logo: {
    url: string
  }
  ad_logo: {
    url: string
  }
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
  /**是否为 AI 生成。0 未知 1 否 2 是 */
  aiType: 0 | 1 | 2
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
    /**是否为 AI 生成。0 未知 1 否 2 是 */
    aiType: 0 | 1 | 2
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

/**系列小说的数据，注意只是系列本身的数据，没有系列里每部小说的数据 */
export interface NovelSeriesData {
  error: boolean
  message: string
  body: {
    /** 系列小说的 ID */
    id: string
    userId: string
    userName: string
    /**作者头像 */
    profileImageUrl: 'https://i.pximg.net/user-profile/img/2024/07/05/01/22/56/26073083_0cfa3d438f22c593b62c3ee5e7f25c0a_170.png'
    xRestrict: 0 | 1 | 2
    isOriginal: boolean
    isConcluded: boolean
    /** 是 string 类型的数字，如 "0" | "1" | "2" | "3"。这个字段或许指的是系列标题上方的 tag 数量 */
    genreId: string
    /** 系列标题 */
    title: string
    /** 系列标题下方的简介（摘要）*/
    caption: string
    language: string
    tags: string[]
    /** 系列里的小说总数量 */
    publishedContentCount: number
    /** 所有小说的总字数 */
    publishedTotalCharacterCount: number
    /** 所有小说的总词数 */
    publishedTotalWordCount: number
    /** 所有小说的估计阅读总时间（每篇小说的阅读时间加起来）。页面上显示的阅读时间是分钟数，这个字段是秒数 */
    publishedReadingTime: number
    useWordCount: boolean
    /** 系列小说里最新一篇小说的发布时间（时间戳，没有毫秒部分） */
    lastPublishedContentTimestamp: number
    /** 系列小说的创建时间（时间戳，没有毫秒部分） */
    createdTimestamp: number
    /** 最后一次编辑（更新）系列内小说内容的时间（时间戳，没有毫秒部分） */
    updatedTimestamp: number
    /** 系列小说的创建时间（时间字符串） */
    createDate: string
    /** 最后一次编辑（更新）系列内小说内容的时间（时间字符串） */
    updateDate: string
    /** 系列里第一篇小说的 id */
    firstNovelId: string
    /** 系列里最后一篇小说的 id */
    latestNovelId: string
    /** 有多少篇小说可以显示，通常就是 publishedContentCount 的数量 */
    displaySeriesContentCount: number
    /** 分享时使用的文字 */
    shareText: string
    /** 系列里的小说总数量 */
    total: number
    /** 系列里第一篇小说的封面图片 */
    firstEpisode: {
      url: string
    }
    watchCount: null
    maxXRestrict: null
    /** 系列小说的封面图片（图片内容可能与第一篇小说的封面图片相同，也可能不同，具体要看作者是怎么上传的） */
    cover: {
      urls: {
        '240mw': string
        '480mw': string
        '1200x1200': string
        '128x128': string
        original: string
      }
    }
    coverSettingData: null
    isWatched: boolean
    isNotifying: boolean
    /**是否为 AI 生成。0 未知 1 否 2 是 */
    aiType: 0 | 1 | 2
    /** 是否有设定资料 */
    hasGlossary: boolean
    extraData: {
      meta: {
        /** 这个系列小说的网页标题（包含系列标题和作者等信息） */
        title: string
        /** 系列内第一篇小说的简介 */
        description: string
        /** 这个系列小说的网址 */
        canonical: string
        /** 分享到不知道地方时使用的数据 */
        ogp: {
          type: 'article'
          /** 这个系列小说的网页标题（包含系列标题和作者等信息） */
          title: string
          /** 系列内第一篇小说的简介 */
          description: string
          /** 一张分享用的图片，上面是两栏文字：左边是系列标题，右边是第一篇小说的简介 */
          image: string
        }
        /** 分享到推特时使用的数据 */
        twitter: {
          card: 'summary_large_image'
          site: '@pixiv'
          /** 系列标题 */
          title: string
          /** 系列内第一篇小说的简介 */
          description: string
          /** 一张分享用的图片，上面是两栏文字：左边是系列标题，右边是第一篇小说的简介 */
          image: string
        }
      }
    }
    zoneConfig: {
      responsive: {
        url: string
      }
      rectangle: {
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
      ad_logo: {
        url: string
      }
    }
  }
}

/** 系列小说里每部小说的详细数据（但是没有小说正文内容） */
export interface NovelSeriesContentData {
  error: boolean
  message: string
  body: {
    page: {
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
}

/**获取小说里插入（引用）的插画图片的数据。相比获取这个插画的全部数据，这里返回的数据要少一些，而且更有针对性 */
// 示例网址：
// https://www.pixiv.net/ajax/novel/22894530/insert_illusts?id%5B%5D=121979454-1
export interface NovelInsertIllusts {
  error: boolean
  message: string
  body: {
    /**illustID 是插画 ID 附带序号（从 1 开始），如 121979454-1 */
    [illustID: string]: {
      visible: boolean
      unavailableType: null

      // 当插画被删除或隐藏后，illust 和 user 是 null
      illust: {
        title: string
        description: string
        restrict: 0 | 1 | 2
        xRestrict: 0 | 1 | 2
        sl: 0 | 2 | 4 | 6
        tags: {
          tag: string
          userId: string
        }[]
        // 这个 API 会根据序号返回对应图片的 URL，而非总是返回第一张图片的 URL
        // 如果指定了序号，那么 Pixiv 会返回对应序号的图片 URL
        images: {
          /**小尺寸的图片网址 square1200 */
          small: string
          /**中等尺寸的图片网址 master1200 */
          medium: string
          /**原图网址 */
          original: string
        }
      } | null

      user: {
        id: string
        name: string
        image: string
      } | null

      // 当插画被删除或隐藏后，没有 id 和 page 属性
      /**插画的 id，如 121979454 */
      id?: string
      /**插画的页数 */
      page?: number
    }
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
    /**页面标题 */
    title: string
    /**作品简介，但是前面会附加一些由 Pixiv 添加的说明 */
    description: string
    /**作品的页面 URL */
    canonical: string
    /**不同语言所对应的这个作品的页面 URL
     *
     * en 英语时在路径中有 en/
     *
     * 其他语言与 ja 相同，没有这层路径
     */
    alternateLanguages: {
      ja: string
      en: string
    }
    /**Pixiv 添加的说明，如：本作「原神 多莉 mod」为附有「R-18」「动图」等标签的插画。 */
    descriptionHeader: string
    ogp: {
      /**作品原本的简介文本 */
      description: string
      /**一个 URL
       *
       * 可能是 Pixiv 的 logo 图片 URL，如 https://s.pximg.net/www/images/pixiv_logo.png
       *
       * 也可能是包含这个作品的其他链接，如 https://embed.pixiv.net/artwork.php?illust_id=99381250
       *  */
      image: string
      /**页面标题 */
      title: string
      /**不清楚指的是什么类型，指基本都是 "article" */
      type: string
    }
    twitter: {
      /**作品原本的简介文本 */
      description: string
      image: string
      /**作品标题。对于非全年龄作品，Pixiv 可能会在前面加上 [R18] 字符 */
      title: string
      card: 'summary' | 'summary_large_image' | string
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
      },
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
      },
    ]
    /**获取后续消息的 URL，如果没有后续消息，则为 null */
    next_url: string | null
  }
}
