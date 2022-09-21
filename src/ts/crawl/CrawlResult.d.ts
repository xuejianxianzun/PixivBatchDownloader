// 声明 Pixiv API 返回的数据格式

// 插画、漫画的详细数据（在作品页内使用的）
export interface ArtworkData {
  error: boolean
  message: string
  body: {
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
