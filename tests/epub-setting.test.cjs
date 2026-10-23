'use strict'
// EPUBSetting 的测试：EPUB 的语言标签与排版方向。
//
// 这里有两个容易踩的坑，都是代码注释里明确警告过的：
// 1. 排版方向不能直接读 settings.epubWritingMode，因为「只对列表里的语言使用竖排」
//    必须先算出实际使用的语言标签；而这个标签还会被简繁转换设置修正。
// 2. ConvertNovelText.needConvert() 的判断必须与 applyNovelTextConvert() 一致，
//    否则会出现「正文没有转换，但语言标签变了」的情况。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 编译并加载一个 TS 模块（只替换外部依赖） */
function loadModule(file, mocks, globals = {}) {
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
      ...globals,
      require(name) {
        assert.ok(name in mocks, `Missing dependency: ${name}`)
        return mocks[name]
      },
    },
    { filename: file }
  )
  return exports
}

/** 加载真实的语言判断工具（它们没有任何依赖） */
const { ChineseLang } = loadModule('src/ts/utils/ChineseLang.ts', {})
const { isLangInList } = loadModule('src/ts/utils/LangCode.ts', {})

/** 一份够用的设置 */
function makeSettings(overrides = {}) {
  return {
    epubLangSource: 'novelLang',
    epubCustomLang: '',
    epubWritingMode: 'horizontal',
    epubVerticalLangList: [],
    convertNovelText: 'none',
    dateFormat: 'YYYY-MM-DD',
    ...overrides,
  }
}

/** 只加载 EPUBSetting（使用真实的 ChineseLang / isLangInList） */
function loadEPUBSetting(settings, langType = 'zh-cn') {
  return loadModule('src/ts/download/EPUBSetting.ts', {
    '../Language': { lang: { type: langType } },
    '../setting/Settings': { settings },
    '../utils/ChineseLang': { ChineseLang },
    '../utils/LangCode': { isLangInList },
  }).EPUBSetting
}

test('排版方向：horizontal / vertical / verticalForLangList', () => {
  const settings = makeSettings({ epubWritingMode: 'horizontal' })
  let epubSetting = loadEPUBSetting(settings)
  assert.equal(epubSetting.getWritingMode('ja'), 'horizontal')

  settings.epubWritingMode = 'vertical'
  epubSetting = loadEPUBSetting(settings)
  assert.equal(epubSetting.getWritingMode('zh-cn'), 'vertical')

  // 只对列表里的语言使用竖排：列表里只写了 zh 时，zh-tw 也算在列表里
  settings.epubWritingMode = 'verticalForLangList'
  settings.epubVerticalLangList = ['ja', ' zh ']
  epubSetting = loadEPUBSetting(settings)
  assert.equal(epubSetting.getWritingMode('ja'), 'vertical')
  assert.equal(epubSetting.getWritingMode('zh-tw'), 'vertical')
  assert.equal(epubSetting.getWritingMode('zh-cn'), 'vertical')
  assert.equal(epubSetting.getWritingMode('en'), 'horizontal')
})

test('排版方向必须基于简繁转换之后的语言标签', () => {
  // 小说是简体中文，开启了「简体转繁体」，竖排列表里只有 zh-tw
  const settings = makeSettings({
    epubWritingMode: 'verticalForLangList',
    epubVerticalLangList: ['zh-tw'],
    convertNovelText: 'cn2tw',
  })
  const epubSetting = loadEPUBSetting(settings)

  // 如果不先做简繁转换，语言标签是 zh-cn，就不会得到竖排 —— 这正是注释里警告的错误
  const { langCode, writingMode } = epubSetting.resolve('zh-cn')
  assert.equal(langCode, 'zh-tw')
  assert.equal(writingMode, 'vertical')
})

test('applyNovelTextConvert：简体转繁体', () => {
  const settings = makeSettings({ convertNovelText: 'cn2tw' })
  const epubSetting = loadEPUBSetting(settings)

  assert.equal(epubSetting.applyNovelTextConvert('zh-cn'), 'zh-tw')
  assert.equal(epubSetting.applyNovelTextConvert('zh-hans'), 'zh-tw')
  // 原本就是繁体：保持不变
  assert.equal(epubSetting.applyNovelTextConvert('zh-tw'), 'zh-tw')
  assert.equal(epubSetting.applyNovelTextConvert('zh-Hant-CN'), 'zh-Hant-CN')
  // 非中文、无法判断字形（zh）、空值：正文不会转换，标签也就不能变
  assert.equal(epubSetting.applyNovelTextConvert('ja'), 'ja')
  assert.equal(epubSetting.applyNovelTextConvert('zh'), 'zh')
  assert.equal(epubSetting.applyNovelTextConvert(''), '')
})

test('applyNovelTextConvert：繁体转简体', () => {
  const settings = makeSettings({ convertNovelText: 'tw2cn' })
  const epubSetting = loadEPUBSetting(settings)

  assert.equal(epubSetting.applyNovelTextConvert('zh-tw'), 'zh-cn')
  assert.equal(epubSetting.applyNovelTextConvert('zh-HK'), 'zh-cn')
  // 原本就是简体：保持不变
  assert.equal(epubSetting.applyNovelTextConvert('zh-cn'), 'zh-cn')
  assert.equal(epubSetting.applyNovelTextConvert('zh-Hans'), 'zh-Hans')
  // 关闭转换时全部原样返回
  settings.convertNovelText = 'none'
  assert.equal(epubSetting.applyNovelTextConvert('zh-tw'), 'zh-tw')
})

test('语言标签的来源：custom / novelLang / 界面语言', () => {
  const settings = makeSettings({
    epubLangSource: 'custom',
    epubCustomLang: 'ja',
  })
  let epubSetting = loadEPUBSetting(settings, 'en')
  assert.equal(epubSetting.getLangCode('zh-cn'), 'ja')

  // 自定义语言为空时回退到界面语言
  settings.epubCustomLang = ''
  epubSetting = loadEPUBSetting(settings, 'en')
  assert.equal(epubSetting.getLangCode('zh-cn'), 'en')

  settings.epubLangSource = 'novelLang'
  epubSetting = loadEPUBSetting(settings, 'en')
  assert.equal(epubSetting.getLangCode('zh-tw'), 'zh-tw')
  // 小说没有语言时同样回退到界面语言
  assert.equal(epubSetting.getLangCode(undefined), 'en')
})

// ============================================================
// 与 ConvertNovelText 的一致性
// ============================================================

/** 加载真实的 ConvertNovelText；通过 logStart 是否输出日志来判断它是否会转换 */
function loadConvertNovelText(settings) {
  const logs = []
  const { convertNovelText } = loadModule(
    'src/ts/download/ConvertNovelText.ts',
    {
      'webextension-polyfill': { runtime: { getURL: (p) => p } },
      '../EVT': {
        EVT: { list: { settingChange: 'settingChange' } },
      },
      '../Log': {
        log: {
          log: (msg) => logs.push(msg),
          error() {},
          warning() {},
        },
      },
      '../Language': { lang: { type: 'zh-cn', transl: (key) => key } },
      '../Tools': { Tools: { createWorkLinkByIDData: () => 'link' } },
      '../setting/Settings': { settings },
      '../utils/ChineseLang': { ChineseLang },
    },
    {
      window: {
        addEventListener() {},
        setTimeout: () => 0,
        clearTimeout() {},
      },
    }
  )
  return { convertNovelText, logs }
}

test('「正文是否转换」必须与「语言标签是否改变」一致', () => {
  const langList = [
    'zh-cn',
    'zh-tw',
    'zh-Hant-CN',
    'zh-Hans',
    'zh',
    '',
    'ja',
    'en',
  ]
  for (const mode of ['cn2tw', 'tw2cn']) {
    const settings = makeSettings({ convertNovelText: mode })
    const { convertNovelText, logs } = loadConvertNovelText(settings)
    const epubSetting = loadEPUBSetting(settings)

    for (const lang of langList) {
      logs.length = 0
      convertNovelText.logStart({ id: '1', type: 'novels' }, lang)

      const willConvert = logs.length > 0
      const labelChanged =
        epubSetting.applyNovelTextConvert(lang) !== (lang || '').trim()

      assert.equal(
        willConvert,
        labelChanged,
        `mode=${mode} lang="${lang}" 时正文转换与语言标签不一致`
      )
    }
  }
})
