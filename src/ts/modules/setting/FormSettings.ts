import { EVT } from '../EVT'
import { pageType } from '../PageType'
import { settings, XzSetting } from './Settings'
import { SettingsForm } from './Form.d'

// 管理 from 表单里的选项（类型为 input 元素的选项），从 settings 里设置选项的值；当选项改变时保存到 settings 里
// 不属于 input 类型的选项，不在这里处理。

// 补充说明：
// 选项 setWantPage 并不需要实际上进行保存和恢复。保存和恢复时使用的是 wantPageArr

class FormSettings {
  constructor(form: SettingsForm) {
    this.form = form
    this.bindEvents()

    this.ListenChange()

    this.restoreFormSettings()
  }

  private form!: SettingsForm

  private bindEvents() {
    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      this.restoreWantPage()
    })

    window.addEventListener(EVT.list.resetSettingsEnd, () => {
      this.restoreFormSettings()
    })
  }

  // 处理输入框： change 时保存 value
  private saveTextInput(name: keyof XzSetting) {
    const el = this.form[name] as HTMLInputElement
    el.addEventListener('change', () => {
      this.emitChange(name, el.value)
    })
  }

  // 处理复选框： click 时保存 checked
  private saveCheckBox(name: keyof XzSetting) {
    const el = this.form[name] as HTMLInputElement
    el.addEventListener('click', () => {
      this.emitChange(name, el.checked)
    })
  }

  // 处理单选框： click 时保存 value
  private saveRadio(name: keyof XzSetting) {
    const radios = this.form[name]
    for (const radio of radios) {
      radio.addEventListener('click', () => {
        this.emitChange(name, radio.value)
      })
    }
  }

  // 监听所有选项的变化，触发 settingChange 事件
  // 该函数可执行一次，否则事件会重复绑定
  private ListenChange() {
    // 保存页数/个数设置
    this.saveTextInput('setWantPage')

    // 保存 wantPageArr
    this.form.setWantPage.addEventListener('change', () => {
      const temp = Array.from(settings.wantPageArr)
      temp[pageType.type] = this.form.setWantPage.value
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
    this.saveCheckBox('downNotBookmarked')
    this.saveCheckBox('downBookmarked')

    // 保存多图作品设置
    this.saveCheckBox('firstFewImagesSwitch')
    this.saveTextInput('firstFewImages')

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
    const userSetNameInput = this.form.userSetName
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

    this.saveRadio('theme')
  }

  // 表单里的设置发生改变时，调用这个方法，传递选项名和值
  private emitChange(
    name: keyof XzSetting,
    value: string | number | boolean | string[],
  ) {
    ;(settings[name] as any) = value
    EVT.fire(EVT.list.settingChange, { name: name, value: value })
  }

  // 恢复值为 Boolean 的设置项
  // input[type='checkbox'] 使用
  private restoreBoolean(name: keyof XzSetting) {
    if (settings[name] !== undefined) {
      this.form[name].checked = settings[name]
    }
  }

  // 恢复值为 string 的设置项
  // input[type='radio'] 和 input[type='text'] 使用
  private restoreString(name: keyof XzSetting) {
    if (settings[name] !== undefined) {
      this.form[name].value = settings[name].toString()
    }
  }

  // 设置当前页面类型的 setWantPage
  private restoreWantPage() {
    const want = settings.wantPageArr[pageType.type]
    if (want !== '' && want !== undefined) {
      this.form.setWantPage.value = want
      settings.setWantPage = want
    }
  }

  // 读取设置，恢复表单里的设置项
  private restoreFormSettings() {
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
    this.restoreBoolean('downNotBookmarked')
    this.restoreBoolean('downBookmarked')

    // 多图下载前几张图作品设置
    this.restoreBoolean('firstFewImagesSwitch')
    this.restoreString('firstFewImages')

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

    this.restoreString('theme')
  }
}

export { FormSettings }
