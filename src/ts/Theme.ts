import { Config } from './Config'
import { EVT } from './EVT'
import { Utils } from './utils/Utils'

type ThemeName = 'white' | 'dark'

// 下载器的主题默认跟随页面主题。如果用户设置了下载器主题，则不再跟随页面主题
class Theme {
  constructor() {
    if (Utils.isPixiv()) {
      this.bindEvents()
    }
  }

  private readonly allTheme = ['white', 'dark']

  private readonly defaultTheme: ThemeName = 'white' // 默认主题

  private theme: ThemeName = 'white' // 保存当前使用的主题

  private settingTheme = '' // 保存用户设置的下载器主题

  private elList: Element[] = [] // 保存已注册的元素

  // 主题标记以及对应的 className
  // 把需要响应主题变化的元素注册到这个组件里，元素会被添加当前主题的 className
  private readonly classNameMap = new Map([
    ['white', 'theme-white'],
    ['dark', 'theme-dark'],
  ])

  // 页面上储存的主题标记，与本组件里的主题的对应关系
  private readonly htmlFlagMap: Map<string, ThemeName> = new Map([
    ['', 'white'],
    ['default', 'white'],
    ['light', 'white'],
    ['dark', 'dark'],
  ])

  private readonly selector = '#gtm-var-theme-kind' // 通过这个选择器查找含有主题标记的元素
  private timer = 0

  private bindEvents() {
    // 主题设置变化时修改主题
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'theme') {
        this.settingTheme = data.value
        this.setTheme(data.value)
      }
    })

    // 使用定时器查找标记元素
    this.timer = window.setInterval(() => {
      this.findFlag()
    }, 300)
  }

  // 查找含有 pixiv 主题标记的元素，并监听其变化
  private findFlag() {
    if (Config.mobile) {
      const el = document.body
      if (el) {
        window.clearInterval(this.timer)
        this.setTheme(this.getThemeFromHtml())
        // 监听 body 的 class 变化
        const ob = new MutationObserver(() => {
          this.setTheme(this.getThemeFromHtml())
        })
        ob.observe(el, {
          attributes: true,
          attributeFilter: ['class'],
        })
      }
    } else {
      const el = document.querySelector(this.selector) as HTMLElement
      if (el) {
        window.clearInterval(this.timer)
        this.setTheme(this.getThemeFromHtml())
        // 监听标记元素的 textContent 变化
        const ob = new MutationObserver((mutationsList) => {
          for (const item of mutationsList) {
            if (item.type === 'characterData') {
              this.setTheme(this.getThemeFromHtml())
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
  }

  /** 检查 body 的 background，用“感知亮度”判断页面现在整体更接近亮色还是暗色。 */
  // 这是为了检测 Dark Reader 等暗色模式的扩展。当用户使用这种扩展来设置暗色模式时，pixiv 自身的主题模式可能依然是亮色的。此时下载器需要检测 body 的实际背景颜色来判断应该使用哪个主题。
  private getThemeFromBackgroundColor(): ThemeName | null {
    const color = getComputedStyle(document.body)['backgroundColor']
    const rgba = this.parseBackgroundColor(color)
    if (!rgba) {
      return null
    }

    if (rgba.alpha === 0) {
      return null
    }

    // 使用感知亮度而不是 RGB 平均值。因为人眼对绿色最敏感，对蓝色最不敏感，
    // 所以 0.299 / 0.587 / 0.114 这组权重更符合“看起来亮还是暗”的直觉。
    const brightness = 0.299 * rgba.red + 0.587 * rgba.green + 0.114 * rgba.blue

    // 接近纯白时判定为亮色；接近 #222 或更暗时判定为暗色；中间区域返回 null，交给正常流程继续判断。
    if (brightness >= 245) {
      return 'white'
    }

    if (brightness <= 34) {
      return 'dark'
    }

    return null
  }

  private parseBackgroundColor(color: string) {
    const match = color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/
    )
    if (!match) {
      return null
    }

    return {
      red: Number(match[1]),
      green: Number(match[2]),
      blue: Number(match[3]),
      alpha: match[4] === undefined ? 1 : Number(match[4]),
    }
  }

  /** 从网页元素上获取主题 */
  // 该方法会触发 'getPageTheme' 事件，传递的值是从网页端获取到的主题，而不是下载器面板里设置的主题
  // 也就是说，如果网页的主题是暗色的，那么即使下载器设置里设置了下载器主题为亮色，传递给 'getPageTheme' 事件的也会是暗色
  // 这样是为了让接收方在修改网页上一些元素的样式时可以适配网页主题，而不受下载器主题设置的影响
  private getThemeFromHtml(): ThemeName {
    const theme = this.getThemeFromBackgroundColor()
    if (theme) {
      EVT.fire('getPageTheme', theme)
      return theme
    }

    if (Config.mobile) {
      // 移动端需要使用不同的方法来获取主题
      const dark = document.body.classList.contains('dark')
      const pageTheme = dark ? 'dark' : 'white'
      EVT.fire('getPageTheme', pageTheme)
      return pageTheme
    } else {
      // 桌面端
      // 从含有 pixiv 主题标记的元素里获取主题
      const el = document.querySelector(this.selector) as HTMLElement
      if (el) {
        const pageTheme = this.htmlFlagMap.get(el.textContent!) || 'white'
        EVT.fire('getPageTheme', pageTheme)
        return pageTheme || this.defaultTheme
      }

      return this.defaultTheme
    }
  }

  private setTheme(flag: string) {
    // 如果用户设置了下载器主题，则始终使用下载器主题（忽略页面主题）
    if (this.allTheme.includes(this.settingTheme)) {
      flag = this.settingTheme
    }

    let result: ThemeName = 'white' // 储存根据标记所选择的主题

    // 根据标记，设置要使用的主题
    switch (flag) {
      case 'white':
        result = 'white'
        break
      case 'dark':
        result = 'dark'
        break
      default:
        // 如果传递的值是本模块不能识别的，包括 'auto'，就都自动获取
        result = this.getThemeFromHtml() || this.defaultTheme
        break
    }

    // 如果计算出的主题和当前主题不同，则执行变化
    if (result !== this.theme) {
      this.theme = result

      for (const el of this.elList) {
        this.setClass(el)
      }
    }
  }

  // 把元素注册到本组件里
  public register(el: Element) {
    if (!Utils.isPixiv()) {
      return
    }

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
    const name = this.classNameMap.get(this.theme)
    name && el.classList.add(name)
  }
}

const theme = new Theme()
export { theme }
