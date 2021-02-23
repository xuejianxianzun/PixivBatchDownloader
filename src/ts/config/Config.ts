// 储存一些配置
// 用户不可以修改这里的配置
class Config {
  /**使用输出面板显示内容时，如果文件数量大于这个值，就不再显示内容，而是保存到 txt 文件 */
  static readonly outputMax = 5000
  /**同时下载的文件数量的最大值 */
  static readonly downloadThreadMax = 10
  /**作品类型所对应的字符串名称 */
  static readonly worksTypeName = ['Illustration', 'Manga', 'Ugoira', 'Novel']
  /**程序名 */
  static readonly appName = 'Powerful Pixiv Downloader'
  /**下载器设置在 localStorage 里储存时的 name */
  static readonly settingStoreName = 'xzSetting'
  /**按收藏数量过滤作品时，预设的最大收藏数量 */
  static readonly BookmarkCountLimit = 9999999
  /**作品总数量限制 */
  static readonly worksNumberLimit = 999999999
}

export default Config
