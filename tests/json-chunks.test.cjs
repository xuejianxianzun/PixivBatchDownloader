'use strict'
// Utils.json2BlobSafe 的分片测试。
//
// 这个函数负责把抓取结果 / 下载记录导出成 JSON 文件。数据多的时候会拆成多个文件，
// 一旦切分位置算错，导出的文件就不是合法 JSON，用户备份的数据直接报废；
// 而单个文件的体积上限又直接决定了手机端会不会卡死（见 Issue #699）。
// 所以这里检查三件事：每片都是合法 JSON、记录不重复不丢失、每片体积不超过上限太多。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 加载真实的 Utils.ts，并记录它创建的每个 Blob（这样就能读到每片的内容） */
function loadUtils() {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts/utils', 'Utils.ts'),
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
  const blobs = []

  vm.runInNewContext(
    code,
    {
      exports,
      console,
      Blob: class extends Blob {
        constructor(parts, options) {
          super(parts, options)
          blobs.push(this)
        }
      },
      TextEncoder,
      URL,
      require: (name) => {
        assert.equal(name, './SetTimeoutWorker')
        return { setTimeoutWorker: { sleep: async () => {} } }
      },
    },
    { filename: 'Utils.ts' }
  )

  return { Utils: exports.Utils, blobs }
}

/** 造一条和真实下载记录结构相同的数据 */
function makeRecord(index) {
  return {
    id: String(10000000 + index),
    n: `作品标题-${index}_p0.png`,
    d: '2021/10/11/00/00/06',
  }
}

test('体积超过上限时拆成多个文件，每片都是合法 JSON 且记录不重复不丢失', async () => {
  const { Utils, blobs } = loadUtils()
  const data = []
  for (let i = 0; i < 200; i++) {
    data.push(makeRecord(i))
  }

  // 上限取 2000 字节，确保一定会被拆开
  const limit = 2000
  const list = await Utils.json2BlobSafe(data, limit)

  assert.ok(list.length > 1, '应该拆成了多个文件')
  assert.equal(blobs.length, list.length, '每个结果对应一个 Blob')

  // 文件数 = 各片记录数之和
  const total = list.reduce((sum, item) => sum + item.total, 0)
  assert.equal(total, data.length)

  const merged = []
  for (let i = 0; i < list.length; i++) {
    const text = await blobs[i].text()
    // 每片都必须是合法 JSON 数组，否则导入会失败
    const parsed = JSON.parse(text)
    assert.ok(Array.isArray(parsed))
    assert.equal(parsed.length, list[i].total)
    merged.push(...parsed)

    // 允许超出上限一条记录（先加入再判断是否需要结束当前文件），所以按最大单条记录留出余量
    assert.ok(
      Buffer.byteLength(text, 'utf8') <= limit + 300,
      `第 ${i + 1} 个文件超出了上限过多`
    )
  }

  // 顺序和内容都要和原始数据完全一致
  assert.deepEqual(merged, data)
})

test('数据不多时只生成一个文件', async () => {
  const { Utils, blobs } = loadUtils()
  const data = [makeRecord(1), makeRecord(2), makeRecord(3)]

  const list = await Utils.json2BlobSafe(data, 1024 * 1024)
  assert.equal(list.length, 1)
  assert.equal(list[0].total, 3)
  assert.deepEqual(JSON.parse(await blobs[0].text()), data)
})

test('默认上限是 500 MB（桌面端行为不变）', async () => {
  const { Utils } = loadUtils()
  const data = []
  for (let i = 0; i < 50; i++) {
    data.push(makeRecord(i))
  }
  // 不传第二个参数时不会被拆开
  const list = await Utils.json2BlobSafe(data)
  assert.equal(list.length, 1)
  assert.equal(list[0].total, data.length)
})

test('上限小于一条记录时，每个文件仍然是一条完整的记录', async () => {
  const { Utils, blobs } = loadUtils()
  const data = [makeRecord(1), makeRecord(2)]

  const list = await Utils.json2BlobSafe(data, 1)
  assert.equal(list.length, 2)
  for (let i = 0; i < list.length; i++) {
    assert.equal(list[i].total, 1)
    const parsed = JSON.parse(await blobs[i].text())
    assert.deepEqual(parsed, [data[i]])
  }
})

test('json2BlobChunks：数组输入的结果和 json2BlobSafe 一致', async () => {
  const { Utils, blobs } = loadUtils()
  const data = []
  for (let i = 0; i < 200; i++) {
    data.push(makeRecord(i))
  }

  const safe = await Utils.json2BlobSafe(data, 2000)
  const safeText = []
  for (let i = 0; i < safe.length; i++) {
    safeText.push(await blobs[i].text())
  }

  // 重新加载一次，让 blob 记录从零开始
  const fresh = loadUtils()
  const chunks = []
  const count = await fresh.Utils.json2BlobChunks(data, 2000, (url, total) => {
    chunks.push(total)
  })

  assert.equal(count, data.length, '返回值是导出的记录总数')
  assert.deepEqual(
    JSON.stringify(chunks),
    JSON.stringify(safe.map((s) => s.total))
  )
  for (let i = 0; i < chunks.length; i++) {
    assert.equal(await fresh.blobs[i].text(), safeText[i])
  }
})

test('json2BlobChunks：流式处理，不会一次性读完所有数据', async () => {
  const { Utils } = loadUtils()

  /** 记录生成器被消费到哪一条了 */
  const pulled = []
  async function* generate() {
    for (let i = 0; i < 10; i++) {
      pulled.push(i)
      yield makeRecord(i)
    }
  }

  /** 第一个文件生成时，生成器读到了第几条 */
  let pulledAtFirstFile = -1

  // 上限 200 字节，一条记录约 105 字节，所以第 2 条就会触发一次分片
  const count = await Utils.json2BlobChunks(generate(), 200, () => {
    if (pulledAtFirstFile === -1) {
      pulledAtFirstFile = pulled.length
    }
  })

  assert.equal(count, 10)
  // 每条记录约 71 字节：累积到第 3 条时（1+72+72+72=217）才第一次达到 200 字节的上限。
  // 所以第一个文件生成时只读了 3 条，而不是把 10 条都读进内存
  assert.equal(pulledAtFirstFile, 3)
  assert.equal(pulled.length, 10, '最后所有数据都读完')
})

test('json2BlobChunks：会等 onFile 回调完成才继续读数据', async () => {
  const { Utils } = loadUtils()

  const pulled = []
  async function* generate() {
    for (let i = 0; i < 10; i++) {
      pulled.push(i)
      yield makeRecord(i)
    }
  }

  let resolveGate = () => {}
  const gate = new Promise((resolve) => {
    resolveGate = resolve
  })
  let pulledWhenPending = -1

  const task = Utils.json2BlobChunks(generate(), 200, async () => {
    pulledWhenPending = pulled.length
    await gate
  })

  // 回调里在等 gate，这时不应该继续读后面的数据
  await new Promise((resolve) => setTimeout(resolve, 10))
  assert.equal(pulled.length, pulledWhenPending, '回调未完成时不应继续读取')

  resolveGate()
  await task
  assert.equal(pulled.length, 10)
})

test('json2BlobChunks：没有数据时不生成文件', async () => {
  const { Utils } = loadUtils()
  let calls = 0
  const count = await Utils.json2BlobChunks([], 1024, () => {
    calls++
  })
  assert.equal(count, 0)
  assert.equal(calls, 0)
})

test('json2BlobChunksBatched：按批处理，结果和逐条处理一致', async () => {
  const fresh = loadUtils()
  const data = []
  for (let i = 0; i < 200; i++) {
    data.push(makeRecord(i))
  }

  // 逐条
  const perItem = []
  await fresh.Utils.json2BlobChunks(data, 2000, (url, total) => {
    perItem.push(total)
  })
  const perItemText = []
  for (let i = 0; i < perItem.length; i++) {
    perItemText.push(await fresh.blobs[i].text())
  }

  // 按批（每批 7 条）
  const again = loadUtils()
  const batches = []
  for (let i = 0; i < data.length; i += 7) {
    batches.push(data.slice(i, i + 7))
  }
  const perBatch = []
  const count = await again.Utils.json2BlobChunksBatched(
    batches,
    2000,
    (url, total) => {
      perBatch.push(total)
    }
  )

  assert.equal(count, data.length)
  assert.deepEqual(
    JSON.stringify(perBatch),
    JSON.stringify(perItem),
    '分片方式不应该影响结果'
  )
  for (let i = 0; i < perBatch.length; i++) {
    assert.equal(await again.blobs[i].text(), perItemText[i])
  }
})

test('json2BlobChunksBatched：一批没处理完就达到上限时，剩下的放到下一个文件', async () => {
  const { Utils, blobs } = loadUtils()
  const data = []
  for (let i = 0; i < 100; i++) {
    data.push(makeRecord(i))
  }

  // 每批 50 条，但上限只够放 30 条左右 → 应该产生多个文件
  const totals = []
  const count = await Utils.json2BlobChunksBatched(
    [data.slice(0, 50), data.slice(50)],
    30 * 72,
    (url, total) => {
      totals.push(total)
    }
  )

  assert.equal(count, 100)
  assert.equal(
    totals.reduce((a, b) => a + b, 0),
    100,
    '所有记录都要被导出，不能丢'
  )
  assert.ok(totals.length > 1, '应该产生了多个文件')

  // 每个文件都必须是合法 JSON
  const merged = []
  for (let i = 0; i < totals.length; i++) {
    const parsed = JSON.parse(await blobs[i].text())
    assert.ok(Array.isArray(parsed))
    assert.equal(parsed.length, totals[i])
    merged.push(...parsed)
  }
  assert.equal(merged.length, 100)
})

test('json2BlobChunksBatched：没有数据时不生成文件', async () => {
  const { Utils } = loadUtils()
  let calls = 0
  const count = await Utils.json2BlobChunksBatched([], 1024, () => {
    calls++
  })
  assert.equal(count, 0)
  assert.equal(calls, 0)
})
