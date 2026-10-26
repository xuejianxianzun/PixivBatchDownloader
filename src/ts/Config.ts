import browser from 'webextension-polyfill'

// 定义一些预设配置和运行时的常量
// 用户无法通过设置面板修改这里的配置
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
  /**下载器可以把动图保存为的所有格式，也是扩展名 */
  static readonly allUgoiraFormats = [
    'webm',
    'webp',
    'gif',
    'apng',
    'zip',
    'ugoira',
  ] as const
  /**下载器可以把小说保存为的所有格式，也是扩展名 */
  static readonly allNovelFormats = ['txt', 'epub'] as const
  /**按收藏数量过滤作品时，预设的最大收藏数量 */
  static readonly BookmarkCountLimit = 9999999
  /**Pixiv 作品总数量上限 */
  static readonly worksNumberLimit = 9999999999
  /**当抓取被 pixiv 限制，返回了空数据时，等待这个时间之后再继续抓取 */
  static readonly retryTime = 200000
  static readonly isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  static readonly isWin = /Win/.test(navigator.platform)
  /**浏览器是否处于移动端模式 */
  static readonly mobile = navigator.userAgent.includes('Mobile')
  /** 导出 JSON 文件时，单个文件的体积上限（字节）
   *
   * 桌面端多年来验证 500 MB 可用，不过为了减少峰值内存占用，我现在改为了 300 MB。
   * 手机上（尤其 Android 的 Chrome / Edge）渲染进程的内存上限低得多：
   * 生成文件时，抓取结果的数组、JSON 字符串、Blob 会同时存在于内存里，峰值接近文件体积的 2~3 倍，
   * 单个文件太大时页面会卡住几十秒甚至被系统直接杀掉（进程被杀还可能导致下载记录所在的 IndexedDB 损坏）。
   * 所以移动端使用更小的上限，导出时会拆成多个文件。
   *
   * 上限只能靠固定值，无法去「探测」：网页对 blob 下载的成败没有任何可观测的反馈
   * （没有事件、没有回调，内容脚本里也拿不到 downloads API），失败形态是卡死或进程被杀，
   * 而且可用的体积取决于当时的空闲内存和磁盘，探测出来的值不能代表下一次导出。
   */
  static get exportFileByteLengthLimit() {
    // 移动端 64 MB（用户实测手机上导出 128 MB 的文件可以成功，但那只是当时内存足够，
    // 再往上就很容易卡死，所以留出余量）；桌面端 300 MB
    return this.mobile ? 67108864 : 314572800
  }
  /**检测 Firefox 浏览器 */
  static readonly isFirefox = navigator.userAgent.includes('Firefox')
  /** Firefox Android 上不支持 downloads API（调用 downloads.download 等方法会抛出 "Not implemented" 错误），此时需要使用 a 标签来下载文件 */
  static readonly downloadsAPIDisabled = this.isFirefox && this.mobile
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
}

export { Config }
