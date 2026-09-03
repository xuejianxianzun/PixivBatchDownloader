import { EVT } from '../EVT'
import { lang } from '../Language'
import { ppdTask } from '../PPDTask'
import { states } from '../store/States'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { setSetting, settings, OptionCategoryLevel1 } from './Settings'
import { optionConfigs } from './OptionConfigs'
import { buttonConfigs, ButtonCategoryLevel1 } from './ButtonConfigs'
import { langText, LangTextKey } from '../langText'

type ButtonsSchema = {
  [key in ButtonCategoryLevel1]: {
    /** 一级分类的 ID */
    id: ButtonCategoryLevel1
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
// PS：Wiki 里除了设置页面、按钮页面之外还有其他页面，那些页面与这里无关。
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

  /** 保存了所有按钮的配置。在初始化时根据 ButtonConfigs 里的配置自动生成 */
  private buttonsSchema: ButtonsSchema = {} as any

  /** 保存了所有设置项的配置。在初始化时生成 */
  private optionsSchema: OptionsSchema = {} as any

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.initOptionsSchema()
      this.initButtonsSchema()
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
    ppdTask.register(3, 'Switch wiki Home', () => {
      setSetting('debugForWiki', !settings.debugForWiki)
      const msg = `debugForWiki: ${settings.debugForWiki}`
      console.log(msg)
      toast.success(msg)
      this.setOptionLink()
    })

    // 输出所有页面和按钮的 wiki 结构
    ppdTask.register(13, 'Output wiki data source', () => {
      const msg = lang.transl('_导出成功')
      toast.success(msg)
      const types = ['option', 'button'] as const
      for (const type of types) {
        const result = this.outputDataSource(type)
        const blob = Utils.json2Blob(result)
        const url = URL.createObjectURL(blob)
        Utils.downloadFile(url, `${type}s_data.json`)
        console.log(type, result)
      }
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

  /** 从 buttonConfigs 里复制分类层级结构到 buttonsSchema 里，并从 buttonsByCategory 里获取每个二级分类里的 ids */
  private initButtonsSchema() {
    // 遍历每个一级分类
    for (const [level1Key, level1Config] of Object.entries(
      buttonConfigs.categorySchema
    )) {
      const level1Id = level1Config.id
      const level1NameKey = level1Config.nameKey
      const level2Configs = level1Config.level2

      // 组装二级分类的数据
      const level2: ButtonsSchema[ButtonCategoryLevel1]['level2'] = {} as any
      for (const [level2Key, level2Config] of Object.entries(level2Configs)) {
        const level2Id = level2Config.id
        const level2NameKey = level2Config.nameKey
        const ids = buttonConfigs.buttonsByCategory[level1Id][level2Id].ids
        level2[level2Key] = {
          id: level2Id,
          nameKey: level2NameKey,
          ids,
        }
      }

      // 把一级分类和二级分类的数据保存到 buttonsSchema 里
      this.buttonsSchema[level1Key as ButtonCategoryLevel1] = {
        id: level1Id,
        nameKey: level1NameKey,
        level2,
      }
    }
  }

  // 由于 Wiki 现在只有简体中文和英语，所以只返回这两种语言
  private useLang(): AvailableLanguages {
    if (lang.type === 'zh-cn' || lang.type === 'zh-tw') {
      return 'zh-cn'
    }
    return 'en'
  }

  /** 获取用于 Wiki URL 的文本 */
  private getWikiText(key: LangTextKey): string {
    const langFlag = this.useLang()
    switch (langFlag) {
      case 'zh-cn':
        return langText[key][0]
      case 'en':
        return langText[key][2]
    }
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

  /** 已警告过未配置分类的按钮 id，避免重复输出警告 */
  private warnLoggedIds = new Set<string>()

  /** 为每个功能按钮绑定事件，长按时生成 Wiki 链接并打开 */
  public registerBtn(btn: HTMLButtonElement) {
    // 检查按钮是否已在 ButtonConfigs 里配置 wiki 分类。如果未配置，长按时无法生成链接，这里输出警告以提醒开发者补充配置
    if (!buttonConfigs.checkButtonRegistered(btn.id)) {
      if (!this.warnLoggedIds.has(btn.id)) {
        this.warnLoggedIds.add(btn.id)
        console.error(
          `Wiki: 按钮 ${btn.id} 未在 ButtonConfigs 里配置 wiki 分类，长按将无法生成链接`
        )
      }
    }

    Utils.longPress(btn, async (ev: MouseEvent) => {
      const link = await this.link('button', btn.id)
      if (!link) {
        toast.error(lang.transl('_没有找到对应的链接') + `: ${btn.id}`)
        ev.preventDefault()
        ev.stopImmediatePropagation()
        return
      }
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
            `${home}${this.getWikiText(level0Key)}-${this.getWikiText(level1.nameKey)}/${this.getWikiText(lv2.nameKey)}?flag=${id}`.replaceAll(
              ' ',
              '-'
            )
          return url
        }
      }
    }

    return ''
  }

  /** 调试用的辅助函数，用来输出所有设置项和按钮的 wiki 数据源 */
  private outputDataSource(type: 'option' | 'button') {
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

        // 保存这个二级分类里每个 id 的名称 key 和多语言名称
        // 这里保存下载器支持的所有语言分类的名称，包括 wiki 里未实装的语言。这样有利于以后在 Wiki 上显示其他语言的需求
        const names: {
          id: any
          nameKey: LangTextKey
          name: {}
        }[] = []
        const listSource =
          type === 'option' ? optionConfigs.options : buttonConfigs.buttonList
        for (const id of ids) {
          const item = listSource.find((i: any) => i.no === id || i.id === id)
          if (item) {
            const nameKey = item.nameKey as LangTextKey
            names.push({
              id,
              nameKey,
              name: {
                'zh-cn': Utils.htmlToText(langText[nameKey][0]),
                'zh-tw': Utils.htmlToText(langText[nameKey][1]),
                en: Utils.htmlToText(langText[nameKey][2]),
                ja: Utils.htmlToText(langText[nameKey][3]),
                ko: Utils.htmlToText(langText[nameKey][4]),
                ru: Utils.htmlToText(langText[nameKey][5]),
              },
            })
          }
        }

        result.push({
          page: {
            'zh-cn': this.getPagePath(
              level0Key,
              level1NameKey,
              level2NameKey,
              0
            ),
            'zh-tw': this.getPagePath(
              level0Key,
              level1NameKey,
              level2NameKey,
              1
            ),
            en: this.getPagePath(level0Key, level1NameKey, level2NameKey, 2),
            ja: this.getPagePath(level0Key, level1NameKey, level2NameKey, 3),
            ko: this.getPagePath(level0Key, level1NameKey, level2NameKey, 4),
            ru: this.getPagePath(level0Key, level1NameKey, level2NameKey, 5),
          },
          ids,
          names,
        })
      }
    }

    return result
  }

  private getPagePath(
    lv0: LangTextKey,
    lv1: LangTextKey,
    lv2: LangTextKey,
    index: number
  ) {
    const path = `${langText[lv0][index]}-${langText[lv1][index]}/${langText[lv2][index]}`
    return path.replaceAll(' ', '-')
  }
}

const wiki = new Wiki()
export { wiki }
