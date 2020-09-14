// 储存一些会在多个组件里使用的常量。运行过程中不会被修改的值。
export default {
  outputMax: 5000, // 输出内容时，如果文件数量大于这个值，就不再直接输出，而是保存到文件
  latestReleaseAPI:
    'https://api.github.com/repos/xuejianxianzun/PixivBatchDownloader/releases/latest',
  illustTypes: ['illustration', 'manga', 'ugoira', 'novel'],
  newTag: '_xzNew660',
}
