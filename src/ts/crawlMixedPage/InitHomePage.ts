// 初始化首页
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'
import { options } from '../setting/Options'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { IDData } from '../store/StoreType'
import { Config } from '../config/Config'
import { toast } from '../Toast'
import { theme } from '../Theme'

class InitHomePage extends InitPageBase {
  constructor() {
    super()
    this.init()
    this.idRangeTip = this.createidRangeTip()
  }

  private downIdButton: HTMLButtonElement = document.createElement('button')
  private downIdInput: HTMLTextAreaElement = document.createElement('textarea')
  private ready = false

  private idRangeTip: HTMLDivElement

  protected addCrawlBtns() {
    this.downIdButton = Tools.addBtn(
      'crawlBtns',
      Colors.bgBlue,
      '_输入id进行抓取'
    )
    this.downIdButton.id = 'down_id_button'

    const crawlIdRange = Tools.addBtn('crawlBtns', Colors.bgBlue, '_抓取id区间')
    crawlIdRange.addEventListener('click', () => {
      this.crawlIdRange()
    })
  }

  protected addAnyElement() {
    // 用于输入id的输入框
    this.downIdInput.id = 'down_id_input'
    this.downIdInput.style.display = 'none'
    this.downIdInput.setAttribute(
      'data-xzplaceholder',
      '_输入id进行抓取的提示文字'
    )
    document.body.insertAdjacentElement('beforebegin', this.downIdInput)

    lang.register(this.downIdInput)

    Tools.addBtn(
      'otherBtns',
      Colors.bgGreen,
      '_清空已保存的抓取结果'
    ).addEventListener('click', () => {
      EVT.fire('clearSavedCrawl')
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
          EVT.fire('closeCenterPanel')
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
          EVT.fire('openCenterPanel')
        }, 300)
        lang.updateText(this.downIdButton, '_开始抓取')
      } else {
        this.ready = false
        EVT.fire('closeCenterPanel')
        lang.updateText(this.downIdButton, '_输入id进行抓取')
      }
    })
  }

  // 单独添加一个用于提示 id 范围的元素，因为上面的日志显示在日志区域的顶端，不便于查看
  private createidRangeTip(): HTMLDivElement {
    const div = document.createElement('div')
    div.classList.add('id_range_tip', 'beautify_scrollbar', 'logWrap')
    theme.register(div)
    return document.body.insertAdjacentElement(
      'beforebegin',
      div
    )! as HTMLDivElement
  }

  // 把合法的 id 添加到数组里
  private checkIdList() {
    // 不必去重，因为 store 存储抓取结果时会去重
    const array = this.downIdInput.value.split('\n')
    const result: string[] = []
    for (const str of array) {
      const id = parseInt(str)
      if (isNaN(id) || id < 22 || id > Config.worksNumberLimit) {
        console.log(lang.transl('_id不合法') + ': ' + str)
      } else {
        result.push(id.toString())
      }
    }

    this.addIdList(result)
  }

  private crawlIdRange() {
    let start = 0
    let end = 0

    // 接收起点
    const startInput = window.prompt(
      lang.transl('_抓取id区间说明') + '\n' + lang.transl('_抓取id区间起点'),
      '0'
    )
    if (startInput) {
      const num = Number.parseInt(startInput)
      if (!isNaN(num) && num >= 0) {
        start = num
      } else {
        return toast.error(lang.transl('_参数不合法'))
      }
    } else {
      return
    }

    // 接收终点
    const endInput = window.prompt(lang.transl('_抓取id区间终点'), '1')
    if (endInput) {
      const num = Number.parseInt(endInput)
      if (!isNaN(num) && num > start) {
        end = num
      } else {
        return toast.error(lang.transl('_参数不合法'))
      }
    } else {
      return
    }

    // 提示抓取范围，便于用户分批次抓取的时候查看
    const tip = lang.transl('_抓取id区间') + `: ${start} - ${end}`
    this.idRangeTip.textContent = tip
    this.idRangeTip.style.display = 'block'
    // 不要在这里使用 log.log ，因为之后开始抓取时，日志区域会被清空，所以用户在日志区域里看不到这个提示

    // 生成 id 列表
    const ids: string[] = []
    while (start <= end) {
      ids.push(start.toString())
      start++
    }

    this.addIdList(ids)

    toast.success(lang.transl('_开始抓取'))
  }

  // 把 id 列表添加到 store 里，然后开始抓取
  private addIdList(ids: string[]) {
    // 检查页面类型，设置输入的 id 的作品类型
    const type = window.location.pathname === '/novel/' ? 'novels' : 'unknown'

    const idList: IDData[] = []
    for (const id of ids) {
      idList.push({
        type: type,
        id: id,
      })
    }

    EVT.fire('crawlIdList', idList)
  }

  protected destroy() {
    Tools.clearSlot('crawlBtns')
    Tools.clearSlot('otherBtns')
    this.downIdInput.remove()
  }
}

export { InitHomePage }
