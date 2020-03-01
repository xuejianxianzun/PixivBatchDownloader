// 生成文件名
import { WorkInfo } from './Store.d'
import { EVT } from './EVT'
import { form } from './Settings'
import { store } from './Store'
import { lang } from './Lang'

class FileName {
  constructor() {
    window.addEventListener(EVT.events.previewFileName, () => {
      this.previewFileName()
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
    let result = form.userSetName.value
    // 为空时使用 {id}
    result = result || '{id}'
    const illustTypes = ['illustration', 'manga', 'ugoira'] // 作品类型 0 插画 1 漫画 2 动图

    // 储存每个文件名标记的配置
    const cfg = [
      {
        name: '{p_title}',
        value: store.pageInfo.pageTitle,
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
        value: data.idNum,
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
        if (form.tagNameToFileName.checked) {
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

    // 如果快速下载时只有一个文件，根据“始终建立文件夹”选项，决定是否去掉文件夹部分
    if (
      store.states.quickDownload &&
      store.result.length === 1 &&
      form.alwaysFolder.checked === false
    ) {
      const index = result.lastIndexOf('/')
      result = result.substr(index + 1, result.length)
    }

    // 处理为多图作品自动建立文件夹的情况
    // 多图作品如果只下载前 1 张，不会为它自动建立文件夹。大于 1 张才会自动建立文件夹
    if (form.multipleImageDir.checked && data.dlCount > 1) {
      // 操作路径中最后一项（即文件名），在它前面添加一层文件夹，文件夹名为 id
      const allPart = result.split('/')
      const lastPartIndex = allPart.length - 1
      let lastPart = allPart[lastPartIndex]
      lastPart = data.idNum + '/' + lastPart
      allPart[lastPartIndex] = lastPart
      result = allPart.join('/')
    }

    // 添加后缀名
    result += '.' + data.ext

    return result
  }

  // 预览文件名
  previewFileName() {
    if (store.result.length === 0) {
      return alert(lang.transl('_没有数据可供使用'))
    }

    // 使用数组储存和拼接字符串，提高性能
    const resultArr: string[] = []

    const length = store.result.length
    for (let i = 0; i < length; i++) {
      const data = store.result[i]
      // 为默认文件名添加颜色。这里有两种处理方式，一种是取出用其他下载软件下载后的默认文件名，一种是取出本程序使用的默认文件名 data.id。这里使用前者，方便用户用其他下载软件下载后，再用生成的文件名重命名。
      const defaultName = data.url.replace(/.*\//, '')
      const defaultNameHtml = `<span class="color999">${defaultName}</span>`
      // 为生成的文件名添加颜色
      const fullName = this.getFileName(data)
      const part = fullName.split('/')
      const length = part.length
      for (let i = 0; i < length; i++) {
        const str = part[i]
        if (i < length - 1) {
          // 如果不是最后一项，说明是文件夹名，添加颜色
          part[i] = `<span class="color666">${str}</span>`
        } else {
          // 最后一项，是文件名，添加颜色
          part[i] = `<span class="color000">${str}</span>`
        }
      }
      const fullNameHtml = part.join('/')

      // 保存本条结果
      const nowResult = `<p class="result">${defaultNameHtml}: ${fullNameHtml}</p>`
      resultArr.push(nowResult)
    }

    // 拼接所有结果
    const result = resultArr.join('')
    EVT.fire(EVT.events.output, result)
  }
}

const fileName = new FileName()
export { fileName }
