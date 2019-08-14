// build 命令
// 因为浏览器扩展只需要使用项目中的一部分文件，所以制作此脚本用来自动打包，以便于上传到 Chrome 应用商店。
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const zipName = path.join(__dirname, 'pixivbatchdownloader.zip')
const output = fs.createWriteStream(zipName)

const dist = 'src'

const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
})

// good practice to catch this error explicitly
archive.on('error', function (err) {
  throw err
})

archive.on('finish', () => {
  console.log(`build success`)
})

// pipe archive data to the file
archive.pipe(output)

// append a file
archive.file('manifest.json', { name: 'manifest.json' })
archive.file('LICENSE', { name: 'LICENSE' })

// append files from a sub-directory and naming it `new-subdir` within the archive
// 此方法添加子文件夹里的文件，不会自动创建该子文件夹，需要手动指定生成的子文件夹名
// archive.directory('lib/', 'lib')

const globOptions = {
  cwd: dist,
}

// append files from a glob pattern
// 使用此方法添加子文件夹里的文件，会自动创建该子文件夹
archive.glob('*/**', {cwd: path.join(globOptions.cwd, 'assets')})
archive.glob('js/**', globOptions)
archive.glob('lib/**', globOptions)
archive.glob('*.md')

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize()
