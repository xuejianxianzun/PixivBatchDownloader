'use strict'
// 注入脚本（src/static/lib/bookmark_tags_observer.js）的行为测试：
// 1. 命中了书签列表 API 时，从响应里提取 bookmarkTags 发送给内容脚本，并且原响应保持不变
// 2. 不匹配的网址不会被处理
// 3. 内容脚本就绪之前收到的数据，会在收到就绪消息后重新发送一次
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')

/** 加载注入脚本，返回它使用的假 window 和收集到的消息 */
function createHarness(response) {
  const messages = []
  const listeners = []
  const fetchCalls = []

  const window = {
    fetch: async (...args) => {
      fetchCalls.push(args)
      // 传入函数时按请求返回不同响应
      return typeof response === 'function' ? response(...args) : response
    },
    addEventListener(type, fn) {
      if (type === 'message') {
        listeners.push(fn)
      }
    },
    postMessage(data) {
      messages.push(data)
    },
    location: { origin: 'https://www.pixiv.net' },
  }

  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/static/lib/bookmark_tags_observer.js'),
    'utf8'
  )
  vm.runInNewContext(source, { window, Map, Object, console })

  return {
    window,
    messages,
    fetchCalls,
    /** 模拟 window 收到一条 message 事件 */
    dispatch(data) {
      for (const fn of listeners) {
        fn({ source: window, data })
      }
    },
    /** 只返回含有 bookmarkTags 的消息（即注入脚本上报的数据） */
    reports() {
      return messages.filter((item) => item.bookmarkTags)
    },
    /** 只返回含有 addedTags 的消息（即用户新增标签后上报的数据） */
    addedTagReports() {
      return messages.filter((item) => item.addedTags)
    },
  }
}

/** 生成一个可以被 clone().json() 的假响应 */
function jsonResponse(data) {
  const response = {
    ok: true,
    clone() {
      return { json: async () => data }
    },
  }
  return response
}

test('命中了书签 API 时发送 bookmarkTags，并且返回原始响应', async () => {
  const response = jsonResponse({ body: { bookmarkTags: { 123: ['a', 'b'] } } })
  const h = createHarness(response)

  const result = await h.window.fetch(
    'https://www.pixiv.net/ajax/user/1/illusts/bookmarks?tag=&offset=0&limit=100'
  )

  assert.equal(result, response, '必须返回原始响应对象')
  assert.equal(h.reports().length, 1)
  assert.deepEqual(h.reports()[0].bookmarkTags, { 123: ['a', 'b'] })
  assert.equal(h.reports()[0].source, 'pixiv-downloader-bookmark-tags')
})

test('小说的收藏列表 API 也会被监听', async () => {
  const h = createHarness(
    jsonResponse({ body: { bookmarkTags: { 456: ['c'] } } })
  )

  await h.window.fetch(
    'https://www.pixiv.net/ajax/user/1/novels/bookmarks?tag=&offset=0&limit=100'
  )

  assert.equal(h.reports().length, 1)
  assert.deepEqual(h.reports()[0].bookmarkTags, { 456: ['c'] })
})

test('第一个参数是 Request 对象或 URL 对象时也能被识别', async () => {
  // Request 对象有 url 属性
  const h1 = createHarness(
    jsonResponse({ body: { bookmarkTags: { 1: ['x'] } } })
  )
  await h1.window.fetch({
    url: 'https://www.pixiv.net/ajax/user/1/illusts/bookmarks?tag=',
  })
  assert.equal(h1.reports().length, 1)

  // URL 对象有 href 属性
  const h2 = createHarness(
    jsonResponse({ body: { bookmarkTags: { 2: ['y'] } } })
  )
  await h2.window.fetch({
    href: 'https://www.pixiv.net/ajax/user/1/novels/bookmarks?tag=',
  })
  assert.equal(h2.reports().length, 1)
})

test('不匹配的网址不会被处理，也不会影响返回结果', async () => {
  const response = jsonResponse({ body: { bookmarkTags: { 1: ['x'] } } })
  const h = createHarness(response)

  const urls = [
    'https://www.pixiv.net/ajax/illust/123',
    'https://www.pixiv.net/ajax/user/1/illusts/bookmarks',
    'https://www.pixiv.net/ajax/user/1/manga/bookmarks?tag=',
  ]
  for (const url of urls) {
    const result = await h.window.fetch(url)
    assert.equal(result, response)
  }

  assert.equal(h.reports().length, 0)
})

test('响应里没有 bookmarkTags 时不发送消息', async () => {
  const h = createHarness(jsonResponse({ body: { works: [] } }))

  await h.window.fetch(
    'https://www.pixiv.net/ajax/user/1/illusts/bookmarks?tag=&offset=0'
  )

  assert.equal(h.reports().length, 0)
})

test('响应不是 JSON 时不会抛出错误', async () => {
  const response = {
    clone() {
      return {
        json: async () => {
          throw new Error('not json')
        },
      }
    },
  }
  const h = createHarness(response)

  const result = await h.window.fetch(
    'https://www.pixiv.net/ajax/user/1/illusts/bookmarks?tag='
  )

  assert.equal(result, response)
  assert.equal(h.reports().length, 0)
})

test('内容脚本就绪后，会重新发送之前收到的数据', async () => {
  const h = createHarness(
    jsonResponse({ body: { bookmarkTags: { 789: ['最早的数据'] } } })
  )

  // 内容脚本还没就绪时收到的数据（此时它收不到）
  await h.window.fetch(
    'https://www.pixiv.net/ajax/user/1/illusts/bookmarks?tag=&offset=0'
  )
  assert.equal(h.reports().length, 1)

  // 内容脚本就绪
  h.dispatch({ source: 'pixiv-downloader-bookmark-tags', ready: true })

  const reports = h.reports()
  assert.equal(reports.length, 2)
  // 这里只比较值：重发时的外层对象是在注入脚本的上下文里创建的，
  // 直接用 deepEqual 比较整个对象会因为跨 realm 的原型不同而失败
  assert.deepEqual(reports[1].bookmarkTags[789], ['最早的数据'])
})

test('没有缓存数据时，收到就绪消息不会发送空数据', async () => {
  const h = createHarness(jsonResponse({ body: {} }))

  h.dispatch({ source: 'pixiv-downloader-bookmark-tags', ready: true })

  assert.equal(h.reports().length, 0)
})

// ---------- 为收藏添加标签（add_tags API） ----------

/** 等待微任务队列跑完（add_tags 的处理链比列表 API 长） */
const flush = () => new Promise((resolve) => setTimeout(resolve, 10))

/** 生成一个「添加收藏标签」请求的成功响应 */
const addTagsSuccess = () =>
  jsonResponse({ error: false, message: '', body: [] })

test('add_tags 请求成功时，把载荷里的 bookmarkIds 和 tags 上报给内容脚本', async () => {
  const h = createHarness(addTagsSuccess())

  await h.window.fetch('https://www.pixiv.net/ajax/novels/bookmarks/add_tags', {
    method: 'POST',
    body: JSON.stringify({
      tags: ['测试', '标签二'],
      bookmarkIds: ['3701966590', '3701968046'],
    }),
  })
  await flush()

  // 这个网址不应该被当成书签列表 API 处理
  assert.equal(h.reports().length, 0)

  const reports = h.addedTagReports()
  assert.equal(reports.length, 1)
  assert.deepEqual(JSON.parse(JSON.stringify(reports[0].addedTags)), {
    bookmarkIds: ['3701966590', '3701968046'],
    tags: ['测试', '标签二'],
  })
})

test('插画和小说两个 add_tags 网址都会被监听', async () => {
  const urls = [
    'https://www.pixiv.net/ajax/illusts/bookmarks/add_tags',
    'https://www.pixiv.net/ajax/novels/bookmarks/add_tags',
  ]
  for (const url of urls) {
    const h = createHarness(addTagsSuccess())
    await h.window.fetch(url, {
      method: 'POST',
      body: JSON.stringify({ tags: ['x'], bookmarkIds: ['1'] }),
    })
    await flush()
    assert.equal(h.addedTagReports().length, 1, url)
  }
})

test('add_tags 返回 error 为 true 时不上报', async () => {
  const h = createHarness(
    jsonResponse({ error: true, message: 'failed', body: [] })
  )

  await h.window.fetch('https://www.pixiv.net/ajax/novels/bookmarks/add_tags', {
    method: 'POST',
    body: JSON.stringify({ tags: ['测试'], bookmarkIds: ['1'] }),
  })
  await flush()

  assert.equal(h.addedTagReports().length, 0)
})

test('add_tags 的 HTTP 状态不正常时不上报', async () => {
  const response = addTagsSuccess()
  response.ok = false
  const h = createHarness(response)

  await h.window.fetch('https://www.pixiv.net/ajax/novels/bookmarks/add_tags', {
    method: 'POST',
    body: JSON.stringify({ tags: ['测试'], bookmarkIds: ['1'] }),
  })
  await flush()

  assert.equal(h.addedTagReports().length, 0)
})

test('add_tags 的载荷为空或不是 JSON 时不上报，也不会抛错', async () => {
  const h = createHarness(addTagsSuccess())

  // 空标签
  await h.window.fetch('https://www.pixiv.net/ajax/novels/bookmarks/add_tags', {
    method: 'POST',
    body: JSON.stringify({ tags: [], bookmarkIds: ['1'] }),
  })
  // 空 bookmarkIds
  await h.window.fetch('https://www.pixiv.net/ajax/novels/bookmarks/add_tags', {
    method: 'POST',
    body: JSON.stringify({ tags: ['x'], bookmarkIds: [] }),
  })
  // 不是合法 JSON
  await h.window.fetch('https://www.pixiv.net/ajax/novels/bookmarks/add_tags', {
    method: 'POST',
    body: 'not json',
  })
  await flush()

  assert.equal(h.addedTagReports().length, 0)
})

test('第一个参数是 Request 对象时，也能读取 add_tags 的载荷', async () => {
  const h = createHarness(addTagsSuccess())

  const request = {
    url: 'https://www.pixiv.net/ajax/illusts/bookmarks/add_tags',
    clone() {
      return {
        json: async () => ({ tags: ['from request'], bookmarkIds: ['123'] }),
      }
    },
  }

  await h.window.fetch(request)
  await flush()

  const reports = h.addedTagReports()
  assert.equal(reports.length, 1)
  assert.deepEqual(JSON.parse(JSON.stringify(reports[0].addedTags)), {
    bookmarkIds: ['123'],
    tags: ['from request'],
  })
})

test('新增的标签会进入注入脚本的缓存，内容脚本就绪后重发时包含它', async () => {
  const listResponse = jsonResponse({
    body: { bookmarkTags: { 100: ['原有标签'] } },
  })
  const h = createHarness((url) =>
    typeof url === 'string' && url.includes('/bookmarks?')
      ? listResponse
      : addTagsSuccess()
  )

  // 先收到书签列表的数据
  await h.window.fetch(
    'https://www.pixiv.net/ajax/user/1/illusts/bookmarks?tag=&offset=0'
  )
  await flush()

  // 用户新增了一个标签
  await h.window.fetch(
    'https://www.pixiv.net/ajax/illusts/bookmarks/add_tags',
    {
      method: 'POST',
      body: JSON.stringify({ tags: ['新标签'], bookmarkIds: ['100', '200'] }),
    }
  )
  await flush()

  // 内容脚本就绪，注入脚本重发缓存
  h.dispatch({ source: 'pixiv-downloader-bookmark-tags', ready: true })

  const reports = h.reports()
  const last = reports[reports.length - 1]
  assert.deepEqual(JSON.parse(JSON.stringify(last.bookmarkTags[100])), [
    '原有标签',
    '新标签',
  ])
  // 原来缓存里没有的收藏 id，也会被补上
  assert.deepEqual(JSON.parse(JSON.stringify(last.bookmarkTags[200])), [
    '新标签',
  ])
})

// ---------- 移除收藏标签（remove_tags API） ----------

test('remove_tags 请求成功时，把载荷里的 bookmarkIds 和 removeTags 上报给内容脚本', async () => {
  const h = createHarness(addTagsSuccess())

  await h.window.fetch(
    'https://www.pixiv.net/ajax/novels/bookmarks/remove_tags',
    {
      method: 'POST',
      body: JSON.stringify({
        removeTags: ['肉便器', '中出'],
        bookmarkIds: ['3701868755', '3701867272'],
      }),
    }
  )
  await flush()

  // 不会被当成添加标签的处理
  assert.equal(h.addedTagReports().length, 0)

  const reports = h.messages.filter((item) => item.removedTags)
  assert.equal(reports.length, 1)
  assert.deepEqual(JSON.parse(JSON.stringify(reports[0].removedTags)), {
    bookmarkIds: ['3701868755', '3701867272'],
    tags: ['肉便器', '中出'],
  })
})

test('插画和小说两个 remove_tags 网址都会被监听', async () => {
  const urls = [
    'https://www.pixiv.net/ajax/illusts/bookmarks/remove_tags',
    'https://www.pixiv.net/ajax/novels/bookmarks/remove_tags',
  ]
  for (const url of urls) {
    const h = createHarness(addTagsSuccess())
    await h.window.fetch(url, {
      method: 'POST',
      body: JSON.stringify({ removeTags: ['x'], bookmarkIds: ['1'] }),
    })
    await flush()
    const reports = h.messages.filter((item) => item.removedTags)
    assert.equal(reports.length, 1, url)
  }
})

test('remove_tags 返回 error 为 true 时不上报', async () => {
  const h = createHarness(
    jsonResponse({ error: true, message: 'failed', body: [] })
  )

  await h.window.fetch(
    'https://www.pixiv.net/ajax/novels/bookmarks/remove_tags',
    {
      method: 'POST',
      body: JSON.stringify({ removeTags: ['测试'], bookmarkIds: ['1'] }),
    }
  )
  await flush()

  assert.equal(h.messages.filter((item) => item.removedTags).length, 0)
})

test('remove_tags 的载荷里没有 removeTags 字段时不上报', async () => {
  const h = createHarness(addTagsSuccess())

  // 只有 tags 字段（这是 add_tags 的格式），不应该被当成移除处理
  await h.window.fetch(
    'https://www.pixiv.net/ajax/novels/bookmarks/remove_tags',
    {
      method: 'POST',
      body: JSON.stringify({ tags: ['x'], bookmarkIds: ['1'] }),
    }
  )
  await flush()

  assert.equal(h.messages.filter((item) => item.removedTags).length, 0)
})

test('移除的标签会从注入脚本的缓存里删掉，且不会为没有记录的收藏新建缓存', async () => {
  const listResponse = jsonResponse({
    body: { bookmarkTags: { 300: ['要移除', '保留'], 301: ['另一个'] } },
  })
  const h = createHarness((url) =>
    typeof url === 'string' && url.includes('/bookmarks?')
      ? listResponse
      : addTagsSuccess()
  )

  await h.window.fetch(
    'https://www.pixiv.net/ajax/user/1/illusts/bookmarks?tag=&offset=0'
  )
  await flush()

  // 移除 300 的一个标签；999 不在缓存里
  await h.window.fetch(
    'https://www.pixiv.net/ajax/illusts/bookmarks/remove_tags',
    {
      method: 'POST',
      body: JSON.stringify({
        removeTags: ['要移除'],
        bookmarkIds: ['300', '999'],
      }),
    }
  )
  await flush()

  h.dispatch({ source: 'pixiv-downloader-bookmark-tags', ready: true })

  const reports = h.reports()
  const last = reports[reports.length - 1]
  assert.deepEqual(JSON.parse(JSON.stringify(last.bookmarkTags[300])), ['保留'])
  assert.deepEqual(JSON.parse(JSON.stringify(last.bookmarkTags[301])), [
    '另一个',
  ])
  // 缓存里本来没有 999，移除操作不应该给它创建记录
  assert.equal(last.bookmarkTags[999], undefined)
})
