// settings 保存了下载器的所有设置项
// 每当修改了 settings 的值，都要触发 EVT.list.settingChange 事件，让其他模块可以监听到变化
// 如果修改的是整个 settings，settingChange 事件没有参数
// 如果修改的是某一个属性的值，settingChange 事件参数应该传递这个属性的数据 {name:string, value:any}

// 如果打开了多个标签页，每个页面的 settings 数据是互相独立的。但是 localStorage 里的数据只有一份：最后一个设置变更是在哪个页面发生的，就把哪个页面的 settings 保存到 localStorage 里。所以恢复设置时，恢复的也是这个页面的设置。

import { EVT } from '../EVT'
import { DOM } from '../DOM'

interface XzSetting {
  setWantPage: string
  wantPageArr: string[]
  firstFewImagesSwitch: boolean
  firstFewImages: string
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
  convertUgoiraThread: string
  needTagSwitch: boolean
  notNeedTagSwitch: boolean
  needTag: string
  notNeedTag: string
  quietDownload: boolean
  downloadThread: string
  userSetName: string
  namingRuleList: string[]
  tagNameToFileName: boolean
  alwaysFolder: boolean
  multipleImageDir: boolean
  multipleImageFolderName: '1' | '2'
  showOptions: boolean
  postDate: boolean
  postDateStart: string
  postDateEnd: string
  previewResult: boolean
  BMKNumSwitch: boolean
  BMKNumMin: string
  BMKNumMax: string
  BMKNumAverageSwitch: boolean
  BMKNumAverage: string
  setWHSwitch: boolean
  widthHeightLimit: '>=' | '=' | '<='
  setWidthAndOr: '&' | '|'
  setWidth: string
  setHeight: string
  ratioSwitch: boolean
  ratio: '1' | '2' | '3'
  userRatio: string
  idRangeSwitch: boolean
  idRangeInput: string
  idRange: '1' | '2'
  noSerialNo: boolean
  filterBlackWhite: boolean
  sizeSwitch: boolean
  sizeMin: string
  sizeMax: string
  novelSaveAs: 'txt' | 'epub'
  saveNovelMeta: boolean
  deduplication: boolean
  dupliStrategy: 'strict' | 'loose'
  fileNameLengthLimitSwitch: boolean
  fileNameLengthLimit: string
  imageSize: 'original' | 'regular' | 'small'
  dateFormat: string
  userSetLang: '-1' | '0' | '1' | '2' | '3'
  bmkAfterDL: boolean
  widthTag: '1' | '-1'
  restrict: '-1' | '1'
  userBlockList: boolean
  blockList: string
  needTagMode: 'all' | 'one'
  theme: 'auto' | 'white' | 'dark'
}

class Settings {
  constructor() {
    // 第一时间恢复用户设置
    this.restoreSettings()

    this.bindEvents()
  }

  private storeName = 'xzSetting'

  // 默认设置
  private readonly defaultSettings: XzSetting = {
    setWantPage: '-1',
    wantPageArr: [
      '-1',
      '-1',
      '-1',
      '-1',
      '-1',
      '1000',
      '-1',
      '500',
      '-1',
      '1000',
      '100',
      '-1',
      '100',
      '-1',
      '-1',
      '1000',
      '100',
      '100',
      '100',
      '100',
      '-1',
    ],
    firstFewImagesSwitch: false,
    firstFewImages: '1',
    downType0: true,
    downType1: true,
    downType2: true,
    downType3: true,
    downSingleImg: true,
    downMultiImg: true,
    downColorImg: true,
    downBlackWhiteImg: true,
    downNotBookmarked: true,
    downBookmarked: true,
    ugoiraSaveAs: 'webm',
    convertUgoiraThread: '1',
    needTag: '',
    notNeedTag: '',
    quietDownload: true,
    downloadThread: '5',
    userSetName: '{id}',
    namingRuleList: [],
    tagNameToFileName: false,
    alwaysFolder: false,
    multipleImageDir: false,
    multipleImageFolderName: '1',
    showOptions: true,
    postDate: false,
    postDateStart: '',
    postDateEnd: '',
    previewResult: true,
    BMKNumSwitch: false,
    BMKNumMin: '0',
    BMKNumMax: '999999',
    BMKNumAverageSwitch: false,
    BMKNumAverage: '600',
    setWHSwitch: false,
    widthHeightLimit: '>=',
    setWidthAndOr: '&',
    setWidth: '0',
    setHeight: '0',
    ratioSwitch: false,
    ratio: '1',
    userRatio: '1.4',
    idRangeSwitch: false,
    idRangeInput: '0',
    idRange: '1',
    needTagSwitch: false,
    notNeedTagSwitch: false,
    noSerialNo: false,
    filterBlackWhite: false,
    sizeSwitch: false,
    sizeMin: '0',
    sizeMax: '100',
    novelSaveAs: 'txt',
    saveNovelMeta: false,
    deduplication: false,
    dupliStrategy: 'loose',
    fileNameLengthLimitSwitch: false,
    fileNameLengthLimit: '200',
    imageSize: 'original',
    dateFormat: 'YYYY-MM-DD',
    userSetLang: '-1',
    bmkAfterDL: false,
    widthTag: '1',
    restrict: '-1',
    userBlockList: false,
    blockList: '',
    theme: 'auto',
    needTagMode: 'all',
  }

  // 深拷贝一份设置，作为实际使用的设置
  public settings: XzSetting = Object.assign({}, this.defaultSettings)

  private bindEvents() {
    // 当设置发生变化时进行本地存储
    window.addEventListener(EVT.list.settingChange, () => {
      localStorage.setItem(this.storeName, JSON.stringify(this.settings))
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
  }

  // 读取保存的设置，合并到当前设置上
  private restoreSettings() {
    const savedSettings = localStorage.getItem(this.storeName)
    if (savedSettings) {
      // 使用 assign 合并设置，而不是直接覆盖 settings
      // 这样如果新版本多了某个设置项，旧版本（本地存储里）没有，这个选项就会使用新版本里的默认值。
      Object.assign(this.settings, JSON.parse(savedSettings))
      // 这里 settings 的改变不需要触发 settingChange 事件，因为这个模块是最早执行的，其他模块尚未执行
    }
  }

  private exportSettings() {
    const str = JSON.stringify(settings, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    DOM.downloadFile(url, `pixiv_batch_downloader-settings.json`)
  }

  private async importSettings() {
    const loadedJSON = (await DOM.loadJSONFile().catch((err) => {
      return EVT.sendMsg({
        type: 'error',
        msg: err,
      })
    })) as XzSetting
    if (!loadedJSON) {
      return
    }
    // 检查是否存在设置里的属性
    if (loadedJSON.downloadThread === undefined) {
      return EVT.sendMsg({
        type: 'error',
        msg: 'Format error!',
      })
    }
    // 开始恢复导入的设置
    this.reset(loadedJSON)
  }

  // 重设选项
  // 可选参数：传递整个设置的数据，用于从配置文件导入，恢复设置
  private reset(data?: XzSetting) {
    if (data) {
      Object.assign(settings, data)
    } else {
      // 将选项恢复为默认值
      Object.assign(settings, this.defaultSettings)
    }
    // 触发设置改变事件
    EVT.fire(EVT.list.settingChange)
    EVT.fire(EVT.list.resetSettingsEnd)
  }
}

const settings = new Settings().settings

export { settings, XzSetting }
