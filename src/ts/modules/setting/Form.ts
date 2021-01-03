import { EVT } from '../EVT'
import { DOM } from '../DOM'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import formHtml from './FormHTML'
import { SettingsForm } from './Form.d'
import { SaveNamingRule } from './SaveNamingRule'
import { theme } from '../Theme'
import { FormSettings } from './FormSettings'

// 设置表单
class Form {
  constructor() {
    this.form = DOM.useSlot('form', formHtml) as SettingsForm
    theme.register(this.form)

    this.allCheckBox = this.form.querySelectorAll(
      'input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>

    this.allRadio = this.form.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>

    this.allSwitch = this.form.querySelectorAll('.checkbox_switch')

    this.allLabel = this.form.querySelectorAll('label')

    this.allTabTitle = this.form.querySelectorAll('.tabsTitle .title')

    this.allTabCon = this.form.querySelectorAll('.tabsContnet .con')

    this.bindEvents()

    new SaveNamingRule(this.form.userSetName)

    this.formSettings = new FormSettings(this.form)

    this.initFormBueatiful()

    // 激活第一个选项卡
    this.activeTab(0)
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

  private allTabTitle: NodeListOf<HTMLDivElement> // 选项卡的标题区域
  private allTabCon: NodeListOf<HTMLDivElement> // 选项卡的内容区域
  private readonly activeClass = 'active'

  private readonly chooseKeys = ['Enter', 'NumpadEnter'] // 让回车键可以控制复选框（浏览器默认只支持空格键）

  private formSettings: FormSettings

  // 设置激活的选项卡
  private activeTab(no = 0) {
    for (const title of this.allTabTitle) {
      title.classList.remove(this.activeClass)
    }
    this.allTabTitle[no].classList.add(this.activeClass)

    for (const con of this.allTabCon) {
      con.style.display = 'none'
    }
    this.allTabCon[no].style.display = 'block'
  }

  private bindEvents() {
    // 给美化的复选框绑定功能
    for (const checkbox of this.allCheckBox) {
      this.bindCheckboxEvent(checkbox)
    }

    // 给美化的单选按钮绑定功能
    for (const radio of this.allRadio) {
      this.bindRadioEvent(radio)
    }

    // 设置发生改变时，重新设置美化状态
    window.addEventListener(EVT.list.settingChange, () => {
      this.initFormBueatiful()
    })

    window.addEventListener(EVT.list.resetSettingsEnd, () => {
      this.form.reset()

      this.formSettings.restoreFormSettings()

      // 美化表单，包括设置子选项区域的显示隐藏。所以这需要在恢复设置之后执行
      this.initFormBueatiful()
    })

    // 在选项卡的标题上触发事件时，激活对应的选项卡
    for (let index = 0; index < this.allTabTitle.length; index++) {
      ;['click', 'mouseenter'].forEach((name) => {
        this.allTabTitle[index].addEventListener(name, () => {
          this.activeTab(index)
        })
      })
    }

    // 当可以开始下载时，切换到“下载”选项卡
    for (const ev of [
      EVT.list.crawlFinish,
      EVT.list.resultChange,
      EVT.list.resume,
    ]) {
      window.addEventListener(ev, () => {
        this.activeTab(1)
      })
    }

    window.addEventListener(EVT.list.crawlEmpty, () => {
      this.activeTab(0)
    })

    // 预览文件名
    DOM.addBtn(
      'namingBtns',
      Colors.green,
      lang.transl('_预览文件名'),
    ).addEventListener(
      'click',
      () => {
        EVT.fire(EVT.list.previewFileName)
      },
      false,
    )

    // 导出 csv
    DOM.addBtn(
      'namingBtns',
      Colors.green,
      lang.transl('_导出csv'),
    ).addEventListener(
      'click',
      () => {
        EVT.fire(EVT.list.outputCSV)
      },
      false,
    )

    // 导出抓取结果
    DOM.addBtn(
      'namingBtns',
      Colors.green,
      lang.transl('_导出抓取结果'),
    ).addEventListener(
      'click',
      () => {
        EVT.fire(EVT.list.outputResult)
      },
      false,
    )

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
        DOM.toggleEl(document.querySelector('.fileNameTip')! as HTMLElement),
      )

    // 显示日期格式提示
    this.form
      .querySelector('.showDateTip')!
      .addEventListener('click', () =>
        DOM.toggleEl(document.querySelector('.dateFormatTip')! as HTMLElement),
      )

    // 输入框获得焦点时自动选择文本（文件名输入框例外）
    const centerInputs: NodeListOf<HTMLInputElement> = this.form.querySelectorAll(
      'input[type=text]',
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
        `.subOptionWrap[data-show="${_switch.name}"]`,
      ) as HTMLSpanElement
      if (subOption) {
        subOption.style.display = _switch.checked ? 'inline' : 'none'
      }
    }
  }
}

const form = new Form().form

export { form }
