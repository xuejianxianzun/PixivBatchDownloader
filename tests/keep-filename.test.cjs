const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

const EXT_ID = 'dkndmhgdcmjdmkdonmbgjpijejdcilfh'

/** 模拟 chrome.downloads.onDeterminingFilename 事件 */
function determiningEvent() {
  const listeners = new Set()
  return {
    addListener: (fn) => listeners.add(fn),
    removeListener: (fn) => listeners.delete(fn),
    hasListener: (fn) => listeners.has(fn),
    get count() {
      return listeners.size
    },
    /** 模拟浏览器派发事件，返回每个监听器给出的建议 */
    fire(item) {
      const suggestions = []
      for (const fn of listeners) {
        fn(item, (suggestion) => suggestions.push(suggestion))
      }
      return suggestions
    },
  }
}

/** 可以手动推进的定时器 */
function fakeTimers() {
  let now = 0
  let nextId = 1
  const timers = new Map()
  return {
    setTimeout: (fn, ms) => {
      timers.set(nextId, { fn, at: now + ms })
      return nextId++
    },
    clearTimeout: (id) => timers.delete(id),
    advance(ms) {
      now += ms
      for (const [id, timer] of [...timers]) {
        if (timer.at <= now) {
          timers.delete(id)
          timer.fn()
        }
      }
    },
    now: () => now,
  }
}

/** 编译实际源码并创建 KeepFilename 实例 */
function load({ withEvent = true } = {}) {
  const event = determiningEvent()
  const timers = fakeTimers()
  const source = fs.readFileSync(
    path.join(__dirname, '../src/ts/serviceWorker/KeepFilename.ts'),
    'utf8'
  )
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText
  const exports = {}
  const DateMock = { now: timers.now }
  vm.runInNewContext(output, {
    exports,
    require: (name) =>
      name === 'webextension-polyfill' ? { runtime: { id: EXT_ID } } : {},
    // 在 vm 里，沙箱对象就是 globalThis
    chrome: { downloads: withEvent ? { onDeterminingFilename: event } : {} },
    setTimeout: timers.setTimeout,
    clearTimeout: timers.clearTimeout,
    Date: DateMock,
  })
  return { keepFilename: exports.keepFilename, event, timers }
}

const own = (url, extra = {}) => ({
  id: 1,
  url,
  byExtensionId: EXT_ID,
  ...extra,
})

test('registers the listener at startup and removes it when idle', () => {
  const { event, timers } = load()
  assert.equal(event.count, 1, 'handles events that woke the service worker')
  timers.advance(3000)
  assert.equal(event.count, 0, 'does not affect other extensions when idle')
})

test('suggests the downloader file name for its own download', () => {
  const { keepFilename, event, timers } = load()
  timers.advance(3000)
  keepFilename.add('blob:a', 'user/image.jpg', 'overwrite')
  assert.equal(event.count, 1)
  // 建议对象来自 vm 沙箱，所以转换为 JSON 再比较
  assert.equal(
    JSON.stringify(event.fire(own('blob:a'))),
    JSON.stringify([
      { filename: 'user/image.jpg', conflictAction: 'overwrite' },
    ])
  )
  timers.advance(3000)
  assert.equal(event.count, 0)
})

test('does not suggest a name for downloads of other extensions or pages', () => {
  const { keepFilename, event } = load()
  keepFilename.add('blob:a', 'user/image.jpg', 'overwrite')
  // 同样的 URL，但是由其他扩展发起
  assert.deepEqual(
    event.fire({ id: 2, url: 'blob:a', byExtensionId: 'other' }),
    [undefined]
  )
  assert.deepEqual(event.fire({ id: 3, url: 'https://example.com/a.zip' }), [
    undefined,
  ])
  // 自己的下载仍然可以拿到文件名
  assert.equal(event.fire(own('blob:a'))[0].filename, 'user/image.jpg')
})

test('keeps one entry per request for duplicate URLs', () => {
  const { keepFilename, event } = load()
  keepFilename.add('data:x', 'a/1.png', 'uniquify')
  keepFilename.add('data:x', 'a/2.png', 'uniquify')
  assert.equal(event.fire(own('data:x'))[0].filename, 'a/1.png')
  assert.equal(event.fire(own('data:x'))[0].filename, 'a/2.png')
  assert.deepEqual(event.fire(own('data:x')), [undefined])
})

test('matches finalUrl and falls back to the only pending request', () => {
  const { keepFilename, event } = load()
  keepFilename.add('blob:b', 'b.png', 'overwrite')
  assert.equal(
    event.fire(own('blob:changed', { finalUrl: 'blob:b' }))[0].filename,
    'b.png'
  )
  keepFilename.add('blob:c', 'c.png', 'overwrite')
  assert.equal(event.fire(own('blob:unknown'))[0].filename, 'c.png')
  // 有多个等待中的下载时，不猜测
  keepFilename.add('blob:d', 'd.png', 'overwrite')
  keepFilename.add('blob:e', 'e.png', 'overwrite')
  assert.deepEqual(event.fire(own('blob:unknown')), [undefined])
})

test('cancel removes the entry so the listener can be removed', () => {
  const { keepFilename, event, timers } = load()
  keepFilename.add('blob:a', 'a.png', 'overwrite')
  keepFilename.cancel('blob:a')
  timers.advance(3000)
  assert.equal(event.count, 0)
})

test('keeps listening while downloads are pending, and drops expired data', () => {
  const { keepFilename, event, timers } = load()
  keepFilename.add('blob:a', 'a.png', 'overwrite')
  keepFilename.add('blob:b', 'b.png', 'overwrite')
  event.fire(own('blob:a'))
  timers.advance(3000)
  assert.equal(event.count, 1, 'blob:b is still waiting')
  // blob:b 一直没有触发事件，过期后不再阻止移除监听器
  timers.advance(5 * 60 * 1000)
  keepFilename.add('blob:c', 'c.png', 'overwrite')
  event.fire(own('blob:c'))
  timers.advance(3000)
  assert.equal(event.count, 0)
})

test('does nothing when the browser has no onDeterminingFilename (Firefox)', () => {
  const { keepFilename } = load({ withEvent: false })
  assert.doesNotThrow(() => {
    keepFilename.add('blob:a', 'a.png', 'overwrite')
    keepFilename.cancel('blob:a')
  })
})
