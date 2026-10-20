'use strict'
// 收藏操作面板相关的纯逻辑测试：
// 1. 输入框里的文本解析为标签列表（逗号分隔、去掉开头的 #、丢弃空值）
// 2. “常用的标签”的计数、排序和数量上限
// 3. Tools.extractTags 的 'both' 模式下，原标签和它对应的翻译标签是相邻的（一一对应）
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 编译真实源码，只替换外部依赖 */
function loadSource(file, imports) {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'ts', file),
    'utf8'
  )
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText
  const exports = {}
  vm.runInNewContext(
    code,
    {
      exports,
      console,
      require(name) {
        assert.ok(name in imports, `Missing dependency: ${name}`)
        return imports[name]
      },
    },
    { filename: file }
  )
  return exports
}

/** 把 vm 里生成的值转换为主 realm 的普通值。
 * 否则 assert.deepEqual 会因为原型不同（两个 realm 的 Array/Object 不相等）而失败 */
function plain(value) {
  return JSON.parse(JSON.stringify(value))
}

const { parseTagInput, recordCommonTags, sortCommonTags } = loadSource(
  'utils/BookmarkPanelTags.ts',
  {}
)

// Tools 只在标签相关的几个方法里用到，这里只提供它需要的最小依赖
const { Tools } = loadSource('Tools.ts', {
  './Config': { Config: { mobile: false } },
  './Language': { lang: { htmlLangType: 'en' } },
  './NovelGenreConfig': { novelGenreMap: new Map() },
  './PageType': { pageType: { type: 0, list: {} } },
  './setting/Wiki': { wiki: { registerBtn() {} } },
  './utils/Utils': { Utils: { debounce: (fn) => fn } },
  './PPDTask': { ppdTask: { register() {} } },
  './utils/DateFormat': { DateFormat: {} },
  './API': { API: {} },
})

/** 构造一份图像作品数据。tags 里第 2 个标签没有翻译 */
function makeArtworkData(tags) {
  return {
    body: {
      illustType: 0,
      tags: { tags },
    },
  }
}

test('parseTagInput 使用逗号分隔，并去掉开头的 #', () => {
  assert.deepEqual(plain(parseTagInput('a,b')), ['a', 'b'])
  assert.deepEqual(plain(parseTagInput('#a,#b')), ['a', 'b'])
  // 只移除开头的一个 #
  assert.deepEqual(plain(parseTagInput('##a')), ['#a'])
})

test('parseTagInput 丢弃空值，并去掉两侧的空白', () => {
  assert.deepEqual(plain(parseTagInput('')), [])
  assert.deepEqual(plain(parseTagInput('  ')), [])
  assert.deepEqual(plain(parseTagInput(' a ,, b ,')), ['a', 'b'])
  assert.deepEqual(plain(parseTagInput('#, #')), [])
})

test('recordCommonTags 累加次数，新标签的次数是 1', () => {
  const old = [
    { tag: 'a', count: 3 },
    { tag: 'b', count: 1 },
  ]
  const result = recordCommonTags(old, ['a', 'c'])

  assert.deepEqual(plain(result), [
    { tag: 'a', count: 4 },
    { tag: 'b', count: 1 },
    { tag: 'c', count: 1 },
  ])
  // 不能就地修改传入的列表：设置里的值应该整体替换
  assert.deepEqual(old[0], { tag: 'a', count: 3 })
  assert.equal(old.length, 2)
})

test('recordCommonTags 传入空标签列表时原样返回', () => {
  const old = [{ tag: 'a', count: 1 }]
  assert.deepEqual(plain(recordCommonTags(old, [])), old)
  assert.deepEqual(plain(recordCommonTags([], [])), [])
})

test('sortCommonTags 按次数降序排列，并且不超过数量上限', () => {
  const list = [
    { tag: 'a', count: 1 },
    { tag: 'b', count: 5 },
    { tag: 'c', count: 3 },
    { tag: 'd', count: 9 },
  ]
  assert.deepEqual(plain(sortCommonTags(list, 30)), ['d', 'b', 'c', 'a'])
  assert.deepEqual(plain(sortCommonTags(list, 2)), ['d', 'b'])
  assert.deepEqual(plain(sortCommonTags([], 30)), [])
  // 不会修改传入的列表
  assert.deepEqual(list[0], { tag: 'a', count: 1 })
})

test("extractTags 'both' 默认先返回全部原标签，再返回全部翻译标签", () => {
  const data = makeArtworkData([
    { tag: 'aa', translation: { en: 'AA' } },
    { tag: 'bb' },
    { tag: 'cc', translation: { en: 'CC' } },
  ])

  // 这是原来的顺序，文件名里的 {tags_translate} 依赖它，不能变
  assert.deepEqual(plain(Tools.extractTags(data, 'both', 'check')), [
    'aa',
    'bb',
    'cc',
    'AA',
    'CC',
  ])
})

test("extractTags 'both' 传入 interleave 时原标签后面跟着它的翻译标签", () => {
  const data = makeArtworkData([
    { tag: 'aa', translation: { en: 'AA' } },
    { tag: 'bb' },
    { tag: 'cc', translation: { en: 'CC' } },
  ])

  // 只有收藏面板的标签列表需要这种成对的顺序
  assert.deepEqual(plain(Tools.extractTags(data, 'both', 'check', true)), [
    'aa',
    'AA',
    'bb',
    'cc',
    'CC',
  ])
})

test("extractTags 'origin' 只返回原标签", () => {
  const data = makeArtworkData([
    { tag: 'aa', translation: { en: 'AA' } },
    { tag: 'bb' },
  ])
  assert.deepEqual(plain(Tools.extractTags(data, 'origin')), ['aa', 'bb'])
  assert.deepEqual(plain(Tools.extractTags(data)), ['aa', 'bb'])
})

test("extractTags 'transl' 时，没有翻译的标签会回退为原标签", () => {
  const data = makeArtworkData([
    { tag: 'aa', translation: { en: 'AA' } },
    { tag: 'bb' },
    { tag: 'cc', translation: { en: 'CC' } },
  ])
  // 不能因为没有翻译就丢掉这个标签，否则按翻译后的标签进行检查时会漏掉它
  assert.deepEqual(plain(Tools.extractTags(data, 'transl', 'check')), [
    'AA',
    'bb',
    'CC',
  ])
})

test("extractTags 'both' 会去除重复的值", () => {
  const data = makeArtworkData([
    { tag: 'aa', translation: { en: 'aa' } },
    { tag: 'bb', translation: { en: 'BB' } },
    { tag: 'aa' },
  ])
  assert.deepEqual(plain(Tools.extractTags(data, 'both', 'check')), [
    'aa',
    'bb',
    'BB',
  ])
})
