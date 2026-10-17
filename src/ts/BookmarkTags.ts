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

      const tagSet = this.cache.get(bookmarkId)
      if (tagSet) {
        tags.forEach((tag) => tagSet.add(tag))
      } else {
        this.cache.set(bookmarkId, new Set(tags))
      }
    }
  }

  /** 根据收藏 id 获取收藏标签。如果缓存里没有这个收藏 id，返回 undefined */
  public get(bookmarkId?: string): string[] | undefined {
    if (!bookmarkId) {
      return undefined
    }

    const tagSet = this.cache.get(bookmarkId)
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
  public getForResult(bookmarkData?: null | { id: string }): {
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
