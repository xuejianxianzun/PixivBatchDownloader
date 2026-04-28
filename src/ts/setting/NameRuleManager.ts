import { Config } from '../Config'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { msgBox } from '../MsgBox'
import { pageType } from '../PageType'
import { states } from '../store/States'
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
    this.defauleRule =
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
      // 当用户开启这个开关时，设置当前页面类型的命名规则
      if (data.name === 'setNameRuleForEachPageType' && data.value) {
        if (
          settings[this.ruleList][pageType.type] !== settings[this.ruleSetting]
        ) {
          this.setInputValue()
        }
      }
    })
  }

  private type: 'artwork' | 'novel'
  private ruleList:
    | 'nameRuleForEachPageType'
    | 'nameRuleForEachPageTypeForNovel'
  private ruleSetting: 'userSetName' | 'userSetNameForNovel'
  private defauleRule: string
  private textarea: HTMLTextAreaElement | null = null

  public get rule() {
    // 在 Pixivision 页面里，总是使用预设的命名规则
    if (pageType.type === pageType.list.Pixivision) {
      return settings[this.ruleList][pageType.type]
    }

    if (settings.setNameRuleForEachPageType) {
      let rule = settings[this.ruleList][pageType.type]
      if (rule === undefined) {
        rule = this.defauleRule
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

    // 对于小说的命名规则，可以只使用 {follow_artwork}，表示跟随图像作品的命名规则
    if (this.type === 'novel' && str.includes('{follow_artwork}')) {
      check = true
    } else {
      // 如果是图像作品的命名规则，或者是小说的命名规则里没有使用 {follow_artwork}
      // 为了防止文件名重复，命名规则里必须包含 {id} 或者 {pid}{p}
      check =
        str.includes('{id}') || (str.includes('{pid}') && str.includes('{p}'))
    }

    if (!check) {
      window.setTimeout(() => {
        msgBox.error(lang.transl('_命名规则一定要包含id'))
      }, 300)
    } else {
      // 检查通过，替换特殊字符
      str = this.handleUserSetName(str) || this.defauleRule
      setSetting(this.ruleSetting, str)
      Tools.setRows(this.textarea)

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
        if (settings[this.ruleList][pageType.type] !== input.value) {
          this.rule = input.value
        }
      })
    })
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
      return
    }

    // 如果 settings[this.ruleList] 里面没有当前页面的 key，值就是 undefined，需要设置为默认值
    const rule = this.rule
    this.textarea.value = rule

    if (rule !== settings[this.ruleSetting]) {
      setSetting(this.ruleSetting, rule)
    }

    Tools.setRows(this.textarea)
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
    str = Utils.replaceUnsafeStr(str)
    // replaceUnsafeStr 会把斜线 / 替换成全角的斜线 ／，这里再替换回来，否则就不能建立文件夹了
    str = str.replace(/／/g, '/')

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
