// settings 保存了下载器的所有设置项

// 获取设置项的值：
// settings[name]

// 修改设置项的值：
// setSetting(name, value)

// 本模块会触发 3 个事件：

// EVT.list.settingChange
// 当任意一个设置项被赋值时触发（不会区分值是否发生了变化）。这是最常用的事件。
// 事件的参数里会传递这个设置项的名称和值，可以通过 ev.detail.data 获取，格式如：
// {name: string, value: any}
// 如果某个模块要监听特定的设置项，应该使用参数的 name 来判断触发事件的设置项是否是自己需要的设置项
// 如果不依赖于特定设置项，则应该考虑使用节流或者防抖来限制事件的回调函数的执行频率，防止造成性能问题

// EVT.list.settingInitialized
// 当设置初始化完毕（以及恢复本地储存的设置）之后触发。这个事件在生命周期里只会触发一次。
// 过程中，每个设置项都会触发一次 settingChange 事件

// EVT.list.resetSettingsEnd
// 重置设置之后触发
// 导入设置之后触发
// 过程中，每个设置项都会触发一次 settingChange 事件

// 如果打开了多个标签页，每个页面的 settings 数据是相互独立的，在一个页面里修改设置不会影响另一个页面里的设置。
// 但是持久化保存的数据只有一份：最后一次的设置变化是在哪个页面发生的，就保存哪个页面的 settings 数据。
// 所以当页面刷新时，或者打开新的页面时，会加载设置最后一次发生变化的页面里的 settings 数据

import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { convertOldSettings } from './ConvertOldSettings'
import { msgBox } from '../MsgBox'
import { Config } from '../Config'
import { secretSignal } from '../utils/SecretSignal'
import { toast } from '../Toast'
import { lang } from '../Lang'

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

export interface SettingChangeData {
  name: SettingKeys
  value: SettingValue
}

interface XzSetting {
  setWantPage: number
  wantPageArr: number[]
  firstFewImagesSwitch: boolean
  firstFewImages: number
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
  ugoiraSaveAs: 'webm' | 'gif' | 'zip' | 'png'
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
  idRangeInput: number
  idRange: '>' | '<'
  noSerialNo: boolean
  filterBlackWhite: boolean
  sizeSwitch: boolean
  sizeMin: number
  sizeMax: number
  novelSaveAs: 'txt' | 'epub'
  saveNovelMeta: boolean
  deduplication: boolean
  dupliStrategy: 'strict' | 'loose'
  fileNameLengthLimitSwitch: boolean
  tagsSeparator: ',' | '#' | '^' | '&' | '_'
  fileNameLengthLimit: number
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
  /** 为每个页面类型设置不同的命名规则的开关 */
  setNameRuleForEachPageType: boolean
  /** 每个页面类型所使用的命名规则 */
  // 这里应该使用 Map 结构，但是 JSON.stringify 不能处理 Map 类型，所以简化成了 Object
  nameRuleForEachPageType: {
    [key: number]: string
  }
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
  noSerialNoForSingleImg: boolean
  noSerialNoForMultiImg: boolean
  setUserNameShow: boolean
  setUserNameList: {
    [uid: string]: string
  }
  removeAtFromUsername: boolean
  showLargerThumbnails: boolean
  wheelScrollSwitchImageOnPreviewWork: boolean
  swicthImageByKeyboard: boolean
  /**不抓取多图作品的最后一张图片 */
  doNotDownloadLastImageOfMultiImageWork: boolean
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
  tipCSV: boolean
  exportIDList: boolean
  tipExportFollowingUserList: boolean
  displayThumbnailListOnMultiImageWorkPage: boolean
  tipBookmarkManage: boolean
  requestSponsorshipTime: number
  PreviewWorkDetailInfo: boolean
  PreviewDetailInfoWidth: number
  removeWorksOfFollowedUsersOnSearchPage: boolean
  tipExportAndImportBookmark: boolean
  saveWorkDescription: boolean
  saveEachDescription: boolean
  summarizeDescription: boolean
  slowCrawlDealy: number
  /**设置下载一个文件后，需要等待多久才能开始下一次下载。值为 0 - 3600 秒，允许小数 */
  downloadInterval: number
  downloadIntervalOnWorksNumber: number
}
// chrome storage 里不能使用 Map，因为保存时，Map 会被转换为 Object {}

type SettingKeys = keyof XzSetting

class Settings {
  constructor() {
    this.restore()
    this.bindEvents()
  }

  // 默认设置
  private readonly defaultSettings: XzSetting = {
    setWantPage: -1,
    wantPageArr: [
      -1, -1, -1, -1, -1, 1000, -1, 500, -1, 1000, 100, -1, 100, -1, -1, 1000,
      100, 100, 100, 100, -1,
    ],
    firstFewImagesSwitch: false,
    firstFewImages: 1,
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
    downloadThread: 5,
    userSetName: '{page_title}/{id}',
    namingRuleList: [],
    workDir: false,
    workDirFileNumber: 1,
    workDirNameRule: '{id_num}',
    showOptions: true,
    postDate: false,
    postDateStart: 946684800000,
    postDateEnd: 4102444800000,
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
    idRangeInput: 0,
    idRange: '>',
    needTagSwitch: false,
    notNeedTagSwitch: false,
    noSerialNo: false,
    filterBlackWhite: false,
    sizeSwitch: false,
    sizeMin: 0,
    sizeMax: 100,
    novelSaveAs: 'txt',
    saveNovelMeta: false,
    deduplication: false,
    dupliStrategy: 'loose',
    fileNameLengthLimitSwitch: false,
    tagsSeparator: ',',
    fileNameLengthLimit: 200,
    imageSize: 'original',
    dateFormat: 'YYYY-MM-DD',
    userSetLang: 'auto',
    bmkAfterDL: false,
    widthTag: 'yes',
    restrict: 'no',
    widthTagBoolean: true,
    restrictBoolean: false,
    userBlockList: true,
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
    setNameRuleForEachPageType: false,
    nameRuleForEachPageType: {
      '-1': '{page_title}/{id}',
      '0': '{page_title}/{id}',
      '1': '{page_title}/{id}',
      '2': '{user}/{id}',
      '3': '{page_title}/{id}',
      '4': '{page_title}/{id}',
      '5': '{page_tag}/{id}',
      '6': '{page_title}/{id}',
      '7': '{page_title}/{rank}-{id}',
      '8': '{page_title}/{id}',
      '9': '{page_title}/{id}',
      '10': '{page_title}/{id}',
      '11': '{page_title}/{id}',
      '12': '{page_title}/{id}',
      '13': '{page_title}/{id}-{title}',
      '14': '{user}/{series_title}/{series_order} {title} {id}',
      '15': '{page_tag}/{id}-{title}',
      '16': '{page_title}/{rank}-{id}-{title}',
      '17': '{page_title}/{id}-{title}',
      '18': '{page_title}/{id}-{title}',
      '19': '{user}/{series_title}/{series_order} {title} {id}',
      '20': '{page_title}/{id}',
      '21': '{page_title}/{id}-{title}',
    },
    showAdvancedSettings: false,
    showNotificationAfterDownloadComplete: false,
    boldKeywords: true,
    autoExportResult: false,
    autoExportResultCSV: true,
    autoExportResultJSON: false,
    autoExportResultNumber: 1,
    PreviewWork: true,
    showDownloadBtnOnThumb: true,
    prevWorkSize: 'regular',
    previewWorkWait: 400,
    showPreviewWorkTip: true,
    showOriginImage: true,
    showOriginImageSize: 'original',
    tipHowToUse: true,
    whatIsNewFlag: 'xuejian&saber',
    replaceSquareThumb: true,
    notFolderWhenOneFile: false,
    noSerialNoForSingleImg: true,
    noSerialNoForMultiImg: true,
    setUserNameShow: true,
    setUserNameList: {},
    removeAtFromUsername: false,
    showLargerThumbnails: false,
    wheelScrollSwitchImageOnPreviewWork: true,
    swicthImageByKeyboard: true,
    doNotDownloadLastImageOfMultiImageWork: false,
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
    tipCSV: true,
    exportIDList: false,
    tipExportFollowingUserList: true,
    displayThumbnailListOnMultiImageWorkPage: true,
    tipBookmarkManage: true,
    requestSponsorshipTime: 0,
    PreviewWorkDetailInfo: false,
    PreviewDetailInfoWidth: 400,
    removeWorksOfFollowedUsersOnSearchPage: false,
    tipExportAndImportBookmark: true,
    saveWorkDescription: false,
    saveEachDescription: false,
    summarizeDescription: false,
    slowCrawlDealy: 1600,
    downloadInterval: 0,
    downloadIntervalOnWorksNumber: 120,
  }

  private allSettingKeys = Object.keys(this.defaultSettings)

  // 值为浮点数的选项
  private floatNumberKey = [
    'userRatio',
    'sizeMin',
    'sizeMax',
    'downloadInterval',
  ]

  // 值为整数的选项不必单独列出

  // 值为数字数组的选项
  private numberArrayKeys = ['wantPageArr']

  // 值为字符串数组的选项
  private stringArrayKeys = [
    'namingRuleList',
    'blockList',
    'needTag',
    'notNeedTag',
    'createFolderTagList',
    'exportLogExclude',
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
        // 如果只有动图被选中，则选择全部作品类型
        // 反之，只选择动图
        if (
          this.settings.downType2 &&
          !this.settings.downType0 &&
          !this.settings.downType1 &&
          !this.settings.downType3
        ) {
          this.settings.downType0 = true
          this.settings.downType1 = true
          this.settings.downType3 = true
          // 多次修改只触发一次改变事件，提高效率
          this.setSetting('downType0', true)
          toast.warning('onlyUgoira off')
        } else {
          this.settings.downType0 = false
          this.settings.downType1 = false
          this.settings.downType2 = true
          this.settings.downType3 = false
          this.setSetting('downType2', true)
          toast.success('onlyUgoira on')
        }
      })
    }
  }

  // 读取恢复设置
  private restore() {
    let restoreData = this.defaultSettings
    // 首先从 chrome.storage 获取配置（从 11.5.0 版本开始）
    chrome.storage.local.get(Config.settingStoreName, (result) => {
      if (result[Config.settingStoreName]) {
        restoreData = result[Config.settingStoreName]
      } else {
        // 如无数据则尝试从 localStorage 获取配置，因为旧版本的配置储存在 localStorage 中
        const savedSettings = localStorage.getItem(Config.settingStoreName)
        if (savedSettings) {
          restoreData = JSON.parse(savedSettings)
        }
      }
      this.assignSettings(restoreData)
      EVT.fire('settingInitialized')
    })
  }

  private store = Utils.debounce(() => {
    // chrome.storage.local 的储存上限是 5 MiB（5242880 Byte）
    chrome.storage.local.set({
      [Config.settingStoreName]: this.settings,
    })
  }, 50)

  // 接收整个设置项，通过循环将其更新到 settings 上
  // 循环设置而不是整个替换的原因：
  // 1. 进行类型转换，如某些设置项是 number ，但是数据来源里是 string，setSetting 可以把它们转换到正确的类型
  // 2. 某些选项在旧版本里没有，所以不能用旧的设置整个覆盖
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
  // 主要是通过 showHelp.show 显示的帮助
  private resetHelpTip() {
    this.setSetting('tipHowToUse', true)
    this.setSetting('tipAltXToShowControlPanel', true)
    this.setSetting('tipPreviewWork', true)
    this.setSetting('tipHotkeysViewLargeImage', true)
    this.setSetting('tipAltSToSelectWork', true)
    this.setSetting('tipAltQToQuickDownload', true)
    this.setSetting('tipBookmarkButton', true)
    this.setSetting('tipCSV', true)
    this.setSetting('tipExportFollowingUserList', true)
    this.setSetting('tipBookmarkManage', true)
    this.setSetting('tipExportAndImportBookmark', true)

    toast.success('✓ ' + lang.transl('_重新显示帮助'))
  }

  // 重置设置 或者 导入设置
  // 可选参数：传递一份设置数据，用于从配置文件导入，恢复设置
  private reset(data?: XzSetting) {
    this.assignSettings(data ? data : this.defaultSettings)
    EVT.fire('resetSettingsEnd')
  }

  private tipError(key: string) {
    msgBox.error(`${key}: Invalid value`)
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
        return this.tipError(key)
      }
    }

    if (keyType === 'boolean' && valueType !== 'boolean') {
      value = !!value
    }

    // 处理数组类型的值
    if (Array.isArray(this.defaultSettings[key])) {
      if (this.stringArrayKeys.includes(key)) {
        // 字符串转换成 string[]
        if (valueType === 'string') {
          value = Utils.string2array(value as string)
        }
      }

      if (this.numberArrayKeys.includes(key)) {
        // 把数组转换成 number[]
        if (Array.isArray(value)) {
          value = (value as any[]).map((val: string | number) => {
            if (typeof val !== 'number') {
              return Number(val)
            } else {
              return val
            }
          })
        } else {
          return
        }
      }
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

    if (key === 'firstFewImages' && (value as number) < 1) {
      value = this.defaultSettings[key]
    }

    if (key === 'fileNameLengthLimit' && (value as number) < 1) {
      value = this.defaultSettings[key]
    }

    if (key === 'setWidthAndOr' && value === '') {
      value = this.defaultSettings[key]
    }

    if (key === 'previewResultLimit' && (value as number) < 0) {
      value = 999999
    }

    if (key === 'workDirNameRule') {
      value = (value as string).replace('{id}', '{id_num}')
    }

    // 更改设置
    ;(this.settings[key] as any) = value

    // 当修改某些设置时，顺便修改以来它的设置
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
