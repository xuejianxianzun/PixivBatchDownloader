import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { lang } from '../Lang'
import { Config } from '../Config'
import { store } from '../store/Store'
import { Result } from '../store/StoreType'
import { fileName } from '../FileName'
import { createCSV } from '../utils/CreateCSV'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'

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
    window.addEventListener(EVT.list.exportCSV, () => {
      this.beforeCreate()
    })
  }

  private readonly xRestrictMap = new Map([
    [0, 'AllAges'],
    [1, 'R-18'],
    [2, 'R-18G'],
  ])

  private readonly AIType = ['Unknown', 'No', 'Yes']

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
      name: 'description',
      index: 'description',
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
      name: 'xRestrict',
      index: 'xRestrict',
    },
    {
      name: 'AI',
      index: 'aiType',
    },
    {
      name: 'date',
      index: 'date',
    },
    {
      name: 'original',
      index: 'original',
    },
    {
      name: 'thumb',
      index: 'thumb',
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
      toast.error(lang.transl('_没有数据可供使用'))
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
      // 每个作品只导出一条记录
      // 如果是多图作品里第一张图之后的图片数据，则跳过
      const index = d.index ?? Tools.getResultIndex(d)
      if (index > 0) {
        continue
      }

      const bodyItem: any[] = [] // 储存这个作品生成的所有字段
      // 生成每个字段的结果
      for (const field of this.fieldCfg) {
        if (field.name === 'fileName') {
          bodyItem.push(fileName.createFileName(d))
        } else {
          let result = d[field.index] ?? ''

          // 对于某些字段，将其内容特殊化处理
          if (field.name === 'type') {
            result = Config.worksTypeName[result as number]
          }

          if (field.name === 'bookmarked') {
            result = (result as boolean) ? 'Yes' : 'No'
          }

          if (field.name === 'xRestrict') {
            result = this.xRestrictMap.get(result as number) || ''
          }

          if (field.name === 'AI') {
            result = this.AIType[d.aiType || 0]
          }

          bodyItem.push(result)
        }
      }
      // 把这个作品的数据添加到内容数组里
      body.push(bodyItem)
    }

    const csv = createCSV.create(body)
    const csvURL = URL.createObjectURL(csv)

    // 设置文件名
    let csvName = `result-${Utils.replaceUnsafeStr(
      Tools.getPageTitle()
    )}-${store.crawlCompleteTime.getTime()}.csv`

    Utils.downloadFile(csvURL, csvName)

    toast.success(lang.transl('_导出成功'))
  }
}

new ExportResult2CSV()
