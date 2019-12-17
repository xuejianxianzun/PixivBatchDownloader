// 生成文件名
import { WorkInfo } from './Store.d'
import { ui } from './UI'
import { EVT } from './EVT'
import { store } from './Store'

class FileName {
  constructor() {
    window.addEventListener(EVT.events.previewFileName, () => {
      const text = this.previewFileName()
      EVT.fire(EVT.events.output, text)
    })
  }
  // 用正则过滤不安全的字符，（Chrome 和 Windows 不允许做文件名的字符）
  // 不安全的字符，这里多数是控制字符，需要替换掉
  private unsafeStr = new RegExp(
    /[\u0001-\u001f\u007f-\u009f\u00ad\u0600-\u0605\u061c\u06dd\u070f\u08e2\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff]/g
  )
  // 一些需要替换成全角字符的符号，左边是正则表达式的字符
  private fullWidthDict: string[][] = [
    ['\\\\', '＼'],
    ['/', '／'],
    [':', '：'],
    ['\\?', '？'],
    ['"', '＂'],
    ['<', '＜'],
    ['>', '＞'],
    ['\\*', '＊'],
    ['\\|', '｜'],
    ['~', '～']
  ]

  // 把一些特殊字符替换成全角字符
  private replaceUnsafeStr(str: string) {
    str = str.replace(this.unsafeStr, '')
    for (let index = 0; index < this.fullWidthDict.length; index++) {
      const rule = this.fullWidthDict[index]
      const reg = new RegExp(rule[0], 'g')
      str = str.replace(reg, rule[1])
    }
    return str
  }

  // 生成文件名，传入参数为图片信息
  public getFileName(data: WorkInfo) {
    let result = ui.form.userSetName.value
    // 为空时使用 {id}
    result = result || '{id}' // 生成文件名
    const illustTypes = ['illustration', 'manga', 'ugoira'] // 作品类型 0 插画 1 漫画 2 动图

    // 储存每个文件名标记的配置
    const cfg = [
      {
        name: '{p_user}',
        // 标记
        value: store.pageInfo.pageUserName,
        // 值
        prefix: '',
        // 添加在前面的标记
        safe: false
        // 是否是安全的文件名。如果可能包含一些特殊字符，就不安全，要进行替换
      },
      {
        name: '{p_uid}',
        value: store.pageInfo.pageUserID || '',
        prefix: '',
        safe: true
      },
      {
        name: '{p_title}',
        value: document.title
          .replace(/\[(0|↑|→|▶|↓|║|■|√| )\] /, '')
          .replace(/^\(\d.*\) /, ''),
        // 去掉标题上的下载状态、消息数量提示
        prefix: '',
        safe: false
      },
      {
        name: '{p_tag}',
        value: store.pageInfo.pageTag,
        prefix: '',
        safe: false
      },
      {
        name: '{id}',
        value: data.id,
        prefix: '',
        safe: true
      },
      {
        name: '{id_num}',
        value: parseInt(data.id),
        prefix: '',
        safe: true
      },
      {
        name: '{p_num}',
        value: parseInt(/\d*$/.exec(data.id)![0]),
        prefix: '',
        safe: true
      },
      {
        name: '{rank}',
        value: data.rank,
        prefix: '',
        safe: true
      },
      {
        name: '{title}',
        value: data.title,
        prefix: 'title_',
        safe: false
      },
      {
        name: '{user}',
        value: data.user,
        prefix: 'user_',
        safe: false
      },
      {
        name: '{userid}',
        value: data.userid,
        prefix: 'uid_',
        safe: true
      },
      {
        name: '{px}',
        value: (function() {
          if (result.includes('{px}') && data.fullWidth !== undefined) {
            return data.fullWidth + 'x' + data.fullHeight
          } else {
            return ''
          }
        })(),
        prefix: '',
        safe: true
      },
      {
        name: '{tags}',
        value: data.tags.join(','),
        prefix: 'tags_',
        safe: false
      },
      {
        name: '{tags_translate}',
        value: data.tagsTranslated.join(','),
        prefix: 'tags_',
        safe: false
      },
      {
        name: '{bmk}',
        value: data.bmk,
        prefix: 'bmk_',
        safe: true
      },
      {
        name: '{date}',
        value: data.date,
        prefix: '',
        safe: true
      },
      {
        name: '{type}',
        value: illustTypes[data.type],
        prefix: '',
        safe: true
      }
    ]

    // 替换命名规则里的特殊字符
    result = this.replaceUnsafeStr(result)
    // 上一步会把斜线 / 替换成全角的斜线 ／，这里再替换回来，否则就不能建立文件夹了
    result = result.replace(/／/g, '/')

    // 把命名规则的标记替换成实际值
    for (const item of cfg) {
      if (
        result.includes(item.name) &&
        item.value !== '' &&
        item.value !== null
      ) {
        // 只有当标记有值时才继续操作. 所以没有值的标记会原样保留
        let once = String(item.value)

        // 处理标记值中的特殊字符
        if (!item.safe) {
          once = this.replaceUnsafeStr(once)
        }

        // 添加标记名称
        if (ui.form.tagNameToFileName.checked) {
          once = item.prefix + once
        }

        result = result.replace(new RegExp(item.name, 'g'), once) // 将标记替换成最终值，如果有重复的标记，全部替换
      }
    }

    // 处理空值，连续的 '//'。 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
    result = result.replace(/undefined/g, '').replace(/\/{2,9}/, '/')

    // 对每一层路径进行处理
    let tempArr = result.split('/')
    tempArr.forEach((str, index, arr) => {
      // 替换路径首尾的空格
      // 把每层路径头尾的 . 变成全角的．因为 Chrome 不允许头尾使用 .
      arr[index] = str
        .trim()
        .replace(/^\./g, '．')
        .replace(/\.$/g, '．')
    })
    result = tempArr.join('/')

    // 去掉头尾的 /
    if (result.startsWith('/')) {
      result = result.replace('/', '')
    }
    if (result.endsWith('/')) {
      result = result.substr(0, result.length - 1)
    }

    // 如果快速下载时只有一个文件，根据“始终建立文件夹”选项，决定是否建立文件夹
    if (
      store.states.quickDownload &&
      store.result.length === 1 &&
      ui.form.alwaysFolder.checked === false
    ) {
      const index = result.lastIndexOf('/')
      result = result.substr(index + 1, result.length)
    }

    // 添加后缀名
    result += '.' + data.ext

    return result
  }

  // 预览文件名
  public previewFileName() {
    let result = ''
    result = store.result.reduce((total, now) => {
      return (total +=
        now.url.replace(/.*\//, '') + ': ' + this.getFileName(now) + '<br>') // 在每个文件名前面加上它的原本的名字，方便用来做重命名
    }, result)
    return result
  }
}

const fileName = new FileName()
export { fileName }
