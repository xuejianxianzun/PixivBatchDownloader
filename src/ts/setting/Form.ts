import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { lang } from '../Language'
import { formHtml } from './FormHTML'
import { SettingsForm } from './SettingsForm'
import { SaveNamingRule } from './SaveNamingRule'
import { theme } from '../Theme'
import { FormSettings } from './FormSettings'
import { Utils } from '../utils/Utils'
import { setSetting } from '../setting/Settings'
import { options } from '../setting/Options'
import { DateFormat } from '../utils/DateFormat'
import { toast } from '../Toast'
import { FormHelpManager } from './FormHelpManager'
import { FormBeautify } from './FormBeautify'

// 设置表单
class Form {
  constructor() {
    this.form = Tools.useSlot('form', formHtml) as SettingsForm
    const allOptions = this.form.querySelectorAll('.option')

    theme.register(this.form)
    lang.register(this.form)
    options.init(allOptions as NodeListOf<HTMLElement>)
    new SaveNamingRule(this.form.userSetName)
    new FormSettings(this.form)
    new FormHelpManager(this.form)
    new FormBeautify(this.form)

    this.bindFormEvents()
    this.bindFunctionBtn()
  }

  private form: SettingsForm

  private bindFormEvents() {
    // 输入框获得焦点时自动选择文本（命名规则的输入框例外）
    // const centerInputs: NodeListOf<HTMLInputElement> =
    //   this.form.querySelectorAll('input[type=text]')
    // for (const el of centerInputs) {
    //   if (el.name !== 'userSetName') {
    //     el.addEventListener('focus', function () {
    //       this.select()
    //     })
    //   }
    // }

    // 把下拉框的选择项插入到文本框里
    const from = this.form.fileNameSelect
    const to = this.form.userSetName
    from.addEventListener('change', () => {
      if (from.value !== 'default') {
        // 把选择项插入到光标位置，并设置新的光标位置
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

    // 点击命名规则帮助区域里的标记名字时，复制到剪贴板
    const allName = this.form.querySelectorAll('.namingTipArea .name')
    allName.forEach((el) => {
      el.addEventListener('click', async () => {
        const text = el.textContent
        if (text) {
          const copied = await Utils.writeClipboardText(text)
          if (copied) {
            toast.success(lang.transl('_已复制'))
          } else {
            toast.error(lang.transl('_复制失败'))
          }
        }
      })
    })

    // 投稿时间的输入框后面有 now 按钮，点击之后会把对应的输入框的值设置为现在
    const setNowBtns = this.form.querySelectorAll(
      'button[role="setDate"]'
    ) as NodeListOf<HTMLButtonElement>
    for (const btn of setNowBtns) {
      btn.addEventListener('click', () => {
        const name = btn.dataset.for as 'postDateStart' | 'postDateEnd'
        const input = this.form.querySelector(
          `input[name="${name}"]`
        ) as HTMLInputElement
        if (input) {
          // 根据 data-value 的标记修改 input 的值
          // 可能是 now，或者是预设的日期时间值
          const flag = btn.dataset.value!
          let value = flag
          if (flag === 'now') {
            value = DateFormat.format(new Date(), 'YYYY-MM-DDThh:mm')
          }
          input.value = value
          setSetting(name, value)
        }
      })
    }
  }

  /** 为表单上的一些功能按钮绑定事件 */
  private bindFunctionBtn() {
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
  }
}

new Form()
