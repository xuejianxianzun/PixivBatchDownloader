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
    fetch: async (url) => {
      fetchCalls.push(url)
      return response
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
  }
}

/** 生成一个可以被 clone().json() 的假响应 */
function jsonResponse(data) {
  const response = {
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
  const h1 = createHarness(jsonResponse({ body: { bookmarkTags: { 1: ['x'] } } }))
  await h1.window.fetch({
    url: 'https://www.pixiv.net/ajax/user/1/illusts/bookmarks?tag=',
  })
  assert.equal(h1.reports().length, 1)

  // URL 对象有 href 属性
  const h2 = createHarness(jsonResponse({ body: { bookmarkTags: { 2: ['y'] } } }))
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
