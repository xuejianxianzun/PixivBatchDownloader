import { EVT } from '../EVT'
import { form } from './Form'

// 保存设置表单的所有设置项，并且在下载器初始化时恢复这些设置的值
// 例外情况：个数/页数设置（setWantPage）只保存，不恢复。这是因为下载器在初始化时，由 InitXXXPage 类直接设置 setWantPage，而不是使用保存的值进行恢复。

// 成员 settings 保存着当前页面的所有设置项；当设置项变化时，settings 响应变化并保存到 localStorage 里。
// 注意：如果打开了多个标签页，每个页面都有各自的 settings 成员。它们是互相独立的，不会互相影响。
// 但是 localStorage 里的数据只有一份：最后一个设置变更是在哪个页面发生的，就把哪个页面的 settings 保存到 localStorage 里。所以恢复设置时，恢复的也是这个页面的设置。

interface XzSetting {
  setWantPage: string
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
  setWidthAndOr: '&' | '|'
  setWidth: string
  setHeight: string
  ratioSwitch: boolean
  ratio: '1' | '2' | '3'
  userRatio: string
  idRangeSwitch: boolean
  idRangeInput: string
  idRange: '1' | '2'
  needTagSwitch: boolean
  notNeedTagSwitch: boolean
  quickBookmarks: boolean
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
}

interface SettingChangeData {
  name: keyof XzSetting
  value: string | number | boolean
}

class SaveSettings {
  constructor() {
    this.ListenOptionChange()

    this.handleChange()

    this.restoreOption()
  }

  // 本地存储中使用的 name
  private readonly storeName = 'xzSetting'

  // 需要持久化保存的设置的默认值
  private readonly optionDefault: XzSetting = {
    setWantPage: '-1',
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
    alwaysFolder: true,
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
    quickBookmarks: true,
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
  }

  // 需要持久化保存的设置
  public settings: XzSetting = this.optionDefault

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
  private ListenOptionChange() {
    // 保存页数/个数设置
    this.saveTextInput('setWantPage')

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

    // 保存启用快速收藏
    this.saveCheckBox('quickBookmarks')

    // 保存宽高条件
    this.saveCheckBox('setWHSwitch')
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

    window.addEventListener(EVT.events.resetOption, () => {
      form.reset()
      this.reset()
    })
  }

  private emitChange(name: string, value: string | number | boolean) {
    EVT.fire(EVT.events.settingChange, { name: name, value: value })
  }

  // 设置发生改变时，保存设置到本地存储
  private handleChange() {
    window.addEventListener(
      EVT.events.settingChange,
      (event: CustomEventInit) => {
        const data = event.detail.data as SettingChangeData
        if (Reflect.has(this.optionDefault, data.name)) {
          if ((this.settings[data.name] as any) !== data.value) {
            ; (this.settings[data.name] as any) = data.value
            localStorage.setItem(this.storeName, JSON.stringify(this.settings))
          }
        }
      }
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

  // 读取持久化数据，或使用默认设置，恢复设置表单的设置项
  private restoreOption() {
    const savedOption = localStorage.getItem(this.storeName)
    // 读取保存的设置
    if (savedOption) {
      this.settings = JSON.parse(savedOption)
    } else {
      // 如果没有保存过，则不做处理
      return
    }

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

    // 设置启用快速收藏
    this.restoreBoolean('quickBookmarks')

    // 设置宽高条件
    this.restoreBoolean('setWHSwitch')
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

    // 恢复完毕之后触发一次设置改变事件
    EVT.fire(EVT.events.settingChange)
  }

  // 重设选项
  private reset() {
    // 将保存的选项恢复为默认值
    this.settings = this.optionDefault
    // 覆写本地存储里的设置为默认值
    localStorage.setItem(this.storeName, JSON.stringify(this.settings))
    // 重设选项
    this.restoreOption()
    // 触发设置改变事件
    EVT.fire(EVT.events.settingChange)
  }
}

const saveSettings = new SaveSettings()
const settings = saveSettings.settings
export { settings }