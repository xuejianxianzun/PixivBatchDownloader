// build 命令
const fs = require('fs')
const path = require('path')
const copy = require('recursive-copy')
const archiver = require('archiver')

// 复制一些文件到 dist 目录
async function copys() {
  // 复制 static 文件夹的内容
  await copy('./static', './dist', {
    overwrite: true
  }).catch(function(error) {
    console.error('Copy failed: ' + error)
  })

  // 复制静态文件
  await copy('./src', './dist', {
    overwrite: true,
    filter: ['manifest.json']
  })

  await copy('./', './dist', {
    overwrite: true,
    filter: ['*.md', 'LICENSE']
  })

  console.log('Copy success')

  // 打包
  pack()
}

copys()

// 打包 dist 目录
function pack() {
  const zipName = path.resolve(__dirname, 'powerfulpixivdownloader.zip')
  const output = fs.createWriteStream(zipName)

  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  })

  archive.on('error', function(err) {
    throw err
  })

  archive.on('finish', () => {
    console.log(`Pack success`)
  })

  // pipe archive data to the file
  archive.pipe(output)

  // 添加文件夹
  archive.directory('dist', 'powerfulpixivdownloader')

  archive.finalize()
}
