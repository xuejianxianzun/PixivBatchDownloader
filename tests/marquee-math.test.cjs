const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 执行真实的 MarqueeMath 模块。它是纯计算模块，没有依赖 */
const compiled = new Map()
function load(file, imports = {}, globals = {}) {
  if (!compiled.has(file)) {
    compiled.set(
      file,
      ts.transpileModule(
        fs.readFileSync(path.join(__dirname, '../src/ts', file), 'utf8'),
        {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
          },
        }
      ).outputText
    )
  }
  const exports = {}
  vm.runInNewContext(
    compiled.get(file),
    {
      exports,
      require(name) {
        assert.ok(name in imports, `Missing dependency: ${name}`)
        return imports[name]
      },
      ...globals,
    },
    { filename: file }
  )
  return exports
}

const { rectFromPoints, rectsIntersect, toDocRect } = load(
  'utils/MarqueeMath.ts'
)

/** 跨 realm 的对象需要用展开语法转成当前 realm 的对象，再和期望值比较 */
const plain = (obj) => ({ ...obj })

test('rectFromPoints 把两个点规范化为矩形（四个方向一致）', () => {
  const expected = { left: 10, top: 20, right: 30, bottom: 40 }
  assert.deepEqual(plain(rectFromPoints(10, 20, 30, 40)), expected)
  assert.deepEqual(plain(rectFromPoints(30, 40, 10, 20)), expected)
  assert.deepEqual(plain(rectFromPoints(30, 20, 10, 40)), expected)
  assert.deepEqual(plain(rectFromPoints(10, 40, 30, 20)), expected)
})

test('rectFromPoints 两点重合时得到零尺寸矩形', () => {
  assert.deepEqual(plain(rectFromPoints(5, 5, 5, 5)), {
    left: 5,
    top: 5,
    right: 5,
    bottom: 5,
  })
})

test('rectsIntersect 部分重叠、包含、被包含都算相交', () => {
  const base = { left: 0, top: 0, right: 100, bottom: 100 }
  // 部分重叠（两个方向都测，确认参数顺序无关）
  assert.equal(
    rectsIntersect(base, { left: 50, top: 50, right: 150, bottom: 150 }),
    true
  )
  assert.equal(
    rectsIntersect({ left: 50, top: 50, right: 150, bottom: 150 }, base),
    true
  )
  // 包含 / 被包含
  assert.equal(
    rectsIntersect(base, { left: 10, top: 10, right: 20, bottom: 20 }),
    true
  )
  assert.equal(
    rectsIntersect({ left: 10, top: 10, right: 20, bottom: 20 }, base),
    true
  )
})

test('rectsIntersect 分离和仅相切都不算相交', () => {
  const base = { left: 0, top: 0, right: 100, bottom: 100 }
  // 完全分离
  assert.equal(
    rectsIntersect(base, { left: 200, top: 0, right: 300, bottom: 100 }),
    false
  )
  assert.equal(
    rectsIntersect(base, { left: 0, top: 200, right: 100, bottom: 300 }),
    false
  )
  // 仅边界相切（无重叠面积）
  assert.equal(
    rectsIntersect(base, { left: 100, top: 0, right: 200, bottom: 100 }),
    false
  )
  assert.equal(
    rectsIntersect(base, { left: 0, top: 100, right: 100, bottom: 200 }),
    false
  )
})

test('rectsIntersect 线状矩形（纯水平/垂直拖动）穿过元素内部时命中', () => {
  const el = { left: 50, top: 50, right: 150, bottom: 150 }
  // 纯水平拖动：高度为 0 的线，穿过元素内部
  assert.equal(
    rectsIntersect({ left: 0, top: 100, right: 300, bottom: 100 }, el),
    true
  )
  // 纯垂直拖动：宽度为 0 的线，穿过元素内部
  assert.equal(
    rectsIntersect({ left: 100, top: 0, right: 100, bottom: 300 }, el),
    true
  )
  // 线在元素的上方 / 左侧之外
  assert.equal(
    rectsIntersect({ left: 0, top: 10, right: 300, bottom: 10 }, el),
    false
  )
  assert.equal(
    rectsIntersect({ left: 10, top: 0, right: 10, bottom: 300 }, el),
    false
  )
  // 线恰好落在元素的边界上（不含边界，不算命中）
  assert.equal(
    rectsIntersect({ left: 0, top: 50, right: 300, bottom: 50 }, el),
    false
  )
  assert.equal(
    rectsIntersect({ left: 50, top: 0, right: 50, bottom: 300 }, el),
    false
  )
})

test('典型场景：一个框选矩形与多个元素的命中结果', () => {
  const marquee = rectFromPoints(100, 100, 300, 300)
  const inside = { left: 150, top: 150, right: 250, bottom: 250 }
  const overlap = { left: 250, top: 250, right: 350, bottom: 350 }
  const outside = { left: 400, top: 400, right: 500, bottom: 500 }
  assert.equal(rectsIntersect(marquee, inside), true)
  assert.equal(rectsIntersect(marquee, overlap), true)
  assert.equal(rectsIntersect(marquee, outside), false)
})

test('toDocRect 把视口坐标转换为文档坐标', () => {
  assert.deepEqual(
    plain(toDocRect({ left: 10, top: 20, right: 30, bottom: 40 }, 100, 200)),
    { left: 110, top: 220, right: 130, bottom: 240 }
  )
  // 滚动量为 0 时保持不变
  assert.deepEqual(
    plain(toDocRect({ left: 10, top: 20, right: 30, bottom: 40 }, 0, 0)),
    { left: 10, top: 20, right: 30, bottom: 40 }
  )
})
