import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { lang } from '../Language'
import { formHtml } from './FormHTML'
import { SettingsForm } from './SettingsForm'
import { SaveNamingRule } from './SaveNamingRule'
import { theme } from '../Theme'
import { FormSettings } from './FormSettings'
import { Utils } from '../utils/Utils'
import { settings, setSetting, SettingKeys } from '../setting/Settings'
import { options } from '../setting/Options'
import { msgBox } from '../MsgBox'
import { DateFormat } from '../utils/DateFormat'

// 设置表单
class Form {
  constructor() {
    this.form = Tools.useSlot('form', formHtml) as SettingsForm

    theme.register(this.form)
    lang.register(this.form)

    const allOptions = this.form.querySelectorAll('.option')
    options.init(allOptions as NodeListOf<HTMLElement>)

    new SaveNamingRule(this.form.userSetName)

    new FormSettings(this.form)

    this.bindEvents()
  }

  public form: SettingsForm

  private bindEvents() {
    this.bindBeautifyInput()
    this.bindFunctionBtn()
    this.showToggleTip()
    this.showMsgTip()

    // 输入框获得焦点时自动选择文本（命名规则的输入框例外）
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
  }

  /**所有的美化表单元素 */
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

  /**点击一些按钮时，切换显示对应的帮助区域 */
  private showToggleTip() {
    // 显示命名字段提示
    this.form
      .querySelector('#showFileNameTip')!
      .addEventListener('click', () =>
        Utils.toggleEl(document.querySelector('#fileNameTip')! as HTMLElement)
      )

    // 显示复制内容的格式的提示
    this.form
      .querySelector('#showCopyWorkInfoFormatTip')!
      .addEventListener('click', () =>
        Utils.toggleEl(
          document.querySelector('#copyWorkInfoFormatTip')! as HTMLElement
        )
      )

    // 显示日期格式提示
    this.form
      .querySelector('#showDateTip')!
      .addEventListener('click', () =>
        Utils.toggleEl(document.querySelector('#dateFormatTip')! as HTMLElement)
      )

    // 显示标签分隔提示
    this.form
      .querySelector('#showTagsSeparatorTip')!
      .addEventListener('click', () =>
        Utils.toggleEl(
          document.querySelector('#tagsSeparatorTip')! as HTMLElement
        )
      )

    // 显示长按鼠标右键查看大图时的快捷键列表
    this.form
      .querySelector('#showShowOriginImageShortcutTip')!
      .addEventListener('click', () =>
        Utils.toggleEl(
          document.querySelector('#showOriginImageShortcutTip')! as HTMLElement
        )
      )

    // 显示预览作品的快捷键列表
    this.form
      .querySelector('#showPreviewWorkShortcutTip')!
      .addEventListener('click', () =>
        Utils.toggleEl(
          document.querySelector('#previewWorkShortcutTip')! as HTMLElement
        )
      )
  }

  /**点击一些按钮时，通过 msgBox 显示帮助 */
  private showMsgTip() {
    // 把文件保存到用户上次选择的位置的说明
    this.form
      .querySelector('#showRememberTheLastSaveLocationTip')!
      .addEventListener('click', () => {
        msgBox.show(lang.transl('_把文件保存到用户上次选择的位置的说明'), {
          title: lang.transl('_把文件保存到用户上次选择的位置'),
        })
      })

    // 显示复制按钮所复制的内容的提示
    this.form
      .querySelector('#showCopyWorkDataTip')!
      .addEventListener('click', () => {
        msgBox.show(lang.transl('_对复制的内容的说明'), {
          title: lang.transl('_复制内容'),
        })
      })

    // 显示用户阻止名单的提示
    this.form
      .querySelector('#showRemoveBlockedUsersWorkTip')!
      .addEventListener('click', () => {
        msgBox.show(lang.transl('_用户阻止名单的说明2'), {
          title: lang.transl('_用户阻止名单'),
        })
      })

    // 显示抓取多少作品的提示
    const showSetWantWorkTipButton = this.form.querySelector(
      '.showSetWantWorkTip'
    ) as HTMLButtonElement
    showSetWantWorkTipButton.addEventListener('click', () => {
      msgBox.show(lang.transl('_抓取多少作品的提示'), {
        title: lang.transl('_抓取多少作品'),
      })
    })

    // 显示抓取多少页面的提示
    const showSetWantPageTipButton = this.form.querySelector(
      '.showSetWantPageTip'
    ) as HTMLButtonElement
    showSetWantPageTipButton.addEventListener('click', () => {
      msgBox.show(lang.transl('_抓取多少页面的提示'), {
        title: lang.transl('_抓取多少页面'),
      })
    })

    // 显示不下载重复文件的提示
    const deduplicationHelp = this.form.querySelector(
      '#deduplicationHelp'
    ) as HTMLButtonElement
    deduplicationHelp.addEventListener('click', () => {
      msgBox.show(lang.transl('_不下载重复文件的提示'), {
        title: lang.transl('_不下载重复文件'),
      })
    })
  }

  /**绑定功能按钮，点击按钮后会执行特定操作 */
  private bindFunctionBtn() {
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
