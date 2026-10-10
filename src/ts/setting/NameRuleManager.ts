import { Config } from '../Config'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { pageType } from '../PageType'
import { states } from '../store/States'
import { toast } from '../Toast'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'
import { settings, setSetting } from './Settings'

// 管理命名规则
// 作为“图像作品的命名规则”和“小说的命名规则”设置的代理，保存命名规则，并应用“在不同的页面类型中使用不同的命名规则”设置
// 其他类必须使用这个模块来存取命名规则
class NameRuleManager {
  constructor(type: 'artwork' | 'novel') {
    this.type = type
    this.ruleList =
      type === 'artwork'
        ? 'nameRuleForEachPageType'
        : 'nameRuleForEachPageTypeForNovel'
    this.ruleSetting =
      type === 'artwork' ? 'userSetName' : 'userSetNameForNovel'
    this.defaultRule =
      type === 'artwork'
        ? Config.defaultNameRuleForArtwork
        : Config.defaultNameRuleForNovel

    this.bindEvents()
    this.bindInputEvent()
  }

  private bindEvents() {
    const evts = [
      EVT.list.settingInitialized,
      EVT.list.resetSettingsEnd,
      EVT.list.pageSwitchedTypeChange,
    ]
    evts.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.setInputValue()
      })
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (
        data.name === 'setNameRuleForEachPageType' ||
        data.name === this.ruleSetting ||
        data.name === this.ruleList
      ) {
        this.scheduleSetInputValue()
      }
    })
  }

  private type: 'artwork' | 'novel'
  private ruleList:
    | 'nameRuleForEachPageType'
    | 'nameRuleForEachPageTypeForNovel'
  private ruleSetting: 'userSetName' | 'userSetNameForNovel'
  private defaultRule: string
  private textarea: HTMLTextAreaElement | null = null
  /** 提示「命名规则里必须含有序号」的元素。它默认带有 is-hidden，
   * 只有图像作品的命名规则需要做这个检查（见 Tools.checkNameRule） */
  private nameRuleIndexTip: HTMLElement | null = null
  /** 合并同一批设置变化后的输入框刷新 */
  private setInputValueTimer = 0

  public get rule() {
    // 在 Pixivision 页面里，总是使用预设的命名规则
    if (pageType.type === pageType.list.Pixivision) {
      return settings[this.ruleList][pageType.type]
    }

    if (settings.setNameRuleForEachPageType) {
      let rule = settings[this.ruleList][pageType.type]
      if (rule === undefined) {
        rule = this.defaultRule
        this.saveCurrentPageRule(rule)
      }
      return rule
    } else {
      return settings[this.ruleSetting]
    }
  }

  public set rule(str: string) {
    if (pageType.type === pageType.list.Pixivision) {
      return
    }

    // 检查传递的命名规则的合法性
    let check = true

    this.updateNameRuleIndexTip(str)

    // 对于小说的命名规则，可以只使用 {follow_artwork}，表示跟随图像作品的命名规则
    if (this.type === 'novel' && str.includes('{follow_artwork}')) {
      check = true
    } else {
      // 如果是图像作品的命名规则，或者是小说的命名规则里没有使用 {follow_artwork}
      // 为了防止文件名重复，命名规则里必须包含 {id} 或者 {pid}{p} 或者 {id_num}{p_num}
      check = Tools.checkNameRule(str)
    }

    if (!check) {
      window.setTimeout(() => {
        toast.error(lang.transl('_缺少必须的标记本次修改未保存'), {
          stay: 3000,
        })
      }, 300)
    } else {
      // 检查通过，替换特殊字符
      str = this.handleUserSetName(str) || this.defaultRule
      setSetting(this.ruleSetting, str)
      Tools.setRows(this.textarea)

      toast.success(lang.transl('_已保存修改'))

      if (settings.setNameRuleForEachPageType) {
        this.saveCurrentPageRule(str)
      }

      this.setInputValue()
    }
  }

  private async bindInputEvent() {
    await states.waitSettingInitialized()

    const name = this.type === 'artwork' ? 'userSetName' : 'userSetNameForNovel'
    this.textarea = document.querySelector(`textarea[name="${name}"]`)
    this.setInputValue()

    const input = this.textarea!
    // 保存事件被触发之前的值
    let lastValue = input.value

    // 图像作品的命名规则必须含有序号，否则文件名可能重复。
    // 在输入过程中就实时检查并提示，用户不必等到保存时才发现规则不合法
    this.nameRuleIndexTip = document.querySelector('#tipNameRuleMustHaveIndex')
    // 首次绑定时先检查一次：输入框里可能已经是一条不含序号的规则
    this.updateNameRuleIndexTip(input.value)

    // 只用 input 事件：它在每次输入时都会触发，
    // 而 change 事件要等输入框失去焦点才触发，做不到实时
    input.addEventListener('input', () => {
      // 直接从输入框取值，此时这个规则还没有被保存
      this.updateNameRuleIndexTip(input.value)
    })

    // 给输入框绑定事件
    const eventList = ['change', 'focus']
    // change 事件只对用户手动输入有效
    // 当用户从下拉框添加一个命名标记时，不会触发 change 事件，需要监听 focus 事件
    eventList.forEach((ev) => {
      input.addEventListener(ev, () => {
        // 当事件触发时，比较输入框的值是否与事件触发之前发生了变化
        // 如果值没有变化，就什么都不做
        // 对于 change 事件来说，值必然发生了变化，但是 focus 就不一定了
        // 试想：用户修改命名规则为非法的规则，例如输入 111，触发 change 事件之后下载器会提示命名规则非法
        // 然后用户点击输入框（focus 事件）想要修改规则，此时值没有变化，就不应该执行后续代码。如果依然执行后续代码，那么每当用户点击输入框，下载器就会马上显示提示，这导致用户根本没办法在输入框里修改命名规则
        if (input.value === lastValue) {
          return
        }
        lastValue = input.value

        // 从下拉框添加命名标记时不会触发 input 事件，所以这里也要刷新一次提示
        this.updateNameRuleIndexTip(input.value)

        // 当开启“为每个页面类型使用不同的命名规则”时，当前页面类型的规则才是生效的规则；
        // 否则生效的是 userSetName（或 userSetNameForNovel），这里必须与它比较
        const effectiveRule = settings.setNameRuleForEachPageType
          ? settings[this.ruleList][pageType.type]
          : settings[this.ruleSetting]
        if (effectiveRule !== input.value) {
          this.rule = input.value
        }
      })
    })
  }

  /** 根据命名规则的值，显示或隐藏「命名规则里必须含有序号」的提示
   *
   * @param str 命名规则。通常是输入框里的当前值，而不是已保存的设置 ——
   * 用户输入途中也要检查，而那时这个规则还没有保存
   *
   * 只有图像作品的命名规则需要做这个检查，小说会直接隐藏提示 */
  private updateNameRuleIndexTip(str: string) {
    if (this.type !== 'artwork' || !this.nameRuleIndexTip) {
      return
    }

    this.nameRuleIndexTip.classList.toggle(
      'is-hidden',
      Tools.checkNameRule(str)
    )
  }

  // 设置输入框的值为当前命名规则
  private async setInputValue() {
    if (!this.textarea) {
      return
    }
    await states.waitSettingInitialized()

    // 在 Pixivision 里，不会保存对命名规则的修改，以避免影响其他页面类型
    // 这是因为：如果用户没有启用“为每个页面类型设置命名规则”，就会影响到其他页面类型里使用的命名规则
    if (pageType.type === pageType.list.Pixivision) {
      this.textarea.value = settings[this.ruleList][pageType.type]
      this.updateNameRuleIndexTip(this.textarea.value)
      return
    }

    // 如果 settings[this.ruleList] 里面没有当前页面的 key，值就是 undefined，需要设置为默认值
    const rule = this.rule
    this.textarea.value = rule

    // 这里是程序化赋值，不会触发 input 事件，所以必须手动刷新一次提示
    // （切换页面类型、一批设置变化之后都会走这里）
    this.updateNameRuleIndexTip(rule)

    Tools.setRows(this.textarea)
  }

  /** 在同一批设置变化完成后刷新命名规则输入框 */
  private scheduleSetInputValue() {
    window.clearTimeout(this.setInputValueTimer)
    this.setInputValueTimer = window.setTimeout(() => {
      this.setInputValue()
    }, 0)
  }

  private saveCurrentPageRule(rule: string) {
    settings[this.ruleList][pageType.type] = rule
    setSetting(this.ruleList, settings[this.ruleList])
  }

  // 处理命名规则的非法字符和非法规则
  // 这里不必处理得非常详尽，因为在生成文件名时，还会对结果进行处理
  // 测试用例：在作品页面内设置下面的命名规则，下载器会自动进行更正
  // /{page_tag}/|/{user}////<//{rank}/{px}/{sl}/{page_tag}///{id}-{user}-{user_id}""-?{tags_transl_only}////
  private handleUserSetName(str: string) {
    // 替换命名规则里可能存在的非法字符
    str = Utils.replaceUnsafeStr(str, true)

    // 处理连续的 /
    str = str.replace(/\/{2,100}/g, '/')

    // 如果命名规则头部或者尾部是 / 则去掉
    if (str.startsWith('/')) {
      str = str.replace('/', '')
    }
    if (str.endsWith('/')) {
      str = str.substring(0, str.length - 1)
    }

    return str
  }
}

const managerArtwork = new NameRuleManager('artwork')
const managerNovel = new NameRuleManager('novel')

function getRule(type: 'artwork' | 'novel') {
  const artworkRule = managerArtwork.rule
  const novelRule = managerNovel.rule
  if (type === 'artwork') {
    return artworkRule
  } else {
    return novelRule.replace('{follow_artwork}', artworkRule)
  }
}

function setRule(type: 'artwork' | 'novel', rule: string) {
  if (type === 'artwork') {
    managerArtwork.rule = rule
  } else {
    managerNovel.rule = rule
  }
}

const nameRuleManager = {
  getRule,
  setRule,
}

export { nameRuleManager }
