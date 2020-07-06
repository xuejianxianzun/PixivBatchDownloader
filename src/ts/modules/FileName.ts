// 生成文件名
import { WorkInfo } from './Store.d'
import { EVT } from './EVT'
import { form } from './Settings'
import { store } from './Store'
import { lang } from './Lang'
import { API } from './API'
import config from './Config'

class FileName {
  constructor() {
    window.addEventListener(EVT.events.previewFileName, () => {
      this.previewFileName()
    })
  }

  // 生成文件名
  public getFileName(data: WorkInfo) {
    // 为空时使用 {id}
    let result = form.userSetName.value || '{id}'

    const illustTypes = ['illustration', 'manga', 'ugoira', 'novel'] // 作品类型 0 插画 1 漫画 2 动图 3 小说

    // 配置所有命名标记
    const cfg = {
      '{p_title}': {
        value: store.pageInfo.pageTitle,
        prefix: '',
        safe: false,
      },
      '{p_tag}': {
        value: store.pageInfo.pageTag,
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
        value: data.tagsTranslated.join(','),
        prefix: 'tags_',
        safe: false,
      },
      '{bmk}': {
        value: data.bmk,
        prefix: 'bmk_',
        safe: true,
      },
      '{date}': {
        value: data.date,
        prefix: '',
        safe: true,
      },
      '{type}': {
        value: illustTypes[data.type],
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
    result = API.replaceUnsafeStr(result)
    // 上一步会把斜线 / 替换成全角的斜线 ／，这里再替换回来，否则就不能建立文件夹了
    result = result.replace(/／/g, '/')

    // 判断这个作品是否要去掉序号
    const noSerialNo = cfg['{p_num}'].value === 0 && form.noSerialNo.checked

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
          once = API.replaceUnsafeStr(once)
        }

        // 添加标记名称
        if (form.tagNameToFileName.checked) {
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
      // 操作路径中最后一项（即文件名），在它前面添加一层文件夹
      const allPart = result.split('/')
      const lastPartIndex = allPart.length - 1
      let lastPart = allPart[lastPartIndex]
      let addString = ''

      if (form.multipleImageFolderName.value === '1') {
        // 使用作品 id 作为文件夹名
        addString = data.idNum.toString()
      } else if (form.multipleImageFolderName.value === '2') {
        // 遵从命名规则，使用文件名做文件夹名
        // 这里进行了一个替换，因为多图每个图片的名字都不同，这主要是因为 id 后面的序号不同。这会导致文件夹名也不同，有多少个文件就会建立多少个文件夹，而不是统一建立一个文件夹。为了只建立一个文件夹，需要把 id 后面的序号部分去掉。
        // 但是如果一些特殊的命名规则并没有包含 {id} 部分，文件名的区别得不到处理，依然会每个文件建立一个文件夹。
        addString = lastPart.replace(data.id, data.idNum.toString())
      }

      lastPart = addString + '/' + lastPart
      allPart[lastPartIndex] = lastPart
      result = allPart.join('/')
    }

    // 添加后缀名
    if ((data.ext === 'webm' || data.ext === 'gif') && data.ugoiraInfo) {
      // 如果是动图，那么此时根据用户设置的动图保存格式，更新其后缀名
      // 例如，抓取时动图保存格式是 webm，下载开始前，用户改成了 gif，在这里可以响应用户的修改
      data.ext = form.ugoiraSaveAs.value
    }
    result += '.' + data.ext
    return result
  }

  // 预览文件名
  private previewFileName() {
    if (store.result.length === 0) {
      return alert(lang.transl('_没有数据可供使用'))
    }

    // 使用数组储存和拼接字符串，提高性能
    const resultArr: string[] = []

    const length = store.result.length
    for (let i = 0; i < length; i++) {
      const data = store.result[i]
      // 为默认文件名添加颜色。默认文件名有两种处理方式，一种是取出用其他下载软件下载后的默认文件名，一种是取出本程序使用的默认文件名 data.id。这里使用前者，方便用户用其他下载软件下载后，再用生成的文件名重命名。
      const defaultName = data.url.replace(/.*\//, '')
      const fullName = this.getFileName(data)
      let nowResult = `${defaultName}: ${fullName}<br>`

      if (length < config.outputMax) {
        // 为生成的文件名添加颜色。只有当文件数量少于一定数值时才添加颜色。这是因为添加颜色会导致生成的 HTML 元素数量增多，复制时资源占用增加。有些用户电脑配置差，如果生成的结果很多，还添加了颜色，可能复制时会导致这个页面卡死。
        const defaultNameHtml = `<span class="color999">${defaultName}</span>`
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
        nowResult = `<p class="result">${defaultNameHtml}: ${fullNameHtml}</p>`
      }

      // 保存本条结果
      resultArr.push(nowResult)
    }

    // 拼接所有结果
    const result = resultArr.join('')
    EVT.fire(EVT.events.output, {
      content: result,
      title: lang.transl('_预览文件名'),
    })
  }
}

const fileName = new FileName()
export { fileName }
