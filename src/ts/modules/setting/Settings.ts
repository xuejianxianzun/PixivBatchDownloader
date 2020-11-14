import { EVT } from '../EVT'
import { pageType } from '../PageType'
import { form } from './Form'

// 保存设置表单的所有设置项，并且在下载器初始化时恢复这些设置的值

// 成员 settings 保存着当前页面的所有设置项；当设置项变化时，settings 响应变化并保存到 localStorage 里。
// 注意：
// 选项 setWantPage 并不需要实际上进行保存和恢复。保存和恢复时使用的是 wantPageArr
// 如果打开了多个标签页，每个页面都有各自的 settings 成员。它们是互相独立的，不会互相影响。
// 但是 localStorage 里的数据只有一份：最后一个设置变更是在哪个页面发生的，就把哪个页面的 settings 保存到 localStorage 里。所以恢复设置时，恢复的也是这个页面的设置。

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
  userBlockList:boolean
  blockList:string
  needTagMode:'all'|'one'
}

interface SettingChangeData {
  name: keyof XzSetting
  value: string | number | boolean | string[]
}

class Settings {
  constructor() {
    this.ListenChange()

    this.restore()

    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      this.restoreWantPage()
    })
  }

  // 本地存储中使用的 name
  private readonly storeName = 'xzSetting'

  // 需要持久化保存的设置的默认值
  private readonly optionDefault: XzSetting = {
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
    dupliStrategy: 'strict',
    fileNameLengthLimitSwitch: false,
    fileNameLengthLimit: '200',
    imageSize: 'original',
    dateFormat: 'YYYY-MM-DD',
    userSetLang: '-1',
    bmkAfterDL: false,
    widthTag: '1',
    restrict: '-1',
    userBlockList:false,
    blockList:'',
    needTagMode:'all'
  }

  // 需要持久化保存的设置
  public settings: XzSetting = Object.assign({}, this.optionDefault)

  // 处理输入框： change 时保存 value
  private saveTextInput(name: keyof XzSetting) {
    const el = form[name] as HTMLInputElement
    el.addEventListener('change', () => {
      this.emitChange(name, el.value)
    })
  }

  // 处理复选框： click 时保存 checked
  private saveCheckBox(name: keyof XzSetting) {
    const el = form[name] as HTMLInputElement
    el.addEventListener('click', () => {
      this.emitChange(name, el.checked)
    })
  }

  // 处理单选框： click 时保存 value
  private saveRadio(name: string) {
    const radios = form[name]
    for (const radio of radios) {
      radio.addEventListener('click', () => {
        this.emitChange(name, radio.value)
      })
    }
  }

  // 监听所有选项的变化，触发 settingChange 事件
  // 该函数可执行一次，否则事件会重复绑定
  private ListenChange() {
    this.saveChange()

    // 保存页数/个数设置
    this.saveTextInput('setWantPage')

    // 保存 wantPageArr
    form.setWantPage.addEventListener('change', () => {
      const temp = Array.from(this.settings.wantPageArr)
      temp[pageType.type] = form.setWantPage.value
      this.emitChange('wantPageArr', temp)
    })

    // 保存下载的作品类型
    this.saveCheckBox('downType0')
    this.saveCheckBox('downType1')
    this.saveCheckBox('downType2')
    this.saveCheckBox('downType3')
    this.saveCheckBox('downSingleImg')
    this.saveCheckBox('downMultiImg')
    this.saveCheckBox('downColorImg')
    this.saveCheckBox('downBlackWhiteImg')

    // 保存多图作品设置
    this.saveCheckBox('firstFewImagesSwitch')
    this.saveTextInput('firstFewImages')

    // 保存只下载已收藏
    this.saveCheckBox('setOnlyBmk')

    // 保存动图格式选项
    this.saveRadio('ugoiraSaveAs')

    // 保存动图转换线程数
    this.saveTextInput('convertUgoiraThread')

    this.saveRadio('novelSaveAs')

    this.saveCheckBox('saveNovelMeta')

    // 保存收藏数量选项
    this.saveCheckBox('BMKNumSwitch')

    // 保存收藏数量数值
    this.saveTextInput('BMKNumMin')
    this.saveTextInput('BMKNumMax')

    // 保存宽高条件
    this.saveCheckBox('setWHSwitch')
    this.saveRadio('widthHeightLimit')
    this.saveRadio('setWidthAndOr')
    this.saveTextInput('setWidth')
    this.saveTextInput('setHeight')

    // 保存宽高比例
    this.saveCheckBox('ratioSwitch')
    this.saveRadio('ratio')
    this.saveTextInput('userRatio')

    // 保存投稿时间
    this.saveCheckBox('postDate')
    this.saveTextInput('postDateStart')
    this.saveTextInput('postDateEnd')

    // 保存 id 范围
    this.saveCheckBox('idRangeSwitch')
    this.saveTextInput('idRangeInput')
    this.saveRadio('idRange')

    // 保存必须的 tag 设置
    this.saveCheckBox('needTagSwitch')
    this.saveTextInput('needTag')

    // 保存排除的 tag 设置
    this.saveCheckBox('notNeedTagSwitch')
    this.saveTextInput('notNeedTag')

    // 保存命名规则
    const userSetNameInput = form.userSetName
    ;['change', 'focus'].forEach((ev) => {
      userSetNameInput.addEventListener(ev, () => {
        this.emitChange('userSetName', userSetNameInput.value)
      })
    })

    // 保存是否添加标记名称
    this.saveCheckBox('tagNameToFileName')

    // 保存第一张图不带序号
    this.saveCheckBox('noSerialNo')

    // 保存是否始终建立文件夹
    this.saveCheckBox('alwaysFolder')

    // 保存是否为多图作品自动建立文件夹
    this.saveCheckBox('multipleImageDir')

    // 保存多图建立文件夹时的命名规则
    this.saveRadio('multipleImageFolderName')

    // 保存文件体积限制
    this.saveCheckBox('sizeSwitch')
    this.saveTextInput('sizeMin')
    this.saveTextInput('sizeMax')

    // 保存自动下载
    this.saveCheckBox('quietDownload')

    // 保存下载线程
    this.saveTextInput('downloadThread')

    // 保存预览搜索结果
    this.saveCheckBox('previewResult')

    // 保存去重设置
    this.saveCheckBox('deduplication')
    this.saveRadio('dupliStrategy')

    // 保存文件名长度限制
    this.saveCheckBox('fileNameLengthLimitSwitch')
    this.saveTextInput('fileNameLengthLimit')

    this.saveRadio('imageSize')

    this.saveTextInput('dateFormat')

    this.saveRadio('userSetLang')

    this.saveCheckBox('bmkAfterDL')
    this.saveRadio('restrict')

    this.saveRadio('widthTag')

    this.saveCheckBox('userBlockList')
    this.saveTextInput('blockList')

    this.saveRadio('needTagMode')

    window.addEventListener(EVT.list.resetSettings, () => {
      form.reset()
      this.reset()
    })
  }

  private emitChange(
    name: string,
    value: string | number | boolean | string[],
  ) {
    EVT.fire(EVT.list.settingChange, { name: name, value: value })
  }

  // 设置发生改变时，保存设置到本地存储
  private saveChange() {
    window.addEventListener(
      EVT.list.settingChange,
      (event: CustomEventInit) => {
        const data = event.detail.data as SettingChangeData
        if (Reflect.has(this.optionDefault, data.name)) {
          if ((this.settings[data.name] as any) !== data.value) {
            ;(this.settings[data.name] as any) = data.value
            localStorage.setItem(this.storeName, JSON.stringify(this.settings))
          }
        }
      },
    )
  }

  // 恢复值为 Boolean 的设置项
  // 给复选框使用
  private restoreBoolean(name: keyof XzSetting) {
    // 优先使用用户设置的值
    if (this.settings[name] !== undefined) {
      form[name].checked = this.settings[name]
    } else {
      // 否则使用默认值
      form[name].checked = this.optionDefault[name]
    }
    // 这里不能简单的使用 || 符号来处理，考虑如下情况：
    // this.options[name] || this.optionDefault[name]
    // 用户设置为 false，默认值为 true，使用 || 的话就恒为 true 了
  }

  // 恢复值为 string 的设置项
  // 给单选按钮和文本框使用
  private restoreString(name: keyof XzSetting) {
    // 优先使用用户设置的值
    if (this.settings[name] !== undefined) {
      form[name].value = this.settings[name].toString()
    } else {
      // 否则使用默认值
      form[name].value = this.optionDefault[name].toString()
    }
  }

  // 设置当前页面类型的 setWantPage
  private restoreWantPage() {
    const want = this.settings.wantPageArr[pageType.type]
    if (want !== '' && want !== undefined) {
      form.setWantPage.value = want
      this.settings.setWantPage = want
    }
  }

  // 读取持久化数据，或使用默认设置，恢复设置表单的设置项
  private restore() {
    const savedOption = localStorage.getItem(this.storeName)
    // 读取保存的设置
    if (savedOption) {
      // 使用 assign 合并选项，而不是直接覆盖 settings
      // 这样在新版本里可以给默认的 settings 添加新的选项，不会因为旧版本里没有这个选项而导致问题
      Object.assign(this.settings, JSON.parse(savedOption))
    } else {
      return
    }

    this.restoreWantPage()

    // 设置下载的作品类型
    this.restoreBoolean('downType0')
    this.restoreBoolean('downType1')
    this.restoreBoolean('downType2')
    this.restoreBoolean('downType3')
    this.restoreBoolean('downSingleImg')
    this.restoreBoolean('downMultiImg')
    this.restoreBoolean('downColorImg')
    this.restoreBoolean('downBlackWhiteImg')

    // 多图下载前几张图作品设置
    this.restoreBoolean('firstFewImagesSwitch')
    this.restoreString('firstFewImages')

    // 设置只下载已收藏
    this.restoreBoolean('setOnlyBmk')

    // 设置动图格式选项
    this.restoreString('ugoiraSaveAs')

    // 设置动图转换线程数
    this.restoreString('convertUgoiraThread')

    this.restoreString('novelSaveAs')

    this.restoreBoolean('saveNovelMeta')

    // 设置收藏数量选项
    this.restoreBoolean('BMKNumSwitch')

    // 设置收藏数量数值
    this.restoreString('BMKNumMin')
    this.restoreString('BMKNumMax')

    // 设置宽高条件
    this.restoreBoolean('setWHSwitch')
    this.restoreString('widthHeightLimit')
    this.restoreString('setWidthAndOr')
    this.restoreString('setWidth')
    this.restoreString('setHeight')

    // 设置宽高比例
    this.restoreBoolean('ratioSwitch')
    this.restoreString('ratio')
    this.restoreString('userRatio')

    // 设置 id 范围
    this.restoreBoolean('idRangeSwitch')
    this.restoreString('idRangeInput')
    this.restoreString('idRange')

    // 设置必须的 tag
    this.restoreBoolean('needTagSwitch')
    this.restoreString('needTag')

    // 设置排除的 tag
    this.restoreBoolean('notNeedTagSwitch')
    this.restoreString('notNeedTag')

    // 设置投稿时间
    this.restoreBoolean('postDate')
    this.restoreString('postDateStart')
    this.restoreString('postDateEnd')

    // 设置自动下载
    this.restoreBoolean('quietDownload')

    // 设置下载线程
    this.restoreString('downloadThread')

    // 设置文件命名规则
    this.restoreString('userSetName')

    // 设置是否添加标记名称
    this.restoreBoolean('tagNameToFileName')

    // 设置第一张图不带序号
    this.restoreBoolean('noSerialNo')

    // 设置是否始终建立文件夹
    this.restoreBoolean('alwaysFolder')

    // 设置是否为多图作品自动建立文件夹
    this.restoreBoolean('multipleImageDir')

    // 设置多图作品建立文件夹时的文件名规则
    this.restoreString('multipleImageFolderName')

    // 设置预览搜索结果
    this.restoreBoolean('previewResult')

    // 设置文件体积限制
    this.restoreBoolean('sizeSwitch')
    this.restoreString('sizeMin')
    this.restoreString('sizeMax')

    // 恢复去重设置
    this.restoreBoolean('deduplication')
    this.restoreString('dupliStrategy')

    // 恢复文件名长度限制
    this.restoreBoolean('fileNameLengthLimitSwitch')
    this.restoreString('fileNameLengthLimit')

    this.restoreString('imageSize')

    this.restoreString('dateFormat')

    this.restoreString('userSetLang')

    this.restoreBoolean('bmkAfterDL')
    this.restoreString('restrict')

    this.restoreString('widthTag')

    this.restoreBoolean('userBlockList')
    this.restoreString('blockList')

    this.restoreString('needTagMode')

    // 恢复完毕之后触发一次设置改变事件
    EVT.fire(EVT.list.settingChange)
  }

  // 重设选项
  private reset() {
    // 将保存的选项恢复为默认值
    Object.assign(this.settings, this.optionDefault)
    // 覆写本地存储里的设置为默认值
    localStorage.setItem(this.storeName, JSON.stringify(this.settings))
    // 重设选项
    this.restore()
    // 触发设置改变事件
    EVT.fire(EVT.list.settingChange)
  }
}

const self = new Settings()
const settings = self.settings
export { settings }
