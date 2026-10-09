import { langText, LangTextKey } from './langText'
import { EVT } from './EVT'

/** 下载器界面上可以使用的显示语言 */
type LangTypes = 'zh-cn' | 'zh-tw' | 'en' | 'ja' | 'ko' | 'ru'

/**Pixiv 网页的显示语言。
 *
 * 曾经有俄语 ru，但现在没有了。
 *
 * 现在还有两个新语言：泰语 th 和马来语 ms，下载器的界面语言里暂时没有这两种语言 */
type LangTypesPixiv = 'zh-cn' | 'zh-tw' | 'en' | 'ja' | 'ko' | 'th' | 'ms'

// 语言类
class Lang {
  constructor() {
    this.htmlLangType = this.getHtmlLangType()
    this.type = this.htmlLangTypeToLangType()
    this.bindEvents()
  }

  /**用户在下载器设置里选择的语言 */
  public type!: LangTypes

  /**用户在 Pixiv 使用的显示语言。不会动态变化 */
  public htmlLangType!: LangTypesPixiv

  public readonly langTypes = [
    'zh-cn',
    'zh-tw',
    'en',
    'ja',
    'ko',
    'ru',
  ] as const

  public readonly flagIndex: Map<LangTypes, number> = new Map([
    ['zh-cn', 0],
    ['zh-tw', 1],
    ['en', 2],
    ['ja', 3],
    ['ko', 4],
    ['ru', 5],
  ])

  /**将 Pixiv 的语言类型转换为下载器支持的语言类型。对于泰语和马来语，显示为英语 */
  private htmlLangTypeToLangType(): LangTypes {
    if (this.htmlLangType === 'th' || this.htmlLangType === 'ms') {
      return 'en'
    }
    return this.htmlLangType as LangTypes
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name !== 'userSetLang') {
        return
      }
      const old = this.type
      this.type =
        data.value === 'auto' ? this.htmlLangTypeToLangType() : data.value
      if (this.type !== old) {
        this.elList.forEach((el) => {
          this.handleMark(el)
        })
        EVT.fire('langChange')
      }
    })
  }

  /** 获取页面使用的语言，返回语言标记 */
  // 通过检查 HTML 文档的 lang 属性来确定页面使用的语言
  // lang 属性有时含有大写字母，例如 'zh-CN'，但该方法会统一返回小写的值
  private getHtmlLangType(): LangTypesPixiv {
    // 因为现在 Pixiv 官方没有提供俄语选项，所以 htmlLangType 永远不会是 ru
    // 之前我从 navigator.language 判断是否为俄语用户（以便让下载器默认使用俄语显示），但这有时反而带来了困扰
    // 因为浏览器语言并不一定是用户在 Pixiv 网页上使用的语言。
    // 所以现在不再从 navigator.language 判断俄语用户
    // if (navigator.language.startsWith('ru')) {
    // return 'ru'
    // }

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

      case 'ko':
        return 'ko' // 한국어

      case 'th':
        return 'th' // ภาษาไทย

      case 'ms':
        return 'ms' // Bahasa Melayu

      // 对于其他语言，视为英语
      default:
        return 'en' // English
    }
  }

  /** 使用下载器的界面用户语言进行翻译 */
  public transl(name: LangTextKey, ...args: string[]) {
    if (name in langText === false) {
      console.warn(`LangText not found: ${name}`)
      return name
    }
    let content = langText[name][this.flagIndex.get(this.type)!]
    args.forEach((arg) => (content = content.replace('{}', arg)))
    return content
  }

  /** 使用指定的语言进行翻译。如果指定的语言无效，则回退至下载器的界面语言 */
  public translWithLang(name: LangTextKey, lang?: string, ...args: string[]) {
    if (name in langText === false) {
      console.warn(`LangText not found: ${name}`)
      return name
    }

    if (!lang || !(this.langTypes as readonly string[]).includes(lang)) {
      return this.transl(name, ...args)
    }

    let content = langText[name][this.flagIndex.get(lang as LangTypes)!]
    args.forEach((arg) => (content = content.replace('{}', arg)))
    return content
  }

  // 保存注册的元素
  // 在注册的元素里设置特殊的标记，让本模块可以动态更新其文本
  private elList: HTMLElement[] = []

  public register(el: HTMLElement) {
    this.elList.push(el)
    this.handleMark(el)
  }

  // 查找元素上的标记，设置其文本和属性
  private handleMark(wrap: HTMLElement) {
    // 设置 innerHTML
    const textEl = wrap.querySelectorAll(
      '*[data-xztext]'
    ) as NodeListOf<HTMLElement>
    for (const el of textEl) {
      // 因为有些文本中含有 html 标签，所以这里需要使用 innerHTML 而不是 textContent
      el.innerHTML = this.transl(el.dataset.xztext! as any)
    }
    // 元素自身存在 xztext 标记的情况
    const text = wrap.dataset.xztext
    if (text) {
      wrap.innerHTML = this.transl(text as any)
    }

    // 设置带参数的 innerHTML
    const textArgsEl = wrap.querySelectorAll(
      '*[data-xztextargs]'
    ) as NodeListOf<HTMLElement>
    textArgsEl.forEach((el) => this.handleTextArgs(el))
    // 元素自身存在 xztextargs 标记的情况
    const textargs = wrap.dataset.xztextargs
    if (textargs) {
      this.handleTextArgs(wrap)
    }

    // 设置 tip
    const tipEl = wrap.querySelectorAll(
      '*[data-xztip]'
    ) as NodeListOf<HTMLElement>
    for (const el of tipEl) {
      el.dataset.tip = this.transl(el.dataset.xztip! as any)
    }
    // 元素自身存在 xztip 标记的情况
    const tip = wrap.dataset.xztip
    if (tip) {
      wrap.dataset.tip = this.transl(tip as any)
    }

    // 设置 placeholder
    const placeholderEl = wrap.querySelectorAll(
      '*[data-xzplaceholder]'
    ) as NodeListOf<HTMLElement>
    for (const el of placeholderEl) {
      el.setAttribute(
        'placeholder',
        this.transl(el.dataset.xzplaceholder! as any)
      )
    }

    // 设置 title
    const titleEl = wrap.querySelectorAll(
      '*[data-xztitle]'
    ) as NodeListOf<HTMLElement>
    for (const el of titleEl) {
      el.setAttribute('title', this.transl(el.dataset.xztitle! as any))
    }
    // 元素自身存在 title 标记的情况
    const title = wrap.dataset.xztitle
    if (title) {
      wrap.setAttribute('title', this.transl(title as any))
    }
  }

  private handleTextArgs(el: HTMLElement) {
    let args = el.dataset.xztextargs!.split(',')
    const first = args.shift()
    el.innerHTML = this.transl(first as any, ...args)
  }

  // 需要更新已注册元素的文本时调用此方法
  public updateText(el: HTMLElement, ...args: string[]) {
    // 清空文本的情况
    if (args === undefined || args[0] === '') {
      delete el.dataset.xztext
      delete el.dataset.xztextargs
      el.innerHTML = ''
      return
    }
    // 设置文本
    if (args.length === 1) {
      // 无参数文本
      el.dataset.xztext = args[0]
      el.innerHTML = this.transl(args[0] as any)
      delete el.dataset.xztextargs
    } else {
      // 有参数文本
      el.dataset.xztextargs = args.join(',')
      const first = args.shift()
      el.innerHTML = this.transl(first as any, ...args)
      delete el.dataset.xztext
    }
  }
}

const lang = new Lang()

export { lang, LangTypes, LangTypesPixiv }
