// 生成 csv 文件
// csv 文件结构参考 https://www.jianshu.com/p/54b3afc06126

type CSVData = any[][]

const example: CSVData = [
  ['titleA', 'titleB', 'titleC'],
  ['a1', 'b1', 'c1'],
  [[1, 2, 3], false, 456],
  [undefined, 'b,b,b', 'c c c'],
]

// 每一项数据可以是任何类型（any）。如果它不是 String，它会被自动转换为 String。
// 自动转换的结果可能不符合你的预期。如果你要完全控制输出的内容，你应该自己把内容全部转换成字符串，再传递到这个类里。
// 这个类会自动处理需要添加双引号的情况，所以你不用自己添加双引号。
// 如果某个数据是 Array，它不应该包含：1. 嵌套的数组；2. Symbol 类型的数据。

class CreateCSV {
  constructor() {
    this.utf8BOM = this.UTF8BOM()
  }

  private readonly separate = ',' // 分隔符
  private readonly CRLF = '\r\n' // 换行符
  private utf8BOM: ArrayBuffer // 在文件头添加 UTF-8 BOM ，避免中文乱码。因为没有 BOM 的话 Excel 会以 ANSI 编码打开文件，导致中文乱码
  private reg = / |\"|,|\n/ // 判断字符串是否需要添加双引号
  // 需要双引号包裹的情况：含有逗号、换行符、空格、双引号。
  // 全角符号不需要添加双引号。

  // 格式化每一行的数据
  private format(arr: any[]) {
    const rowData: string[] = []
    // 格式化这一行里每一列的数据
    for (let i = 0; i < arr.length; i++) {
      let colData: string = ''

      const origin = arr[i]
      const type = typeof origin

      // 把每一列的数据转换成字符串
      switch (type) {
        case 'string':
          colData = origin
          break
        case 'bigint':
        case 'number':
        case 'boolean':
        case 'function':
          colData = origin.toString()
          break
        case 'undefined':
          colData = ''
          break
        case 'symbol':
          colData = origin.description || ''
          break
        case 'object':
          if (origin === null) {
            colData = ''
          } else if (Array.isArray(origin)) {
            colData = (origin as any[]).join(this.separate)
          }
          break
        default:
          throw new Error('Unkown data type')
      }

      // 值原本就有的双引号，要替换成两个双引号
      colData = colData.replace(/\"/g, '""')
      // 用双引号包裹这个值
      if (this.reg.test(colData)) {
        colData = this.addQuotation(colData)
      }

      rowData.push(colData)
    }
    return rowData
  }

  public create(data: CSVData) {
    // 储存结果。每行的结果合并为一个字符串
    const result: string[] = []

    // 在顶部添加 utf8BOM
    result.push(this.utf8BOM as unknown as string)

    // 添加每一行的数据和换行符
    for (const row of data) {
      result.push(this.format(row).join(this.separate))
      result.push(this.CRLF)
    }

    const csvBlob = new Blob(result, {
      type: 'text/csv',
    })
    return csvBlob
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
  public addQuotation(str: string) {
    return '"' + str + '"'
  }
}

const createCSV = new CreateCSV()
// createCSV.create(example)
export { createCSV }
