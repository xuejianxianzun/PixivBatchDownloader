// 查找（图像）作品的缩略图，当鼠标进入、移出时触发回调
import { pageType } from './PageType'
import { Tools } from './Tools'

class MouseOverThumbnail {
  constructor() {
    // 立即对作品缩略图绑定事件
    this.handleThumbnail(document.body)
    // 使用监视器，让未来出现的作品缩略图也绑定上事件
    this.createObserver(document.body)
  }

  // 作品缩略图的选择器
  // 选择器的元素必须含有作品的超链接（超链接可以在这个元素上，也可以在这个元素的子元素上）
  private readonly selectors = [
    'div[width="136"]',
    'div[width="131"]',
    'div[width="288"]',
    'div[width="184"]',
    'div[width="112"]',
    'div[width="104"]',
    'div[width="90"]',
    'div[width="118"]',
    '._work',
    '._work.item',
    'li>div>div:first-child',
  ]

  private enterCallback: Function[] = []
  private leaveCallback: Function[] = []

  // 判断元素是否含有作品缩略图，如果找到了缩略图则为其绑定事件
  private handleThumbnail(parent: HTMLElement) {
    if (!parent.querySelectorAll) {
      return
    }
    // 遍历所有的选择器，为找到的元素绑定事件
    // 注意：有时候一个节点里会含有多种尺寸的缩略图，为了全部查找到它们，必须遍历所有的选择器。
    // 如果在查找到某个选择器之后，不再查找剩余的选择器，就会遗漏一部分缩略图。
    // 但是，这有可能会导致事件的重复绑定
    // 例如，画师主页顶部的“精选”作品会被两个选择器查找到：'li>div>div:first-child' 'div[width="288"]'
    for (const selector of this.selectors) {
      // 现在 'li>div>div:first-child' 只在投稿页面使用
      if (
        selector === 'li>div>div:first-child' &&
        pageType.type !== pageType.list.Request
      ) {
        return
      }

      const elements = parent.querySelectorAll(selector)
      for (const el of elements) {
        const id = Tools.findIllustIdFromElement(el as HTMLElement)
        // 只有查找到作品 id 时才会执行回调函数
        if (id) {
          // 如果这个缩略图元素、或者它的直接父元素、或者它的直接子元素已经有标记，就跳过它
          if ((el as HTMLElement).dataset.mouseover) {
            return
          }

          if (el.parentElement && el.parentElement.dataset.mouseover) {
            return
          }

          if (
            el.firstElementChild &&
            (el.firstElementChild as HTMLElement).dataset.mouseover
          ) {
            return
          }

          // 当对一个缩略图元素绑定事件时，在它上面添加标记
          // 添加标记的目的是为了减少事件重复绑定的情况发生
          ;(el as HTMLElement).dataset.mouseover = '1'

          el.addEventListener('mouseenter', (ev) => {
            this.enterCallback.forEach((cb) => cb(el, id, ev))
          })

          el.addEventListener('mouseleave', (ev) => {
            this.leaveCallback.forEach((cb) => cb(el, ev))
          })
        }
      }
    }
  }

  private createObserver(target: HTMLElement) {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.addedNodes.length > 0) {
          // 遍历被添加的元素
          for (const newEl of record.addedNodes) {
            this.handleThumbnail(newEl as HTMLElement)
          }
        }
      }
    })
    observer.observe(target, {
      childList: true,
      subtree: true,
    })
  }

  // onEnter 回调函数会接收到 3 个参数：
  // el 作品缩略图的元素
  // id 作品 id
  // ev 鼠标进入或者移出 el 时的 event
  public onEnter(fn: Function) {
    this.enterCallback.push(fn)
  }

  // onLeave 的回调函数没有 id 参数，因为鼠标离开时的 id 就是鼠标进入时的 id
  public onLeave(fn: Function) {
    this.leaveCallback.push(fn)
  }
}

const mouseOverThumbnail = new MouseOverThumbnail()
export { mouseOverThumbnail }
