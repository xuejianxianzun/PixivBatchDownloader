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
    new SaveNamingRule(this.form.userSetName, 'artwork')
    new SaveNamingRule(this.form.userSetNameForNovel, 'novel')
    new FormSettings(this.form)
    new FormHelpManager(this.form)
    new FormBeautify(this.form)

    this.bindFormEvents()
    this.bindFunctionBtn()
    this.bindCopyEvent()

    // 语言变化时，有些命名标记的父元素的内容会被重设，此时需要重新绑定事件
    window.addEventListener(EVT.list.langChange, () => {
      this.bindCopyEvent()
    })
  }

  private form: SettingsForm

  private bindFormEvents() {
    // 用户点击下拉框的选项时，把它插入到输入框里
    const list = [
      {
        select: this.form.fileNameSelect,
        input: this.form.userSetName,
      },
      {
        select: this.form.fileNameSelectForNovel,
        input: this.form.userSetNameForNovel,
      },
    ]
    list.forEach(({ select, input }) => {
      select.addEventListener('change', () => {
        if (select.value !== 'default') {
          // 把选择项插入到光标位置，并设置新的光标位置
          const position = input.selectionStart!
          input.value =
            input.value.substring(0, position) +
            select.value +
            input.value.substring(position)
          input.selectionStart = position + select.value.length
          input.selectionEnd = position + select.value.length
          input.focus()
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

  /** 点击命名规则帮助区域里的标记名字时，复制到剪贴板 */
  private bindCopyEvent() {
    const allName = this.form.querySelectorAll(
      '.namingTipArea .name'
    ) as NodeListOf<HTMLElement>
    for (const el of allName) {
      if (el.dataset.bindCopy) {
        continue
      }

      // 防止重复绑定
      el.dataset.bindCopy = 'true'
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
    }
  }
}

new Form()
