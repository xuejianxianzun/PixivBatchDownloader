const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

/** 运行真实模块，只模拟它依赖的图片加载与 canvas。 */
function load(file, imports, globals) {
  const source = fs.readFileSync(path.join(__dirname, '../src/ts', file), 'utf8')
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
        assert.ok(name in imports, `Missing dependency: ${name}`)
        return imports[name]
      },
    },
    { filename: file }
  )
  return exports
}

/** 生成 size x size 的像素数据，fn 返回 [r, g, b] 或 [r, g, b, a] */
function pixels(size, fn) {
  const data = new Uint8ClampedArray(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const p = fn(x, y)
      data[i] = p[0]
      data[i + 1] = p[1]
      data[i + 2] = p[2]
      data[i + 3] = p[3] === undefined ? 255 : p[3]
    }
  }
  return data
}

/**
 * 运行环境。返回 check 函数与运行过程中记录的数据。
 * imgSize 是模拟的图片尺寸；如果图片加载失败则传入 loadError。
 */
function environment(
  pixelData,
  { imgSize = [48, 48], loadError = false, coloredRatio = 25 } = {}
) {
  const draws = []
  const revoked = []
  const canvas = {
    width: 0,
    height: 0,
    getContext() {
      return {
        // 只记录绘制时的目标宽高，用于验证大图是否被缩小
        drawImage: (img, dx, dy, dw, dh) => draws.push([dw, dh]),
        getImageData: () => ({ data: pixelData }),
      }
    },
  }
  const Utils = {
    loadImg: async () => {
      if (loadError) {
        throw new Error('Load image error!')
      }
      return { width: imgSize[0], height: imgSize[1] }
    },
  }
  const globals = {
    document: { createElement: () => canvas },
    URL: {
      createObjectURL: () => 'blob:created',
      revokeObjectURL: (url) => revoked.push(url),
    },
    fetch: async () => ({ ok: true, blob: async () => ({}) }),
  }
  const settings = { coloredRatio }
  const { blackAndWhiteImage } = load(
    'filter/BlackandWhiteImage.ts',
    {
      '../setting/Settings': { settings },
      '../utils/Utils': { Utils },
    },
    globals
  )
  return {
    check: (url = 'blob:test') => blackAndWhiteImage.check(url),
    draws,
    revoked,
  }
}

const SIZE = 48

test('纯灰度图片是黑白图片', async () => {
  const env = environment(pixels(SIZE, () => [128, 128, 128]))
  assert.equal(await env.check(), true)
})

test('黑白图片即使有高频明暗变化也是黑白图片', async () => {
  const env = environment(
    pixels(SIZE, (x, y) => {
      const v = (Math.floor(x / 3) + Math.floor(y / 3)) % 2 ? 255 : 0
      return [v, v, v]
    })
  )
  assert.equal(await env.check(), true)
})

test('互补色构成的图片是彩色图片', async () => {
  // 左右两半分别是红色和青色，平均之后 R G B 相等，但它是彩色图片
  const env = environment(
    pixels(SIZE, (x) => (x < SIZE / 2 ? [255, 0, 0] : [0, 255, 255]))
  )
  assert.equal(await env.check(), false)
})

test('四个象限四种颜色的图片是彩色图片', async () => {
  const env = environment(
    pixels(SIZE, (x, y) => {
      if (x < SIZE / 2 && y < SIZE / 2) return [255, 0, 0]
      if (x >= SIZE / 2 && y < SIZE / 2) return [0, 255, 0]
      if (x < SIZE / 2 && y >= SIZE / 2) return [0, 0, 255]
      return [255, 255, 0]
    })
  )
  assert.equal(await env.check(), false)
})

test('整体带有轻微色调的图片仍算黑白图片', async () => {
  // 每个像素的彩度都是 6，低于像素彩度阈值，所以没有被算作有颜色的像素
  const env = environment(
    pixels(SIZE, (x, y) => {
      const v = 60 + ((x * 7 + y * 13) % 180)
      return [v + 6, v + 3, v]
    })
  )
  assert.equal(await env.check(), true)
})

test('整体带色的低饱和度图片是彩色图片', async () => {
  // 每个像素的彩度都是 20，都达到了像素彩度阈值，所以整张图片都是有颜色的像素
  const env = environment(
    pixels(SIZE, (x, y) => {
      const v = 40 + ((x * 7 + y * 13) % 120)
      return [v + 20, v + 10, v]
    })
  )
  assert.equal(await env.check(), false)
})

test('黑白图片上小面积的彩色点缀仍算黑白图片', async () => {
  // 模拟「黑白线稿 + 彩色眼睛、背景色块」：约 8% 的像素带颜色，但颜色不浓
  const env = environment(
    pixels(SIZE, (x, y) =>
      y * SIZE + x < SIZE * SIZE * 0.08 ? [180, 120, 120] : [128, 128, 128]
    )
  )
  assert.equal(await env.check(), true)
})

test('黑白图片上极少量的彩色像素不足以判定为彩色图片', async () => {
  const env = environment(
    pixels(SIZE, (x, y) =>
      y * SIZE + x < SIZE * SIZE * 0.005 ? [220, 30, 30] : [128, 128, 128]
    )
  )
  assert.equal(await env.check(), true)
})

test('着色面积不超过阈值的图片仍算黑白图片', async () => {
  // 约 20% 的像素是鲜艳的红色，不算少，但没有超过占比阈值
  const env = environment(
    pixels(SIZE, (x, y) =>
      y * SIZE + x < SIZE * SIZE * 0.2 ? [230, 30, 30] : [128, 128, 128]
    )
  )
  assert.equal(await env.check(), true)
})

test('着色面积超过阈值的图片是彩色图片', async () => {
  // 约 50% 的像素带颜色，超过占比阈值（颜色本身不浓也算）
  const env = environment(
    pixels(SIZE, (x, y) =>
      y * SIZE + x < SIZE * SIZE * 0.5 ? [160, 130, 130] : [128, 128, 128]
    )
  )
  assert.equal(await env.check(), false)
})

test('修改 coloredRatio 设置会改变判定结果', async () => {
  // 约 20% 的像素带颜色
  const data = pixels(SIZE, (x, y) =>
    y * SIZE + x < SIZE * SIZE * 0.2 ? [230, 30, 30] : [128, 128, 128]
  )
  // 阈值是 10% 时，20% 超过了阈值，判定为彩色图片
  const strict = environment(data, { coloredRatio: 10 })
  assert.equal(await strict.check(), false)
  // 阈值是 25% 时，20% 没有超过阈值，判定为黑白图片
  const loose = environment(data, { coloredRatio: 25 })
  assert.equal(await loose.check(), true)
})

test('统计彩色占比时会忽略白色背景', async () => {
  // 70% 是白色背景，剩下 30% 里有 20% 是彩色、10% 是灰色
  // 彩色像素在非白色像素里的占比是 20/30 = 66%，超过阈值，判定为彩色图片
  // （如果不忽略白色背景，彩色占比只有 20%，会被误判为黑白图片）
  const env = environment(
    pixels(SIZE, (x, y) => {
      const i = y * SIZE + x
      if (i < SIZE * SIZE * 0.7) return [255, 255, 255]
      if (i < SIZE * SIZE * 0.9) return [230, 30, 30]
      return [128, 128, 128]
    })
  )
  assert.equal(await env.check(), false)
})

test('白色背景很多、彩色部分很少时仍然是黑白图片', async () => {
  // 70% 是白色背景，剩下 30% 里只有 5% 是彩色
  // 彩色像素在非白色像素里的占比是 5/30 = 17%，没有超过阈值
  const env = environment(
    pixels(SIZE, (x, y) => {
      const i = y * SIZE + x
      if (i < SIZE * SIZE * 0.7) return [255, 255, 255]
      if (i < SIZE * SIZE * 0.75) return [230, 30, 30]
      return [128, 128, 128]
    })
  )
  assert.equal(await env.check(), true)
})

test('整张图片都是白色背景时视为黑白图片', async () => {
  const env = environment(pixels(SIZE, () => [255, 255, 255]))
  assert.equal(await env.check(), true)
})

test('透明像素不参与检查', async () => {
  // 整张图片都是透明的，视为黑白图片
  const transparent = environment(pixels(SIZE, () => [0, 0, 0, 0]))
  assert.equal(await transparent.check(), true)

  // 透明背景上的彩色区域应当被识别出来
  const withColor = environment(
    pixels(SIZE, (x, y) =>
      y * SIZE + x < SIZE * SIZE * 0.6 ? [220, 30, 30] : [0, 0, 0, 0]
    )
  )
  assert.equal(await withColor.check(), false)
})

test('尺寸过大的图片会先缩小', async () => {
  const env = environment(pixels(SIZE, () => [128, 128, 128]), {
    imgSize: [3000, 4000],
  })
  await env.check()
  // 最长边被限制为 256，宽高比保持不变
  assert.deepEqual(env.draws, [[192, 256]])
})

test('小尺寸图片按原尺寸检查', async () => {
  const env = environment(pixels(SIZE, () => [128, 128, 128]))
  await env.check()
  assert.deepEqual(env.draws, [[48, 48]])
})

test('图片加载失败时视为彩色图片', async () => {
  const env = environment(pixels(SIZE, () => [128, 128, 128]), {
    loadError: true,
  })
  assert.equal(await env.check(), false)
})

test('抓取图片时创建的 blobURL 会被释放', async () => {
  const env = environment(pixels(SIZE, () => [128, 128, 128]))
  // 不是 blob 开头的网址会先 fetch 图片并创建 blobURL
  await env.check('https://example.com/48x48.jpg')
  assert.deepEqual(env.revoked, ['blob:created'])
})
