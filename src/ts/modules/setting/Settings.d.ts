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

declare global {
  interface Window { xzSettings: XzSetting }
}
