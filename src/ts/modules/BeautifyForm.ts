import { EVT } from './EVT'
import { SettingsForm } from './Settings.d'

// 美化表单
// 虽然说是美化表单，但是美化的 html 在 Settings 里，样式在 style.less 里，这个类只控制行为
// 当点击美化按钮时，改变控件的值，并触发 settingChange 事件
// 点击 label 时，触发 settingChange 事件
// 高亮选项对应的 label
class BeautifyForm {
  constructor(form: SettingsForm) {
    this.form = form

    this.allCheckBox = this.form.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>

    this.allRadio = this.form.querySelectorAll(
      'input[type="radio"]'
    ) as NodeListOf<HTMLInputElement>

    this.allLabel = this.form.querySelectorAll('label')

    this.init()
  }

  private form: SettingsForm
  private allCheckBox: NodeListOf<HTMLInputElement> // 普通复选框
  private allRadio: NodeListOf<HTMLInputElement> // 单选按钮
  private allLabel: NodeListOf<HTMLLabelElement> // 所有 label 标签
  private readonly chooseKeys = ['Enter', 'NumpadEnter'] // 让回车键可以控制复选框（浏览器默认只支持空格键）

  // 当选项的值被改变时，触发 settingChange 事件
  private emitChange(name: string, value: string | number | boolean) {
    EVT.fire(EVT.events.settingChange, { name: name, value: value })
  }

  // 重设 label 的激活状态
  private resetLabelActive() {
    // 先取消所有激活状态
    for (const label of this.allLabel) {
      label.classList.remove('active')
    }

    // 设置复选框的 label 的激活状态
    for (const checkbox of this.allCheckBox) {
      this.setLabelActive(checkbox)
    }

    // 设置单选按钮的 label 的激活状态
    for (const radio of this.allRadio) {
      this.setLabelActive(radio)
    }
  }

  // 设置 label 的激活状态
  private setLabelActive(el: HTMLInputElement) {
    if (el.checked) {
      const label = this.form.querySelector(`label[for="${el.id}"]`)
      if (label) {
        label.classList.add('active')
      }
    }
  }

  // 设置复选框的事件
  private bindCheckboxEvent(el: HTMLInputElement) {
    // 让复选框支持用回车键选择
    el.addEventListener('keydown', (event: KeyboardEvent) => {
      if (this.chooseKeys.includes(event.code)) {
        el.checked = !el.checked
        this.emitChange(el.name, el.checked)
      }
    })

    // 点击美化按钮，反转复选框的值
    el.nextElementSibling!.addEventListener('click', () => {
      el.checked = !el.checked
      this.emitChange(el.name, el.checked)
    })

    // 点击它的 label 时，传递它的值
    const label = this.form.querySelector(`label[for="${el.id}"]`)
    if (label) {
      label.addEventListener('click', () => {
        // 点击复选框的 label 不要手动修改 checked ，因为浏览器会自动处理
        this.emitChange(el.name, el.checked)
      })
    }
  }

  // 设置单选控件的事件
  private bindRadioEvent(el: HTMLInputElement) {
    // 点击美化按钮，选择当前单选控件
    el.nextElementSibling!.addEventListener('click', () => {
      el.checked = true
      // 对于单选按钮，它的值是 value，不是 checked
      this.emitChange(el.name, this.form[el.name].value)
    })

    // 点击它的 label 时，传递它的值
    const label = this.form.querySelector(`label[for="${el.id}"]`)
    if (label) {
      label.addEventListener('click', () => {
        this.emitChange(el.name, this.form[el.name].value)
      })
    }
  }

  private init() {
    for (const checkbox of this.allCheckBox) {
      this.bindCheckboxEvent(checkbox)
    }

    for (const radio of this.allRadio) {
      this.bindRadioEvent(radio)
    }

    // 初始化时，立即重设 label 激活状态
    this.resetLabelActive()

    window.addEventListener(EVT.events.settingChange, () => {
      // 设置改变时，重设 label 激活状态
      this.resetLabelActive()
    })
  }
}

export { BeautifyForm }
