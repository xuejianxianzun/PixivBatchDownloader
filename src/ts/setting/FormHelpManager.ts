import { EVT } from '../EVT'
import { lang } from '../Language'
import { LangTextKey } from '../langText'
import { SettingsForm } from './SettingsForm'
import { setSetting, SettingKeys } from '../setting/Settings'
import { Utils } from '../utils/Utils'
import { msgBox } from '../MsgBox'

/** 管理表单里的帮助信息 */
class FormHelpManager {
  constructor(form: SettingsForm) {
    this.form = form

    this.displayTipArea()
    this.toggleHelpArea()
    this.showMsgWhenClickBtn()
  }

  private form: SettingsForm

  /** 有些提示区域是默认显示的，用户点击“我知道了”按钮之后改为隐藏 */
  private readonly tipAreaConfig: { key: SettingKeys; selector: string }[] = [
    {
      key: 'tipPinOption',
      selector: 'p#tipPinOption',
    },
    {
      key: 'tipCloseAskFileSaveLocation',
      selector: 'p#tipCloseAskFileSaveLocation',
    },
    {
      key: 'tipOpenWikiLink',
      selector: 'p#tipOpenWikiLinkWrap',
    },
  ]

  /** 根据设置来显示或隐藏一些提示 */
  private displayTipArea() {
    this.tipAreaConfig.forEach((item) => {
      const el: HTMLElement = document.querySelector(
        item.selector
      ) as HTMLElement
      if (el) {
        // 点击“我知道了”按钮之后隐藏提示区域
        const btn = el.querySelector('button')
        btn!.addEventListener('click', () => {
          setSetting(item.key, false)
          el.style.display = 'none'
        })

        // 监听设置变化
        window.addEventListener(
          EVT.list.settingChange,
          (ev: CustomEventInit) => {
            const data = ev.detail.data as any
            if (data.name === item.key) {
              el.style.display = data.value ? 'block' : 'none'
            }
          }
        )
      }
    })
  }

  /**点击一些按钮时，切换显示对应的帮助区域 */
  private toggleHelpArea() {
    const btns = this.form.querySelectorAll(
      '.toggleArea'
    ) as NodeListOf<HTMLButtonElement>
    btns.forEach((btn) => {
      const targetSelector = btn.dataset.toggleTarget!
      const target = document.querySelector(targetSelector) as HTMLElement
      btn.addEventListener('click', () => {
        Utils.toggleEl(target)
      })
    })
  }

  /**点击一些按钮时，通过 msgBox 显示帮助 */
  private showMsgWhenClickBtn() {
    const btns = this.form.querySelectorAll(
      '.showMsgBtn'
    ) as NodeListOf<HTMLButtonElement>
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const title = btn.dataset.title! as LangTextKey
        const msg = btn.dataset.msg! as LangTextKey
        msgBox.show(lang.transl(msg), {
          title: lang.transl(title),
        })
      })
    })
  }
}

export { FormHelpManager }
