// 检查 pixiv 的颜色模式，并给下载器设置对应的样式。目前只有普通模式和夜间模式。
// 把需要响应主题变化的元素注册到这个组件里，元素会被添加当前主题的 className
// 默认主题是没有 className 的，其他主题通过对应的 className，在默认主题的基础上更改样式。
class ThemeColor {
  constructor() {
    // 初始化时使用定时器查找标记元素
    this.timer = window.setTimeout(() => {
      this.findFlag()
    }, 300)
  }

  private readonly selector = '#gtm-var-theme-kind' // 通过这个选择器查找含有主题标记的元素

  private timer = 0

  private _theme = '' // 保存当前获取到的主题标记

  // 主题标记以及对应的 className
  private readonly colorMap = new Map([['dark', 'theme-dark']])

  private elList: Element[] = [] // 保存已注册的元素

  // 含有主题标记的元素，并监听其变化
  private findFlag() {
    const el = document.querySelector(this.selector)
    if (el) {
      window.clearTimeout(this.timer)
      this.theme = el.textContent
      // 监听标记元素的 textContent 变化
      const ob = new MutationObserver((mutationsList) => {
        for (const item of mutationsList) {
          if (item.type === 'characterData') {
            this.theme = item.target.nodeValue
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

  private set theme(flag: string | null) {
    if (!flag) {
      return
    }
    this._theme = flag

    for (const el of this.elList) {
      this.setClass(el)
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
    for (const className of this.colorMap.values()) {
      if (el.classList.contains(className)) {
        el.classList.remove(className)
      }
    }
    // 添加当前主题对应的 className
    const name = this.colorMap.get(this._theme)
    name && el.classList.add(name)
  }
}

const themeColor = new ThemeColor()
export { themeColor }
