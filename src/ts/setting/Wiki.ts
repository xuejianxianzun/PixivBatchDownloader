import { EVT } from '../EVT'
import { lang } from '../Language'

/**Wiki 上已经实装的语言 */
type AvailableLanguages = 'zh-cn' | 'en'

type GroupName = 'Crawl' | 'Download' | 'More-Crawl' | 'More-Naming' | 'More-Download' | 'More-Enhance' | 'More-Others' | 'More-Hidden' | 'Buttons-Crawl' | 'Buttons-Download' | 'Buttons-More'

/**储存每个设置和按钮在 Wiki 上的链接 */
// 为了方便维护，我没有储存每个设置的 URL，而是储存了分类页面的 URL，以及每个分类下的设置项和按钮的 ID
// 需要打开 Wiki 的时候，先跳转到分类页面，然后通过锚点跳转到具体的设置（这部分代码已经添加到了 Wiki 里）
// 这样即使以后 Wiki 上的 URL 发生变化，也不需要修改代码
// 只在这些情况下需要修改：
// 1. 如果新增了设置，需要在 Wiki 上添加对应的条目，并且把设置的 ID 添加到 groupConfig 里
// 2. 如果把一个设置从一个分类移动到另一个分类，需要修改它在 groupConfig 里所属的分类

class Wiki {
  constructor() {
    this.bindEvnents()
  }

  // 由于 Wiki 现在只有简体中文和英语，所以对于其他语言都显示英文
  private useLang(): AvailableLanguages {
    if (lang.type === 'zh-cn' || lang.type === 'zh-tw') {
      return 'zh-cn'
    }
    return 'en'
  }

  private nowLang = this.useLang()

  /**传入设置项或按钮的 ID，查找它在 Wiki 上处于哪个页面里，并构造出 URL */
  // 返回的 URL 只定位到分类页面，不会定位到具体的条目，但是会传递该设置的 flag，例如：
  // https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/设置-抓取?flag=0
  // 之后由 Wiki 页面上的代码定位到具体的设置项
  // 如果传入的 ID 没有找到对应的分类，则返回 Wiki 首页
  public link(id: number | string): string {
    const lang = this.nowLang
    for (const group in this.groupConfig) {
      const groupName = group as GroupName
      if (this.groupConfig[groupName].includes(id)) {
        const home = this.home[lang]
        const page = this.groupURL[lang][groupName]
        return `${home}${page}?flag=${id}`
      }
    }
    return `https://xuejianxianzun.github.io/PBDWiki/`
  }

  public openLink(id: number | string) {
    const link = this.link(id)
    window.open(link, '_blank')
  }

  // 每种语言对应的 Wiki 首页路径
  private readonly home: { [key in AvailableLanguages]: string } = {
    'zh-cn': 'https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/',
    'en': 'https://xuejianxianzun.github.io/PBDWiki/#/en/',
  }

  /**储存每个设置项/按钮 ID 属于哪个分类 */
  // 设置项的 ID 是数字，按钮的 ID 是字符串
  // 特殊处理：
  // - “更多”分类里的“显示高级设置” 57 放到了 More-Crawl 分类里
  // - 隐藏设置虽然有自己的分类，但是在 Wiki 里统一归纳到了“隐藏设置”页面里，所以它们的 ID 也放到了“More-Hidden”分类里
  private readonly groupConfig: { [key in GroupName]: (string | number)[] } = {
    Crawl: [0, 1, 2, 44, 81, 6, 23, 21, 51, 3, 47, 5, 7, 8, 9, 10, 11, 12,],
    Download: [13, 50, 64, 38, 16, 17, 33,],
    'More-Crawl': [57, 59, 75, 69, 35, 39, 74, 54, 85,],
    'More-Naming': [65, 19, 42, 43, 22, 46, 29, 83, 67, 66,],
    'More-Download': [58, 52, 90, 76, 77, 4, 24, 26, 27, 70, 72, 49, 89, 30, 25, 82, 28,],
    'More-Enhance': [60, 84, 87, 68, 63, 55, 71, 62, 40, 56, 86, 48, 88, 18, 34,],
    'More-Others': [61, 31, 78, 36, 41, 45, 53, 32, 37,],
    'More-Hidden': [79, 80,],
    'Buttons-Crawl': [],
    'Buttons-Download': [],
    'Buttons-More': [],
  }

  /**储存每个分类对应的页面 */
  private readonly groupURL: { [key in AvailableLanguages]: { [key in GroupName]: string } } = {
    'zh-cn': {
      Crawl: '设置-抓取',
      Download: '设置-下载',
      'More-Crawl': '设置-更多-抓取',
      'More-Naming': '设置-更多-命名',
      'More-Download': '设置-更多-下载',
      'More-Enhance': '设置-更多-增强',
      'More-Others': '设置-更多-其他',
      'More-Hidden': '设置-更多-隐藏设置',
      'Buttons-Crawl': '按钮-抓取',
      'Buttons-Download': '按钮-下载',
      'Buttons-More': '按钮-更多',
    },
    'en': {
      Crawl: 'Settings-Crawl',
      Download: 'Settings-Download',
      'More-Crawl': 'Settings-More-Crawl',
      'More-Naming': 'Settings-More-Naming',
      'More-Download': 'Settings-More-Download',
      'More-Enhance': 'Settings-More-Enhance',
      'More-Others': 'Settings-More-Other',
      'More-Hidden': 'Settings-More-Hidden-Settings',
      'Buttons-Crawl': 'Buttons-Crawl',
      'Buttons-Download': 'Buttons-Download',
      'Buttons-More': 'Buttons-More',
    },
  }

  private bindEvnents() {
    // 当语言变化时（用户在设置里修改了语言），修改 FormHTML 里的 URL 为对应的语言
    window.addEventListener(EVT.list.langChange, () => {
      const newLang = this.useLang()
      if (newLang !== this.nowLang) {
        this.nowLang = newLang
        window.setTimeout(() => {
          this.resetWikiLink()
        }, 100)
      }
    })
  }

  private resetWikiLink() {
    // 查找所有 a.settingNameStyle 元素，并把它们的 href 属性修改为对应语言的 URL
    const allLinks = document.querySelectorAll('a.settingNameStyle')
    allLinks.forEach((el) => {
      // 查找其父元素，如 <p class='option' data-no='0'>
      const p = el.parentElement
      if (p!.dataset.no) {
        const id = Number(p!.dataset.no)
        const link = this.link(id)
        el.setAttribute('href', link)
      }
    })
  }

}

const wiki = new Wiki()
export { wiki }
