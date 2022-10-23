import { WorkThumbnail } from './WorkThumbnail'
import { pageType } from './PageType'
import { Tools } from './Tools'

// 查找小说作品的缩略图，当鼠标进入、移出时等动作触发时执行回调函数
class NovelThumbnail extends WorkThumbnail {
  constructor() {
    super()
    this.findThumbnail(document.body)
    this.createObserver(document.body)
  }

  protected readonly selectors = [
    'li[size="1"]>div',
    'section li>div',
    'nav>div>div',
    'div.gtm-novel-work-recommend-link',
    'section ul>div',
    'section ul>li',
    'div._ranking-item',
    'div[size="496"]',
    'li',
  ]

  protected findThumbnail(parent: HTMLElement) {
    if (!parent.querySelectorAll) {
      return
    }
    // 遍历所有的选择器，为找到的元素绑定事件
    // 注意：有时候一个节点里会含有多种尺寸的缩略图，为了全部查找到它们，必须遍历所有的选择器。
    // 如果在查找到某个选择器之后，不再查找剩余的选择器，就可能会遗漏一部分缩略图。
    // 但是，这有可能会导致事件的重复绑定，所以下载器添加了 dataset.mouseover 标记以减少重复绑定
    for (const selector of this.selectors) {
      // 处理特殊的选择器

      // 在用户主页只使用指定的选择器，避免其他选择器导致顶部“精选”的小说作品被重复绑定事件
      if (
        pageType.type === pageType.list.UserHome &&
        selector !== 'section ul>li' &&
        selector !== 'li[size="1"]>div'
      ) {
        continue
      }

      // 在小说排行榜里只使用 div._ranking-item
      if (
        pageType.type === pageType.list.NovelRanking &&
        selector !== 'div._ranking-item'
      ) {
        continue
      }

      // 在小说系列页面里只使用 section ul>li
      if (
        pageType.type === pageType.list.NovelSeries &&
        selector !== 'section ul>li'
      ) {
        continue
      }

      // div.gtm-novel-work-recommend-link 只能在小说页面里使用
      if (
        selector === 'div.gtm-novel-work-recommend-link' &&
        pageType.type !== pageType.list.Novel
      ) {
        continue
      }

      let elements: HTMLElement[] | NodeListOf<Element> =
        parent.querySelectorAll(selector)
      // 处理特殊的动态添加的元素
      // 有些动态添加的元素不能被选择器选中

      // 小说系列页面里动态添加的就是 li 元素，并且这个 li 元素必须整个使用，不能再细分
      if (
        pageType.type === pageType.list.NovelSeries &&
        parent.nodeName === 'LI'
      ) {
        elements = [parent]
      }

      for (const el of elements) {
        const id = Tools.findWorkIdFromElement(el as HTMLElement, 'novels')
        // 只有查找到作品 id 时才会执行回调函数
        if (id) {
          this.bindEvents(el as HTMLElement, id)
        }
      }
    }
  }
}

const novelThumbnail = new NovelThumbnail()
export { novelThumbnail }
