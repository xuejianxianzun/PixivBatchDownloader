// build 命令
const fs = require('fs')
const path = require('path')
const copy = require('recursive-copy')
const archiver = require('archiver')

const packName = 'powerfulpixivdownloader'

// 复制一些文件到 dist 目录
async function copys() {
  return new Promise(async (resolve, reject) => {
    // 复制 static 文件夹的内容
    await copy('./src/static', './dist', {
      overwrite: true,
    }).catch(function (error) {
      console.error('Copy failed: ' + error)
      reject()
    })

    // 复制 manifest
    await copy('./src', './dist', {
      overwrite: true,
      filter: ['manifest.json'],
    })

    // 复制根目录一些文件
    await copy('./', './dist', {
      overwrite: true,
      filter: ['README.md', 'README-EN.md', 'README-ZH-TW.md', 'LICENSE'],
    }).then(function (results) {
      resolve()
      console.log('Copy success')
    })
  })
}

// 打包 dist 目录
function pack() {
  const zipName = path.resolve(__dirname, packName + '.zip')
  const output = fs.createWriteStream(zipName)

  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  })

  archive.on('error', function (err) {
    throw err
  })

  archive.on('finish', () => {
    console.log(`Pack success`)
  })

  // pipe archive data to the file
  archive.pipe(output)

  // 添加文件夹
  archive.directory('dist', packName)

  archive.finalize()
}

// 构建
async function build() {
  await copys()
  pack()
}

build()

console.log('Start pack')
