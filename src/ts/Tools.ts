import { Result } from './store/StoreType'
import { Utils } from './utils/Utils'

class Tools {
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

  // 根据 tag 判断是否是 R-18(G) 作品
  static isR18OrR18G(tags: string | string[]) {
    const str: string = Array.isArray(tags) ? tags.toString() : tags

    return (
      str.includes('R-18') ||
      str.includes('R-18G') ||
      str.includes('R18') ||
      str.includes('R18G')
    )
  }

  // 在不同的页面类型里，尝试从 url 中获取 tag
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
      if (parseInt(Utils.getURLSearchField(nowURL.href, 'untagged')) === 1) {
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
    return decodeURIComponent(Utils.getURLSearchField(nowURL.href, 'tag'))
  }

  // 从 url 里获取 artworks id
  // 可以传入作品页面的 url（推荐）。如果未传入 url 则使用当前页面的 url（此时可能获取不到 id）
  // 如果查找不到 id 会返回空字符串
  static getIllustId(url?: string) {
    const str = url || window.location.search || location.href
    let result = ''
    if (str.includes('illust_id')) {
      // 传统 url
      const test = /illust_id=(\d*\d)/.exec(str)
      if (test && test.length > 1) {
        result = test[1]
      }
    } else if (str.includes('/artworks/')) {
      // 新版 url
      const test = /artworks\/(\d*\d)/.exec(str)
      if (test && test.length > 1) {
        result = test[1]
      }
    }

    return result
  }

  // 从 url 里获取 novel id
  // 可以传入作品页面的 url（推荐）。如果未传入 url 则使用当前页面的 url（此时可能获取不到 id）
  // 如果查找不到 id 会返回空字符串
  // https://www.pixiv.net/novelPage/show.php?id=12771688
  static getNovelId(url?: string) {
    const str = url || window.location.search || location.href
    let result = ''

    const test = str.match(/\?id=(\d*)?/)
    if (test && test.length > 1) {
      result = test[1]
    }

    return result
  }

  // 获取当前页面的用户 id
  // 这是一个不够可靠的 api
  // 测试：在 https://www.pixiv.net/artworks/79399027 获取 userId ，正确的结果应该是 13895186
  static getUserId() {
    const newRegExp = /\/users\/(\d+)/ // 获取 /users/ 后面连续的数字部分，也就是用户的 id

    // 列表页里从 url 中获取
    const test4 = newRegExp.exec(location.pathname)
    if (!!test4 && test4.length > 1 && !!test4[1]) {
      return test4[1]
    }

    // 获取包含用户 id 的元素，注意这些选择器可能会变，需要进行检查
    const testA: HTMLAnchorElement | null =
      document.querySelector('.sc-LzOjP a') ||
      document.querySelector('aside a') ||
      document.querySelector('nav a')
    // 第一个元素是作品页内，作品下方的作者头像区域的 a 标签
    // 第一个元素是作品页内，页面右侧作者信息区域的 a 标签
    // 第二个元素是用户主页或列表页里，“主页”按钮的 a 标签
    if (testA && testA.href) {
      const test5 = newRegExp.exec(testA.href)
      if (!!test5 && test5.length > 1 && !!test5[1]) {
        return test5[1]
      }
    }

    // 从旧版页面的 head 元素的 script 脚本内容里匹配这一部分
    // pixiv.context.user.id = "<userid>"
    const test1 = /user.id = "(\d*)"/.exec(document.head.innerHTML)
    if (test1 && test1.length > 0) {
      return test1[1]
    }

    // 从旧版页面的 head 元素的 script 脚本内容里匹配这一部分
    // pixiv.context.userId = "<userid>"
    const test2 = /userId = "(\d*)"/.exec(document.head.innerHTML)
    if (test2 && test2.length > 0) {
      return test2[1]
    }

    // 最后从 body 里匹配
    // Warning ：这有可能会匹配到错误的（其他）用户 id！
    const test3 = newRegExp.exec(document.body.innerHTML)
    if (test3) {
      return test3[1]
    }

    // 如果都没有获取到
    throw new Error('getUserId failed!')
  }

  // 将元素插入到 Pixiv 页面顶部
  /*
  newindex-inner 是在未登录时的用户作品列表页面使用的
  layout-body 是在未登录时的搜索页使用的
  */
  static insertToHead<T extends Element>(el: T): T {
    if (document.body) {
      document.body.insertAdjacentElement('afterbegin', el)
    } else {
      ; (
        document.querySelector('.newindex-inner')! ||
        document.querySelector('.layout-body')!
      ).insertAdjacentElement('beforebegin', el)
    }
    return el
  }

  // 寻找 slot，本程序使用的 slot 都要有 data-name 属性
  static findSlot(name: string) {
    const slot = document.querySelector(`slot[data-name=${name}]`)
    if (!slot) {
      throw new Error(`No such slot: ${name}`)
    }
    return slot
  }

  // 使用指定的插槽
  static useSlot(name: string, element: string | HTMLElement) {
    const slot = this.findSlot(name)

    if (typeof element === 'string') {
      // 插入字符串形式的元素
      // 这里不直接使用 insertAdjacentElement 是为了可以返回生成的元素
      const wrap = document.createElement('div')
      wrap.innerHTML = element
      const el = wrap.children[0]
      slot.appendChild(el)
      return el
    } else {
      // 插入 html 元素
      slot.appendChild(element)
      return element
    }
  }

  // 清空指定的插槽
  static clearSlot(name: string) {
    this.findSlot(name).innerHTML = ''
  }

  // 创建下载面板上的通用按钮
  static addBtn(
    slot: string,
    bg: string = '',
    text: string = '',
    attr: string[][] = []
  ) {
    const e = document.createElement('button')
    e.type = 'button'
    e.style.backgroundColor = bg
    e.textContent = text

    for (const [key, value] of attr) {
      e.setAttribute(key, value)
    }

    this.useSlot(slot, e)
    return e
  }

  // 获取页面标题，并且删除 TitleBar 的标记和未读消息的计数（现在 p 站似乎没有消息计数了）
  static getTitle() {
    return document.title
      .replace(/\[(↑|→|▶|↓|║|■|✓| )\] /, '')
      .replace(/^\(\d.*\) /, '')
  }
}

export { Tools }
