import { EVT } from '../EVT'
import { lang } from '../Lang'
import { msgBox } from '../MsgBox'
import { pageType } from '../PageType'
import { Utils } from '../utils/Utils'
import { settings, setSetting } from './Settings'

// 管理命名规则
// 在实际使用中，作为 settings.userSetName 的代理
// 其他类必须使用 nameRuleManager.rule 存取器来存取命名规则
class NameRuleManager {
  constructor() {
    this.bindEvents()
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
          settings.nameRuleForEachPageType[pageType.type] !==
          settings.userSetName
        ) {
          this.setInputValue()
        }
      }
    })
  }

  private saveCurrentPageRule(rule: string) {
    settings.nameRuleForEachPageType[pageType.type] = rule
    setSetting('nameRuleForEachPageType', settings.nameRuleForEachPageType)
  }

  // 所有页面通用的命名规则
  private readonly generalRule = '{page_title}/{id}'

  public get rule() {
    if (settings.setNameRuleForEachPageType) {
      let rule = settings.nameRuleForEachPageType[pageType.type]
      if (rule === undefined) {
        rule = this.generalRule
        this.saveCurrentPageRule(rule)
      }
      return rule
    } else {
      return settings.userSetName
    }
  }

  public set rule(str: string) {
    // 检查传递的命名规则的合法性
    // 为了防止文件名重复，命名规则里一定要包含 {id} 或者 {id_num}{p_num}
    const check =
      str.includes('{id}') ||
      (str.includes('{id_num}') && str.includes('{p_num}'))
    if (!check) {
      window.setTimeout(() => {
        msgBox.error(lang.transl('_命名规则一定要包含id'))
      }, 300)
    } else {
      // 替换特殊字符
      str = this.handleUserSetName(str) || this.generalRule
      setSetting('userSetName', str)

      if (settings.setNameRuleForEachPageType) {
        this.saveCurrentPageRule(str)
      }

      this.setInputValue()
    }
  }

  // 命名规则输入框的集合
  private inputList: HTMLInputElement[] = []

  // 注册命名规则输入框
  public registerInput(input: HTMLInputElement) {
    this.inputList.push(input)
    this.setInputValue()

    // 保存事件被触发之前的值
    let lastValue = input.value

    // 给输入框绑定事件
    const evList = ['change', 'focus']
    // change 事件只对用户手动输入有效
    // 当用户从下拉框添加一个命名标记时，不会触发 change 事件，需要监听 focus 事件
    evList.forEach((evName) => {
      input.addEventListener(evName, () => {
        // 当事件触发时，比较输入框的值是否与事件触发之前发生了变化
        // 如果值没有变化，就什么都不做
        // 对于 change 事件来说，值必然发生了变化，但是 focus 就不一定了
        // 试想：用户修改命名规则为非法的规则，例如输入 111，触发 change 事件之后下载器会提示命名规则非法
        // 然后用户点击输入框（focus 事件）想要修改规则，此时值没有变化，就不应该执行后续代码。如果依然执行后续代码，那么每当用户点击输入框，下载器就会马上显示提示，这导致用户根本没办法在输入框里修改命名规则
        if (input.value === lastValue) {
          return
        }
        lastValue = input.value
        if (settings.nameRuleForEachPageType[pageType.type] !== input.value) {
          this.rule = input.value
        }
      })
    })
  }

  // 设置输入框的值为当前命名规则
  private setInputValue() {
    // 如果 settings.nameRuleForEachPageType 里面没有当前页面的 key，值就是 undefined，需要设置为默认值
    const rule = this.rule
    this.inputList.forEach((input) => {
      input.value = rule
    })

    if (rule !== settings.userSetName) {
      setSetting('userSetName', rule)
    }
  }

  // 处理用命名规则的非法字符和非法规则
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

const nameRuleManager = new NameRuleManager()
export { nameRuleManager }
