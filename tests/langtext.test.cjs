// 检查 langText（多语言文本）的完整性。
//
// 这里检查的问题都是「静默出错」型：出问题时界面只会显示成 "undefined" 或残留的 {}，很难被发现。
// 1. 每个 key 必须有 6 条翻译（简中 / 繁中 / 英 / 日 / 韩 / 俄）。
//    Lang.transl 是按语言下标取值的，少一条时那种语言会拿到 undefined：
//    语句里有 {} 占位符时直接抛 TypeError，没有占位符时就把 "undefined" 当作文本显示出来。
// 2. 同一个 key 的 6 条里 {} 占位符个数必须一致，否则替换之后某些语言会剩下 {}、或者用不上传入的参数。
// 3. 代码（含 OptionsHtml.html 里的各种 data-* 属性）和设置配置（OptionConfigs 里的
//    nameKey / searchWordKeys）中用到的字面量 key 必须都已定义，
//    写错 key 时 Lang.transl 只会往控制台打一行警告，界面上显示的是 key 本身。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

const ROOT = path.join(__dirname, '..')
const LANG_TEXT_FILE = path.join(ROOT, 'src', 'ts', 'langText.ts')

/** 每条语句应有的翻译数量与顺序 */
const LANG_NAMES = ['简体中文', '繁体中文', '英语', '日语', '韩语', '俄语']

/** 编译并运行真实的 langText.ts，只替换它的 Config 依赖 */
function loadLangText() {
  const source = fs.readFileSync(LANG_TEXT_FILE, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText
  const exports = {}
  vm.runInNewContext(
    output,
    {
      exports,
      require: (name) => {
        // langText 只在少数语句里拼入了 Config 的值（下载线程上限、原始标签名）
        assert.equal(
          name,
          './Config',
          'langText 只应该依赖 Config，实际依赖了 ' + name
        )
        return { Config: { downloadThreadMax: 4, originalTags: ['original'] } }
      },
      console,
    },
    { filename: 'src/ts/langText.ts' }
  )
  return exports.langText
}

/** 收集 src 下的 .ts 与 .html 文件 */
function collectSourceFiles(dir) {
  const result = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      result.push(...collectSourceFiles(full))
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.html')) {
      result.push(full)
    }
  }
  return result
}

const langText = loadLangText()
const keys = Object.keys(langText)

test('key 数量正常（防止文件被破坏后只剩少数几个 key）', () => {
  assert.ok(
    keys.length > 1000,
    'langText 里只有 ' + keys.length + ' 个 key，文件可能被破坏了'
  )
})

test('所有 key 都以下划线开头', () => {
  const bad = keys.filter((key) => !key.startsWith('_'))
  assert.deepEqual(bad, [], '这些 key 没有下划线开头：\n' + bad.join('\n'))
})

test('没有重复定义的 key（重复时后面的会静默覆盖前面的）', () => {
  const declared = (
    fs.readFileSync(LANG_TEXT_FILE, 'utf8').match(/^\s{2}(_[^\s:]+):\s*\[/gm) ||
    []
  ).map((line) => line.trim().replace(/:\s*\[$/, ''))
  const seen = new Set()
  const duplicated = new Set()
  for (const name of declared) {
    if (seen.has(name)) {
      duplicated.add(name)
    }
    seen.add(name)
  }
  assert.deepEqual(
    [...duplicated],
    [],
    '这些 key 被定义了多次：\n' + [...duplicated].join('\n')
  )
})

test('每个 key 都有 6 条翻译', () => {
  const bad = []
  for (const key of keys) {
    const list = langText[key]
    if (!Array.isArray(list)) {
      bad.push(key + '：不是数组')
      continue
    }
    if (list.length !== LANG_NAMES.length) {
      const missing = LANG_NAMES.filter((_, i) => typeof list[i] !== 'string')
      const detail =
        missing.length > 0
          ? '缺少 ' + missing.join('、')
          : '多了 ' + (list.length - LANG_NAMES.length) + ' 条'
      bad.push(key + '：有 ' + list.length + ' 条（' + detail + '）')
    }
  }
  assert.deepEqual(bad, [], '这些 key 的翻译条数不对：\n' + bad.join('\n'))
})

test('每条翻译都是非空字符串', () => {
  const bad = []
  for (const key of keys) {
    const list = Array.isArray(langText[key]) ? langText[key] : []
    list.forEach((text, index) => {
      const lang = LANG_NAMES[index] || '第 ' + (index + 1) + ' 条'
      if (typeof text !== 'string') {
        bad.push(key + '[' + lang + ']：不是字符串')
      } else if (text.trim() === '') {
        bad.push(key + '[' + lang + ']：是空字符串')
      }
    })
  }
  assert.deepEqual(bad, [], '这些翻译有问题：\n' + bad.join('\n'))
})

test('同一个 key 的 6 条翻译里 {} 占位符个数一致', () => {
  const bad = []
  for (const key of keys) {
    const list = langText[key]
    if (!Array.isArray(list)) {
      continue
    }
    const counts = list.map((text) =>
      typeof text === 'string' ? (text.match(/\{\}/g) || []).length : -1
    )
    if (new Set(counts).size > 1) {
      bad.push(
        key +
          '：' +
          counts.map((c, i) => (LANG_NAMES[i] || i) + '=' + c).join('，')
      )
    }
  }
  assert.deepEqual(bad, [], '这些 key 的 {} 个数不一致：\n' + bad.join('\n'))
})

test('代码里用到的字面量 key 都已经定义', () => {
  const defined = new Set(keys)
  // 这些写法都要求参数是字面量 key。用变量拼出来的 key 不会被检查到
  const patterns = [
    /transl\(\s*'(_[^']+)'/g,
    /transl\(\s*"(_[^"]+)"/g,
    /updateText\(\s*'(_[^']+)'/g,
    // 设置面板里的文本和帮助按钮：data-msg / data-title 由 FormHelpManager 读取，
    // data-xztip 由 Language 翻译成 data-tip 后交给 ShowTip 显示
    /data-(?:xztext|msg|title|xztip|xzplaceholder)="(_[^"]+)"/g,
    // OptionConfigs 里声明设置名称时引用的 key
    /\bnameKey:\s*'(_[^']+)'/g,
  ]
  // 这些写法把 key 写在数组里，需要先取出数组的内容，再从里面提取每个 key
  const listPattern = /searchWordKeys:\s*\[([^\]]*)\]/g
  const keyPattern = /'(_[^']+)'/g

  const missing = new Map()
  const collect = (key, file) => {
    if (!defined.has(key)) {
      missing.set(key, path.relative(ROOT, file))
    }
  }

  for (const file of collectSourceFiles(path.join(ROOT, 'src'))) {
    const content = fs.readFileSync(file, 'utf8')
    for (const pattern of patterns) {
      pattern.lastIndex = 0
      let match
      while ((match = pattern.exec(content))) {
        collect(match[1], file)
      }
    }

    listPattern.lastIndex = 0
    let listMatch
    while ((listMatch = listPattern.exec(content))) {
      for (const keyMatch of listMatch[1].matchAll(keyPattern)) {
        collect(keyMatch[1], file)
      }
    }
  }
  assert.deepEqual(
    [...missing.entries()].map(([key, file]) => key + '  <- ' + file),
    [],
    '这些 key 被引用了但没有定义：\n' +
      [...missing.entries()]
        .map(([key, file]) => key + '  <- ' + file)
        .join('\n')
  )
})
