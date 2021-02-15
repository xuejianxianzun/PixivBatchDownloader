import { Result } from "./Store.d"

class Tools {
  // 不安全的字符，这里多数是控制字符，需要替换掉
  static unsafeStr = new RegExp(
    /[\u0001-\u001f\u007f-\u009f\u00ad\u0600-\u0605\u061c\u06dd\u070f\u08e2\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff]/g
  )

  // 一些需要替换成全角字符的符号，左边是正则表达式的字符
  static fullWidthDict: string[][] = [
    ['\\\\', '＼'],
    ['/', '／'],
    [':', '：'],
    ['\\?', '？'],
    ['"', '＂'],
    ['<', '＜'],
    ['>', '＞'],
    ['\\*', '＊'],
    ['\\|', '｜'],
    ['~', '～'],
  ]

  // 用正则过滤不安全的字符，（Chrome 和 Windows 不允许做文件名的字符）
  // 把一些特殊字符替换成全角字符
  static replaceUnsafeStr(str: string) {
    str = str.replace(this.unsafeStr, '')
    for (let index = 0; index < this.fullWidthDict.length; index++) {
      const rule = this.fullWidthDict[index]
      const reg = new RegExp(rule[0], 'g')
      str = str.replace(reg, rule[1])
    }
    return str
  }

  // 对象深拷贝
  static deepCopy<T>(data: T): T {
    if (data === null || typeof data !== 'object') {
      return data
    }

    const result = (Array.isArray(data) ? [] : {}) as any

    for (const [key, value] of Object.entries(data)) {
      result[key] =
        data === null || typeof data !== 'object' ? value : this.deepCopy(value)
    }

    return result
  }

  // 字符串分割成数组
  static string2array(str: string): string[] {
    str = str.replace(/\n/g, '') // textarea 的值可能会存在换行符
    const temp = str.trim().split(',')
    const result = []
    for (const str of temp) {
      if (str !== '') {
        result.push(str.trim())
      }
    }
    return result
  }

  // 根据对象某个属性的值（视为数字）排序对象。返回的结果是降序排列
  static sortByProperty(key: string, order: 'desc' | 'asc' = 'desc') {
    return function (a: any, b: any) {
      // 排序的内容有时可能是字符串，需要转换成数字排序
      const value1 = typeof a[key] === 'number' ? a[key] : parseFloat(a[key])
      const value2 = typeof b[key] === 'number' ? b[key] : parseFloat(b[key])

      if (value2 < value1) {
        return order === 'desc' ? -1 : 1
      } else if (value2 > value1) {
        return order === 'desc' ? 1 : -1
      } else {
        return 0
      }
    }
  }

  // 把结果中的动图排列到最前面
  static sortUgoiraFirst(a: Result, b: Result) {
    if (a.type === 2 && b.type !== 2) {
      return -1
    } else if (a.type === 2 && b.type === 2) {
      return 0
    } else {
      return 1
    }
  }

  static isR18OrR18G(tags: string | string[]) {
    const str: string = Array.isArray(tags) ? tags.toString() : tags

    return (
      str.includes('R-18') ||
      str.includes('R-18G') ||
      str.includes('R18') ||
      str.includes('R18G')
    )
  }

  // 创建 input 元素选择 json 文件
  static async loadJSONFile<T>(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const i = document.createElement('input')
      i.setAttribute('type', 'file')
      i.setAttribute('accept', 'application/json')
      i.onchange = () => {
        if (i.files && i.files.length > 0) {
          // 读取文件内容
          const file = new FileReader()
          file.readAsText(i.files[0])
          file.onload = () => {
            const str = file.result as string
            let result: T
            try {
              result = JSON.parse(str)
              // if((result as any).constructor !== Object){
              // 允许是对象 {} 或者数组 []
              if (result === null || typeof result !== 'object') {
                const msg = 'Data is not an object!'
                return reject(new Error(msg))
              }
              return resolve(result)
            } catch (error) {
              const msg = 'JSON parse error!'
              return reject(new Error(msg))
            }
          }
        }
      }

      i.click()
    })
  }

  // 创建 input 元素选择文件
  static async selectFile(accept?: string) {
    return new Promise<FileList>((resolve, reject) => {
      const i = document.createElement('input')
      i.setAttribute('type', 'file')
      if (accept) {
        i.setAttribute('accept', accept)
      }
      i.onchange = () => {
        if (i.files && i.files.length > 0) {
          return resolve(i.files)
        } else {
          return reject()
        }
      }

      i.click()
    })
  }

  // 通过创建 a 标签来下载文件
  static downloadFile(url: string, fileName: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  }

  // 判断当前页面是否属于 pixiv.net
  static isPixiv() {
    return window.location.host.endsWith('.pixiv.net')
  }

  // 从 url 中获取指定的查询字段的值
  // 注意：返回值经过 encodeURIComponent 编码！
  static getURLSearchField(url: string, query: string) {
    const result = new URL(url).searchParams.get(query)
    if (result !== null) {
      return encodeURIComponent(result)
    } else {
      return ''
    }
  }

  // 从 url 中获取 tag
  static getTagFromURL(url: string = location.href) {
    const nowURL = new URL(url)

    // 2 用户作品列表页
    if (/\/users\/\d+/.test(url) && !url.includes('/bookmarks')) {
      // 匹配 pathname 里用户 id 之后的字符
      const test = nowURL.pathname.match(/\/users\/\d+(\/.+)/)
      if (test && test.length === 2) {
        const str = test[1]
        // 如果用户 id 之后的字符多于一个路径，则把最后一个路径作为 tag，示例
        // https://www.pixiv.net/users/2188232/illustrations/ghostblade
        const array = str.split('/')
        // ["", "illustrations", "ghostblade"]
        if (array.length > 2) {
          return decodeURIComponent(array[array.length - 1])
        }
      }
    }

    // 4 旧版收藏页面
    if (nowURL.pathname === '/bookmark.php') {
      if (parseInt(this.getURLSearchField(nowURL.href, 'untagged')) === 1) {
        // 旧版 “未分类” tag 是个特殊标记
        // https://www.pixiv.net/bookmark.php?untagged=1
        return '未分類'
      }
    }

    // 4 新版收藏页面
    if (nowURL.pathname.includes('/bookmarks/')) {
      // 新版收藏页 url，tag 在路径末端，如
      // https://www.pixiv.net/users/9460149/bookmarks/artworks/R-18
      // https://www.pixiv.net/users/9460149/bookmarks/novels/R-18
      const test = /\/bookmarks\/\w*\/(.[^\/|^\?|^&]*)/.exec(nowURL.pathname)
      if (test !== null && test.length > 1 && !!test[1]) {
        return decodeURIComponent(test[1])
      }
    }

    // 5 搜索页面
    if (nowURL.pathname.includes('/tags/')) {
      return decodeURIComponent(nowURL.pathname.split('tags/')[1].split('/')[0])
    }

    // 默认情况，从查询字符串里获取，如下网址
    // https://www.pixiv.net/bookmark.php?tag=R-18
    return decodeURIComponent(this.getURLSearchField(nowURL.href, 'tag'))
  }

  // 从 url 里获取 artworks id
  // 可以传入 url，无参数则使用当前页面的 url
  static getIllustId(url?: string) {
    const str = url || window.location.search || location.href
    if (str.includes('illust_id')) {
      // 传统 url
      return /illust_id=(\d*\d)/.exec(str)![1]
    } else if (str.includes('/artworks/')) {
      // 新版 url
      return /artworks\/(\d*\d)/.exec(str)![1]
    } else {
      // 直接取出 url 中的数字，不保证准确
      const test = /\d*\d/.exec(location.href)
      if (test && test.length > 0) {
        return test[0]
      } else {
        return ''
      }
    }
  }

  // 从 url 里获取 novel id
  // https://www.pixiv.net/novel/show.php?id=12771688
  static getNovelId(url?: string) {
    const str = url || window.location.search || location.href
    const test = str.match(/\?id=(\d*)?/)
    return test![1]
  }
}

export { Tools }
