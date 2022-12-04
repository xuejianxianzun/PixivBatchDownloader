import { EVT } from '../EVT'
import { pageType } from '../PageType'
import { settings, setSetting, SettingKeys } from './Settings'
import { SettingsForm } from './SettingsForm'
import { DateFormat } from '../utils/DateFormat'
import { nameRuleManager } from './NameRuleManager'

// 管理 from 表单里的输入选项（input 元素和 textarea 元素）
// 从 settings 里恢复选项的值；当选项改变时保存到 settings 里
// 不属于输入选项的设置，不在这里处理

interface InputFileds {
  text: SettingKeys[]
  textarea: SettingKeys[]
  checkbox: SettingKeys[]
  radio: SettingKeys[]
  datetime: SettingKeys[]
}

class FormSettings {
  constructor(form: SettingsForm) {
    this.form = form

    nameRuleManager.registerInput(this.form.userSetName)

    this.bindEvents()

    this.restoreFormSettings()

    this.ListenChange()
  }

  private form!: SettingsForm

  // 没有填写 userSetName 字段，因为这个字段由 nameRuleManager 管理
  private readonly inputFileds: InputFileds = {
    checkbox: [
      'downType0',
      'downType1',
      'downType2',
      'downType3',
      'downAllAges',
      'downR18',
      'downR18G',
      'downSingleImg',
      'downMultiImg',
      'downColorImg',
      'downBlackWhiteImg',
      'downNotBookmarked',
      'downBookmarked',
      'firstFewImagesSwitch',
      'multiImageWorkImageLimitSwitch',
      'saveNovelMeta',
      'BMKNumSwitch',
      'BMKNumAverageSwitch',
      'setWHSwitch',
      'ratioSwitch',
      'postDate',
      'idRangeSwitch',
      'needTagSwitch',
      'notNeedTagSwitch',
      'magnifier',
      'tagNameToFileName',
      'noSerialNo',
      'createFolderByTag',
      'workDir',
      'r18Folder',
      'sizeSwitch',
      'autoStartDownload',
      'previewResult',
      'deduplication',
      'fileNameLengthLimitSwitch',
      'bmkAfterDL',
      'userBlockList',
      'blockTagsForSpecificUser',
      'bgDisplay',
      'createFolderByType',
      'createFolderByTypeIllust',
      'createFolderByTypeManga',
      'createFolderByTypeUgoira',
      'createFolderByTypeNovel',
      'zeroPadding',
      'showFastSearchArea',
      'saveMetaType0',
      'saveMetaType1',
      'saveMetaType2',
      'saveMetaType3',
      'setNameRuleForEachPageType',
      'showAdvancedSettings',
      'showNotificationAfterDownloadComplete',
      'boldKeywords',
      'autoExportResult',
      'autoExportResultCSV',
      'autoExportResultJSON',
      'PreviewWork',
      'showDownloadBtnOnThumb',
      'showOriginImage',
      'replaceSquareThumb',
      'notFolderWhenOneFile',
      'noSerialNoForSingleImg',
      'noSerialNoForMultiImg',
      'removeAtFromUsername',
      'showPreviewWorkTip',
      'showLargerThumbnails',
      'doubleWidthThumb',
      'wheelScrollSwitchImageOnPreviewWork',
      'doNotDownloadLastImageOfMultiImageWork',
      'downloadNovelCoverImage',
      'downloadNovelEmbeddedImage',
      'previewUgoira',
      'hiddenBrowserDownloadBar',
      'slowCrawl',
      'downloadOnClickBookmark',
      'downloadOnClickLike',
      'exportLog',
      'exportLogNormal',
      'exportLogError',
    ],
    text: [
      'setWantPage',
      'firstFewImages',
      'multiImageWorkImageLimit',
      'convertUgoiraThread',
      'BMKNumMin',
      'BMKNumMax',
      'BMKNumAverage',
      'setWidth',
      'setHeight',
      'userRatio',
      'idRangeInput',
      'needTag',
      'notNeedTag',
      'workDirFileNumber',
      'r18FolderName',
      'sizeMin',
      'sizeMax',
      'downloadThread',
      'fileNameLengthLimit',
      'dateFormat',
      'blockList',
      'bgOpacity',
      'zeroPaddingLength',
      'workDirNameRule',
      'autoExportResultNumber',
      'previewWorkWait',
      'previewResultLimit',
      'timedCrawlInterval',
      'slowCrawlOnWorksNumber',
      'exportLogExclude',
    ],
    radio: [
      'ugoiraSaveAs',
      'novelSaveAs',
      'widthHeightLimit',
      'userRatioLimit',
      'setWidthAndOr',
      'ratio',
      'idRange',
      'magnifierSize',
      'magnifierPosition',
      'dupliStrategy',
      'imageSize',
      'userSetLang',
      'restrict',
      'widthTag',
      'needTagMode',
      'theme',
      'bgPositionY',
      'switchTabBar',
      'tagMatchMode',
      'prevWorkSize',
      'showOriginImageSize',
      'exportLogTiming',
    ],
    textarea: ['createFolderTagList'],
    datetime: ['postDateStart', 'postDateEnd'],
  }

  private restoreTimer = 0

  private bindEvents() {
    // 页面切换时，从设置里恢复当前页面的页数/个数
    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      this.restoreWantPage()
    })

    window.addEventListener(EVT.list.settingChange, () => {
      window.clearTimeout(this.restoreTimer)
      this.restoreTimer = window.setTimeout(() => {
        this.restoreFormSettings()
      }, 0)
    })
  }

  // 监听所有输入选项的变化
  // 该函数可执行一次，否则事件会重复绑定
  private ListenChange() {
    for (const name of this.inputFileds.text) {
      // 对于某些特定输入框，不使用通用的事件处理函数
      if (name === 'setWantPage') {
        continue
      }

      this.saveTextInput(name)
    }

    // setWantPage 变化时，保存到 wantPageArr
    this.form.setWantPage.addEventListener('change', () => {
      const temp = Array.from(settings.wantPageArr)
      temp[pageType.type] = Number.parseInt(this.form.setWantPage.value)
      setSetting('wantPageArr', temp)
    })

    for (const name of this.inputFileds.textarea) {
      this.saveTextInput(name)
    }

    for (const name of this.inputFileds.datetime) {
      this.saveTextInput(name)
    }

    for (const name of this.inputFileds.radio) {
      this.saveRadio(name)
    }

    for (const name of this.inputFileds.checkbox) {
      this.saveCheckBox(name)
    }
  }

  // 读取设置，恢复到表单里
  private restoreFormSettings() {
    for (const name of this.inputFileds.text) {
      // setWantPage 需要从 wantPageArr 恢复
      if (name === 'setWantPage') {
        this.restoreWantPage()
        continue
      }

      this.restoreString(name)
    }

    for (const name of this.inputFileds.radio) {
      this.restoreString(name)
    }

    for (const name of this.inputFileds.textarea) {
      this.restoreString(name)
    }

    for (const name of this.inputFileds.checkbox) {
      this.restoreBoolean(name)
    }

    for (const name of this.inputFileds.datetime) {
      this.restoreDate(name)
    }
  }

  // ---------------------

  // 处理输入框： change 时保存 value
  private saveTextInput(name: SettingKeys) {
    const el = this.form[name] as HTMLInputElement
    el.addEventListener('change', () => {
      setSetting(name, el.value)
    })
  }

  // 处理复选框： click 时保存 checked
  private saveCheckBox(name: SettingKeys) {
    // 由于表单里存在两个 showAdvancedSettings 设置，会获取到 NodeListOf<HTMLInputElement>
    // 其他设置只有一个，是 HTMLInputElement
    const el = this.form[name] as
      | HTMLInputElement
      | NodeListOf<HTMLInputElement>
    let elArray: HTMLInputElement[] = []
    if ((el as NodeListOf<HTMLInputElement>).length !== undefined) {
      elArray = Array.from(el as NodeListOf<HTMLInputElement>)
    } else {
      elArray.push(el as HTMLInputElement)
    }
    elArray.forEach((el) => {
      el.addEventListener('click', () => {
        setSetting(name, el.checked)
      })
    })
  }

  // 处理单选框： click 时保存 value
  private saveRadio(name: SettingKeys) {
    const radios = this.form[name]
    for (const radio of radios) {
      radio.addEventListener('click', () => {
        setSetting(name, radio.value)
      })
    }
  }

  // 恢复值为 Boolean 的设置项
  private restoreBoolean(name: SettingKeys) {
    if (settings[name] !== undefined) {
      // 由于表单里存在两个 showAdvancedSettings 设置，会获取到 NodeListOf<HTMLInputElement>
      // 其他设置只有一个，是 HTMLInputElement
      const el = this.form[name] as
        | HTMLInputElement
        | NodeListOf<HTMLInputElement>
      let elArray: HTMLInputElement[] = []
      if ((el as NodeListOf<HTMLInputElement>).length !== undefined) {
        elArray = Array.from(el as NodeListOf<HTMLInputElement>)
      } else {
        elArray.push(el as HTMLInputElement)
      }
      elArray.forEach((el) => {
        el.checked = settings[name] as boolean
      })
    }
  }

  // 恢复值为 string 的设置项
  private restoreString(name: SettingKeys) {
    if (settings[name] !== undefined) {
      this.form[name].value = settings[name].toString()
    }
  }

  // 恢复日期、时间设置项
  private restoreDate(name: SettingKeys) {
    if (settings[name] !== undefined) {
      // 把时间戳转换成 input 使用的字符串
      const date = settings[name] as number
      this.form[name].value = DateFormat.format(date, 'YYYY-MM-DDThh:mm')
    }
  }

  // 从设置里恢复当前页面的页数/个数
  private restoreWantPage() {
    const want = settings.wantPageArr[pageType.type]
    if (want !== undefined) {
      this.form.setWantPage.value = want.toString()
    }
  }
}

export { FormSettings }
