'use strict'
// FileName.getMatchTagFolder 在匹配收藏标签时的数据来源：
// 优先使用 BookmarkTags 缓存里的最新标签（用户可能刚添加/移除了标签），
// 缓存里没有这个作品时才使用抓取结果里的旧数据。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 加载真实的 FileName.ts，只替换外部依赖 */
function loadFileName(settings, bookmarkTags) {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts', 'FileName.ts'),
    'utf8'
  )
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText

  const mocks = {
    './setting/Settings': { settings },
    './download/NovelSaveFormat': {
      novelSaveFormat: { getDefaultFormat: () => 'epub' },
    },
    './setting/NameRuleManager': { nameRuleManager: { getRule: () => '' } },
    './setting/SetUserName': {},
    './setting/SetTagAlias': { setTagAlias: { findAlias: () => undefined } },
    './store/Store': { store: {} },
    './Config': { Config: {} },
    './BookmarkTags': { bookmarkTags },
    './utils/DateFormat': { DateFormat: {} },
    './utils/Utils': {
      Utils: {
        replaceUnsafeStr: (str) => str,
        removeEmojis: (str) => str,
        handleWindowsReservedName: (str) => str,
      },
    },
    './FileNameNormalize': {
      fileNameNormalize: {
        removeStartChar: (str) => str,
        handleEdgeCases: (str) => str,
      },
    },
    './Tools': {
      Tools: {
        checkAIFromTags: () => false,
        getAgeLimit: () => '',
        getResultIndex: () => 0,
      },
    },
    './Log': { log: { log() {}, warning() {}, error() {} } },
    './Language': { lang: { transl: (key) => key } },
  }

  const exports = {}
  vm.runInNewContext(
    code,
    {
      exports,
      console,
      require(name) {
        assert.ok(name in mocks, `Missing dependency: ${name}`)
        return mocks[name]
      },
    },
    { filename: 'FileName.ts' }
  )
  return exports.fileName
}

/** 一份够用的设置 */
function makeSettings() {
  return {
    removeEmoji: false,
    createFolderByTag: true,
    createFolderTagList: [],
    createFolderTagList2: [],
    createFolderByBookmarkTag: true,
    createFolderBookmarkTagList: [],
    createFolderBookmarkTagList2: [],
  }
}

const flag1 = '{match_bookmark_tag_folder1}'

test('缓存里有这个作品时，用缓存里的最新标签来匹配（而不是抓取结果里的旧标签）', () => {
  const settings = makeSettings()
  // 用户设置的文件夹标签是「最新标签」，抓取结果里是「旧标签」
  settings.createFolderBookmarkTagList = ['最新标签']

  const calls = []
  const bookmarkTags = {
    getForMatch(bookmarkId, fallback) {
      calls.push({ bookmarkId, fallback })
      return ['最新标签']
    },
  }

  const fileName = loadFileName(settings, bookmarkTags)
  const value = fileName.getMatchTagFolder(flag1, flag1, {
    tags: ['旧标签'],
    bookmarkId: '1000',
    enabled: true,
    key: 'createFolderBookmarkTagList',
  })

  assert.equal(value, '最新标签')
  // 确实把收藏 id 和抓取结果里的标签传了进去
  assert.equal(calls.length, 1)
  assert.equal(calls[0].bookmarkId, '1000')
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0].fallback)), ['旧标签'])
})

test('缓存里没有这个作品时，会退回使用抓取结果里的标签', () => {
  const settings = makeSettings()
  settings.createFolderBookmarkTagList = ['旧标签']

  const bookmarkTags = {
    // 模拟缓存里没有记录：原样返回 fallback
    getForMatch(bookmarkId, fallback) {
      return fallback || []
    },
  }

  const fileName = loadFileName(settings, bookmarkTags)
  const value = fileName.getMatchTagFolder(flag1, flag1, {
    tags: ['旧标签'],
    bookmarkId: '2000',
    enabled: true,
    key: 'createFolderBookmarkTagList',
  })

  assert.equal(value, '旧标签')
})

test('标签被删光后（缓存返回空数组），不会匹配到已经删掉的旧标签', () => {
  const settings = makeSettings()
  settings.createFolderBookmarkTagList = ['旧标签']

  const bookmarkTags = {
    // 缓存里仍有这个作品，但标签已经被删光了
    getForMatch() {
      return []
    },
  }

  const fileName = loadFileName(settings, bookmarkTags)
  const value = fileName.getMatchTagFolder(flag1, flag1, {
    tags: ['旧标签'],
    bookmarkId: '3000',
    enabled: true,
    key: 'createFolderBookmarkTagList',
  })

  assert.equal(value, '')
})

test('没有收藏 id 时（作品本身的标签类标记），不会查询缓存', () => {
  const settings = makeSettings()
  settings.createFolderTagList = ['作品标签']

  let called = false
  const bookmarkTags = {
    getForMatch() {
      called = true
      return []
    },
  }

  const fileName = loadFileName(settings, bookmarkTags)
  const value = fileName.getMatchTagFolder(
    '{match_tag_folder1}',
    '{match_tag_folder1}',
    {
      tags: ['作品标签'],
      enabled: true,
      key: 'createFolderTagList',
    }
  )

  assert.equal(value, '作品标签')
  assert.equal(called, false)
})
