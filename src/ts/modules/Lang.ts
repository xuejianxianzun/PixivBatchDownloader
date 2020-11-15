import { langText } from './langText'
import { langTextKeys } from './langText'
import { EVT } from './EVT'
import { settings } from './setting/Settings'

// 语言类
class Lang {
  constructor() {
    this.setFlag()
    this.bindEvents()
  }

  public flag = 0

  private bindEvents() {
    // 选项变化时重新设置语言
    window.addEventListener(EVT.list.settingChange, () => {
      const old = this.flag
      this.setFlag()
      if (this.flag !== old) {
        EVT.sendMsg({
          msg: this.transl('_变更语言后刷新页面的提示'),
        })
      }
    })
  }

  private setFlag() {
    const userSetLang = parseInt(settings.userSetLang)
    this.flag = userSetLang === -1 ? this.getLangType() : userSetLang
  }

  // 获取页面使用的语言，返回对应的 flag
  private getLangType() {
    const userLang = document.documentElement.lang
    switch (userLang) {
      case 'zh':
      case 'zh-CN':
      case 'zh-Hans':
        return 0 // 简体中文

      case 'ja':
        return 1 // 日本語

      case 'zh-Hant':
      case 'zh-tw':
      case 'zh-TW':
        return 3 // 繁體中文

      default:
        return 2 // English
    }
  }

  // translate 翻译
  public transl(name: langTextKeys, ...arg: string[]) {
    let content = langText[name][this.flag]
    arg.forEach((val) => (content = content.replace('{}', val)))
    return content
  }
}

const lang = new Lang()

export { lang }
