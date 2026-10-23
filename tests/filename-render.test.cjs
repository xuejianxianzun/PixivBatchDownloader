'use strict'
// FileName 的测试：命名规则 → 文件名的渲染过程。
//
// 这里覆盖的是「规则渲染」本身的逻辑：可选片段、空标记的分隔符、非法字符、路径整理、
// 长度截断。这些都是纯计算，和网页结构无关，改坏了会直接生成错误的文件名。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 编译并加载一个 TS 模块（只替换外部依赖） */
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

/** 加载真实的 Utils.ts（文件名相关的方法都在里面，用真实的实现才有意义） */
function loadUtils() {
  return loadModule('src/ts/utils/Utils.ts', {
    './SetTimeoutWorker': { setTimeoutWorker: { sleep: async () => {} } },
  }).Utils
}

const Utils = loadUtils()

/** 一份够用的设置 */
function makeSettings() {
  return {
    removeEmoji: false,
    noFolderSwitch: false,
    // 序号
    noSerialNo: false,
    noSerialNoForSingleImg: false,
    noSerialNoForMultiImg: false,
    setNoSerialNoForUgoira: false,
    serialNoStart: 0,
    zeroPadding: false,
    zeroPaddingLength: 2,
    // 标签
    tagsSeparator: ',',
    setUserNameList: {},
    removeAtFromUsername: false,
    UseDifferentNameRuleIfWorkHasTagSwitch: false,
    UseDifferentNameRuleIfWorkHasTagList: [],
    // 文件夹类特殊标记
    createFolderByTag: false,
    createFolderTagList: [],
    createFolderTagList2: [],
    createFolderByBookmarkTag: false,
    createFolderBookmarkTagList: [],
    createFolderBookmarkTagList2: [],
    folderForMultiImageWorksSwitch: false,
    folderForMultiImageWorksRule: '',
    folderForMultiImageWorksImageNumber: 0,
    r18Folder: false,
    r18FolderName: '',
    // 长度限制
    fullNameLengthLimit: 210,
    fullNameLengthLimitSwitch: true,
    dateFormat: 'YYYY-MM-DD',
  }
}

/** 一份够用的抓取结果 */
function makeResult(overrides = {}) {
  return {
    aiType: 0,
    idNum: 100,
    id: '100_p0',
    isOriginal: null,
    original: 'https://example.com/100_p0.jpg',
    thumb: 'https://example.com/100_p0_s.jpg',
    regular: 'https://example.com/100_p0_m.jpg',
    small: 'https://example.com/100_p0_s.jpg',
    title: '标题',
    description: '',
    pageCount: 1,
    index: 0,
    tags: [],
    tagsWithTransl: [],
    tagsTranslOnly: [],
    bookmarkTags: [],
    user: 'ねこ',
    userId: '1',
    fullWidth: 0,
    fullHeight: 0,
    ext: 'jpg',
    bmk: 0,
    bookmarked: false,
    bmkId: '',
    date: '2024-01-01',
    uploadDate: '2024-01-01',
    type: 0,
    rank: null,
    ugoiraInfo: null,
    seriesTitle: null,
    seriesOrder: null,
    seriesId: null,
    novelMeta: null,
    likeCount: 0,
    viewCount: 0,
    commentCount: 0,
    xRestrict: 0,
    sl: null,
    genre: null,
    ...overrides,
  }
}

/** 加载真实的 FileName.ts */
function loadFileName(settings, rule = '{id}') {
  return loadModule('src/ts/FileName.ts', {
    './setting/Settings': { settings },
    './download/NovelSaveFormat': {
      novelSaveFormat: { getDefaultFormat: () => 'epub' },
    },
    './setting/NameRuleManager': {
      nameRuleManager: {
        getRule: (type) => (typeof rule === 'function' ? rule(type) : rule),
      },
    },
    './setting/SetUserName': {},
    './setting/SetTagAlias': {
      setTagAlias: {
        findAlias: () => undefined,
        handleTagsNamingRule: (tags) => tags || [],
      },
    },
    './store/Store': {
      store: {
        title: '',
        tag: '',
        pageId: '',
        pageType: '',
        crawlCompleteTime: new Date('2024-01-01'),
        downloadCount: {},
        result: [],
      },
    },
    './Config': {
      Config: {
        mobile: false,
        worksTypeName: ['插画', '漫画', '动图', '小说'],
      },
    },
    './BookmarkTags': {
      bookmarkTags: { getForMatch: (id, fallback) => fallback || [] },
    },
    './utils/DateFormat': { DateFormat: { format: (date) => String(date) } },
    './utils/Utils': { Utils },
    './Tools': {
      Tools: {
        checkAIFromTags: () => false,
        getAgeLimit: () => '',
        getResultIndex: (data) => data.index || 0,
      },
    },
    './Log': { log: { log() {}, warning() {}, error() {} } },
    './Language': { lang: { transl: (key) => key } },
  }).fileName
}

// ============================================================
// createFileName：完整的命名流程
// ============================================================

test('createFileName 会替换标记，并把路径里的非法字符换成全角', () => {
  const settings = makeSettings()
  const fileName = loadFileName(settings, 'pixiv/{user}/{id}-{title}')

  const result = fileName.createFileName(makeResult({ title: 'a/b:c' }))

  // / 和 : 都不能出现在文件名里，会被换成全角
  assert.equal(result, 'pixiv/ねこ/100_p0-a／b：c.jpg')
})

test('createFileName 在可选片段为空时移除整段（包括自定义字符）', () => {
  const settings = makeSettings()
  const fileName = loadFileName(settings, 'pixiv/{id}[ -{page_tag}]')

  const noTag = fileName.createFileName(makeResult())
  assert.equal(noTag, 'pixiv/100_p0.jpg')
})

test('createFileName 的小说使用保存格式的扩展名，id 不带图片序号', () => {
  const settings = makeSettings()
  const fileName = loadFileName(settings, '{id}-{title}')

  const result = fileName.createFileName(
    makeResult({ type: 3, idNum: 200, id: '200', title: '小说标题' })
  )

  assert.equal(result, '200-小说标题.epub')
})

// ============================================================
// generateFileName：规则渲染
// ============================================================

test('标记的值为空时，连同它前面的分隔符一起去掉', () => {
  const fileName = loadFileName(makeSettings())
  const schema = {
    '{id}': { value: '100', safe: true },
    '{page_tag}': { value: '', safe: true },
  }

  assert.equal(fileName.generateFileName('{id}-{page_tag}', schema), '100')
  assert.equal(fileName.generateFileName('{id}_{page_tag}', schema), '100')
  // 分隔符后面的内容仍然保留
  assert.equal(fileName.generateFileName('{id}-{page_tag}-x', schema), '100-x')
})

test('可选片段：值非空时保留，值为空时整段移除', () => {
  const fileName = loadFileName(makeSettings())
  const schema = {
    '{id}': { value: '100', safe: true },
    '{page_tag}': { value: '原神', safe: true },
  }

  assert.equal(
    fileName.generateFileName('{id}[ -{page_tag}]', schema),
    '100 -原神'
  )

  schema['{page_tag}'].value = ''
  assert.equal(fileName.generateFileName('{id}[ -{page_tag}]', schema), '100')
})

test('整理路径：去掉开头的斜线和空格、合并连续斜线、去掉结尾斜线', () => {
  const fileName = loadFileName(makeSettings())
  const schema = { '{id}': { value: '100', safe: true } }

  assert.equal(fileName.generateFileName('/  /{id}//x/', schema), '100/x')
})

test('处理 Windows 保留文件名和首尾的点', () => {
  const fileName = loadFileName(makeSettings())
  const schema = { '{title}': { value: 'CON', safe: true } }
  assert.equal(
    fileName.generateFileName('{title}', schema),
    'CON[WindowsReservedName]'
  )

  schema['{title}'].value = '.abc.'
  assert.equal(fileName.generateFileName('{title}', schema), '．abc．')
})

// ============================================================
// lengthLimit：长度截断
// ============================================================

test('lengthLimit：未超长时不改动', () => {
  const settings = makeSettings()
  settings.fullNameLengthLimit = 50
  const fileName = loadFileName(settings)

  assert.equal(
    fileName.lengthLimit('pixiv/100_p0-短标题', '.jpg', '100_p0'),
    'pixiv/100_p0-短标题'
  )
})

test('lengthLimit：超长但未启用截断时，原样返回', () => {
  const settings = makeSettings()
  settings.fullNameLengthLimit = 30
  settings.fullNameLengthLimitSwitch = false
  const fileName = loadFileName(settings)

  const longName = 'a'.repeat(60)
  assert.equal(fileName.lengthLimit(longName, '.jpg', '100_p0'), longName)
})

test('lengthLimit：截断后不超过限制，并保留 id', () => {
  const settings = makeSettings()
  settings.fullNameLengthLimit = 40
  const fileName = loadFileName(settings)

  // 文件名里本来就有 id：直接截断
  const withId = fileName.lengthLimit(
    'pixiv/100_p0-' + '长'.repeat(80),
    '.jpg',
    '100_p0'
  )
  assert.ok(
    withId.length + '.jpg'.length <= settings.fullNameLengthLimit,
    `截断后仍然超长：${withId.length}`
  )
  assert.ok(withId.includes('100_p0'), '截断后必须保留 id')

  // 文件名里没有 id（例如命名规则只用了 {title}）：截断时把 id 补到末尾，
  // 否则截断后的同名作品会互相覆盖。用 … 而不是 ...，因为路径结尾不能是点
  const withoutId = fileName.lengthLimit('长'.repeat(80), '.jpg', '100_p0')
  assert.ok(
    withoutId.length + '.jpg'.length <= settings.fullNameLengthLimit,
    `截断后仍然超长：${withoutId.length}`
  )
  assert.ok(withoutId.endsWith('-100_p0…'), `实际结果：${withoutId}`)
})
