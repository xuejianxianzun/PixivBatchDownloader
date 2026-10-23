'use strict'
// utils/CreateCSV 的测试。
//
// 它不在 download/ 目录里，但「导出抓取结果为 CSV」（download/ExportResult2CSV）的
// 全部文本处理都在这里：字段转义写错时导出的文件会错列，而且不会有任何报错。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 加载真实的 CreateCSV（没有外部依赖，只用到 Blob） */
function loadCreateCSV() {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts/utils/CreateCSV.ts'),
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
    { exports, console, Blob },
    { filename: 'CreateCSV.ts' }
  )
  return exports.createCSV
}

const createCSV = loadCreateCSV()

/** 生成 CSV 文本。检查开头的 BOM，并去掉它以便断言剩下的内容 */
// 注意：blob.text() 会自动去掉 BOM，所以必须读字节才能检查它
async function toText(data) {
  const blob = createCSV.create(data)
  const bytes = new Uint8Array(await blob.arrayBuffer())
  assert.deepEqual(
    Array.from(bytes.slice(0, 3)),
    [0xef, 0xbb, 0xbf],
    '开头应该有 UTF-8 BOM'
  )
  return new TextDecoder('utf-8').decode(bytes.slice(3))
}

test('每行以 CRLF 结尾，列之间用逗号分隔', async () => {
  const text = await toText([
    ['a', 'b'],
    ['c', 'd'],
  ])
  assert.equal(text, 'a,b\r\nc,d\r\n')
})

test('含有逗号、空格、换行符、双引号的值要用双引号包裹', async () => {
  const text = await toText([['b,b,b', 'c c c', 'a\nb', 'a"b']])
  // 值里原本的双引号要写两遍
  assert.equal(text, '"b,b,b","c c c","a\nb","a""b"\r\n')
})

test('数组用逗号连接后，因为含有逗号所以也会被包裹', async () => {
  const text = await toText([[[1, 2, 3], ['x']]])
  assert.equal(text, '"1,2,3",x\r\n')
})

test('非字符串的值转换成字符串，null 和 undefined 变成空值', async () => {
  const text = await toText([[123, true, null, undefined]])
  assert.equal(text, '123,true,,\r\n')
})

test('中文和全角符号不需要加双引号', async () => {
  const text = await toText([['中文，测试', '（括号）']])
  assert.equal(text, '中文，测试,（括号）\r\n')
})
