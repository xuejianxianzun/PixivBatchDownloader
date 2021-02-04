import { langText } from './LangText'
import { langTextKeys } from './LangText'
import { EVT } from './EVT'
import { msgBox } from './MsgBox'
import { settings } from './setting/Settings'

type LangTypes = 'zh-cn' | 'zh-tw' | 'ja' | 'en'

// 语言类
class Lang {
  constructor() {
    this.setFlag()
    this.bindEvents()
  }

  public flag: LangTypes = 'zh-cn'

  private bindEvents() {
    // 选项变化时重新设置语言
    window.addEventListener(EVT.list.settingChange, () => {
      const old = this.flag
      this.setFlag()
      if (this.flag !== old) {
        msgBox.show(this.transl('_变更语言后刷新页面的提示'))
      }
    })
  }

  private setFlag() {
    this.flag =
      settings.userSetLang === 'auto'
        ? this.getLangType()
        : settings.userSetLang
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
    let content = langText[name][this.flagIndex[this.flag]]
    arg.forEach((val) => (content = content.replace('{}', val)))
    return content
  }
}

const lang = new Lang()

export { lang }
