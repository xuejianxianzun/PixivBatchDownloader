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

// 设置表单
class Form {
  constructor() {
    this.form = Tools.useSlot('form', formHtml) as SettingsForm
    theme.register(this.form)

    this.allCheckBox = this.form.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>

    this.allRadio = this.form.querySelectorAll(
      'input[type="radio"]'
    ) as NodeListOf<HTMLInputElement>

    this.allSwitch = this.form.querySelectorAll('.checkbox_switch')

    this.allLabel = this.form.querySelectorAll('label')

    new SaveNamingRule(this.form.userSetName)

    this.formSettings = new FormSettings(this.form)

    this.bindEvents()

    this.initFormBueatiful()

    this.checkTipCreateFolder()
  }

  // 设置表单上美化元素的状态
  private initFormBueatiful() {
    // 设置改变时，重设 label 激活状态
    this.resetLabelActive()

    // 重设该选项的子选项的显示/隐藏
    this.resetSubOptionDisplay()
  }

  public form: SettingsForm

  private allSwitch: NodeListOf<HTMLInputElement> // 所有开关（同时也是复选框）
  private allCheckBox: NodeListOf<HTMLInputElement> // 所有复选框
  private allRadio: NodeListOf<HTMLInputElement> // 单选按钮
  private allLabel: NodeListOf<HTMLLabelElement> // 所有 label 标签

  private readonly chooseKeys = ['Enter', 'NumpadEnter'] // 让回车键可以控制复选框（浏览器默认只支持空格键）

  private formSettings: FormSettings

  private readonly tipCreateFolderFlag = 'tipCreateFolder' // 控制“创建文件夹的提示”是否显示
  private readonly tipCreateFolderId = 'tipCreateFolder' // “创建文件夹的提示”的容器 id

  private bindEvents() {
    // 给美化的复选框绑定功能
    for (const checkbox of this.allCheckBox) {
      this.bindCheckboxEvent(checkbox)
    }

    // 给美化的单选按钮绑定功能
    for (const radio of this.allRadio) {
      this.bindRadioEvent(radio)
    }

    // 当某个设置发生改变时，重新设置美化状态
    window.addEventListener(EVT.list.settingChange, (ev) => {
      this.formSettings.restoreFormSettings()

      this.initFormBueatiful()
    })

    // 当设置重置时，重新设置美化状态
    window.addEventListener(EVT.list.resetSettingsEnd, () => {
      this.form.reset()

      this.formSettings.restoreFormSettings()

      // 美化表单，包括设置子选项区域的显示隐藏。所以这需要在恢复设置之后执行
      this.initFormBueatiful()
    })

    // 预览文件名
    Tools.addBtn(
      'namingBtns',
      Colors.bgGreen,
      lang.transl('_预览文件名')
    ).addEventListener(
      'click',
      () => {
        EVT.fire(EVT.list.previewFileName)
      },
      false
    )

    // 添加只在 pixiv 上使用的按钮
    if (Utils.isPixiv()) {
      // 导出 csv
      Tools.addBtn(
        'exportResult',
        Colors.bgGreen,
        lang.transl('_导出csv')
      ).addEventListener(
        'click',
        () => {
          EVT.fire(EVT.list.outputCSV)
        },
        false
      )

      // 导出抓取结果
      Tools.addBtn(
        'exportResult',
        Colors.bgGreen,
        lang.transl('_导出抓取结果')
      ).addEventListener(
        'click',
        () => {
          EVT.fire(EVT.list.exportResult)
        },
        false
      )

      // 导入抓取结果
      Tools.addBtn(
        'exportResult',
        Colors.bgGreen,
        lang.transl('_导入抓取结果')
      ).addEventListener(
        'click',
        () => {
          EVT.fire(EVT.list.importResult)
        },
        false
      )
    }

    // 选择背景图片
    {
      const el = this.form.querySelector('#selectBG')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire(EVT.list.selectBG)
        })
      }
    }

    // 清除背景图片
    {
      const el = this.form.querySelector('#clearBG')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire(EVT.list.clearBG)
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
            EVT.fire(EVT.list.resetSettings)
          }
        })
      }
    }

    // 导出设置按钮
    {
      const el = this.form.querySelector('#exportSettings')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire(EVT.list.exportSettings)
        })
      }
    }

    // 导入设置按钮
    {
      const el = this.form.querySelector('#importSettings')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire(EVT.list.importSettings)
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
    const centerInputs: NodeListOf<HTMLInputElement> = this.form.querySelectorAll(
      'input[type=text]'
    )
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
          to.value.substr(0, position) +
          from.value +
          to.value.substr(position, to.value.length)
        to.selectionStart = position + from.value.length
        to.selectionEnd = position + from.value.length
        to.focus()
      }
    })
  }

  // 设置复选框的事件
  private bindCheckboxEvent(el: HTMLInputElement) {
    // 让复选框支持用回车键选择
    el.addEventListener('keydown', (event: KeyboardEvent) => {
      if (this.chooseKeys.includes(event.code)) {
        el.click()
      }
    })

    // 点击美化按钮，点击对应的复选框
    el.nextElementSibling!.addEventListener('click', () => {
      el.click()
    })

    // 点击它的 label 时，不需要传递它的值。因为点击 lable 激活这个 input 控件时，浏览器会自动触发这个控件的 click 事件。settings 模块已经监听了 click 事件，所以这里就不要监听 label 了，否则就会因此多触发了一次 settingChange 事件。而且点击 label 时获得的值还是改变之前的旧的值。
  }

  // 设置单选控件的事件
  private bindRadioEvent(el: HTMLInputElement) {
    // 点击美化按钮，选择对应的单选框
    el.nextElementSibling!.addEventListener('click', () => {
      el.click()
    })

    // 点击它的 label 时，不需要传递它的值。原因同上。
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

  // 是否显示“创建文件夹的提示”
  private checkTipCreateFolder() {
    if (!Utils.isPixiv()) {
      return
    }

    const tip = this.form.querySelector(
      '#' + this.tipCreateFolderId
    ) as HTMLElement
    if (!tip) {
      return
    }

    // 如果用户没有点击“我知道了”按钮，则显示这个提示
    if (!window.localStorage.getItem(this.tipCreateFolderFlag)) {
      tip.style.display = 'block'
      // 用户点击“我知道了”按钮之后，隐藏这个提示并设置标记
      const btn = tip.querySelector('button')
      if (btn) {
        btn.addEventListener('click', () => {
          tip.style.display = 'none'
          window.localStorage.setItem(this.tipCreateFolderFlag, '1')
        })
      }
    }
  }
}

const form = new Form().form

export { form }
