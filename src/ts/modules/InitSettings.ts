// 保存和初始化设置项
// 只有部分设置会被保存
import { EVT } from './EVT'
import { SettingsForm } from './Settings.d'

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

class InitSettings {
  constructor(form: SettingsForm) {
    this.form = form
    this.restoreOption()
    this.bindOptionEvent()

    window.addEventListener(EVT.events.resetOption, () => {
      form.reset()
      this.reset()
    })
  }

  private form: SettingsForm

  // 本地存储中使用的 name
  private readonly storeName = 'xzSetting'

  // 需要持久化保存的设置的默认值
  private readonly optionDefault: XzSetting = {
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

  // 需要持久化保存的设置
  private options: XzSetting = this.optionDefault

  // 恢复值是 Boolean 的设置项
  private restoreBoolean(name: keyof XzSetting) {
    // 优先使用用户设置的值
    if (this.options[name] !== undefined) {
      this.form[name].checked = this.options[name]
    } else {
      // 否则使用默认值
      this.form[name].checked = this.optionDefault[name]
    }
    // 这里不能简单的使用“或”符号来处理，考虑如下情况：
    // this.needSaveOpts[name] || this.needSaveOptsDefault[name]
    // 用户设置为 false，默认值为 true，使用 || 的话就恒为 true 了
  }

  // 恢复值是 string 的设置项
  private restoreString(name: keyof XzSetting) {
    // 优先使用用户设置的值
    if (this.options[name] !== undefined) {
      this.form[name].value = this.options[name].toString()
    } else {
      // 否则使用默认值
      this.form[name].value = this.optionDefault[name].toString()
    }
  }

  // 从持久化设置，或还是用默认值，恢复下载区域的设置
  private restoreOption() {
    const savedOption = localStorage.getItem(this.storeName)
    // 如果之前已经持久化，则读取设置，初始化下载区域的选项
    if (savedOption) {
      this.options = JSON.parse(savedOption)
    } else {
      // 如果没有保存过，则不做处理
      return
    }

    // 设置是否显示选项区域
    EVT.fire(EVT.events.toggleForm, this.options.showOptions)

    // 多图作品设置
    this.restoreString('multipleImageWorks')

    // 设置作品张数
    this.restoreString('firstFewImages')

    // 设置下载的作品类型
    this.restoreBoolean('downType0')
    this.restoreBoolean('downType1')
    this.restoreBoolean('downType2')

    // 设置动图格式选项
    this.restoreString('ugoiraSaveAs')

    // 设置必须的 tag
    this.restoreString('needTag')

    // 设置排除的 tag
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

    // 设置是否始终建立文件夹
    this.restoreBoolean('alwaysFolder')

    // 设置预览搜索结果
    this.restoreBoolean('previewResult')
  }

  // 处理 change 时直接保存 value 的输入框
  private saveValueOnChange(name: keyof XzSetting) {
    const el = this.form[name] as HTMLInputElement
    el.addEventListener('change', () => {
      this.saveSetting(name, el.value)
    })
  }

  // 处理 click 时直接保存 checked 的复选框
  private saveCheckOnClick(name: keyof XzSetting) {
    const el = this.form[name] as HTMLInputElement
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
      this.options.showOptions = !this.options.showOptions
      EVT.fire(EVT.events.toggleForm, this.options.showOptions)
      this.saveSetting('showOptions', this.options.showOptions)
    })

    // 保存多图作品设置
    for (const input of this.form.multipleImageWorks) {
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
    for (const input of this.form.ugoiraSaveAs) {
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
      this.form.userSetName.addEventListener(ev, function(
        this: HTMLInputElement
      ) {
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
    ;(this.options[key] as any) = value
    EVT.fire(EVT.events.settingChange, { name: key, value: value })
    localStorage.setItem(this.storeName, JSON.stringify(this.options))
  }

  // 重设选项
  public reset() {
    // 将 needSaveOpts 恢复为默认值
    this.options = this.optionDefault
    // 覆写本地存储里的设置为默认值
    localStorage.setItem(this.storeName, JSON.stringify(this.options))
    // 使用默认值重设选项
    this.restoreOption()
  }
}

export { InitSettings }
