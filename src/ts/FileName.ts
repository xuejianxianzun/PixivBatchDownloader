import { setSetting, settings } from './setting/Settings'
import { store } from './store/Store'
import { Result } from './store/StoreType'
import { Config } from './config/Config'
import { DateFormat } from './utils/DateFormat'
import { Utils } from './utils/Utils'
import { Tools } from './Tools'

// 生成文件名
class FileName {
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
    const index = data.index ?? Tools.getResultIndex(data)

    // 处理第一张图不带序号的情况
    if (index === 0 && settings.noSerialNo) {
      return ''
    }

    // 只有插画和漫画有编号
    if (data.type === 0 || data.type === 1) {
      const p = index.toString()
      // 根据需要在前面填充 0
      return settings.zeroPadding ? p.padStart(settings.zeroPaddingLength, '0') : p
    } else {
      // 其他类型没有编号，返回空字符串
      return ''
    }
  }

  // 生成 {id} 标记的值
  private createId(data: Result) {
    const index = data.index ?? Tools.getResultIndex(data)

    // 处理第一张图不带序号的情况
    if (index === 0 && settings.noSerialNo) {
      return data.idNum.toString()
    }

    if (!settings.zeroPadding) {
      return data.id
    } else {
      // 需要填充 0 的情况
      // 只有插画和漫画有编号
      if (data.type === 0 || data.type === 1) {
        return data.idNum + '_p' + index.toString().padStart(settings.zeroPaddingLength, '0')
      } else {
        // 其他类型没有编号，所以不会进行填充，直接返回 id
        return data.id
      }
    }
  }

  // 在文件名前面添加一层文件夹
  private appendFolder(fullPath: string, folderName: string): string {
    const allPart = fullPath.split('/')
    allPart.splice(allPart.length - 1, 0, Utils.replaceUnsafeStr(folderName))
    return allPart.join('/')
  }

  // 传入抓取结果，获取文件名
  public getFileName(data: Result) {
    let result = settings.userSetName || '{id}'

    // 1 生成所有命名标记的值
    const cfg = {
      '{p_title}': {
        value: store.title,
        prefix: '',
        safe: false,
      },
      '{p_tag}': {
        value: store.tag,
        prefix: '',
        safe: false,
      },
      '{id}': {
        value: this.createId(data),
        prefix: '',
        safe: true,
      },
      '{id_num}': {
        value: data.idNum || parseInt(data.id),
        prefix: '',
        safe: true,
      },
      '{p_num}': {
        value: this.createPNum(data),
        prefix: '',
        safe: true,
      },
      '{rank}': {
        value: this.createRank(data.rank),
        prefix: '',
        safe: true,
      },
      '{title}': {
        value: data.title,
        prefix: 'title_',
        safe: false,
      },
      '{user}': {
        value: data.user,
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
        value: data.fullWidth ? data.fullWidth + 'x' + data.fullHeight : '',
        prefix: '',
        safe: true,
      },
      '{tags}': {
        value: data.tags.join(','),
        prefix: 'tags_',
        safe: false,
      },
      '{tags_translate}': {
        value: data.tagsWithTransl.join(','),
        prefix: 'tags_',
        safe: false,
      },
      '{tags_transl_only}': {
        value: data.tagsTranslOnly.join(','),
        prefix: 'tags_',
        safe: false,
      },
      '{bmk}': {
        value: data.bmk,
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
        value: DateFormat.format(data.date, settings.dateFormat),
        prefix: '',
        safe: false,
      },
      '{task_date}': {
        value: DateFormat.format(store.crawlCompleteTime, settings.dateFormat),
        prefix: '',
        safe: false,
      },
      '{type}': {
        value: Config.worksTypeName[data.type],
        prefix: '',
        safe: true,
      },
      '{series_title}': {
        value: data.seriesTitle || '',
        prefix: '',
        safe: false,
      },
      '{series_order}': {
        value: data.seriesOrder || '',
        prefix: '',
        safe: true,
      },
    }

    // 2 把命名规则里的标记替换成实际值
    for (const [key, val] of Object.entries(cfg)) {
      if (result.includes(key)) {
        // 替换空值
        let temp =
          val.value === undefined || val.value === null ? '' : val.value

        // 如果这个值不是字符串则转换为字符串
        temp = typeof temp !== 'string' ? temp.toString() : temp

        // 替换值里不可以作为文件名的特殊字符
        if (!val.safe) {
          temp = Utils.replaceUnsafeStr(temp)
        }

        // 添加标记名称
        if (settings.tagNameToFileName) {
          temp = val.prefix + temp
        }

        // 将标记替换成对应的结果，如果有重复的标记，全部替换
        result = result.replace(new RegExp(key, 'g'), temp)
      }
    }

    // 3 处理文件名里的一些边界情况

    // 处理结果中连续的 /
    result = result.replace(/\/{2,100}/g, '/')

    // 如果结果的头部或者尾部是 / 则去掉
    if (result.startsWith('/')) {
      result = result.replace('/', '')
    }
    if (result.endsWith('/')) {
      result = result.substr(0, result.length - 1)
    }

    // 4 根据某些设置向结果中添加新的文件夹
    // 其顺序会影响最后生成的文件夹层级，不可随意更改顺序
    // appendFolder 方法会对非法字符进行处理（主要是因为 tags 可能含有斜线 /，需要替换）

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
      result = this.appendFolder(result, settings.r18FolderName)
    }

    // 为作品建立单独的文件夹
    // 如果这个作品里要下载的文件数量大于指定数量，则会为它建立单独的文件夹
    if (settings.workDir && data.dlCount > settings.workDirFileNumber) {
      const allPart = result.split('/')
      const name = allPart[allPart.length - 1]

      let folder = ''
      if (settings.workDirName === 'id') {
        // 使用作品 id 作为文件夹名
        folder = data.idNum.toString()
      } else if (settings.workDirName === 'rule') {
        // 遵从命名规则，使用文件名做文件夹名
        // 这里进行了一个替换，因为多图每个图片的名字都不同，这主要是因为 id 后面的序号不同。这会导致文件夹名也不同，有多少个文件就会建立多少个文件夹，而不是统一建立一个文件夹。为了只建立一个文件夹，需要把 id 后面的序号部分去掉。
        // 但是如果一些特殊的命名规则并没有包含 {id} 部分，文件名的区别得不到处理，依然会每个文件建立一个文件夹。
        folder = name.replace(data.id, data.idNum.toString())
      }

      result = this.appendFolder(result, folder)
    }

    // 5 文件夹部分和文件名已经全部生成完毕，处理一些边界情况

    // 处理连续的 / 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
    result = result.replace(/\/{2,100}/g, '/')

    // 对每一层路径和文件名进行处理
    const pathArray = result.split('/')

    for (let i = 0; i < pathArray.length; i++) {
      let str = pathArray[i]

      // 去掉每层路径首尾的空格
      // 把每层路径头尾的 . 替换成全角的．因为 Chrome 不允许头尾使用 .
      str = str.trim().replace(/^\./g, '．').replace(/\.$/g, '．')

      // 处理路径是 Windows 保留文件名的情况（不需要处理后缀名）
      str = Utils.handleWindowsReservedName(str, this.addStr)

      pathArray[i] = str
    }

    result = pathArray.join('/')

    // 6 生成后缀名
    // 如果是动图，那么此时根据用户设置的动图保存格式，更新其后缀名
    const ugoiraExt = ['zip', 'webm', 'gif', 'png']
    if (ugoiraExt.includes(data.ext) && data.ugoiraInfo) {
      data.ext = settings.ugoiraSaveAs
    }
    // 如果是小说，那么此时根据用户设置的动图保存格式，更新其后缀名
    if (data.type === 3) {
      data.ext = settings.novelSaveAs
    }
    const extResult = '.' + data.ext

    // 7 文件名长度限制
    // 去掉文件夹部分，只处理 文件名+后缀名 部分
    // 理论上文件夹部分也可能会超长，但是实际使用中几乎不会有人这么设置，所以不处理
    if (settings.fileNameLengthLimitSwitch) {
      let limit = settings.fileNameLengthLimit
      if (limit < 1) {
        limit = 200 // 如果设置的值不合法，则设置为 200
      }

      const allPart = result.split('/')
      const lastIndex = allPart.length - 1

      if (allPart[lastIndex].length + extResult.length > limit) {
        allPart[lastIndex] = allPart[lastIndex].substr(
          0,
          limit - extResult.length
        )
      }

      result = allPart.join('/')
    }

    // 8 添加后缀名
    result += extResult

    return result
  }
}

const fileName = new FileName()
export { fileName }
