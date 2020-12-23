import { EVT } from './EVT'
import { DOM } from './DOM'
import { lang } from './Lang'
import config from './Config'
import { store } from './Store'
import { Result } from './Store.d'
import { fileName } from './FileName'
import { createCSV } from './CreateCSV'

// 定义字段信息
interface Field {
  name: string
  index: keyof Result
}
// name 这个字段在 csv 里的标题
// index 这个字段在数据里的索引名

// 导出抓取结果为 csv 文件
class ExportResult2CSV {
  constructor() {
    window.addEventListener(EVT.list.outputCSV, () => {
      this.beforeCreate()
    })
  }

  // 定义要保存的字段
  private readonly fieldCfg: Field[] = [
    {
      name: 'id',
      index: 'idNum',
    },
    {
      name: 'tags',
      index: 'tags',
    },
    {
      name: 'tags_transl',
      index: 'tagsTranslOnly',
    },
    {
      name: 'user',
      index: 'user',
    },
    {
      name: 'userId',
      index: 'userId',
    },
    {
      name: 'title',
      index: 'title',
    },
    {
      name: 'type',
      index: 'type',
    },
    {
      name: 'page',
      index: 'pageCount',
    },
    {
      name: 'bookmark',
      index: 'bmk',
    },
    {
      name: 'bookmarked',
      index: 'bookmarked',
    },
    {
      name: 'likeCount',
      index: 'likeCount',
    },
    {
      name: 'viewCount',
      index: 'viewCount',
    },
    {
      name: 'commentCount',
      index: 'commentCount',
    },
    {
      name: 'width',
      index: 'fullWidth',
    },
    {
      name: 'height',
      index: 'fullHeight',
    },
    {
      name: 'date',
      index: 'date',
    },
    {
      name: 'original',
      index: 'original',
    },
    // fileName 字段的 index 属性可以随便写，因为没有影响。
    {
      name: 'fileName',
      index: 'title',
    },
  ]

  private beforeCreate() {
    // 如果没有数据则不执行
    if (store.result.length === 0) {
      EVT.sendMsg({
        msg: lang.transl('_没有数据可供使用'),
        type: 'error',
      })
      return
    }

    // 使用 result 而不使用 resultMeta。主要是因为断点续传时只会恢复 result，不会恢复 resultMeta，所以 result 最可靠。考虑如下情况：
    // 1：刷新页面后，断点续传恢复了保存的数据，此时只有 result 里有数据，resultMeta 没有数据。
    // 2: 如果在页面 A 进行了下载，resultMeta 保存的是页面 A 的数据。此时进入页面 B，恢复了 B 页面保存的任务，此时 resultMeta 里还是页面 A 的数据。
    // 所以还是使用 result 比较可靠，不易出问题。
    this.create(store.result)
  }

  private create(data: Result[]) {
    const body: any[][] = [] // 内容数组

    // 标题数组
    const head: string[] = []
    for (const field of this.fieldCfg) {
      head.push(field.name)
    }
    body.push(head)

    // 循环每个作品的数据
    for (const d of data) {
      // 如果是多图作品，并且不是第一张图，则跳过
      // 这是因为多图作品可能有多个数据。在生成 csv 时只使用第一张图的数据
      // 多图作品 && id 不以 p0 结尾（说明不是第一张图）
      if (d.pageCount > 1 && !d.id.endsWith('p0')) {
        continue
      }

      const bodyItem: any[] = [] // 储存这个作品生成的所有字段
      // 生成每个字段的结果
      for (const field of this.fieldCfg) {
        if (field.name === 'fileName') {
          bodyItem.push(fileName.getFileName(d))
        } else {
          let result = d[field.index]

          if (result === undefined) {
            result = ''
          }

          // 对于某些字段，将其内容特殊化处理
          if (field.name === 'type') {
            result = config.illustTypes[result as number]
          }

          if (field.name === 'bookmarked') {
            result = (result as boolean) ? 'yes' : 'no'
          }

          bodyItem.push(result)
        }
      }
      // 把这个作品的数据添加到内容数组里
      body.push(bodyItem)
    }

    // 设置文件名
    let name = ''
    const ogTitle = document.querySelector(
      'meta[property="og:title"]',
    )! as HTMLMetaElement
    if (ogTitle) {
      name = ogTitle.content
    } else {
      name = DOM.getTitle()
    }

    createCSV.create({
      body: body,
      download: true,
      fileName: name,
    })
  }
}

new ExportResult2CSV()
export {}
