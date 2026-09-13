const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')
// 保留翻译键供断言使用；此 PR 不修改任何界面文本。
const lang = { transl: (key, ...args) => [key, ...args].join(' ') }

/** 执行真实模块；网络、存储、时钟和页面均使用内存，不读取真实凭据。 */
const compiled = new Map()
function load(file, imports, globals) {
  if (!compiled.has(file)) {
    compiled.set(
      file,
      ts.transpileModule(
        fs.readFileSync(path.join(__dirname, '../src/ts', file), 'utf8'),
        {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
          },
        }
      ).outputText
    )
  }
  const exports = {}
  vm.runInNewContext(
    compiled.get(file),
    {
      exports,
      AbortController,
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

/** 控制请求和响应正文的完成顺序，包括不响应 abort 的晚到结果。 */
function deferred() {
  let resolve, reject
  const promise = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return { promise, resolve, reject }
}

/** 排空模块之间的 Promise 延续，不推进模拟时间。 */
async function flush() {
  for (let i = 0; i < 40; i++) await Promise.resolve()
}

/** 成功页面只含测试用 token。 */
function response(value = 'new_test_token', status = 200, mobile = false) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => `{"${mobile ? 'postKey' : 'token'}":"${value}"}`,
  }
}

/** 手动时钟可以推进整个 20 秒期限，无需真实等待或联网。 */
function environment(options = {}) {
  let now = 1000000,
    timerID = 0
  const timers = new Map(),
    requests = [],
    mutations = [],
    errors = []
  const storage = new Map(
    Object.entries(
      options.storage ?? {
        xzToken: 'cached_test_token',
        xzTokenTime: String(now),
      }
    )
  )
  const window = new EventTarget()
  window.setTimeout = (fn, ms) => {
    const id = ++timerID
    timers.set(id, { fn, at: now + ms })
    return id
  }
  window.clearTimeout = (id) => timers.delete(id)
  const document = {
    querySelector: () =>
      options.script === undefined ? null : { textContent: options.script },
  }
  const localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem(key, value) {
      mutations.push(['set', key, value])
      storage.set(key, value)
    },
    removeItem(key) {
      mutations.push(['remove', key])
      storage.delete(key)
    },
  }
  const globals = {
    window,
    document,
    localStorage,
    Date: { now: () => now },
    console: { error: (...args) => errors.push(args) },
    fetch(url, init) {
      const request = { url, init, ...deferred() }
      requests.push(request)
      return request.promise
    },
  }
  options.configure?.(globals)
  const { token } = load(
    'Token.ts',
    {
      './Config': { Config: { mobile: options.mobile ?? false } },
      './EVT': { EVT: { list: { resetSettingsEnd: 'resetSettingsEnd' } } },
      './utils/Utils': { Utils: { isPixiv: () => options.pixiv ?? true } },
    },
    globals
  )
  return {
    token,
    globals,
    storage,
    localStorage,
    requests,
    mutations,
    errors,
    timers,
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
  }
}

test('concurrent resets share one request and its success', async () => {
  const e = environment()
  const pending = Array.from({ length: 5 }, () => e.token.reset())
  const settled = Promise.allSettled(pending)
  assert.equal(e.requests.length, 1)
  assert.ok(pending.every((promise) => promise === pending[0]))
  e.requests[0].resolve(response())
  const results = await settled
  assert.ok(results.every((result) => result.status === 'fulfilled'))
  assert.equal(e.token.token, 'new_test_token')
  assert.equal(e.storage.get('xzTokenTime'), '1000000')
  assert.equal(e.mutations.filter(([action]) => action === 'set').length, 2)
  assert.equal(e.timers.size, 0)
})

test('HTTP failure cannot publish a token-looking error page', async () => {
  const e = environment()
  const result = Promise.allSettled([e.token.reset()])
  e.requests[0].resolve(response('error_page_token', 500))
  assert.equal((await result)[0].status, 'rejected')
  assert.equal(e.token.token, '')
  assert.equal(e.storage.has('xzTokenTime'), false)
})

test('a stalled response body expires and cannot publish its late token', async () => {
  const e = environment(),
    body = deferred()
  let settled = false
  const result = Promise.allSettled([e.token.reset()]).then((value) => {
    settled = true
    return value
  })
  e.requests[0].resolve({ ...response(), text: () => body.promise })
  await flush()
  await e.advance(20000)
  assert.equal(settled, true)
  assert.equal((await result)[0].status, 'rejected')
  assert.equal(e.requests[0].init.signal.aborted, true)
  body.resolve('{"token":"late_test_token"}')
  await flush()
  assert.equal(e.token.token, '')
  assert.equal(e.storage.size, 0)
  assert.equal(e.timers.size, 0)
})

for (const failure of ['network', 'body', 'missing', 'empty', 'http']) {
  test(`shared ${failure} failure releases all waiters and permits a new refresh`, async () => {
    const e = environment()
    const first = e.token.reset()
    const result = Promise.allSettled([first, e.token.reset(), e.token.reset()])
    assert.equal(e.requests.length, 1)
    if (failure === 'network') e.requests[0].reject(new Error('test network'))
    if (failure === 'body')
      e.requests[0].resolve({
        ...response(),
        text: async () => {
          throw new Error('test body')
        },
      })
    if (failure === 'missing')
      e.requests[0].resolve({
        ...response(),
        text: async () => '<html></html>',
      })
    if (failure === 'empty') e.requests[0].resolve(response(''))
    if (failure === 'http') e.requests[0].resolve(response('ignored', 403))
    const results = await result
    assert.ok(results.every((r) => r.status === 'rejected'))
    assert.ok(results.every((r) => r.reason === results[0].reason))
    assert.equal(e.storage.size, 0)
    assert.equal(e.token.token, '')
    assert.equal(e.timers.size, 0)
    await e.advance(1000)
    const next = e.token.reset()
    e.requests[1].resolve(response('recovered_test_token'))
    assert.equal(await next, 'recovered_test_token')
    assert.equal(e.storage.get('xzTokenTime'), '1001000')
  })
}

for (const stage of ['headers', 'body']) {
  for (const outcome of ['resolve', 'reject']) {
    for (const lateAfterSuccess of [false, true]) {
      test(`expired ${stage} ${outcome}, late ${lateAfterSuccess ? 'after' : 'during'} next refresh: no old storage or cleanup`, async () => {
        const e = environment(),
          body = deferred()
        const results = Promise.allSettled([e.token.reset(), e.token.reset()])
        if (stage === 'body')
          e.requests[0].resolve({ ...response(), text: () => body.promise })
        await flush()
        await e.advance(19999)
        assert.equal(e.requests[0].init.signal.aborted, false)
        await e.advance(1)
        const failed = await results
        assert.ok(failed.every((r) => r.status === 'rejected'))
        assert.equal(failed[0].reason, failed[1].reason)
        assert.equal(e.requests[0].init.signal.aborted, true)
        const next = e.token.reset()
        let oldBodyReads = 0
        const finishOld = async () => {
          const pending = stage === 'headers' ? e.requests[0] : body
          const value =
            stage === 'headers'
              ? {
                  ...response(),
                  text: async () => {
                    oldBodyReads++
                    return '{"token":"obsolete_test_token"}'
                  },
                }
              : '{"token":"obsolete_test_token"}'
          pending[outcome](
            outcome === 'resolve' ? value : new Error('late test failure')
          )
          await flush()
        }
        if (!lateAfterSuccess) {
          await finishOld()
          assert.equal(e.storage.size, 0)
          assert.equal(e.token.reset(), next)
          assert.equal(e.requests.length, 2)
        }
        await e.advance(1000)
        e.requests[1].resolve(response('latest_test_token'))
        assert.equal(await next, 'latest_test_token')
        if (lateAfterSuccess) await finishOld()
        assert.equal(e.token.token, 'latest_test_token')
        assert.equal(e.storage.get('xzTokenTime'), '1021000')
        assert.equal(e.storage.get('xzToken'), 'latest_test_token')
        assert.equal(oldBodyReads, 0)
        assert.equal(
          e.mutations.filter(([action]) => action === 'set').length,
          2
        )
        assert.equal(e.timers.size, 0)
      })
    }
  }
}

test('headers arriving near the deadline do not grant the body another 20 seconds', async () => {
  const e = environment(),
    body = deferred()
  const result = Promise.allSettled([e.token.reset()])
  await e.advance(19000)
  e.requests[0].resolve({ ...response(), text: () => body.promise })
  await flush()
  await e.advance(1000)
  assert.equal((await result)[0].status, 'rejected')
  assert.equal(e.timers.size, 0)
})

for (const mobile of [false, true]) {
  test(`${mobile ? 'mobile' : 'PC'} fallback retains its parser, URL and public token`, async () => {
    const e = environment({ mobile })
    const result = e.token.reset()
    assert.equal(e.requests[0].url, 'https://www.pixiv.net/artworks/62751951')
    e.requests[0].resolve({
      ...response(),
      text: async () =>
        '{"token":"pc_test_token","postKey":"mobile_test_token"}',
    })
    const value = mobile ? 'mobile_test_token' : 'pc_test_token'
    assert.equal(await result, value)
    assert.equal(e.token.token, value)
    assert.equal(e.storage.get('xzToken'), value)
  })
}

test('current NEXT_DATA token is available synchronously and preferred over fallback', async () => {
  const value = 'a'.repeat(32)
  const e = environment({
    storage: {},
    script: String.raw`token\":\"${value}\",`,
  })
  assert.equal(e.token.token, value)
  assert.equal(e.storage.get('xzToken'), value)
  assert.equal(e.requests.length, 0)
  assert.equal(await e.token.reset(), value)
  assert.equal(e.timers.size, 0)
})

test('invalid NEXT_DATA token falls back to the original page parser', async () => {
  const e = environment({ storage: {}, script: String.raw`token\":\"short\",` })
  assert.equal(e.requests.length, 1)
  const result = e.token.reset()
  e.requests[0].resolve(response())
  assert.equal(await result, 'new_test_token')
})

for (const [name, storage, refresh] of [
  ['fresh', { xzToken: 'cached', xzTokenTime: '700001' }, false],
  ['five minutes', { xzToken: 'cached', xzTokenTime: '700000' }, true],
  ['missing time', { xzToken: 'cached' }, true],
  ['invalid time', { xzToken: 'cached', xzTokenTime: 'invalid' }, true],
  ['empty token', { xzToken: '', xzTokenTime: '1000000' }, true],
]) {
  test(`${name} cache keeps the five-minute policy; explicit reset always obtains a result`, async () => {
    const e = environment({ storage })
    assert.equal(e.token.token, storage.xzToken)
    assert.equal(e.requests.length, refresh ? 1 : 0)
    const result = e.token.reset()
    assert.equal(e.requests.length, 1)
    e.requests[0].resolve(response())
    assert.equal(await result, 'new_test_token')
  })
}

test('an automatic refresh without a token cannot re-date an old cached token', async () => {
  const e = environment({
    storage: { xzToken: 'old_test_token', xzTokenTime: '1' },
  })
  e.requests[0].resolve({ ...response(), text: async () => '{}' })
  await flush()
  assert.equal(e.token.token, 'old_test_token')
  assert.equal(e.storage.get('xzTokenTime'), '1')
  assert.equal(e.mutations.length, 0)
  assert.equal(e.errors.length, 1)
})

for (const entry of ['constructor', 'settings']) {
  for (const failure of ['network', 'http', 'missing', 'timeout']) {
    test(`${entry} ${failure}: background failure is handled and a later reset recovers`, async () => {
      const e = environment({
        storage: entry === 'constructor' ? {} : undefined,
      })
      if (entry === 'settings')
        e.globals.window.dispatchEvent(new Event('resetSettingsEnd'))
      assert.equal(e.requests.length, 1)
      if (failure === 'network') e.requests[0].reject(new Error('test failure'))
      if (failure === 'http') e.requests[0].resolve(response('bad', 500))
      if (failure === 'missing') e.requests[0].resolve(response(''))
      if (failure === 'timeout') await e.advance(20000)
      await flush()
      await new Promise(setImmediate)
      assert.equal(e.errors.length, 1)
      assert.equal(e.token.token, '')
      assert.equal(e.timers.size, 0)
      const next = e.token.reset()
      e.requests[1].resolve(response())
      assert.equal(await next, 'new_test_token')
    })
  }
}

test('constructor, repeated settings resets and explicit callers join the same lookup', async () => {
  const e = environment({ storage: {} })
  for (let i = 0; i < 3; i++)
    e.globals.window.dispatchEvent(new Event('resetSettingsEnd'))
  const result = e.token.reset()
  assert.equal(e.requests.length, 1)
  e.requests[0].resolve(response())
  assert.equal(await result, 'new_test_token')
  assert.equal(e.errors.length, 0)
  assert.equal(e.mutations.filter(([action]) => action === 'set').length, 2)
})

test('storage initialization failure is handled without a request or uncaught rejection', async () => {
  const e = environment({
    configure: ({ localStorage }) => {
      localStorage.getItem = () => {
        throw new Error('test storage blocked')
      }
    },
  })
  await flush()
  assert.equal(e.errors.length, 1)
  assert.equal(e.requests.length, 0)
})

test('outside Pixiv initialization remains inactive', () => {
  const e = environment({ pixiv: false })
  e.globals.window.dispatchEvent(new Event('resetSettingsEnd'))
  assert.equal(e.requests.length, 0)
  assert.equal(e.mutations.length, 0)
})

/** 将真实收藏、批量关注模块连接到同一个真实 Token；只替代 API/界面边界。 */
function callers(options = {}) {
  const e = environment(options)
  const notices = [],
    writes = [],
    follows = [],
    events = [],
    sleeps = []
  const Utils = {
    debounce: (fn) => fn,
    sleep(ms) {
      sleeps.push(ms)
      return ms === 0
        ? Promise.resolve()
        : new Promise((resolve) => e.globals.window.setTimeout(resolve, ms))
    },
    loadJSONFile: async () => ['7'],
    getURLPathField: () => '',
    getURLSearchField: () => '',
  }
  const Tools = {
    createWorkLink: (id) => id,
    createUserLink: (id) => id,
    extractTags: (data) => data.body.tags,
    rangeRandom: (min) => min,
    addBookmark403Error: () => 'bookmark forbidden',
  }
  const data = (id) => ({
    body: { id, tags: ['original_tag'], bookmarkData: null },
  })
  const API = {
    getArtworkData: async (id) => data(id),
    getNovelData: async (id) => data(id),
    addBookmark: async (...args) => {
      writes.push(args)
      throw { status: 400 }
    },
    addFollowingUser: async (...args) => {
      follows.push(args)
      return 404
    },
    getFollowingList: async () => ({ body: { users: [] } }),
  }
  const log = Object.fromEntries(
    ['log', 'warning', 'error', 'success'].map((type) => [
      type,
      (...args) => notices.push({ owner: 'log', type, args }),
    ])
  )
  const msgBox = Object.fromEntries(
    ['error', 'success'].map((type) => [
      type,
      (...args) => notices.push({ owner: 'msgBox', type, args }),
    ])
  )
  const settings = {
    widthTagBoolean: true,
    restrictBoolean: true,
    slowCrawlDealy: 0,
  }
  const imports = {
    './API': { API },
    './EVT': {
      EVT: {
        list: { downloadComplete: 'downloadComplete' },
        fire: (...args) => events.push(args),
      },
    },
    './Language': { lang: lang },
    './Log': { log },
    './Toast': { toast: msgBox },
    './MsgBox': { msgBox },
    './setting/Settings': { settings },
    './Token': { token: e.token },
    './Tools': { Tools },
    './utils/Utils': { Utils },
    './store/Store': { store: { loggedUserID: '7' } },
  }
  e.globals.location = e.globals.window.location = {
    href: 'http://localhost/users/7/following',
    pathname: '/users/7/following',
  }
  const { bookmark } = load('Bookmark.ts', imports, e.globals)
  const { batchFollowUser: follow } = load(
    'pageFunciton/BatchFollowUser.ts',
    Object.fromEntries(
      Object.entries(imports).map(([key, value]) => [
        key.replace('./', '../'),
        value,
      ])
    ),
    e.globals
  )
  return {
    ...e,
    bookmark,
    follow,
    API,
    Utils,
    settings,
    notices,
    writes,
    follows,
    events,
    sleeps,
  }
}

test('bookmark and follow share one refresh and keep their original payloads and delays', async () => {
  const e = callers()
  e.API.addBookmark = async (...args) => {
    e.writes.push(args)
    if (e.writes.length <= 2) throw { status: 400 }
  }
  e.API.addFollowingUser = async (...args) => {
    e.follows.push(args)
    return e.follows.length === 1 ? 404 : 200
  }
  const pending = [
    e.bookmark.add('42', 'illusts', ['art_tag'], true, false),
    e.bookmark.add('42', 'novels', ['novel_tag'], true, true),
    e.follow.addFollow('7'),
  ]
  await flush()
  assert.equal(e.requests.length, 1)
  e.requests[0].resolve(response('shared_test_token'))
  await flush()
  await e.advance(999)
  assert.equal(e.follows.length, 1)
  await e.advance(1)
  assert.equal(e.follows.length, 2)
  assert.equal(e.writes.length, 2)
  await e.advance(1999)
  assert.equal(e.writes.length, 2)
  await e.advance(501)
  assert.deepEqual(await Promise.all(pending), [200, 200, 200])
  for (const args of e.writes.slice(2)) {
    assert.deepEqual(
      args.slice(0, 4),
      e.writes.find((first) => first[1] === args[1]).slice(0, 4)
    )
    assert.equal(args[4], 'shared_test_token')
  }
  assert.deepEqual(e.follows[1], ['7', 'shared_test_token', true])
  assert.equal(e.timers.size, 0)
})

for (const failure of [
  'network',
  'empty',
  'http',
  'headers timeout',
  'body timeout',
]) {
  test(`${failure}: refresh failure returns 400 and the next slow bookmark can run`, async () => {
    const e = callers()
    const pending = [
      e.bookmark.add('42', 'illusts', ['custom'], true, false),
      e.bookmark.add('43', 'novels', ['custom'], true, false, true),
    ]
    await flush()
    assert.equal(e.requests.length, 1)
    if (failure === 'network') e.requests[0].reject(new Error('test failure'))
    if (failure === 'empty') e.requests[0].resolve(response(''))
    if (failure === 'http') e.requests[0].resolve(response('ignored', 500))
    if (failure === 'body timeout') {
      e.requests[0].resolve({
        ...response(),
        text: () => new Promise(() => {}),
      })
      await flush()
    }
    if (failure.includes('timeout')) await e.advance(20000)
    assert.deepEqual(await Promise.all(pending), [400, 400])
    assert.equal(e.writes.length, 2)
    e.API.addBookmark = async () => {}
    assert.equal(
      await e.bookmark.add('44', 'novels', [], false, false, true),
      200
    )
    assert.equal(e.timers.size, 0)
  })
}

test('a repeated bookmark 400 refreshes once, returns the error, and releases the slow queue', async () => {
  const e = callers()
  const pending = e.bookmark.add('42', 'illusts', [], false, false, true)
  await flush()
  e.requests[0].resolve(response())
  await flush()
  await e.advance(3000)
  assert.equal(e.requests.length, 1)
  assert.equal(await pending, 400)
  assert.equal(e.writes.length, 2)
  assert.ok(
    e.notices.some(
      (n) => n.type === 'error' && n.args[0].includes('_添加收藏失败')
    )
  )
  e.API.addBookmark = async () => {}
  assert.equal(
    await e.bookmark.add('43', 'novels', [], false, false, true),
    200
  )
})

test('a new reset during retry delays cannot replace either captured token', async () => {
  const e = callers()
  e.API.addBookmark = async (...args) => {
    e.writes.push(args)
    if (e.writes.length === 1) throw { status: 400 }
  }
  e.API.addFollowingUser = async (...args) => {
    e.follows.push(args)
    return e.follows.length === 1 ? 404 : 200
  }
  const pending = [e.bookmark.add('42', 'illusts', []), e.follow.addFollow('7')]
  await flush()
  e.requests[0].resolve(response('captured_test_token'))
  await flush()
  const next = Promise.allSettled([e.token.reset()])
  e.requests[1].reject(new Error('new refresh failure'))
  await next
  await e.advance(3500)
  assert.deepEqual(await Promise.all(pending), [200, 200])
  assert.equal(e.writes[1][4], 'captured_test_token')
  assert.equal(e.follows[1][1], 'captured_test_token')
})

for (const ids of [['7'], ['7', '8']]) {
  for (const failure of ['network', 'empty', 'timeout']) {
    test(`follow ${failure}, ${ids.length} users: stop without retry, false completion or stuck busy`, async () => {
      const e = callers()
      e.Utils.loadJSONFile = async () => ids
      await e.follow.start()
      await flush()
      assert.equal(e.follow.busy, true)
      if (failure === 'network') e.requests[0].reject(new Error('test failure'))
      if (failure === 'empty') e.requests[0].resolve(response(''))
      if (failure === 'timeout') await e.advance(20000)
      await flush()
      assert.equal(e.follow.busy, false)
      assert.equal(e.follows.length, 1)
      assert.equal(
        e.notices.some((n) => n.owner === 'msgBox' && n.type === 'success'),
        false
      )
      assert.ok(
        e.notices.some((n) => n.type === 'error' && n.args[0] === '_任务已中止')
      )
      e.API.addFollowingUser = async (...args) => {
        e.follows.push(args)
        return 200
      }
      await e.follow.start()
      await flush()
      await e.advance(ids.length * 2500)
      assert.equal(e.follow.busy, false)
      assert.ok(
        e.notices.some((n) => n.owner === 'msgBox' && n.type === 'success')
      )
    })
  }
}

test('follow repeated 404 refreshes once per task, then a new task can refresh again', async () => {
  const e = callers()
  e.Utils.loadJSONFile = async () => ['7', '8']
  await e.follow.start()
  await flush()
  e.requests[0].resolve(response())
  await flush()
  await e.advance(6000)
  assert.equal(e.follows.length, 3)
  assert.equal(e.requests.length, 1)
  assert.equal(e.follow.busy, false)
  await e.follow.start()
  await flush()
  assert.equal(e.requests.length, 2)
  e.requests[1].reject(new Error('test end'))
  await flush()
  assert.equal(e.follow.busy, false)
})

for (const afterRefresh of [false, true]) {
  test(`follow 400 ${afterRefresh ? 'after refresh' : 'directly'} retains the iframe path and privacy`, async () => {
    const e = callers(),
      frames = [],
      cleared = []
    e.follow.rest = 'hide'
    e.follow.loadIframe = async (id) => {
      const frame = { id }
      frames.push(frame)
      return frame
    }
    e.follow.clearIframe = (frame) => cleared.push(frame)
    e.API.addFollowingUser = async (...args) => {
      e.follows.push(args)
      return afterRefresh && e.follows.length === 1 ? 404 : 400
    }
    const pending = e.follow.addFollow('7')
    await flush()
    if (afterRefresh) {
      e.requests[0].resolve(response())
      await flush()
      await e.advance(1000)
    }
    assert.equal(await pending, 200)
    assert.equal(await e.follow.addFollow('8'), 200)
    assert.equal(e.requests.length, afterRefresh ? 1 : 0)
    assert.equal(e.follows.length, afterRefresh ? 2 : 1)
    assert.ok(e.follows.every((args) => args[2] === false))
    assert.deepEqual(
      frames.map((frame) => frame.id),
      ['7', '8']
    )
    assert.deepEqual(cleared, frames)
  })
}

for (const failure of ['403', 'rejection']) {
  test(`follow retry ${failure} stops the remainder and restores busy`, async () => {
    const e = callers()
    e.Utils.loadJSONFile = async () => ['7', '8']
    e.API.addFollowingUser = async (...args) => {
      e.follows.push(args)
      if (e.follows.length === 1) return 404
      if (failure === 'rejection') throw new Error('test rejection')
      return 403
    }
    await e.follow.start()
    await flush()
    e.requests[0].resolve(response())
    await flush()
    await e.advance(1000)
    await new Promise(setImmediate)
    assert.equal(e.follows.length, 2)
    assert.equal(e.follow.busy, false)
    assert.equal(
      e.notices.some((n) => n.owner === 'msgBox' && n.type === 'success'),
      false
    )
  })
}

for (const caller of ['bookmark', 'follow']) {
  test(`${caller} rejects an empty reset result even if the shared property is nonempty`, async () => {
    const e = callers()
    e.token.reset = async () => ''
    if (caller === 'bookmark') {
      assert.equal(await e.bookmark.add('42', 'illusts', []), 400)
      assert.equal(e.writes.length, 1)
    } else {
      await e.follow.start()
      await flush()
      assert.equal(e.follows.length, 1)
      assert.equal(e.follow.busy, false)
    }
  })
}

for (const stage of ['headers', 'body']) {
  test(`late ${stage} success after shared timeout cannot restart bookmark or follow writes`, async () => {
    const e = callers(),
      body = deferred()
    const pending = [e.bookmark.add('42', 'illusts', []), e.follow.start()]
    await flush()
    assert.equal(e.requests.length, 1)
    if (stage === 'body')
      e.requests[0].resolve({ ...response(), text: () => body.promise })
    await flush()
    await e.advance(20000)
    assert.equal((await Promise.all(pending))[0], 400)
    assert.equal(e.follow.busy, false)
    const next = e.token.reset()
    e.requests[1].resolve(response('newest_test_token'))
    await next
    if (stage === 'headers') e.requests[0].resolve(response('late_test_token'))
    else body.resolve('{"token":"late_test_token"}')
    await e.advance(10000)
    assert.equal(e.writes.length, 1)
    assert.equal(e.follows.length, 1)
    assert.equal(e.token.token, 'newest_test_token')
    assert.equal(e.timers.size, 0)
  })
}

test('an authentication timeout cannot settle an already-sent bookmark retry', async () => {
  const e = callers(),
    write = deferred()
  e.API.addBookmark = async (...args) => {
    e.writes.push(args)
    if (e.writes.length === 1) throw { status: 400 }
    return write.promise
  }
  let settled = false
  const result = e.bookmark.add('42', 'illusts', []).then((value) => {
    settled = true
    return value
  })
  await flush()
  e.requests[0].resolve(response())
  await flush()
  await e.advance(3000)
  assert.equal(e.writes.length, 2)
  const unrelated = Promise.allSettled([e.token.reset()])
  await e.advance(30000)
  assert.equal((await unrelated)[0].status, 'rejected')
  assert.equal(settled, false)
  write.resolve()
  assert.equal(await result, 200)
})
