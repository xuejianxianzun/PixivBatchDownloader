'use strict'
// BookmarkTags 缓存的行为测试。
// 重点守住一个真实的坑：不同 API 返回的收藏 id 类型不同——
// 书签列表 API 里是字符串（"3701968046"），小说详情 API 里是数字（3701968046）。
// 如果缓存只按字符串 key 存、却用数字去查，就会永远查不到（2026-10-18 实测踩过）。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 跨 realm（vm 里创建的）数组/对象与主 realm 的原型不同，deepEqual 会误判，统一比较 JSON */
const eq = (actual, expected) =>
  assert.equal(JSON.stringify(actual), JSON.stringify(expected))

/** 加载真实的 BookmarkTags.ts，只提供最小化的 window */
function loadBookmarkTags() {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts', 'BookmarkTags.ts'),
    'utf8'
  )
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText

  const listeners = []
  const window = {
    location: { origin: 'https://www.pixiv.net' },
    addEventListener(type, fn) {
      listeners.push({ type, fn })
    },
    postMessage() {},
  }

  const exports = {}
  vm.runInNewContext(
    code,
    { exports, console, window },
    { filename: 'BookmarkTags.ts' }
  )
  return {
    bookmarkTags: exports.bookmarkTags,
    listeners,
    window,
    /** 模拟 window 收到一条 message 事件 */
    dispatch(data) {
      for (const { fn } of listeners) {
        fn({ source: window, data })
      }
    },
  }
}

test('用字符串收藏 id 保存，用字符串和数字都能查到', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 3701968046: ['露出', '子宫脱'] })

  eq(bookmarkTags.get('3701968046'), ['露出', '子宫脱'])
  // 小说详情 API 返回的是数字
  eq(bookmarkTags.get(3701968046), ['露出', '子宫脱'])
})

test('getForResult 对数字收藏 id 也能取到标签', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 3701966590: ['R-18', '露出'] })

  // 书签列表 API 的形态
  eq(bookmarkTags.getForResult({ id: '3701966590' }), {
    bookmarkTags: ['R-18', '露出'],
  })
  // 小说详情 API 的形态
  eq(bookmarkTags.getForResult({ id: 3701966590 }), {
    bookmarkTags: ['R-18', '露出'],
  })
})

test('查不到时返回 undefined / 空对象，不会把默认值覆盖成 undefined', () => {
  const { bookmarkTags } = loadBookmarkTags()

  assert.equal(bookmarkTags.get('999'), undefined)
  assert.equal(bookmarkTags.get(999), undefined)
  assert.equal(bookmarkTags.get(), undefined)
  assert.equal(bookmarkTags.get(''), undefined)

  // 这里是关键：返回空对象，展开后不会产生 bookmarkTags: undefined
  eq(bookmarkTags.getForResult(null), {})
  eq(bookmarkTags.getForResult({ id: '999' }), {})
  eq(bookmarkTags.getForResult({ id: 999 }), {})
})

test('标签为空的收藏不会被当作命中', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 100: [] })

  assert.equal(bookmarkTags.get('100'), undefined)
  assert.equal(bookmarkTags.get(100), undefined)
})

test('同一个收藏 id 多次收到数据会合并去重', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 200: ['a', 'b'] })
  bookmarkTags.add({ 200: ['b', 'c'] })
  // 数字 key 再次写入时也要落到同一条记录上
  bookmarkTags.add({ 201: ['x'] })
  bookmarkTags.add({ 201: ['y'] })

  eq(bookmarkTags.get('200').sort(), ['a', 'b', 'c'])
  eq(bookmarkTags.get(201).sort(), ['x', 'y'])
})

test('内容脚本构造时会向注入脚本发送 ready 消息', () => {
  const { window } = loadBookmarkTags()
  // loadBookmarkTags 内部已构造实例；这里只验证 window 提供了所需接口，
  // ready 消息的实际内容由 bookmark_tags_observer.test.cjs 覆盖
  assert.equal(typeof window.postMessage, 'function')
  assert.equal(typeof window.addEventListener, 'function')
})

// ---------- 用户为收藏新增标签 ----------

test('addTagsToBookmarks 会在已有记录上合并标签，并为没有记录的收藏新建缓存', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 300: ['原有'] })
  bookmarkTags.addTagsToBookmarks(['300', '301'], ['新增', '原有'])

  // 已有记录：合并去重（原本就有的「原有」不会重复）
  eq(bookmarkTags.get('300'), ['原有', '新增'])
  // 没有记录：新建一条
  eq(bookmarkTags.get('301'), ['新增', '原有'])
})

test('addTagsToBookmarks 对数字收藏 id 也能正确合并', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 400: ['a'] })
  bookmarkTags.addTagsToBookmarks([400], ['b'])

  eq(bookmarkTags.get('400'), ['a', 'b'])
  eq(bookmarkTags.get(400), ['a', 'b'])
})

test('addTagsToBookmarks 遇到空的 tags 或非数组参数时不做任何改动', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 500: ['a'] })
  bookmarkTags.addTagsToBookmarks(['500'], [])
  bookmarkTags.addTagsToBookmarks(['500'], undefined)
  bookmarkTags.addTagsToBookmarks(undefined, ['x'])

  eq(bookmarkTags.get('500'), ['a'])
  assert.equal(bookmarkTags.get('501'), undefined)
})

test('收到 addedTags 消息时，把标签合并到对应的收藏里', () => {
  const h = loadBookmarkTags()

  h.bookmarkTags.add({ 600: ['a'] })
  h.dispatch({
    source: 'pixiv-downloader-bookmark-tags',
    addedTags: {
      bookmarkIds: ['600', '601'],
      tags: ['b'],
    },
  })

  eq(h.bookmarkTags.get('600'), ['a', 'b'])
  eq(h.bookmarkTags.get('601'), ['b'])
})

test('来源不是注入脚本的消息不会被处理', () => {
  const h = loadBookmarkTags()

  h.dispatch({
    source: 'other-source',
    addedTags: { bookmarkIds: ['700'], tags: ['x'] },
  })

  assert.equal(h.bookmarkTags.get('700'), undefined)
})

// ---------- 用户移除收藏标签 ----------

test('removeTagsFromBookmarks 会移除指定的标签，保留其他标签', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 800: ['要移除', '保留', '也移除'] })
  bookmarkTags.removeTagsFromBookmarks(['800'], ['要移除', '也移除'])

  eq(bookmarkTags.get('800'), ['保留'])
})

test('removeTagsFromBookmarks 对数字收藏 id 也有效', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 900: ['a', 'b'] })
  bookmarkTags.removeTagsFromBookmarks([900], ['a'])

  eq(bookmarkTags.get('900'), ['b'])
  eq(bookmarkTags.get(900), ['b'])
})

test('removeTagsFromBookmarks 不会为缓存里没有的收藏新建记录', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.removeTagsFromBookmarks(['950'], ['x'])

  assert.equal(bookmarkTags.get('950'), undefined)
})

test('removeTagsFromBookmarks 遇到空的 tags 或非数组参数时不做任何改动', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 960: ['a'] })
  bookmarkTags.removeTagsFromBookmarks(['960'], [])
  bookmarkTags.removeTagsFromBookmarks(['960'], undefined)
  bookmarkTags.removeTagsFromBookmarks(undefined, ['a'])

  eq(bookmarkTags.get('960'), ['a'])
})

test('移除全部标签后，get 返回 undefined（空标签不算命中）', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 970: ['a'] })
  bookmarkTags.removeTagsFromBookmarks(['970'], ['a'])

  assert.equal(bookmarkTags.get('970'), undefined)
  eq(bookmarkTags.getForResult({ id: '970' }), {})
})

test('收到 removedTags 消息时，从对应的收藏里移除标签', () => {
  const { bookmarkTags, dispatch } = loadBookmarkTags()

  bookmarkTags.add({ 980: ['a', 'b'], 981: ['a'] })
  dispatch({
    source: 'pixiv-downloader-bookmark-tags',
    removedTags: {
      bookmarkIds: ['980', '981', '982'],
      tags: ['a'],
    },
  })

  eq(bookmarkTags.get('980'), ['b'])
  assert.equal(bookmarkTags.get('981'), undefined)
  // 缓存里没有的收藏不会被创建
  assert.equal(bookmarkTags.get('982'), undefined)
})

// ---------- 匹配文件夹名字时优先使用缓存里的最新标签 ----------

test('getForMatch 优先返回缓存里的最新标签，而不是抓取结果里的旧标签', () => {
  const { bookmarkTags } = loadBookmarkTags()

  // 缓存里是最新的（用户刚添加的标签）
  bookmarkTags.add({ 1000: ['最新标签'] })

  // 抓取结果里是旧数据
  eq(bookmarkTags.getForMatch('1000', ['旧标签']), ['最新标签'])
})

test('getForMatch 在缓存里没有这个作品时，使用抓取结果里的数据', () => {
  const { bookmarkTags } = loadBookmarkTags()

  eq(bookmarkTags.getForMatch('1001', ['旧标签']), ['旧标签'])
  eq(bookmarkTags.getForMatch('1001'), [])
  eq(bookmarkTags.getForMatch(undefined, ['旧标签']), ['旧标签'])
  // 未收藏的作品 bmkId 是空字符串
  eq(bookmarkTags.getForMatch('', ['旧标签']), ['旧标签'])
})

test('getForMatch 在标签被删光后返回空数组，不会回退到旧标签', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 1002: ['会被删掉'] })
  bookmarkTags.removeTagsFromBookmarks(['1002'], ['会被删掉'])

  // 缓存里仍然有这个作品的记录（标签为空），所以不能用抓取结果里的旧标签
  eq(bookmarkTags.getForMatch('1002', ['会被删掉']), [])
})

test('getForMatch 支持数字收藏 id', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 1003: ['a'] })

  eq(bookmarkTags.getForMatch(1003, ['旧']), ['a'])
})

test('getLatest 只在缓存里没有记录时返回 undefined', () => {
  const { bookmarkTags } = loadBookmarkTags()

  bookmarkTags.add({ 1004: [] })
  bookmarkTags.add({ 1005: ['a'] })

  // 有记录但标签为空：返回空数组
  eq(bookmarkTags.getLatest('1004'), [])
  eq(bookmarkTags.getLatest('1005'), ['a'])
  // 没有记录：返回 undefined
  assert.equal(bookmarkTags.getLatest('1006'), undefined)
  assert.equal(bookmarkTags.getLatest(''), undefined)
  assert.equal(bookmarkTags.getLatest(undefined), undefined)
})
