import { setTimeoutWorker } from './SetTimeoutWorker'

class Utils {
  // 不安全的字符，它们在文件名里会引发问题，需要替换掉。内容包括：
  //
  // - 控制字符（Cc）：U+0000-U+001F、U+007F-U+009F。各种换行符都在这里：LF、VT、FF、CR、NEL（U+0085）
  // - **行分隔符 U+2028、段落分隔符 U+2029**。它们是 JavaScript 的行终止符，Firefox 也不允许把它们用作文件名。
  //   ⚠️ 这两个字符的 Unicode 类别是 Zl / Zp，不属于 Cf / Cc，所以很容易被漏掉
  // - 不可见的格式字符（Cf）：零宽字符（U+200B-U+200D）、双向控制符（U+202A-U+202E、U+2066-U+2069）、
  //   阿拉伯的各种标记（U+0600-U+0605、U+061C、U+06DD、U+0890-U+0891、U+08E2）等
  // - 特殊空格：NBSP（U+00A0）、U+1680、U+2000-U+200A、U+202F、U+205F。它们看起来像空格，但是别的字符
  // - Unicode 非字符（U+FDD0-U+FDEF、U+FFFE、U+FFFF）、BOM（U+FEFF）、行间注释符（U+FFF9-U+FFFB）
  //
  // 因此它符合这样一个规则：**BMP 内所有 Cc、Cf、Zl、Zp 类别都已经覆盖**，
  // Zs（空格类）只保留了 U+0020（普通空格）和 U+3000（全角空格）——这两个不能删，
  // 尤其是 U+3000，它是日文标题里正常使用的字符（例如作者名里的分隔符），删掉会改变文件名的含义。
  // 非 BMP 里还有很少见的一些 Cf 字符没有覆盖（例如 U+E0020-U+E007F 的标签字符），
  // 它们需要给正则加上 u 标志并用 \u{} 写法才能表示，暂时没有处理
  //
  // 如果以后发现别的特殊字符也会导致文件名出错，也应该加到这里
  //
  // ⚠️ 这个正则带 g 标志（replace 需要它才能替换掉全部匹配）。因此**不要用 .test() / .exec() 来判断字符**：
  // 它们会残留 lastIndex，导致下次判断从上次的位置继续、跳着匹配。要判断就用 replace，
  // 或者自己先把 lastIndex 重置为 0
  static unsafeStr = new RegExp(
    /[\u0000\u0001-\u001f\u007f-\u009f\u00A0\u00ad\u0600-\u0605\u061c\u06dd\u070f\u0890-\u0891\u08e2\u1680\u180e\u2000-\u200f\u2028-\u202f\u205f\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff]/g
  )

  // 一些半角字符与全角字符的对照表
  static readonly fullWidthDict = new Map<string, string>([
    ['\\', '＼'],
    ['/', '／'],
    [':', '：'],
    ['?', '？'],
    ['"', '＂'],
    ['<', '＜'],
    ['>', '＞'],
    ['*', '＊'],
    ['|', '｜'],
    ['~', '～'],
  ])

  /**
   * 移除控制字符，并把一些半角字符替换成全角版本。
   * @param keepPathSeparator 是否保留路径分隔符 /。默认是 false，会把 / 替换成全角版本 ／。如果为 true，则会保留 /，适用于文件夹路径的命名。
   */
  static replaceUnsafeStr(str: string, keepPathSeparator = false) {
    str = str.replace(this.unsafeStr, '')
    for (const [halfWidth, fullWidth] of this.fullWidthDict) {
      if (keepPathSeparator && halfWidth === '/') {
        continue
      }
      str = str.replaceAll(halfWidth, fullWidth)
    }
    return str
  }

  /** 把全角字符替换成半角版本 */
  static replaceFullWidthStr(str: string) {
    for (const [halfWidth, fullWidth] of this.fullWidthDict) {
      str = str.replaceAll(fullWidth, halfWidth)
    }
    return str
  }

  /** Windows 保留文件名，不可单独作为文件名，不区分大小写 */
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
  ]

  /** 检查并处理 Windows 保留文件名。
   * 如果不传递可选参数，则将其替换为空字符串。
   * 如果传递了可选参数，则在其后添加传递的可选参数的值 */
  static handleWindowsReservedName(str: string, addStr?: string) {
    for (const name of this.windowsReservedNames) {
      if (str.toUpperCase() === name) {
        return addStr ? str + addStr : ''
      }
      if (str.toUpperCase().startsWith(name + '.')) {
        return str.replace(/\./g, '．')
      }
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

  // 依据对象某个属性的值（视为数字）来排序对象数组。默认降序排列
  static sortByProperty(key: string, order: 'desc' | 'asc' = 'desc') {
    return function (a: any, b: any) {
      // 排序的内容有时可能是字符串，需要转换成数字排序
      // 有些空字符串或者特殊字符可能转换后是 NaN，将其替换为 0
      const value1 =
        (typeof a[key] === 'number' ? a[key] : parseFloat(a[key])) || 0
      const value2 =
        (typeof b[key] === 'number' ? b[key] : parseFloat(b[key])) || 0

      if (value2 < value1) {
        return order === 'desc' ? -1 : 1
      } else if (value2 > value1) {
        return order === 'desc' ? 1 : -1
      } else {
        return 0
      }
    }
  }

  /** 使用选择文件对话框，让用户选择 JSON 文件
   *
   * 如果内容是合法的 JSON，则返回解析后的对象。（如果用户选择了多个文件，只返回第一个文件的内容）
   *
   * 如果用户点击了取消按钮（没有选择任何文件），则返回 undefined。
   */
  static async loadJSONFile<T>(): Promise<T | undefined> {
    const list = await Utils.loadJSONFiles<T>(false)
    if (list === undefined) {
      return undefined
    }
    return list[0]
  }

  /** 使用选择文件对话框，让用户选择一个或多个 JSON 文件
   *
   * 导出数据较多时会被拆成多个 JSON 文件，所以导入时需要支持一次选择多个文件（multiple 默认为 true）。
   *
   * 返回每个文件解析后的内容（顺序与用户选择的顺序一致）；如果用户取消选择，则返回 undefined。
   */
  static async loadJSONFiles<T>(multiple = true): Promise<T[] | undefined> {
    const loaded = await Utils.loadJSONFilesWithFiles<T>(multiple)
    if (loaded === undefined) {
      return undefined
    }
    return loaded.data
  }

  /** 使用选择文件对话框，让用户选择一个或多个 JSON 文件
   *
   * 除了每个文件解析后的内容，还返回用户选择的文件列表（文件名、体积等信息），
   * 方便调用方在导入前给出提示（例如显示文件名、检查文件体积）
   *
   * 返回 { files, data }，data 的顺序与用户选择的顺序一致；如果用户取消选择，则返回 undefined。
   */
  static async loadJSONFilesWithFiles<T>(
    multiple = true
  ): Promise<{ files: File[]; data: T[] } | undefined> {
    const fileList = await Utils.selectFile('application/json', multiple)
    if (!fileList || fileList.length === 0) {
      return undefined
    }

    const files = Array.from(fileList)

    const data: T[] = []
    for (const file of files) {
      const str = await file.text()
      let result: T
      try {
        result = JSON.parse(str)
      } catch (error) {
        throw new Error('JSON parse error!')
      }
      // 允许是对象 {} 或者数组 []
      if (result === null || typeof result !== 'object') {
        throw new Error('Data is not an object!')
      }
      data.push(result)
    }
    return { files, data }
  }

  /** 使用选择文件对话框，让用户选择文件
   *
   * accept: 可选，指定可选择的文件类型
   *
   * multiple: 可选，是否允许选择多个文件
   *
   * 返回用户选择的文件列表；如果用户取消选择，则返回 undefined
   */
  static async selectFile(
    accept?: string,
    multiple = false
  ): Promise<FileList | undefined> {
    return new Promise<FileList | undefined>((resolve) => {
      const i = document.createElement('input')
      i.setAttribute('type', 'file')
      if (accept) {
        i.setAttribute('accept', accept)
      }
      if (multiple) {
        i.setAttribute('multiple', 'multiple')
      }

      const cleanup = () => {
        i.onchange = null
        i.removeEventListener('cancel', onCancel)
      }
      const onCancel = () => {
        cleanup()
        resolve(undefined)
      }

      i.addEventListener('cancel', onCancel, { once: true })
      i.onchange = () => {
        if (!i.files || i.files.length === 0) {
          return onCancel()
        }

        cleanup()
        return resolve(i.files)
      }

      i.click()
    })
  }

  /** 通过创建 a 标签来下载文件
   *
   * revokeDelay: 下载之后多久回收 blob URL（毫秒）。
   * 大文件（例如导出上百 MB 的下载记录）在手机上可能过一会儿才真正开始读取 blob，
   * 过早回收会导致下载失败，所以导出这类大文件时应该传入更大的值。
   */
  static downloadFile(url: string, fileName: string, revokeDelay = 200) {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()

    if (url.startsWith('blob')) {
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, revokeDelay)
    }
  }

  /** 申请持久化存储（best-effort → persistent）。
   *
   * 站点数据默认是「尽力而为」的存储，磁盘空间紧张时浏览器会按 LRU 把整个 origin 的数据清掉，
   * 下载记录所在的 IndexedDB 也在其中。申请成功后浏览器不会再自动清除这些数据。
   *
   * 浏览器可能拒绝（Chrome 按站点参与度等信号自动决定，不会弹窗询问），
   * 所以调用方必须把它当作「尽力而为」的处理，失败时不要影响正常功能。
   */
  static async requestPersistentStorage(): Promise<boolean> {
    try {
      if (!navigator.storage || !navigator.storage.persist) {
        return false
      }
      if (await navigator.storage.persisted()) {
        return true
      }
      return await navigator.storage.persist()
    } catch (error) {
      return false
    }
  }

  // 判断当前页面是否属于 pixiv.net
  static isPixiv() {
    return location.host.endsWith('.pixiv.net')
  }

  /** 设置面板的根元素。缓存它，用于忽略面板内部的 DOM 变化 */
  private static settingsPanelEl: HTMLElement | null = null

  /** 判断节点是否位于下载器设置面板内部。
   * 以 body 为观察范围的 MutationObserver 用它忽略面板内部的 DOM 变化
   * （面板里的变化很频繁，且面板里不会有作品缩略图） */
  static isInSettingsPanel(node: Node) {
    // 面板会随页面重建，所以检测 isConnected，必要时重新查询（惰性，平时只查一次）
    if (!this.settingsPanelEl || !this.settingsPanelEl.isConnected) {
      this.settingsPanelEl = document.querySelector('.centerWrap')
    }
    return !!this.settingsPanelEl && this.settingsPanelEl.contains(node)
  }

  /** 从 url 中获取指定的查询字段的值 */
  // 注意：返回值经过 encodeURIComponent 编码！
  static getURLSearchField(url: string, query: string) {
    const result = new URL(url).searchParams.get(query)
    if (result !== null) {
      return encodeURIComponent(result)
    } else {
      return ''
    }
  }

  /**获取 URL path 中，某个路径名称后面的字符串。适用于符合 RESTful API 风格的路径
   *
   * 注意：传入的是 path，而不是整个 URL
   */
  // 例如：
  // https://www.pixiv.net/users/27482064/following/%E9%83%A8%E5%88%86%E5%96%9C%E6%AC%A2
  // 查询 'users' 返回 '27482064'
  // 因为 location.pathname 传入的字符串是浏览器自动编码过的，所以返回的字符串也是编码过的
  static getURLPathField(path: string, query: string) {
    const array = path.split('/')
    const index = array.findIndex((str) => str === query)
    if (index === -1) {
      return ''
    }
    return array[index + 1] || ''
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
    const el = document.createElement('style')
    el.innerHTML = css
    document.body.append(el)
    return el
  }

  /** 使用 img 标签加载一个图片，当 onload 事件发生之后返回 img 元素 */
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

  /**JSON 转换成 Blob 对象，附带格式化。如果数据量可能比较大，则不应该使用这个方法 */
  static json2Blob(data: any) {
    const str = JSON.stringify(data, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    return blob
  }

  /** 把 JSON 转换成 Blob 对象。可以处理更大的数据量，并且导出的单个文件体积不会超过 fileByteLengthLimit
   *
   * 注意：这个方法会把所有数据汇总到一起，峰值内存约为数据量的 2~3 倍
   * （原数据 + JSON 字符串 + Blob 各一份）。数据量很大时（例如导出几十万条下载记录）
   * 应该改用 json2BlobChunks 流式生成，边读边生成文件。
   */
  static async json2BlobSafe(
    data: any[],
    fileByteLengthLimit = 524288000
  ): Promise<
    {
      url: string
      total: number
    }[]
  > {
    const result: {
      url: string
      total: number
    }[] = []

    // 整个数组作为一批处理：内部是普通的 for 循环，每条记录不会额外走一次异步迭代
    await Utils.json2BlobChunksBatched(
      [data],
      fileByteLengthLimit,
      (url, total) => {
        result.push({ url, total })
      }
    )

    return result
  }

  /** 流式生成 JSON 文件：每累积到 maxBytes 就生成一个文件，通过 onFile 回调交出去，然后清空已累积的数据
   *
   * 为什么需要它：如果先把所有数据汇总到一起再生成文件，峰值内存是数据量的 2~3 倍
   * （原数据一份、JSON 字符串一份、Blob 一份）。几百万条下载记录就能把标签页的内存吃到十几 GB，
   * 页面会卡住几十秒甚至被浏览器直接杀掉。流式处理之后，任意时刻只有「当前这一个文件」的数据在内存里。
   *
   * 注意：生产代码统一使用 json2BlobChunksBatched（按批提供数据），
   * 这个「一条一条」的版本留给只能逐条产出数据的场景，目前只在测试里使用。
   *
   * @param items 要导出的数据。可以是数组，也可以是惰性读取的生成器
   *               （例如从 IndexedDB 逐个存储库读取，每次只把一个库的数据放进内存）
   * @param maxBytes 单个文件的体积上限
   * @param onFile 生成一个文件时回调，参数是 blob URL 和这个文件里的记录数。
   *               回调可以返回 Promise，这时会等它完成（例如等文件下载完成）再继续
   * @returns 导出的记录总数
   */
  static async json2BlobChunks(
    items: Iterable<any> | AsyncIterable<any>,
    maxBytes: number,
    onFile: (url: string, total: number) => void | Promise<void>
  ): Promise<number> {
    // 把每一项单独作为一批。注意：这样每条记录都会走一次异步迭代，
    // 数据量很大时（几百万条）应该改用 json2BlobChunksBatched，分批提供数据
    async function* toBatches() {
      for await (const item of items) {
        yield [item]
      }
    }
    return Utils.json2BlobChunksBatched(toBatches(), maxBytes, onFile)
  }

  /** 和 json2BlobChunks 相同，但 batches 里每一项是一个数组（一批记录）
   *
   * 为什么要按批：一条一条地过异步生成器，等于给每条记录都增加几次微任务往返，
   * 几百万条记录累积起来会很明显（实测 100 万条慢 8%）。按批处理时，
   * 批内是普通的 for 循环，和以前同步写法的速度一样，同时保留了流式的内存优势。
   *
   * @param batches 一批一批的数据。可以是数组的数组，也可以是惰性读取的生成器
   * @param maxBytes 单个文件的体积上限
   * @param onFile 生成一个文件时回调，参数是 blob URL 和这个文件里的记录数
   * @returns 导出的记录总数
   */
  static async json2BlobChunksBatched(
    batches: Iterable<any[]> | AsyncIterable<any[]>,
    maxBytes: number,
    onFile: (url: string, total: number) => void | Promise<void>
  ): Promise<number> {
    /** 当前文件里的 JSON 片段（数组字面量） */
    let JSONStringArray: string[] = []
    /** 当前文件已累积的字节数 */
    let bytelength = 0
    /** 当前文件里的记录数 */
    let total = 0
    /** 已导出的记录总数 */
    let count = 0

    const textEncode = new TextEncoder()

    /** 生成当前文件并回调，然后清空累积的数据 */
    const flush = async () => {
      if (JSONStringArray.length === 0) {
        return
      }
      // 删除最后一个分隔符，否则会导致格式错误
      JSONStringArray.pop()
      // 添加数组的结束符号
      JSONStringArray.push(']')

      // 生成文件数据
      const blob = new Blob(JSONStringArray, { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const fileTotal = total
      JSONStringArray = []
      bytelength = 0
      total = 0

      await onFile(url, fileTotal)
    }

    for await (const batch of batches) {
      // 批内是普通的 for 循环：不走异步迭代，每条记录的开销和以前一样
      for (const item of batch) {
        // 添加数组的开始符号
        if (JSONStringArray.length === 0) {
          JSONStringArray.push('[')
          bytelength = bytelength + 1
        }

        const string = JSON.stringify(item)
        JSONStringArray.push(string)
        JSONStringArray.push(',')
        bytelength = bytelength + textEncode.encode(string).length + 1

        total++
        count++

        // 达到体积上限就立刻生成一个文件，不等所有数据处理完
        if (bytelength >= maxBytes) {
          await flush()
        }
      }
      // 一批处理完后，这批数据就可以被回收了（由提供数据的那一方负责释放）
    }

    // 收尾：把最后不满一个上限的文件也生成出来
    await flush()

    return count
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
      const now = Date.now()
      if (now - time >= delay) {
        time = now
        return func.apply(context, args)
      }
    }
  }

  /**用第二个字符串里的扩展名替换 originName 里的扩展名。
   *
   * 例如传入参数 123.txt, https://.../123.jpg
   *
   * 返回 123.jpg
   */
  static replaceExtension(originName: string, str: string) {
    const originArray = originName.split('.')
    const originExt = Utils.getExtension(originName)
    const urlExt = Utils.getExtension(str)
    // 如果任意一方没有扩展名，或者扩展名相同，就不修改原文件名
    if (!originExt || !urlExt || originExt === urlExt) {
      return originName
    }
    // 如果扩展名不同，就替换原文件名的扩展名
    originArray[originArray.length - 1] = urlExt
    return originArray.join('.')
  }

  /**获取字符串里的文件扩展名。字符串可能是文件名或 URL */
  static getExtension(str: string) {
    // 移除可能存在的查询字符串，并获取扩展名
    const array = str.split('?')[0].split('.')
    // 如果只有一项，说明字符串里没有包含点 . ，所以也就没有扩展名
    if (array.length === 1) {
      return ''
    }
    return array.at(-1) || ''
  }

  /**替换换行标签，并移除 html 标签 */
  static htmlToText(str: string) {
    return str
      .replace(/<br \/>/g, '\n')
      .replace(/<br\/>/g, '\n')
      .replace(/<br>/g, '\n')
      .replace(/<\/?.+?>/g, '')
    // 这里有两种换行标签：
    // <br /> 这是 Pixiv 的 API 返回的，比如作品简介里的换行
    // <br> 这是现代标准的换行标签，从元素的 innerHTML 属性获取的换行是这样的
  }

  /**将 html 代码转换成纯文本（innerText） */
  static htmlToTextWrong(str: string) {
    const div = document.createElement('div')
    div.innerHTML = str
    // 如果使用这个方法，那么必须将创建的这个元素添加到页面上，然后才能获取其 innerText
    // 如果不 append 到页面，而是直接获取 innerText，那么不会有换行标记 \n
    // 这可能是因为如果一个元素只存在于内存里，而没有添加到页面上进行渲染的话，浏览器会忽略换行标记
    document.body.append(div)

    return div.innerText
  }

  /** 转义 HTML 特殊字符 */
  static escapeHTML(text: string) {
    return text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
  }

  /**将可能包含有 HTML 转义字符的字符串进行反转义 */
  // 例如输入 "1&#44;2&#44;3&#44;4&#39;5&#39;6&#39;"
  // 输出 "1,2,3,4'5'6'"
  // 这也可以解码这些字符：例如 > 的转义 &gt; 空格的 &nbsp;

  // 注意：这里创建的是 textarea 元素，并获取其 value
  // 不能将 textarea 换成 div 元素然后获取其 innerHTML，因为这不会解码 &gt; &nbsp; 之类字符

  // textarea.value 不会转换 <br /> 等 html 标记
  static htmlDecode(str: string) {
    if (!str) {
      return ''
    }

    const textarea = document.createElement('textarea')
    textarea.innerHTML = str
    return textarea.value
  }

  static sleep(time: number) {
    return setTimeoutWorker.sleep(time)
  }

  /**检测元素在视口中是否可见
   * threshold 为 0 时，只要有部分可见就返回 true
   *
   * threshold 为 1 时，需要全部可见才会返回 true
   */
  static observeElement(el: HTMLElement, callback: Function, threshold: 0 | 1) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(true) // 元素进入视口
          } else {
            callback(false) // 元素不在视口
          }
        })
      },
      {
        root: null, // 默认使用视口作为根
        threshold: threshold,
        // threshold 是一个阈值，如果为 0, 那么元素只要有一部分进入视口就触发
        // 如果为 1, 则需要元素完全可见才会触发
      }
    )

    observer.observe(el)
  }

  // 在 Firefox 浏览器里，需要把 response.arrayBuffer 通过 new ArrayBuffer 来复制一份，以通过类型检查
  // 因为 Firefox 把 response.arrayBuffer 视为一个非标准的 ArrayBuffer，尽管它在功能上是等价的。
  // 这会导致 buffer instanceof ArrayBuffer 和 ArrayBuffer.isView(buffer) 在 Firefox 上为 false
  // 因此需要使用 new ArrayBuffer 来复制为标准的 ArrayBuffer，以通过类型检查
  // 注：这个问题同样存在于 response.blob 上
  static copyArrayBuffer(arrayBuffer: ArrayBuffer) {
    const newBuffer = new ArrayBuffer(arrayBuffer.byteLength)
    new Uint8Array(newBuffer).set(new Uint8Array(arrayBuffer))
    arrayBuffer = null as any
    return newBuffer
  }

  static blobToDataURL(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = function () {
        resolve(this.result as string)
      }
      reader.onerror = function () {
        reject(new Error('Failed to convert blob to DataURL'))
      }
      reader.readAsDataURL(blob)
    })
  }

  static readAsBinaryString(blob: Blob) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = function (event) {
        resolve(event!.target!.result)
      }
      reader.readAsBinaryString(blob)
    })
  }

  static async writeClipboardText(text: string) {
    try {
      await window.navigator.clipboard.writeText(text)
      return true
    } catch (error: Error | any) {
      console.error('Writing to clipboard failed', error.message)
      return false
    }
  }

  /** 检测字符串是否全部为 ASCII 字符 */
  static isAscii(str: string) {
    return /^[\x00-\x7F]*$/.test(str)
  }

  /** 为数字字符串添加千位分隔符 */
  static formatNumber(number: number | string): string {
    if (typeof number !== 'string') {
      number = number.toString()
    }

    const length = number.length
    let array = []
    // 倒序处理字符串，从末尾到开头逐字添加到数组里，并每隔 3 位添加一个逗号
    // 如果第一个数字正好是一个千位，则不添加逗号，否则会导致最前面多出一个不该出现的逗号
    for (let i = 1; i <= length; i++) {
      array.push(number[length - i])
      if (i % 3 === 0 && i !== length) {
        array.push(',')
      }
    }
    return array.reverse().join('')
  }

  /** 移除字符串里的 emoji */
  static removeEmojis(str: string) {
    return str.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
      ''
    )
  }

  /** 长按事件，长按鼠标左键或长按屏幕触发
   *
   * @param callback 触发长按时调用，**会把触发长按的事件（mousedown / touchstart）传给它**，
   * 调用方可以据此判断长按发生在哪个元素上
   */
  static longPress(el: HTMLElement, callback: Function, delay: number = 500) {
    let timer: ReturnType<typeof setTimeout> | null = null
    let isLongPress = false
    let startPoint: { x: number; y: number } | null = null
    const moveThreshold = 4

    const getPoint = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        return { x: e.clientX, y: e.clientY }
      }

      const touch = e.touches[0] || e.changedTouches[0]
      if (!touch) {
        return null
      }
      return { x: touch.clientX, y: touch.clientY }
    }

    const start = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent && e.button !== 0) return
      isLongPress = false
      startPoint = getPoint(e)
      timer = setTimeout(() => {
        timer = null
        isLongPress = true
        callback(e)
      }, delay)
    }

    const cancel = () => {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
      startPoint = null
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (timer === null || !startPoint) {
        return
      }

      const currentPoint = getPoint(e)
      if (!currentPoint) {
        cancel()
        return
      }

      const moved =
        Math.abs(currentPoint.x - startPoint.x) > moveThreshold ||
        Math.abs(currentPoint.y - startPoint.y) > moveThreshold

      if (moved) {
        cancel()
      }
    }

    // 长按触发后，拦截随后的 click 事件，避免触发 A/BUTTON 的默认行为
    const handleClick = (e: MouseEvent) => {
      if (isLongPress) {
        e.preventDefault()
        e.stopPropagation()
        isLongPress = false
      }
    }

    el.addEventListener('mousedown', start)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('click', handleClick)

    el.addEventListener('touchstart', start, { passive: true })
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
    // 手指移动时（如滚动）取消长按
    el.addEventListener('touchmove', handleMove, { passive: true })
  }

  /** 点击事件，支持 PC 和移动端。按下到松开的时长不超过 delay 且未发生位移时触发 */
  static click(
    el: HTMLElement,
    callback: (ev: MouseEvent | TouchEvent) => void,
    delay: number = 200
  ) {
    let pressStartTime = 0
    let startPoint: { x: number; y: number } | null = null
    let pressedType: 'mouse' | 'touch' | null = null
    let moved = false
    let lastTouchStartTime = 0
    const moveThreshold = 4

    const getPoint = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        return { x: e.clientX, y: e.clientY }
      }

      const touch = e.touches[0] || e.changedTouches[0]
      if (!touch) {
        return null
      }
      return { x: touch.clientX, y: touch.clientY }
    }

    const reset = () => {
      pressStartTime = 0
      startPoint = null
      pressedType = null
      moved = false
    }

    const start = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        if (e.button !== 0) return
        // 忽略触屏设备触发的兼容鼠标事件
        if (Date.now() - lastTouchStartTime < 700) {
          return
        }
        pressedType = 'mouse'
      } else {
        pressedType = 'touch'
        lastTouchStartTime = Date.now()
      }

      pressStartTime = Date.now()
      startPoint = getPoint(e)
      moved = false
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!pressedType || !startPoint) {
        return
      }

      if (pressedType === 'mouse' && !(e instanceof MouseEvent)) {
        return
      }
      if (pressedType === 'touch' && e instanceof MouseEvent) {
        return
      }

      const point = getPoint(e)
      if (!point) {
        moved = true
        return
      }
      if (
        Math.abs(point.x - startPoint.x) > moveThreshold ||
        Math.abs(point.y - startPoint.y) > moveThreshold
      ) {
        moved = true
      }
    }

    const end = (e: MouseEvent | TouchEvent) => {
      if (!pressedType) {
        return
      }

      if (pressedType === 'mouse' && !(e instanceof MouseEvent)) {
        return
      }
      if (pressedType === 'touch' && e instanceof MouseEvent) {
        return
      }

      const duration = Date.now() - pressStartTime
      const validClick = duration <= delay && !moved
      reset()

      if (validClick) {
        callback(e)
      }
    }

    const cancel = () => {
      reset()
    }

    el.addEventListener('mousedown', start)
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseup', end)
    el.addEventListener('mouseleave', cancel)

    el.addEventListener('touchstart', start, { passive: true })
    el.addEventListener('touchmove', handleMove, { passive: true })
    el.addEventListener('touchend', end)
    el.addEventListener('touchcancel', cancel)
  }

  /** 判断鼠标是否处于某个元素的范围内 */
  static mouseInElementArea(el: Element | undefined, x: number, y: number) {
    if (!el) {
      return false
    }
    const rect = el.getBoundingClientRect()
    return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom
  }

  /** 使用传入的 URL 和标题创建一个 A 标签字符串 */
  static createLinkHTML(url: string, title?: string) {
    return `<a href="${url}" target="_blank">${title || url}</a>`
  }

  /** 从 URL 里获取文件名（不包含扩展名） */
  static getFileNameFromUrl(url: string) {
    const array = url.split('/')
    const lastPart = array.at(-1) || ''
    const nameArray = lastPart.split('.')
    if (nameArray.length === 1) {
      return lastPart
    }
    // 移除最后一个 . 后面的部分，即扩展名，也可能包括查询字符串
    nameArray.pop()
    return nameArray.join('.')
  }

  static splitArray<T>(array: T[], size: number) {
    const result: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }
}

export { Utils }
