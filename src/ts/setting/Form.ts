import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { lang } from '../Lang'
import { formHtml } from './FormHTML'
import { SettingsForm } from './SettingsForm'
import { SaveNamingRule } from './SaveNamingRule'
import { theme } from '../Theme'
import { FormSettings } from './FormSettings'
import { Utils } from '../utils/Utils'
import { settings, setSetting, SettingKeys } from '../setting/Settings'
import { options } from '../setting/Options'

// 设置表单
class Form {
  constructor() {
    this.form = Tools.useSlot('form', formHtml) as SettingsForm

    theme.register(this.form)
    lang.register(this.form)

    this.getElements()

    const allOptions = this.form.querySelectorAll(
      '.option'
    ) as NodeListOf<HTMLElement>
    options.init(allOptions)

    new SaveNamingRule(this.form.userSetName)

    new FormSettings(this.form)

    this.bindEvents()
  }

  public form: SettingsForm

  /**所有的美化表单元素 */
  // 每个美化的 input 控件后面必定有一个 span 元素
  // label 和 子选项区域则不一定有
  private allBeautifyInput: {
    input: HTMLInputElement
    span: HTMLSpanElement
    label: HTMLLabelElement | null
    subOption: HTMLSpanElement | null
  }[] = []

  /**一些固定格式的帮助元素 */
  private tips: {
    wrapID: string
    wrap: HTMLSpanElement
    settingName: SettingKeys
  }[] = []

  private getElements() {
    // 获取所有的美化控件和它们对应的 span 元素
    const allCheckBox = this.form.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>
    const allRadio = this.form.querySelectorAll(
      'input[type="radio"]'
    ) as NodeListOf<HTMLInputElement>
    const checkboxAndRadio = [allCheckBox, allRadio]
    for (const arr of checkboxAndRadio) {
      arr.forEach((input) => {
        let subOption = null
        if (input.classList.contains('checkbox_switch')) {
          subOption = this.form.querySelector(
            `.subOptionWrap[data-show="${input.name}"]`
          ) as HTMLSpanElement
        }
        this.allBeautifyInput.push({
          input: input,
          span: input.nextElementSibling! as HTMLSpanElement,
          label: this.form.querySelector(`label[for="${input.id}"]`),
          subOption: subOption,
        })
      })
    }

    // 获取所有在表单上直接显示的提示元素
    for (const item of this.tips) {
      const wrap: HTMLSpanElement = this.form.querySelector(
        '#' + item.wrapID
      ) as HTMLSpanElement
      if (wrap) {
        item.wrap = wrap
      }
    }
  }

  private bindEvents() {
    // 为美化的表单控件绑定事件
    for (const item of this.allBeautifyInput) {
      const { input, span } = item

      // 点击美化元素时，点击真实的 input 控件
      span.addEventListener('click', () => {
        input.click()
      })

      // 当美化元素获得焦点，并且用户按下了回车或空格键时，点击真实的 input 控件
      span.addEventListener('keydown', (event) => {
        if (
          (event.code === 'Enter' || event.code === 'Space') &&
          event.target === span
        ) {
          event.stopPropagation()
          event.preventDefault()
          input.click()
        }
      })
    }

    // 设置变化或者重置时，重新设置美化状态
    window.addEventListener(
      EVT.list.settingChange,
      Utils.debounce(() => {
        this.initFormBeautify()
        this.showTips()
      }, 50)
    )

    // 用户点击“我知道了”按钮之后不再显示对应的提示
    for (const item of this.tips) {
      if (item.wrap) {
        const btn = item.wrap.querySelector('button')!
        btn.addEventListener('click', () => {
          setSetting(item.settingName, false)
        })
      }
    }

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

    // 重置设置
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

    // 导出设置
    {
      const el = this.form.querySelector('#exportSettings')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire('exportSettings')
        })
      }
    }

    // 导入设置
    {
      const el = this.form.querySelector('#importSettings')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire('importSettings')
        })
      }
    }

    // 重新显示帮助
    {
      const el = this.form.querySelector('#resetHelpTip')
      if (el) {
        el.addEventListener('click', () => {
          EVT.fire('resetHelpTip')
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
    const from = this.form.fileNameSelect
    const to = this.form.userSetName
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

  // 设置表单里的美化元素的状态
  private initFormBeautify() {
    for (const item of this.allBeautifyInput) {
      const { input, span, label, subOption } = item
      // 重设 label 的高亮状态
      if (label) {
        const method = input.checked ? 'add' : 'remove'
        label.classList[method]('active')
      }

      // 重设子选项区域的显示/隐藏状态
      if (subOption) {
        subOption.style.display = input.checked ? 'inline' : 'none'
      }
    }
  }

  // 是否显示提示
  private showTips() {
    for (const item of this.tips) {
      if (!Utils.isPixiv()) {
        item.wrap.style.display = 'none'
      } else {
        item.wrap.style.display = settings[item.settingName] ? 'block' : 'none'
      }
    }
  }
}

new Form()
