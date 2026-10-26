'use strict'
// IndexedDB.getAllByPage 的分页读取测试。
//
// 导出下载记录时，一个存储库的记录可能远大于单个导出文件的体积上限，
// 一次 getAll 全读进来会把内存吃光；分页读取让内存里只有当前这一页。
// 分页用的是 getAll(keyRange, count)（一个请求返回一整页），而不是游标
// （游标每条记录都要等一次事件循环往返，几十万条会明显变慢）。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 加载真实的 IndexedDB.ts。IDBKeyRange 用假的，只要能把 range 的形状记录下来 */
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
    {
      exports,
      console,
      setTimeout,
      // 只要形状对得上就行，真正的比较逻辑在下面的假数据库里
      IDBKeyRange: {
        lowerBound: (key, open) => ({ type: 'lowerBound', key, open }),
      },
    },
    { filename: 'IndexedDB.ts' }
  )
  return exports.IndexedDB
}

const IndexedDB = loadIndexedDB()

/**
 * 假的 IDBDatabase：按主键升序返回记录，支持 lowerBound 和 count。
 * 它只实现 getAll（带 query 和 count 两个参数），没实现游标/openCursor。
 */
function createFakeDb(records) {
  const calls = []
  const sorted = records
    .slice()
    .sort((a, b) => (String(a.id) < String(b.id) ? -1 : 1))

  const db = {
    transaction(storeName, mode) {
      calls.push({ storeName, mode })
      return {
        objectStore: () => ({
          getAll(query, count) {
            const request = {}
            let list = sorted
            if (query) {
              list = sorted.filter((item) =>
                query.open
                  ? String(item.id) > String(query.key)
                  : String(item.id) >= String(query.key)
              )
            }
            // count 为 undefined 时不限制数量（和浏览器一致）
            request.result = count === undefined ? list : list.slice(0, count)
            // 真实实现是异步的
            setTimeout(() => request.onsuccess && request.onsuccess(), 0)
            return request
          },
        }),
      }
    },
  }

  return { db, calls }
}

function makeRecords(count) {
  const list = []
  for (let i = 0; i < count; i++) {
    list.push({ id: String(10000 + i), n: `file-${i}.png` })
  }
  // 故意打乱，确认返回值是按主键升序的（分页靠的就是这个顺序）
  return list.reverse()
}

test('第一页不带 key range，一次最多读 count 条', async () => {
  const { db, calls } = createFakeDb(makeRecords(10))
  const idb = new IndexedDB()
  idb.db = db

  const page = await idb.getAllByPage('record1', undefined, 4)
  assert.equal(page.length, 4)
  assert.equal(page[0].id, '10000', '按主键升序返回')
  assert.equal(calls[0].storeName, 'record1')
  // 只读操作不能用 readwrite：那会和别的标签页里的写入互相排队
  assert.equal(calls[0].mode, 'readonly')
})

test('下一页从上一页最后一条之后开始，不会重复也不会漏', async () => {
  const { db } = createFakeDb(makeRecords(10))
  const idb = new IndexedDB()
  idb.db = db

  // 完全照着 DownloadRecordManager.iterateRecords 的读法
  const ids = []
  let lastKey
  while (true) {
    const page = await idb.getAllByPage('record1', lastKey, 3)
    if (!page) {
      break
    }
    lastKey = page[page.length - 1].id
    for (const item of page) {
      ids.push(item.id)
    }
  }

  assert.equal(ids.length, 10, '10 条记录要全部读到')
  assert.equal(new Set(ids).size, 10, '不能有重复')
  assert.deepEqual(
    [...ids].sort(),
    makeRecords(10)
      .map((item) => item.id)
      .sort(),
    '读到的记录要和库里的完全一致'
  )
})

test('read 完之后返回 null（而不是空数组），调用方据此结束', async () => {
  const { db } = createFakeDb(makeRecords(2))
  const idb = new IndexedDB()
  idb.db = db

  assert.ok(await idb.getAllByPage('record1', undefined, 5))

  // 已经读到底：下一次要返回 null，否则 while 循环停不下来
  const next = await idb.getAllByPage('record1', String(10001), 5)
  assert.equal(next, null)
})

test('空存储库直接返回 null', async () => {
  const { db } = createFakeDb([])
  const idb = new IndexedDB()
  idb.db = db

  assert.equal(await idb.getAllByPage('record1', undefined, 100), null)
})

test('数据库不可用时立即失败，不能让调用方永远等下去', async () => {
  const idb = new IndexedDB()
  idb.db = undefined

  await assert.rejects(
    () => idb.getAllByPage('record1', undefined, 100),
    /Database is not defined/
  )
})
