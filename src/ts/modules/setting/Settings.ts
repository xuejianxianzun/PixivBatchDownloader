// 保存设置表单的所有设置项
// 这里定义的 settings 只是初始的默认值，后续 SaveSettings 模块会读取用户储存的设置，修改 settings
// 每当修改了 settings 的值，都要触发 EVT.list.settingChange 事件，让其他模块可以监听到变化
// 如果修改的是整个 settings，settingChange 事件没有参数
// 如果修改的是某一个属性的值，settingChange 事件参数应该传递这个属性的数据 {name:string, value:any}

export interface XzSetting {
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
  setOnlyBmk: boolean
  ugoiraSaveAs: 'webm' | 'gif' | 'zip' | 'png'
  convertUgoiraThread: string
  needTagSwitch: boolean
  notNeedTagSwitch: boolean
  needTag: string
  notNeedTag: string
  quietDownload: boolean
  downloadThread: string
  userSetName: string
  namingRuleList:string[]
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

const settings: XzSetting = {
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
  setOnlyBmk: false,
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


export { settings }