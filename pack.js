const fs = require('fs')
const path = require('path')
const copy = require('recursive-copy')
const archiver = require('archiver')

const packName = 'powerfulpixivdownloader-special-DelMemory'
const distPath = './dist-special-DelMemory'

async function build () {
  await copys()
  pack()
}

// 复制必须的文件到发布目录
async function copys () {
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
      filter: ['manifest.json', 'declarative_net_request_rules.json'],
    })

    // 复制根目录的一些文件
    await copy('./', distPath, {
      overwrite: true,
      filter: ['README*.md', 'LICENSE'],
    }).then(function (results) {
      resolve()
      console.log('Copy success')
    })
  })
}

// 打包发布目录
function pack () {
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

  archive.pipe(output)

  // 使用 glob 模式打包文件
  archive.glob('**/*', {
    cwd: distPath, // 设置工作目录
    ignore: [
      '_metadata/**', // 排除 _metadata 文件夹
    ],
    dot: false, // 忽略隐藏文件
  });

  archive.finalize()
}

build()
