// 保存和初始化下载区域的设置项
// 只有部分设置会被保存
import { form } from './Settings'
import { pageType } from './PageType'
import { EVT } from './EVT'

interface XzSetting {
  multipleImageWorks: number
  firstFewImages: number
  downType0: boolean
  downType1: boolean
  downType2: boolean
  ugoiraSaveAs: 'webm' | 'gif' | 'zip'
  needTag: string
  notNeedTag: string
  quietDownload: boolean
  downloadThread: number
  userSetName: string
  tagNameToFileName: boolean
  alwaysFolder: boolean
  showOptions: boolean
  postDate: boolean
  postDateStart: string
  postDateEnd: string
  previewResult: boolean
}

class Option {
  constructor() {
    this.restoreOption()
    this.bindOptionEvent()

    window.addEventListener(EVT.events.resetOption, () => {
      form.reset()
      this.reset()
    })
  }

  // 本地存储中使用的 name
  private readonly storeName = 'xzSetting'

  // 需要持久化保存的设置的默认值
  private readonly needSaveOptsDefault: XzSetting = {
    multipleImageWorks: 0,
    firstFewImages: 1,
    downType0: true,
    downType1: true,
    downType2: true,
    ugoiraSaveAs: 'webm',
    needTag: '',
    notNeedTag: '',
    quietDownload: true,
    downloadThread: 5,
    userSetName: '{id}',
    tagNameToFileName: true,
    alwaysFolder: true,
    showOptions: true,
    postDate: false,
    postDateStart: '',
    postDateEnd: '',
    previewResult: true
  }

  // 储存需要持久化保存的设置
  private needSaveOpts: XzSetting = this.needSaveOptsDefault

  // 恢复值是 Boolean 值的设置项
  private restoreBoolean(name: keyof XzSetting) {
    // 优先使用用户设置的值
    if (this.needSaveOpts[name] !== undefined) {
      form[name].checked = this.needSaveOpts[name]
    } else {
      // 否则使用默认值
      form[name].checked = this.needSaveOptsDefault[name]
    }
    // 这里不能简单的使用“或”符号来处理，考虑如下情况：
    // this.needSaveOpts[name] || this.needSaveOptsDefault[name]
    // 用户设置为 false，默认值为 true，使用 || 的话就恒为 true 了
  }

  // 从持久化设置里恢复下载区域的设置
  // 可以执行多次
  private restoreOption() {
    let str = localStorage.getItem(this.storeName)
    // 如果之前已经持久化，则读取设置，初始化下载区域的选项
    if (str) {
      this.needSaveOpts = JSON.parse(str)
    } else {
      // 如果没有保存过，则不做处理
      return
    }

    // 设置是否显示选项区域
    EVT.fire(EVT.events.toggleForm, this.needSaveOpts.showOptions)

    // 多图作品设置
    form.multipleImageWorks.value = (
      this.needSaveOpts.multipleImageWorks ||
      this.needSaveOptsDefault.multipleImageWorks
    ).toString()

    // 设置作品张数
    form.firstFewImages.value = (
      this.needSaveOpts.firstFewImages ||
      this.needSaveOptsDefault.firstFewImages
    ).toString()

    // 设置下载的作品类型
    this.restoreBoolean('downType0')
    this.restoreBoolean('downType1')
    this.restoreBoolean('downType2')

    // 设置动图格式选项
    form.ugoiraSaveAs.value = this.needSaveOpts.ugoiraSaveAs

    // 设置必须的 tag
    form.needTag.value = this.needSaveOpts.needTag

    // 设置排除的 tag
    form.notNeedTag.value = this.needSaveOpts.notNeedTag

    // 设置投稿时间
    this.restoreBoolean('postDate')

    form.postDateStart.value =
      this.needSaveOpts.postDateStart || this.needSaveOptsDefault.postDateStart

    form.postDateEnd.value =
      this.needSaveOpts.postDateEnd || this.needSaveOptsDefault.postDateEnd

    // 设置自动下载
    this.restoreBoolean('quietDownload')

    // 设置下载线程
    form.downloadThread.value = this.needSaveOpts.downloadThread.toString()

    // 设置文件命名规则
    const fileNameRuleInput = form.userSetName

    // pixivision 里，文件名只有 id 标记会生效，所以把文件名部分替换成 id
    if (pageType.getPageType() === 8) {
      fileNameRuleInput.value = '{p_title}/{id}'
    } else {
      fileNameRuleInput.value = this.needSaveOpts.userSetName
    }

    // 设置是否添加标记名称
    this.restoreBoolean('tagNameToFileName')

    // 设置是否始终建立文件夹
    this.restoreBoolean('alwaysFolder')

    // 设置预览搜索结果
    this.restoreBoolean('previewResult')
  }

  // 处理 change 时直接保存 value 的输入框
  private saveValueOnChange(name: keyof XzSetting) {
    const el = form[name] as HTMLInputElement
    el.addEventListener('change', () => {
      this.saveSetting(name, el.value)
    })
  }

  // 处理 click 时直接保存 checked 的复选框
  private saveCheckOnClick(name: keyof XzSetting) {
    const el = form[name] as HTMLInputElement
    el.addEventListener('click', () => {
      this.saveSetting(name, el.checked)
    })
  }

  // 绑定选项的事件，主要是当选项变动时保存。
  // 只可执行一次，否则事件会重复绑定
  private bindOptionEvent() {
    const that = this

    // 保存是否显示选项区域
    const showOptionsBtn = document.querySelector('.centerWrap_toogle_option')!
    showOptionsBtn.addEventListener('click', () => {
      this.needSaveOpts.showOptions = !this.needSaveOpts.showOptions
      EVT.fire(EVT.events.toggleForm, this.needSaveOpts.showOptions)
      this.saveSetting('showOptions', this.needSaveOpts.showOptions)
    })

    // 保存多图作品设置
    for (const input of form.multipleImageWorks) {
      input.addEventListener('click', function(this: HTMLInputElement) {
        that.saveSetting('multipleImageWorks', parseInt(this.value))
      })
    }

    // 保存作品张数
    this.saveValueOnChange('firstFewImages')

    // 保存下载的作品类型
    this.saveCheckOnClick('downType0')
    this.saveCheckOnClick('downType1')
    this.saveCheckOnClick('downType2')

    // 保存动图格式选项
    for (const input of form.ugoiraSaveAs) {
      input.addEventListener('click', function(this: HTMLInputElement) {
        that.saveSetting('ugoiraSaveAs', this.value)
      })
    }

    // 保存投稿时间
    this.saveCheckOnClick('postDate')
    this.saveValueOnChange('postDateStart')
    this.saveValueOnChange('postDateEnd')

    // 保存必须的 tag设置
    this.saveValueOnChange('needTag')

    // 保存排除的 tag设置
    this.saveValueOnChange('notNeedTag')

    // 保存自动下载
    this.saveCheckOnClick('quietDownload')

    // 保存下载线程
    this.saveValueOnChange('downloadThread')

    // 保存命名规则
    ;['change', 'focus'].forEach(ev => {
      form.userSetName.addEventListener(ev, function(this: HTMLInputElement) {
        that.saveSetting('userSetName', this.value)
      })
    })

    // 保存是否添加标记名称
    this.saveCheckOnClick('tagNameToFileName')

    // 保存是否始终建立文件夹
    this.saveCheckOnClick('alwaysFolder')

    // 保存预览搜索结果
    this.saveCheckOnClick('previewResult')
  }

  // 持久化保存设置
  private saveSetting(key: keyof XzSetting, value: string | number | boolean) {
    ;(this.needSaveOpts[key] as any) = value
    EVT.fire(EVT.events.settingChange,{name:key,value:value})
    localStorage.setItem(this.storeName, JSON.stringify(this.needSaveOpts))
  }

  // 重设选项
  public reset() {
    // 将 needSaveOpts 恢复为默认值
    this.needSaveOpts = this.needSaveOptsDefault
    // 覆写本地存储里的设置为默认值
    localStorage.setItem(this.storeName, JSON.stringify(this.needSaveOpts))
    // 使用默认值重设选项
    this.restoreOption()
  }
}
new Option()
export {}
