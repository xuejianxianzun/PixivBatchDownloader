/** 缓存作品的收藏标签（bookmarkTags）。
 *
 * 收藏标签是用户在收藏一个作品之后，为这个收藏添加的标签，不是作品本身的标签。
 * 这些数据只在书签列表页面的 API 里返回：/ajax/user/{userId}/{type}/bookmarks
 *
 * 数据的来源有两种：
 * - 网页本身请求这个 API 时，由注入脚本（lib/bookmark_tags_observer.js）把数据发送到内容脚本；
 * - 下载器请求这个 API 时（API.getBookmarkData），直接把数据保存到这里。
 *
 * 这个缓存保存在内存里，页面刷新后会清空。
 */
class BookmarkTags {
  /** key 是收藏 id（作品的 bookmarkData.id），value 是这个收藏的标签集合 */
  private cache = new Map<string, Set<string>>()

  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    // 接收注入脚本发送过来的数据
    window.addEventListener('message', (event) => {
      if (event.source !== window) {
        return
      }
      const data = event.data
      if (
        data &&
        data.source === 'pixiv-downloader-bookmark-tags' &&
        data.bookmarkTags
      ) {
        this.add(data.bookmarkTags)
      }

      // 用户为收藏添加了标签（网页请求了 add_tags API）
      if (
        data &&
        data.source === 'pixiv-downloader-bookmark-tags' &&
        data.addedTags
      ) {
        this.addTagsToBookmarks(data.addedTags.bookmarkIds, data.addedTags.tags)
      }

      // 用户移除了收藏标签（网页请求了 remove_tags API）
      if (
        data &&
        data.source === 'pixiv-downloader-bookmark-tags' &&
        data.removedTags
      ) {
        this.removeTagsFromBookmarks(
          data.removedTags.bookmarkIds,
          data.removedTags.tags
        )
      }
    })

    // 通知注入脚本：内容脚本已经就绪。注入脚本收到后会重新发送
    // 之前缓存的数据，因为那些消息是在内容脚本就绪之前发送的，收不到
    window.postMessage(
      {
        source: 'pixiv-downloader-bookmark-tags',
        ready: true,
      },
      window.location.origin
    )
  }

  /** 保存一批收藏标签数据。key 是收藏 id，value 是标签列表 */
  public add(bookmarkTags?: Record<string, string[]>) {
    if (!bookmarkTags) {
      return
    }

    for (const [bookmarkId, tags] of Object.entries(bookmarkTags)) {
      if (!Array.isArray(tags)) {
        continue
      }

      // 统一转换成字符串作为 key。不同 API 返回的收藏 id 类型可能不同，
      // 例如书签列表 API 里是字符串，小说详情 API 里是数字，所以统一使用字符串
      const key = String(bookmarkId)
      const tagSet = this.cache.get(key)
      if (tagSet) {
        tags.forEach((tag) => tagSet.add(tag))
      } else {
        this.cache.set(key, new Set(tags))
      }
    }
  }

  /** 为指定的一批收藏添加标签。
   *
   * 用户在书签页面里给作品添加收藏标签时，网页会请求 add_tags API。
   * 注入脚本监听这个请求，把载荷里的 bookmarkIds 和 tags 发送过来。
   * 如果缓存里还没有这个收藏的记录，就为它新建一条记录 */
  public addTagsToBookmarks(bookmarkIds?: string[], tags?: string[]) {
    if (!Array.isArray(bookmarkIds) || !Array.isArray(tags)) {
      return
    }
    if (tags.length === 0) {
      return
    }

    for (const bookmarkId of bookmarkIds) {
      const key = String(bookmarkId)
      const tagSet = this.cache.get(key)
      if (tagSet) {
        tags.forEach((tag) => tagSet.add(tag))
      } else {
        this.cache.set(key, new Set(tags))
      }
    }
  }

  /** 从指定的一批收藏里移除标签。
   *
   * 用户在书签页面里移除作品的收藏标签时，网页会请求 remove_tags API。
   * 注入脚本监听这个请求，把载荷里的 bookmarkIds 和 tags 发送过来。
   * 如果缓存里没有这个收藏的记录，就不需要处理 */
  public removeTagsFromBookmarks(bookmarkIds?: string[], tags?: string[]) {
    if (!Array.isArray(bookmarkIds) || !Array.isArray(tags)) {
      return
    }
    if (tags.length === 0) {
      return
    }

    for (const bookmarkId of bookmarkIds) {
      const tagSet = this.cache.get(String(bookmarkId))
      if (!tagSet) {
        continue
      }
      tags.forEach((tag) => tagSet.delete(tag))
    }
  }

  /** 获取缓存里的最新标签。只要缓存里有这个收藏的记录，就返回数组（可能是空数组）。
   *
   * 和 get() 的区别：get() 把「有记录但标签为空」也当作没有数据
   * （这是为了让抓取结果保留默认值），而匹配文件夹名字时需要区分
   * 「缓存里没有这个作品」和「这个作品的标签被删光了」：
   * 前者应该回退到抓取结果里的数据，后者必须使用空数组，
   * 否则会匹配到已经被删掉的旧标签 */
  public getLatest(bookmarkId?: string | number): string[] | undefined {
    if (bookmarkId === undefined || bookmarkId === null || bookmarkId === '') {
      return undefined
    }

    const tagSet = this.cache.get(String(bookmarkId))
    if (!tagSet) {
      return undefined
    }

    return [...tagSet]
  }

  /** 获取用于「使用第一个匹配的收藏标签建立文件夹」的标签列表。
   *
   * 收藏标签可能在抓取之后发生变化（用户在当前页面添加或移除了标签），
   * 而抓取结果里保存的是抓取时的旧数据。
   * 所以优先返回缓存里的最新数据，缓存里没有这个作品时才使用 fallback */
  public getForMatch(
    bookmarkId: string | number | undefined,
    fallback?: string[]
  ): string[] {
    const latest = this.getLatest(bookmarkId)
    if (latest !== undefined) {
      return latest
    }
    return fallback || []
  }

  /** 根据收藏 id 获取收藏标签。如果缓存里没有这个收藏 id，返回 undefined */
  public get(bookmarkId?: string | number): string[] | undefined {
    if (bookmarkId === undefined || bookmarkId === null || bookmarkId === '') {
      return undefined
    }

    // 这里必须转换成字符串再查询：书签列表 API 里的收藏 id 是字符串，
    // 而小说详情 API（/ajax/novel/{id}）里返回的收藏 id 是数字。
    // 如果直接用数字去查以字符串为 key 的 Map，会永远查不到
    const tagSet = this.cache.get(String(bookmarkId))
    if (!tagSet || tagSet.size === 0) {
      return undefined
    }

    return [...tagSet]
  }

  /** 根据作品的收藏数据获取收藏标签，返回一个可以直接展开到抓取结果里的对象。
   *
   * 如果缓存里没有这个收藏的标签，返回空对象，而不会覆盖抓取结果里的默认值。
   * 因为 store.addResult 使用 Object.assign 合并数据，如果传递 bookmarkTags: undefined，
   * 会把默认值（空数组）也覆盖成 undefined */
  public getForResult(bookmarkData?: null | { id: string | number }): {
    bookmarkTags?: string[]
  } {
    const tags = this.get(bookmarkData ? bookmarkData.id : undefined)
    if (!tags) {
      return {}
    }

    return { bookmarkTags: tags }
  }
}

const bookmarkTags = new BookmarkTags()
export { bookmarkTags }
