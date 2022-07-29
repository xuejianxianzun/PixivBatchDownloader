// 储存一些配置
// 用户不可以修改这里的配置
class Config {
  /**使用输出面板显示内容时，如果文件数量大于这个值，就不再显示内容，而是保存到 txt 文件 */
  static readonly outputMax = 5000
  // 定制：修改下载线程数为 10
  /**同时下载的文件数量的最大值 */
  static readonly downloadThreadMax = 10
  /**下载某个文件出错时，最大重试次数 */
  static readonly retryMax = 10
  /**作品类型所对应的字符串名称 */
  static readonly worksTypeName = ['Illustration', 'Manga', 'Ugoira', 'Novel']
  /**程序名 */
  static readonly appName = 'Powerful Pixiv Downloader DelMemory'
  /**下载器设置在 localStorage 里储存时的 name */
  static readonly settingStoreName = 'xzSetting'
  /**按收藏数量过滤作品时，预设的最大收藏数量 */
  static readonly BookmarkCountLimit = 9999999
  /**作品总数量限制 */
  static readonly worksNumberLimit = 999999999
  /**当抓取被 pixiv 限制，返回了空数据时，等待这个时间之后再继续抓取 */
  static retryTimer = 200000
}

export { Config }
