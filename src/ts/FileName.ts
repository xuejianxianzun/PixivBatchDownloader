import { settings } from './setting/Settings'
import { nameRuleManager } from './setting/NameRuleManager'
import './setting/SetUserName'
import { setTagAlias } from './setting/SetTagAlias'
import { store } from './store/Store'
import { Result } from './store/StoreType'
import { Config } from './Config'
import { DateFormat } from './utils/DateFormat'
import { Utils } from './utils/Utils'
import { Tools } from './Tools'
import { log } from './Log'
import { lang } from './Language'

interface NamingSchema {
  [key: string]: { value: string; safe: boolean }
}

// 生成文件名
// 没有必要保存缓存，因为每次生成文件名的耗时小于 1 ms，不需要用空间换时间
class FileName {
  /**传入一个抓取结果，生成其文件名 */
  public createFileName(data: Result) {
    let rule = nameRuleManager.getRule(data.type === 3 ? 'novel' : 'artwork')

    // 1 把特定标记替换成它所代表的设置的值
    for (const item of this.flagToSettingValue) {
      const value = item.func(rule, item.flag, data)
      rule = rule.replaceAll(item.flag, value)
    }

    rule = this.handleCustomFeature(rule, data)

    // 2 生成所有命名标记的值
    // 对于一些较为耗时的计算，先判断用户设置的命名规则里是否使用了这个标记，如果未使用则不计算
    const p_num = this.createPNum(data)
    const schema: NamingSchema = {
      '{p_title}': {
        value: store.title,
        safe: false,
      },
      '{page_title}': {
        value: store.title,
        safe: false,
      },
      '{p_tag}': {
        value: this.handleTagsRule([store.tag]),
        safe: false,
      },
      '{page_tag}': {
        value: this.handleTagsRule([store.tag]),
        safe: false,
      },
      '{id}': {
        value: this.createId(data, p_num),
        safe: true,
      },
      '{id_num}': {
        value: (data.idNum || parseInt(data.id)).toString(),
        safe: true,
      },
      '{p_num}': {
        value: !rule.includes('{p_num}') ? '' : p_num,
        safe: true,
      },
      '{rank}': {
        value: !rule.includes('{rank}') ? '' : this.createRank(data.rank),
        safe: true,
      },
      '{title}': {
        value: data.title,
        safe: false,
      },
      '{user}': {
        value: this.RemoveAtFromUsername(
          settings.setUserNameList[data.userId] || data.user
        ),
        safe: false,
      },
      '{userid}': {
        value: data.userId,
        safe: true,
      },
      '{user_id}': {
        value: data.userId,
        safe: true,
      },
      '{px}': {
        value: !rule.includes('{px}')
          ? ''
          : data.fullWidth
            ? data.fullWidth + 'x' + data.fullHeight
            : '',
        safe: true,
      },
      '{char_count}': {
        value: !rule.includes('{char_count}') ? '' : this.getCharCount(data),
        safe: true,
      },
      '{tags}': {
        value: !rule.includes('{tags}') ? '' : this.handleTagsRule(data.tags),
        safe: false,
      },
      '{tags_translate}': {
        value: !rule.includes('{tags_translate}')
          ? ''
          : this.handleTagsRule(data.tagsWithTransl),
        safe: false,
      },
      '{tags_transl_only}': {
        value: !rule.includes('{tags_transl_only}')
          ? ''
          : this.handleTagsRule(data.tagsTranslOnly),
        safe: false,
      },
      '{bmk}': {
        value: data.bmk.toString(),
        safe: true,
      },
      '{bmk_id}': {
        value: (data.bmkId || '').toString(),
        safe: true,
      },
      '{bmk_1000}': {
        value: this.getBKM1000(data.bmk).toString(),
        safe: true,
      },
      '{age}': {
        value: Tools.getAgeLimit(data.xRestrict),
        safe: true,
      },
      '{age_r}': {
        value: Tools.getAgeLimit(data.xRestrict, false),
        safe: true,
      },
      '{like}': {
        value: data.likeCount.toString(),
        safe: true,
      },
      '{view}': {
        value: data.viewCount.toString(),
        safe: true,
      },
      '{date}': {
        value: !rule.includes('{date}')
          ? ''
          : DateFormat.format(data.date, settings.dateFormat),
        safe: false,
      },
      '{upload_date}': {
        value: !rule.includes('{upload_date}')
          ? ''
          : DateFormat.format(data.uploadDate, settings.dateFormat),
        safe: false,
      },
      '{task_date}': {
        value: !rule.includes('{task_date}')
          ? ''
          : DateFormat.format(store.crawlCompleteTime, settings.dateFormat),
        safe: false,
      },
      '{type}': {
        value: Config.worksTypeName[data.type],
        safe: true,
      },
      '{type_illust}': {
        value: data.type === 0 ? Config.worksTypeName[data.type] : '',
        safe: true,
      },
      '{type_manga}': {
        value: data.type === 1 ? Config.worksTypeName[data.type] : '',
        safe: true,
      },
      '{type_ugoira}': {
        value: data.type === 2 ? Config.worksTypeName[data.type] : '',
        safe: true,
      },
      '{type_novel}': {
        value: data.type === 3 ? Config.worksTypeName[data.type] : '',
        safe: true,
      },
      '{AI}': {
        value: data.aiType === 2 || data.tags.includes('AI生成') ? 'AI' : '',
        safe: true,
      },
      '{series_title}': {
        value: data.seriesTitle || '',
        safe: false,
      },
      '{series_order}': {
        value: data.seriesOrder === null ? '' : '#' + data.seriesOrder,
        safe: true,
      },
      '{series_id}': {
        value: (data.seriesId ?? '').toString(),
        safe: true,
      },
      '{sl}': {
        value: (data.sl ?? '').toString(),
        safe: true,
      },
    }

    // 3 生成文件名
    let result = this.generateFileName(rule, schema)

    // 5 生成后缀名
    // 处理动图的后缀名
    if (Config.ugoiraExtensions.includes(data.ext) && data.ugoiraInfo) {
      // 如果需要转换动图，则把后缀名设置为用户选择的动图保存格式
      if (settings.imageSize !== 'thumb') {
        data.ext = settings.ugoiraSaveAs
      }
      // 下载动图时，如果选择的尺寸是“方形缩略图”则不修改其后缀名，因为此时下载的是静态缩略图。
      // 其他三种尺寸都是动图。“普通”和“小图”也是动图，只是尺寸比“原图”小。
    }

    // 处理小说的后缀名
    if (data.type === 3) {
      data.ext = settings.novelSaveAs
    }

    const extResult = '.' + data.ext

    // 6 处理不创建文件夹的情况
    if (settings.noFolderSwitch) {
      let noFolder = false
      if (data.type === 3) {
        // 小说
        noFolder = settings.noFolderWhenNovel
      } else if (data.type === 2) {
        // 动图
        noFolder = settings.noFolderWhenSingleImageWork
      } else {
        // 插画或漫画，根据单图作品或多图作品来决定
        if (data.pageCount > 1) {
          noFolder = settings.noFolderWhenMultiImageWork
        } else {
          noFolder = settings.noFolderWhenSingleImageWork
        }
      }

      // 舍弃文件夹部分，只保留文件名
      if (noFolder) {
        result = result.split('/').pop()!
      }
    }

    // 7 处理文件名长度限制
    result = this.lengthLimit(result, extResult, (schema['{id}'] as any).value)

    // 8 添加后缀名
    result += extResult

    // 9 返回结果
    return result
  }

  /** 传入命名规则和所有标记的配置，生成文件名 */
  public generateFileName(rule: string, schema: NamingSchema): string {
    let result = rule
    // 把命名规则里的标记替换成实际值
    for (const [tag, obj] of Object.entries(schema)) {
      if (rule.includes(tag)) {
        // 把空值替换成空字符串
        let temp = obj.value ?? ''

        // 替换不可以作为文件名的特殊字符
        if (!obj.safe) {
          temp = Utils.replaceUnsafeStr(temp)
        }

        // 移除 Emoji。这可能导致一些标记的值变成空字符串，所以需要放在前面，以便后续处理空字符串的情况
        if (settings.removeEmoji) {
          temp = Utils.removeEmojis(temp)
        }

        // 有些标记可能是空字符串，移除它们前面的分割符号
        if (temp === '') {
          result = this.removeEmptyTag(result, tag)
        }

        // 将标记替换成结果，如果有重复的标记，全部替换
        result = result.replace(new RegExp(tag, 'g'), temp)
      }
    }

    // 移除文件名开头的不可用的特殊字符
    result = this.removeStartChar(result)
    // 测试用例
    // const testStr = ' / / {page_tag} / {page_title} /{id}-{user}'
    // console.log(this.removeStartChar(testStr))

    // 如果文件名的尾部是 / 则去掉
    if (result.endsWith('/')) {
      result = result.substring(0, result.length - 1)
    }

    // 处理连续的 /
    result = result.replace(/\/{2,100}/g, '/')

    // 处理一些边界情况
    result = this.handleEdgeCases(result)

    return result
  }

  /** 特定标记与其对应的处理函数的映射 */
  private readonly flagToSettingValue: {
    flag: string
    func: (rule: string, flag: string, data: Result) => string
  }[] = [
    {
      flag: '{multi_image_folder}',
      func: this.getMultiImageFolder.bind(this),
    },
    {
      flag: '{r18_g_folder}',
      func: this.getR18Folder.bind(this),
    },
    {
      flag: '{match_tag_folder}',
      func: (rule: string, flag: string, data: Result) =>
        this.getMatchTagFolder(rule, flag, data, 'createFolderTagList'),
    },
    // {match_tag_folder} 和 {match_tag_folder1} 是相同的
    {
      flag: '{match_tag_folder1}',
      func: (rule: string, flag: string, data: Result) =>
        this.getMatchTagFolder(rule, flag, data, 'createFolderTagList'),
    },
    {
      flag: '{match_tag_folder2}',
      func: (rule: string, flag: string, data: Result) =>
        this.getMatchTagFolder(rule, flag, data, 'createFolderTagList2'),
    },
  ]

  /** 获取 为多图作品添加一层文件夹 的文件夹规则 */
  private getMultiImageFolder(
    rule: string,
    flag: string,
    data: Result
  ): string {
    if (rule.includes(flag)) {
      // 如果满足条件，就把它替换为目标规则，否则替换为空字符串
      if (
        settings.folderForMultiImageWorksSwitch &&
        data.pageCount > 1 &&
        data.pageCount > settings.folderForMultiImageWorksImageNumber
      ) {
        // 原样返回用户设置的文件夹规则，不替换特殊字符，因为这里允许用户使用 / 来建立多层文件夹
        return settings.folderForMultiImageWorksRule
      } else {
        return ''
      }
    }
    return ''
  }

  /** 获取 为 R-18(G) 作品添加一层文件夹 的文件夹规则 */
  private getR18Folder(rule: string, flag: string, data: Result): string {
    if (rule.includes(flag)) {
      // 如果满足条件，就把它替换为目标规则，否则替换为空字符串
      if (
        settings.r18Folder &&
        (data.xRestrict === 1 || data.xRestrict === 2)
      ) {
        // 原样返回用户设置的文件夹规则，不替换特殊字符，因为这里允许用户使用 / 来建立多层文件夹
        return settings.r18FolderName
      } else {
        return ''
      }
    }
    return ''
  }

  /** 获取 使用第一个匹配的标签建立文件夹 的返回值 */
  private getMatchTagFolder(
    rule: string,
    flag: string,
    data: Result,
    key: 'createFolderTagList' | 'createFolderTagList2'
  ): string {
    if (
      !rule.includes(flag) ||
      !settings.createFolderByTag ||
      settings[key].length === 0
    ) {
      return ''
    }

    let value = ''
    const workTags = data.tagsWithTransl.map((val) => val.toLowerCase())
    const userSetTags = settings[key].map((val) => val.toLowerCase())

    // 首选遍历这个作品里所有的标签，查找它能匹配到的所有标签别名
    const aliasList = new Set<string>()
    for (const tag of workTags) {
      const alias = setTagAlias.findAlias(tag)
      if (alias) {
        aliasList.add(alias)
      }
    }
    // console.log('匹配到的所有标签别名：', aliasList)

    // 如果匹配到了任意标签别名，就查找用户设置的标签里是否含有这个别名。如果有就使用它
    // 遍历查找时，遍历的是用户设置的标签列表，而非其他列表
    // 这样用户输入的第一个匹配的 tag 就会作为文件夹名字
    // 不要循环其他列表，因为那样找到的第一个匹配项未必是用户输入的第一个
    // 例如 用户输入顺序：A,B
    // 作品 tag 里的顺序：B,A
    if (aliasList.size > 0) {
      for (const userTag of userSetTags) {
        if (aliasList.has(userTag)) {
          value = userTag
          // console.log('用户使用的别名：', userTag)
          break
        }
      }
    }

    // 如果这个标签没有匹配的别名，或者即使匹配到了，但用户没有使用这个别名，则从用户设置的标签列表里查找
    if (!value) {
      for (const userTag of userSetTags) {
        if (workTags.includes(userTag)) {
          value = userTag
          break
        }
      }
    }

    // 查找结束

    if (value) {
      // 前面匹配时把用户设置的标签转换成小写了，这里需要把它替换成原本的标签
      if (settings[key].includes(value) === false) {
        const index = settings[key].findIndex(
          (tag) => tag.toLowerCase() === value
        )
        if (index !== -1) {
          value = settings[key][index]
        }
      }
      // 替换特殊字符。例如一些标签里含有斜线 /，如果不替换的话会错误的建立文件夹
      const str = this.generateFileName(flag, {
        [flag]: {
          value,
          safe: false,
        },
      })
      return str
    }

    return ''
  }

  /** 处理一个定制功能：如果作品含有某些标签，则对这个作品使用另一种命名规则 */
  private handleCustomFeature(rule: string, data: Result): string {
    // 此规则只会修改文件名，不会修改文件夹
    // 如果一个作品符合多条规则，则把多条规则合并。例如：
    // 包含[原神]，命名规则{id}_genshin
    // 包含[Loli]，命名规则{id}_loli
    // 包含[AI生成]，命名规则{id}_AI
    // 比如说有一张ai生成的原神萝莉图例子，以上三个tag都有，那么把文件命名为{id}_genshin_loli_AI
    let diffNames: string[] = []
    if (settings.UseDifferentNameRuleIfWorkHasTagSwitch) {
      const workTags = data.tags.map((tag) => tag.toLowerCase())
      for (const item of settings.UseDifferentNameRuleIfWorkHasTagList) {
        for (const setTag of item.tags) {
          if (workTags.includes(setTag.toLowerCase())) {
            diffNames.push(item.rule)
            // 一条规则里的 tag 可能会有多个存在于同一个作品的标签列表里
            // 如果匹配到就跳过这条规则，以避免重复添加规则对应的命名规则
            break
          }
        }
      }
    }
    if (diffNames.length > 0) {
      // 把文件名部分设置为 id + diffNames
      const fileName = '{id}' + diffNames.join('').replace(/{id}/g, '')
      const parts = rule.split('/')
      parts[parts.length - 1] = fileName
      rule = parts.join('/')
    }
    return rule
  }

  /** 生成 {tags} 系列标记的值 */
  private handleTagsRule(tags: string[]): string {
    return setTagAlias.handleTagsNamingRule(tags).join(settings.tagsSeparator)
  }

  /** 生成 {rank} 标记的值 */
  private createRank(rank: number | null): string {
    // 处理空值
    if (rank === null) {
      return ''
    }
    // string 是旧版本中使用的，以前抓取结果里的 rank 直接就是 '#1' 这样的字符串，后来改成了数字类型
    if (typeof rank === 'string') {
      return rank
    }
    // 其他情况应该是期望的 number 类型
    return '#' + rank
  }

  /** 生成 {p_num} 标记的值 */
  private createPNum(data: Result) {
    if (data.type === 3) {
      // 小说没有编号，返回空字符串
      return ''
    }

    let index = data.index ?? Tools.getResultIndex(data)
    // 处理第一张图不带序号的情况
    if (index === 0 && settings.noSerialNo) {
      if (data.pageCount === 1 && settings.noSerialNoForSingleImg) {
        return ''
      }
      if (data.pageCount > 1 && settings.noSerialNoForMultiImg) {
        return ''
      }
      if (data.type === 2 && settings.setNoSerialNoForUgoira) {
        return ''
      }
    }

    // 处理序号的起始值
    if (settings.serialNoStart === 1) {
      index = index + 1
    }

    // 处理在序号前面填充 0 的情况
    return this.zeroPadding(index)
  }

  /** 在序号前面填充 0 */
  public zeroPadding(number: number) {
    const p = number.toString()
    return settings.zeroPadding
      ? p.padStart(settings.zeroPaddingLength, '0')
      : p
  }

  /** 生成 {id} 标记的值 */
  private createId(data: Result, p_num: string) {
    // 如果不需要添加序号，或者没有序号，则只返回数字 id
    if (p_num === '') {
      return data.idNum.toString()
    }
    // 添加序号
    return `${data.idNum}_p${p_num}`
  }

  // 返回收藏数的简化显示
  public getBKM1000(bmk: number): string {
    if (bmk < 1000) {
      return '0+'
    } else {
      // 1000 以上，以 1000 为单位
      const str = bmk.toString()
      return str.slice(0, str.length - 3) + '000+'
    }
  }

  /** 获取小说的字数 */
  private getCharCount(data: Result): string {
    if (data.type !== 3) {
      return ''
    }
    if (data.novelMeta?.charCount) {
      return data.novelMeta.charCount.toString()
    } else {
      // 早期版本里没有 charCount 这个字段，所以不可用
      return ''
    }
  }

  /** 在文件名前面添加一层文件夹 */
  // appendFolder 方法会对非法字符进行处理（包括处理路径分隔符 / 这主要是因为 tags 可能含有斜线 /，需要替换）
  private appendFolder(fullPath: string, folderName: string): string {
    const allPart = fullPath.split('/')
    allPart.splice(allPart.length - 1, 0, Utils.replaceUnsafeStr(folderName))
    return allPart.join('/')
  }

  // 不能出现在文件名开头的一些特定字符
  private readonly checkStartCharList = ['/', ' ']

  // 检查文件名开头是否含有特定字符
  private checkStartChar(str: string) {
    for (const check of this.checkStartCharList) {
      if (str.startsWith(check)) {
        return true
      }
    }
    return false
  }

  /** 移除文件名开头的特定字符 */
  private removeStartChar(str: string) {
    while (this.checkStartChar(str)) {
      for (const check of this.checkStartCharList) {
        if (str.startsWith(check)) {
          str = str.replace(check, '')
        }
      }
    }
    return str
  }

  private readonly atList = ['@', '＠']
  public RemoveAtFromUsername(name: string) {
    if (!settings.removeAtFromUsername) {
      return name
    }

    for (const at of this.atList) {
      let index = name.indexOf(at)
      if (index > 0) {
        name = name.substring(0, index)
      }
    }
    return name
  }

  /** 如果某个标记的值是空字符串，则检查它前面是否有分割字符，有的话就把它和分隔符一起去掉。返回修改后的 rule */
  // 例如：如果 {part} 是空字符串，那么 `-{part}` 会留下一个横线 `-`
  // 这里的处理是为了去掉横线。除了 `-` 还检测了其他一些常用的分割字符
  // 但如果用户在前面添加了自定义文字，是无法去掉自定义文字的，例如 `part:{part}` 会留下 `part:`
  private removeEmptyTag(rule: string, tag: string): string {
    const symbols = ['-', '_', ' ', ',', '&', '#']
    for (const symbol of symbols) {
      rule = rule.replaceAll(symbol + tag, '')
    }

    return rule
  }

  /** 如果任意一层路径或文件名是 Windows 保留文件名，则在其后添加这个字符串 */
  private readonly addStr = '[WindowsReservedName]'

  /** 处理一些边界情况 */
  public handleEdgeCases(string: string) {
    // 处理连续的 / 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
    string = string.replace(/\/{2,100}/g, '/')

    // 对每一层路径和文件名进行处理
    const parts = string.split('/')

    for (let i = 0; i < parts.length; i++) {
      // 去掉每层路径首尾的空格
      // 把每层路径头尾的 . 替换成全角的．因为 Chrome 不允许头尾使用 .
      parts[i] = parts[i].trim().replace(/^\./g, '．').replace(/\.$/g, '．')

      // 处理路径是 Windows 保留文件名的情况（不需要处理后缀名）
      parts[i] = Utils.handleWindowsReservedName(parts[i], this.addStr)
    }

    string = parts.join('/')
    return string
  }

  // 文件名超长的一种测试情况：
  // https://www.pixiv.net/search?q=%E3%83%AB%E3%82%B7%E3%82%A2%20-%E3%83%AB%E3%83%BC%E3%82%B7%E3%83%BC%28%E3%82%A8%E3%83%83%E3%82%B8%E3%83%A9%E3%83%B3%E3%83%8A%E3%83%BC%E3%82%BA%29%20-Cyberpunk%20-Edgerunners%20-%E3%82%B5%E3%82%A4%E3%83%90%E3%83%BC%E3%83%91%E3%83%B3%E3%82%AF2077%20-%E3%82%A8%E3%83%83%E3%82%B8%E3%83%A9%E3%83%B3%E3%83%8A%E3%83%BC%E3%82%BA%20-CyberpunkEdgerunners%20-%E3%82%B5%E3%82%A4%E3%83%90%E3%83%BC%E3%83%91%E3%83%B3%E3%82%AF%20-%E3%83%AB%E3%83%BC%E3%82%B7%E3%82%A3%E3%83%BB%E3%83%8F%E3%83%BC%E3%83%88%E3%83%95%E3%82%A3%E3%83%AA%E3%82%A2%20-%E3%83%95%E3%82%A7%E3%82%A2%E3%83%AA%E3%83%BC%E3%83%86%E3%82%A4%E3%83%AB%20-FAIRYTAIL%20-Fairy_Tail%20-Lucy_Loud%20-LucyLoud%20-%E3%83%A9%E3%82%A6%E3%83%89%E3%83%8F%E3%82%A6%E3%82%B9%20-The_Loud_House%20-theloudhouse%20-ElfenLied%20-Elfen_Lied%20-%E3%82%A8%E3%83%AB%E3%83%95%E3%82%A7%E3%83%B3%E3%83%AA%E3%83%BC%E3%83%88%20-VirtualYoutuber&s_mode=tag&type=artwork&ai_type=1
  // 这是一个用户报告的问题，他搜索的标签列表非常长（因为排除了很多标签）：
  // ルシア -ルーシー(エッジランナーズ) -Cyberpunk -Edgerunners -サイバーパンク2077 -エッジランナーズ -CyberpunkEdgerunners -サイバーパンク -ルーシィ・ハートフィリア -フェアリーテイル -FAIRYTAIL -Fairy_Tail -Lucy_Loud -LucyLoud -ラウドハウス -The_Loud_House -theloudhouse -ElfenLied -Elfen_Lied -エルフェンリート -VirtualYoutuber
  // 这导致单个 {page_tag}、{page_title}、{tags} 标签就会导致文件夹或文件名超长。

  /** 处理文件名长度限制
   * @param result 全路径（包含所有文件夹、斜线、文件名），但不包含扩展名
   * @param ext 扩展名，包含 .，例如 '.jpg'
   * @param id 文件名里必须包含的具有唯一性的字符。如果文件名被截断，那么它必然会包含 id，以避免文件名重复
   */
  public lengthLimit(result: string, ext: string, id: string) {
    const fullName = result + ext
    let excess = fullName.length - settings.fullNameLengthLimit

    if (excess <= 0) {
      return result
    }

    // 文件名超长
    if (!settings.fullNameLengthLimitSwitch) {
      // 如果用户未启用此设置，则显示提示
      log.warning(
        lang.transl(
          '_文件名可能超长的提示',
          settings.fullNameLengthLimit.toString(),
          fullName
        ),
        'tipFullNameTooLong'
      )
      return result
    }

    // 开始截断
    // 倒序遍历每一项
    // 优先截断文件名，这是为了尽量保留文件夹的名字完整。因为截断文件夹名字的话，可能会导致一个文件夹产生多个长度不同的版本，导致生成多个不同文件夹，用户体验很差
    // 如果必须截断文件夹名字，那么优先截断内层文件夹，这样可以尽量保持外层文件夹的完整。因为一旦外层文件夹被截断，那么它就成了一个分歧点，其后的文件夹都在它里面。为了避免文件变得非常散乱，必须尽量保持外层文件夹的完整
    const allPart = result.split('/')
    const lastIndex = allPart.length - 1
    for (let i = lastIndex; i >= 0; i--) {
      if (excess <= 0) {
        break
      }

      if (i === lastIndex && allPart[i].length > id.length) {
        // 截断文件名，但最少保留 id 的长度
        const end = Math.max(allPart[i].length - excess, id.length)
        let subString = allPart[i].substring(0, end).trim()
        // 如果文件名截断之后没有包含 id（可能是因为 id 被部分或全部截断了），则把它重设为 id
        if (id && subString.includes(id) === false) {
          subString = id
        }
        // 在文件名末尾添加省略号告诉用户这里被截断了。使用 … 而非三个点 ...，因为 ... 不能用在路径结尾，会导致文件名不合法
        allPart[i] = subString + '…'
      } else {
        // 截断文件夹的名字，但至少保留 25 个字符
        // 使用这个数字是因为一些较短的文件夹名字可能小于这个字数，不会被截断
        // 例如默认的命名规则 pixiv/{user}-{user_id}/{id}-{title} 里，{user}-{user_id} 几乎不会超过 25 个字符
        // PS：fullNameLengthLimit 的默认值是 210。首先选择 25 的倍数 200，然后加上一些余量（因为路径分割符号 / 需要占据 1 个字符长度）
        const minLength = 25
        if (allPart[i].length > minLength) {
          // 计算截断的终点位置，并向下舍入到 minLength 的整倍数
          // 假设原本的终点位置是 46，它会被调整到 25
          // 这是为了尽量避免一些文件夹长度的微小差别导致产生多个不同文件夹的问题
          // 例如对于文件路径：A/B/C.jpg，如果路径 B 的字数较少且不固定（可能在 8 - 25 之间浮动），它不会被截断
          // 之后需要截断 A 的时候，A 的终点位置会被 B 影响，产生许多不同长度的文件夹
          // 所以我使用 minLength 的倍数作为阈值，截断后的文件夹长度会是 25、50、75...，只会有几种不同长度
          // 另外，这个处理会导致下载器截断的字符数量比理论需要的更多，所以最后保留的字数通常会小于限制值
          let end = Math.max(allPart[i].length - excess, minLength)
          // 调整为 minLength 的倍数，并减去省略号的 1 个长度
          end = end - (end % minLength) - 1 - 1
          allPart[i] = allPart[i].substring(0, end).trim() + '…'
        }
      }

      // 每次遍历都可能会修改当前项的内容， 所以需要重新计算超出的长度
      result = allPart.join('/')
      excess = result.length + ext.length - settings.fullNameLengthLimit
    }

    log.warning(
      lang.transl('_下载器截断了一些文件名的提示', fullName),
      'tipTruncatedFullName'
    )
    // 如果处理过后依然超长，那就是极端情况了，暂不处理，因为我也没有更好的方法
    // console.log(result.length)

    return result
  }
}

const fileName = new FileName()
export { fileName }
