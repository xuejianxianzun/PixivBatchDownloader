'use strict'
// ExportLog.getText 的测试：复制日志时用的纯文本。
//
// 要求：一条日志占一行，日志内部的 <br> 也是一个换行，
// 不能出现因为「每条日志末尾都有一个 <br>」而多出来的空白行。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 加载真实的 ExportLog.ts，外部依赖全部替换成替身 */
function loadExportLog() {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src/ts', 'ExportLog.ts'),
    'utf8'
  )
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText

  const imports = {
    './EVT': { EVT: { list: new Proxy({}, { get: (_, key) => key }) } },
    './Language': { lang: { transl: (key) => key } },
    './Toast': { toast: { success() {}, error() {}, warning() {} } },
    './Tools': { Tools: {} },
    './utils/Utils': { Utils: {} },
    './setting/Settings': { settings: {} },
  }

  const exports = {}
  vm.runInNewContext(
    code,
    {
      exports,
      console,
      window: { addEventListener() {} },
      Blob: class {},
      URL: {},
      require(name) {
        assert.ok(name in imports, `Missing dependency: ${name}`)
        return imports[name]
      },
    },
    { filename: 'ExportLog.ts' }
  )
  return exports.exportLog
}

/** 模拟 Log.add() 里保存的一条日志：内容是 html，末尾固定追加一个 <br> */
function makeRecord(content, extra = {}) {
  return { html: content + '<br>', level: 0, key: '', ...extra }
}

test('一条日志就是一行，末尾的 <br> 不会产生多余的空白行', () => {
  const exportLog = loadExportLog()
  exportLog.push(makeRecord('saber'))

  assert.equal(exportLog.getText(), 'saber')
})

test('多条日志之间只隔一个换行', () => {
  const exportLog = loadExportLog()
  exportLog.push(makeRecord('第一行'))
  exportLog.push(makeRecord('第二行'))
  exportLog.push(makeRecord('第三行'))

  assert.equal(exportLog.getText(), '第一行\n第二行\n第三行')
})

test('日志内部的 <br> 换成换行（多行日志保持行数）', () => {
  const exportLog = loadExportLog()
  exportLog.push(makeRecord('第一行<br>第二行<br>第三行'))
  exportLog.push(makeRecord('下一条'))

  assert.equal(exportLog.getText(), '第一行\n第二行\n第三行\n下一条')
})

test('<br/> 和 <br /> 也当换行', () => {
  const exportLog = loadExportLog()
  exportLog.push(makeRecord('a<br/>b<br />c'))

  assert.equal(exportLog.getText(), 'a\nb\nc')
})

test('其他标签直接去掉，只保留文字', () => {
  const exportLog = loadExportLog()
  // 作品链接的形式：<a href="...">id</a>
  exportLog.push(
    makeRecord(
      '作品 <a href="https://www.pixiv.net/artworks/123" target="_blank">123</a> 已下载'
    )
  )
  exportLog.push(makeRecord('<span class="blue">蓝色文字</span>'))

  assert.equal(exportLog.getText(), '作品 123 已下载\n蓝色文字')
})

test('还原被转义的 &（写入时裸 & 被转成了 &amp;）', () => {
  const exportLog = loadExportLog()
  // 日志写入时只转义了裸的 &，所以复制时只需要还原 &amp;
  exportLog.push(
    makeRecord(
      'https://www.pixiv.net/ajax/search/artworks/saber?word=saber&amp;order=date'
    )
  )

  assert.equal(
    exportLog.getText(),
    'https://www.pixiv.net/ajax/search/artworks/saber?word=saber&order=date'
  )
})

test('空行日志（log.log("")）会保留为空行', () => {
  const exportLog = loadExportLog()
  exportLog.push(makeRecord('上面'))
  exportLog.push(makeRecord(''))
  exportLog.push(makeRecord('下面'))

  assert.equal(exportLog.getText(), '上面\n\n下面')
})

test('带 key 的日志只保留最后一次的内容（同一个 key 只占一行）', () => {
  const exportLog = loadExportLog()
  exportLog.push(makeRecord('10/100', { key: 'progress' }))
  exportLog.push(makeRecord('55/100', { key: 'progress' }))
  exportLog.push(makeRecord('100/100', { key: 'progress' }))

  assert.equal(exportLog.getText(), '100/100')
})

test('清空记录之后没有文本', () => {
  const exportLog = loadExportLog()
  exportLog.push(makeRecord('saber'))
  assert.equal(exportLog.getText(), 'saber')

  exportLog.clear()
  assert.equal(exportLog.getText(), '')

  // 清空之后还能继续记录
  exportLog.push(makeRecord('新的日志'))
  assert.equal(exportLog.getText(), '新的日志')
})
