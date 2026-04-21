import { SettingsForm } from './SettingsForm'
import { Utils } from '../utils/Utils'
import { EVT } from '../EVT'

class FormBeautify {
  constructor(form: SettingsForm) {
    this.form = form
    this.bindBeautifyInput()
  }

  private form: SettingsForm

  /** 储存表单上所有美化元素 */
  // 每个美化的 input 控件后面必定有一个 span 元素
  // label 和子选项区域可能有，也可能没有
  private allBeautifyInput: {
    input: HTMLInputElement
    span: HTMLSpanElement
    label: HTMLLabelElement | null
    subOption: HTMLSpanElement | null
  }[] = []

  /**查找所有需要美化的表单控件，并绑定事件 */
  private bindBeautifyInput() {
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
        const span = input.nextElementSibling! as HTMLSpanElement

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

        this.allBeautifyInput.push({
          input,
          span,
          label: this.form.querySelector(`label[for="${input.id}"]`),
          subOption,
        })
      })
    }

    // 设置变化或者重置时，重新设置美化状态
    window.addEventListener(
      EVT.list.settingChange,
      Utils.debounce(() => {
        this.initBeautifyInput()
      }, 50)
    )
  }

  // 设置表单里的美化元素的状态
  private initBeautifyInput() {
    for (const item of this.allBeautifyInput) {
      const { input, span, label, subOption } = item
      // 重设 label 的高亮状态
      if (label) {
        const method = input.checked ? 'add' : 'remove'
        label.classList[method]('active')
      }

      // 重设子选项区域的显示/隐藏状态
      if (subOption) {
        subOption.style.display = input.checked ? 'inline-flex' : 'none'
      }
    }
  }
}

export { FormBeautify }
