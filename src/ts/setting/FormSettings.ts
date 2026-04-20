import { EVT } from '../EVT'
import { settings, setSetting, SettingKeys } from './Settings'
import { SettingsForm } from './SettingsForm'
import { DateFormat } from '../utils/DateFormat'
import { nameRuleManager } from './NameRuleManager'
import { Tools } from '../Tools'

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
      'onlyCrawlFirstFewImagesSwitch',
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
      'folderForMultiImageWorksSwitch',
      'r18Folder',
      'sizeSwitch',
      'autoStartDownload',
      'previewResult',
      'deduplication',
      'bmkAfterDL',
      'userBlockList',
      'removeBlockedUsersWork',
      'blockTagsForSpecificUser',
      'bgDisplay',
      'zeroPadding',
      'showFastSearchArea',
      'saveMetaType0',
      'saveMetaType1',
      'saveMetaType2',
      'saveMetaType3',
      'saveMetaFormatTXT',
      'saveMetaFormatJSON',
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
      'noFolderSwitch',
      'noFolderWhenSingleImageWork',
      'noFolderWhenMultiImageWork',
      'noFolderWhenNovel',
      'noSerialNoForSingleImg',
      'noSerialNoForMultiImg',
      'setNoSerialNoForUgoira',
      'removeAtFromUsername',
      'showPreviewWorkTip',
      'showLargerThumbnails',
      'wheelScrollSwitchImageOnPreviewWork',
      'swicthImageByKeyboard',
      'doNotCrawlLastImagesSwitch',
      'downloadNovelCoverImage',
      'downloadNovelEmbeddedImage',
      'previewSingleImageWork',
      'previewMultiImageWork',
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
      'copyFormatImage',
      'copyFormatText',
      'copyFormatHtml',
      'showCopyBtnOnThumb',
      'crawlLatestFewWorks',
      'rememberTheLastSaveLocation',
      'autoMergeNovel',
      'skipNovelsInSeriesWhenAutoMerge',
      'filterSearchResults',
      'fullNameLengthLimitSwitch',
      'titleIncludeSwitch',
      'titleExcludeSwitch',
      'alsoCheckSeriesTitle',
      'crawlOriginalWork',
      'crawlNonOriginalWork',
      'looseMatchOriginal',
      'DonotCrawlAlreadyDownloadedWorks',
      'showBorderOnDownloadedWorks',
      'removeEmoji',
      'onlyCrawlLastFewImagesSwitch',
      'doNotCrawlFirstImagesSwitch',
    ],
    text: [
      'onlyCrawlFirstFewImagesCount',
      'multiImageWorkImageLimit',
      'convertUgoiraThread',
      'BMKNumMin',
      'BMKNumMax',
      'BMKNumAverage',
      'setWidth',
      'setHeight',
      'userRatio',
      'idRangeValueForImageWorks',
      'idRangeValueForNovelWorks',
      'idRangeValueForNovelSeries',
      'needTag',
      'r18FolderName',
      'sizeMin',
      'sizeMax',
      'downloadThread',
      'dateFormat',
      'tagsSeparator',
      'bgOpacity',
      'zeroPaddingLength',
      'folderForMultiImageWorksRule',
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
      'copyWorkInfoFormat',
      'crawlLatestFewWorksNumber',
      'fullNameLengthLimit',
      'borderColor',
      'borderWidth',
      'doNotCrawlLastImagesCount',
      'onlyCrawlLastFewImagesCount',
      'doNotCrawlFirstImagesCount',
      'singleEPUBFileSizeLimit',
    ],
    radio: [
      'ugoiraSaveAs',
      'novelSaveAs',
      'widthHeightLimit',
      'userRatioLimit',
      'setWidthAndOr',
      'ratio',
      'idRangeComparisonForImageWorks',
      'idRangeComparisonForNovelWorks',
      'idRangeComparisonForNovelSeries',
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
      'copyImageSize',
      'logVisibleDefault',
      'serialNoStart',
    ],
    textarea: [
      'notNeedTag',
      'blockList',
      'createFolderTagList',
      'seriesNovelNameRule',
      'titleIncludeList',
      'titleExcludeList',
    ],
    datetime: ['postDateStart', 'postDateEnd'],
  }

  private restoreTimer = 0

  private bindEvents() {
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
      this.saveTextInput(name)
    }

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
      this.restoreString(name)
    }

    for (const name of this.inputFileds.radio) {
      this.restoreString(name)
    }

    for (const name of this.inputFileds.textarea) {
      this.restoreString(name)
      Tools.setRows(this.form[name] as HTMLTextAreaElement)
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
        Tools.setRows(this.form[name] as HTMLTextAreaElement)
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
      // if (this.form[name] === undefined) {
      //   console.log(name)
      // }
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
}

export { FormSettings }
