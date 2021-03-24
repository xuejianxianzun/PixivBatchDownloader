import { langText } from './LangText'
import { EVT } from './EVT'
import { msgBox } from './MsgBox'
import { Config } from './config/Config'

type LangTypes = 'zh-cn' | 'zh-tw' | 'en' | 'ja'

// 语言类
class Lang {
  constructor() {
    // 读取本地存储的设置
    const savedSettings = localStorage.getItem(Config.settingStoreName)
    if (savedSettings) {
      // 有储存的设置
      const restoreData = JSON.parse(savedSettings)
      if (this.langTypes.includes(restoreData.userSetLang)) {
        // 恢复设置里的语言类型
        this.type = restoreData.userSetLang
      } else {
        // 自动获取语言类型
        this.type = this.getLangType()
      }
    } else {
      // 如果没有储存的设置，则自动获取语言类型
      this.type = this.getLangType()
    }

    this.bindEvents()
  }

  public type!: LangTypes

  private readonly langTypes = ['zh-cn', 'zh-tw', 'en', 'ja']

  private readonly flagIndex: Map<LangTypes, number> = new Map([
    ['zh-cn', 0],
    ['zh-tw', 1],
    ['en', 2],
    ['ja', 3],
  ])

  private bindEvents() {
    // 因为 Settings 初始化时会触发设置变化事件，所以监听事件即可获取语言设置
    // 本模块必须在 Settings 之前加载，否则监听不到 Settings 初始化的事件
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name !== 'userSetLang') {
        return
      }
      const old = this.type
      this.type = this.getType(data.value)
      if (this.type !== old) {
        msgBox.show(this.transl('_变更语言后刷新页面的提示'))
      }
    })
  }

  private getType(flag: string) {
    return flag === 'auto' ? this.getLangType() : (flag as LangTypes)
  }

  // 获取页面使用的语言，返回对应的 flag
  private getLangType(): LangTypes {
    const userLang = document.documentElement.lang
    switch (userLang) {
      case 'zh':
      case 'zh-CN':
      case 'zh-Hans':
        return 'zh-cn' // 简体中文

      case 'ja':
        return 'ja' // 日本語

      case 'zh-Hant':
      case 'zh-tw':
      case 'zh-TW':
        return 'zh-tw' // 繁體中文

      default:
        return 'en' // English
    }
  }

  // translate 翻译
  public transl(name: keyof typeof langText, ...arg: string[]) {
    let content = langText[name][this.flagIndex.get(this.type)!]
    arg.forEach((val) => (content = content.replace('{}', val)))
    return content
  }
}

const lang = new Lang()

export { lang }
