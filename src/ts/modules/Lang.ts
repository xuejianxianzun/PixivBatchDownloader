import { langText } from './LangText'
import { langTextKeys } from './LangText'
import { EVT } from './EVT'
import { msgBox } from './MsgBox'

type LangTypes = 'zh-cn' | 'zh-tw' | 'ja' | 'en'

// 语言类
class Lang {
  constructor() {
    this.bindEvents()
  }

  public type: LangTypes | undefined = undefined

  private bindEvents() {
    // 因为 Settings 初始化时会触发设置变化事件，所以监听事件即可获取语言设置
    // 本模块必须在 Settings 之前加载，否则监听不到 Settings 初始化的事件
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name !== 'userSetLang') {
        return
      }
      console.log('xxxxxxxx')
      const old = this.type
      this.type = this.getType(data.value)
      if (old !== undefined && this.type !== old) {
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

  private readonly flagIndex = {
    'zh-cn': 0,
    'zh-tw': 1,
    en: 2,
    ja: 3,
  }

  // translate 翻译
  public transl(name: langTextKeys, ...arg: string[]) {
    let content = langText[name][this.flagIndex[this.type!]]
    arg.forEach((val) => (content = content.replace('{}', val)))
    return content
  }
}

const lang = new Lang()

export { lang }
