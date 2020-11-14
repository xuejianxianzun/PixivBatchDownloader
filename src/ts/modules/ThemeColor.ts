import { EVT } from './EVT'

// 把需要响应主题变化的元素注册到这个组件里，元素会被添加当前主题的 className
// 目前不能手动设置主题色，这个组件会自动检查 pixiv 的颜色模式，并设置 className
// 默认主题是没有 className 的，其他主题通过对应的 className，在默认主题的基础上更改样式。
class ThemeColor {
  constructor() {
    // 尝试设置一个初始主题，但实际上不一定会使用这个
    this.theme = this.defaultThemet

    this.bindEvent()
  }

  private readonly selector = '#gtm-var-theme-kind' // 通过这个选择器查找含有主题标记的元素

  private timer = 0

  private defaultThemet = 'white' // 默认主题

  private _theme = '' // 当前使用的主题

  // 主题标记以及对应的 className
  private readonly classNameMap = new Map([['white', ''], ['dark', 'theme-dark']])

  // 页面上储存的主题标记，与本组件里的主题的对应关系
  private readonly htmlFlagMap = new Map([['', 'white'], ['default', 'white'], ['dark', 'dark']])

  private elList: Element[] = [] // 保存已注册的元素

  private bindEvent() {
    // 初始化时使用定时器查找标记元素
    this.timer = window.setInterval(() => {
      this.findFlag()
    }, 300)

    // 监听主题设置变化的事件
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data
      console.log(data)
      if (data.name && data.name === 'theme') {
        this.theme = data.value
      } else {
        if (data.theme) {
          this.theme = data.theme
        }
      }
    })
  }

  // 查找含有 pixiv 主题标记的元素，并监听其变化
  private findFlag() {
    const el = document.querySelector(this.selector) as HTMLElement
    if (el) {
      window.clearInterval(this.timer)
      this.theme = this.htmlFlagMap.get(el.textContent!) || this.defaultThemet
      // 监听标记元素的 textContent 变化
      const ob = new MutationObserver((mutationsList) => {
        for (const item of mutationsList) {
          if (item.type === 'characterData') {
            this.theme = this.htmlFlagMap.get(item.target.nodeValue!) || this.defaultThemet
            break
          }
        }
      })
      ob.observe(el, {
        characterData: true,
        subtree: true,
      })
    }
  }

  // 从含有 pixiv 主题标记的元素里获取主题
  private getThemeFromHtml() {
    const el = document.querySelector(this.selector) as HTMLElement
    if (!el) {
      return this.defaultThemet
    }
    return this.htmlFlagMap.get(el.textContent!)
  }

  // 设置主题
  private set theme(flag: string | null) {
    if (flag === null) {
      return
    }

    let temp = '' // 储存最终要使用的主题

    // 如果设置了自动检测，就从 html 标记里获取要使用的主题
    if (flag === 'auto') {
      temp = this.getThemeFromHtml() || this.defaultThemet
    } else {
      // 如果不是自动检测，则使用设置里指定的值
      switch (flag) {
        case 'white':
          temp = 'white'
          break;
        case 'dark':
          temp = 'dark'
          break;
        default:
          temp = this.getThemeFromHtml() || this.defaultThemet
          break;
      }
    }

    // 如果要使用的主题和当前主题不同，则改变主题
    if (temp !== this._theme) {
      this._theme = temp

      for (const el of this.elList) {
        this.setClass(el)
      }
    }

  }

  private get theme() {
    return this._theme
  }

  // 把元素注册到本组件里
  public register(el: Element) {
    this.elList.push(el)
    this.setClass(el)
  }

  // 给元素设置主题对应的 className
  private setClass(el: Element) {
    // 先清除所有主题颜色的 className
    for (const className of this.classNameMap.values()) {
      if (el.classList.contains(className)) {
        el.classList.remove(className)
      }
    }
    // 添加当前主题对应的 className
    const name = this.classNameMap.get(this._theme)
    name && el.classList.add(name)
  }
}

const themeColor = new ThemeColor()
export { themeColor }
