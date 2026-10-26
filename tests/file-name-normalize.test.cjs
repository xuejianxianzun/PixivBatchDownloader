'use strict'
// FileNameNormalize.handleNormalName 的测试。
//
// 这个方法用于「不是由命名规则生成、而是由其他模块自行拼接」的文件名。
// 之前批量保存用户头像时，有 9 个用户的用户名以 `.` 开头，拼接出的文件名
// 头尾带有 `.`，Chrome 的 downloads API 会拒绝，导致文件静默丢失，
// 所以这里重点覆盖「头尾的点」「路径分隔符」「连续的斜线」这些情况。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

function loadModule(file, mocks) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
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
      require(name) {
        assert.ok(name in mocks, `Missing dependency: ${name}`)
        return mocks[name]
      },
    },
    { filename: file }
  )
  return exports
}

const Utils = loadModule('src/ts/utils/Utils.ts', {
  './SetTimeoutWorker': { setTimeoutWorker: { sleep: async () => {} } },
}).Utils

function load(removeEmoji = false) {
  return loadModule('src/ts/FileNameNormalize.ts', {
    './setting/Settings': { settings: { removeEmoji } },
    './utils/Utils': { Utils },
  }).fileNameNormalize
}

const fullWidthDot = '．'

test('保留文件夹路径里的分隔符', () => {
  const fileNameNormalize = load()
  assert.equal(
    fileNameNormalize.handleNormalName('pixiv users/abc_123_avatar.jpg'),
    'pixiv users/abc_123_avatar.jpg'
  )
})

test('把路径每一段头尾的 . 替换成全角．', () => {
  // 用户名以 . 开头时，拼接出的文件名会变成 `._123_avatar.jpg`，Chrome 会拒绝保存
  const fileNameNormalize = load()
  assert.equal(
    fileNameNormalize.handleNormalName('pixiv users/._123_avatar.jpg'),
    `pixiv users/${fullWidthDot}_123_avatar.jpg`
  )
  // 只有路径每一段的头尾的点会被替换；用户名中间的点不影响
  assert.equal(
    fileNameNormalize.handleNormalName('pixiv users/.PEN._123_avatar.jpg'),
    `pixiv users/${fullWidthDot}PEN._123_avatar.jpg`
  )
  // 文件夹名头尾的点也要处理
  assert.equal(
    fileNameNormalize.handleNormalName('.folder/abc.jpg'),
    `${fullWidthDot}folder/abc.jpg`
  )
})

test('去掉开头的斜线和空格，合并连续的斜线，去掉结尾的斜线', () => {
  const fileNameNormalize = load()
  assert.equal(fileNameNormalize.handleNormalName('/ abc.jpg'), 'abc.jpg')
  assert.equal(fileNameNormalize.handleNormalName('a//b///c.jpg'), 'a/b/c.jpg')
  assert.equal(fileNameNormalize.handleNormalName('abc.jpg/'), 'abc.jpg')
})

test('把不安全的字符替换成全角版本', () => {
  const fileNameNormalize = load()
  assert.equal(fileNameNormalize.handleNormalName('a:b?c.jpg'), 'a：b？c.jpg')
})

test('文件名被处理成空字符串时使用时间戳', () => {
  const fileNameNormalize = load()
  // 斜线会被 removeStartChar 反复去掉，最后剩下空字符串
  const name = fileNameNormalize.handleNormalName('//')
  assert.ok(
    Number.parseInt(name) > 0,
    '文件名应该被替换成时间戳，实际是：' + name
  )
})
