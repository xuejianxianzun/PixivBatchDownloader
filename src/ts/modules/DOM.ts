// DOM 操作类
// 提供公用的 DOM 操作方法，以及从 DOM 中获取数据的 API
class DOM {
  // 获取指定元素里，可见的结果
  static getVisibleEl(selector: string) {
    const list: NodeListOf<HTMLElement> = document.querySelectorAll(selector)
    return Array.from(list).filter(el => {
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
      ;(el as NodeListOf<Element>).forEach(el => {
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

  // 获取用户 id
  static getUserId() {
    const newRegExp = /\/users\/(\d+)/ // 匹配新版用户页面 url 里的 id
    // 获取 /users/ 后面连续的数字部分

    // 列表页里从 url 中获取
    const test4 = newRegExp.exec(location.pathname)
    if (!!test4 && test4.length > 1 && !!test4[1]) {
      return test4[1]
    }

    // 从新版页面的作品页、列表页获取包含用户 id 的元素，注意这些选择器可能会变到其他元素上
    const testA: HTMLAnchorElement | null =
      document.querySelector('.jkOmlQ a') || document.querySelector('a.lknEaI')
    if (testA && testA.href) {
      const test5 = newRegExp.exec(testA.href)
      if (!!test5 && test5.length > 1 && !!test5[1]) {
        return test5[1]
      }
    }

    // 从旧版页面的头像获取（在旧版书签页面使用）
    const nameElement = document.querySelector(
      '.user-name'
    )! as HTMLAnchorElement
    if (nameElement) {
      return newRegExp.exec(nameElement.href)![1]
    }

    // 最后从 body 里匹配，注意这有可能会匹配到错误的（其他的）用户 id！
    let test3 = newRegExp.exec(document.body.innerHTML)
    if (test3) {
      return test3[1]
    }

    // 如果都没有获取到
    throw new Error('getUserId failed!')
  }
}

export { DOM }
