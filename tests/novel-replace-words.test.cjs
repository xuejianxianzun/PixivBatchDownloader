'use strict'
// ReplaceNovelWords 的测试：小说里「可置换单词」的替换规则。
//
// 这里最关键的是**不能替换方括号里的文字**：小说正文里的内嵌图片、分页标记都是用 [] 标记的，
// 例如 [uploadedimage:13309543]。如果替换到这些标记里，图片 id 就会变，下载会失败。
// 例外是：原单词本身含有 [] 时（例如 [LN:○○]），要原样替换。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

const glossaryKey = 'novel_series_glossary_1'

/** 系列设定资料：id → 原单词 */
function makeGlossary(words) {
  return {
    body: {
      categories: [
        {
          items: Object.entries(words).map(([id, name]) => ({
            id,
            name,
            ...{},
          })),
        },
      ],
    },
  }
}

/**
 * 加载真实的 ReplaceNovelWords。
 *
 * @param words 设定资料里的单词，key 是置换项 id，value 是原单词
 * @param setting 用户保存的置换配置。传 null 表示本地存储里没有这份数据
 * @param userId 当前登录用户，空字符串表示未登录
 */
function setup(words = {}, setting = {}, userId = '1') {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts/download/ReplaceNovelWords.ts'),
    'utf8'
  )
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText

  const calls = { glossary: 0 }
  const storage = {}
  if (setting !== null) {
    storage[glossaryKey] = JSON.stringify({
      123: { words: setting, loadTime: 0 },
    })
  }

  const mocks = {
    '../EVT': { EVT: { list: { downloadStart: 'downloadStart' } } },
    '../API': {
      API: {
        getNovelSeriesGlossary: async (seriesId) => {
          calls.glossary++
          return makeGlossary(words)
        },
      },
    },
    '../Log': { log: { log() {}, warning() {}, error() {} } },
    '../store/Store': { store: { loggedUserID: userId } },
    '../Language': { lang: { transl: (key) => key } },
  }

  const exports = {}
  vm.runInNewContext(
    code,
    {
      exports,
      console,
      localStorage: { getItem: (key) => storage[key] ?? null },
      window: { addEventListener() {} },
      require(name) {
        assert.ok(name in mocks, `Missing dependency: ${name}`)
        return mocks[name]
      },
    },
    { filename: 'ReplaceNovelWords.ts' }
  )
  return { replaceNovelWords: exports.replaceNovelWords, calls }
}

test('普通文字里的原单词会被全部替换', async () => {
  const { replaceNovelWords } = setup({ w1: 'abc' }, [{ id: 'w1', word: 'X' }])

  assert.equal(await replaceNovelWords.replace(123, 'abc 和 abc'), 'X 和 X')
})

test('不替换方括号里的标记', async () => {
  const { replaceNovelWords } = setup({ w1: 'abc' }, [{ id: 'w1', word: 'X' }])

  assert.equal(
    await replaceNovelWords.replace(123, '[uploadedimage:abc] abc'),
    '[uploadedimage:abc] X'
  )
  // 方括号内的文字整体不参与替换，方括号外的照常替换
  assert.equal(
    await replaceNovelWords.replace(123, '前 abc [abc] 后'),
    '前 X [abc] 后'
  )
})

test('原单词本身含有方括号时，原样替换', async () => {
  const { replaceNovelWords } = setup({ w1: '[LN:abc]' }, [
    { id: 'w1', word: '[LN:xyz]' },
  ])

  assert.equal(
    await replaceNovelWords.replace(123, 'a [LN:abc] b'),
    'a [LN:xyz] b'
  )
})

test('长单词优先替换，避免被短单词破坏', async () => {
  const { replaceNovelWords } = setup({ w1: 'abc', w2: 'abcd' }, [
    { id: 'w1', word: 'A' },
    { id: 'w2', word: 'B' },
  ])

  // 如果先替换 abc，abcd 会变成 Ad，就再也匹配不到 abcd 了
  assert.equal(await replaceNovelWords.replace(123, 'abcd'), 'B')
})

test('没有系列 id、正文为空、没有配置时都原样返回', async () => {
  const { replaceNovelWords } = setup({ w1: 'abc' }, [{ id: 'w1', word: 'X' }])
  assert.equal(await replaceNovelWords.replace(null, 'abc'), 'abc')
  assert.equal(await replaceNovelWords.replace(123, ''), '')

  // 本地存储里没有这份配置
  const noSetting = setup({ w1: 'abc' }, null)
  assert.equal(await noSetting.replaceNovelWords.replace(123, 'abc'), 'abc')

  // 未登录：不知道要读哪个用户的数据，也就不会替换
  const noUser = setup({ w1: 'abc' }, [{ id: 'w1', word: 'X' }], '')
  assert.equal(await noUser.replaceNovelWords.replace(123, 'abc'), 'abc')
})

test('同一个系列只读取一次设定资料', async () => {
  const { replaceNovelWords, calls } = setup({ w1: 'abc' }, [
    { id: 'w1', word: 'X' },
  ])

  await replaceNovelWords.replace(123, 'abc')
  await replaceNovelWords.replace(123, 'abc')
  assert.equal(calls.glossary, 1)
})
