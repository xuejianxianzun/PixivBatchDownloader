'use strict'
// 「复制作品信息的格式」的旧设置迁移（src/ts/setting/ConvertOldSettings.ts 的 convertString）：
// 1. 旧设置里的换行标记 {n} 会转换成真正的换行符
// 2. 来自配置文件的 CRLF / CR 会统一成 LF
// 3. 不属于换行标记的花括号内容（如 {name}）不会被误替换
// 4. 其它设置项的转换不受影响
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 编译真实源码（这个模块没有外部依赖） */
function loadModule(file) {
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
  vm.runInNewContext(code, { exports, console }, { filename: file })
  return exports
}

const { convertOldSettings } = loadModule('setting/ConvertOldSettings.ts')

/** 按设置项的方式转换一次 */
function convert(format) {
  return convertOldSettings.convertString('copyWorkInfoFormat', format)
}

test('把旧设置里的 {n} 转换成换行符', () => {
  assert.equal(
    convert('id: {id}{n}title: {title}{n}tags: {tags}'),
    'id: {id}\ntitle: {title}\ntags: {tags}'
  )
})

test('把 CRLF 和 CR 统一成 LF', () => {
  assert.equal(convert('a\r\nb\rc\nd'), 'a\nb\nc\nd')
  // 旧标记和 Windows 换行混在一起时也能正确处理
  assert.equal(convert('a{n}b\r\nc'), 'a\nb\nc')
})

test('已经是换行符的设置不会被改动', () => {
  const format = 'id: {id}\ntitle: {title}'
  assert.equal(convert(format), format)
})

test('不会误替换其它花括号内容', () => {
  // {name} 不是 {n}，{n2} 也不是
  assert.equal(convert('{name}{n2}{n}'), '{name}{n2}\n')
})

test('其它设置项的转换不受影响', () => {
  // 旧的单选值仍然会转换成新的设置值
  assert.equal(convertOldSettings.convertString('ratio', '1'), 'horizontal')
  assert.equal(convertOldSettings.convertString('userSetLang', '0'), 'zh-cn')
  // 已经是新值的不会被改动
  assert.equal(convertOldSettings.convertString('ratio', 'square'), 'square')
  // 无关的设置项原样返回
  assert.equal(convertOldSettings.convertString('tagsSeparator', ','), ',')
})

test('widthTag 的旧值转换成新的语义值', () => {
  // 最早的值：1 / -1
  assert.equal(convertOldSettings.convertString('widthTag', '1'), 'origin')
  assert.equal(convertOldSettings.convertString('widthTag', '-1'), 'none')
  // 上一版的值：yes 对应“添加作品的原始标签”，no 对应“不添加”
  assert.equal(convertOldSettings.convertString('widthTag', 'yes'), 'origin')
  assert.equal(convertOldSettings.convertString('widthTag', 'no'), 'none')
  // 已经是新值的不被改动
  assert.equal(convertOldSettings.convertString('widthTag', 'origin'), 'origin')
  assert.equal(convertOldSettings.convertString('widthTag', 'transl'), 'transl')
  assert.equal(convertOldSettings.convertString('widthTag', 'none'), 'none')
})
