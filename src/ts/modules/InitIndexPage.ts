// 初始化首页
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { options } from './setting/Options'
import { DOM } from './DOM'
import { store } from './Store'
import { log } from './Log'
import { EVT } from './EVT'

class InitIndexPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private downIdButton: HTMLButtonElement = document.createElement('button')
  private downIdInput: HTMLTextAreaElement = document.createElement('textarea')
  private ready = false

  protected addCrawlBtns() {
    this.downIdButton = DOM.addBtn(
      'crawlBtns',
      Colors.blue,
      lang.transl('_输入id进行抓取'),
      [['id', 'down_id_button']],
    )
  }

  protected addAnyElement() {
    // 用于输入id的输入框
    this.downIdInput.id = 'down_id_input'
    this.downIdInput.style.display = 'none'
    this.downIdInput.setAttribute(
      'placeholder',
      lang.transl('_输入id进行抓取的提示文字'),
    )
    DOM.insertToHead<HTMLTextAreaElement>(this.downIdInput)

    DOM.addBtn(
      'otherBtns',
      Colors.green,
      lang.transl('_清空已保存的抓取结果'),
    ).addEventListener('click', () => {
      EVT.fire(EVT.list.clearSavedCrawl)
    })
  }

  protected setFormOption() {
    options.hideOption([1])
  }

  protected initAny() {
    this.downIdButton.addEventListener(
      'click',
      () => {
        if (!this.ready) {
          // 还没准备好
          EVT.fire(EVT.list.closeCenterPanel)
          this.downIdInput.style.display = 'block'
          this.downIdInput.focus()
          document.documentElement.scrollTop = 0
        } else {
          this.readyCrawl()
        }
      },
      false,
    )

    // 当输入框内容改变时检测，非空值时显示下载区域
    this.downIdInput.addEventListener('change', () => {
      if (this.downIdInput.value !== '') {
        this.ready = true
        EVT.fire(EVT.list.openCenterPanel)
        this.downIdButton.textContent = lang.transl('_开始抓取')
      } else {
        this.ready = false
        EVT.fire(EVT.list.closeCenterPanel)
        this.downIdButton.textContent = lang.transl('_输入id进行抓取')
      }
    })
  }

  protected getWantPage() {}

  protected getIdList() {
    // 检查页面类型，设置输入的 id 的作品类型
    const type = window.location.pathname === '/novel/' ? 'novels' : 'unknown'

    // 检测 id 是否合法
    const array = this.downIdInput.value.split('\n')
    const idSet: Set<number> = new Set()
    for (const str of array) {
      const id = parseInt(str)
      if (isNaN(id) || id < 22 || id > 99999999) {
        // 对不符合要求的 id 显示提示。如果 id 是空字符串则不显示提示
        str !== '' && log.error(lang.transl('_id不合法') + ': ' + str)
      } else {
        idSet.add(id)
      }
    }

    // 添加 id
    for (const id of idSet.values()) {
      store.idList.push({
        type: type,
        id: id.toString(),
      })
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
