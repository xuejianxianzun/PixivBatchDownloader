import { EVT } from '../EVT'
import { lang } from '../Language'
import { theme } from '../Theme'
import { Tools } from '../Tools'
import { toast } from '../Toast'
import { DateFormat } from '../utils/DateFormat'
import { Utils } from '../utils/Utils'
import { optionsHtml } from './OptionsHtml'
import { hideOptions } from './HideOptions'
import { pinOption } from './PinOptions'
import { showOptionsNewFlag } from './ShowOptionsNewFlag'
import { CrawlNumber } from './CrawlNumber'
import { FormBeautify } from './FormBeautify'
import { FormHelpManager } from './FormHelpManager'
import { FormSettings } from './FormSettings'
import { SaveNamingRule } from './SaveNamingRule'
import { setSetting, settings } from './Settings'
import { FormType } from './FormType'
import { SettingsPanel } from './SettingsPanel'

/** 设置系统入口：创建 form，并装配所有依赖 form 的模块 */
class SettingsPanelBootstrap {
  constructor() {
    const formHtml = `<form class="settingForm">${optionsHtml}</form>`
    this.form = Tools.useSlot('form', formHtml) as FormType

    this.initModules()
    this.bindFormEvents()
    this.bindFunctionButtons()
    this.bindCopyEvents()

    window.addEventListener(EVT.list.langChange, () => {
      this.bindCopyEvents()
    })
  }

  private form: FormType

  private initModules() {
    const allOptions = this.form.querySelectorAll(
      '.option'
    ) as NodeListOf<HTMLDivElement>

    theme.register(this.form)
    lang.register(this.form)
    pinOption.init(allOptions)
    showOptionsNewFlag.init(allOptions)
    hideOptions.init(allOptions)
    new CrawlNumber()
    this.bindClickOptionCardToToggleSwitch(allOptions)

    new SaveNamingRule(this.form.userSetName, 'artwork')
    new SaveNamingRule(this.form.userSetNameForNovel, 'novel')
    new FormSettings(this.form)
    new FormBeautify(this.form)
    new SettingsPanel(this.form)
    new FormHelpManager(this.form)
  }

  private bindFormEvents() {
    // 点击下拉框里的选项时，自动把该选项插入到输入框里光标所在的位置
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
          const position = input.selectionStart!
          input.value =
            input.value.substring(0, position) +
            select.value +
            input.value.substring(position)
          input.selectionStart = position + select.value.length
          input.selectionEnd = position + select.value.length
          input.focus()
          select.value = 'default'
        }
      })
    })

    // 点击“投稿时间”里的“现在”按钮时，自动把当前时间填入输入框
    const setNowBtns = this.form.querySelectorAll(
      'button[role="setDate"]'
    ) as NodeListOf<HTMLButtonElement>
    for (const btn of setNowBtns) {
      btn.addEventListener('click', () => {
        const name = btn.dataset.for as 'postDateStart' | 'postDateEnd'
        const input = this.form.querySelector(
          `input[name="${name}"]`
        ) as HTMLInputElement
        if (!input) {
          return
        }

        const flag = btn.dataset.value!
        let value = flag
        if (flag === 'now') {
          value = DateFormat.format(new Date(), 'YYYY-MM-DDThh:mm')
        }
        input.value = value
        setSetting(name, value)
      })
    }
  }

  private bindFunctionButtons() {
    // 点击触发事件的按钮时，触发对应的自定义事件
    const eventBtns = document.querySelectorAll(
      '.fireEvent'
    ) as NodeListOf<HTMLButtonElement>

    eventBtns.forEach((btn) => {
      const eventName = btn.dataset.event
      if (!eventName) {
        return
      }

      btn.addEventListener('click', () => {
        EVT.fire(eventName as any)
      })
    })
  }

  /** 点击命名规则的帮助内容里的命名标记时，复制这个标记 */
  private bindCopyEvents() {
    const allName = this.form.querySelectorAll(
      '.namingTipArea .name'
    ) as NodeListOf<HTMLElement>

    for (const el of allName) {
      if (el.dataset.bindCopy) {
        continue
      }

      el.dataset.bindCopy = 'true'
      el.addEventListener('click', async () => {
        const text = el.textContent
        if (!text) {
          return
        }

        const copied = await Utils.writeClipboardText(text)
        if (copied) {
          toast.success(lang.transl('_已复制'))
        } else {
          toast.error(lang.transl('_复制失败'))
        }
      })
    }
  }

  /** 点击设置项的卡片时，如果它有一个 checkBox 开关，那么就切换该设置的启用/禁用状态 */
  private bindClickOptionCardToToggleSwitch(
    allOptions: NodeListOf<HTMLElement>
  ) {
    allOptions.forEach((option) => {
      Utils.click(option, (ev) => {
        if (!settings.clickOptionCardToToggleSwitch) {
          return
        }

        if (!(ev.target instanceof HTMLElement)) {
          return
        }
        const target = ev.target

        // 只在点击该设置卡片上的空白区域时才切换开关状态，以避免和卡片上其他元素的事件发生冲突
        // 匹配两种点击的元素：
        // 1. 点击了卡片本身，说明点击在了卡片的空白区域上
        // 2. 点击了子选项容器，这表示该设置已经启用，所以子选项容器显示了出来。此时点击空白处，大概率是点击到了子选项容器上。
        // PS: 不管该设置是否启用，都可以点击到卡片上.只不过子选项容器显示之后，可点击到卡片的区域很小.
        if (
          target === option ||
          target.matches('.subOptionWrap') ||
          target.matches('.optionLine')
        ) {
          // 只查找第一个开关，因为设置的总开关始终是第一个
          const switchEl = option.querySelector(
            'input.need_beautify.checkbox_switch'
          ) as HTMLElement
          if (!switchEl) {
            return
          }

          // 但是有些设置本身没有总开关，子选项里却有开关(例如"标签别名")，所以第一个开关可能是子选项里的开关，需要进一步判断
          // 要求这个 input 的前一个元素是 a.settingNameStyle 标签(也就是设置名称)，这样才能确保它是总开关，而不是子选项的开关
          // 现在我没有执行这个判断（这是有意为之的），这意味着：
          // 点击这个设置卡片的空白区域时，总是会切换第一个开关(不管它是总开关还是子开关)
          switchEl.click()
        }
      })
    })
  }
}

new SettingsPanelBootstrap()
