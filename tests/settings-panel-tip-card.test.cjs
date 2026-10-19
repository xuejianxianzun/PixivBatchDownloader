'use strict'
// 设置面板：二级分类顶部的提示卡片的显隐测试。
//
// 规则：只有当分类里**有**设置项、并且它们**全部**被隐藏时，才隐藏提示卡片。
// 回归点：
// 1. 构建分类区域时设置项还没被放进来，不能把「没有设置项」当成「全部被隐藏」；
// 2. 判断条件别写反（曾经写成 !allOptionsHidden，导致正常页面上的卡片被隐藏）。
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 编译真实源码，只替换外部依赖 */
function loadSource(file, imports) {
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
  vm.runInNewContext(
    code,
    {
      exports,
      console,
      require(name) {
        assert.ok(name in imports, `Missing dependency: ${name}`)
        return imports[name]
      },
    },
    { filename: file }
  )
  return exports
}

function makeClassList(initial = []) {
  const classes = new Set(initial)
  return {
    add: (name) => classes.add(name),
    remove: (name) => classes.delete(name),
    contains: (name) => classes.has(name),
    toggle: (name, force) => {
      if (force === undefined) {
        if (classes.has(name)) {
          classes.delete(name)
        } else {
          classes.add(name)
        }
        return
      }
      if (force) {
        classes.add(name)
      } else {
        classes.delete(name)
      }
    },
  }
}

/** 创建 section 的替身，只包含 updateEmptyCategoryHint 用到的部分 */
function makeSection({ options = [], expanded = true } = {}) {
  const hint = { classList: makeClassList() }
  const tipCard = { classList: makeClassList() }
  const root = {
    classList: makeClassList(expanded ? ['expanded'] : ['collapsed']),
  }

  return {
    id: 'thumbnailButtons',
    page: 'enhance',
    root,
    content: {
      querySelector(selector) {
        if (selector === '.settingsPanel_emptyCategoryHint') {
          return hint
        }
        if (selector === '.settingsPanel_tipCard') {
          return tipCard
        }
        return null
      },
    },
    contentWrap: {
      querySelectorAll: () => options,
    },
    hint,
    tipCard,
  }
}

const { SettingsPanelSections } = loadSource(
  'setting/SettingsPanelSections.ts',
  {
    './Settings': { settings: {}, setSetting() {} },
    '../utils/Utils': {
      Utils: { deepCopy: (value) => JSON.parse(JSON.stringify(value)) },
    },
    './SettingsPanelTypes': {},
  }
)

function makeController() {
  return new SettingsPanelSections({
    main: {},
    getActivePage: () => 'enhance',
    getSearchExpandStats: () => ({ total: 0, expanded: 0 }),
    setSearchAllExpanded() {},
    getSearchStickySections: () => [],
  })
}

const hidden = () => ({ style: { display: 'none' } })
const visible = (display = 'flex') => ({ style: { display } })

test('分类里有可见的设置项时，显示提示卡片', () => {
  const controller = makeController()
  const section = makeSection({ options: [visible(), hidden()] })

  controller.updateEmptyCategoryHint(section)

  assert.equal(section.tipCard.classList.contains('is-context-hidden'), false)
})

test('设置项的 style.display 还是空字符串时，视为可见', () => {
  const controller = makeController()
  const section = makeSection({ options: [visible(''), visible('')] })

  controller.updateEmptyCategoryHint(section)

  assert.equal(section.tipCard.classList.contains('is-context-hidden'), false)
})

test('分类里的设置项全部被隐藏时，隐藏提示卡片', () => {
  const controller = makeController()
  const section = makeSection({ options: [hidden(), hidden(), hidden()] })

  controller.updateEmptyCategoryHint(section)

  assert.equal(section.tipCard.classList.contains('is-context-hidden'), true)
})

test('分类重新出现可见的设置项时，恢复显示提示卡片', () => {
  const controller = makeController()
  const section = makeSection({ options: [hidden(), hidden()] })
  controller.updateEmptyCategoryHint(section)
  assert.equal(section.tipCard.classList.contains('is-context-hidden'), true)

  section.contentWrap.querySelectorAll = () => [hidden(), visible()]
  controller.updateEmptyCategoryHint(section)

  assert.equal(section.tipCard.classList.contains('is-context-hidden'), false)
})

test('分类里还没有设置项时，不隐藏提示卡片', () => {
  const controller = makeController()
  const section = makeSection({ options: [] })

  controller.updateEmptyCategoryHint(section)

  assert.equal(section.tipCard.classList.contains('is-context-hidden'), false)
})
