// DOM 操作类
// 保存公用的 DOM 操作方法，以及从 DOM 中获取数据的 API
class DOM {
  // 获取指定元素里，可见的结果
  static getVisibleEl(selector: string) {
    const list: NodeListOf<HTMLElement> = document.querySelectorAll(selector)
    return Array.from(list).filter((el) => {
      return el.style.display !== 'none'
    })
  }

  // 删除 DOM 元素
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
  static toggleEl(el: HTMLElement) {
    el.style.display = el.style.display === 'block' ? 'none' : 'block'
  }

  // 将元素插入到页面顶部
  /*
  newindex-inner 是在未登录时的用户作品列表页面使用的
  layout-body 是在未登录时的搜索页使用的
  */
  static insertToHead<T extends Element>(el: T): T {
    if (document.body) {
      document.body.insertAdjacentElement('afterbegin', el)
    } else {
      ;(
        document.querySelector('.newindex-inner')! ||
        document.querySelector('.layout-body')!
      ).insertAdjacentElement('beforebegin', el)
    }
    return el
  }

  // 动态添加 css 样式
  static addStyle(css: string) {
    const e = document.createElement('style')
    e.innerHTML = css
    document.body.append(e)
  }

  // 通过创建 a 标签来下载文件。默认类型为 txt
  static downloadFile(content: string, fileName: string, type = 'text/plain') {
    const file = new Blob([content], {
      type,
    })

    const url = URL.createObjectURL(file)

    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  }

  // 获取用户 id
  // 这是一个不够可靠的 api
  // 测试：在 https://www.pixiv.net/artworks/79399027 获取 userid ，正确的结果应该是 13895186
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
}

export { DOM }
