'use strict'
// checkIndexForMultiImageWork 的测试。
//
// 它决定多图作品里的哪几张图片会被保存。规则组合起来不太直观：
// - 「不抓取」类规则优先于「只抓取」类规则；
// - 同时启用「只抓前 N」和「只抓后 M」时用 OR（保留首尾、丢掉中间）；
// - 只启用其中一个时才用 AND；
// - 排除的数量大于图片数时，仍然会保留一张。
// 这些规则一旦写错，会静默地少下载或多下载图片。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 一份什么都没启用的设置 */
function makeSettings() {
  return {
    onlyCrawlFirstFewImagesSwitch: false,
    onlyCrawlFirstFewImagesCount: 0,
    onlyCrawlLastFewImagesSwitch: false,
    onlyCrawlLastFewImagesCount: 0,
    doNotCrawlFirstImagesSwitch: false,
    doNotCrawlFirstImagesCount: 0,
    doNotCrawlLastImagesSwitch: false,
    doNotCrawlLastImagesCount: 0,
    DoNotDownloadLastFewImagesList: [],
  }
}

/** 加载真实的 CheckIndexForMultiImageWork.ts */
function loadFilter(settings) {
  const source = fs.readFileSync(
    path.join(
      __dirname,
      '..',
      'src/ts/filter',
      'CheckIndexForMultiImageWork.ts'
    ),
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
    '../Language': { lang: { transl: (key) => key } },
    '../Log': { log: { warning() {} } },
    '../setting/Settings': { settings },
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
    { filename: 'CheckIndexForMultiImageWork.ts' }
  )
  return exports.checkIndexForMultiImageWork
}

/** 对 0 ~ pageCount-1 逐个调用 check，返回保留下来的索引 */
function keepIndexes(settings, pageCount, userId = '1') {
  const filter = loadFilter(settings)
  const result = []
  for (let index = 0; index < pageCount; index++) {
    if (filter.check(index, pageCount, userId)) {
      result.push(index)
    }
  }
  return result
}

test('没有启用任何规则时，保留全部图片', () => {
  assert.deepEqual(keepIndexes(makeSettings(), 6), [0, 1, 2, 3, 4, 5])
})

test('只抓取前 N 张 / 只抓取后 N 张', () => {
  const first = makeSettings()
  first.onlyCrawlFirstFewImagesSwitch = true
  first.onlyCrawlFirstFewImagesCount = 2
  assert.deepEqual(keepIndexes(first, 6), [0, 1])

  const last = makeSettings()
  last.onlyCrawlLastFewImagesSwitch = true
  last.onlyCrawlLastFewImagesCount = 2
  assert.deepEqual(keepIndexes(last, 6), [4, 5])
})

test('同时启用「只抓前」和「只抓后」时用 OR：保留首尾、丢掉中间', () => {
  const settings = makeSettings()
  settings.onlyCrawlFirstFewImagesSwitch = true
  settings.onlyCrawlFirstFewImagesCount = 2
  settings.onlyCrawlLastFewImagesSwitch = true
  settings.onlyCrawlLastFewImagesCount = 2

  assert.deepEqual(keepIndexes(settings, 6), [0, 1, 4, 5])
})

test('「不抓取」类规则优先于「只抓取」类规则', () => {
  const settings = makeSettings()
  // 只抓前 2 张（允许 0、1）
  settings.onlyCrawlFirstFewImagesSwitch = true
  settings.onlyCrawlFirstFewImagesCount = 2
  // 但不抓前 2 张（排除 0、1）——排除优先，于是这个作品一张都不剩
  settings.doNotCrawlFirstImagesSwitch = true
  settings.doNotCrawlFirstImagesCount = 2

  assert.deepEqual(keepIndexes(settings, 6), [])
})

test('排除的数量大于等于图片数量时，仍然保留一张', () => {
  // 不抓前 N 张时保留最后一张
  const first = makeSettings()
  first.doNotCrawlFirstImagesSwitch = true
  first.doNotCrawlFirstImagesCount = 6
  assert.deepEqual(keepIndexes(first, 6), [5])

  // 不抓后 N 张时保留第一张
  const last = makeSettings()
  last.doNotCrawlLastImagesSwitch = true
  last.doNotCrawlLastImagesCount = 6
  assert.deepEqual(keepIndexes(last, 6), [0])
})

test('特定用户的多图作品：排除最后 N 张（数量过大时只排除最后一张）', () => {
  const settings = makeSettings()
  settings.DoNotDownloadLastFewImagesList = [{ uid: 123, value: 2 }]
  // 作品不属于这个用户时不受影响
  assert.deepEqual(keepIndexes(settings, 6, '999'), [0, 1, 2, 3, 4, 5])
  assert.deepEqual(keepIndexes(settings, 6, '123'), [0, 1, 2, 3])

  // 数量大于等于图片数量时，只排除最后一张（与其他规则不同，这是特意为之）
  settings.DoNotDownloadLastFewImagesList = [{ uid: 123, value: 10 }]
  assert.deepEqual(keepIndexes(settings, 6, '123'), [0, 1, 2, 3, 4])
})
