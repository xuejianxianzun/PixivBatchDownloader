// opencc-js 的消息处理脚本
// 本文件会被拼接到 opencc 的 UMD 文件（opencc-cn2t.js 或 opencc-t2cn.js）的后面，
// 合并成一个 blob 后创建 worker，所以这里可以直接使用 UMD 暴露的全局变量 OpenCC。
// opencc-js 版本：1.5.0-beta.0

// 缓存转换器。构建字典的 trie 有开销，所以同一个方向只构建一次
var cachedMode = ''
var cachedConverter = null

function getConverter(mode) {
  var key = JSON.stringify(mode)
  if (cachedMode !== key || !cachedConverter) {
    cachedConverter = OpenCC.Converter(mode)
    cachedMode = key
  }
  return cachedConverter
}

self.onmessage = function (ev) {
  var data = ev.data || {}
  var id = data.id
  try {
    var result = getConverter(data.mode)(data.text)
    self.postMessage({ id: id, result: result })
  } catch (error) {
    self.postMessage({
      id: id,
      error: (error && error.message) || String(error),
    })
  }
}
