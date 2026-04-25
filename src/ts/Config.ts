import browser from 'webextension-polyfill'

// 定义一些常量
// 用户不可以修改这里的配置
class Config {
  /**程序名 */
  static readonly appName = 'Powerful Pixiv Downloader HongYe'
  /**下载器设置在 localStorage 里储存时的 name */
  static readonly settingStoreName = 'xzSetting'
  /**使用输出面板显示内容时，如果文件数量大于这个值，就不再显示内容，而是保存到 txt 文件 */
  static readonly outputMax = 5000
  /**同时下载的文件数量的最大值 */
  // 定制：最大下载数量改为 24
  static readonly downloadThreadMax = 24
  /**下载某个文件出错时，最大重试次数 */
  static readonly retryMax = 10
  /**作品类型所对应的字符串名称 */
  static readonly worksTypeName = ['Illustration', 'Manga', 'Ugoira', 'Novel']
  /**下载器所有动图格式的后缀名 */
  static readonly ugoiraExtensions = ['zip', 'webm', 'gif', 'apng']
  /**下载器所有小说格式的后缀名 */
  static readonly novelExtensions = ['txt', 'epub']
  /**按收藏数量过滤作品时，预设的最大收藏数量 */
  static readonly BookmarkCountLimit = 9999999
  /**Pixiv 作品总数量上限 */
  static readonly worksNumberLimit = 9999999999
  /**当抓取被 pixiv 限制，返回了空数据时，等待这个时间之后再继续抓取 */
  static readonly retryTime = 200000
  /**浏览器是否处于移动端模式 */
  static readonly mobile = navigator.userAgent.includes('Mobile')
  /**检测 Firefox 浏览器 */
  static readonly isFirefox = navigator.userAgent.includes('Firefox')
  static readonly sendBlob = this.isFirefox
  /** 在 Chrome 的隐私窗口里下载时，需要把 blob 对象转换为 dataURL 发送给后台。
   * 不能直接传递 blob，因为这样后台 service worker 里接收时变成了空对象，无法使用。
   * 我试了转换为 ArrayBuffer 同样不能传递，估计是因为不能被 JSON 序列化导致的。
   * 所以需要转换为 dataURL 再发送
   */
  static readonly sendDataURL =
    !this.isFirefox && browser.extension.inIncognitoContext
  /**ImageViewer 生成的 li 元素的 className */
  static readonly ImageViewerLI = 'xz-thumb-li'
  /** 图像作品的默认命名规则 */
  static readonly defaultNameRuleForArtwork =
    'pixiv/{user}-{user_id}/{id}-{title}'
  /** 小说的默认命名规则 */
  static readonly defaultNameRuleForNovel = '{follow_artwork}'
  static readonly whatIsNewFlagDefault = 'xuejian&saber'
  /** 如果作品含有这些标签，就认为它是原创作品 */
  static readonly originalTags = [
    '原创',
    '原創',
    '創作',
    'オリジナル',
    'Original',
    'original',
    'Creation',
    'creation',
    '창작',
    '오리지널',
    'Asli',
    'ออริจินัล',
    'Оригинал',
  ]
  /** 如果作品含有这些标签，就认为它是 AI 生成的作品 */
  static readonly AITags = [
    'AI生成',
    'AI-generated',
    'AIイラスト',
    'AI生成作品',
    'AI 画作',
    'AI生成イラスト',
    'AI 생성',
    'сгенерированный ИИ',
    'สร้างโดย AI',
    'Janaan AI',
  ]
  static readonly AITagsLower = Config.AITags.map((tag) => tag.toLowerCase())
  /**始终保持显示的选项 */
  static readonly optionWhiteList: number[] = [
    2, 4, 13, 17, 26, 28, 32, 36, 44, 50, 51, 57, 64, 37, 81, 99, 100, 101, 106,
  ]
}

export { Config }
