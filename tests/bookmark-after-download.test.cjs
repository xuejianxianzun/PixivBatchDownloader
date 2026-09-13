const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')
// 使用现有翻译键作断言，避免依赖任何个人翻译或界面改动。
const language = { transl: (key, ...args) => [key, ...args].join(' ') }

/** 运行真实模块，API、DOM 和时钟只在内存中模拟。 */
function load(file, imports, globals) {
  const source = fs.readFileSync(
    path.join(__dirname, '../src/ts', file),
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

/** 使旧请求能够在新批次建立之后再返回。 */
function deferred() {
  let resolve, reject
  const promise = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return { promise, resolve, reject }
}

/** 排空 Promise，不触发真实时间等待。 */
async function flush() {
  for (let i = 0; i < 24; i++) await Promise.resolve()
}

/** 最小抓取结果，图片带索引，小说与动图沿用数字 ID。 */
function result(id = 42, type = 0, index = 0, tags = ['original_tag']) {
  return {
    idNum: id,
    id: type === 0 || type === 1 ? `${id}_p${index}` : String(id),
    type,
    tags,
  }
}

/** 每次写入可独立完成；保留真实事件顺序与 200ms 调度。 */
function environment({ realBookmark = false } = {}) {
  let now = 0,
    timerID = 0
  const timers = new Map(),
    writes = [],
    notices = []
  const window = new EventTarget()
  window.setTimeout = (fn, delay) => {
    const id = ++timerID
    timers.set(id, { fn, at: now + delay })
    return id
  }
  window.clearTimeout = (id) => timers.delete(id)
  const makeElement = () => {
    const classes = new Set(['green'])
    return {
      textContent: '',
      dataset: {},
      classList: {
        add: (name) => classes.add(name),
        remove: (name) => classes.delete(name),
        contains: (name) => classes.has(name),
      },
    }
  }
  const document = { createElement: makeElement }
  const tip = makeElement()
  const store = { result: [result()], resultMeta: [] }
  const settings = {
    bmkAfterDL: true,
    widthTagBoolean: true,
    restrictBoolean: false,
    slowCrawlDealy: 0,
  }
  const log = Object.fromEntries(
    ['success', 'error', 'warning', 'log'].map((type) => [
      type,
      (...args) => notices.push({ type, args }),
    ])
  )
  const lang = {
    transl: language.transl.bind(language),
    register() {},
    updateText(el, key, ...args) {
      el.textContent = key ? language.transl(key, ...args) : ''
    },
  }
  const EVT = {
    list: new Proxy({}, { get: (_, key) => key }),
    fire(type, data) {
      const event = new Event(type)
      event.detail = { data }
      window.dispatchEvent(event)
    },
  }
  const Utils = {
    sleep: (ms) => new Promise((resolve) => window.setTimeout(resolve, ms)),
    debounce: (fn) => fn,
  }
  let bookmark = {
    add(...args) {
      const pending = deferred()
      writes.push({ args, ...pending })
      return pending.promise
    },
  }
  const imports = {
    '../store/Store': { store },
    '../setting/Settings': { settings },
    '../Language': { lang },
    '../EVT': { EVT },
    '../Bookmark': { bookmark },
    '../Log': { log },
    '../utils/Utils': { Utils },
  }
  const globals = { window, document }
  if (realBookmark) {
    // 连接原版的慢速叫号队列：400 之后的 token 刷新拒绝会使 add 本身拒绝。
    const API = {
      addBookmark(...args) {
        const pending = deferred()
        writes.push({ args, ...pending })
        return pending.promise
      },
    }
    const token = {
      token: 'test_token',
      reset: async () => {
        throw new Error('test refresh failure')
      },
    }
    bookmark = load(
      'Bookmark.ts',
      {
        './API': { API },
        './EVT': { EVT },
        './Language': { lang },
        './Log': { log },
        './setting/Settings': { settings },
        './Toast': { toast: { warning() {}, error() {} } },
        './Token': { token },
        './Tools': { Tools: { createWorkLink: (id) => id } },
        './utils/Utils': { Utils },
      },
      globals
    ).bookmark
    imports['../Bookmark'] = { bookmark }
  }
  const { BookmarkAfterDL } = load(
    'download/BookmarkAfterDL.ts',
    imports,
    globals
  )
  const after = new BookmarkAfterDL(tip)
  return {
    after,
    tip,
    store,
    settings,
    bookmark,
    writes,
    notices,
    timers,
    EVT,
    imports,
    globals,
    async advance(ms) {
      const end = now + ms
      for (;;) {
        const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0]
        if (!next || next[1].at > end) break
        const [id, timer] = next
        now = timer.at
        timers.delete(id)
        timer.fn()
        await flush()
      }
      now = end
      await flush()
    },
    success(id = '42_p0') {
      EVT.fire('downloadSuccess', { id })
    },
    completionLogs() {
      return notices.filter(
        (n) =>
          n.type === 'success' &&
          n.args[0] === '♥️' + language.transl('_收藏作品完毕')
      )
    },
  }
}

test('an old bookmark success cannot complete a new crawl bookmark queue', async () => {
  const e = environment()
  e.EVT.fire('downloadStart')
  e.success()
  await e.advance(200)
  assert.equal(e.writes.length, 1)
  e.EVT.fire('crawlStart')
  e.store.result = [result(43)]
  e.EVT.fire('downloadStart')
  e.success('43_p0')
  e.EVT.fire('downloadComplete')
  e.writes[0].resolve(200)
  await flush()
  assert.equal(e.completionLogs().length, 0)
  assert.equal(e.tip.textContent, language.transl('_已收藏带参数', '0/1'))
  await e.advance(200)
  assert.equal(e.writes[1].args[0], '43')
  e.writes[1].resolve(200)
  await flush()
  assert.equal(e.completionLogs().length, 1)
})

test('missing result data cannot block the next available work', async () => {
  const e = environment()
  e.success('99_p0')
  await e.advance(200)
  e.success()
  await e.advance(400)
  assert.equal(e.writes.length, 1)
  assert.equal(e.writes[0].args[0], '42')
  e.writes[0].resolve(200)
  await flush()
  e.EVT.fire('downloadComplete')
  assert.equal(e.completionLogs().length, 0)
})

test('download completion after the last bookmark emits completion once', async () => {
  const e = environment()
  e.success()
  await e.advance(200)
  e.writes[0].resolve(200)
  await flush()
  assert.equal(e.completionLogs().length, 0)
  e.EVT.fire('downloadComplete')
  assert.equal(e.completionLogs().length, 1)
  e.EVT.fire('downloadComplete')
  assert.equal(e.completionLogs().length, 1)
})

for (const reset of [
  'crawlStart',
  'resume',
  'downloadStop',
  'downloadComplete',
]) {
  test(`${reset} isolates old responses and removes unstarted old work`, async () => {
    const e = environment()
    e.store.result.push(result(43))
    e.success()
    e.success('43_p0')
    await e.advance(200)
    e.EVT.fire(reset)
    e.EVT.fire('downloadStart')
    e.store.result = [result(44)]
    e.success('44_p0')
    await e.advance(1000)
    assert.equal(e.writes.length, 1, 'already started write must settle first')
    e.writes[0].reject(new Error('old request failed'))
    await flush()
    assert.equal(e.notices.filter((n) => n.type === 'error').length, 0)
    await e.advance(200)
    assert.deepEqual(
      e.writes.map((w) => w.args[0]),
      ['42', '44']
    )
    e.writes[1].resolve(200)
    await flush()
    e.EVT.fire('downloadComplete')
    assert.equal(e.completionLogs().length, 1)
  })
}

test('pause and continue keep the current bookmark queue and progress', async () => {
  const e = environment()
  e.store.result.push(result(43))
  e.success()
  e.success('43_p0')
  await e.advance(200)
  e.EVT.fire('downloadPause')
  e.EVT.fire('downloadStart')
  e.writes[0].resolve(200)
  await flush()
  await e.advance(200)
  assert.equal(e.writes[1].args[0], '43')
  e.writes[1].resolve(200)
  await flush()
  e.EVT.fire('downloadComplete')
  assert.equal(e.tip.textContent, language.transl('_已收藏带参数', '2/2'))
  assert.equal(e.completionLogs().length, 1)
})

test('queue captures tags, privacy, type and slow policy before mutable inputs change', async () => {
  const e = environment()
  e.store.result = Array.from({ length: 31 }, (_, i) => result(42, 3, i))
  e.success('42')
  e.store.result[0].tags.push('later_tag')
  e.store.result[0].type = 0
  e.store.result.length = 1
  e.settings.widthTagBoolean = false
  e.settings.restrictBoolean = true
  await e.advance(200)
  assert.deepEqual(JSON.parse(JSON.stringify(e.writes[0].args)), [
    '42',
    'novels',
    ['original_tag'],
    true,
    false,
    true,
  ])
})

test('pages and duplicate skips enqueue one bookmark while filtered files do not', async () => {
  const e = environment()
  e.store.result.push(result(42, 0, 1), result(43))
  e.success()
  e.success('42_p1')
  e.EVT.fire('skipDownload', { id: '42_p1', type: 0, reason: 'duplicate' })
  e.EVT.fire('skipDownload', { id: '43_p0', type: 0, reason: 'color' })
  await e.advance(200)
  e.writes[0].resolve(200)
  await flush()
  await e.advance(600)
  e.EVT.fire('downloadComplete')
  assert.equal(e.writes.length, 1)
  assert.equal(e.tip.textContent, language.transl('_已收藏带参数', '1/1'))
})

test('metadata is preferred and typed novel/image IDs remain distinct', async () => {
  const e = environment()
  e.store.resultMeta = [result(42, 0, 0, ['metadata']), result(42, 3)]
  e.success()
  e.EVT.fire('skipDownload', { id: '42', type: 3, reason: 'duplicate' })
  await e.advance(200)
  assert.deepEqual(JSON.parse(JSON.stringify(e.writes[0].args.slice(0, 3))), [
    '42',
    'illusts',
    ['metadata'],
  ])
  e.writes[0].resolve(200)
  await flush()
  await e.advance(200)
  assert.equal(e.writes[1].args[1], 'novels')
})

test('ambiguous untyped IDs cannot write to the wrong work family', async () => {
  const e = environment()
  e.store.result = [result(42, 2), result(42, 3)]
  e.success('42')
  e.success('invalid')
  await e.advance(400)
  e.EVT.fire('downloadComplete')
  assert.equal(e.writes.length, 0)
  assert.equal(e.completionLogs().length, 0)
})

for (const failure of [0, 400, 403, 'reject']) {
  test(`${failure} allows later bookmarks and never reports complete success`, async () => {
    const e = environment()
    e.store.result.push(result(43))
    e.success()
    e.success('43_p0')
    await e.advance(200)
    if (failure === 'reject') e.writes[0].reject(new Error('failed'))
    else e.writes[0].resolve(failure)
    await flush()
    await e.advance(200)
    e.writes[1].resolve(200)
    await flush()
    e.EVT.fire('downloadComplete')
    assert.equal(e.tip.textContent, language.transl('_已收藏带参数', '1/2'))
    assert.equal(e.completionLogs().length, 0)
  })
}

test('disabled and empty downloads do not enqueue or claim bookmark success', async () => {
  const e = environment()
  e.settings.bmkAfterDL = false
  e.success()
  await e.advance(400)
  e.EVT.fire('downloadComplete')
  assert.equal(e.writes.length, 0)
  assert.equal(e.completionLogs().length, 0)
  assert.equal(e.tip.textContent, '')
})

for (const newTask of [false, true]) {
  test(`the real slow bookmark queue continues after a rejected refresh${newTask ? ' from the old task' : ''}`, async () => {
    const e = environment({ realBookmark: true })
    e.store.result = Array.from({ length: 31 }, (_, i) => result(42 + i))
    e.success('42_p0')
    if (!newTask) e.success('43_p0')
    await e.advance(200)
    assert.equal(e.writes.length, 1)
    if (newTask) {
      e.EVT.fire('crawlStart')
      e.success('43_p0')
      e.EVT.fire('downloadStart')
    }
    e.writes[0].reject({ status: 400 })
    await flush()
    await e.advance(600)
    assert.equal(
      e.writes.length,
      2,
      'the shared slow queue must release its ticket'
    )
    assert.equal(e.writes[1].args[0], '43')
    e.writes[1].resolve()
    await flush()
    e.EVT.fire('downloadComplete')
    assert.equal(e.completionLogs().length, newTask ? 1 : 0)
    assert.equal(
      e.tip.textContent,
      language.transl('_已收藏带参数', newTask ? '1/1' : '1/2')
    )
  })
}
