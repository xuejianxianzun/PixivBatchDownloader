import { settings } from './setting/Settings'
import { nameRuleManager } from './setting/NameRuleManager'
import './SetUserName'
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
;[]

// 生成文件名
class FileName {
  // 下载器所有的动图格式后缀名
  private readonly ugoiraExt = ['zip', 'webm', 'gif', 'apng']
  private readonly addStr = '[downloader_add]'

  /**传入一个抓取结果，生成其文件名 */
  public createFileName(data: Result) {
    // 命名规则
    let userSetName = nameRuleManager.rule

    // 检查是否要使用特定的其他命名规则
    // 这是一个定制功能，所以这里设置的规则只会修改原有的文件名，而不会涉及到文件夹部分
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
      let fileName = diffNames.join('').replace(/{id}/g, '')
      fileName = '{id}' + fileName

      const names = userSetName.split('/')
      names.splice(names.length - 1, 1, fileName)
      userSetName = names.join('/')
    }

    // 判断是否要为每个作品创建单独的文件夹
    let createFolderForEachWork =
      settings.workDir &&
      store.downloadCount[data.idNum] > settings.workDirFileNumber

    let r18FolderName = settings.r18Folder ? settings.r18FolderName : ''

    const allRule =
      userSetName +
      (createFolderForEachWork ? settings.workDirNameRule : '') +
      r18FolderName

    // 1 生成所有命名标记的值
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
        value: store.tag,
        safe: false,
      },
      '{page_tag}': {
        value: store.tag,
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
        value: !allRule.includes('{p_num}') ? '' : p_num,
        safe: true,
      },
      '{rank}': {
        value: !allRule.includes('{rank}') ? '' : this.createRank(data.rank),
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
        value: !allRule.includes('{px}')
          ? ''
          : data.fullWidth
            ? data.fullWidth + 'x' + data.fullHeight
            : '',
        safe: true,
      },
      '{char_count}': {
        value: !allRule.includes('{char_count}') ? '' : this.getCharCount(data),
        safe: true,
      },
      '{tags}': {
        value: !allRule.includes('{tags}')
          ? ''
          : data.tags.join(settings.tagsSeparator),
        safe: false,
      },
      '{tags_translate}': {
        value: !allRule.includes('{tags_translate}')
          ? ''
          : data.tagsWithTransl.join(settings.tagsSeparator),
        safe: false,
      },
      '{tags_transl_only}': {
        value: !allRule.includes('{tags_transl_only}')
          ? ''
          : data.tagsTranslOnly.join(settings.tagsSeparator),
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
        value: !allRule.includes('{date}')
          ? ''
          : DateFormat.format(data.date, settings.dateFormat),
        safe: false,
      },
      '{upload_date}': {
        value: !allRule.includes('{upload_date}')
          ? ''
          : DateFormat.format(data.uploadDate, settings.dateFormat),
        safe: false,
      },
      '{task_date}': {
        value: !allRule.includes('{task_date}')
          ? ''
          : DateFormat.format(store.crawlCompleteTime, settings.dateFormat),
        safe: false,
      },
      '{type}': {
        value: Config.worksTypeName[data.type],
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
        value: (data.sl ?? 0).toString(),
        safe: true,
      },
    }

    // 2 生成文件名
    let result = this.generateFileName(userSetName, schema)

    // 3 根据某些设置向结果中添加新的文件夹
    // 注意：添加文件夹的顺序会影响文件夹的层级，所以不可随意更改顺序

    // 根据作品类型自动创建对应的文件夹
    if (settings.createFolderByType) {
      // 根据作品类型和对应开关确定是否需要要为其建立文件夹
      const allSwitch = [
        settings.createFolderByTypeIllust,
        settings.createFolderByTypeManga,
        settings.createFolderByTypeUgoira,
        settings.createFolderByTypeNovel,
      ]
      if (allSwitch[data.type]) {
        const folder = Config.worksTypeName[data.type]
        result = this.appendFolder(result, folder)
      }
    }

    // 根据 sl 创建文件夹
    if (settings.createFolderBySl && data.sl !== null) {
      const folder = 'sl' + schema['{sl}'].value
      result = this.appendFolder(result, folder)
    }

    // 根据第一个匹配的 tag 建立文件夹
    if (settings.createFolderByTag && settings.createFolderTagList.length > 0) {
      const workTags = data.tagsWithTransl.map((val) => val.toLowerCase())

      // 循环用户输入的 tag 列表，查找作品 tag 是否含有匹配项
      // 这样用户输入的第一个匹配的 tag 就会作为文件夹名字
      // 不要循环作品 tag 列表，因为那样找到的第一个匹配项未必是用户输入的第一个
      // 例如 用户输入顺序：巨乳 欧派
      // 作品 tag 里的顺序：欧派 巨乳
      for (const tag of settings.createFolderTagList) {
        // 查找匹配的时候转换成小写
        const nowTag = tag.toLowerCase()
        if (workTags.includes(nowTag)) {
          // 设置为文件夹名字的时候使用原 tag（不转换成小写）
          result = this.appendFolder(result, tag)
          break
        }
      }
    }

    // 把 R18(G) 作品存入指定目录里
    if (settings.r18Folder && (data.xRestrict === 1 || data.xRestrict === 2)) {
      result = this.appendFolder(
        result,
        this.generateFileName(r18FolderName, schema)
      )
    }

    // 为每个作品创建单独的文件夹
    if (createFolderForEachWork) {
      const workDirName = this.generateFileName(
        settings.workDirNameRule,
        schema
      )
      // 生成文件名。由于用户可能会添加斜线来建立多层路径，所以需要循环添加每个路径
      const allPath = workDirName.split('/')
      for (const path of allPath) {
        if (path.length > 0) {
          result = this.appendFolder(result, path)
        }
      }
    }

    // 4 文件夹部分和文件名已经全部生成完毕，处理一些边界情况
    result = this.handleEdgeCases(result)

    // 5 生成后缀名
    // 如果是动图，那么此时
    if (this.ugoiraExt.includes(data.ext) && data.ugoiraInfo) {
      // 如果需要转换动图，则把后缀名设置为用户选择的动图保存格式
      if (settings.imageSize !== 'thumb') {
        data.ext = settings.ugoiraSaveAs
      }
      // 下载动图时，如果选择的尺寸是“方形缩略图”则不修改其后缀名，因为此时下载的是静态缩略图。
      // 其他三种尺寸都是动图。“普通”和“小图”也是动图，只是尺寸比“原图”小。
    }
    // 如果是小说，那么此时根据用户设置的动图保存格式，更新其后缀名
    if (data.type === 3) {
      data.ext = settings.novelSaveAs
    }
    const extResult = '.' + data.ext

    // 6 处理不创建文件夹的情况
    if (settings.notFolderWhenOneFile && store.result.length === 1) {
      // 舍弃文件夹部分，只保留文件名
      result = result.split('/').pop()!
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

    return result
  }

  // 生成 {rank} 标记的值
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

  // 生成 {p_num} 标记的值
  private createPNum(data: Result) {
    if (data.type === 0 || data.type === 1 || data.type === 2) {
      const index = data.index ?? Tools.getResultIndex(data)
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

      return this.zeroPadding(index)
    } else {
      // 小说没有编号，返回空字符串
      return ''
    }
  }

  /** 处理在前面填充 0 的情况 */
  public zeroPadding(number: number) {
    const p = number.toString()
    return settings.zeroPadding
      ? p.padStart(settings.zeroPaddingLength, '0')
      : p
  }

  // 生成 {id} 标记的值
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

  // 在文件名前面添加一层文件夹
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

  // 移除文件名开头的特定字符
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

  /** 处理一些边界情况 */
  public handleEdgeCases(result: string) {
    // 处理连续的 / 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
    result = result.replace(/\/{2,100}/g, '/')

    // 对每一层路径和文件名进行处理
    const paths = result.split('/')

    for (let i = 0; i < paths.length; i++) {
      // 去掉每层路径首尾的空格
      // 把每层路径头尾的 . 替换成全角的．因为 Chrome 不允许头尾使用 .
      paths[i] = paths[i].trim().replace(/^\./g, '．').replace(/\.$/g, '．')

      // 处理路径是 Windows 保留文件名的情况（不需要处理后缀名）
      paths[i] = Utils.handleWindowsReservedName(paths[i], this.addStr)
    }

    result = paths.join('/')
    return result
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
