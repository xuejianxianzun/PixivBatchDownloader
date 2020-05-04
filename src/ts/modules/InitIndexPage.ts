// 初始化首页
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { centerPanel } from './CenterPanel'

import { options } from './Options'
import { DOM } from './DOM'
import { store } from './Store'
import { log } from './Log'

class InitIndexPage extends InitPageBase {
  constructor() {
    super()
    this.downIdButton = document.createElement('button')
    this.downIdInput = document.createElement('textarea')
    this.init()
  }

  private downIdButton: HTMLButtonElement
  private downIdInput: HTMLTextAreaElement
  private ready = false

  protected appendCenterBtns() {
    this.downIdButton = DOM.addBtn(
      'crawlBtns',
      Colors.blue,
      lang.transl('_输入id进行抓取'),
      [['id', 'down_id_button']]
    )
  }

  protected appendElseEl() {
    // 用于输入id的输入框
    this.downIdInput.id = 'down_id_input'
    this.downIdInput.style.display = 'none'
    this.downIdInput.setAttribute(
      'placeholder',
      lang.transl('_输入id进行抓取的提示文字')
    )
    DOM.insertToHead<HTMLTextAreaElement>(this.downIdInput)
  }

  protected setFormOption() {
    options.hideOption([1])
  }

  protected initElse() {
    this.downIdButton.addEventListener(
      'click',
      () => {
        if (!this.ready) {
          // 还没准备好
          centerPanel.close()
          this.downIdInput.style.display = 'block'
          this.downIdInput.focus()
          document.documentElement.scrollTop = 0
        } else {
          this.readyCrawl()
        }
      },
      false
    )

    // 当输入框内容改变时检测，非空值时显示下载区域
    this.downIdInput.addEventListener('change', () => {
      if (this.downIdInput.value !== '') {
        this.ready = true
        centerPanel.show()
        this.downIdButton.textContent = lang.transl('_开始抓取')
      } else {
        this.ready = false
        centerPanel.close()
        this.downIdButton.textContent = lang.transl('_输入id进行抓取')
      }
    })
  }

  protected nextStep() {
    // 在主页通过id抓取时，不需要获取列表页，直接完成
    log.log(lang.transl('_开始获取作品页面'))
    this.getIdList()
  }

  protected getWantPage() {}

  protected getIdList() {
    // 检查 id
    const tempSet = new Set(this.downIdInput.value.split('\n'))
    const idValue = Array.from(tempSet)
    for (const id of idValue) {
      // 如果有 id 不是数字，或者处于非法区间，中止任务
      const nowId = parseInt(id)
      if (isNaN(nowId) || nowId < 22 || nowId > 99999999) {
        log.error(lang.transl('_id不合法'), 0, false)
      } else {
        store.idList.push({
          type: 'unkown',
          id: nowId.toString(),
        })
      }
    }
    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {}

  protected destroy() {
    DOM.clearSlot('crawlBtns')
    DOM.clearSlot('otherBtns')
    DOM.removeEl(this.downIdInput)
  }
}

export { InitIndexPage }
