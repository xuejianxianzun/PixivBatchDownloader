// 监听 pixiv 的书签相关 API，把收藏标签（bookmarkTags）同步给内容脚本
//
// 目前监听三种请求：
// 1. 书签列表 API：从响应里提取每个作品的收藏标签
// 2. 为收藏添加标签的 API：从请求载荷里提取「给哪些收藏添加了哪些标签」
// 3. 为收藏移除标签的 API：从请求载荷里提取「从哪些收藏移除了哪些标签」
//
// 注意：这个脚本只读取请求和响应，不会修改它们。网页收到的响应和没有这个脚本时完全一样。
//
// 为什么需要注入脚本：
// MV3 里 webRequest 只能观测请求，无法读取响应体，所以只能 hook 页面的 fetch。
// 内容脚本（隔离世界）里的 fetch 不会经过页面的 window.fetch，
// 所以下载器自己发送的请求由内容脚本里的 API.getBookmarkData 直接处理，不依赖这个脚本。

/** 需要监听的书签列表 API 的网址特征。
 * 例如：https://www.pixiv.net/ajax/user/123456/illusts/bookmarks?tag=&offset=0&limit=100...
 * 这个 API 的返回值里含有这一页里每个作品的收藏标签 */
// 这个网址就是 API.getBookmarkData 里的网址，用来在书签页面里，获取作品列表数据的 API。里面含有这一页里每个作品的收藏标签信息。
const urlPattern = /\/ajax\/user\/\d+\/(illusts|novels)\/bookmarks\?/

/** 需要监听的「为收藏添加标签」API 的网址特征。
 *
 * 两个网址：
 * - https://www.pixiv.net/ajax/novels/bookmarks/add_tags
 * - https://www.pixiv.net/ajax/illusts/bookmarks/add_tags
 *
 * 作用：在书签页面里，当你为已收藏的作品添加收藏标签时，网页会向这个 API 发送 POST 请求。
 * 请求载荷是 JSON，例如 {"tags":["测试"],"bookmarkIds":["3701966590"]}：
 * - tags 里是要添加的标签，可能有多条
 * - bookmarkIds 里是收藏 id，可能有多个
 * 响应体里没有需要提取的数据（body 是空数组）。
 *
 * 为什么要监听它：添加标签之后，书签列表 API 不会再次触发，
 * 所以如果不监听这个请求，缓存里就一直是添加标签之前的数据。
 * 监听它之后，用户新增标签时下载器可以立即更新缓存。 */
const addTagsUrlPattern = /\/ajax\/(illusts|novels)\/bookmarks\/add_tags/

/** 需要监听的「移除收藏标签」API 的网址特征。
 *
 * 两个网址：
 * - https://www.pixiv.net/ajax/novels/bookmarks/remove_tags
 * - https://www.pixiv.net/ajax/illusts/bookmarks/remove_tags
 *
 * 作用：在书签页面里，当你移除已收藏作品的收藏标签时，网页会向这个 API 发送 POST 请求。
 * 请求载荷是 JSON，例如 {"removeTags":["肉便器"],"bookmarkIds":["3701868755"]}：
 * - removeTags 里是要移除的标签，可能有多条（注意字段名和添加时的 tags 不一样）
 * - bookmarkIds 里是收藏 id，可能有多个
 * 响应体里没有需要提取的数据（body 是空数组）。
 *
 * 为什么要监听它：和添加标签一样，移除标签之后书签列表 API 不会再次触发，
 * 不监听的话缓存里会一直保留已经被移除的标签。 */
const removeTagsUrlPattern =
  /\/ajax\/(illusts|novels)\/bookmarks\/remove_tags/

/** 检查网址是否为需要监听的书签列表 API */
const needIntercept = (url) => typeof url === 'string' && urlPattern.test(url)

/** 检查网址是否为「为收藏添加标签」的 API */
const needInterceptAddTags = (url) =>
  typeof url === 'string' && addTagsUrlPattern.test(url)

/** 检查网址是否为「移除收藏标签」的 API */
const needInterceptRemoveTags = (url) =>
  typeof url === 'string' && removeTagsUrlPattern.test(url)

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

/** 合并标签，去掉重复的 */
const mergeTags = (existing, added) => {
  const result = existing ? existing.slice() : []
  for (const tag of added) {
    if (!result.includes(tag)) {
      result.push(tag)
    }
  }
  return result
}

/** 从标签列表里移除指定的标签 */
const excludeTags = (existing, removed) => {
  if (!existing) {
    return []
  }
  return existing.filter((tag) => !removed.includes(tag))
}

/** 处理「为收藏添加标签」成功后的结果。
 *
 * 更新本地缓存（这样内容脚本就绪后重发数据时也会包含新增的标签），
 * 并通知内容脚本立即把这些标签合并到对应的收藏里 */
const receiveAddedTags = (bookmarkIds, tags) => {
  const ids = bookmarkIds.map((id) => String(id))
  for (const bookmarkId of ids) {
    cache.set(bookmarkId, mergeTags(cache.get(bookmarkId), tags))
  }
  window.postMessage(
    {
      source: 'pixiv-downloader-bookmark-tags',
      addedTags: {
        bookmarkIds: ids,
        tags: tags,
      },
    },
    window.location.origin
  )
}

/** 处理「移除收藏标签」成功后的结果。
 *
 * 从本地缓存里去掉这些标签（内容脚本就绪后重发数据时就不含它们了），
 * 并通知内容脚本立即从对应的收藏里移除。
 * 如果缓存里没有这个收藏的记录，就不做处理（不会为它新建一条空记录） */
const receiveRemovedTags = (bookmarkIds, tags) => {
  const ids = bookmarkIds.map((id) => String(id))
  for (const bookmarkId of ids) {
    const existing = cache.get(bookmarkId)
    if (existing) {
      cache.set(bookmarkId, excludeTags(existing, tags))
    }
  }
  window.postMessage(
    {
      source: 'pixiv-downloader-bookmark-tags',
      removedTags: {
        bookmarkIds: ids,
        tags: tags,
      },
    },
    window.location.origin
  )
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

/** 读取「修改收藏标签」（添加 / 移除）请求的载荷。
 *
 * ⚠️ 必须在调用原始 fetch 之前执行：如果第一个参数是 Request 对象，
 * 它的 body 只能被读取一次，必须先把 clone 出来 */
const readJsonBody = (args) => {
  try {
    const firstArg = args[0]
    const secondArg = args[1]

    // 最常见的形式：fetch(url, { method: 'POST', body: '{"tags":[...],"bookmarkIds":[...]}' })
    if (secondArg && typeof secondArg.body === 'string') {
      return Promise.resolve(JSON.parse(secondArg.body))
    }

    // 也可能传入 Request 对象
    if (firstArg && typeof firstArg.clone === 'function') {
      return firstArg.clone().json()
    }
  } catch (error) {}
  return Promise.resolve(null)
}

/** 处理「修改收藏标签」请求的响应。
 *
 * 这些 API 的响应体里没有需要提取的数据，只需要确认请求成功：
 * HTTP 状态正常，并且返回值里的 error 为 false。
 *
 * @param tagsField 载荷里存放标签的字段名。添加标签的 API 用 tags，移除标签的 API 用 removeTags
 * @param onSuccess 请求成功后的回调，接收收藏 id 列表和标签列表
 */
const readTagsChangeResult = (response, bodyPromise, tagsField, onSuccess) => {
  if (!response || !response.ok) {
    return
  }
  Promise.all([
    bodyPromise.catch(() => null),
    response
      .clone()
      .json()
      .catch(() => null),
  ])
    .then(([requestBody, responseBody]) => {
      if (!requestBody || !responseBody || responseBody.error !== false) {
        return
      }
      const tags = requestBody[tagsField]
      const bookmarkIds = requestBody.bookmarkIds
      if (!Array.isArray(tags) || !Array.isArray(bookmarkIds)) {
        return
      }
      if (tags.length === 0 || bookmarkIds.length === 0) {
        return
      }
      onSuccess(bookmarkIds, tags)
    })
    .catch(() => {})
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

  const interceptBookmarkList = needIntercept(url)
  const interceptAddTags = needInterceptAddTags(url)
  const interceptRemoveTags = needInterceptRemoveTags(url)

  // 修改标签的请求需要在 fetch 之前读取载荷（Request 对象的 body 只能读取一次）
  const bodyPromise =
    interceptAddTags || interceptRemoveTags ? readJsonBody(args) : null

  const promise = originalFetch.apply(this, args)

  if (!interceptBookmarkList && !interceptAddTags && !interceptRemoveTags) {
    return promise
  }

  // 只是读取数据，不修改响应
  return promise.then((response) => {
    if (interceptBookmarkList) {
      readResponse(response)
    }
    if (interceptAddTags && bodyPromise) {
      readTagsChangeResult(response, bodyPromise, 'tags', receiveAddedTags)
    }
    if (interceptRemoveTags && bodyPromise) {
      readTagsChangeResult(
        response,
        bodyPromise,
        'removeTags',
        receiveRemovedTags
      )
    }
    return response
  })
}
