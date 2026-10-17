// 监听 pixiv 的书签列表 API 的响应，从中提取收藏标签（bookmarkTags），发送给内容脚本
//
// 注意：这个脚本只读取响应，不会修改它。网页收到的响应和没有这个脚本时完全一样。
//
// 为什么需要注入脚本：
// MV3 里 webRequest 只能观测请求，无法读取响应体，所以只能 hook 页面的 fetch。
// 内容脚本（隔离世界）里的 fetch 不会经过页面的 window.fetch，
// 所以下载器自己发送的请求由内容脚本里的 API.getBookmarkData 直接处理，不依赖这个脚本。

/** 需要监听的 API 的网址特征。
 * 例如：https://www.pixiv.net/ajax/user/123456/illusts/bookmarks?tag=&offset=0&limit=100...
 * 这个 API 的返回值里含有这一页里每个作品的收藏标签 */
// 这个网址就是 API.getBookmarkData 里的网址，用来在书签页面里，获取作品列表数据的 API。里面含有这一页里每个作品的收藏标签信息。
const urlPattern = /\/ajax\/user\/\d+\/(illusts|novels)\/bookmarks\?/

/** 检查网址是否为需要监听的 API */
const needIntercept = (url) => typeof url === 'string' && urlPattern.test(url)

/** 缓存已经收到的收藏标签，key 是收藏 id，value 是标签列表。
 *
 * 内容脚本的初始化时机（document_end）晚于这个脚本（document_start），
 * 所以在内容脚本就绪之前发送的消息会丢失。这里保留一份数据，
 * 等内容脚本发送就绪消息后重新发送一次 */
const cache = new Map()

/** 把收藏标签数据发送给内容脚本 */
const postBookmarkTags = (bookmarkTags) => {
  window.postMessage(
    {
      source: 'pixiv-downloader-bookmark-tags',
      bookmarkTags: bookmarkTags,
    },
    window.location.origin
  )
}

/** 保存并发送一批收藏标签数据 */
const receiveBookmarkTags = (bookmarkTags) => {
  if (!bookmarkTags || typeof bookmarkTags !== 'object') {
    return
  }
  for (const [bookmarkId, tags] of Object.entries(bookmarkTags)) {
    cache.set(bookmarkId, tags)
  }
  postBookmarkTags(bookmarkTags)
}

/** 从书签列表 API 的响应里提取收藏标签。只读取克隆出来的响应，不影响原响应 */
const readResponse = (response) => {
  try {
    response
      .clone()
      .json()
      .then((data) => {
        const bookmarkTags = data && data.body && data.body.bookmarkTags
        if (bookmarkTags) {
          receiveBookmarkTags(bookmarkTags)
        }
      })
      .catch(() => {})
  } catch (error) {}
}

// 内容脚本就绪后，把之前缓存的数据重新发送一次
window.addEventListener('message', (event) => {
  if (event.source !== window) {
    return
  }
  const data = event.data
  if (data && data.source === 'pixiv-downloader-bookmark-tags' && data.ready) {
    const allTags = {}
    cache.forEach((tags, bookmarkId) => {
      allTags[bookmarkId] = tags
    })
    if (Object.keys(allTags).length > 0) {
      postBookmarkTags(allTags)
    }
  }
})

// 重写 fetch，监听目标 API 的响应
const originalFetch = window.fetch

window.fetch = function (...args) {
  const firstArg = args[0]
  // fetch 的第一个参数可以是字符串、Request 对象（有 url 属性）或 URL 对象（有 href 属性）
  const url =
    typeof firstArg === 'string'
      ? firstArg
      : firstArg && (firstArg.url || firstArg.href)
  const promise = originalFetch.apply(this, args)

  if (!needIntercept(url)) {
    return promise
  }

  // 只是读取响应里的数据，不修改响应
  return promise.then((response) => {
    readResponse(response)
    return response
  })
}
