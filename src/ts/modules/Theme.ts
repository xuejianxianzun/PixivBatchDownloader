import { EVT } from './EVT'
import { settings } from './setting/Settings'

// 把需要响应主题变化的元素注册到这个组件里，元素会被添加当前主题的 className
// 默认主题 white 是没有 className 的，其他主题通过对应的 className，在默认主题的基础上更改样式。
class Theme {
  constructor() {
    this.setTheme()

    this.bindEvents()
  }

  private defaultTheme = 'white' // 默认主题

  private theme = '' // 当前使用的主题

  // 主题标记以及对应的 className
  private readonly classNameMap = new Map([
    ['white', ''],
    ['dark', 'theme-dark'],
  ])

  private readonly selector = '#gtm-var-theme-kind' // 通过这个选择器查找含有主题标记的元素

  private timer = 0

  // 页面上储存的主题标记，与本组件里的主题的对应关系
  private readonly htmlFlagMap = new Map([
    ['', 'white'],
    ['default', 'white'],
    ['dark', 'dark'],
  ])

  private elList: Element[] = [] // 保存已注册的元素

  private bindEvents() {
    // 初始化时使用定时器查找标记元素
    this.timer = window.setInterval(() => {
      this.findFlag()
    }, 300)

    // 设置变化时设置主题
    window.addEventListener(EVT.list.settingChange, () => {
      this.setTheme()
    })
  }

  // 查找含有 pixiv 主题标记的元素，并监听其变化
  private findFlag() {
    const el = document.querySelector(this.selector) as HTMLElement
    if (el) {
      window.clearInterval(this.timer)
      this.setTheme()
      // 监听标记元素的 textContent 变化
      const ob = new MutationObserver((mutationsList) => {
        for (const item of mutationsList) {
          if (item.type === 'characterData') {
            this.setTheme()
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
      return this.defaultTheme
    }
    return this.htmlFlagMap.get(el.textContent!)
  }

  // 设置主题。不需要传递值，因为会自动使用设置里的 theme 设置
  private setTheme() {
    let result = '' // 储存最终要使用的主题

    // 根据标记，设置要使用的主题
    switch (settings.theme) {
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

    // 如果要使用的主题和当前主题不同，则执行变化
    if (result !== this.theme) {
      this.theme = result

      for (const el of this.elList) {
        this.setClass(el)
      }
    }
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
    const name = this.classNameMap.get(this.theme)
    name && el.classList.add(name)
  }
}

const theme = new Theme()
export { theme }
