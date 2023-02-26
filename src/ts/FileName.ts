import { settings } from './setting/Settings'
import { nameRuleManager } from './setting/NameRuleManager'
import './SetUserName'
import { store } from './store/Store'
import { Result } from './store/StoreType'
import { Config } from './Config'
import { DateFormat } from './utils/DateFormat'
import { Utils } from './utils/Utils'
import { Tools } from './Tools'

// 生成文件名
class FileName {
  // 下载器所有的动图格式后缀名
  private readonly ugoiraExt = ['zip', 'webm', 'gif', 'png']

  private readonly addStr = '[downloader_add]'

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
    // 其他的情况则应该是期望的值（数字类型）
    return '#' + rank
  }

  // 生成 {p_num} 标记的值
  private createPNum(data: Result) {
    // 只有插画和漫画有编号
    if (data.type === 0 || data.type === 1) {
      const index = data.index ?? Tools.getResultIndex(data)
      // 处理第一张图不带序号的情况
      if (index === 0 && settings.noSerialNo) {
        if (data.pageCount === 1 && settings.noSerialNoForSingleImg) {
          return ''
        }
        if (data.pageCount > 1 && settings.noSerialNoForMultiImg) {
          return ''
        }
      }

      const p = index.toString()
      // 处理在前面填充 0 的情况
      return settings.zeroPadding
        ? p.padStart(settings.zeroPaddingLength, '0')
        : p
    } else {
      // 其他类型没有编号，返回空字符串
      return ''
    }
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
  private getBKM1000(bmk: number): string {
    if (bmk < 1000) {
      return '0+'
    } else {
      // 1000 以上，以 1000 为单位
      const str = bmk.toString()
      return str.slice(0, str.length - 3) + '000+'
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
  private RemoveAtFromUsername(name: string) {
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

  // 传入命名规则和所有标记，生成文件名
  private generateFileName(rule: string, cfg: Object) {
    let result = rule
    // 把命名规则里的标记替换成实际值
    for (const [key, val] of Object.entries(cfg)) {
      if (rule.includes(key)) {
        // 空值替换成空字符串
        let temp = val.value ?? ''

        // 如果这个值不是字符串类型则转换为字符串
        temp = typeof temp !== 'string' ? temp.toString() : temp

        // 替换不可以作为文件名的特殊字符
        if (!val.safe) {
          temp = Utils.replaceUnsafeStr(temp)
        }

        // 添加标记前缀
        if (settings.tagNameToFileName) {
          temp = val.prefix + temp
        }

        // 将标记替换成结果，如果有重复的标记，全部替换
        result = result.replace(new RegExp(key, 'g'), temp)
      }
    }

    // 处理文件名里的一些边界情况

    // 如果文件名开头不可用的特殊字符
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

    const allNameRule =
      userSetName +
      (createFolderForEachWork ? settings.workDirNameRule : '') +
      r18FolderName

    // 1 生成所有命名标记的值
    // 对于一些较为耗时的计算，先判断用户设置的命名规则里是否使用了这个标记，如果未使用则不计算
    const p_num = this.createPNum(data)
    const cfg = {
      '{p_title}': {
        value: store.title,
        prefix: '',
        safe: false,
      },
      '{page_title}': {
        value: store.title,
        prefix: '',
        safe: false,
      },
      '{p_tag}': {
        value: store.tag,
        prefix: '',
        safe: false,
      },
      '{page_tag}': {
        value: store.tag,
        prefix: '',
        safe: false,
      },
      '{id}': {
        value: this.createId(data, p_num),
        prefix: '',
        safe: true,
      },
      '{id_num}': {
        value: data.idNum || parseInt(data.id),
        prefix: '',
        safe: true,
      },
      '{p_num}': {
        value: !allNameRule.includes('{p_num}') ? null : p_num,
        prefix: '',
        safe: true,
      },
      '{rank}': {
        value: !allNameRule.includes('{rank}')
          ? null
          : this.createRank(data.rank),
        prefix: '',
        safe: true,
      },
      '{title}': {
        value: data.title,
        prefix: 'title_',
        safe: false,
      },
      '{user}': {
        value: this.RemoveAtFromUsername(
          settings.setUserNameList[data.userId] || data.user
        ),
        prefix: 'user_',
        safe: false,
      },
      '{userid}': {
        value: data.userId,
        prefix: 'uid_',
        safe: true,
      },
      '{user_id}': {
        value: data.userId,
        prefix: 'uid_',
        safe: true,
      },
      '{px}': {
        value: !allNameRule.includes('{px}')
          ? null
          : data.fullWidth
          ? data.fullWidth + 'x' + data.fullHeight
          : '',
        prefix: '',
        safe: true,
      },
      '{tags}': {
        value: !allNameRule.includes('{tags}') ? null : data.tags.join(','),
        prefix: 'tags_',
        safe: false,
      },
      '{tags_translate}': {
        value: !allNameRule.includes('{tags_translate}')
          ? null
          : data.tagsWithTransl.join(','),
        prefix: 'tags_',
        safe: false,
      },
      '{tags_transl_only}': {
        value: !allNameRule.includes('{tags_transl_only}')
          ? null
          : data.tagsTranslOnly.join(','),
        prefix: 'tags_',
        safe: false,
      },
      '{bmk}': {
        value: data.bmk,
        prefix: 'bmk_',
        safe: true,
      },
      '{bmk_id}': {
        value: data.bmkId || '',
        prefix: 'bmk-id_',
        safe: true,
      },
      '{bmk_1000}': {
        value: this.getBKM1000(data.bmk),
        prefix: 'bmk_',
        safe: true,
      },
      '{like}': {
        value: data.likeCount,
        prefix: 'like_',
        safe: true,
      },
      '{view}': {
        value: data.viewCount,
        prefix: 'view_',
        safe: true,
      },
      '{date}': {
        value: !allNameRule.includes('{date}')
          ? null
          : DateFormat.format(data.date, settings.dateFormat),
        prefix: '',
        safe: false,
      },
      '{upload_date}': {
        value: !allNameRule.includes('{upload_date}')
          ? null
          : DateFormat.format(data.uploadDate, settings.dateFormat),
        prefix: '',
        safe: false,
      },
      '{task_date}': {
        value: !allNameRule.includes('{task_date}')
          ? null
          : DateFormat.format(store.crawlCompleteTime, settings.dateFormat),
        prefix: '',
        safe: false,
      },
      '{type}': {
        value: Config.worksTypeName[data.type],
        prefix: '',
        safe: true,
      },
      '{AI}': {
        value: data.aiType === 2 ? 'AI' : '',
        prefix: '',
        safe: true,
      },
      '{series_title}': {
        value: data.seriesTitle || '',
        prefix: '',
        safe: false,
      },
      '{series_order}': {
        value: data.seriesOrder === null ? '' : '#' + data.seriesOrder,
        prefix: '',
        safe: true,
      },
      '{series_id}': {
        value: data.seriesId,
        prefix: '',
        safe: true,
      },
      '{sl}': {
        value: data.sl ?? 0,
        prefix: '',
        safe: true,
      },
    }

    // 2 生成文件名
    let result = this.generateFileName(userSetName, cfg)

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
      const folder = 'sl' + data.sl.toString()
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
        this.generateFileName(r18FolderName, cfg)
      )
    }

    // 为每个作品创建单独的文件夹
    if (createFolderForEachWork) {
      const workDirName = this.generateFileName(settings.workDirNameRule, cfg)
      // 生成文件名。由于用户可能会添加斜线来建立多层路径，所以需要循环添加每个路径
      const allPath = workDirName.split('/')
      for (const path of allPath) {
        if (path.length > 0) {
          result = this.appendFolder(result, path)
        }
      }
    }

    // 4 文件夹部分和文件名已经全部生成完毕，处理一些边界情况

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

    // 5 生成后缀名
    // 如果是动图，那么此时根据用户设置的动图保存格式，更新其后缀名
    if (
      this.ugoiraExt.includes(data.ext) &&
      data.ugoiraInfo &&
      settings.imageSize !== 'thumb'
    ) {
      // 当下载图片的方形缩略图时，不修改其后缀名，因为此时下载的是作品的静态缩略图，不是动图
      data.ext = settings.ugoiraSaveAs
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

    // 7 文件名长度限制
    // 不计算文件夹的长度，只计算 文件名+后缀名 部分
    // 理论上文件夹部分也可能会超长，但是实际使用中几乎不会有人这么设置，所以不处理
    if (settings.fileNameLengthLimitSwitch) {
      let limit = settings.fileNameLengthLimit
      const allPart = result.split('/')
      const lastIndex = allPart.length - 1

      if (allPart[lastIndex].length + extResult.length > limit) {
        allPart[lastIndex] = allPart[lastIndex].substring(
          0,
          limit - extResult.length
        )
      }

      result = allPart.join('/')
    }

    // 8 添加后缀名
    result += extResult

    // 9 返回结果
    return result
  }
}

const fileName = new FileName()
export { fileName }
