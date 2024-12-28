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

  // 主题标记以及对应的 className
  // 把需要响应主题变化的元素注册到这个组件里，元素会被添加当前主题的 className
  // 默认主题 white 是没有 className 的，其他主题通过对应的 className，在默认主题的基础上更改样式。
  private readonly classNameMap = new Map([
    ['white', ''],
    ['dark', 'theme-dark'],
  ])

  private readonly selector = '#gtm-var-theme-kind' // 通过这个选择器查找含有主题标记的元素

  private timer = 0

  // 页面上储存的主题标记，与本组件里的主题的对应关系
  private readonly htmlFlagMap: Map<string, ThemeName> = new Map([
    ['', 'white'],
    ['default', 'white'],
    ['light', 'white'],
    ['dark', 'dark'],
  ])

  private elList: Element[] = [] // 保存已注册的元素

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
          const flag = this.getThemeFromHtml()
          this.setTheme(flag)
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
              const flag = this.getThemeFromHtml()
              this.setTheme(flag)
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

  private getThemeFromHtml(): ThemeName {
    if (Config.mobile) {
      // 移动端需要使用不同的方法来获取主题
      const dark = document.body.classList.contains('dark')
      const pageTheme = dark ? 'dark' : 'white'
      EVT.fire('getPageTheme', pageTheme!)
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

      // 根据 html 元素的背景颜色判断
      // 此方法不适用于移动端，因为移动端的 html 背景色总是 'rgba(0, 0, 0, 0)'
      // "rgb(245, 245, 245)"
      // "rgb(0, 0, 0)"
      const htmlBG = getComputedStyle(document.documentElement)[
        'backgroundColor'
      ]
      if (htmlBG) {
        if (htmlBG.includes('rgb(2')) {
          return 'white'
        } else if (htmlBG.includes('rgb(0')) {
          return 'dark'
        }
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
