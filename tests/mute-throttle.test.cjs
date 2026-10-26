'use strict'
// 屏蔽设置（src/ts/filter/Mute.ts）的执行间隔测试：
// 1. 第一次调用会发起请求，并正确保存启用中的屏蔽项
// 2. 1 分钟内的重复调用直接返回，不再发起请求（列表沿用上一次的结果）
// 3. 超过 1 分钟后才会重新发起请求
// 4. 并发调用只会发起一次请求，并且每个调用都能拿到已经填充好的列表
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

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

const MINUTE = 60 * 1000

/** 提供假时钟、假的 API 和日志记录 */
function createHarness() {
  // 从真实的时间量级开始，避免假时钟的 0 与「还没有请求过」的初始值混淆
  let now = 1700000000000
  const requests = []
  const notices = []

  const FakeDate = new Proxy(Date, {
    get(target, prop, receiver) {
      if (prop === 'now') {
        return () => now
      }
      return Reflect.get(target, prop, receiver)
    },
  })
  const lang = { transl: (key) => key }
  const log = {
    warning: (msg) => notices.push(msg),
    error: (msg) => notices.push(msg),
  }
  const Utils = { isPixiv: () => true }
  const Tools = { checkUserLogin: () => true }
  const API = {
    getMuteSettings: async () => {
      requests.push(now)
      return {
        body: {
          mute_items: [
            { type: 'user', value: '111', enabled: true },
            { type: 'tag', value: 'muted_tag', enabled: true },
            // 未启用的屏蔽项不应该被保存
            { type: 'tag', value: 'disabled_tag', enabled: false },
          ],
        },
      }
    },
  }

  const exports = loadSource(
    'filter/Mute.ts',
    {
      '../API': { API },
      '../Language': { lang },
      '../Log': { log },
      '../Tools': { Tools },
      '../utils/Utils': { Utils },
    },
    { Date: FakeDate }
  )

  return {
    mute: exports.mute,
    requests,
    notices,
    advance(ms) {
      now += ms
    },
  }
}

test('第一次调用会获取设置并保存启用中的屏蔽项', async () => {
  const h = createHarness()

  assert.equal(await h.mute.getMuteSettings(), 200)
  assert.equal(h.requests.length, 1)
  // 获取到屏蔽项时会输出一条提示
  assert.equal(h.notices.length, 1)

  assert.equal(await h.mute.checkUser(111), true)
  assert.equal(await h.mute.checkUser('222'), false)
  assert.equal(await h.mute.checkTag('muted_tag'), true)
  assert.equal(await h.mute.checkTag('disabled_tag'), false)

  // check 方法不会额外发起请求
  assert.equal(h.requests.length, 1)
})

test('1 分钟内的重复调用直接返回，不发起请求', async () => {
  const h = createHarness()
  await h.mute.getMuteSettings()
  assert.equal(h.requests.length, 1)

  h.advance(MINUTE - 1)
  assert.equal(await h.mute.getMuteSettings(), 200)
  assert.equal(h.requests.length, 1)

  // 列表沿用上一次的结果，屏蔽依然生效，也不会重复输出提示
  assert.equal(await h.mute.checkUser(111), true)
  assert.equal(await h.mute.checkTag('muted_tag'), true)
  assert.equal(h.notices.length, 1)
})

test('超过 1 分钟后会重新发起请求', async () => {
  const h = createHarness()
  await h.mute.getMuteSettings()
  assert.equal(h.requests.length, 1)

  h.advance(MINUTE)
  assert.equal(await h.mute.getMuteSettings(), 200)
  assert.equal(h.requests.length, 2)

  // 新请求的时间戳是推进之后的时刻
  assert.equal(h.requests[1], h.requests[0] + MINUTE)

  // 重新获取后同样进入新的间隔
  h.advance(MINUTE - 1)
  await h.mute.getMuteSettings()
  assert.equal(h.requests.length, 2)
})

test('并发调用只发起一次请求，并且都能拿到设置', async () => {
  const h = createHarness()

  const results = await Promise.all([
    h.mute.checkUser(111),
    h.mute.checkTag('muted_tag'),
    h.mute.checkUser('222'),
    h.mute.checkTag('233'),
    h.mute.getMuteSettings(),
  ])

  assert.deepEqual(results, [true, true, false, false, 200])
  assert.equal(h.requests.length, 1)
})
