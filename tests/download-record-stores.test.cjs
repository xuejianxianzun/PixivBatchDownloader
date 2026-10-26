'use strict'
// 下载记录模块的数据库层测试：
// 1. 存储库结构（1 版本那个冗余的 id 索引）；
// 2. 数据库升级时的提示（全新安装不应该提示）；
// 3. 什么时候申请持久化存储（Firefox 会弹授权框，不能在页面刚加载时就申请）。
//
// 1 版本的数据库给每个存储库都建了一个 id 索引，而它和主键（keyPath 也是 id）完全重复，
// 从来没有被任何查询用到。但它会让每次写入和清除都多维护一份索引数据：
// Chromium 里清除带索引的存储库比不带索引的慢一个数量级（导入/清除下载记录慢的主因）。
// 2 版本不再创建它，并在升级时把已有的删掉。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

const STORES = []
for (let i = 1; i <= 9; i++) {
  STORES.push(`record${i}`)
}

/** 排空 Promise 队列（模块在顶层就 new 了实例，异步初始化要等它跑完） */
async function flush() {
  for (let i = 0; i < 50; i++) {
    await Promise.resolve()
  }
}

/**
 * 加载真实的 DownloadRecord.ts。
 *
 * options.oldVersion 会给假数据库的 open 用：模拟浏览器在版本变更时触发的升级事件
 * （0 表示新建数据库，即全新安装）。
 */
function loadDownloadRecord(options = {}) {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts/download', 'DownloadRecord.ts'),
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
  const window = { addEventListener() {} }
  const logs = []
  const msgBoxCalls = []
  /** open 请求的参数，用来确认请求的版本号 */
  const openCalls = []
  /** 实际写进数据库的记录 */
  const puts = []
  /** 申请持久化存储的次数 */
  let persistCalls = 0

  /** 升级事件里的数据库对象：9 个存储库都已经存在、且没有 id 索引 */
  const fakeUpgradeDb = {
    objectStoreNames: { contains: () => true },
  }
  const fakeUpgradeTransaction = {
    oncomplete: null,
    objectStore: () => ({
      indexNames: { contains: () => false },
      deleteIndex() {},
    }),
  }

  // 这个模块在顶层就 new 了 DownloadRecord()，所以每个依赖都要给一个能用的替身
  const imports = {
    '../EVT': { EVT: { list: new Proxy({}, { get: (_, key) => key }) } },
    '../setting/Settings': { settings: {} },
    './DownloadType': {},
    '../utils/IndexedDB': {
      IndexedDB: class {
        constructor() {
          this.db = undefined
        }
        // 和真实实现一样：从事件或 Error 里取出一个简短的原因
        static getErrorName(ev) {
          if (typeof ev === 'string') {
            return ev
          }
          const name = ev?.target?.error?.name || ev?.name
          if (name && name !== 'Error') {
            return name
          }
          return ev?.message || name || 'unknown'
        }
        async open(DBName, DBVer, onUpgrade) {
          openCalls.push({ DBName, DBVer })
          if (options.openError) {
            throw options.openError
          }
          // 和浏览器一样：只有请求的版本比当前版本高才会触发升级事件
          if (onUpgrade && options.oldVersion !== undefined) {
            onUpgrade(fakeUpgradeDb, fakeUpgradeTransaction, options.oldVersion)
            // 升级事务提交
            if (fakeUpgradeTransaction.oncomplete) {
              fakeUpgradeTransaction.oncomplete()
            }
          }
          this.db = { name: DBName }
          return this.db
        }
        async put(storeName, data) {
          if (options.putError) {
            throw options.putError
          }
          puts.push({ storeName, data })
        }
      },
    },
    '../store/Store': { store: { findResult: () => undefined } },
    '../FileName': { fileName: { createFileName: () => '' } },
    '../utils/Utils': {
      Utils: {
        async requestPersistentStorage() {
          persistCalls++
          return options.persisted === true
        },
      },
    },
    '../store/StoreType': {},
    './DownloadRecordManager': {
      DownloadRecordManager: class {
        constructor() {}
      },
    },
    '../Log': {
      log: new Proxy(
        {},
        {
          get:
            (_, type) =>
            (...args) =>
              logs.push({ type, text: args.map(String).join(' ') }),
        }
      ),
    },
    '../Language': { lang: { transl: (key) => key } },
    '../MsgBox': {
      msgBox: new Proxy(
        {},
        {
          get: (_, type) => (msg) =>
            msgBoxCalls.push({ type, text: String(msg) }),
        }
      ),
    },
  }

  vm.runInNewContext(
    code,
    {
      exports,
      console,
      window,
      setTimeout,
      indexedDB: { open: () => ({}) },
      require: (name) => {
        assert.ok(name in imports, `Missing dependency: ${name}`)
        return imports[name]
      },
    },
    { filename: 'DownloadRecord.ts' }
  )
  return {
    createRecordStores: exports.createRecordStores,
    downloadRecord: exports.downloadRecord,
    logs,
    msgBoxCalls,
    openCalls,
    puts,
    get persistCalls() {
      return persistCalls
    },
  }
}

/**
 * 假的 IDBDatabase。
 *
 * existing 里列出的存储库会带上那个冗余的 id 索引（模拟 1 版本的数据库）
 */
function createFakeDb(existing) {
  const created = []
  const deletedIndexes = []
  const indexes = new Map()

  for (const name of existing) {
    indexes.set(name, new Set(['id']))
  }

  /** 记录有没有走「另开事务」这条错路 */
  const ownTransactions = []

  const db = {
    objectStoreNames: {
      contains: (name) => indexes.has(name),
    },
    createObjectStore(name, options) {
      created.push({ name, options })
      indexes.set(name, new Set())
      return {
        createIndex: (indexName) => indexes.get(name).add(indexName),
      }
    },
    // 升级事件里另开 db.transaction() 是错的：那样要等升级结束后才执行，
    // 那时已经不允许改结构了。所以测试里要抓住这种行为
    transaction(name) {
      ownTransactions.push(name)
      return {
        objectStore: () => ({
          indexNames: {
            contains: (indexName) => indexes.get(name).has(indexName),
          },
          deleteIndex: (indexName) => {
            indexes.get(name).delete(indexName)
            deletedIndexes.push(`${name}.${indexName}`)
          },
        }),
      }
    },
  }

  /** 版本变更事务（升级事件里应该用的就是这个） */
  const transaction = {
    objectStore: (name) => ({
      indexNames: {
        contains: (indexName) => indexes.get(name).has(indexName),
      },
      deleteIndex: (indexName) => {
        indexes.get(name).delete(indexName)
        deletedIndexes.push(`${name}.${indexName}`)
      },
    }),
  }

  return { db, transaction, created, deletedIndexes, indexes, ownTransactions }
}

const { createRecordStores } = loadDownloadRecord()

test('新建数据库时创建 9 个存储库，并且不再创建冗余的 id 索引', () => {
  const fake = createFakeDb([])
  createRecordStores(fake.db, fake.transaction, STORES)

  assert.equal(fake.created.length, 9)
  assert.ok(
    fake.created.every((item) => item.options.keyPath === 'id'),
    '主键应该还是 id'
  )
  // 关键：不能有任何索引
  for (const [, set] of fake.indexes) {
    assert.equal(set.size, 0, '新建的存储库不应该带索引')
  }
  assert.equal(fake.deletedIndexes.length, 0)
})

test('从 1 版本升级时，删掉每个存储库里冗余的 id 索引', () => {
  const fake = createFakeDb(STORES)
  createRecordStores(fake.db, fake.transaction, STORES)

  // 存储库已经存在，不应该重复创建
  assert.equal(fake.created.length, 0)
  assert.equal(fake.deletedIndexes.length, 9)
  for (const name of STORES) {
    assert.ok(
      fake.deletedIndexes.includes(`${name}.id`),
      `${name} 的冗余索引应该被删掉`
    )
    assert.equal(fake.indexes.get(name).size, 0)
  }
})

test('重复执行不会重复删除（索引已经不存在时什么都不做）', () => {
  const fake = createFakeDb(STORES)
  createRecordStores(fake.db, fake.transaction, STORES)
  createRecordStores(fake.db, fake.transaction, STORES)

  assert.equal(fake.deletedIndexes.length, 9)
})

test('数据库里有部分存储库时，只处理缺的那几个', () => {
  const fake = createFakeDb(['record1', 'record2'])
  createRecordStores(fake.db, fake.transaction, STORES)

  // 已存在的两个只删索引，另外 7 个新建
  assert.equal(fake.created.length, 7)
  assert.equal(fake.deletedIndexes.length, 2)
  assert.ok(fake.deletedIndexes.includes('record1.id'))
  assert.ok(fake.deletedIndexes.includes('record2.id'))
})

test('删索引必须用版本变更事务，不能在升级事件里另开事务', () => {
  const fake = createFakeDb(STORES)
  createRecordStores(fake.db, fake.transaction, STORES)

  // 在升级事件里另开 db.transaction() 的话，那个事务要等升级结束后才执行，
  // 那时已经不允许改结构，deleteIndex 会失败（2 版本就是这么失败的）
  assert.equal(fake.ownTransactions.length, 0, '不应该在升级事件里另开事务')
  assert.equal(fake.deletedIndexes.length, 9)
})

test('拿不到版本变更事务时，不动已有存储库的结构', () => {
  const fake = createFakeDb(STORES)
  // 模拟 request.transaction 取不到的情况：这时只能建缺失的存储库，
  // 不能碰已存在存储库的结构（会抛错，把整个升级搞失败）
  createRecordStores(fake.db, undefined, STORES)

  assert.equal(fake.created.length, 0)
  assert.equal(fake.deletedIndexes.length, 0)
})

test('从旧版本升级时要提示，并在升级事务完成后提示完成', async () => {
  const { logs, msgBoxCalls, openCalls } = loadDownloadRecord({ oldVersion: 1 })
  await flush()

  // 请求 3 版本才会触发升级
  assert.equal(openCalls.length, 1)
  assert.equal(openCalls[0].DBVer, 3)

  assert.equal(
    msgBoxCalls.length,
    2,
    '应该有「升级开始」和「升级完成」两个提示'
  )
  assert.equal(msgBoxCalls[0].type, 'warning')
  assert.equal(msgBoxCalls[0].text, '_IndexedDB需要升级')
  // 升级事务提交后才提示完成
  assert.equal(msgBoxCalls[1].type, 'success')
  assert.equal(msgBoxCalls[1].text, '_IndexedDB升级完成')

  assert.ok(
    logs.some(
      (l) => l.type === 'warning' && l.text.includes('_IndexedDB需要升级')
    )
  )
  assert.ok(
    logs.some(
      (l) => l.type === 'success' && l.text.includes('_IndexedDB升级完成')
    )
  )
})

test('全新安装（建库）时不应该提示升级', async () => {
  // oldVersion 为 0：数据库还不存在，用户什么都没丢，只是建库
  const { logs, msgBoxCalls } = loadDownloadRecord({ oldVersion: 0 })
  await flush()

  assert.equal(msgBoxCalls.length, 0, '全新安装不应该弹出任何消息框')
  assert.ok(!logs.some((l) => l.text.includes('_IndexedDB需要升级')))
  assert.ok(!logs.some((l) => l.text.includes('_IndexedDB升级完成')))
})

test('页面加载时不申请持久化存储，第一次成功写入记录之后才申请一次', async () => {
  const harness = loadDownloadRecord({ oldVersion: 0, persisted: true })
  await flush()

  // Firefox 会为 persist() 弹授权框，页面刚加载时不能打扰用户
  assert.equal(harness.persistCalls, 0, '加载阶段不应该申请')
  assert.equal(harness.msgBoxCalls.length, 0)

  await harness.downloadRecord.addRecordFromRecord({ id: '12345', n: 'a.png' })
  await flush()
  assert.equal(harness.persistCalls, 1, '第一次写入成功后应该申请')
  assert.equal(harness.puts.length, 1)

  await harness.downloadRecord.addRecordFromRecord({ id: '23456', n: 'b.png' })
  await flush()
  assert.equal(harness.persistCalls, 1, '每个页面只申请一次')
  assert.equal(harness.puts.length, 2)
})

test('写入失败时不申请持久化存储', async () => {
  const harness = loadDownloadRecord({
    oldVersion: 0,
    putError: new Error('QuotaExceededError'),
  })
  await flush()

  await harness.downloadRecord.addRecordFromRecord({ id: '12345', n: 'a.png' })
  await flush()

  assert.equal(harness.persistCalls, 0)
  // 写不进去要在日志里说清楚（QuotaExceededError 这类名字），不能静默
  assert.ok(
    harness.logs.some(
      (l) => l.type === 'error' && l.text.includes('QuotaExceeded')
    )
  )
})
