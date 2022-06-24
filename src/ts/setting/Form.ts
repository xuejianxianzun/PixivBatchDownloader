import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { formHtml } from './FormHTML'
import { SettingsForm } from './SettingsForm'
import { SaveNamingRule } from './SaveNamingRule'
import { theme } from '../Theme'
import { FormSettings } from './FormSettings'
import { Utils } from '../utils/Utils'
import { settings, setSetting } from '../setting/Settings'

// 设置表单
class Form {
  constructor() {
    this.form = Tools.useSlot('form', formHtml) as SettingsForm
    theme.register(this.form)
    lang.register(this.form)

    this.allCheckBox = this.form.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>

    this.allRadio = this.form.querySelectorAll(
      'input[type="radio"]'
    ) as NodeListOf<HTMLInputElement>

    this.allSwitch = this.form.querySelectorAll('.checkbox_switch')

    this.createFolderTipEl = this.form.querySelector(
      '#tipCreateFolder'
    )! as HTMLElement

    new SaveNamingRule(this.form.userSetName)

    new FormSettings(this.form)

    this.bindEvents()
  }

  // 设置表单上美化元素的状态
  private initFormBueatiful() {
    // 重设 label 激活状态
    this.resetLabelActive()

    // 重设该选项的子选项的显示/隐藏
    this.resetSubOptionDisplay()
  }

  public form: SettingsForm
  private createFolderTipEl!: HTMLElement

  private allSwitch: NodeListOf<HTMLInputElement> // 所有开关（同时也是复选框）
  private allCheckBox: NodeListOf<HTMLInputElement> // 所有复选框
  private allRadio: NodeListOf<HTMLInputElement> // 单选按钮

  private readonly chooseKeys = ['Enter', 'NumpadEnter'] // 让回车键可以控制复选框（浏览器默认只支持空格键）

  private bindEvents() {
    // 给美化的复选框绑定功能
    for (const checkbox of this.allCheckBox) {
      this.bindBeautifyEvent(checkbox)

      // 让复选框支持用回车键选择
      checkbox.addEventListener('keydown', (event: KeyboardEvent) => {
        if (this.chooseKeys.includes(event.code)) {
          checkbox.click()
        }
      })
    }

    // 给美化的单选按钮绑定功能
    for (const radio of this.allRadio) {
      this.bindBeautifyEvent(radio)
    }

    // 设置变化或者重置时，重新设置美化状态
    window.addEventListener(
      EVT.list.settingChange,
      Utils.debounce(() => {
        this.initFormBueatiful()
        this.showCreateFolderTip()
      }, 50)
    )

    // 用户点击“我知道了”按钮之后不再显示提示
    const btn = this.createFolderTipEl.querySelector('button')!
    btn.addEventListener('click', () => {
      setSetting('tipCreateFolder', false)
    })

    // 选择背景图片
    {
      const el = this.form.querySelector('#selectBG')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire('selectBG')
        })
      }
    }

    // 清除背景图片
    {
      const el = this.form.querySelector('#clearBG')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire('clearBG')
        })
      }
    }

    // 重置设置按钮
    {
      const el = this.form.querySelector('#resetSettings')
      if (el) {
        el.addEventListener('click', () => {
          const result = window.confirm(lang.transl('_是否重置设置'))
          if (result) {
            EVT.fire('resetSettings')
          }
        })
      }
    }

    // 导出设置按钮
    {
      const el = this.form.querySelector('#exportSettings')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire('exportSettings')
        })
      }
    }

    // 导入设置按钮
    {
      const el = this.form.querySelector('#importSettings')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire('importSettings')
        })
      }
    }

    // 显示命名字段提示
    this.form
      .querySelector('.showFileNameTip')!
      .addEventListener('click', () =>
        Utils.toggleEl(document.querySelector('.fileNameTip')! as HTMLElement)
      )

    // 显示日期格式提示
    this.form
      .querySelector('.showDateTip')!
      .addEventListener('click', () =>
        Utils.toggleEl(document.querySelector('.dateFormatTip')! as HTMLElement)
      )

    // 输入框获得焦点时自动选择文本（文件名输入框例外）
    const centerInputs: NodeListOf<HTMLInputElement> =
      this.form.querySelectorAll('input[type=text]')
    for (const el of centerInputs) {
      if (el.name !== 'userSetName') {
        el.addEventListener('focus', function () {
          this.select()
        })
      }
    }

    // 把下拉框的选择项插入到文本框里
    this.insertValueToInput(this.form.fileNameSelect, this.form.userSetName)
  }

  // 把下拉框的选择项插入到文本框里
  private insertValueToInput(from: HTMLSelectElement, to: HTMLInputElement) {
    from.addEventListener('change', () => {
      if (from.value !== 'default') {
        // 把选择项插入到光标位置,并设置新的光标位置
        const position = to.selectionStart!
        to.value =
          to.value.substring(0, position) +
          from.value +
          to.value.substring(position)
        to.selectionStart = position + from.value.length
        to.selectionEnd = position + from.value.length
        to.focus()
      }
    })
  }

  // 点击美化按钮时，点击对应的 input 控件
  private bindBeautifyEvent(el: HTMLInputElement) {
    el.nextElementSibling!.addEventListener('click', () => {
      el.click()
    })
  }

  // 重设 label 的激活状态
  private resetLabelActive() {
    // 设置复选框的 label 的激活状态
    for (const checkbox of this.allCheckBox) {
      this.setLabelActive(checkbox)
    }

    // 设置单选按钮的 label 的激活状态
    for (const radio of this.allRadio) {
      this.setLabelActive(radio)
    }
  }

  // 设置 input 元素对应的 label 的激活状态
  private setLabelActive(input: HTMLInputElement) {
    const label = this.form.querySelector(`label[for="${input.id}"]`)
    if (label) {
      const method = input.checked ? 'add' : 'remove'
      label.classList[method]('active')
    }
  }

  // 重设子选项的显示/隐藏
  private resetSubOptionDisplay() {
    for (const _switch of this.allSwitch) {
      const subOption = this.form.querySelector(
        `.subOptionWrap[data-show="${_switch.name}"]`
      ) as HTMLSpanElement
      if (subOption) {
        subOption.style.display = _switch.checked ? 'inline' : 'none'
      }
    }
  }

  // 是否显示创建文件夹的提示
  private showCreateFolderTip() {
    if (!Utils.isPixiv()) {
      return (this.createFolderTipEl.style.display = 'none')
    }
    this.createFolderTipEl.style.display = settings.tipCreateFolder
      ? 'block'
      : 'none'
  }
}

const form = new Form().form

export { form }
