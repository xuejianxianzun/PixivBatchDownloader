import { langText } from './langText'
import { langTextKeys } from './langText'
import { EVT } from './EVT'

// 语言类
class Lang {
  constructor() {
    this.setFlag()
    this.bindEvent()
  }

  private flag = 0

  private readonly storeName = 'xzLang'

  private bindEvent() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data
      if (data.name === 'userSetLang') {
        // 储存设置
        localStorage.setItem(this.storeName, data.value)
        // 重新设置语言
        const old = this.flag
        this.setFlag()
        if (this.flag !== old) {
          EVT.sendMsg({
            msg: this.transl('_变更语言后刷新页面的提示'),
          })
        }
      }
    })
  }

  // 从本地存储读取设置
  // 其实从 settings.userSetLang 可以获取这个设置，但是在这个类里引入 setting 会导致循环依赖，所以不使用 settings，而是转存到本地存储里。这样也算是解耦了。
  private setFlag() {
    const userSetLang = parseInt(localStorage.getItem(this.storeName) || '-1')
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
