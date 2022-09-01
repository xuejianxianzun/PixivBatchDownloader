import { WorkThumbnail } from './WorkThumbnail'
import { pageType } from './PageType'
import { Tools } from './Tools'

// 查找图像作品的缩略图，当鼠标进入、移出时等动作触发时执行回调函数
class ArtworkThumbnail extends WorkThumbnail {
  constructor() {
    super()
    this.findThumbnail(document.body)
    this.createObserver(document.body)
  }

  protected readonly selectors = [
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

  protected findThumbnail(parent: HTMLElement) {
    if (!parent.querySelectorAll) {
      return
    }
    // 遍历所有的选择器，为找到的元素绑定事件
    // 注意：有时候一个节点里会含有多种尺寸的缩略图，为了全部查找到它们，必须遍历所有的选择器。
    // 如果在查找到某个选择器之后，不再查找剩余的选择器，就可能会遗漏一部分缩略图。
    // 但是，这有可能会导致事件的重复绑定，所以下载器添加了 dataset.mouseover 标记以减少重复绑定
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
        const id = Tools.findWorkIdFromElement(el as HTMLElement, 'illusts')
        // 只有查找到作品 id 时才会执行回调函数
        if (id) {
          this.bindEvents(el as HTMLElement, id)
        }
      }
    }
  }
}

const artworkThumbnail = new ArtworkThumbnail()
export { artworkThumbnail }
