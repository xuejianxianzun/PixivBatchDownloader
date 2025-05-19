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
      'userSetChecked',
      'postDate',
      'idRangeSwitch',
      'needTagSwitch',
      'notNeedTagSwitch',
      'magnifier',
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
      'removeBlockedUsersWork',
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
      'wheelScrollSwitchImageOnPreviewWork',
      'swicthImageByKeyboard',
      'doNotDownloadLastImageOfMultiImageWork',
      'downloadNovelCoverImage',
      'downloadNovelEmbeddedImage',
      'previewUgoira',
      'slowCrawl',
      'downloadOnClickBookmark',
      'downloadOnClickLike',
      'exportLog',
      'exportLogNormal',
      'exportLogError',
      'UseDifferentNameRuleIfWorkHasTagSwitch',
      'AIGenerated',
      'notAIGenerated',
      'UnknownAI',
      'setFileDownloadOrder',
      'highlightFollowingUsers',
      'exportIDList',
      'displayThumbnailListOnMultiImageWorkPage',
      'PreviewWorkDetailInfo',
      'removeWorksOfFollowedUsersOnSearchPage',
      'saveWorkDescription',
      'saveEachDescription',
      'summarizeDescription',
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
      'workDirFileNumber',
      'r18FolderName',
      'sizeMin',
      'sizeMax',
      'downloadThread',
      'fileNameLengthLimit',
      'dateFormat',
      'tagsSeparator',
      'bgOpacity',
      'zeroPaddingLength',
      'workDirNameRule',
      'autoExportResultNumber',
      'previewWorkWait',
      'previewResultLimit',
      'timedCrawlInterval',
      'slowCrawlOnWorksNumber',
      'exportLogExclude',
      'PreviewDetailInfoWidth',
      'slowCrawlDealy',
      'downloadInterval',
      'downloadIntervalOnWorksNumber',
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
      'downloadOrder',
      'downloadOrderSortBy',
    ],
    textarea: ['notNeedTag', 'blockList', 'createFolderTagList'],
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
  // 该函数只应执行一次，否则事件会重复绑定
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

  /**根据文本长度，动态设置 textarea 的高度 */
  private setRows(name: SettingKeys) {
    // 下载器的 textarea 默认 rows 是 1，随着内容增多，应该增大 rows，以提供更好的交互体验
    // 由于文本内容可能有数字、字母、中日文，所以 length 只是个大致的值。
    // 对于中日文，假设 50 个字符为一行（PC 端的宽度）
    // 对于数字、字母，80 个字符为一行
    let oneRowLength = 50
    if (name === 'blockList') {
      oneRowLength = 80
    }
    const el = this.form[name] as HTMLInputElement

    let rows = Math.ceil(el.value.length / oneRowLength)
    // 如果值是空字符串，rows 会是 0，此时设置为 1
    if (rows === 0) {
      rows = 1
    }
    // 最大 rows 限制为 4
    if (rows > 4) {
      rows = 4
    }
    el.setAttribute('rows', rows.toString())
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
      this.setRows(name)
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
      if (this.inputFileds.textarea.includes(name)) {
        this.setRows(name)
      }
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
