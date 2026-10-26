'use strict'
// 下载记录「导出」和「导入」的容错测试（Issue #699）。
//
// 手机上导出下载记录时出现过两种现象：
// 1. 卡在 0/9 不动 —— 数据库不可用时 getAll 会失败，而导出流程没有捕获异常，
//    异常变成了异步监听器里的未处理拒绝，界面上什么都不显示，看起来就像卡住；
// 2. 刷新后记录全没 —— 记录可能已经被浏览器清掉了，但导出只会说「没有可用数据」，
//    用户无法知道数据是丢失了。
//
// 这里锁定几个行为：数据库不可用要明确提示、部分存储库失败不能报「导出成功」、
// 数据库为空但有历史标记时要提示数据可能被清除。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

const EVT_KEYS = new Proxy({}, { get: (_, key) => key })

/** 编译并加载真实的 DownloadRecordManager.ts，外部依赖全部替换成可控的替身 */
function createHarness(options = {}) {
  const notices = []
  const toasts = []
  const msgBoxes = []
  const exported = []
  const downloaded = []
  const imported = []
  /** 被清空的存储库 */
  const cleared = []
  /** json2BlobChunks 被调用时传入的上限 */
  const chunkCalls = []
  /** 每次分页读取的参数，用来确认「按页读、从上一页最后一条之后接着读」 */
  const pageCalls = []
  /** 弹了几次文件选择框 */
  const selectFileCalls = []
  const storage = new Map(Object.entries(options.storage || {}))

  const window = new EventTarget()
  window.confirm = () => true

  const log = {}
  for (const type of ['log', 'success', 'warning', 'error']) {
    log[type] = (...args) =>
      notices.push({ type, text: args.map(String).join(' ') })
  }
  const toast = {}
  for (const type of ['show', 'success', 'warning', 'error']) {
    toast[type] = (msg) => toasts.push({ type, text: String(msg) })
  }
  const msgBox = {}
  for (const type of ['show', 'success', 'warning', 'error']) {
    msgBox[type] = (msg) => msgBoxes.push({ type, text: String(msg) })
  }

  // 各存储库的数据由 options.getAll 决定：返回数组表示成功，抛错表示读取失败。
  // 用 options.pageSize 可以限制每页返回几条，用来模拟「一个存储库要读好几页」
  const IDB = {
    db: options.dbReady === false ? undefined : {},
    async getAllByPage(name, lastKey, count) {
      pageCalls.push({ name, lastKey, count })
      // 防死循环：如果分页的起点没往后走，测试应该立刻失败而不是一直转下去
      if (pageCalls.filter((call) => call.name === name).length > 100) {
        throw new Error(`分页没有前进：${name}`)
      }
      const handler = options.getAll ? options.getAll[name] : []
      if (handler instanceof Error) {
        throw handler
      }
      const list = handler || []
      let start = 0
      if (lastKey !== undefined) {
        const index = list.findIndex((item) => item.id === lastKey)
        // 找不到上一页的最后一条时认为是读完了，避免死循环
        start = index === -1 ? list.length : index + 1
      }
      const size = Math.min(count, options.pageSize || count)
      const page = list.slice(start, start + size)
      return page.length > 0 ? page : null
    },
    async clear(name) {
      cleared.push(name)
      if (options.clearError && options.clearError.includes(name)) {
        throw new Error('clear failed')
      }
    },
    async batchAddData(storeName, data) {
      if (options.batchError) {
        throw options.batchError
      }
      imported.push({ storeName, data })
    },
  }

  const Utils = {
    // 流式生成 JSON：每 2 条记录就生成一个文件（测试里用小的分片粒度，
    // 这样才能验证「边读边生成、生成完立刻下载」的行为）。
    // items 是一批一批交出来的（和真实的 iterateRecords 一样）
    async json2BlobChunksBatched(batches, maxBytes, onFile) {
      chunkCalls.push({ maxBytes })
      let count = 0
      for await (const batch of batches) {
        for (const item of batch) {
          count++
          if (count % 2 === 0) {
            await onFile('blob:record', 2)
          }
        }
      }
      if (count % 2 === 1) {
        await onFile('blob:record', count % 2)
      }
      return count
    },
    downloadFile(url, fileName, revokeDelay) {
      downloaded.push({ url, fileName, revokeDelay })
    },
    async selectFile() {
      selectFileCalls.push(1)
      return options.txtFiles
    },
    async loadJSONFilesWithFiles() {
      if (!options.files) {
        return undefined
      }
      // 按数据个数生成文件名，体积由 options.fileSizes 指定（默认 1000 字节）
      const sizes = options.fileSizes || options.files.map(() => 1000)
      const files = options.files.map((data, index) => ({
        name: `record-part${index + 1}.json`,
        size: sizes[index] === undefined ? 0 : sizes[index],
      }))
      return { files, data: options.files }
    },
  }

  const imports = {
    '../utils/IndexedDB': {
      IndexedDB: { getErrorName: (e) => String(e?.message || e) },
    },
    '../Language': {
      lang: { transl: (key, ...args) => [key, ...args].join(' ') },
    },
    '../Log': { log },
    '../Toast': { toast },
    '../MsgBox': { msgBox },
    '../utils/Utils': { Utils },
    '../Tools': {
      Tools: { formatDateTimeInFilename: () => '2026-01-01 00-00-00' },
    },
    '../Config': {
      Config: {
        exportFileByteLengthLimit: 1000,
        mobile: options.mobile === true,
      },
    },
    './DownloadRecord': {},
    '../EVT': { EVT: { list: EVT_KEYS, fire: () => {} } },
    'webextension-polyfill': {
      storage: {
        local: {
          async get(key) {
            return { [key]: storage.get(key) }
          },
          async set(obj) {
            for (const key of Object.keys(obj)) {
              storage.set(key, obj[key])
            }
          },
        },
      },
    },
  }

  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts/download', 'DownloadRecordManager.ts'),
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
      window,
      setTimeout,
      require(name) {
        assert.ok(name in imports, `Missing dependency: ${name}`)
        return imports[name]
      },
    },
    { filename: 'DownloadRecordManager.ts' }
  )

  // 和真实模块一样，记录按 id 的首位分到 9 个存储库
  const storeNames = []
  for (let i = 1; i <= 9; i++) {
    storeNames.push(`record${i}`)
  }
  new exports.DownloadRecordManager(IDB, storeNames)

  return {
    window,
    notices,
    toasts,
    msgBoxes,
    exported,
    downloaded,
    imported,
    cleared,
    chunkCalls,
    pageCalls,
    selectFileCalls,
    storage,
  }
}

/** 排空 Promise 队列，不依赖真实时间。
 * 次数要给足：流式导出里每个存储库、每条记录、每个文件都至少是一次 await */
async function flush() {
  for (let i = 0; i < 500; i++) {
    await Promise.resolve()
  }
}

/** 触发导出事件并等待流程执行完 */
async function runExport(harness) {
  harness.window.dispatchEvent(new Event(EVT_KEYS.exportDownloadRecord))
  await flush()
}

/** 触发导入事件并等待流程执行完 */
async function runImport(harness) {
  harness.window.dispatchEvent(new Event(EVT_KEYS.importDownloadRecord))
  await flush()
}

/** 按 id 首位造一条记录 */
function makeRecord(index) {
  return { id: `${index}`, n: `file-${index}.png` }
}

test('数据库不可用时要明确提示，而不是静默卡住', async () => {
  const harness = createHarness({ dbReady: false })
  await runExport(harness)

  assert.ok(
    harness.notices.some((n) => n.text.startsWith('_下载记录数据库不可用')),
    '应该在日志里提示数据库不可用'
  )
  assert.ok(
    harness.toasts.some((t) => t.text.startsWith('_下载记录数据库不可用')),
    '应该弹出轻提示'
  )
  // 没有数据可导出，不应该生成任何文件
  assert.equal(harness.downloaded.length, 0)
  assert.equal(harness.chunkCalls.length, 0)
})

test('部分存储库读取失败时，仍然导出其余数据，但不能报「导出成功」', async () => {
  const harness = createHarness({
    getAll: {
      record1: [{ id: '1234', n: 'a.png' }],
      record2: new Error('getAll failed'),
    },
  })
  await runExport(harness)

  // 成功读取的那个存储库的数据要照常导出
  assert.equal(harness.downloaded.length, 1)

  assert.ok(
    harness.msgBoxes.some((m) => m.text.startsWith('_部分下载记录导出失败 1')),
    '应该如实报告失败的存储库数量'
  )
  assert.ok(
    !harness.notices.some((n) => n.text === '_导出成功'),
    '有失败时不能报告导出成功'
  )
  // 有失败时导出的记录数偏小，不能拿这个偏小的值覆盖「上次已知的记录数」，
  // 否则之后记录真的被浏览器清掉时就判断不出来了
  assert.equal(harness.storage.has('downloadRecordLastCount'), false)
})

test('数据库为空但上次导出有记录时，提示记录可能被浏览器清除', async () => {
  const harness = createHarness({ storage: { downloadRecordLastCount: 5000 } })
  await runExport(harness)

  assert.ok(
    harness.msgBoxes.some(
      (m) =>
        m.text.startsWith('_下载记录可能已被浏览器清除') &&
        m.text.includes('5000')
    ),
    '应该提示数据可能已被清除，并带上上次的记录数'
  )
  // 提醒一次之后把标记归零，避免每次导出都重复提示
  assert.equal(harness.storage.get('downloadRecordLastCount'), 0)

  await runExport(harness)
  assert.ok(
    harness.toasts.some((t) => t.text.startsWith('_没有数据可供使用')),
    '标记归零后再导出，应该只是普通的「没有数据」'
  )
})

test('导出成功时使用配置里的单文件上限，并记录本次的记录数', async () => {
  const harness = createHarness({
    getAll: {
      record1: [
        { id: '1234', n: 'a.png' },
        { id: '2234', n: 'b.png' },
      ],
      record2: [{ id: '3234', n: 'c.png' }],
    },
  })
  await runExport(harness)

  // 必须把 Config 里的上限传给生成文件的函数（移动端会用更小的值）
  assert.equal(harness.chunkCalls.length, 1)
  assert.equal(harness.chunkCalls[0].maxBytes, 1000)

  // 3 条记录分成 2 个文件（mock 里每 2 条生成一个），生成完就立刻下载
  assert.equal(harness.downloaded.length, 2)
  assert.equal(harness.storage.get('downloadRecordLastCount'), 3)
  assert.ok(harness.notices.some((n) => n.text === '_导出成功'))
  // 每生成一个文件都会打一条进度日志
  assert.ok(
    harness.notices.some((n) => n.text.startsWith('_下载记录分片导出进度')),
    '应该显示分片导出的进度'
  )
})

test('一个存储库要读好几页时，所有记录都要导出（不能只导出第一页）', async () => {
  const harness = createHarness({
    // 每页只给 2 条，模拟「一个存储库的记录远大于单页」
    pageSize: 2,
    getAll: {
      record1: [
        { id: '10001', n: 'a.png' },
        { id: '10002', n: 'b.png' },
        { id: '10003', n: 'c.png' },
        { id: '10004', n: 'd.png' },
        { id: '10005', n: 'e.png' },
      ],
    },
  })
  await runExport(harness)

  // 只看有数据的那个存储库：5 条 / 每页 2 条 = 3 页，最后还要再读一次确认读完了
  const pages = harness.pageCalls.filter((call) => call.name === 'record1')
  assert.equal(pages.length, 4, '应该一直读到读不出数据为止')
  assert.equal(pages[0].lastKey, undefined, '第一页不带起点')
  assert.equal(pages[1].lastKey, '10002', '下一页从上一页最后一条之后开始')
  assert.equal(pages[2].lastKey, '10004')

  // 导出的记录总数要是 5，不能只有第一页的 2 条
  assert.equal(harness.storage.get('downloadRecordLastCount'), 5)
  // mock 里每 2 条生成一个文件：2 + 2 + 1 = 3 个文件
  assert.equal(harness.downloaded.length, 3)
  assert.ok(harness.notices.some((n) => n.text === '_导出成功'))
})

test('读取全部失败时不生成空文件，也不报「没有数据」以外的东西', async () => {
  const harness = createHarness({
    getAll: {
      record1: new Error('getAll failed'),
      record2: new Error('getAll failed'),
    },
  })
  await runExport(harness)

  assert.equal(harness.downloaded.length, 0, '没有数据时不应该生成文件')
  assert.ok(
    harness.msgBoxes.some((m) => m.text.startsWith('_部分下载记录导出失败 2'))
  )
  assert.ok(!harness.notices.some((n) => n.text === '_导出成功'))
})

test('导入时按 id 的首位分桶，多个文件合并后一起导入', async () => {
  const harness = createHarness({
    // 两个文件：第一条属于 record1，第二条属于 record2；第三个文件里的属于 record9
    files: [
      [makeRecord('1000000001'), makeRecord('2000000002')],
      [makeRecord('9000000009')],
    ],
  })
  await runImport(harness)

  // 只有非空的桶才会写库
  assert.equal(harness.imported.length, 3)
  assert.deepEqual(
    JSON.stringify(harness.imported.map((item) => item.storeName)),
    JSON.stringify(['record1', 'record2', 'record9'])
  )
  assert.equal(harness.imported[0].data.length, 1)
  assert.equal(harness.imported[0].data[0].id, '1000000001')

  assert.ok(
    harness.notices.some((n) => n.text === `_待处理 1`) ||
      harness.notices.some((n) => n.text.startsWith('_待处理')),
    '应该显示每个库待处理的数量'
  )
  assert.ok(harness.notices.some((n) => n.text === '_导入成功'))
  assert.equal(harness.storage.get('downloadRecordLastCount'), 3)
})

test('导入时某个存储库写入失败，要报错而不是报成功', async () => {
  const harness = createHarness({
    files: [[makeRecord('1000000001'), makeRecord('2000000002')]],
    batchError: new Error('QuotaExceededError'),
  })
  await runImport(harness)

  assert.ok(
    harness.msgBoxes.some((m) => m.text === 'QuotaExceededError'),
    '应该显示写入失败的原因'
  )
  assert.ok(!harness.notices.some((n) => n.text === '_导入成功'))
  assert.ok(!harness.toasts.some((t) => t.text === '_导入成功'))
  // 一条都没写进去，标记不应该被更新
  assert.equal(harness.storage.get('downloadRecordLastCount'), undefined)
})

test('id 首位不是 1~9 的记录会被跳过，且不能报导入成功', async () => {
  const harness = createHarness({
    files: [[makeRecord('0000000001'), makeRecord('1000000002')]],
  })
  await runImport(harness)

  // 只剩下属于 record1 的那一条
  assert.equal(harness.imported.length, 1)
  assert.equal(harness.imported[0].storeName, 'record1')
  // 有一条没被导入，所以 total 大于 stored，不能报成功
  assert.ok(!harness.notices.some((n) => n.text === '_导入成功'))
})

test('清空下载记录时 9 个存储库都会被清掉', async () => {
  const harness = createHarness({})
  harness.window.dispatchEvent(new Event(EVT_KEYS.clearDownloadRecord))
  await flush()

  assert.equal(harness.cleared.length, 9, '9 个存储库都要清空')
  // 每清完一个存储库就要报一次进度，不能让用户干等
  for (let i = 1; i <= 9; i++) {
    assert.ok(
      harness.notices.some((n) => n.text === `_任务进度 ${i}/9`),
      `缺少进度 _任务进度 ${i}/9`
    )
  }
  assert.ok(harness.notices.some((n) => n.text === '_下载记录已清除'))
  // 用户主动清空的，标记要归零，之后导出不会误报「记录被清除」
  assert.equal(harness.storage.get('downloadRecordLastCount'), 0)
})

test('清空时部分存储库失败，不能报「已清除」', async () => {
  const harness = createHarness({
    clearError: ['record3', 'record7'],
  })
  harness.window.dispatchEvent(new Event(EVT_KEYS.clearDownloadRecord))
  await flush()

  // 失败的库也尝试过了，其他库照样清空
  assert.equal(harness.cleared.length, 9)
  // 清成功的 7 个库各报一次进度
  for (let i = 1; i <= 7; i++) {
    assert.ok(
      harness.notices.some((n) => n.text === `_任务进度 ${i}/9`),
      `缺少进度 _任务进度 ${i}/9`
    )
  }
  assert.ok(
    harness.msgBoxes.some((m) =>
      m.text.startsWith('_部分下载记录清除失败 2 9')
    ),
    '应该如实报告有几个存储库没清掉'
  )
  assert.ok(!harness.notices.some((n) => n.text === '_下载记录已清除'))
  assert.ok(!harness.toasts.some((t) => t.text === '_下载记录已清除'))
})

test('数据库不可用时，清空和 TXT 导入也要明确提示，不能报「清除失败」', async () => {
  const harness = createHarness({ dbReady: false })

  // 清空：以前会 9 个库全部失败，用户看到「有 9 个存储库清除失败（共 9 个）」这种误导性的信息
  harness.window.dispatchEvent(new Event(EVT_KEYS.clearDownloadRecord))
  await flush()
  assert.ok(
    harness.toasts.some((t) => t.text.startsWith('_下载记录数据库不可用'))
  )
  assert.equal(harness.cleared.length, 0, '不应该去操作不存在的数据库')
  assert.ok(
    !harness.msgBoxes.some((m) => m.text.startsWith('_部分下载记录清除失败'))
  )

  // TXT 导入：连文件选择框都不该弹出来
  harness.window.dispatchEvent(new Event(EVT_KEYS.importDownloadRecordTXT))
  await flush()
  assert.ok(
    harness.toasts.some((t) => t.text.startsWith('_下载记录数据库不可用'))
  )
  assert.equal(harness.selectFileCalls.length, 0, '不应该弹出文件选择框')
})

test('导入时在日志里显示本次导入的文件名', async () => {
  const harness = createHarness({
    files: [[makeRecord('1000000001')], [makeRecord('2000000002')]],
  })
  await runImport(harness)

  assert.ok(
    harness.notices.some(
      (n) => n.text === '_本次导入的文件 record-part1.json, record-part2.json',
      '应该显示本次导入的所有文件名'
    )
  )
})

test('移动端导入的总体积超过 100 MB 时给出提示', async () => {
  const harness = createHarness({
    mobile: true,
    files: [[makeRecord('1000000001')], [makeRecord('2000000002')]],
    // 两个文件合计 101 MB（移动端的上限是 100 MB）
    fileSizes: [52428800, 106954752],
  })
  await runImport(harness)

  assert.ok(
    harness.notices.some(
      (n) => n.type === 'warning' && n.text === '💡_移动端导入体积提示'
    ),
    '超过 100 MB 时应该给出警告'
  )
  // 只是提示，不应该阻止导入
  assert.ok(harness.notices.some((n) => n.text === '_导入成功'))
})

test('移动端导入的总体积正好是 100 MB 时不给提示', async () => {
  const harness = createHarness({
    mobile: true,
    files: [[makeRecord('1000000001')], [makeRecord('2000000002')]],
    fileSizes: [52428800, 52428800],
  })
  await runImport(harness)

  assert.ok(
    !harness.notices.some((n) => n.text.includes('_移动端导入体积提示')),
    '正好 100 MB 时不需要提示'
  )
})

test('桌面端导入体积再大也不显示移动端的提示', async () => {
  const harness = createHarness({
    mobile: false,
    files: [[makeRecord('1000000001')]],
    fileSizes: [524288000, 524288000],
  })
  await runImport(harness)

  assert.ok(
    !harness.notices.some((n) => n.text.includes('_移动端导入体积提示')),
    '桌面端不该显示这条提示'
  )
})

test('从 TXT 文件导入时也会显示文件名和移动端体积提示', async () => {
  const harness = createHarness({
    mobile: true,
    // 单个文件 101 MB，超过移动端的 100 MB 上限
    txtFiles: [
      {
        name: 'id-list.txt',
        size: 106954752,
        text: async () => '1000000001\r\n2000000002',
      },
    ],
  })
  harness.window.dispatchEvent(new Event(EVT_KEYS.importDownloadRecordTXT))
  await flush()

  assert.ok(
    harness.notices.some(
      (n) => n.text === '_本次导入的文件 id-list.txt',
      '应该显示 TXT 文件的文件名'
    )
  )
  assert.ok(
    harness.notices.some(
      (n) => n.type === 'warning' && n.text === '💡_移动端导入体积提示'
    ),
    'TXT 文件太大时也要给出警告'
  )
  // 提示不应该阻止导入
  assert.ok(harness.imported.length > 0)
  assert.ok(harness.notices.some((n) => n.text === '_导入成功'))
})

test('TXT 文件较小时不显示移动端体积提示', async () => {
  const harness = createHarness({
    mobile: true,
    txtFiles: [
      { name: 'id-list.txt', size: 1024, text: async () => '1000000001' },
    ],
  })
  harness.window.dispatchEvent(new Event(EVT_KEYS.importDownloadRecordTXT))
  await flush()

  assert.ok(
    !harness.notices.some((n) => n.text.includes('_移动端导入体积提示')),
    '文件不大时不需要提示'
  )
})
