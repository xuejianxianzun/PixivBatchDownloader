import { pageType, PageName } from '../PageType'
import { EVT } from '../EVT'
import { msgBox } from '../MsgBox'
import { setSetting, settings } from './Settings'
import { lang } from '../Language'
import { Tools } from '../Tools'

/**储存每个设置项里的一些元素 */
interface OptionElement {
  /**这个设置项在设置里的编号 */
  name: 'work' | 'page'
  /**这个设置项的选择器 */
  selector: string
  /**这个设置项的元素本身 */
  self: HTMLParagraphElement
  /**这个设置项里的 input 控件 */
  input: HTMLInputElement
  /**设置最小值的按钮 */
  minBtn: HTMLButtonElement
  /**设置最大值的按钮 */
  maxBtn: HTMLButtonElement
  /**显示提示信息的元素 */
  tip: HTMLSpanElement
}

/**管理抓取数量，也就是抓取选项卡里的两个设置：抓取多少作品/抓取多少页面 */
class CrawlNumber {
  constructor() {
    setTimeout(() => {
      this.getElements()
      this.setOption()
    }, 0)

    this.bindEvents()
  }

  /** 抓取多少作品的设置  */
  private work: OptionElement = {
    name: 'work',
    selector: 'p.option[data-no="0"]',
    self: null!,
    input: null!,
    minBtn: null!,
    maxBtn: null!,
    tip: null!,
  }

  /** 抓取多少页面的设置  */
  private page: OptionElement = {
    name: 'page',
    selector: 'p.option[data-no="1"]',
    self: null!,
    input: null!,
    minBtn: null!,
    maxBtn: null!,
    tip: null!,
  }

  private getElements() {
    ;[this.work, this.page].forEach((item) => {
      // 获取每个设置的元素
      item.self = document.querySelector(item.selector) as HTMLParagraphElement
      item.input = item.self.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement
      item.minBtn = item.self.querySelector(
        'button[role="setMin"]'
      ) as HTMLButtonElement
      item.maxBtn = item.self.querySelector(
        'button[role="setMax"]'
      ) as HTMLButtonElement
      item.tip = item.self.querySelector('span[role="tip"]') as HTMLSpanElement

      // 绑定 input 变化时的事件
      item.input.addEventListener('change', () => {
        const cfg = this.getCfg()
        // 检查其有效性
        let v = Number.parseInt(item.input.value)
        if (Number.isNaN(v)) {
          v = cfg.value
        }
        // 当 max 为 -1 时，取值范围为 -1 或者大于等于 min
        if (cfg.max === -1) {
          if (v < cfg.min && v !== -1) {
            v = cfg.min
          }
        } else {
          // 如果 max 不是 -1，则取值范围为 min 到 max 之间
          if (v < cfg.min || v > cfg.max) {
            v = cfg.min
          }
        }
        item.input.value = v.toString()
        // 更新设置
        if (v !== cfg.value) {
          cfg.value = v
          setSetting('crawlNumber', settings.crawlNumber)
        }
      })

      // 为设置最小值按钮绑定事件
      item.minBtn.onclick = () => {
        item.input.value = item.minBtn.textContent!.toString()
        item.input.dispatchEvent(new Event('change'))
      }

      // 为设置最大值按钮绑定事件
      item.maxBtn.onclick = () => {
        item.input.value = item.maxBtn.textContent!.toString()
        item.input.dispatchEvent(new Event('change'))
      }
    })
  }

  private getCfg() {
    const cfg = settings.crawlNumber[pageType.type]
    if (cfg === undefined) {
      const msg = 'Error: Failed to get crawlNumber configuration!'
      msgBox.error(msg)
      throw new Error(msg)
    }
    // console.log(JSON.stringify(cfg))

    return cfg
  }

  /**显示或隐藏设置，并设置内部一些元素的值 */
  private setOption() {
    const cfg = this.getCfg()
    ;[this.work, this.page].forEach((item) => {
      if (cfg[item.name]) {
        item.self.style.display = 'flex'

        // 在搜索页面里，页数的最大值有两种情况：
        // 如果用户不是 Pixiv 会员（高级用户），最大值是 1000。如果是会员，则最大值是 5000。
        // cfg 里的最大值固定为 5000，但是在显示范围提示时，根据实际情况显示
        let max = cfg.max
        let tip = cfg.tip
        if (
          pageType.type === PageName.ArtworkSearch ||
          pageType.type === PageName.NovelSearch
        ) {
          const isPremium = Tools.isPremium()
          max = isPremium ? 5000 : 1000
          tip = `1 - ${max}`
        }

        // 在排行榜页面里
        if (
          pageType.type === PageName.ArtworkRanking ||
          pageType.type === PageName.NovelRanking
        ) {
          // 如果分类为 R-18，则只有 100 个作品
          if (
            location.href.includes('mode=weekly_r18') ||
            location.href.includes('mode=daily_r18')
          ) {
            max = 100
            tip = `1 - ${max}`
          }
          // 如果分类为 R-18G，或者 AI 日榜，则只有 50 个作品
          if (
            location.href.includes('mode=r18g') ||
            location.href.includes('mode=daily_ai') ||
            location.href.includes('mode=daily_r18_ai')
          ) {
            max = 50
            tip = `1 - ${max}`
          }
        }

        // 如果默认的最大值不是 -1 而是具体的数字，并且之前保存的值大于当前页面的最大值，则将其改为当前页面的最大值
        if (max !== -1 && cfg.value > max) {
          cfg.value = max
          setSetting('crawlNumber', settings.crawlNumber)
        }

        item.input.value = cfg.value.toString()
        item.minBtn.textContent = cfg.min.toString()
        item.maxBtn.textContent = max.toString()

        // 设置提示范围的文字
        // 如果以下划线 _ 开头，则需要翻译
        if (tip.startsWith('_')) {
          lang.updateText(item.tip, tip)
        } else {
          lang.updateText(item.tip, '')
          item.tip.textContent = tip
        }
      } else {
        item.self.style.display = 'none'
      }
    })
  }

  private bindEvents() {
    // 页面初始化时，重设两个设置
    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      setTimeout(() => {
        this.setOption()
      }, 0)
    })
  }
}

new CrawlNumber()
