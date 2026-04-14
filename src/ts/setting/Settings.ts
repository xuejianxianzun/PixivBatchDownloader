// settings 保存了下载器的所有设置项

// 获取设置项的值：
// settings[name]

// 修改设置项的值：
// setSetting(name, value)

// 本模块会触发 3 个事件：

// EVT.list.settingChange
// 当任意一个设置项被赋值时触发（不会区分值是否发生了变化）。这可能是由下载器触发的，也可能是用户触发的。例如：
// - 每当用户打开或刷新一个标签页时，下载器会执行设置初始化，在此过程中每个设置项都会触发一次 settingChange 事件
// - 重置设置时
// - 导入设置时
// - 用户修改任意一个设置时
// 事件的参数里会传递这个设置项的名称和值，可以通过 ev.detail.data 获取，格式如：
// {name: string, value: any}
// 如果要监听特定的设置项，应该使用参数的 name 来判断触发事件的设置项是否是自己需要的设置项
// 如果不依赖于特定设置项，则应该考虑使用节流或者防抖来限制该事件的回调函数的执行频率，以免造成性能问题
// 示例：
// window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
//   const data = ev.detail.data as any
//   if (data.name === 'showAdvancedSettings') { }
//   if (data.value) { }
// })

// EVT.list.settingInitialized
// 每当用户打开或刷新一个标签页时，下载器会读取之前储存的设置，然后执行设置初始化。
// 在此过程中每个设置项都会从默认值变成储存的值（如果没有储存的设置，则使用默认值），并触发一次 settingChange 事件
// 当所有设置都初始化完毕后，触发一次 settingInitialized 事件
// 在内容脚本的生命周期里，这个事件只会触发一次。可以理解为在一个标签页里只会触发一次，除非用户刷新了该标签页才会再次触发
// PS：重置设置不会触发这个事件
// 用途：
// - 如果其他模块在初始化时依赖多个设置项，建议绑定这个事件，以确保所有设置都已经恢复了储存的值
// - 想在设置初始化之后执行动作

// EVT.list.resetSettingsEnd
// 会被两种操作触发：
// 1. 重置设置
// 2. 导入设置
// 在执行上面两种操作的过程中，每个设置项都会触发一次 settingChange 事件
// 最后会触发一次 resetSettingsEnd 事件

// 如果打开了多个标签页，每个页面的 settings 数据是相互独立的，在一个页面里修改设置不会影响另一个页面里的设置。
// 但是持久化保存的数据只有一份：最后一次的设置变化是在哪个页面发生的，就保存哪个页面的 settings 数据。
// 所以当页面刷新时，或者打开新的页面时，会加载设置最后一次发生变化的页面里的 settings 数据

import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { convertOldSettings } from './ConvertOldSettings'
import { msgBox } from '../MsgBox'
import { Config } from '../Config'
import { secretSignal } from '../utils/SecretSignal'
import { toast } from '../Toast'
import { lang } from '../Language'
import { PageName } from '../PageType'
import { ppdTask } from '../PPDTask'

export interface BlockTagsForSpecificUserItem {
  uid: number
  user?: string
  tags: string[]
}

type SettingValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | object[]
  | { [key: number]: string }
  | Map<string, string>
  | { [key in PageName]: CrawlNumberConfig }

export interface SettingChangeData {
  name: SettingKeys
  value: SettingValue
}

type CrawlNumberConfig = {
  /**是否显示“抓取多少作品” */
  work: boolean
  /**是否显示“抓取多少页面” */
  page: boolean
  /**作品/页数的最小值 */
  min: number
  /**作品/页数的最大值 */
  max: number
  /**储存默认值和用户修改后的值 */
  value: number
  /**显示可用范围的提示信息 */
  tip: string
}

type PageEntry = [PageName, any]

// 注意：设置里不能使用 Map，因为把设置保存在 storage 里时会序列化
// 如果使用 Map，会被转换为 `Object {}`，导致错误
interface XzSetting {
  crawlNumber: { [key in PageName]: CrawlNumberConfig }
  onlyCrawlFirstFewImagesSwitch: boolean
  onlyCrawlFirstFewImagesCount: number
  multiImageWorkImageLimitSwitch: boolean
  multiImageWorkImageLimit: number
  downType0: boolean
  downType1: boolean
  downType2: boolean
  downType3: boolean
  downSingleImg: boolean
  downMultiImg: boolean
  downColorImg: boolean
  downBlackWhiteImg: boolean
  downNotBookmarked: boolean
  downBookmarked: boolean
  ugoiraSaveAs: 'webm' | 'gif' | 'zip' | 'apng'
  convertUgoiraThread: number
  needTagSwitch: boolean
  notNeedTagSwitch: boolean
  needTag: string[]
  notNeedTag: string[]
  autoStartDownload: boolean
  downloadThread: number
  userSetName: string
  namingRuleList: string[]
  workDir: boolean
  workDirFileNumber: number
  workDirNameRule: string
  showOptions: boolean
  postDate: boolean
  postDateStart: number
  postDateEnd: number
  previewResult: boolean
  previewResultLimit: number
  BMKNumSwitch: boolean
  BMKNumMin: number
  BMKNumMax: number
  BMKNumAverageSwitch: boolean
  BMKNumAverage: number
  setWHSwitch: boolean
  widthHeightLimit: '>=' | '=' | '<='
  setWidthAndOr: '&' | '|'
  setWidth: number
  setHeight: number
  ratioSwitch: boolean
  ratio: 'square' | 'horizontal' | 'vertical' | 'userSet'
  userSetChecked: boolean
  userRatio: number
  userRatioLimit: '>=' | '=' | '<='
  idRangeSwitch: boolean
  idRangeComparisonForImageWorks: '>' | '<'
  idRangeComparisonForNovelWorks: '>' | '<'
  idRangeComparisonForNovelSeries: '>' | '<'
  idRangeValueForImageWorks: number
  idRangeValueForNovelWorks: number
  idRangeValueForNovelSeries: number
  filterBlackWhite: boolean
  sizeSwitch: boolean
  sizeMin: number
  sizeMax: number
  novelSaveAs: 'txt' | 'epub'
  saveNovelMeta: boolean
  deduplication: boolean
  dupliStrategy: 'strict' | 'loose'
  tagsSeparator: ',' | '#' | '^' | '&' | '_'
  fullNameLengthLimitSwitch: boolean
  fullNameLengthLimit: number
  /** 图片尺寸。original 原图, regular 普通, small 小图, thumb 方形缩略图 */
  imageSize: 'original' | 'regular' | 'small' | 'thumb'
  dateFormat: string
  userSetLang: 'zh-cn' | 'zh-tw' | 'ja' | 'en' | 'ko' | 'ru' | 'auto'
  bmkAfterDL: boolean

  // 选项在表单中的值
  widthTag: 'yes' | 'no'
  // 根据表单中的值转换为实际使用的值
  widthTagBoolean: boolean

  // 选项在表单中的值
  restrict: 'yes' | 'no'
  // 根据表单中的值转换为实际使用的值
  restrictBoolean: boolean

  userBlockList: boolean
  blockList: string[]
  removeBlockedUsersWork: boolean
  needTagMode: 'all' | 'one'
  theme: 'auto' | 'white' | 'dark'
  r18Folder: boolean
  r18FolderName: string
  blockTagsForSpecificUser: boolean
  blockTagsForSpecificUserShowList: boolean
  blockTagsForSpecificUserList: BlockTagsForSpecificUserItem[]
  magnifier: boolean
  magnifierSize: 'original' | 'regular'
  magnifierPosition: 'left' | 'right'
  bgDisplay: boolean
  bgOpacity: number
  bgPositionY: 'center' | 'top'
  createFolderByType: boolean
  createFolderByTypeIllust: boolean
  createFolderByTypeManga: boolean
  createFolderByTypeUgoira: boolean
  createFolderByTypeNovel: boolean
  createFolderByTag: boolean
  createFolderTagList: string[]
  createFolderBySl: boolean
  downloadUgoiraFirst: boolean
  downAllAges: boolean
  downR18: boolean
  downR18G: boolean
  switchTabBar: 'over' | 'click'
  zeroPadding: boolean
  zeroPaddingLength: number
  tagMatchMode: 'partial' | 'whole'
  showFastSearchArea: boolean
  saveMetaType0: boolean
  saveMetaType1: boolean
  saveMetaType2: boolean
  saveMetaType3: boolean
  saveMetaFormatTXT: boolean
  saveMetaFormatJSON: boolean
  /** 为每个页面类型设置不同的命名规则的开关 */
  setNameRuleForEachPageType: boolean
  /** 每个页面类型所使用的命名规则 */
  // 这里应该使用 Map 结构，但是 JSON.stringify 不能处理 Map 类型，所以简化成了 Object
  nameRuleForEachPageType: { [key in PageName]: string }
  showAdvancedSettings: boolean
  showNotificationAfterDownloadComplete: boolean
  boldKeywords: boolean
  autoExportResult: boolean
  autoExportResultCSV: boolean
  autoExportResultJSON: boolean
  autoExportResultNumber: number
  PreviewWork: boolean
  showDownloadBtnOnThumb: boolean
  prevWorkSize: 'original' | 'regular'
  previewWorkWait: number
  showPreviewWorkTip: boolean
  showOriginImage: boolean
  showOriginImageSize: 'original' | 'regular'
  tipHowToUse: boolean
  whatIsNewFlag: string
  replaceSquareThumb: boolean
  notFolderWhenOneFile: boolean
  noSerialNo: boolean
  noSerialNoForSingleImg: boolean
  noSerialNoForMultiImg: boolean
  setNoSerialNoForUgoira: boolean
  setUserNameShow: boolean
  setUserNameList: {
    [uid: string]: string
  }
  removeAtFromUsername: boolean
  showLargerThumbnails: boolean
  wheelScrollSwitchImageOnPreviewWork: boolean
  swicthImageByKeyboard: boolean
  /**不抓取多图作品的最后一张图片 */
  doNotCrawlLastImagesSwitch: boolean
  doNotCrawlLastImagesCount: number
  downloadNovelCoverImage: boolean
  downloadNovelEmbeddedImage: boolean
  previewUgoira: boolean
  tipPreviewWork: boolean
  tipHotkeysViewLargeImage: boolean
  /**定时抓取的间隔时间，注意单位是分钟而不是毫秒 */
  timedCrawlInterval: number
  slowCrawl: boolean
  slowCrawlOnWorksNumber: number
  downloadOnClickBookmark: boolean
  downloadOnClickLike: boolean
  exportLog: boolean
  exportLogTiming: 'crawlComplete' | 'downloadComplete'
  exportLogNormal: boolean
  exportLogError: boolean
  exportLogExclude: string[]
  DoNotDownloadLastFewImagesShow: boolean
  DoNotDownloadLastFewImagesList: {
    uid: number
    user: string
    value: number
  }[]
  UseDifferentNameRuleIfWorkHasTagSwitch: boolean
  UseDifferentNameRuleIfWorkHasTagShow: boolean
  UseDifferentNameRuleIfWorkHasTagList: {
    id: number
    tags: string[]
    rule: string
  }[]
  AIGenerated: boolean
  notAIGenerated: boolean
  UnknownAI: boolean
  setFileDownloadOrder: boolean
  downloadOrder: 'desc' | 'asc'
  downloadOrderSortBy: 'ID' | 'bookmarkCount' | 'bookmarkID'
  tipAltXToShowControlPanel: boolean
  tipAltSToSelectWork: boolean
  tipAltQToQuickDownload: boolean
  tipBookmarkButton: boolean
  highlightFollowingUsers: boolean
  coverImage: boolean
  exportIDList: boolean
  displayThumbnailListOnMultiImageWorkPage: boolean
  tipBookmarkManage: boolean
  requestSponsorshipTime: number
  PreviewWorkDetailInfo: boolean
  PreviewDetailInfoWidth: number
  removeWorksOfFollowedUsersOnSearchPage: boolean
  saveWorkDescription: boolean
  saveEachDescription: boolean
  summarizeDescription: boolean
  // delay 的拼写错误，但为了维持兼容性，不做修改
  slowCrawlDealy: number
  /**设置下载一个文件后，需要等待多久才能开始下一次下载。值为 0 - 3600 秒，允许小数 */
  downloadInterval: number
  downloadIntervalOnWorksNumber: number
  tipOpenWikiLink: boolean
  copyWorkInfoFormat: string
  showCopyBtnOnThumb: boolean
  copyFormatImage: boolean
  copyFormatText: boolean
  copyFormatHtml: boolean
  tipCopyWorkInfoButton: boolean
  copyImageSize: 'original' | 'regular'
  crawlLatestFewWorks: boolean
  crawlLatestFewWorksNumber: number
  rememberTheLastSaveLocation: boolean
  autoMergeNovel: boolean
  /** 自动合并系列小说时，如果一篇小说属于某个系列，则不下载它（因为合并后的小说里会包含这篇小说，所以没必要重复下载） */
  skipNovelsInSeriesWhenAutoMerge: boolean
  seriesNovelNameRule: string
  filterSearchResults: boolean
  logVisibleDefault: 'show' | 'hide'
  tipCloseAskFileSaveLocation: boolean
  tipCloseAskFileSaveLocationOnce: boolean
  titleIncludeSwitch: boolean
  titleIncludeList: string[]
  titleExcludeSwitch: boolean
  titleExcludeList: string[]
  alsoCheckSeriesTitle: boolean
  crawlOriginalWork: boolean
  crawlNonOriginalWork: boolean
  looseMatchOriginal: boolean
  tipImageViewer: boolean
  removeEmoji: boolean
  serialNoStart: 0 | 1
  DonotCrawlAlreadyDownloadedWorks: boolean
  showBorderOnDownloadedWorks: boolean
  borderColor: string
  borderWidth: number
  debugForWorkThumbnail: boolean
  onlyCrawlLastFewImagesSwitch: boolean
  onlyCrawlLastFewImagesCount: number
  doNotCrawlFirstImagesSwitch: boolean
  doNotCrawlFirstImagesCount: number
}

type SettingKeys = keyof XzSetting

class Settings {
  constructor() {
    this.restore()
    this.bindEvents()
  }

  // 默认设置
  private readonly defaultSettings: XzSetting = {
    crawlNumber: {
      [PageName.Unsupported]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '-1',
      },
      [PageName.Home]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '1',
      },
      [PageName.Artwork]: {
        work: true,
        page: false,
        min: 1,
        max: -1,
        value: -1,
        tip: '_负1或者大于0',
      },
      [PageName.UserHome]: {
        work: false,
        page: true,
        min: 1,
        max: -1,
        value: -1,
        tip: '_负1或者大于0',
      },
      [PageName.BookmarkLegacy]: {
        work: false,
        page: true,
        min: 1,
        max: -1,
        value: -1,
        tip: '_负1或者大于0',
      },
      [PageName.Bookmark]: {
        work: false,
        page: true,
        min: 1,
        max: -1,
        value: -1,
        tip: '_负1或者大于0',
      },
      [PageName.ArtworkSearch]: {
        work: false,
        page: true,
        min: 1,
        max: 5000,
        value: 1,
        tip: '1 - 5000',
      },
      [PageName.AreaRanking]: {
        work: true,
        page: false,
        min: 1,
        max: 50,
        value: 50,
        tip: '',
      },
      [PageName.ArtworkRanking]: {
        work: true,
        page: false,
        min: 1,
        max: 500,
        value: 100,
        tip: '1 - 500',
      },
      [PageName.Pixivision]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '',
      },
      [PageName.BookmarkDetail]: {
        work: true,
        page: false,
        min: 1,
        max: 1000,
        value: 100,
        tip: '1 - 1000',
      },
      [PageName.NewArtworkBookmark]: {
        work: false,
        page: true,
        min: 1,
        max: 100,
        value: 100,
        tip: '1 - 100',
      },
      [PageName.Discover]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '',
      },
      [PageName.NewArtwork]: {
        work: true,
        page: false,
        min: 1,
        max: 1000,
        value: 100,
        tip: '1 - 1000',
      },
      [PageName.Novel]: {
        work: true,
        page: false,
        min: 1,
        max: -1,
        value: -1,
        tip: '_负1或者大于0',
      },
      [PageName.NovelSeries]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '',
      },
      [PageName.NovelSearch]: {
        work: false,
        page: true,
        min: 1,
        max: 5000,
        value: 1,
        tip: '1 - 5000',
      },
      [PageName.NovelRanking]: {
        work: true,
        page: false,
        min: 1,
        max: 100,
        value: 100,
        tip: '1 - 100',
      },
      [PageName.NewNovelBookmark]: {
        work: false,
        page: true,
        min: 1,
        max: 100,
        value: 100,
        tip: '1 - 100',
      },
      [PageName.NewNovel]: {
        work: true,
        page: false,
        min: 1,
        max: 1000,
        value: 100,
        tip: '1 - 1000',
      },
      [PageName.ArtworkSeries]: {
        work: false,
        page: true,
        min: 1,
        max: 1000,
        value: 1000,
        tip: '1 - 1000',
      },
      [PageName.Following]: {
        work: false,
        page: true,
        min: 1,
        max: -1,
        value: 1,
        tip: '_负1或者大于0',
      },
      [PageName.Request]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '',
      },
      [PageName.Unlisted]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '',
      },
      [PageName.DiscoverUsers]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '',
      },
      [PageName.Dashboard]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '',
      },
      [PageName.Contest]: {
        work: false,
        page: true,
        min: 1,
        max: -1,
        value: -1,
        tip: '_负1或者大于0',
      },
      [PageName.SearchUsers]: {
        work: false,
        page: false,
        min: 0,
        max: 0,
        value: 0,
        tip: '',
      },
    },
    onlyCrawlFirstFewImagesSwitch: false,
    onlyCrawlFirstFewImagesCount: 1,
    multiImageWorkImageLimitSwitch: false,
    multiImageWorkImageLimit: 10,
    downType0: true,
    downType1: true,
    downType2: true,
    downType3: true,
    downAllAges: true,
    downR18: true,
    downR18G: true,
    downSingleImg: true,
    downMultiImg: true,
    downColorImg: true,
    downBlackWhiteImg: true,
    downNotBookmarked: true,
    downBookmarked: true,
    ugoiraSaveAs: 'webm',
    convertUgoiraThread: 1,
    needTag: [],
    notNeedTag: [],
    autoStartDownload: true,
    downloadThread: 3,
    userSetName: Config.defaultNameRule,
    namingRuleList: [Config.defaultNameRule],
    workDir: false,
    workDirFileNumber: 1,
    workDirNameRule: '{id_num}',
    showOptions: true,
    postDate: false,
    // 2009 年 1 月 1 日
    postDateStart: 1230739200000,
    // 2100 年 1 月 1 日
    postDateEnd: 4102416000000,
    previewResult: true,
    previewResultLimit: 3000,
    BMKNumSwitch: false,
    BMKNumMin: 0,
    BMKNumMax: Config.BookmarkCountLimit,
    BMKNumAverageSwitch: false,
    BMKNumAverage: 600,
    setWHSwitch: false,
    widthHeightLimit: '>=',
    setWidthAndOr: '&',
    setWidth: 0,
    setHeight: 0,
    ratioSwitch: false,
    ratio: 'horizontal',
    userSetChecked: false,
    userRatio: 1.4,
    userRatioLimit: '>=',
    idRangeSwitch: false,
    idRangeComparisonForImageWorks: '>',
    idRangeComparisonForNovelWorks: '>',
    idRangeComparisonForNovelSeries: '>',
    idRangeValueForImageWorks: 0,
    idRangeValueForNovelWorks: 0,
    idRangeValueForNovelSeries: 0,
    needTagSwitch: false,
    notNeedTagSwitch: false,
    filterBlackWhite: false,
    sizeSwitch: false,
    sizeMin: 0,
    sizeMax: 100,
    novelSaveAs: 'epub',
    saveNovelMeta: true,
    deduplication: false,
    dupliStrategy: 'loose',
    tagsSeparator: ',',
    fullNameLengthLimitSwitch: true,
    /** 完整文件名（包含文件夹、文件名、扩展名）的长度限制 */
    fullNameLengthLimit: 210,
    imageSize: 'original',
    dateFormat: 'YYYY-MM-DD',
    userSetLang: 'auto',
    bmkAfterDL: false,
    widthTag: 'yes',
    restrict: 'no',
    widthTagBoolean: true,
    restrictBoolean: false,
    userBlockList: false,
    removeBlockedUsersWork: true,
    blockList: [],
    theme: 'auto',
    needTagMode: 'all',
    r18Folder: false,
    r18FolderName: '[R-18&R-18G]',
    blockTagsForSpecificUser: false,
    blockTagsForSpecificUserShowList: true,
    blockTagsForSpecificUserList: [],
    magnifier: true,
    magnifierSize: 'original',
    magnifierPosition: 'right',
    bgDisplay: false,
    bgOpacity: 60,
    bgPositionY: 'center',
    createFolderByType: false,
    createFolderByTypeIllust: false,
    createFolderByTypeManga: false,
    createFolderByTypeUgoira: false,
    createFolderByTypeNovel: false,
    createFolderByTag: false,
    createFolderTagList: [],
    createFolderBySl: false,
    downloadUgoiraFirst: false,
    switchTabBar: 'over',
    zeroPadding: false,
    zeroPaddingLength: 3,
    tagMatchMode: 'whole',
    showFastSearchArea: true,
    saveMetaType0: false,
    saveMetaType1: false,
    saveMetaType2: false,
    saveMetaType3: false,
    saveMetaFormatTXT: true,
    saveMetaFormatJSON: false,
    setNameRuleForEachPageType: false,
    nameRuleForEachPageType: {
      [PageName.Unsupported]: Config.defaultNameRule,
      [PageName.Home]: Config.defaultNameRule,
      [PageName.Artwork]: Config.defaultNameRule,
      [PageName.UserHome]: Config.defaultNameRule,
      [PageName.BookmarkLegacy]:
        'pixiv/{page_tag}/{user}-{user_id}/{id}-{title}',
      [PageName.Bookmark]: 'pixiv/{page_tag}/{user}-{user_id}/{id}-{title}',
      [PageName.ArtworkSearch]:
        'pixiv/{page_tag}/{user}-{user_id}/{id}-{title}',
      [PageName.AreaRanking]: Config.defaultNameRule,
      [PageName.ArtworkRanking]: 'pixiv/{page_title}/{rank}-{id}-{title}',
      [PageName.Pixivision]: 'pixivision/{page_title}/{id}',
      [PageName.BookmarkDetail]: Config.defaultNameRule,
      [PageName.NewArtworkBookmark]: Config.defaultNameRule,
      [PageName.Discover]: Config.defaultNameRule,
      [PageName.NewArtwork]: Config.defaultNameRule,
      [PageName.Novel]: Config.defaultNameRule,
      [PageName.NovelSeries]:
        'pixiv/{user}-{user_id}/{series_title}/{series_order}-{title}-{id}',
      [PageName.NovelSearch]: 'pixiv/{page_tag}/{user}-{user_id}/{id}-{title}',
      [PageName.NovelRanking]: 'pixiv/{page_title}/{rank}-{id}-{title}',
      [PageName.NewNovelBookmark]: Config.defaultNameRule,
      [PageName.NewNovel]: Config.defaultNameRule,
      [PageName.ArtworkSeries]:
        'pixiv/{user}-{user_id}/{series_title}/{series_order}-{title}-{id}',
      [PageName.Following]: Config.defaultNameRule,
      [PageName.Request]: Config.defaultNameRule,
      [PageName.Unlisted]: Config.defaultNameRule,
      [PageName.DiscoverUsers]: Config.defaultNameRule,
      [PageName.Dashboard]: Config.defaultNameRule,
      [PageName.Contest]: 'pixiv/{page_title}/{user}-{user_id}/{id}-{title}',
      [PageName.SearchUsers]: Config.defaultNameRule,
    },
    showAdvancedSettings: false,
    showNotificationAfterDownloadComplete: false,
    boldKeywords: true,
    autoExportResult: false,
    autoExportResultCSV: false,
    autoExportResultJSON: true,
    autoExportResultNumber: 1,
    PreviewWork: true,
    showDownloadBtnOnThumb: true,
    prevWorkSize: 'regular',
    previewWorkWait: 400,
    showPreviewWorkTip: true,
    showOriginImage: true,
    showOriginImageSize: 'original',
    tipHowToUse: true,
    whatIsNewFlag: Config.whatIsNewFlagDefault,
    replaceSquareThumb: true,
    notFolderWhenOneFile: false,
    noSerialNo: true,
    noSerialNoForSingleImg: false,
    noSerialNoForMultiImg: false,
    setNoSerialNoForUgoira: true,
    setUserNameShow: true,
    setUserNameList: {},
    removeAtFromUsername: false,
    showLargerThumbnails: false,
    wheelScrollSwitchImageOnPreviewWork: true,
    swicthImageByKeyboard: true,
    doNotCrawlLastImagesSwitch: false,
    doNotCrawlLastImagesCount: 1,
    downloadNovelCoverImage: true,
    downloadNovelEmbeddedImage: true,
    previewUgoira: true,
    tipPreviewWork: true,
    tipHotkeysViewLargeImage: true,
    timedCrawlInterval: 120,
    slowCrawl: true,
    slowCrawlOnWorksNumber: 100,
    downloadOnClickBookmark: false,
    downloadOnClickLike: false,
    exportLog: false,
    exportLogTiming: 'downloadComplete',
    exportLogNormal: false,
    exportLogError: true,
    exportLogExclude: ['404', '429', '500'],
    DoNotDownloadLastFewImagesShow: false,
    DoNotDownloadLastFewImagesList: [],
    UseDifferentNameRuleIfWorkHasTagSwitch: false,
    UseDifferentNameRuleIfWorkHasTagShow: true,
    UseDifferentNameRuleIfWorkHasTagList: [],
    AIGenerated: true,
    notAIGenerated: true,
    UnknownAI: true,
    setFileDownloadOrder: false,
    downloadOrder: 'desc',
    downloadOrderSortBy: 'ID',
    tipAltXToShowControlPanel: true,
    tipAltSToSelectWork: true,
    tipAltQToQuickDownload: true,
    tipBookmarkButton: true,
    highlightFollowingUsers: true,
    coverImage: false,
    exportIDList: false,
    displayThumbnailListOnMultiImageWorkPage: true,
    tipBookmarkManage: true,
    requestSponsorshipTime: 0,
    PreviewWorkDetailInfo: false,
    PreviewDetailInfoWidth: 400,
    removeWorksOfFollowedUsersOnSearchPage: false,
    saveWorkDescription: false,
    saveEachDescription: true,
    summarizeDescription: false,
    slowCrawlDealy: 1600,
    downloadInterval: 1,
    downloadIntervalOnWorksNumber: 150,
    tipOpenWikiLink: true,
    copyWorkInfoFormat: 'Title={title}{n}Tag={tags}{n}{url}{n}',
    showCopyBtnOnThumb: true,
    copyFormatImage: false,
    copyFormatText: true,
    copyFormatHtml: true,
    tipCopyWorkInfoButton: true,
    copyImageSize: 'original',
    crawlLatestFewWorks: false,
    crawlLatestFewWorksNumber: 10,
    rememberTheLastSaveLocation: false,
    autoMergeNovel: false,
    skipNovelsInSeriesWhenAutoMerge: true,
    seriesNovelNameRule:
      'novel series/{page_tag}/{series_title}-{series_id}-{user}-{part}-{tags}.{ext}',
    filterSearchResults: false,
    logVisibleDefault: 'show',
    tipCloseAskFileSaveLocation: true,
    tipCloseAskFileSaveLocationOnce: true,
    titleIncludeSwitch: false,
    titleIncludeList: [],
    titleExcludeSwitch: false,
    titleExcludeList: [],
    alsoCheckSeriesTitle: false,
    crawlOriginalWork: true,
    crawlNonOriginalWork: true,
    looseMatchOriginal: true,
    tipImageViewer: true,
    removeEmoji: true,
    serialNoStart: 0,
    DonotCrawlAlreadyDownloadedWorks: false,
    showBorderOnDownloadedWorks: false,
    borderColor: '#ff4060',
    borderWidth: 3,
    debugForWorkThumbnail: false,
    onlyCrawlLastFewImagesSwitch: false,
    onlyCrawlLastFewImagesCount: 1,
    doNotCrawlFirstImagesSwitch: false,
    doNotCrawlFirstImagesCount: 1,
  }

  private allSettingKeys = Object.keys(this.defaultSettings)

  // 值为浮点数的设置
  private floatNumberKey = [
    'userRatio',
    'sizeMin',
    'sizeMax',
    'downloadInterval',
  ]

  // 值为整数的设置不必单独列出

  // 值为 number[] 的设置（目前没有）
  private numberArrayKeys = []

  // 值为字符串数组的设置
  private stringArrayKeys = [
    'namingRuleList',
    'blockList',
    'needTag',
    'notNeedTag',
    'createFolderTagList',
    'exportLogExclude',
    'titleIncludeList',
    'titleExcludeList',
  ]

  // 以默认设置作为初始设置
  public settings: XzSetting = Utils.deepCopy(this.defaultSettings)

  private bindEvents() {
    // 当设置发生变化时进行本地存储
    window.addEventListener(EVT.list.settingChange, () => {
      this.store()
    })

    window.addEventListener(EVT.list.resetSettings, () => {
      this.reset()
    })

    window.addEventListener(EVT.list.exportSettings, () => {
      this.exportSettings()
    })

    window.addEventListener(EVT.list.importSettings, () => {
      this.importSettings()
    })

    window.addEventListener(EVT.list.resetHelpTip, () => {
      this.resetHelpTip()
    })

    // 切换只选择动图/选择全部作品类型
    const codes = ['onlyugoira', 'qw222']
    for (const code of codes) {
      secretSignal.register(code, () => {
        // 如果只有动图被选中，则改为选择全部作品类型
        if (
          this.settings.downType2 &&
          !this.settings.downType0 &&
          !this.settings.downType1 &&
          !this.settings.downType3
        ) {
          this.setSetting('downType0', true)
          this.setSetting('downType1', true)
          this.setSetting('downType3', true)
          toast.warning('onlyUgoira off')
        } else {
          // 对于其他情况，不管动图有没有被选中，都改为只选择动图
          if (this.settings.downType0) {
            this.setSetting('downType0', false)
          }
          if (this.settings.downType1) {
            this.setSetting('downType1', false)
          }
          this.setSetting('downType2', true)
          if (this.settings.downType3) {
            this.setSetting('downType3', false)
          }
          toast.success('onlyUgoira on')
        }
      })
    }

    ppdTask.register(12, 'Export browser.storage.local data', () => {
      browser.storage.local.get().then((result) => {
        if (result) {
          const blob = Utils.json2Blob(result)
          const url = URL.createObjectURL(blob)
          Utils.downloadFile(
            url,
            Config.appName + ` browser.storage.local.json`
          )
        }
      })
    })
  }

  // 读取恢复设置
  private restore() {
    let restoreData = this.defaultSettings
    // 首先从 browser.storage 获取配置
    browser.storage.local.get(Config.settingStoreName).then((result) => {
      if (result[Config.settingStoreName]) {
        restoreData = result[Config.settingStoreName] as XzSetting
      }

      // 有些设置项的 key 是 PageName（页面类型）。当有新的页面类型之后，我会添加新的页面类型的配置，但旧的设置里缺少这些配置，所以需要添加到旧的设置里
      const keys = ['crawlNumber', 'nameRuleForEachPageType'] as const
      for (const key of keys) {
        for (const [pageTypeNo, cfg] of Object.entries(
          this.defaultSettings[key]
        ) as unknown as PageEntry[]) {
          if (restoreData[key][pageTypeNo] === undefined) {
            restoreData[key][pageTypeNo] = cfg
          }
        }
      }

      this.assignSettings(restoreData)
      EVT.fire('settingInitialized')
    })
  }

  private store = Utils.debounce(() => {
    // browser.storage.local 的储存上限是 5 MiB（5242880 Byte）
    browser.storage.local.set({
      [Config.settingStoreName]: this.settings,
    })
  }, 50)

  // 接收整个设置项，通过循环将其更新到 settings 上
  // 循环设置而不是整个替换的原因：
  // 1. 进行类型转换，如某些设置项是 number，但是数据来源里是 string，setSetting 可以把它们转换到正确的类型
  // 2. 某些选项在旧版本里没有，所以不能用旧的设置覆盖新的设置
  private assignSettings(data: XzSetting) {
    const origin = Utils.deepCopy(data)
    for (const [key, value] of Object.entries(origin)) {
      this.setSetting(key as SettingKeys, value)
    }
  }

  private exportSettings() {
    const blob = Utils.json2Blob(this.settings)
    const url = URL.createObjectURL(blob)
    Utils.downloadFile(url, Config.appName + ` Settings.json`)
    URL.revokeObjectURL(url)
    toast.success(lang.transl('_导出成功'))
  }

  private async importSettings() {
    const loadedJSON = (await Utils.loadJSONFile().catch((err) => {
      return msgBox.error(err)
    })) as XzSetting
    if (!loadedJSON) {
      return
    }
    // 检查是否存在设置里的属性
    if (loadedJSON.downloadThread === undefined) {
      return msgBox.error(lang.transl('_格式错误'))
    }
    // 开始恢复导入的设置
    this.reset(loadedJSON)
    toast.success(lang.transl('_导入成功'))
  }

  // 有些帮助信息是只显示一次的，这里可以让它们再次显示
  // 主要是通过 showOneTimeMsg.show 显示的帮助
  private resetHelpTip() {
    this.setSetting('tipHowToUse', true)
    this.setSetting('tipAltXToShowControlPanel', true)
    this.setSetting('tipPreviewWork', true)
    this.setSetting('tipHotkeysViewLargeImage', true)
    this.setSetting('tipAltSToSelectWork', true)
    this.setSetting('tipImageViewer', true)
    this.setSetting('tipAltQToQuickDownload', true)
    this.setSetting('tipBookmarkButton', true)
    this.setSetting('tipBookmarkManage', true)
    this.setSetting('tipOpenWikiLink', true)
    this.setSetting('tipCloseAskFileSaveLocationOnce', true)
    this.setSetting('tipCloseAskFileSaveLocation', true)
    this.setSetting('tipCopyWorkInfoButton', true)

    toast.success(lang.transl('_重新显示帮助'))
  }

  // 重置设置 或者 导入设置
  // 可选参数：传递一份设置数据，用于从配置文件导入，恢复设置
  private reset(data?: XzSetting) {
    this.assignSettings(data ? data : this.defaultSettings)
    EVT.fire('resetSettingsEnd')
  }

  // 更改设置项
  // 其他模块应该通过这个方法更改设置
  // 这里面有一些类型转换的代码，主要目的：
  // 1. 兼容旧版本的设置。读取旧版本的设置时，将其转换成新版本的设置。例如某个设置在旧版本里是 string 类型，值为 'a,b,c'。新版本里是 string[] 类型，这里会自动将其转换成 ['a','b','c']
  // 2. 减少额外操作。例如某个设置的类型为 string[]，其他模块可以传入 string 类型的值如 'a,b,c'，而不必先把它转换成 string[]
  public setSetting(key: SettingKeys, value: SettingValue) {
    if (!this.allSettingKeys.includes(key)) {
      return
    }

    const keyType = typeof this.defaultSettings[key]
    const valueType = typeof value

    // 把旧的设置值转换为新的设置值。需要转换的值都是 string 类型
    if (valueType === 'string') {
      value = convertOldSettings.convert(key, value as string)
    }

    // 将传入的值转换成选项对应的类型
    if (keyType === 'string' && valueType !== 'string') {
      value = value.toString()
    }

    if (keyType === 'number' && valueType !== 'number') {
      // 时间是需要特殊处理的 number 类型
      if (key === 'postDateStart' || key == 'postDateEnd') {
        if (valueType === 'string') {
          if (value === '') {
            // 如果日期是空字符串，则替换为默认值
            value = this.defaultSettings[key]
          } else {
            // 把日期字符串转换成时间戳
            const date = new Date(value as string)
            if (isNaN(date.getTime())) {
              const msg = lang.transl('_日期和时间的值不正确') + ' ' + key
              return msgBox.error(msg)
            }
            value = date.getTime()
          }
        }
      } else {
        // 处理普通的 number 类型
        if (this.floatNumberKey.includes(key)) {
          value = Number.parseFloat(value as any)
        } else {
          value = Number.parseInt(value as any)
        }
      }

      if (isNaN(value as number)) {
        const msg = lang.transl('_设置的值不正确需要是数字') + ' ' + key
        return msgBox.error(msg)
      }
    }

    if (keyType === 'boolean' && valueType !== 'boolean') {
      value = !!value
    }

    // 处理数组类型的值
    if (Array.isArray(this.defaultSettings[key])) {
      if (this.stringArrayKeys.includes(key)) {
        // 把字符串转换成 string[]
        if (valueType === 'string') {
          value = Utils.string2array(value as string)
        }
      }

      // 因为目前 numberArrayKeys 没有任何项，所以这部分代码先注释掉，否则会导致 TS 类型错误
      // if (this.numberArrayKeys.includes(key)) {
      //   // 把数组转换成 number[]
      //   if (Array.isArray(value)) {
      //     value = (value as any[]).map((val: string | number) => {
      //       if (typeof val !== 'number') {
      //         return Number(val)
      //       } else {
      //         return val
      //       }
      //     })
      //   } else {
      //     return
      //   }
      // }
    }

    // 对于一些不合法的值，重置为默认值
    if (key === 'slowCrawlDealy' && (value as number) < 1000) {
      value = 1000
    }

    if (key === 'downloadInterval' && (value as number) < 0) {
      value = 0
    }

    if (key === 'downloadInterval' && (value as number) > 3600) {
      value = 3600
    }

    if (key === 'downloadIntervalOnWorksNumber' && (value as number) < 0) {
      value = 0
    }

    if (key === 'onlyCrawlFirstFewImagesCount' && (value as number) < 1) {
      value = this.defaultSettings[key]
    }

    if (key === 'fullNameLengthLimit') {
      // 考虑到 id 的长度已经达到了十几位，所以不允许设置小于 20 的值
      if ((value as number) < 20) {
        value = this.defaultSettings[key]
      }
      // 虽然理论上限是 256 个字符，但是盘符、路径符号、以及浏览器下载目录都会占据长度，所以实际上限制在 250
      if ((value as number) > 250) {
        value = 250
      }
    }

    if (
      key === 'onlyCrawlFirstFewImagesCount' ||
      key === 'onlyCrawlLastFewImagesCount' ||
      key === 'doNotCrawlFirstImagesCount' ||
      key === 'doNotCrawlLastImagesCount'
    ) {
      if ((value as number) < 1 || isNaN(value as number)) {
        value = 1
      }
    }

    if (key === 'previewResultLimit' && (value as number) < 0) {
      value = 999999
    }

    if (key === 'borderWidth' && (value as number) < 1) {
      value = this.defaultSettings[key]
    }

    if (key === 'setWidthAndOr' && value === '') {
      value = this.defaultSettings[key]
    }

    if (key === 'workDirNameRule') {
      value = (value as string).replace('{id}', '{id_num}')
    }

    if (key === 'borderColor') {
      if (value === '' || (value as string).startsWith('#') === false) {
        value = this.defaultSettings[key]
      }
    }

    // namingRuleList 之前默认是空数组，后来默认包含了默认的命名规则，所以这里做个兼容处理
    if (key === 'namingRuleList' && (value as string[]).length === 0) {
      value = [Config.defaultNameRule]
    }

    // 更改设置
    ;(this.settings[key] as any) = value

    // 当修改某些设置时，顺便修改依赖它的设置
    if (key === 'widthTag') {
      this.settings.widthTagBoolean = value === 'yes'
    }
    if (key === 'restrict') {
      this.settings.restrictBoolean = value === 'yes'
    }

    if (key === 'ratio') {
      this.settings.userSetChecked = value === 'userSet'
    }

    // 触发设置变化的事件
    EVT.fire('settingChange', { name: key, value: value })
  }
}

const self = new Settings()
const settings = self.settings
const setSetting = self.setSetting.bind(self)

export { settings, setSetting, SettingKeys }
