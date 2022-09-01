// build 命令
const fs = require('fs')
const path = require('path')
const copy = require('recursive-copy')
const archiver = require('archiver')

const packName = 'powerfulpixivdownloader'
const distPath = './dist-offline'

// 复制一些文件到发布目录
async function copys() {
  return new Promise(async (resolve, reject) => {
    // 复制 static 文件夹的内容
    await copy('./src/static', distPath, {
      overwrite: true,
    }).catch(function (error) {
      console.error('Copy failed: ' + error)
      reject()
    })

    // 复制 src 目录里需要的文件
    await copy('./src', distPath, {
      overwrite: true,
      filter: ['manifest.json'],
    })

    // 复制根目录一些文件
    await copy('./', distPath, {
      overwrite: true,
      filter: ['README.md', 'README-EN.md', 'README-KO.md', 'README-ZH-TW.md', 'LICENSE'],
    }).then(function (results) {
      resolve()
      console.log('Copy success')
    })
  })
}

// 打包发布目录
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
  archive.directory(distPath, packName)

  archive.finalize()
}

// 构建
async function build() {
  await copys()
  pack()
}

build()

console.log('Start pack')
