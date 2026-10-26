'use strict'
// getFullSizeAvatarURL（把头像 URL 转换成原图 URL）的测试。
//
// 这里检查的是一个「静默出错」型的问题：`String.replace` 默认只替换第一处，
// 而用户 id 后面那段哈希值里也可能含有 `_170`（例如 `13811157_17094...`）。
// 如果从前面替换，得到的 URL 是错误的图片地址，请求会 404，
// 表现为「保存用户头像」偶尔失败，很难定位。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

const ROOT = path.join(__dirname, '..')

// 加载真实的 Tools.ts。Tools 依赖了很多模块，但这里要测的方法不会用到它们，
// 所以用一个「取任何属性都返回可调用的空代理」的 mock 顶替所有依赖。
function loadTools() {
  const mock = () =>
    new Proxy(function () {}, {
      get: (_target, prop) => (prop === 'default' ? undefined : mock()),
      apply: () => mock(),
      construct: () => mock(),
    })

  const source = fs.readFileSync(path.join(ROOT, 'src/ts', 'Tools.ts'), 'utf8')
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
      require: () => mock(),
      console,
      alert: () => {},
      setTimeout: () => 0,
      clearTimeout: () => {},
    },
    { filename: 'Tools.ts' }
  )
  return exports.Tools
}

const Tools = loadTools()
const getFullSizeAvatarURL = (url) => Tools.getFullSizeAvatarURL(url)

const prefix = 'https://i.pximg.net/user-profile/img/2018/02/11/16/01/14/'

test('去掉文件名末尾的 170 标记', () => {
  assert.equal(
    getFullSizeAvatarURL(prefix + '13811157_a1b2c3d4e5f6_170.png'),
    prefix + '13811157_a1b2c3d4e5f6.png'
  )
})

test('哈希值里也含有 _170 时，只替换末尾的那个', () => {
  // 从前面替换会得到 .../138111579415c82b690d3dbfdebc252abb223_170.png（错误的 URL）
  assert.equal(
    getFullSizeAvatarURL(
      prefix + '13811157_1709415c82b690d3dbfdebc252abb223_170.png'
    ),
    prefix + '13811157_1709415c82b690d3dbfdebc252abb223.png'
  )
})

test('gif 等其他格式也一样处理', () => {
  assert.equal(
    getFullSizeAvatarURL(prefix + '13811157_1709415c_170.gif'),
    prefix + '13811157_1709415c.gif'
  )
  assert.equal(
    getFullSizeAvatarURL(prefix + '13811157_a1b2_170.jpg'),
    prefix + '13811157_a1b2.jpg'
  )
})

test('没有 170 标记时原样返回（已经是原图的 URL）', () => {
  assert.equal(
    getFullSizeAvatarURL(
      prefix + '13811157_1709415c82b690d3dbfdebc252abb223.png'
    ),
    prefix + '13811157_1709415c82b690d3dbfdebc252abb223.png'
  )
  // 其他尺寸标记不是这里要处理的
  assert.equal(
    getFullSizeAvatarURL(prefix + '13811157_1709415c_50.png'),
    prefix + '13811157_1709415c_50.png'
  )
  // 路径里含有 170 目录也不受影响
  assert.equal(
    getFullSizeAvatarURL(
      'https://i.pximg.net/user-profile/img/2018/170/11/13811157_a1b2_170.png'
    ),
    'https://i.pximg.net/user-profile/img/2018/170/11/13811157_a1b2.png'
  )
})

test('URL 带有查询字符串时也能处理', () => {
  assert.equal(
    getFullSizeAvatarURL(prefix + '13811157_a1b2_170.png?width=100'),
    prefix + '13811157_a1b2.png?width=100'
  )
})
