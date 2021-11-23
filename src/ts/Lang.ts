import { langText } from './LangText'
import { EVT } from './EVT'

type LangTypes = 'zh-cn' | 'zh-tw' | 'en' | 'ja'

// 语言类
class Lang {
  constructor() {
    this.type = this.getHtmlLangType()
    this.bindEvents()
  }

  public type!: LangTypes

  public readonly langTypes = ['zh-cn', 'zh-tw', 'en', 'ja']

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
        this.change()
      }
    })
  }

  private getType(flag: string) {
    return flag === 'auto' ? this.getHtmlLangType() : (flag as LangTypes)
  }

  // 获取页面使用的语言，返回对应的结果
  private getHtmlLangType(): LangTypes {
    const flag = document.documentElement.lang
    switch (flag) {
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

  // 保存注册的元素
  // 在注册的元素里设置特殊的标记，让本模块可以动态更新其文本
  private elList: HTMLElement[] = []

  public register(el: HTMLElement) {
    this.elList.push(el)
    this.updateText(el)

    // const observer = new MutationObserver((records) => {
    //   // type MutationRecordType = "attributes" | "characterData" | "childList";
    //   for (const record of records) {
    //     console.log(record.type)
    //   }
    // })
    // observer.observe(el, {
    //   childList: true,
    //   subtree: true,
    // })
  }

  private updateText(wrap: HTMLElement) {
    const textEl = wrap.querySelectorAll('*[data-xztext]') as NodeListOf<HTMLElement>
    for (const el of textEl) {
      // 因为有些文本中含有 html 标签，所以这里需要使用 innerHTML 而不是 textContent
      el.innerHTML = this.transl(el.dataset.xztext! as keyof typeof langText)
    }

    const tipEl = wrap.querySelectorAll('*[data-xztip]') as NodeListOf<HTMLElement>
    for (const el of tipEl) {
      el.dataset.tip = this.transl(el.dataset.xztip! as keyof typeof langText)
    }

    const placeholderEl = wrap.querySelectorAll('*[data-xzplaceholder]') as NodeListOf<HTMLElement>
    for (const el of placeholderEl) {
      el.setAttribute('placeholder', this.transl(el.dataset.xzplaceholder! as keyof typeof langText))
    }

    const titleEl = wrap.querySelectorAll('*[data-xztitle]') as NodeListOf<HTMLElement>
    for (const el of titleEl) {
      el.setAttribute('title', this.transl(el.dataset.xztitle! as keyof typeof langText))
    }

    // 有一些设置 title 标记的元素需要设置到自己身上，而不是子元素上
    const title = wrap.dataset.xztitle
    if(title){
      wrap.setAttribute('title', this.transl(title as keyof typeof langText))
    }
  }

  private change() {
    EVT.fire('langChange')
    this.elList.forEach(el => {
      this.updateText(el)
    })
  }
}


const lang = new Lang()

export { lang }
