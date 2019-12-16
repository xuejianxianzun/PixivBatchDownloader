// 保存和初始化下载区域的设置项
// 只有部分设置会被保存
import { ui } from './UI'
import { pageType } from './PageType'
import { EVT } from './EVT'

interface XzSetting {
  imgNumberPerWork: number
  notdownType: string
  ugoiraSaveAs: 'webm' | 'gif' | 'zip'
  needTag: string
  notNeedTag: string
  quietDownload: boolean
  downloadThread: number
  userSetName: string
  tagNameToFileName: boolean
  showOptions: boolean
  [key: string]: string | number | boolean
}

class Option {
  constructor() {
    this.restoreOption()
    this.bindOptionEvent()

    window.addEventListener(EVT.events.resetOption, () => {
      ui.form.reset()
      this.reset()
    })
  }

  // 本地存储中使用的 name
  private readonly storeName = 'xzSetting'

  // 需要持久化保存的设置的默认值
  private readonly needSaveOptsDefault: XzSetting = {
    imgNumberPerWork: 0,
    notdownType: '',
    ugoiraSaveAs: 'webm',
    needTag: '',
    notNeedTag: '',
    quietDownload: true,
    downloadThread: 5,
    userSetName: '{id}',
    tagNameToFileName: true,
    showOptions: true
  }

  // 储存需要持久化保存的设置
  private needSaveOpts: XzSetting = this.needSaveOptsDefault

  // 排除类型的按钮 name
  private readonly notdownTypeName = [
    'setWorkType0',
    'setWorkType1',
    'setWorkType2'
  ]

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
    ui.toggleOptionArea(this.needSaveOpts.showOptions)

    // 设置作品张数
    ui.form.imgNumberPerWork.value = (
      this.needSaveOpts.imgNumberPerWork | 0
    ).toString()

    // 设置排除类型
    for (let index = 0; index < this.notdownTypeName.length; index++) {
      // 根据 notdownType 里的记录，选中或者取消选中
      let element = ui.form[this.notdownTypeName[index]] as HTMLInputElement
      if (this.needSaveOpts.notdownType.includes(index.toString())) {
        element.checked = false
      } else {
        element.checked = true
      }
    }

    // 设置动图格式选项
    ui.form.ugoiraSaveAs.value = this.needSaveOpts.ugoiraSaveAs

    // 设置必须的 tag
    ui.form.needTag.value = this.needSaveOpts.needTag

    // 设置排除的 tag
    ui.form.notNeedTag.value = this.needSaveOpts.notNeedTag

    // 设置快速下载
    ui.form.quietDownload.checked = this.needSaveOpts.quietDownload

    // 设置下载线程
    ui.form.downloadThread.value = this.needSaveOpts.downloadThread.toString()

    // 设置文件命名规则
    const fileNameRuleInput = ui.form.userSetName

    // pixivision 里，文件名只有 id 标记会生效，所以把文件名部分替换成 id
    if (pageType.getPageType() === 8) {
      fileNameRuleInput.value = '{p_title}/{id}'
    } else {
      fileNameRuleInput.value = this.needSaveOpts.userSetName
    }

    // 设置是否添加标记名称
    ui.form.tagNameToFileName.checked = this.needSaveOpts.tagNameToFileName
  }

  // 绑定选项的事件，主要是当选项变动时保存。
  // 只可执行一次，否则事件会重复绑定
  private bindOptionEvent() {
    const that = this

    // 保存是否显示选项区域
    const showOptionsBtn = document.querySelector('.centerWrap_toogle_option')!
    showOptionsBtn.addEventListener('click', () => {
      this.needSaveOpts.showOptions = !this.needSaveOpts.showOptions
      this.saveSetting('showOptions', this.needSaveOpts.showOptions)
      ui.toggleOptionArea(this.needSaveOpts.showOptions)
    })

    // 保存作品张数
    ui.form.imgNumberPerWork.addEventListener('change', function(
      this: HTMLInputElement
    ) {
      if (parseInt(this.value) >= 0) {
        that.saveSetting('imgNumberPerWork', this.value)
      }
    })

    // 保存排除类型
    for (let i = 0; i < this.notdownTypeName.length; i++) {
      // 根据 notdownType 里的记录，选中或者取消选中
      let element = ui.form[this.notdownTypeName[i]] as HTMLInputElement
      element.addEventListener('click', () => {
        this.saveSetting('notdownType', ui.getNotDownType())
      })
    }

    // 保存动图格式选项
    for (const input of ui.form.ugoiraSaveAs) {
      input.addEventListener('click', function(this: HTMLInputElement) {
        that.saveSetting('ugoiraSaveAs', this.value)
      })
    }

    // 保存必须的 tag设置
    ui.form.needTag.addEventListener('change', function(
      this: HTMLInputElement
    ) {
      that.saveSetting('needTag', this.value)
    })

    // 保存排除的 tag设置
    ui.form.notNeedTag.addEventListener('change', function(
      this: HTMLInputElement
    ) {
      that.saveSetting('notNeedTag', this.value)
    })

    // 保存快速下载
    ui.form.quietDownload.addEventListener('click', function(
      this: HTMLInputElement
    ) {
      that.saveSetting('quietDownload', this.checked)
    })

    // 保存下载线程
    ui.form.downloadThread.addEventListener('change', function(
      this: HTMLInputElement
    ) {
      if (parseInt(this.value) > 0) {
        that.saveSetting('downloadThread', this.value)
      }
    })

    // 保存命名规则
    ;['change', 'focus'].forEach(ev => {
      ui.form.userSetName.addEventListener(ev, function(
        this: HTMLInputElement
      ) {
        that.saveSetting('userSetName', this.value)
      })
    })

    // 保存是否添加标记名称
    ui.form.tagNameToFileName.addEventListener('click', function(
      this: HTMLInputElement
    ) {
      that.saveSetting('tagNameToFileName', this.checked)
    })
  }

  // 持久化保存设置
  private saveSetting(key: keyof XzSetting, value: any) {
    this.needSaveOpts[key] = value
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
