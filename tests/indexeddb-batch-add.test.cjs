'use strict'
// IndexedDB.batchAddData 的测试。
//
// 这个函数负责把导入的下载记录写进 IndexedDB，导入几十万条记录时的速度完全取决于它。
// 以前的做法有三个问题：
// 1. 为了决定 add 还是 put，会把库里所有 key 读成数组，再用 includes 逐条查找（O(n) 线性扫描）；
// 2. 每条记录都 await 一次请求；
// 3. 一个事务塞进几十万条请求。
//
// 这里用假的 IDBDatabase 加载真实源码，锁定现在的做法：
// 一律用 put（不再读所有 key）、按块拆分事务、每块的请求一次性发起。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 加载真实的 IndexedDB.ts */
function loadIndexedDB() {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts/utils', 'IndexedDB.ts'),
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
    { exports, console, setTimeout },
    { filename: 'IndexedDB.ts' }
  )
  return exports.IndexedDB
}

const IndexedDB = loadIndexedDB()

/**
 * 假的 IDBDatabase。
 *
 * 注意它只实现了 put（没有 add）：如果代码改用 add 就会抛错，测试会失败。
 * 它也没有 getAllKeys —— 如果代码又回去读所有 key 做 includes 查找，也会抛错。
 */
function createFakeDb(options = {}) {
  const transactions = []
  const puts = []

  const db = {
    puts,
    transactions,
    transaction(storeName, mode) {
      if (options.throwOnTransaction) {
        throw new Error('InvalidStateError')
      }
      const tr = {
        storeName,
        mode,
        error: null,
        oncomplete: null,
        onerror: null,
        onabort: null,
        objectStore() {
          return {
            put(data) {
              puts.push(data)
            },
          }
        },
      }
      transactions.push(tr)
      // 事务结束后再异步通知，模拟浏览器的行为
      setTimeout(() => {
        if (options.abort) {
          tr.error = new Error('QuotaExceededError')
          if (tr.onabort) {
            tr.onabort()
          }
          return
        }
        if (tr.oncomplete) {
          tr.oncomplete()
        }
      }, 0)
      return tr
    },
  }

  return db
}

function makeData(count) {
  const list = []
  for (let i = 0; i < count; i++) {
    list.push({ id: String(1000000 + i), n: `file-${i}.png` })
  }
  return list
}

test('按块拆分事务，并且一律使用 put 写入', async () => {
  const db = createFakeDb()
  const idb = new IndexedDB()
  idb.db = db

  const data = makeData(50000)
  await idb.batchAddData('record1', data, 20000)

  // 50000 条 / 每块 20000 = 3 个事务
  assert.equal(db.transactions.length, 3)
  assert.ok(db.transactions.every((tr) => tr.mode === 'readwrite'))
  assert.equal(db.puts.length, 50000)
  assert.deepEqual(
    JSON.stringify(db.puts[0]),
    JSON.stringify(data[0]),
    '写入的内容要和原始数据一致'
  )
})

test('默认每块 2 万条', async () => {
  const db = createFakeDb()
  const idb = new IndexedDB()
  idb.db = db

  await idb.batchAddData('record1', makeData(30000))
  assert.equal(db.transactions.length, 2)
  assert.equal(db.puts.length, 30000)
})

test('空数组时不开事务', async () => {
  const db = createFakeDb()
  const idb = new IndexedDB()
  idb.db = db

  await idb.batchAddData('record1', [])
  assert.equal(db.transactions.length, 0)
})

test('数据库不可用时立即失败，不能让调用方永远等下去', async () => {
  const idb = new IndexedDB()
  idb.db = undefined

  // 以前这里是 new Promise(async (resolve, reject) => { throw ... })，
  // 异常会变成执行器自己的未处理拒绝，外层 promise 永远 pending，导入界面就卡死了
  await assert.rejects(
    () => idb.batchAddData('record1', makeData(10)),
    /Database is not defined/
  )
})

test('创建事务时同步抛异常也要能 reject', async () => {
  const idb = new IndexedDB()
  idb.db = createFakeDb({ throwOnTransaction: true })

  await assert.rejects(
    () => idb.batchAddData('record1', makeData(10)),
    /InvalidStateError/
  )
})

test('事务 abort 时把错误传给调用方', async () => {
  const idb = new IndexedDB()
  idb.db = createFakeDb({ abort: true })

  await assert.rejects(
    () => idb.batchAddData('record1', makeData(10)),
    /QuotaExceededError/
  )
})
