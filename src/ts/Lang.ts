import { langText } from './LangText'
import { EVT } from './EVT'

type LangTypes = 'zh-cn' | 'zh-tw' | 'en' | 'ja' | 'ko'

// 语言类
class Lang {
  constructor() {
    this.type = this.getHtmlLangType()
    this.bindEvents()
  }

  public type!: LangTypes

  public readonly langTypes = ['zh-cn', 'zh-tw', 'en', 'ja', 'ko']

  private readonly flagIndex: Map<LangTypes, number> = new Map([
    ['zh-cn', 0],
    ['zh-tw', 1],
    ['en', 2],
    ['ja', 3],
    ['ko', 4],
  ])

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name !== 'userSetLang') {
        return
      }
      const old = this.type
      this.type = data.value === 'auto' ? this.getHtmlLangType() : data.value
      if (this.type !== old) {
        EVT.fire('langChange')
        this.elList.forEach((el) => {
          this.handleMark(el)
        })
      }
    })
  }

  // 获取页面使用的语言，返回语言标记
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

      case 'ko':
        return 'ko' // 한국어

      default:
        return 'en' // English
    }
  }

  // translate
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

export { lang }
