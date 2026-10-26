'use strict'
// 导入收藏列表时的多文件合并测试。
//
// 收藏列表的数据量较大时，导出会被拆成多个 JSON 文件（单文件上限见 Config.exportFileByteLengthLimit）。
// 以前导入只读第一个文件，用户会以为导入成功，实际上少了一大半。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 排空 Promise 队列 */
async function flush() {
  for (let i = 0; i < 50; i++) {
    await Promise.resolve()
  }
}

/** 加载真实的 ImportBookmarkListAction.ts，外部依赖替换成替身 */
function createHarness(loaded) {
  const notices = []
  const toasts = []
  const msgBoxes = []
  /** addBookmarksInBatchs 收到的参数 */
  const batches = []

  const log = {}
  for (const type of ['log', 'success', 'warning', 'error']) {
    log[type] = (...args) =>
      notices.push({ type, text: args.map(String).join(' ') })
  }
  const toast = {}
  for (const type of ['show', 'success', 'warning', 'error']) {
    toast[type] = (msg) => toasts.push({ type, text: String(msg) })
  }

  const imports = {
    '../../Bookmark': {
      bookmark: {
        async getAllBookmarkList() {
          throw new Error('数据量小的时候不应该去读取已有的收藏列表')
        },
        addBookmarksInBatchs(list, oldList) {
          batches.push({ list, oldList })
        },
      },
    },
    '../../EVT': { EVT: { fire() {} } },
    '../../crawl/CrawlResult': {},
    '../../Language': {
      lang: { transl: (key, ...args) => [key, ...args].join(' ') },
    },
    '../../Log': { log },
    '../../MsgBox': {
      msgBox: { error: (msg) => msgBoxes.push({ type: 'error', text: msg }) },
    },
    '../../store/Store': { store: { loggedUserID: '1' } },
    '../../Toast': { toast },
    '../../utils/Utils': {
      Utils: {
        async loadJSONFilesWithFiles() {
          return loaded
        },
      },
    },
  }

  const source = fs.readFileSync(
    path.join(
      __dirname,
      '..',
      'src/ts/crawlMixedPage/bookmarkActions',
      'ImportBookmarkListAction.ts'
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
    { filename: 'ImportBookmarkListAction.ts' }
  )

  // 构造函数里给按钮绑定点击事件，这里把它抓出来手动触发
  let clickHandler = null
  const btn = {
    addEventListener(type, handler) {
      if (type === 'click') {
        clickHandler = handler
      }
    },
  }
  new exports.ImportBookmarkListAction(btn)

  return {
    notices,
    toasts,
    msgBoxes,
    batches,
    async click() {
      clickHandler()
      await flush()
    },
  }
}

function makeFile(name) {
  return { name }
}

function makeBookmark(id, type = 'illusts') {
  return { id, type, tags: [] }
}

test('选中多个文件时，把所有文件里的收藏合并到一起导入', async () => {
  const harness = createHarness({
    files: [makeFile('bookmark-part1.json'), makeFile('bookmark-part2.json')],
    data: [
      [makeBookmark('10001'), makeBookmark('10002')],
      [makeBookmark('20001', 'novels')],
    ],
  })
  await harness.click()

  assert.equal(harness.batches.length, 1, '应该只提交一次批量收藏')
  assert.equal(harness.batches[0].list.length, 3, '两个文件的数据都要导入')
  // 用字符串比较：数组是在 vm 里创建的，跨 realm 的 deepEqual 会因为原型不同而失败
  assert.equal(
    harness.batches[0].list.map((item) => item.id).join(','),
    '10001,10002,20001',
    '顺序要和用户选择的顺序一致'
  )
  // 作品数量要按合并后的总数显示
  assert.ok(harness.notices.some((n) => n.text === '_作品数量 3'))
  // 数据较多时会分成多个文件，要让用户看到本次导入的是哪几个文件
  assert.ok(
    harness.notices.some(
      (n) =>
        n.text === '_本次导入的文件 bookmark-part1.json, bookmark-part2.json'
    )
  )
})

test('单个文件时行为和以前一致', async () => {
  const harness = createHarness({
    files: [makeFile('bookmark.json')],
    data: [[makeBookmark('10001')]],
  })
  await harness.click()

  assert.equal(harness.batches.length, 1)
  assert.equal(harness.batches[0].list.length, 1)
  assert.ok(harness.notices.some((n) => n.text === '_作品数量 1'))
})

test('其中一个文件格式不对时，报格式错误且不导入任何数据', async () => {
  const harness = createHarness({
    files: [makeFile('bookmark-part1.json'), makeFile('bookmark-part2.json')],
    data: [[makeBookmark('10001')], []],
  })
  await harness.click()

  assert.equal(harness.batches.length, 0, '有文件不合法时不能导入一半数据')
  assert.ok(harness.toasts.some((t) => t.text === '_格式错误'))
})

test('取消选择文件时什么都不做', async () => {
  const harness = createHarness(undefined)
  await harness.click()

  assert.equal(harness.batches.length, 0)
  assert.equal(harness.toasts.length, 0)
  assert.equal(harness.msgBoxes.length, 0)
})
