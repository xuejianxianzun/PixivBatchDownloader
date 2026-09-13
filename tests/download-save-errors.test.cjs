const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 编译实际源码，只替换外部依赖；不会访问网络或保存文件。 */
function loadSource(file, imports, globals, exposeClass) {
  let source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
  if (exposeClass) {
    const bootstrap = `new ${exposeClass}()`
    assert.ok(source.trimEnd().endsWith(bootstrap))
    source =
      source.trimEnd().slice(0, -bootstrap.length) + `export { ${exposeClass} }`
  }
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText
  const exports = {}
  vm.runInNewContext(
    output,
    {
      exports,
      require: (name) => imports[name] || {},
      Error,
      console: { error() {}, warn() {} },
      ...globals,
    },
    { filename: file }
  )
  return exports
}

/** 模拟 WebExtension 事件，同时等待异步监听器。 */
function event() {
  const listeners = []
  return {
    addListener: (fn) => listeners.push(fn),
    fire: async (...args) => {
      for (const fn of listeners) await fn(...args)
    },
  }
}

/** 手动控制 Promise 的结束时机，用来检查批次切换。 */
function deferred() {
  let resolve, reject
  const promise = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return { promise, resolve, reject }
}

/** 在内存中模拟后台所需的浏览器 API。 */
function background({
  save = async () => 100,
  firefox = false,
  createURL = () => 'blob:background',
  send = async () => {},
} = {}) {
  const calls = [],
    replies = [],
    revoked = [],
    stored = {}
  const browser = {
    action: { onClicked: event() },
    runtime: { onInstalled: event(), onMessage: event() },
    storage: {
      local: {
        get: async () => ({ batchNo: {}, idList: {} }),
        set: async (data) =>
          Object.assign(stored, JSON.parse(JSON.stringify(data))),
      },
    },
    downloads: {
      download: async (options) => {
        calls.push(options)
        return save(options)
      },
      onChanged: event(),
    },
    tabs: {
      get: async () => ({}),
      sendMessage: async (tabId, message) => {
        replies.push({ tabId, message: JSON.parse(JSON.stringify(message)) })
        await send()
      },
    },
  }
  loadSource(
    'src/ts/serviceWorker/background.ts',
    {
      'webextension-polyfill': browser,
      '../Config': { Config: { downloadsAPIDisabled: false } },
    },
    {
      navigator: { userAgent: firefox ? 'Firefox' : 'Chrome' },
      URL: {
        createObjectURL: createURL,
        revokeObjectURL: (url) => revoked.push(url),
      },
      setInterval() {},
    }
  )
  return {
    browser,
    calls,
    replies,
    revoked,
    stored,
    submit: (message) =>
      browser.runtime.onMessage.fire(message, { tab: { id: 7 } }),
  }
}

/** 只绑定实际 DownloadControl 事件，不创建设置面板。 */
function frontend() {
  const messages = event(),
    events = [],
    logs = [],
    revoked = [],
    sleeps = []
  const state = { busy: true }
  const { DownloadControl } = loadSource(
    'src/ts/download/DownloadControl.ts',
    {
      'webextension-polyfill': { runtime: { onMessage: messages } },
      '../EVT': {
        EVT: {
          list: new Proxy({}, { get: (_, key) => key }),
          fire: (name) => {
            events.push(name)
            if (name === 'downloadPause') state.busy = false
          },
        },
      },
      '../store/Store': {
        store: { result: [{ id: '42_p0' }, { id: '42_p1' }] },
      },
      '../store/States': { states: state },
      '../Tools': { Tools: { createWorkLink: (id) => id } },
      '../Log': {
        log: {
          error: (s) => logs.push(s),
          warning: (s) => logs.push(s),
          log() {},
        },
      },
      '../Language': {
        lang: { transl: (key, ...values) => [key, ...values].join(' ') },
      },
      '../utils/Utils': {
        Utils: {
          sleep: () => {
            const wait = deferred()
            sleeps.push(wait)
            return wait.promise
          },
        },
      },
      './DownloadStates': {
        downloadStates: { setState: () => events.push('setState') },
      },
    },
    {
      window: { addEventListener() {}, setTimeout() {}, clearTimeout() {} },
      URL: { revokeObjectURL: (url) => revoked.push(url) },
    },
    'DownloadControl'
  )
  const control = Object.create(DownloadControl.prototype)
  Object.assign(control, {
    taskBatch: 1,
    pause: false,
    stop: false,
    taskList: { '42_p0': { index: 0, progressBarIndex: 0 } },
  })
  control.downloadOrSkipAFile = () => events.push('advanceQueue')
  control.createDownload = () => events.push('createDownload')
  control.bindEvents()
  return { control, messages, events, logs, revoked, sleeps }
}

const request = (taskBatch = 1) => ({
  msg: 'save_work_file',
  id: '42_p0',
  taskBatch,
  fileName: '42_p0.jpg',
  blobURL: 'blob:front-' + taskBatch,
})
const failure = (taskBatch = 1) => ({
  msg: 'download_err',
  saveRequestFailed: true,
  err: '<invalid & filename>',
  data: {
    id: '42_p0',
    taskBatch,
    tabId: 7,
    blobURLFront: 'blob:front-' + taskBatch,
    blobURLBack: '',
    uuid: false,
  },
})

test('rejected save reports failure, releases the ID and allows a retry', async () => {
  let attempts = 0
  const env = background({
    save: async () => {
      if (++attempts === 1) throw new Error('Invalid filename')
      return 100
    },
  })
  await env.submit(request())
  assert.equal(env.replies.length, 1)
  assert.equal(env.replies[0].message.msg, 'download_err')
  assert.equal(env.replies[0].message.saveRequestFailed, true)
  assert.equal(env.replies[0].message.data.taskBatch, 1)
  assert.equal(env.stored.idList[7].includes('42_p0'), false)
  assert.ok(env.revoked.includes('blob:front-1'))
  await env.submit(request())
  assert.equal(env.calls.length, 2)
  assert.equal(
    env.replies.length,
    1,
    'starting the retry is not a completed save'
  )
})

test('failed Firefox save releases the background-created blob URL', async () => {
  const env = background({
    firefox: true,
    save: async () => {
      throw new Error('Cannot save')
    },
  })
  await env.submit({ ...request(), blob: {} })
  assert.ok(env.revoked.includes('blob:background'))
  assert.equal(env.replies[0].message.data.blobURLBack, 'blob:background')
})

test('URL preparation failures also report a recoverable save request failure', async () => {
  const env = background({
    firefox: true,
    createURL: () => {
      throw new Error('Cannot create URL')
    },
  })
  await env.submit({ ...request(), blob: {} })
  assert.equal(env.calls.length, 0)
  assert.equal(env.replies[0].message.saveRequestFailed, true)
  assert.equal(env.stored.idList[7].includes('42_p0'), false)
})

test('a closed source tab does not prevent failure cleanup', async () => {
  const env = background({
    save: async () => {
      throw new Error('Cannot save')
    },
    send: async () => {
      throw new Error('Tab closed')
    },
  })
  await env.submit(request())
  assert.equal(env.stored.idList[7].includes('42_p0'), false)
})

test('late rejection does not release the same ID reserved by a newer batch', async () => {
  const old = deferred()
  const env = background({
    save: async () => (env.calls.length === 1 ? old.promise : 200),
  })
  const pending = env.submit(request(1))
  for (let i = 0; i < 8; i++) await Promise.resolve()
  await env.submit(request(2))
  old.reject(new Error('Late failure'))
  await pending
  await env.submit(request(2))
  assert.equal(env.calls.length, 2)
  assert.equal(env.stored.idList[7].includes('42_p0'), true)
  assert.equal(env.replies[0].message.data.taskBatch, 1)
})

test('normal completion still waits for onChanged and carries its batch', async () => {
  const env = background()
  await env.submit(request())
  assert.equal(env.replies.length, 0)
  await env.browser.downloads.onChanged.fire({
    id: 100,
    state: { current: 'complete' },
  })
  assert.equal(env.replies[0].message.msg, 'downloaded')
  assert.equal(env.replies[0].message.data.taskBatch, 1)
  assert.equal(env.calls[0].saveAs, false)
})

test('late onChanged errors cannot remove a newer batch reservation', async () => {
  let id = 100
  const env = background({ save: async () => id++ })
  await env.submit(request(1))
  await env.submit(request(2))
  await env.browser.downloads.onChanged.fire({
    id: 100,
    error: { current: 'FILE_FAILED' },
  })
  await env.submit(request(2))
  assert.equal(env.calls.length, 2)
})

test('save request failure pauses without counting success or scheduling retries', async () => {
  const env = frontend()
  await env.messages.fire(failure())
  assert.equal(env.control.pause, true)
  assert.ok(env.events.includes('saveFileError'))
  assert.equal(env.events.includes('advanceQueue'), false)
  assert.equal(env.events.includes('downloadSuccess'), false)
  assert.equal(env.sleeps.length, 0)
  assert.ok(env.revoked.includes('blob:front-1'))
  assert.ok(env.logs.some((s) => s.includes('&lt;invalid &amp; filename&gt;')))
})

test('old failure is ignored by a new batch but its front blob is released', async () => {
  const env = frontend()
  env.control.taskBatch = 2
  await env.messages.fire(failure(1))
  assert.equal(env.control.pause, false)
  assert.deepEqual(env.events, [])
  assert.ok(env.revoked.includes('blob:front-1'))
})

test('pending save retry stops after pause, stop or batch change', async () => {
  for (const change of [
    (c) => {
      c.pause = true
    },
    (c) => {
      c.stop = true
    },
    (c) => {
      c.taskBatch = 2
    },
  ]) {
    const env = frontend()
    const pending = env.control.saveFileError(failure().data)
    change(env.control)
    env.sleeps[0].resolve()
    await pending
    assert.equal(env.events.includes('createDownload'), false)
  }
})

test('existing browser interruption still retries; user cancellation still skips', async () => {
  const interrupted = frontend()
  await interrupted.messages.fire({
    ...failure(),
    saveRequestFailed: undefined,
    err: 'FILE_FAILED',
  })
  assert.equal(interrupted.control.pause, false)
  assert.equal(interrupted.sleeps.length, 1)
  interrupted.sleeps[0].resolve()
  for (let i = 0; i < 8; i++) await Promise.resolve()
  assert.ok(interrupted.events.includes('createDownload'))
  const canceled = frontend()
  await canceled.messages.fire({
    ...failure(),
    saveRequestFailed: undefined,
    err: 'USER_CANCELED',
  })
  assert.ok(canceled.events.includes('advanceQueue'))
  assert.equal(canceled.sleeps.length, 0)
})
