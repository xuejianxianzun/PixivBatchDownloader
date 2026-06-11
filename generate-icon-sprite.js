const fs = require('fs')
const path = require('path')

const iconDir = path.resolve(__dirname, 'src', 'static', 'icons')
const outputPath1 = path.resolve(
  __dirname,
  'src',
  'static',
  'lib',
  'icon-sprite.js'
)
const outputPath2 = path.resolve(
  __dirname,
  'dist-special-HongYe',
  'lib',
  'icon-sprite.js'
)

function getSvgFiles() {
  return fs
    .readdirSync(iconDir)
    .filter((fileName) => fileName.endsWith('.svg'))
    .sort((a, b) => a.localeCompare(b))
}

function removeFillAttr(svgBody) {
  return svgBody
    .replace(/\sfill=(['"])(?:\\.|(?!\1).)*\1/gi, '')
    .replace(/\sstyle=(['"])(.*?)\1/gi, (match, quote, styleValue) => {
      const cleanedStyle = styleValue
        .replace(/(^|;)\s*fill\s*:\s*[^;]+(?=;|$)/gi, '$1')
        .replace(/;\s*;/g, ';')
        .replace(/^\s*;\s*|\s*;\s*$/g, '')
        .trim()

      if (!cleanedStyle) {
        return ''
      }

      return ` style=${quote}${cleanedStyle}${quote}`
    })
}

function getSymbol(fileName) {
  const filePath = path.join(iconDir, fileName)
  const content = fs.readFileSync(filePath, 'utf8')
  const viewBoxMatch = content.match(/<svg\b[^>]*\bviewBox=(['"])(.*?)\1/i)

  if (!viewBoxMatch) {
    throw new Error(`Missing viewBox in ${fileName}`)
  }

  const bodyMatch = content.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/i)

  if (!bodyMatch) {
    throw new Error(`Invalid svg content in ${fileName}`)
  }

  const symbolId = path.basename(fileName, '.svg')
  const body = removeFillAttr(bodyMatch[1]).trim()

  return `<symbol id="${symbolId}" viewBox="${viewBoxMatch[2]}">${body}</symbol>`
}

function generateSprite(symbols) {
  return `const sprite = \`<svg xmlns="http://www.w3.org/2000/svg">${symbols.join(
    ''
  )}</svg>\`

;(function () {
  function inject() {
    if (document.getElementById('ppd-icon-sprite')) {
      return
    }

    const wrap = document.createElement('div')
    wrap.innerHTML = sprite

    const svg = wrap.firstElementChild
    if (!svg) {
      return
    }

    svg.id = 'ppd-icon-sprite'
    svg.setAttribute('aria-hidden', 'true')
    svg.style.position = 'absolute'
    svg.style.width = '0'
    svg.style.height = '0'
    svg.style.overflow = 'hidden'

    if (document.body.firstChild) {
      document.body.insertBefore(svg, document.body.firstChild)
      return
    }

    document.body.appendChild(svg)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true })
    return
  }

  inject()
})()
`
}

function build() {
  const symbols = getSvgFiles().map(getSymbol)
  const sprite = generateSprite(symbols)
  
  // 检查两个路径，如果对应的文件夹不存在（注意不要包含文件名），就创建它们
  const dir1 = path.dirname(outputPath1)
  const dir2 = path.dirname(outputPath2)

  if (!fs.existsSync(dir1)) {
    fs.mkdirSync(dir1, { recursive: true })
  }

  if (!fs.existsSync(dir2)) {
    fs.mkdirSync(dir2, { recursive: true })
  }

  // 写入文件
  fs.writeFileSync(outputPath1, sprite, 'utf8')
  fs.writeFileSync(outputPath2, sprite, 'utf8')
  console.log(`Generated icon sprite with ${symbols.length} icons`)
}

build()
