import { settings } from './setting/Settings'
import { store } from './Store'
import { Result } from './Store.d'
import config from './Config'
import { states } from './States'
import { DateFormat } from './DateFormat'
import { Tools } from './Tools'

// 生成文件名
class FileName {
  constructor() { }

  // 生成文件名
  public getFileName(data: Result) {
    // 为空时使用 {id}
    let result = settings.userSetName || '{id}'

    // 配置所有命名标记
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
        value: data.id,
        prefix: '',
        safe: true,
      },
      '{id_num}': {
        value: data.idNum || parseInt(data.id),
        prefix: '',
        safe: true,
      },
      '{p_num}': {
        value: parseInt(/\d*$/.exec(data.id)![0]),
        prefix: '',
        safe: true,
      },
      '{rank}': {
        value: data.rank,
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
        value: (function () {
          if (result.includes('{px}') && data.fullWidth !== undefined) {
            return data.fullWidth + 'x' + data.fullHeight
          } else {
            return ''
          }
        })(),
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
        value: config.illustTypes[data.type],
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

    // 替换命名规则里的特殊字符
    result = Tools.replaceUnsafeStr(result)
    // 上一步会把斜线 / 替换成全角的斜线 ／，这里再替换回来，否则就不能建立文件夹了
    result = result.replace(/／/g, '/')

    // 判断这个作品是否要去掉序号
    const noSerialNo = cfg['{p_num}'].value === 0 && settings.noSerialNo

    // 把命名规则的标记替换成实际值
    for (const [key, val] of Object.entries(cfg)) {
      if (result.includes(key)) {
        // 处理去掉序号的情况
        if (noSerialNo) {
          // 把 p_num 设为空字符串
          key === '{p_num}' && (val.value = '' as any)
          // 去掉 id 后面的序号。因为 idNum 不带序号，所以直接拿来用了
          key === '{id}' && (val.value = cfg['{id_num}'].value)
        }

        let once = String(val.value)

        // 处理标记值中的特殊字符
        if (!val.safe) {
          once = Tools.replaceUnsafeStr(once)
        }

        // 添加标记名称
        if (settings.tagNameToFileName) {
          once = val.prefix + once
        }

        result = result.replace(new RegExp(key, 'g'), once) // 将标记替换成最终值，如果有重复的标记，全部替换
      }
    }

    // 处理空值，连续的 '//'。 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
    result = result.replace(/undefined/g, '').replace(/\/{2,9}/, '/')

    // 对每一层路径进行处理
    let tempArr = result.split('/')
    tempArr.forEach((str, index, arr) => {
      // 替换路径首尾的空格
      // 把每层路径头尾的 . 变成全角的．因为 Chrome 不允许头尾使用 .
      arr[index] = str.trim().replace(/^\./g, '．').replace(/\.$/g, '．')
    })
    result = tempArr.join('/')

    // 去掉头尾的 /
    if (result.startsWith('/')) {
      result = result.replace('/', '')
    }
    if (result.endsWith('/')) {
      result = result.substr(0, result.length - 1)
    }

    // 如果快速下载时只有一个文件，根据“始终建立文件夹”选项，决定是否去掉文件夹部分
    if (
      states.quickDownload &&
      store.result.length === 1 &&
      !settings.alwaysFolder
    ) {
      const index = result.lastIndexOf('/')
      result = result.substr(index + 1, result.length)
    }

    // 如果这个作品里要下载的文件数量大于指定数量，则会为它建立单独的文件夹
    if (
      settings.workDir &&
      data.dlCount > settings.workDirFileNumber
    ) {
      // 操作路径中最后一项（即文件名），在它前面添加一层文件夹
      const allPart = result.split('/')
      const lastPartIndex = allPart.length - 1
      let lastPart = allPart[lastPartIndex]
      let addString = ''

      if (settings.workDirName === '1') {
        // 使用作品 id 作为文件夹名
        addString = data.idNum.toString()
      } else if (settings.workDirName === '2') {
        // 遵从命名规则，使用文件名做文件夹名
        // 这里进行了一个替换，因为多图每个图片的名字都不同，这主要是因为 id 后面的序号不同。这会导致文件夹名也不同，有多少个文件就会建立多少个文件夹，而不是统一建立一个文件夹。为了只建立一个文件夹，需要把 id 后面的序号部分去掉。
        // 但是如果一些特殊的命名规则并没有包含 {id} 部分，文件名的区别得不到处理，依然会每个文件建立一个文件夹。
        addString = lastPart.replace(data.id, data.idNum.toString())
      }

      lastPart = addString + '/' + lastPart
      allPart[lastPartIndex] = lastPart
      result = allPart.join('/')
    }

    // 生成后缀名
    // 如果是动图，那么此时根据用户设置的动图保存格式，更新其后缀名
    const ugoiraFormat = ['webm', 'gif', 'png']
    if (ugoiraFormat.includes(data.ext) && data.ugoiraInfo) {
      data.ext = settings.ugoiraSaveAs
    }
    // 如果是小说，那么此时根据用户设置的动图保存格式，更新其后缀名
    if (data.type === 3) {
      data.ext = settings.novelSaveAs
    }
    const extResult = '.' + data.ext

    // 处理文件名长度限制
    // 去掉文件夹部分，只处理 文件名+后缀名 部分
    // 理论上文件夹部分也可能会超长，但是实际使用中几乎不会有人这么设置，所以不处理
    if (settings.fileNameLengthLimitSwitch) {
      let limit = settings.fileNameLengthLimit
      if (limit < 1 || isNaN(limit)) {
        limit = 200 // 如果设置的值不合法，则设置为 200
      }

      const allPart = result.split('/')
      const lastIndex = allPart.length - 1

      if (allPart[lastIndex].length + extResult.length > limit) {
        allPart[lastIndex] = allPart[lastIndex].substr(
          0,
          limit - extResult.length,
        )
      }

      result = allPart.join('/')
    }

    // 添加后缀名
    result += extResult

    return result
  }
}

const fileName = new FileName()
export { fileName }
