import { EVT } from '../EVT'
import { lang } from '../Language'
import { LangTextKey } from '../langText'
import { FormType } from './FormType'
import { Utils } from '../utils/Utils'
import { msgBox } from '../MsgBox'
import { store } from '../store/Store'

/** 管理表单里的一些帮助信息 */
class FormHelpManager {
  constructor(form: FormType) {
    this.form = form
    this.downloadEmptyHint = this.form.querySelector(
      '.secondary_hint'
    ) as HTMLDivElement | null

    this.toggleHelpArea()
    this.showMsgWhenClickBtn()
    this.bindDownloadEmptyHint()
  }

  private form: FormType

  private downloadEmptyHint: HTMLDivElement | null = null

  /**点击一些按钮时，切换显示对应的提示区域 */
  private toggleHelpArea() {
    const btns = this.form.querySelectorAll(
      '.toggleArea'
    ) as NodeListOf<HTMLButtonElement>
    btns.forEach((btn) => {
      const targetSelector = btn.dataset.toggleTarget!
      const tipEl = document.querySelector(targetSelector) as HTMLElement
      btn.addEventListener('click', () => {
        // 切换显示提示区域
        Utils.toggleEl(tipEl)
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

  private bindDownloadEmptyHint() {
    if (!this.downloadEmptyHint) {
      return
    }

    if (store.result.length > 0) {
      this.hideDownloadEmptyHint()
    }

    window.addEventListener(EVT.list.crawlStart, () => {
      this.hideDownloadEmptyHint()
    })

    for (const ev of [
      EVT.list.crawlComplete,
      EVT.list.resultChange,
      EVT.list.resume,
    ]) {
      window.addEventListener(ev, () => {
        this.hideDownloadEmptyHint()
      })
    }
  }

  private hideDownloadEmptyHint() {
    this.downloadEmptyHint?.classList.add('is-hidden')
  }
}

export { FormHelpManager }
