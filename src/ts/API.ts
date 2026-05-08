import {
  UserImageWorksWithTag,
  BookmarkData,
  UserProfile,
  UserProfileAllData,
  ArtworkData,
  UgoiraMetaData,
  RecommendData,
  RankingImageWorkData,
  RecommenderData,
  SearchData,
  NewIllustData,
  BookMarkNewData,
  UserNovelsWithTag,
  NovelData,
  NovelSeriesData,
  NovelSearchData,
  NewNovelData,
  FollowingResponse,
  SeriesData,
  muteData,
  NovelSeriesGlossary,
  NovelSeriesGlossaryItem,
  LatestMessageData,
  NovelSeriesContentData,
  NovelInsertIllusts,
  RankingNovelData,
  DashboardData,
  ContestData,
} from './crawl/CrawlResult'

import {
  userWorksType,
  RankingOption,
  SearchOption,
  NewIllustOption,
  tagPageFlag,
} from './crawl/CrawlArgument'

import { IDData } from './store/StoreType'
import { Config } from './Config'
import { EVT } from './EVT'
import { ppdTask } from './PPDTask'
import { Utils } from './utils/Utils'

/** 点击 like 按钮时返回的数据 */
interface LikeResponse {
  error: boolean
  message: '' | string
  body:
    | []
    | {
        is_liked: boolean
      }
}

let mockHttpStatus = null as null | number

ppdTask.register(200, 'mock http status unset', () => {
  mockHttpStatus = null
})
ppdTask.register(429, 'mock http status 429', () => {
  mockHttpStatus = 429
})
ppdTask.register(502, 'mock http status 502', () => {
  mockHttpStatus = 502
})

class API {
  /** API 里的所有请求都从这里转发，以简化代码，并方便统一处理错误。
   *
   * 429、502 错误会自动重试。
   *
   * 如果状态码异常并且重试失败，会通过 throw 抛出 Error */
  static async fetch<T>(
    url: string,
    init?: RequestInit,
    format: 'json' | 'blob' | 'text' = 'json'
  ): Promise<T> {
    // 默认发送 get 请求
    init = init || {
      method: 'get',
      credentials: 'same-origin',
    }
    const attemptRequest = async (tryCount = 0): Promise<T> => {
      const response = await fetch(url, init)
      // response.ok 的状态码范围是 200-299
      if (response.ok && !mockHttpStatus) {
        // 请求成功，直接返回数据
        const data = await response[format]()
        return data as T
      } else {
        // 请求成功但状态码异常
        // 或者启用了 mockHttpStatus 模拟错误
        let status = response.status
        if (mockHttpStatus) {
          status = mockHttpStatus
          console.log(`Mocked http status ${status}`)
        }

        // 每次状态码异常（不管是否会重试）都会传递错误信息，显示在日志上
        EVT.fire('requestStatusError', {
          status,
          url,
        })

        // 对于 429 状态码，无限次重试，直到成功或者出现其他错误
        // 在其他模块里调用 API 时，不需要自行处理 429 错误
        // 以前隔 200 秒重试经常可以成功，但现在时间似乎有所增加，而且不同的账号也不一样。
        // 有些账号需要重试 2、3 次，但有些账号（近期抓取和下载了大量文件）可能要重试 6 次（即等待 20 分钟）才能成功
        if (status === 429) {
          // 等待一段时间后，通过尾递归重试请求
          // console.log(`429 tryCount ${tryCount}`)
          await Utils.sleep(Config.retryTime)
          return await attemptRequest(tryCount + 1)
        } else if (status === 502 && tryCount < 3) {
          // 现在偶尔会遇到 502 错误，通常可以很快重试成功，所以等待 10 秒后重试
          // 最多重试 3 次，所以同一个 URL 最多会发送 4 次请求
          console.log(`502 tryCount ${tryCount}`)
          await Utils.sleep(10000)
          return await attemptRequest(tryCount + 1)
        } else {
          // 对于其他状态码，以及重试超出最大次数的，不再重试，而是通过 throw 抛出错误
          throw {
            status: status,
            statusText: response.statusText,
          }
        }
      }
    }

    return attemptRequest()
  }

  /** 获取收藏数据
   * 这个 api 返回的作品列表顺序是按收藏顺序由近期到早期排列的 */
  static async getBookmarkData(
    userID: string,
    type: 'illusts' | 'novels' = 'illusts',
    tag: string,
    offset: number,
    hide: boolean = false
  ): Promise<BookmarkData> {
    const url = `https://www.pixiv.net/ajax/user/${userID}/${type}/bookmarks?tag=${tag}&offset=${offset}&limit=100&rest=${
      hide ? 'hide' : 'show'
    }&rdm=${Math.random()}`

    return this.fetch(url)
  }

  /** 添加收藏 */
  static async addBookmark(
    id: string,
    type: 'illusts' | 'novels',
    tags: string[],
    hide: boolean,
    token: string
  ) {
    const restrict: 1 | 0 = hide ? 1 : 0

    let body = {}
    if (type === 'illusts') {
      body = {
        comment: '',
        illust_id: id,
        restrict: restrict,
        tags: tags,
      }
    } else {
      body = {
        comment: '',
        novel_id: id,
        restrict: restrict,
        tags: tags,
      }
    }

    const url = `https://www.pixiv.net/ajax/${type}/bookmarks/add`
    const init: RequestInit = {
      method: 'POST',
      credentials: 'same-origin', // 附带 cookie
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'x-csrf-token': token,
      },
      body: JSON.stringify(body),
    }
    return this.fetch(url, init)
  }

  static async deleteBookmark(
    bookmarkID: number | string,
    type: 'illusts' | 'novels',
    token: string
  ) {
    const bodyStr =
      type === 'illusts'
        ? `bookmark_id=${bookmarkID}`
        : `del=1&book_id=${bookmarkID}`

    const url = `https://www.pixiv.net/ajax/${type}/bookmarks/delete`
    const init: RequestInit = {
      method: 'POST',
      credentials: 'same-origin', // 附带 cookie
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'x-csrf-token': token,
      },
      body: bodyStr,
    }
    return this.fetch(url, init)
  }

  /** 获取关注的用户列表 */
  static getFollowingList(
    id: string,
    rest: 'show' | 'hide' = 'show',
    tag = '',
    offset = 0,
    limit = 100,
    lang = 'zh'
  ): Promise<FollowingResponse> {
    const url = `https://www.pixiv.net/ajax/user/${id}/following?offset=${offset}&limit=${limit}&rest=${rest}&tag=${tag}&lang=${lang}`
    return this.fetch(url)
  }

  /** 获取好 P 友列表 */
  static getMyPixivList(
    id: string,
    offset = 0,
    limit = 100,
    lang = 'zh'
  ): Promise<FollowingResponse> {
    const url = `https://www.pixiv.net/ajax/user/${id}/mypixiv?offset=${offset}&limit=${limit}&lang=${lang}`
    return this.fetch(url)
  }

  /** 获取粉丝列表 */
  static getFollowersList(
    id: string,
    offset = 0,
    limit = 100,
    lang = 'zh'
  ): Promise<FollowingResponse> {
    const url = `https://www.pixiv.net/ajax/user/${id}/followers?offset=${offset}&limit=${limit}&lang=${lang}`
    return this.fetch(url)
  }

  /** 获取用户信息 */
  static getUserProfile(
    id: string,
    full: '0' | '1' = '1'
  ): Promise<UserProfile> {
    // full=1 在画师的作品列表页使用，获取详细信息
    // full=0 在作品页内使用，只获取少量信息
    const url = `https://www.pixiv.net/ajax/user/${id}?full=${full}`
    return this.fetch(url)
  }

  /** 获取某个用户特定类型下的作品 id 列表
   * 这个 API 里只包含了作品的部分数据，不是完整的数据 */
  static async getUserWorksByType(
    id: string,
    type: userWorksType[] = ['illusts', 'manga', 'novels']
  ): Promise<IDData[]> {
    let typeSet = new Set(type)
    let result: IDData[] = []
    const url = `https://www.pixiv.net/ajax/user/${id}/profile/all`

    try {
      const data: UserProfileAllData = await this.fetch(url)
      for (const type of typeSet.values()) {
        const idList = Object.keys(data.body[type])
        for (const id of idList) {
          result.push({
            type,
            id,
          })
        }
      }
    } catch (error) {
      // 如果请求出错，会返回空数组，而不是抛出错误
      return result
    }

    return result
  }

  /** 获取某个用户指定类型里，特定 tag 的作品列表
   * 返回整个请求的结果，里面包含作品的详细信息
   * 必须带 tag 使用。不带 tag 虽然也能获得数据，但是获得的并不全，很奇怪。 */
  static getUserWorksByTypeWithTag(
    id: string,
    type: tagPageFlag,
    tag: string,
    offset: number = 0,
    limit: number = 100
  ): Promise<UserImageWorksWithTag | UserNovelsWithTag> {
    // https://www.pixiv.net/ajax/user/2369321/illusts/tag?tag=Fate/GrandOrder&offset=0&limit=100
    const url = `https://www.pixiv.net/ajax/user/${id}/${type}/tag?tag=${tag}&offset=${offset}&limit=${limit}`
    return this.fetch(url)
  }

  /** 获取插画 漫画 动图 的详细信息
   * 额外添加了时间戳，以避免在短时间内获取同一作品数据时，浏览器直接使用缓存的数据 */
  static getArtworkData(id: string, unlisted = false): Promise<ArtworkData> {
    const url = `https://www.pixiv.net/ajax/illust/${
      unlisted ? 'unlisted/' : ''
    }${id}?time=${Date.now()}`
    return this.fetch(url)
  }

  /** 获取动图的元数据 */
  static getUgoiraMeta(id: string): Promise<UgoiraMetaData> {
    const url = `https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`
    return this.fetch(url)
  }

  /** 获取小说的详细信息
   * 额外添加了时间戳，以避免在短时间内获取同一作品数据时，浏览器直接使用缓存的数据 */
  static getNovelData(id: string, unlisted = false): Promise<NovelData> {
    const url = `https://www.pixiv.net/ajax/novel/${
      unlisted ? 'unlisted/' : ''
    }${id}?time=${Date.now()}`
    return this.fetch(url)
  }

  /** 获取相关作品 */
  static getRelatedData(id: string): Promise<RecommendData> {
    // 最后的 18 是预加载首屏的多少个作品的信息，和下载并没有关系
    const url = `https://www.pixiv.net/ajax/illust/${id}/recommend/init?limit=18`
    return this.fetch(url)
  }

  /** 获取插画、漫画、动画排行榜数据
   * 排行榜数据基本是一批 50 条作品信息 */
  static getRankingDataImageWork(
    option: RankingOption
  ): Promise<RankingImageWorkData> {
    let url = `https://www.pixiv.net/ranking.php?mode=${option.mode}&p=${option.p}&format=json`

    // 把可选项添加到 url 里
    let temp = new URL(url)

    // 下面两项需要判断有值再添加。不可以让这些字段使用空值
    if (option.worksType) {
      temp.searchParams.set('content', option.worksType)
    }
    if (option.date) {
      temp.searchParams.set('date', option.date)
    }

    url = temp.toString()

    return this.fetch(url)
  }

  /**获取小说排行榜数据。参数 p 是页码，一页包含 50 个小说 */
  static getRankingDataNovel(
    mode: string,
    date: string | null,
    p: number
  ): Promise<RankingNovelData> {
    // 完整的 url 示例：
    // https://www.pixiv.net/ajax/ranking/novel?mode=daily&date=20251030&p=2&lang=zh

    // 基础 URL
    let url = `https://www.pixiv.net/ajax/ranking/novel?mode=${mode}`

    // 动态添加 date 参数
    if (date) {
      url += `&date=${date}`
    }

    // 添加其他参数
    url += `&p=${p}&lang=zh`

    return this.fetch(url)
  }

  /** 获取收藏后的相似作品数据
   * 需要传入作品 id 和要抓取的数量。但是实际获取到的数量会比指定的数量少一些 */
  static getRecommenderData(
    id: string,
    number: number
  ): Promise<RecommenderData> {
    const url = `/rpc/recommender.php?type=illust&sample_illusts=${id}&num_recommendations=${number}`
    return this.fetch(url)
  }

  static getSearchData(
    word: string,
    path: 'artworks' | 'illustrations' | 'manga',
    p: number,
    option: SearchOption
  ): Promise<SearchData>

  static getSearchData(
    word: string,
    path: 'novels',
    p: number,
    option: SearchOption
  ): Promise<NovelSearchData>

  /** 获取搜索页面里某一页的数据 */
  static getSearchData(
    word: string,
    path = 'artworks',
    p: number = 1,
    option: SearchOption = {}
  ): Promise<SearchData | NovelSearchData> {
    word = encodeURIComponent(word)
    let url = `https://www.pixiv.net/ajax/search/${path}/${word}?q=${word}&p=${p}`

    // 把可选项添加到 url 里
    let temp = new URL(url)
    for (const [key, value] of Object.entries(option)) {
      if (value) {
        temp.searchParams.set(key, value)
      }
    }
    url = temp.toString()

    return this.fetch(url)
  }

  /** 获取大家的新作品的数据 */
  static getNewIllustData(option: NewIllustOption): Promise<NewIllustData> {
    const url = `https://www.pixiv.net/ajax/illust/new?lastId=${option.lastId}&limit=${option.limit}&type=${option.type}&r18=${option.r18}`
    return this.fetch(url)
  }

  /** 获取大家的新作小说的数据。不必设置参数里的 type */
  static getNewNovelData(option: NewIllustOption): Promise<NewNovelData> {
    const url = `https://www.pixiv.net/ajax/novel/new?lastId=${option.lastId}&limit=${option.limit}&r18=${option.r18}`
    return this.fetch(url)
  }

  /** 获取关注的用户的新作品的数据 */
  static getBookmarkNewWorkData(
    type: 'illust' | 'novel',
    p: number,
    tag: string = '',
    r18: boolean,
    lang = 'zh'
  ): Promise<BookMarkNewData> {
    const url = `https://www.pixiv.net/ajax/follow_latest/${type}?p=${p}&tag=${tag}&mode=${
      r18 ? 'r18' : 'all'
    }&lang=${lang}`
    return this.fetch(url)
  }

  /** 获取好P友的最新作品 */
  static getMyPixivNewWorkData(
    type: 'illust' | 'novel',
    p: number,
    lang = 'zh'
  ): Promise<BookMarkNewData> {
    const url = `https://www.pixiv.net/ajax/mypixiv_latest/${type}?p=${p}&lang=${lang}`
    return this.fetch(url)
  }

  /**获取小说系列的数据，注意只是系列本身的数据，没有系列里每部小说的数据 */
  static getNovelSeriesData(
    series_id: number | string
  ): Promise<NovelSeriesData> {
    const url = `https://www.pixiv.net/ajax/novel/series/${series_id}`
    return this.fetch(url)
  }

  /** 获取小说系列作品里每个作品的详细数据（但是没有小说正文内容）
   * 这个 api 目前一批最多只能返回 30 个作品的数据，所以可能需要多次获取 */
  static getNovelSeriesContent(
    series_id: number | string,
    limit: number = 30,
    last_order: number,
    order_by = 'asc'
  ): Promise<NovelSeriesContentData> {
    const url = `https://www.pixiv.net/ajax/novel/series_content/${series_id}?limit=${limit}&last_order=${last_order}&order_by=${order_by}`
    return this.fetch(url)
  }

  /** 获取系列信息
   * 这个接口的数据结构里同时有 illust （包含漫画）和 novel 系列数据
   * 恍惚记得有插画系列来着，但是没找到对应的网址，难道是记错了？ */
  static getSeriesData(
    series_id: number | string,
    pageNo: number
  ): Promise<SeriesData> {
    const url = `https://www.pixiv.net/ajax/series/${series_id}?p=${pageNo}`
    return this.fetch(url)
  }

  /** 点赞 */
  static async addLike(
    id: string,
    type: 'illusts' | 'novels',
    token: string
  ): Promise<LikeResponse> {
    let data = {}
    if (type === 'illusts') {
      data = {
        illust_id: id,
      }
    } else {
      data = {
        novel_id: id,
      }
    }

    const url = `https://www.pixiv.net/ajax/${type}/like`
    const init: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'x-csrf-token': token,
      },
      credentials: 'same-origin',
      body: JSON.stringify(data),
    }
    return this.fetch(url, init)
  }

  static async getMuteSettings(): Promise<muteData> {
    return this.fetch(`https://www.pixiv.net/ajax/mute/items?context=setting`)
  }

  /** 获取小说里引用的插画的数据，可以一次传递多个插画 id（需要带序号）
   * illustsIDs 形式例如：[70551567,99760571-1,99760571-130]
   * 如果指定了序号，那么 Pixiv 会返回对应序号的图片 URL */
  static async getNovelInsertIllustsData(
    novelID: string | number,
    illustsIDs: string[]
  ): Promise<NovelInsertIllusts> {
    const parameters: string[] = []
    illustsIDs.forEach((id) => parameters.push(`id%5B%5D=${id}`))
    const url =
      `https://www.pixiv.net/ajax/novel/${novelID}/insert_illusts?` +
      parameters.join('&')
    // 组合好的 url 里可能包含多个 id[]=123456789 参数，如：
    // https://www.pixiv.net/ajax/novel/22894530/insert_illusts?id%5B%5D=121979383-1&id%5B%5D=121979454-1&id%5B%5D=121979665-1
    return this.fetch(url)
  }

  /**获取系列小说的设定资料 */
  static async getNovelSeriesGlossary(
    seriesId: string | number
  ): Promise<NovelSeriesGlossary> {
    return this.fetch(
      `https://www.pixiv.net/ajax/novel/series/${seriesId}/glossary`
    )
  }

  /**获取系列小说某条设定资料的详细信息 */
  static async getNovelSeriesGlossaryItem(
    seriesId: string | number,
    itemId: string | number
  ): Promise<NovelSeriesGlossaryItem> {
    return this.fetch(
      `https://www.pixiv.net/ajax/novel/series/${seriesId}/glossary/item/${itemId}`
    )
  }

  /**获取用户最近的几条消息 */
  static async getLatestMessage(number: number): Promise<LatestMessageData> {
    return this.fetch(
      `https://www.pixiv.net/rpc/index.php?mode=latest_message_threads2&num=${number}&offset=0`
    )
  }

  /**获取数据分析里图像或小说分类下的数据 */
  static async getDashboardData(
    workType: 'illust' | 'novel'
  ): Promise<DashboardData> {
    return this.fetch(
      `https://www.pixiv.net/ajax/dashboard/works/${workType}/request_strategy`
    )
  }

  /** 关注一个用户
   * show: true 为公开关注，false 为非公开关注
   * recaptcha_enterprise_score_token 对于有些用户是不需要的。允许传递空值 */
  static async addFollowingUser(
    userID: string,
    token: string,
    show = true,
    recaptcha_enterprise_score_token = ''
  ): Promise<number> {
    const url = `https://www.pixiv.net/bookmark_add.php`
    const init: RequestInit = {
      method: 'POST',
      credentials: 'same-origin', // 附带 cookie
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'x-csrf-token': token,
      },
      body: `mode=add&type=user&user_id=${userID}&tag=&restrict=${show ? 0 : 1}&format=json&recaptcha_enterprise_score_token=${recaptcha_enterprise_score_token}`,
    }

    try {
      // 如果操作成功，则返回值是 []
      // 如果用户不存在，返回值是该用户主页的网页源码
      // 如果 token 错误，返回值是一个包含错误提示的 JSON 对象
      // 所以这里需要转换为 text，如果转换为 json 的话会导致抛出错误
      await this.fetch(url, init, 'text')
      return 200
    } catch (error: Error | any) {
      return error.status || 0
    }
  }

  /** 获取比赛里的应募作品列表，每次 1 页（最对 50 个作品） */
  static async getContestWorksData(
    type: 'illust' | 'novel',
    name: string,
    p: number,
    order: 'date_d' | 'date' | 'popular_d' = 'date_d'
  ): Promise<ContestData> {
    let typePath = ''
    if (type === 'novel') {
      typePath = 'novel/'
    }
    const url = `https://www.pixiv.net/ajax/${typePath}contest/${name}/entries?order=${order}&p=${p}`
    return this.fetch(url)
  }
}

export { API }
