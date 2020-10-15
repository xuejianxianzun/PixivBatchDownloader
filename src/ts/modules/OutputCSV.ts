import { EVT } from './EVT'
import { DOM } from './DOM'
import { API } from './API'
import { lang } from './Lang'
import config from './Config'
import { store } from './Store'
import { Result } from './Store.d'
import { fileName } from './FileName'

// 定义字段信息
interface Field {
  name: string
  index: keyof Result
  toString: (arg: any) => string
  q: boolean
}
// name 这个字段在 csv 里显示的名字。
// index 这个字段在数据里的索引名
// toString 输入这个字段的原始数据，将其转换为字符串。
// q 指 quotation ，指示 toString 的结果是否需要使用双引号包裹
// 需要双引号包裹的情况：值含有逗号、换行符、空格、双引号

// 导出 csv 文件
// 参考 https://www.jianshu.com/p/54b3afc06126
class OutputCSV {
  constructor() {
    this.utf8BOM = this.UTF8BOM()
    window.addEventListener(EVT.list.outputCSV, () => {
      this.beforeCreate()
    })
  }

  private readonly separate = ',' // 分隔符
  private readonly CRLF = '\r\n' // 换行符
  private utf8BOM: ArrayBuffer // 在文件头添加 UTF-8 BOM ，避免中文乱码。因为没有 BOM 的话 Excel 会以 ANSI 编码打开文件，导致中文乱码

  private readonly number2String = (arg: number) => {
    return arg.toString()
  }

  private readonly array2String = (arg: string[]) => {
    return arg.join(',')
  }

  private readonly string2String = (arg: string) => {
    return arg
  }

  private readonly getFileName = (arg: any) => {
    return fileName.getFileName(arg)
  }

  // 定义要保存的字段
  private readonly fieldCfg: Field[] = [
    {
      name: 'id',
      index: 'idNum',
      q: false,
      toString: this.number2String,
    },
    {
      name: 'tags',
      index: 'tags',
      q: true,
      toString: this.array2String,
    },
    {
      name: 'tags_transl',
      index: 'tagsTranslOnly',
      q: true,
      toString: this.array2String,
    },
    {
      name: 'user',
      index: 'user',
      q: true,
      toString: this.string2String,
    },
    {
      name: 'userid',
      index: 'userId',
      q: false,
      toString: this.string2String,
    },
    {
      name: 'title',
      index: 'title',
      q: true,
      toString: this.string2String,
    },
    {
      name: 'type',
      index: 'type',
      q: false,
      toString: (arg: number) => {
        return config.illustTypes[arg]
      },
    },
    {
      name: 'page',
      index: 'pageCount',
      q: false,
      toString: this.number2String,
    },
    {
      name: 'bookmark',
      index: 'bmk',
      q: false,
      toString: this.number2String,
    },
    {
      name: 'bookmarked',
      index: 'bookmarked',
      q: false,
      toString: (arg: boolean) => {
        return arg ? 'yes' : 'no'
      },
    },
    {
      name: 'width',
      index: 'fullWidth',
      q: false,
      toString: this.number2String,
    },
    {
      name: 'height',
      index: 'fullHeight',
      q: false,
      toString: this.number2String,
    },
    {
      name: 'date',
      index: 'date',
      q: false,
      toString: this.string2String,
    },
    {
      name: 'original',
      index: 'original',
      q: false,
      toString: this.string2String,
    },
    {
      name: 'fileName',
      index: 'title',
      q: true,
      toString: this.getFileName,
    },
  ]
  // fileName 字段的 index 属性可以随便写，因为没有影响。

  private beforeCreate() {
    // 如果没有数据则不执行
    if (store.result.length === 0) {
      alert(lang.transl('_没有数据可供使用'))
      return
    }

    // 使用 result 而不使用 resultMeta。主要是因为断点续传时只会恢复 result，不会恢复 resultMeta，所以 result 最可靠。考虑如下情况：
    // 1：刷新页面后，断点续传恢复了保存的数据，此时只有 result 里有数据，resultMeta 没有数据。
    // 2: 如果在页面 A 进行了下载，resultMeta 保存的是页面 A 的数据。此时进入页面 B，恢复了 B 页面保存的任务，此时 resultMeta 里还是页面 A 的数据。
    // 所以还是使用 result 比较可靠，不易出问题。
    this.create(store.result)
  }

  private create(data: Result[]) {
    const result: string[] = [] // 储存结果。每行的结果合并为一个字符串。不带换行符
    // 首先添加字段一栏
    const head: string[] = []
    for (const field of this.fieldCfg) {
      head.push(field.name)
    }
    const headResult = head.join(this.separate)
    result.push(headResult)

    // 循环每个作品的数据，生成结果
    for (const d of data) {
      // 如果是多图作品，并且不是第一张图，则跳过
      // 这是因为多图作品可能有多个数据。在生成 csv 时只使用第一张图的数据
      // 多图作品 && id 不以 p0 结尾（说明不是第一张图）
      if (d.pageCount > 1 && !d.id.endsWith('p0')) {
        continue
      }

      const temp: string[] = [] // 储存这个作品的数据
      // 生成每个字段的结果
      for (const field of this.fieldCfg) {
        // 设置生成结果所使用的数据。fileName 需要使用整个作品数据。其他字段则取出对应的属性
        let originalData = field.name === 'fileName' ? d : d[field.index]
        if (originalData === undefined) {
          // 如果某个字段使用的属性在旧版本的数据里不存在性，就会是 undefined
          // 例如 original 属性在 7.6.0 版本以前不存在，现在使用了这个字段。如果下载器有保存旧版本的断点续传数据，那么获取 original 就是 undefined，需要进行处理。
          originalData = ''
        }
        // 求值并替换双引号。值原本就有的双引号，要替换成两个双引号
        let value = field.toString(originalData).replace(/\"/g, '""')
        // 根据 q 标记决定是否用双引号包裹这个值
        if (field.q) {
          value = this.addQuotation(value)
        }
        temp.push(value)
      }
      // 把这个作品的数据添加到结果里
      result.push(temp.join(this.separate))
    }

    // 生成文件的 url
    const csvData = result.join(this.CRLF)
    const csvBlob = new Blob([this.utf8BOM, csvData])
    const url = URL.createObjectURL(csvBlob)

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

    // 下载文件
    DOM.downloadFile(url, API.replaceUnsafeStr(name) + '.csv')
  }

  private UTF8BOM() {
    const buff = new ArrayBuffer(3)
    const data = new DataView(buff)
    data.setInt8(0, 0xef)
    data.setInt8(1, 0xbb)
    data.setInt8(2, 0xbf)
    return buff
  }

  // 在字符串的两端添加双引号
  private addQuotation(data: string) {
    return '"' + data + '"'
  }
}

new OutputCSV()
export {}
