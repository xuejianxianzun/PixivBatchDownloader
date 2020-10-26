import { langText } from './langText'
import { langTextKeys } from './langText'

// 语言类
class Lang {
  constructor() {
    this.getLangType()
  }

  private flag = 0

  // 设置语言类型
  private getLangType() {
    const userLang = document.documentElement.lang // 获取语言标识
    switch (userLang) {
      case 'zh':
      case 'zh-CN':
      case 'zh-Hans':
        this.flag = 0 // 设置为简体中文
        break

      case 'ja':
        this.flag = 1 // 设置为日语
        break

      case 'zh-Hant':
      case 'zh-tw':
      case 'zh-TW':
        this.flag = 3 // 设置为繁体中文
        break

      default:
        this.flag = 2 // 设置为英语
        break
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
