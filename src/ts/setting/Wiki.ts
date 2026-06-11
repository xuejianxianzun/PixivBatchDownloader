import { EVT } from '../EVT'
import { lang } from '../Language'
import { ppdTask } from '../PPDTask'
import { states } from '../store/States'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { setSetting, settings, OptionCategoryLevel1 } from './Settings'
import { optionConfigs } from './OptionConfigs'
import { langText, LangTextKey } from '../langText'

type ButtonsLevel1 = 'startCrawl' | 'downloadArea' | 'extraFeatures'
type ButtonsSchema = {
  [key in ButtonsLevel1]: {
    /** 一级分类的 ID */
    id: ButtonsLevel1
    /** 一级分类的名称的 i18n 的 key */
    nameKey: LangTextKey
    /** 二级分类 */
    level2: {
      /** 二级分类的 ID */
      [key: string]: {
        /** 二级分类的 ID */
        id: string
        /** 二级分类的名称的 i18n 的 key */
        nameKey: LangTextKey
        /** 该二级分类下所有按钮的 ID */
        ids: string[]
      }
    }
  }
}

type OptionsSchema = {
  [key in OptionCategoryLevel1]: {
    /** 一级分类的 ID */
    id: OptionCategoryLevel1
    /** 一级分类的名称的 i18n 的 key */
    nameKey: LangTextKey
    /** 二级分类 */
    level2: {
      /** 二级分类的 ID */
      [key: string]: {
        /** 二级分类的 ID */
        id: string
        /** 二级分类的名称的 i18n 的 key */
        nameKey: LangTextKey
        /** 该二级分类下所有按钮的 ID */
        ids: number[]
      }
    }
  }
}

type Level2 = {
  id: string
  nameKey: LangTextKey
  ids: (number | string)[]
}

/**Wiki 上已经实装的语言 */
type AvailableLanguages = 'zh-cn' | 'en'

/** 为每个设置和按钮创建其在 Wiki 上的 URL */
// PS：Wiki 里除了设置和按钮还有其他页面，那些页面与这里无关。
class Wiki {
  constructor() {
    this.bindEvents()
  }

  /** 储存每种语言的 Wiki 首页路径 */
  private home: { [key in AvailableLanguages]: string } = {
    'zh-cn': '',
    en: '',
  }

  private Level0Keys = {
    option: '_设置' as const,
    button: '_按钮_复数' as const,
  }

  /** 保存了所有按钮的配置 */
  private buttonsSchema: ButtonsSchema = {
    startCrawl: {
      id: 'startCrawl',
      nameKey: '_开始抓取',
      level2: {
        General: {
          id: 'General',
          nameKey: '_通用',
          ids: [
            'startCrawling',
            'stopCrawling',
            'scheduleCrawling',
            'cancelScheduledCrawling',
            'manuallySelectWork',
            'clearSelectedWork',
            'crawlSelectedWork',
          ],
        },
        HomePage: {
          id: 'HomePage',
          nameKey: '_首页',
          ids: ['crawlById', 'crawlIdRange', 'importIDList'],
        },
        WorkPage: {
          id: 'WorkPage',
          nameKey: '_作品页面',
          ids: [
            'startCrawlingFromCurrentPageNew',
            'startCrawlingFromCurrentPageOld',
            'crawlRelatedWork',
            'downloadRecommendedWorks',
          ],
        },
        NovelSeriesPage: {
          id: 'NovelSeriesPage',
          nameKey: '_系列小说页面',
          ids: ['crawlSeriesNovel', 'mergeSeriesNovel'],
        },
        SearchPage: {
          id: 'SearchPage',
          nameKey: '_搜索页面',
          ids: [
            'crawlTagList',
            'filterResults',
            'clearMultiImageWork',
            'clearUgoiraWork',
            'manuallyDeleteWork',
          ],
        },
        Ranking: {
          id: 'Ranking',
          nameKey: '_排行榜',
          ids: ['crawlRankingWork', 'crawlDebutWork'],
        },
        Discover: {
          id: 'Discover',
          nameKey: '_发现',
          ids: ['crawlCurrentWork'],
        },
        FollowingPage: {
          id: 'FollowingPage',
          nameKey: '_关注页面',
          ids: [
            'startCrawlingInFollowingPage',
            'exportFollowingListCSV',
            'exportFollowingListJSON',
            'batchFollowUser',
            'findDeactivatedUsers',
          ],
        },
        ContestPage: {
          id: 'ContestPage',
          nameKey: '_比赛页面',
          ids: ['crawlApplicationWork', 'crawlWinningWork'],
        },
        Dashboard: {
          id: 'Dashboard',
          nameKey: '_仪表盘',
          ids: ['exportDashboardData'],
        },
        BookmarkDetails: {
          id: 'BookmarkDetails',
          nameKey: '_书签详情',
          ids: ['crawlSimilarImage'],
        },
        pixivision: {
          id: 'pixivision',
          nameKey: '_pixivision',
          ids: ['crawlImagesOnThisPage'],
        },
      },
    },
    downloadArea: {
      id: 'downloadArea',
      nameKey: '_下载区域',
      level2: {
        CrawlResults: {
          id: 'CrawlResults',
          nameKey: '_抓取结果',
          ids: [
            'importCrawlResults',
            'exportCrawlResultsJSON',
            'exportCrawlResultsCSV',
            'previewFileName',
            'copyURLs',
          ],
        },
        DownloadControl: {
          id: 'DownloadControl',
          nameKey: '_下载控制',
          ids: ['startDownload', 'pauseDownload', 'stopDownload'],
        },
      },
    },
    extraFeatures: {
      id: 'extraFeatures',
      nameKey: '_附加功能',
      level2: {
        HomePage: {
          id: 'HomePage',
          nameKey: '_首页',
          ids: ['clearSavedCrawlResult'],
        },
        UserPage: {
          id: 'UserPage',
          nameKey: '_用户页面',
          ids: [
            'saveUserAvatar',
            'saveUserAvatarAsIcon',
            'saveUserCoverImage',
            'bookmarkAllWorksOnPage',
          ],
        },
        SearchPage: {
          id: 'SearchPage',
          nameKey: '_搜索页面',
          ids: ['bookmarkAllWorksOnSearchPage'],
        },
        BookmarkPage: {
          id: 'BookmarkPage',
          nameKey: '_书签页面',
          ids: [
            'addTagToUnmarkedWork',
            'removeTagsFromAllWorksOnPage',
            'unBookmarkAllWorksOnPage',
            'findBookmark404Works',
            'unBookmarkAll404Works',
            'exportBookmarkList',
            'importBookmarkList',
          ],
        },
      },
    },
  }

  /** 保存了所有设置项的配置。在初始化时生成 */
  private optionsSchema: OptionsSchema = {} as any

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.initOptionsSchema()
      this.setOptionLink()

      // 调试用
      // console.log('OptionsSchema initialized', this.optionsSchema)
      // this.outputAllPages('option')
      // this.outputAllPages('button')
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

  /** 从 optionConfigs.categorySchema 里复制分类层级结构到 optionsSchema 里，并从 optionConfigs.optionsByCategory 里获取每个二级分类里的 ids */
  private initOptionsSchema() {
    // 遍历每个一级分类
    for (const [level1Key, level1Config] of Object.entries(
      optionConfigs.categorySchema
    )) {
      const level1Id = level1Config.id
      const level1NameKey = level1Config.nameKey
      const level2Configs = level1Config.level2

      // 组装二级分类的数据
      const level2: OptionsSchema[OptionCategoryLevel1]['level2'] = {} as any
      for (const [level2Key, level2Config] of Object.entries(level2Configs)) {
        const level2Id = level2Config.id
        const level2NameKey = level2Config.nameKey
        const ids = optionConfigs.optionsByCategory[level1Id][level2Id].ids
        level2[level2Key] = {
          id: level2Id,
          nameKey: level2NameKey,
          ids,
        }
      }

      // 把一级分类和二级分类的数据保存到 optionsSchema 里
      this.optionsSchema[level1Key as OptionCategoryLevel1] = {
        id: level1Id,
        nameKey: level1NameKey,
        level2,
      }
    }
  }

  /** 调试用的辅助函数，用来输出所有页面的名字和里面的 id 列表 */
  private outputAllPages(type: 'option' | 'button') {
    const result = []
    const level0Key = this.Level0Keys[type]
    const source = type === 'option' ? this.optionsSchema : this.buttonsSchema
    for (const [level1Key, level1Config] of Object.entries(source)) {
      const level1Id = level1Config.id
      const level1NameKey = level1Config.nameKey as LangTextKey
      const level2Configs = level1Config.level2

      for (const [level2Key, level2Config] of Object.entries(level2Configs)) {
        const level2 = level2Config as Level2
        const level2Id = level2.id
        const level2NameKey = level2.nameKey
        const ids = level2.ids

        // 保存每个页面的多语言名称，以及里面的 id 列表
        const page_zh_cn = `${langText[level0Key][0]}-${langText[level1NameKey][0]}/${langText[level2NameKey][0]}`
        const page_en = `${langText[level0Key][2]}-${langText[level1NameKey][2]}/${langText[level2NameKey][2]}`
        result.push({
          page: {
            'zh-cn': page_zh_cn.replaceAll(' ', '-'),
            en: page_en.replaceAll(' ', '-'),
          },
          ids,
        })
      }
    }

    console.log(type, result)
  }

  // 由于 Wiki 现在只有简体中文和英语，所以只返回这两种语言
  private useLang(): AvailableLanguages {
    if (lang.type === 'zh-cn' || lang.type === 'zh-tw') {
      return 'zh-cn'
    }
    return 'en'
  }

  private resetHomeConfig() {
    let HomePrefix = 'https://xuejianxianzun.github.io/PBDWiki/'
    if (settings.debugForWiki) {
      HomePrefix = 'http://localhost:3000/'
    }
    this.home['zh-cn'] = HomePrefix + '#/zh-cn/'
    this.home['en'] = HomePrefix + '#/en/'
  }

  /** 设置每个设置项名称上的 href 属性 */
  private setOptionLink() {
    this.resetHomeConfig()

    optionConfigs.options.forEach(async (option) => {
      const link = await this.link('option', option.no)
      const a = document.querySelector(
        `.option[data-no="${option.no}"] .settingNameStyle`
      ) as HTMLAnchorElement
      if (a) {
        a.setAttribute('href', link)

        // 绑定 click 事件，默认不阻止。如果 clickSettingNameOpenWiki 为 false 则阻止默认行为
        if (!a.dataset.bindClick) {
          a.dataset.bindClick = 'true'
          a.addEventListener('click', (ev) => {
            if (!settings.clickSettingNameOpenWiki) {
              ev.preventDefault()
            }
          })
        }
      }
    })
  }

  /** 为每个功能按钮绑定事件，长按时生成 Wiki 链接并打开 */
  public registerBtn(btn: HTMLButtonElement) {
    Utils.longPress(btn, async () => {
      const link = await this.link('button', btn.id)
      window.open(link, '_blank')
    })
  }

  /**传入设置项或按钮的 ID，查找它在 Wiki 上处于哪个页面里，并构造出 URL */
  // 每个页面都是 3 级结构。1 级 和 2 级组合成目录名，3 级作为文件名，例如：设置-抓取/抓取范围
  // 返回的 URL 只定位到分类页面，不会定位到具体的条目，但是会传递该设置的 flag，例如：
  // https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/设置-抓取/抓取范围?flag=0
  // 之后由 Wiki 页面上的代码定位到具体的设置项
  // 如果传入的 ID 没有找到对应的分类，则返回 Wiki 首页
  public async link(
    type: 'option' | 'button',
    id: number | string
  ): Promise<string> {
    if (id === undefined) {
      console.error('link id is undefined')
      console.trace()
      return ''
    }

    await states.waitSettingInitialized()

    const home = this.home[this.useLang()]
    const level0Key: LangTextKey = this.Level0Keys[type]
    const source = type === 'option' ? this.optionsSchema : this.buttonsSchema

    for (const level1 of Object.values(source)) {
      for (const level2 of Object.values(level1.level2)) {
        const lv2: Level2 = level2 as any
        if (lv2.ids.includes(id)) {
          // 需要把文件名里的空格替换成横线 -，因为如果有空格的话就无法解析为 markdown 里的链接。
          const url =
            `${home}${lang.transl(level0Key)}-${lang.transl(level1.nameKey)}/${lang.transl(lv2.nameKey)}?flag=${id}`.replaceAll(
              ' ',
              '-'
            )
          return url
        }
      }
    }

    return ''
  }
}

const wiki = new Wiki()
export { wiki }
