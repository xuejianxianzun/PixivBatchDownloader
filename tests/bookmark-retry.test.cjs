'use strict'
// 收藏功能的容错测试：
// 1. Bookmark.sendRequest 对「请求本身失败」（断网级）的短重试，以及 400 / 403 的既有行为
// 2. 四个批量收藏模块如实报告失败数量（不再把失败算成成功）
// 3. BookmarkAfterDL 在外层把失败的作品重新排队，等网络恢复后自动补上
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')
// 使用现有翻译键做断言，避免依赖任何个人翻译或界面改动
const language = { transl: (key, ...args) => [key, ...args].join(' ') }

/** 编译真实源码，只替换外部依赖 */
function loadSource(file, imports, globals) {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts', file),
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
      ...globals,
      require(name) {
        assert.ok(name in imports, `Missing dependency: ${name}`)
        return imports[name]
      },
    },
    { filename: file }
  )
  return exports
}

function makeElement() {
  const classes = new Set()
  return {
    textContent: '',
    dataset: {},
    disabled: false,
    style: {},
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
    },
    setAttribute() {
      this.disabled = true
    },
    removeAttribute() {
      this.disabled = false
    },
    querySelector: () => null,
    addEventListener() {},
    append() {},
  }
}

/** 排空 Promise，不触发真实时间等待 */
async function flush() {
  for (let i = 0; i < 30; i++) {
    await Promise.resolve()
  }
}

/**
 * 可推进的假时钟 + 假定时器 + 可控 fetch + 记录 log / toast / EVT。
 *
 * 模块里的 Date.now() 也跟着假时钟走（收藏重试用它计算下次重试时间），
 * EVT.fire 会真的在 window 上派发事件，所以驱动事件的功能模块也能测。
 */
function createHarness() {
  let now = 0
  let timerID = 0
  const timers = new Map()
  const notices = []
  const toasts = []
  const firedEvents = []
  const fetchCalls = []
  const fetchPlan = []
  const states = { apiRequestCount: 0, accountWarning: false, busy: false }
  const settings = {
    slowCrawlDealy: 0,
    widthTagBoolean: true,
    restrictBoolean: false,
    bmkAfterDL: true,
  }
  const store = { result: [], resultMeta: [], loggedUserID: '1' }

  const FakeDate = new Proxy(Date, {
    get(target, prop, receiver) {
      if (prop === 'now') return () => now
      return Reflect.get(target, prop, receiver)
    },
  })
  const window = new EventTarget()
  window.setTimeout = (fn, delay) => {
    const id = ++timerID
    timers.set(id, { fn, at: now + delay })
    return id
  }
  window.clearTimeout = (id) => timers.delete(id)

  const log = {}
  for (const type of [
    'log',
    'success',
    'warning',
    'error',
    'persistentRefresh',
  ]) {
    log[type] = (...args) => notices.push({ type, args: args.map(String) })
  }
  const toast = {}
  for (const type of ['show', 'success', 'warning', 'error']) {
    toast[type] = (msg, arg) =>
      toasts.push({ type, msg: String(msg), arg: arg || {} })
  }
  const lang = {
    transl: language.transl,
    register() {},
    updateText(el, key, ...args) {
      el.textContent = key ? language.transl(key, ...args) : ''
    },
  }
  const EVT = {
    list: new Proxy({}, { get: (_, key) => key }),
    fire(type, data) {
      firedEvents.push(type)
      const event = new Event(type)
      event.detail = { data }
      window.dispatchEvent(event)
    },
  }
  const Utils = {
    sleep: (ms) => new Promise((resolve) => window.setTimeout(resolve, ms)),
    debounce: (fn) => fn,
    deepCopy: (obj) => JSON.parse(JSON.stringify(obj)),
  }
  const Tools = {
    createWorkLink: (id) => `link/${id}`,
    createWorkLinkByIDData: (data) => `link/${data.id}`,
    addBookmark403Error: () => '403 error',
    extractTags: () => [],
  }
  const stubAPI = {
    getBookmarkData: async () => ({ body: { works: [], total: 0 } }),
    getArtworkData: async () => ({ body: {} }),
    getNovelData: async () => ({ body: {} }),
    addBookmark: async () => ({}),
  }
  const tokenStub = { token: 'test_token', reset: async () => 'new_token' }

  // 每次请求的行为由队列决定：{reject:true} = 网络中断；{status:403} = 请求成功但状态码异常
  const fetchMock = async (url, init) => {
    const step = fetchPlan.shift() || { status: 200 }
    fetchCalls.push({ url, at: now, plan: step })
    if (step.reject) {
      // 网络中断时原生 fetch 抛出没有 status 的 TypeError
      throw new TypeError('Failed to fetch')
    }
    const status = step.status || 200
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText: 'OK',
      json: async () => ({ error: false, body: {} }),
      text: async () => '',
      blob: async () => new Blob([]),
    }
  }

  const globals = {
    window,
    document: { createElement: () => makeElement(), body: { append() {} } },
    fetch: fetchMock,
    Blob: globalThis.Blob,
    TypeError,
    Date: FakeDate,
  }

  /** 同一个依赖在顶层模块里是 './x'，在子目录模块里是 '../x' */
  function buildImports(extra = {}) {
    const imports = {}
    const both = (name, value) => {
      imports['./' + name] = value
      imports['../' + name] = value
    }
    both('AccountWarning', { canRequestInBatch: () => true })
    both('API', { API: extra.API || stubAPI })
    both('Tools', { Tools })
    both('Toast', { toast })
    both('Language', { lang })
    both('Log', { log })
    both('MsgBox', {
      msgBox: {
        error: (...args) => notices.push({ type: 'msgBoxError', args }),
        show: (...args) => notices.push({ type: 'msgBoxShow', args }),
      },
    })
    both('EVT', { EVT })
    both('filter/Filter', { filter: { checkNotExcluded: () => true } })
    both('setting/Settings', { settings, setSetting() {} })
    both('utils/Utils', { Utils })
    both('Config', { Config: { retryTime: 200000, mobile: false } })
    both('store/States', { states })
    both('store/Store', { store })
    both('Token', { token: tokenStub })
    both('Bookmark', { bookmark: extra.bookmark })
    both('PPDTask', { ppdTask: { register() {} } })
    return imports
  }

  return {
    fetchPlan,
    fetchCalls,
    notices,
    toasts,
    firedEvents,
    states,
    settings,
    store,
    EVT,
    load: (file, extra) => loadSource(file, buildImports(extra), globals),
    get now() {
      return now
    },
    /** 推进假时钟：每轮先 flush，异步链可能刚刚才注册下一个定时器 */
    async advance(ms) {
      const end = now + ms
      for (let guard = 0; guard < 200000; guard++) {
        await flush()
        const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0]
        if (!next || next[1].at > end) break
        now = next[1].at
        timers.delete(next[0])
        next[1].fn()
      }
      now = end
      await flush()
    },
    warnings: () => notices.filter((item) => item.type === 'warning'),
    errors: () => notices.filter((item) => item.type === 'error'),
    msgBoxErrors: () => notices.filter((item) => item.type === 'msgBoxError'),
    successes: () => notices.filter((item) => item.type === 'success'),
    /** 假 bookmark 模块。这些模块完成时会调用 `bookmark.showCompleteMessage`，
     *  所以假模块也要带上它（行为复刻 src/ts/Bookmark.ts）。
     *  ⚠️ 改动 `Bookmark.showCompleteMessage` 时这里要同步。 */
    makeBookmark: (add) => ({
      add,
      showCompleteMessage(failed) {
        const completeMsg = '♥️' + language.transl('_收藏作品完毕')
        if (failed > 0) {
          log.error(
            completeMsg +
              ' ' +
              language.transl('_有x个作品失败请再次执行重试', String(failed))
          )
          toast.error(language.transl('_收藏作品完毕但是有一些失败了'))
        } else {
          log.success(completeMsg)
          toast.success(completeMsg)
        }
      },
    }),
    /** 相邻两次请求之间的间隔（毫秒） */
    gaps() {
      const result = []
      for (let i = 1; i < fetchCalls.length; i++) {
        result.push(fetchCalls[i].at - fetchCalls[i - 1].at)
      }
      return result
    },
    lastToast: () => toasts[toasts.length - 1],
  }
}

/** 真实的 API.ts + 真实的 Bookmark.ts，请求由 mock fetch 驱动 */
function realBookmark() {
  const harness = createHarness()
  const API = harness.load('API.ts').API
  const bookmark = harness.load('Bookmark.ts', { API }).bookmark
  return { harness, bookmark }
}

/** 跑一个 add 调用，返回最终结果（用假时钟把内部重试全部走完） */
async function runAdd(harness, promise, ms = 120000) {
  let settled = false
  let value
  let error
  promise.then(
    (result) => {
      settled = true
      value = result
    },
    (err) => {
      settled = true
      error = err
    }
  )
  await harness.advance(ms)
  return { settled, value, error }
}

const errorSummary = (count) =>
  language.transl('_有x个作品失败请再次执行重试', String(count))

/** 移除标签用的是独立文案（不再复用「收藏」那条），所以摘要要单独算 */
const rmTagErrorSummary = (count) =>
  language.transl('_有x个作品移除标签失败请再次执行重试', String(count))

// ============================================================
// 1. Bookmark.sendRequest 对断网的短重试
// ============================================================

test('a network error is retried, and the bookmark still succeeds', async () => {
  const { harness, bookmark } = realBookmark()
  harness.fetchPlan.push({ reject: true }, { status: 200 })

  const result = await runAdd(
    harness,
    bookmark.add('42', 'illusts', [], false, false, false)
  )

  assert.equal(result.value, 200)
  assert.equal(harness.fetchCalls.length, 2, '原始请求 + 1 次重试')
  assert.deepEqual(harness.gaps(), [2000], '第 1 次重试前等待 2 秒')
  assert.equal(
    harness.notices.length,
    0,
    '重试期间不输出日志（成功时不打扰用户）'
  )
})

test('a persistent network error is retried 3 times, then gives up', async () => {
  const { harness, bookmark } = realBookmark()
  for (let i = 0; i < 6; i++) harness.fetchPlan.push({ reject: true })

  const result = await runAdd(
    harness,
    bookmark.add('42', 'illusts', [], false, false, false)
  )

  assert.equal(result.value, 0, '最终返回 0，调用方能知道这个作品失败了')
  assert.equal(harness.fetchCalls.length, 4, '原始请求 + 3 次重试')
  assert.deepEqual(harness.gaps(), [2000, 5000, 10000], '等待时间递增')
  assert.equal(harness.errors().length, 1, '用尽重试后打一条错误日志')
  assert.ok(harness.errors()[0].args[0].includes('_添加收藏失败'))
})

test('a 403 response is not retried', async () => {
  const { harness, bookmark } = realBookmark()
  harness.fetchPlan.push({ status: 403 })

  const result = await runAdd(
    harness,
    bookmark.add('42', 'illusts', [], false, false, false)
  )

  assert.equal(result.value, 403, '原样返回状态码')
  assert.equal(harness.fetchCalls.length, 1, '有状态码的失败不重试')
  assert.equal(harness.warnings().length, 0)
})

test('a 400 response still only refreshes the token once', async () => {
  const { harness, bookmark } = realBookmark()
  harness.fetchPlan.push({ status: 400 }, { status: 200 })

  const result = await runAdd(
    harness,
    bookmark.add('42', 'illusts', [], false, false, false)
  )

  assert.equal(result.value, 200)
  assert.equal(harness.fetchCalls.length, 2, '400 只重试一次')
})

// ============================================================
// 2. 批量收藏模块如实报告失败数量
// ============================================================

test('addBookmarksInBatchs reports how many works failed', async () => {
  const harness = createHarness()
  const { bookmark } = harness.load('Bookmark.ts')
  const statuses = [0, 200, 200]
  let calls = 0
  bookmark.add = async () => {
    calls++
    return statuses.shift()
  }

  await bookmark.addBookmarksInBatchs(
    [
      { id: '1', type: 'illusts' },
      { id: '2', type: 'illusts' },
      { id: '3', type: 'illusts' },
    ],
    []
  )

  assert.equal(calls, 3, '一个失败不会中断整批')
  assert.equal(harness.lastToast().type, 'error', '有失败时用 error')
  assert.equal(
    harness.lastToast().msg,
    language.transl('_收藏作品完毕但是有一些失败了'),
    'toast 说明收藏过程有失败'
  )
  assert.ok(
    harness.errors().some((item) => item.args[0].includes(errorSummary(1))),
    '日志里说明失败数量，并提示可以再次执行来重试'
  )
})

test('addBookmarksInBatchs keeps the old notice when nothing failed', async () => {
  const harness = createHarness()
  const { bookmark } = harness.load('Bookmark.ts')
  bookmark.add = async () => 200

  await bookmark.addBookmarksInBatchs([{ id: '1', type: 'illusts' }], [])

  assert.equal(harness.lastToast().type, 'success')
  assert.equal(harness.lastToast().msg, '♥️' + language.transl('_收藏作品完毕'))
})

test('addBookmarksInBatchs survives an unexpected throw', async () => {
  const harness = createHarness()
  const { bookmark } = harness.load('Bookmark.ts')
  let calls = 0
  bookmark.add = async () => {
    calls++
    if (calls === 2) throw new Error('boom')
    return 200
  }

  await bookmark.addBookmarksInBatchs(
    [
      { id: '1', type: 'illusts' },
      { id: '2', type: 'illusts' },
      { id: '3', type: 'illusts' },
    ],
    []
  )

  assert.equal(calls, 3, '抛异常也不会中断整批')
  assert.ok(
    harness.errors().some((item) => item.args[0].includes(errorSummary(1))),
    '抛异常计入失败'
  )
})

test('BookmarksAddTag counts failures and restores its button', async () => {
  const harness = createHarness()
  const statuses = [0, 200]
  const { BookmarksAddTag } = harness.load('pageFunciton/BookmarksAddTag.ts', {
    bookmark: harness.makeBookmark(async () => statuses.shift()),
  })
  const button = makeElement()
  // 先真的禁用按钮，这样「被恢复」才是有效断言
  button.setAttribute('disabled', 'disabled')
  const task = new BookmarksAddTag(button)
  task.addTagList = [
    { id: '1', tags: [], restrict: false },
    { id: '2', tags: [], restrict: false },
  ]
  task.type = 'illusts'

  await task.addTag()

  assert.equal(task.failedCount, 1)
  assert.equal(button.disabled, false, '按钮被恢复，不会卡在 disabled')
  assert.equal(button.textContent, '✓ Complete')
  assert.equal(harness.lastToast().type, 'error')
  assert.ok(
    harness.errors().some((item) => item.args[0].includes(errorSummary(1)))
  )
})

test('BookmarksAddTag restores its button even when add throws', async () => {
  const harness = createHarness()
  // bookmark 里没有 add，调用时会抛异常
  const { BookmarksAddTag } = harness.load('pageFunciton/BookmarksAddTag.ts', {
    bookmark: harness.makeBookmark(),
  })
  const button = makeElement()
  button.setAttribute('disabled', 'disabled')
  const task = new BookmarksAddTag(button)
  task.addTagList = [{ id: '1', tags: [], restrict: false }]
  task.type = 'illusts'

  await task.addTag().catch(() => {})

  assert.equal(button.disabled, false, '抛异常时按钮也能恢复')
  assert.equal(task.failedCount, 1, '抛异常也算一次失败')
})

test('RemoveBookmarkTags counts failures and resets busy', async () => {
  const harness = createHarness()
  const statuses = [0, 200]
  const { removeBookmarkTags } = harness.load('RemoveBookmarkTags.ts', {
    bookmark: harness.makeBookmark(async () => statuses.shift()),
  })

  await removeBookmarkTags.start([
    { workID: 1, type: 'illusts', private: false },
    { workID: 2, type: 'illusts', private: false },
  ])

  assert.equal(harness.states.busy, false, '结束后 states.busy 被复位')
  assert.ok(
    harness
      .msgBoxErrors()
      .some((item) => item.args[0].includes(rmTagErrorSummary(1))),
    '用弹窗（msgBox）如实说明失败数量和重试办法'
  )
  assert.ok(
    harness
      .errors()
      .some((item) => item.args[0].includes(rmTagErrorSummary(1))),
    '日志里也有同样的摘要，且用的是「移除标签」的文案'
  )
  assert.equal(
    harness.successes().filter((item) => item.args[0].includes('_完成')).length,
    0,
    '有失败时不再输出「完成」的成功日志'
  )
})

test('BookmarkAllWorks counts failures and still ends bookmark mode', async () => {
  const harness = createHarness()
  const statuses = [0, 200]
  const { BookmarkAllWorks } = harness.load(
    'pageFunciton/BookmarkAllWorks.ts',
    { bookmark: harness.makeBookmark(async () => statuses.shift()) }
  )
  const tipWrap = makeElement()
  tipWrap.setAttribute('disabled', 'disabled')
  const work = Object.create(BookmarkAllWorks.prototype)
  Object.assign(work, {
    bookmarKData: [
      { id: '1', type: 'illusts', tags: [], restrict: false },
      { id: '2', type: 'illusts', tags: [], restrict: false },
    ],
    textSpan: makeElement(),
    tipWrap,
    failedCount: 0,
  })

  await work.addBookmarkAll()
  work.complete()

  assert.equal(work.failedCount, 1)
  assert.equal(tipWrap.disabled, false, '按钮被恢复')
  assert.equal(harness.lastToast().type, 'error')
  assert.ok(
    harness.errors().some((item) => item.args[0].includes(errorSummary(1)))
  )
  assert.ok(
    harness.firedEvents.includes('bookmarkModeEnd'),
    'complete() 仍然结束收藏模式'
  )
})

// ============================================================
// 3. BookmarkAfterDL 把失败的作品重新排队
// ============================================================

/** 最小抓取结果：findData 依靠 idNum 匹配，图片作品的 id 带页码 */
function result(id = 42, type = 0, index = 0, tags = ['original_tag']) {
  return {
    idNum: id,
    id: type === 0 || type === 1 ? `${id}_p${index}` : String(id),
    type,
    tags,
  }
}

/**
 * BookmarkAfterDL 只关心 bookmark.add 的返回值，所以这里用假的 bookmark 模块，
 * 把「内层短重试」隔离掉（内层的重试由上面的 sendRequest 测试覆盖）。
 * fetchPlan 里 {reject:true} 表示 add 返回 0（请求本身失败），{status:403} 表示返回 403。
 */
function afterDownload() {
  const harness = createHarness()
  const bookmark = harness.makeBookmark(async () => {
    const step = harness.fetchPlan.shift() || { status: 200 }
    harness.fetchCalls.push({
      url: 'bookmark.add',
      plan: step,
      at: harness.now,
    })
    return step.reject ? 0 : step.status || 200
  })
  const { BookmarkAfterDL } = harness.load('download/BookmarkAfterDL.ts', {
    bookmark,
  })
  const tip = makeElement()
  const after = new BookmarkAfterDL(tip)
  return { harness, after, tip }
}

test('BookmarkAfterDL requeues a failed work and retries it later', async () => {
  const { harness, after, tip } = afterDownload()
  harness.store.result.push(result(42))
  harness.fetchPlan.push({ reject: true }) // 第一次收藏因断网失败

  after.send('42_p0')
  await harness.advance(200)

  assert.equal(tip.textContent, language.transl('_已收藏带参数', '0/1'))
  assert.equal(harness.fetchCalls.length, 1)
  assert.equal(harness.errors().length, 0, '重试期间不打日志，避免打扰用户')
  assert.equal(tip.classList.contains('red'), true, '有作品等待重试时提示变红')

  await harness.advance(14000)
  assert.equal(harness.fetchCalls.length, 1, '还没到 15 秒不会重试')

  await harness.advance(2000)
  assert.equal(harness.fetchCalls.length, 2, '到时间后自动重试')
  assert.equal(
    tip.textContent,
    language.transl('_已收藏带参数', '1/1'),
    '网络恢复后自动补上'
  )
  assert.equal(tip.classList.contains('green'), true, '补上后提示变回绿色')
  assert.ok(
    harness.successes().some((item) => item.args[0].includes('_重试收藏成功')),
    '重试成功会补一条日志'
  )
})

test('BookmarkAfterDL waits 15s / 30s / 45s between its retries', async () => {
  const { harness, after } = afterDownload()
  harness.store.result.push(result(42))
  for (let i = 0; i < 4; i++) harness.fetchPlan.push({ reject: true })

  after.send('42_p0')
  await harness.advance(200)
  await harness.advance(15500)
  await harness.advance(30500)
  await harness.advance(45500)

  assert.equal(harness.fetchCalls.length, 4, '原始 1 次 + 重试 3 次')
  assert.deepEqual(harness.gaps(), [15000, 30000, 45000], '间隔按 15 秒递增')
  assert.equal(harness.errors().length, 0, '重试期间始终不打日志')
})

test('BookmarkAfterDL keeps every failed work in its queue', async () => {
  const { harness, after, tip } = afterDownload()
  harness.store.result.push(result(42), result(43), result(44))
  for (let i = 0; i < 3; i++) harness.fetchPlan.push({ reject: true })

  after.send('42_p0')
  after.send('43_p0')
  after.send('44_p0')
  await harness.advance(600)
  assert.equal(tip.textContent, language.transl('_已收藏带参数', '0/3'))
  assert.equal(harness.errors().length, 0, '重试期间不打日志')

  await harness.advance(16000)
  assert.equal(
    harness.fetchCalls.length,
    6,
    '三个作品都重试了一次（队列没有被吃光）'
  )

  await harness.advance(31000)
  assert.equal(
    tip.textContent,
    language.transl('_已收藏带参数', '3/3'),
    '网络恢复后三个作品全部补上'
  )
  harness.EVT.fire('downloadComplete')
  assert.ok(
    harness
      .successes()
      .some((item) => item.args[0] === '♥️' + language.transl('_收藏作品完毕')),
    '这时才会打出「收藏作品完毕」'
  )
})

test('BookmarkAfterDL does not requeue a failure that has a status code', async () => {
  const { harness, after, tip } = afterDownload()
  harness.store.result.push(result(42))
  harness.fetchPlan.push({ status: 403 })

  after.send('42_p0')
  await harness.advance(200)
  assert.equal(harness.fetchCalls.length, 1)
  await harness.advance(60000)
  assert.equal(harness.fetchCalls.length, 1, '403 不会重排，也不会重试')
  assert.equal(harness.errors().length, 0, '403 的日志由 Bookmark 自己输出')
  assert.equal(tip.classList.contains('green'), true, '队列已空 → 提示保持绿色')
})

test('BookmarkAfterDL gives up after its retry budget and says so', async () => {
  const { harness, after } = afterDownload()
  after.networkRetryMax = 2 // 把上限改小，避免测试推进半小时
  harness.store.result.push(result(42))
  for (let i = 0; i < 4; i++) harness.fetchPlan.push({ reject: true })

  after.send('42_p0')
  await harness.advance(200)
  await harness.advance(15500)
  assert.equal(harness.errors().length, 0, '重试期间不打日志')

  await harness.advance(30500)
  assert.equal(harness.fetchCalls.length, 3, '上限为 2 时一共尝试 3 次')
  assert.equal(harness.errors().length, 1, '放弃时打一条日志')
  assert.ok(
    harness.errors()[0].args[0].includes('_因为网络错误重试多次仍然失败'),
    '日志说明重试多次仍然失败'
  )

  await harness.advance(60000)
  assert.equal(harness.fetchCalls.length, 3, '放弃后不再发请求')
})

test('BookmarkAfterDL keeps its shipped retry budget of 30 retries', async () => {
  const { harness, after } = afterDownload()
  assert.equal(after.networkRetryMax, 30, '默认重试上限是 30 次')
  harness.store.result.push(result(42))
  for (let i = 0; i < 40; i++) harness.fetchPlan.push({ reject: true })

  after.send('42_p0')
  await harness.advance(200)
  // 15s + 30s + ... + 180s(封顶) x ... 累计约 4410 秒
  await harness.advance(4500000)

  assert.equal(harness.fetchCalls.length, 31, '一共尝试 31 次后放弃')
  assert.equal(harness.gaps().at(-1), 180000, '最后几次重试间隔封顶 3 分钟')
  assert.equal(harness.errors().length, 1, '只在最后放弃时打一条日志')
})

test('BookmarkAfterDL drops pending retries when a new batch starts', async () => {
  const { harness, after, tip } = afterDownload()
  harness.store.result.push(result(42))
  harness.fetchPlan.push({ reject: true })

  after.send('42_p0')
  await harness.advance(200)
  assert.equal(tip.classList.contains('red'), true, '先进入等待重试的状态')

  harness.EVT.fire('downloadComplete')
  harness.EVT.fire('downloadStart') // 新批次
  await harness.advance(600)

  assert.equal(tip.textContent, '', '新批次清空提示')
  assert.equal(tip.classList.contains('red'), false, '不继承旧批次的红色状态')
})
