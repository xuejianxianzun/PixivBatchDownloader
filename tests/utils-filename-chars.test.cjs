'use strict'
// Utils.replaceUnsafeStr / handleWindowsReservedName 的测试。
//
// 这些函数决定下载的文件名里能出现哪些字符。判断错了会导致：
// - 文件名在某些系统上非法（浏览器会拒绝保存、或悄悄替换成别的字符）；
// - 两个不同的作品生成同一个文件名，互相覆盖。
// 所以这里覆盖几个容易出错的地方，尤其是「哪些字符该删、哪些必须保留」。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 加载真实的 Utils.ts，只替换它的 worker 依赖 */
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
  vm.runInNewContext(
    code,
    {
      exports,
      console,
      // worker 只在 sleep 里用到，这些测试不会调用它
      require: (name) => {
        assert.equal(name, './SetTimeoutWorker')
        return { setTimeoutWorker: { sleep: async () => {} } }
      },
    },
    { filename: 'Utils.ts' }
  )
  return exports.Utils
}

const Utils = loadUtils()

test('删除控制字符、行分隔符和零宽字符', () => {
  // \u0000 控制字符、\u001F 单元分隔符、\u007F 删除符、\u0085 NEL
  // \u2028 行分隔符 / \u2029 段落分隔符（类别是 Zl/Zp，最容易被漏掉）
  // \u200B 零宽空格、\u200E 从左到右标记
  const input = 'a\u0000b\u001Fc\u007Fd\u0085e\u2028f\u2029g\u200Bh\u200Ei'
  assert.equal(Utils.replaceUnsafeStr(input), 'abcdefghi')
})

test('保留普通空格和全角空格（U+3000）', () => {
  // 全角空格是日文标题里正常使用的字符（常见于作者名之间的分隔），删掉会改变文件名含义
  assert.equal(Utils.replaceUnsafeStr('a b'), 'a b')
  assert.equal(Utils.replaceUnsafeStr('あ\u3000い'), 'あ\u3000い')
})

test('半角特殊字符替换成全角版本', () => {
  assert.equal(
    Utils.replaceUnsafeStr('a\\b/c:d?e"f<g>h*i|j~k'),
    'a＼b／c：d？e＂f＜g＞h＊i｜j～k'
  )
})

test('keepPathSeparator 为 true 时保留斜线', () => {
  assert.equal(
    Utils.replaceUnsafeStr('pixiv/2024:01/a?b', true),
    'pixiv/2024：01/a？b'
  )
  // 默认仍然把斜线换成全角
  assert.equal(Utils.replaceUnsafeStr('a/b'), 'a／b')
})

test('replaceFullWidthStr 可以把全角字符换回半角', () => {
  assert.equal(
    Utils.replaceFullWidthStr('a＼b／c：d？e＂f＜g＞h＊i｜j～k'),
    'a\\b/c:d?e"f<g>h*i|j~k'
  )
})

test('Windows 保留文件名', () => {
  // 完全匹配时添加后缀（不区分大小写）
  assert.equal(Utils.handleWindowsReservedName('CON', '[X]'), 'CON[X]')
  assert.equal(Utils.handleWindowsReservedName('con', '[X]'), 'con[X]')
  // 不传后缀时返回空字符串，等于丢弃这个文件名
  assert.equal(Utils.handleWindowsReservedName('AUX'), '')
  // 带扩展名时把点换成全角点（否则 Windows 仍然会拒绝）
  assert.equal(Utils.handleWindowsReservedName('CON.txt', '[X]'), 'CON．txt')
  // 只是以保留名开头的不处理
  assert.equal(Utils.handleWindowsReservedName('CON1', '[X]'), 'CON1')
  assert.equal(Utils.handleWindowsReservedName('console', '[X]'), 'console')
})
