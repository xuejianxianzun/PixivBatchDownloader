'use strict'
// Store 的测试：抓取结果如何组装，以及「色彩检查排除记录」如何应用。
//
// 这两块都是纯计算，但与下载结果直接相关：
// - addResult 决定一个作品会产生几条抓取结果、每条结果的 id 和图片地址；
// - 色彩记录决定重新生成结果时保留哪些图片（记录的含义取决于当时的「保留彩色/黑白」设置）。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 一份够用的设置 */
function makeSettings() {
  return {
    // 色彩检查：默认都关闭（等于不做色彩检查）
    downColorImg: false,
    downBlackWhiteImg: false,
  }
}

/** 加载真实的 Store.ts */
function loadStore(settings) {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts/store/Store.ts'),
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
    '../EVT': {
      EVT: {
        list: {
          crawlStart: 'crawlStart',
          downloadStop: 'downloadStop',
          resume: 'resume',
          addResult: 'addResult',
        },
        fire() {},
      },
    },
    // 多图作品的过滤规则有自己的测试（tests/multi-image-index.test.cjs），
    // 这里让它全部通过，只验证结果的组装
    '../filter/CheckIndexForMultiImageWork': {
      checkIndexForMultiImageWork: { check: () => true },
    },
    '../PageType': { pageType: { type: 0, list: ['home'] } },
    '../Tools': {
      Tools: {
        getLoggedUserID: () => '',
        getTagFromURL: () => '',
        getPageTitle: () => '',
        getPageIdFromURL: () => '',
      },
    },
    '../setting/Settings': { settings },
  }

  const exports = {}
  vm.runInNewContext(
    code,
    {
      exports,
      console,
      window: { addEventListener() {}, location: { href: '' } },
      require(name) {
        assert.ok(name in mocks, `Missing dependency: ${name}`)
        return mocks[name]
      },
    },
    { filename: 'Store.ts' }
  )
  return exports.store
}

/** 把 vm 里创建的数组转换成本 realm 的数组，便于用 deepEqual 比较 */
function plain(list) {
  return Array.from(list)
}

/** 一份刚够 addResult 使用的作品数据 */
function makeData(overrides = {}) {
  return {
    idNum: 100,
    id: '100',
    title: '标题',
    pageCount: 1,
    index: 0,
    type: 0,
    userId: '1',
    original: 'https://example.com/100_p0.jpg',
    regular: 'https://example.com/100_p0_m.jpg',
    small: 'https://example.com/100_p0_s.jpg',
    thumb: 'https://example.com/100_p0_s.jpg',
    ext: 'jpg',
    tags: [],
    tagsWithTransl: [],
    ...overrides,
  }
}

test('多图作品会为每张图片生成一条结果，并替换地址里的 p0', () => {
  const store = loadStore(makeSettings())

  store.addResult(makeData({ pageCount: 3 }))

  assert.equal(store.result.length, 3)
  assert.deepEqual(plain(store.result.map((item) => item.id)), [
    '100_p0',
    '100_p1',
    '100_p2',
  ])
  assert.deepEqual(plain(store.result.map((item) => item.index)), [0, 1, 2])
  assert.equal(store.result[1].original, 'https://example.com/100_p1.jpg')
  assert.equal(store.result[2].thumb, 'https://example.com/100_p2_s.jpg')
  assert.equal(store.downloadCount['100'], 3)
  // 元数据只保存一条
  assert.equal(store.resultMeta.length, 1)
})

test('同一个作品不会被重复添加', () => {
  const store = loadStore(makeSettings())
  store.addResult(makeData({ pageCount: 2 }))
  store.addResult(makeData({ pageCount: 2 }))

  assert.equal(store.result.length, 2)
  assert.equal(store.resultMeta.length, 1)
})

test('动图和小说只生成一条结果，小说的 id 不带图片序号', () => {
  const store = loadStore(makeSettings())

  store.addResult(makeData({ idNum: 200, type: 2, pageCount: 1 }))
  assert.equal(store.result.length, 1)
  // 只有插画、漫画的 id 带 _pN；动图下载的是 zip，没有图片序号
  assert.equal(store.result[0].id, '200')

  store.addResult(makeData({ idNum: 300, id: '300', type: 3 }))
  assert.equal(store.result.length, 2)
  assert.equal(store.result[1].id, '300')
})

test('色彩记录：同一侧时减掉被排除的图片', () => {
  const settings = makeSettings()
  settings.downColorImg = true
  const store = loadStore(settings)

  // 记录时的设置是「只保留彩色」，第 1、2 张没有通过检查
  store.setColorBlockedIndexes(100, [1, 2])

  const meta = { idNum: 100, type: 0, pageCount: 4, userId: '1' }
  assert.deepEqual(plain(store.getDownloadIndexes(meta)), [0, 3])
})

test('色彩记录：换到另一侧时，只保留被排除的图片', () => {
  const settings = makeSettings()
  settings.downColorImg = true
  const store = loadStore(settings)
  store.setColorBlockedIndexes(100, [1, 2])

  // 用户改成了「只保留黑白图片」：之前被排除的正是现在想要的
  settings.downColorImg = false
  settings.downBlackWhiteImg = true

  const meta = { idNum: 100, type: 0, pageCount: 4, userId: '1' }
  assert.deepEqual(plain(store.getDownloadIndexes(meta)), [1, 2])
})

test('色彩记录：没有记录、或者设置已经不再区分色彩时不应用', () => {
  const settings = makeSettings()
  settings.downColorImg = true
  const store = loadStore(settings)
  const meta = { idNum: 100, type: 0, pageCount: 4, userId: '1' }

  // 没有记录：这个作品从没检查过颜色，保持原样
  assert.deepEqual(plain(store.getDownloadIndexes(meta)), [0, 1, 2, 3])

  // 有记录，但两侧都启用（= 不检查颜色）：也不应用
  store.setColorBlockedIndexes(100, [1, 2])
  settings.downBlackWhiteImg = true
  assert.deepEqual(plain(store.getDownloadIndexes(meta)), [0, 1, 2, 3])
})

test('色彩记录：空记录表示「当时全部通过」，换侧后应该一张都不剩', () => {
  const settings = makeSettings()
  settings.downColorImg = true
  const store = loadStore(settings)
  // 空数组也要记录：它和「没有记录」的含义不同
  store.setColorBlockedIndexes(100, [])

  const meta = { idNum: 100, type: 0, pageCount: 3, userId: '1' }
  assert.deepEqual(plain(store.getDownloadIndexes(meta)), [0, 1, 2])

  // 换到另一侧：当时没有一张被排除，说明全都是彩色，现在只保留黑白 → 一张都不保留
  settings.downColorImg = false
  settings.downBlackWhiteImg = true
  assert.deepEqual(plain(store.getDownloadIndexes(meta)), [])
})
