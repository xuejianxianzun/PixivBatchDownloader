// 初始化首页
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { IDData } from '../store/StoreType'
import { Config } from '../config/Config'

class InitHomePage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private downIdButton: HTMLButtonElement = document.createElement('button')
  private downIdInput: HTMLTextAreaElement = document.createElement('textarea')
  private ready = false

  protected addCrawlBtns() {
    this.downIdButton = Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      lang.transl('_输入id进行抓取'),
      [['id', 'down_id_button']]
    )
  }

  protected addAnyElement() {
    // 用于输入id的输入框
    this.downIdInput.id = 'down_id_input'
    this.downIdInput.style.display = 'none'
    this.downIdInput.setAttribute(
      'placeholder',
      lang.transl('_输入id进行抓取的提示文字')
    )
    Tools.insertToHead<HTMLTextAreaElement>(this.downIdInput)

    Tools.addBtn(
      'otherBtns',
      Colors.bgGreen,
      lang.transl('_清空已保存的抓取结果')
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
          this.checkIdList()
        }
      },
      false
    )

    // 当输入框内容改变时检测，非空值时显示下载区域
    this.downIdInput.addEventListener('change', () => {
      if (this.downIdInput.value !== '') {
        this.ready = true
        window.setTimeout(() => {
          EVT.fire(EVT.list.openCenterPanel)
        }, 300)
        this.downIdButton.textContent = lang.transl('_开始抓取')
      } else {
        this.ready = false
        EVT.fire(EVT.list.closeCenterPanel)
        this.downIdButton.textContent = lang.transl('_输入id进行抓取')
      }
    })
  }

  protected checkIdList() {
    // 检查页面类型，设置输入的 id 的作品类型
    const type = window.location.pathname === '/novel/' ? 'novels' : 'unknown'

    // 把合法的 id 添加到 Set 结构里去重
    const array = this.downIdInput.value.split('\n')
    const idSet: Set<number> = new Set()
    for (const str of array) {
      const id = parseInt(str)
      if (isNaN(id) || id < 22 || id > Config.worksNumberLimit) {
        console.log(lang.transl('_id不合法') + ': ' + str)
      } else {
        idSet.add(id)
      }
    }

    // 添加 id
    const idList: IDData[] = []
    for (const id of idSet.values()) {
      idList.push({
        type: type,
        id: id.toString(),
      })
    }

    EVT.fire(EVT.list.downloadIdList, idList)
  }

  protected destroy() {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')
    this.downIdInput.remove()
  }
}

export { InitHomePage }
