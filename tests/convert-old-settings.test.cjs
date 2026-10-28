'use strict'
// 「复制作品信息的格式」的旧设置迁移（src/ts/setting/ConvertOldSettings.ts 的 convertString）：
// 1. 旧设置里的换行标记 {n} 会转换成真正的换行符
// 2. 来自配置文件的 CRLF / CR 会统一成 LF
// 3. 不属于换行标记的花括号内容（如 {name}）不会被误替换
// 4. 其它设置项的转换不受影响
// 5. 旧设置名 widthTag（with 的拼写错误）会迁移到 withTag，且旧值仍然能转换
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

test('withTag 的旧值转换成新的语义值', () => {
  // 最早的值：1 / -1
  assert.equal(convertOldSettings.convertString('withTag', '1'), 'origin')
  assert.equal(convertOldSettings.convertString('withTag', '-1'), 'none')
  // 上一版的值：yes 对应“添加作品的原始标签”，no 对应“不添加”
  assert.equal(convertOldSettings.convertString('withTag', 'yes'), 'origin')
  assert.equal(convertOldSettings.convertString('withTag', 'no'), 'none')
  // 已经是新值的不被改动
  assert.equal(convertOldSettings.convertString('withTag', 'origin'), 'origin')
  assert.equal(convertOldSettings.convertString('withTag', 'transl'), 'transl')
  assert.equal(convertOldSettings.convertString('withTag', 'none'), 'none')
})

test('旧的设置名 widthTag 迁移到 withTag（with 曾经被拼错）', () => {
  // 改名后，老用户本地存储 / 导入的配置文件里的 widthTag 要写到新设置项上
  assert.equal(convertOldSettings.convertKey('widthTag'), 'withTag')
  // 已经是新名字的原样返回
  assert.equal(convertOldSettings.convertKey('withTag'), 'withTag')
  // 无关的设置名不受影响
  assert.equal(convertOldSettings.convertKey('restrict'), 'restrict')

  // 按 setSetting 的实际顺序：先改键名，再用新的键名转换旧值
  // （所以 stringSettingsMap 里必须写成 withTag，写成 widthTag 就转换不到）
  const key = convertOldSettings.convertKey('widthTag')
  assert.equal(convertOldSettings.convertString(key, '1'), 'origin')
  assert.equal(convertOldSettings.convertString(key, 'yes'), 'origin')
})

test('其它拼错的设置名也迁移到正确的键名', () => {
  // swicth（switch）、Dealy（Delay）
  assert.equal(
    convertOldSettings.convertKey('swicthImageByKeyboard'),
    'switchImageByKeyboard'
  )
  assert.equal(convertOldSettings.convertKey('slowCrawlDealy'), 'slowCrawlDelay')

  // convertKey 可能被重复调用（setSetting 里还会再转一次），所以必须是幂等的
  assert.equal(
    convertOldSettings.convertKey('switchImageByKeyboard'),
    'switchImageByKeyboard'
  )
  assert.equal(convertOldSettings.convertKey('slowCrawlDelay'), 'slowCrawlDelay')
})
