// xzTip 的参数
export interface XzTipArg {
  type: number
  x: number
  y: number
}

// 表单
export interface XzForm extends HTMLFormElement {
  setWantPage: HTMLInputElement
  multipleImageWorks: RadioNodeList
  firstFewImages: HTMLInputElement
  setWorkType0: HTMLInputElement
  setWorkType1: HTMLInputElement
  setWorkType2: HTMLInputElement
  ugoiraSaveAs: RadioNodeList
  setFavNum: HTMLInputElement
  setOnlyBmk: HTMLInputElement
  setWidth: HTMLInputElement
  setWidthAndOr: RadioNodeList
  setHeight: HTMLInputElement
  ratio: RadioNodeList
  userRatio: HTMLInputElement
  needTag: HTMLInputElement
  notNeedTag: HTMLInputElement
  quietDownload: HTMLInputElement
  downloadThread: HTMLInputElement
  userSetName: HTMLInputElement
  pageInfoSelect: HTMLSelectElement
  fileNameSelect: HTMLSelectElement
  tagNameToFileName: HTMLInputElement
  alwaysFolder: HTMLInputElement
  debut: HTMLInputElement
}
