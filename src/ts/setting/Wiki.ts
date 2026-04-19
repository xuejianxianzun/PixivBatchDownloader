import { EVT } from '../EVT'
import { lang } from '../Language'
import { ppdTask } from '../PPDTask'
import { states } from '../store/States'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { setSetting, settings } from './Settings'

/**Wiki 上已经实装的语言 */
type AvailableLanguages = 'zh-cn' | 'en'

type GroupName =
  | 'Crawl'
  | 'Download'
  | 'More-Crawl'
  | 'More-Naming'
  | 'More-Download'
  | 'More-Enhance'
  | 'More-Others'
  | 'More-Hidden'
  | 'Buttons-Crawl'
  | 'Buttons-Download'
  | 'Buttons-More'

/**储存每个设置和按钮在 Wiki 上的链接 */
// 为了方便维护，我储存了分类页面的 URL，以及每个分类下的设置项和按钮的 ID
// 需要打开 Wiki 的时候，先跳转到分类页面，然后通过锚点跳转到具体的设置（这部分代码已经添加到了 Wiki 里）
// 这样即使以后 Wiki 上的 URL 发生变化，也不需要修改代码
// 只在这些情况下需要修改：
// 1. 如果新增了设置，需要在 Wiki 上添加对应的条目，并且把设置的 ID 添加到 groupConfig 里
// 2. 如果把一个设置从一个分类移动到另一个分类，需要修改它在 groupConfig 里所属的分类

class Wiki {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.setOptionLink()
    })

    // 当用户修改了语言时，重设每个设置项的链接
    window.addEventListener(EVT.list.langChange, () => {
      if (states.settingInitialized) {
        this.setOptionLink()
      }
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      if (!states.settingInitialized) {
        return
      }
      const data = ev.detail.data as any
      if (data.name === 'debugForWiki') {
        this.setOptionLink()
      }
    })

    // 切换 Wiki 网址为本地调试的网址或者线上网址
    ppdTask.register(3, 'Switch Wiki Home', () => {
      setSetting('debugForWiki', !settings.debugForWiki)
      const msg = `debugForWiki: ${settings.debugForWiki}`
      console.log(msg)
      toast.success(msg)
      this.setOptionLink()
    })
  }

  // 由于 Wiki 现在只有简体中文和英语，所以只返回这两种语言
  private useLang(): AvailableLanguages {
    if (lang.type === 'zh-cn' || lang.type === 'zh-tw') {
      return 'zh-cn'
    }
    return 'en'
  }

  /** 储存每种语言的 Wiki 首页路径 */
  private home: { [key in AvailableLanguages]: string } = {
    'zh-cn': '',
    en: '',
  }

  private resetHomeConfig() {
    let HomePrefix = 'https://xuejianxianzun.github.io/PBDWiki/'
    if (settings.debugForWiki) {
      HomePrefix = 'http://localhost:3000/'
    }
    this.home['zh-cn'] = HomePrefix + '#/zh-cn/'
    this.home['en'] = HomePrefix + '#/en/'
  }

  /**储存每个分类在 Wiki 里的哪个页面上 */
  private readonly groupPage: {
    [key in AvailableLanguages]: { [key in GroupName]: string }
  } = {
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
    en: {
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

  /**储存每个分类里包含哪些设置项/按钮 */
  // 设置项的 ID 是数字，按钮的 ID 是字符串
  // 特殊处理：
  // - “更多”分类里的“显示高级设置”（57）放到了 More-Crawl 分类里
  // - 隐藏设置虽然有自己的分类，但是在 Wiki 里统一归纳到了“隐藏设置”页面里，所以它们的 ID 也放到了 More-Hidden 分类里
  private readonly groupConfig: { [key in GroupName]: (string | number)[] } = {
    Crawl: [
      0, 1, 2, 44, 81, 6, 23, 21, 51, 5, 7, 8, 9, 10, 11, 12, 94, 95, 96, 99,
    ],
    Download: [13, 50, 64, 16, 17, 33],
    'More-Crawl': [57, 59, 75, 3, 47, 69, 35, 39, 74, 54, 85, 103, 104],
    'More-Naming': [65, 19, 42, 43, 38, 22, 46, 29, 83, 67, 66, 97, 98],
    'More-Download': [
      58, 52, 90, 91, 76, 77, 4, 24, 26, 27, 70, 72, 73, 49, 89, 30, 25, 82, 20,
      28, 100, 101,
    ],
    'More-Enhance': [
      60, 84, 87, 68, 63, 55, 71, 62, 40, 56, 86, 48, 88, 18, 34, 14, 102,
    ],
    'More-Others': [61, 31, 78, 36, 41, 45, 53, 32, 37, 93],
    'More-Hidden': [79, 80, 14, 15],
    'Buttons-Crawl': [
      'startCrawling',
      'stopCrawling',
      'scheduleCrawling',
      'cancelScheduledCrawling',
      'manuallySelectWork',
      'clearSelectedWork',
      'crawlSelectedWork',
      'crawlCurrentPageWork',
      'startCrawlingFromCurrentPageNew',
      'startCrawlingFromCurrentPageOld',
      'crawlRelatedWork',
      'downloadRecommendedWorks',
      'crawlSimilarImage',
      'crawlCurrentWork',
      'crawlImagesOnThisPage',
      'crawlRankingWork',
      'crawlDebutWork',
      'filterResults',
      'crawlTagList',
      'startCrawlingInFollowingPage',
      'exportFollowingListCSV',
      'exportFollowingListJSON',
      'batchFollowUser',
      'crawlById',
      'crawlIdRange',
      'importIDList',
      'crawlSeriesNovel',
      'mergeSeriesNovel',
      'clearMultiImageWork',
      'clearUgoiraWork',
      'manuallyDeleteWork',
      'exportDashboardData',
      'crawlApplicationWork',
      'crawlWinningWork',
      'findDeactivatedUsers',
    ],
    'Buttons-Download': [
      'importCrawlResults',
      'exportCrawlResultsJSON',
      'exportCrawlResultsCSV',
      'previewFileName',
      'startDownload',
      'pauseDownload',
      'stopDownload',
      'copyURLs',
    ],
    'Buttons-More': [
      'bookmarkAllWorksOnPage',
      'addTagToUnmarkedWork',
      'removeTagsFromAllWorksOnPage',
      'unBookmarkAllWorksOnPage',
      'unBookmarkAll404Works',
      'exportBookmarkList',
      'importBookmarkList',
      'clearSavedCrawlResult',
      'saveUserAvatar',
      'saveUserAvatarAsIcon',
      'saveUserCoverImage',
    ],
  }

  /** 设置每个设置项名称上的 href 属性 */
  private setOptionLink() {
    this.resetHomeConfig()
    // 查找所有 a.settingNameStyle 元素，并把它们的 href 属性修改为对应语言的 URL
    const allLinks = document.querySelectorAll(
      '.centerWrap_con a.settingNameStyle'
    )
    allLinks.forEach(async (el) => {
      // 查找其所属的 p 元素，如 <p class='option' data-no='0'>
      const p = el.closest('p.option') as HTMLParagraphElement
      if (p && p.dataset.no) {
        const id = Number(p.dataset.no)
        const link = await this.link(id)
        el.setAttribute('href', link)
      }
    })
  }

  /** 为每个功能按钮绑定事件，长按时生成 Wiki 链接并打开 */
  public registerBtn(btn: HTMLButtonElement) {
    Utils.longPress(btn, async () => {
      const link = await this.link(btn.id)
      window.open(link, '_blank')
    })
  }

  /**传入设置项或按钮的 ID，查找它在 Wiki 上处于哪个页面里，并构造出 URL */
  // 返回的 URL 只定位到分类页面，不会定位到具体的条目，但是会传递该设置的 flag，例如：
  // https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/设置-抓取?flag=0
  // 之后由 Wiki 页面上的代码定位到具体的设置项
  // 如果传入的 ID 没有找到对应的分类，则返回 Wiki 首页
  public async link(id: number | string): Promise<string> {
    if (id === undefined) {
      console.error('link id is undefined')
      console.trace()
      return ''
    }

    while (true) {
      if (states.settingInitialized) {
        break
      } else {
        await Utils.sleep(50)
      }
    }

    const lang = this.useLang()
    for (const group in this.groupConfig) {
      const groupName = group as GroupName
      if (this.groupConfig[groupName].includes(id)) {
        const home = this.home[lang]
        const page = this.groupPage[lang][groupName]
        return `${home}${page}?flag=${id}`
      }
    }
    return ''
  }
}

const wiki = new Wiki()
export { wiki }
