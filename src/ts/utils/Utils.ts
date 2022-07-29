class Utils {
  // 不安全的字符，这里多数是控制字符，需要替换掉
  static unsafeStr = new RegExp(
    /[\u0001-\u001f\u007f-\u009f\u00ad\u0600-\u0605\u061c\u06dd\u070f\u08e2\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff]/g
  )

  // 一些需要替换成全角字符的符号，左边是正则表达式的字符
  static readonly fullWidthDict: string[][] = [
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

  // reg 预先创建，而不是运行时创建，因为运行时重复创建太多次了

  // 用正则去掉不安全的字符
  static replaceUnsafeStr(str: string) {
    str = str.replace(this.unsafeStr, '')
    // 把一些特殊字符替换成全角字符
    for (let index = 0; index < this.fullWidthDict.length; index++) {
      const rule = this.fullWidthDict[index]
      const reg = new RegExp(rule[0], 'g')
      str = str.replace(reg, rule[1])
    }
    return str
  }

  /** Windows 保留文件名，不可单独作为文件名，不区分大小写 */
  // 为了效率，这里把大写和小写都直接列出，避免在使用时进行转换
  static readonly windowsReservedNames = [
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'LPT1',
    'LPT2',
    'LPT3',
    'COM2',
    'COM3',
    'COM4',
    'con',
    'prn',
    'aux',
    'nul',
    'com1',
    'lpt1',
    'lpt2',
    'lpt3',
    'com2',
    'com3',
    'com4',
  ]

  /** 检查并处理 Windows 保留文件名。
   * 如果不传递可选参数，则将其替换为空字符串。
   * 如果传递了可选参数，则在其后添加传递的可选参数的值 */
  static handleWindowsReservedName(str: string, addStr?: string) {
    if (this.windowsReservedNames.includes(str)) {
      if (addStr) {
        return str + addStr
      } else {
        return ''
      }
    } else {
      return str
    }
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

  // 依据对象某个属性的值（视为数字）来排序对象数组。默认降序排列
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

  // 获取指定元素里，可见的结果
  static getVisibleEl(selector: string) {
    const list: NodeListOf<HTMLElement> = document.querySelectorAll(selector)
    return Array.from(list).filter((el) => {
      return el.style.display !== 'none'
    })
  }

  // 删除 DOM 元素，或者 DOM 元素列表
  static removeEl(el: NodeListOf<Element> | HTMLElement) {
    if (!el) {
      return
    }
    if (Reflect.has(el, 'length')) {
      // 如果有 length 属性则循环删除。
      ;(el as NodeListOf<Element>).forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      })
    } else {
      // 没有 length 属性的直接删除（querySelector 的返回值是 HTMLElement）
      const parent = (el as HTMLElement).parentNode
      if (parent) {
        parent.removeChild(el as HTMLElement)
      }
    }
  }

  // 切换 DOM 元素的可见性
  // 第二个参数设置显示时的 display，默认是 block，如果要设置为其他类型，则需要指定第二个参数
  static toggleEl(el: HTMLElement, showDisplay: string = 'block') {
    el.style.display = el.style.display === showDisplay ? 'none' : showDisplay
  }

  // 动态添加 css 样式
  static addStyle(css: string) {
    const e = document.createElement('style')
    e.innerHTML = css
    document.body.append(e)
  }

  // 加载一个图片，当 onload 事件发生之后返回 img 元素
  static async loadImg(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.src = url
      img.onload = function () {
        resolve(img)
      }
      img.onerror = () => {
        reject(new Error(`Load image error! url: ${url}`))
      }
    })
  }

  // 加载图片并在获取到其宽高之后立即返回宽高数值。不需要等待图片加载完毕
  // 请求出错时，返回值的宽高都是 0
  static async getImageSize(url: string): Promise<{
    width: number
    height: number
  }> {
    return new Promise((resolve) => {
      let timer = 0
      const img = new Image()

      // 在 Chrome 中图片请求的超时时间是 30 秒
      // 如果请求超时，则直接返回
      img.onerror = () => {
        window.clearInterval(timer)
        return resolve({
          width: 0,
          height: 0,
        })
      }

      img.src = url
      timer = window.setInterval(() => {
        if (img.naturalWidth > 0) {
          window.clearInterval(timer)
          const wh = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          }
          img.src = ''
          return resolve(wh)
        }
      }, 50)
    })
  }

  /**如果数据量多大，不应该使用这个方法 */
  static json2Blob(data: any) {
    const str = JSON.stringify(data, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    return blob
  }

  /**防抖 */
  static debounce(func: Function, wait: number) {
    // 默认的定时器 id 不能使用有意义的数字，否则 clearTimeout 可能会错误的清除其他定时器
    let timer: number | undefined = undefined
    const context = this
    return function () {
      const args = arguments
      window.clearTimeout(timer)
      timer = window.setTimeout(func.bind(context, ...args), wait)
    }
  }

  /**节流 */
  static throttle(func: Function, delay: number) {
    let time = 0
    const context = this
    return function () {
      const args = arguments
      const now = new Date().getTime()
      if (now - time >= delay) {
        time = now
        return func.apply(context, args)
      }
    }
  }

  /**用 URL 里的后缀名替换 originName 的后缀名
   *
   * 例如传入参数 123.txt, https://.../123.jpg
   *
   * 返回 123.jpg
   */
  static replaceSuffix(originName: string, url: string) {
    const nameArray = originName.split('.')
    const urlArray = url.split('.')
    nameArray[nameArray.length - 1] = urlArray[urlArray.length - 1]
    return nameArray.join('.')
  }

  /**获取后缀名 */
  static getSuffix(name: string) {
    const nameArray = name.split('.')
    return nameArray[nameArray.length - 1]
  }
}

export { Utils }
