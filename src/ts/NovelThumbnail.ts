import { WorkThumbnail } from './WorkThumbnail'
import { pageType } from './PageType'
import { Tools } from './Tools'
import { Config } from './Config'

// 查找小说作品的缩略图，当鼠标进入、移出时等动作触发时执行回调函数
// 这个功能是始终启用的，没有开关的选项
class NovelThumbnail extends WorkThumbnail {
  constructor() {
    super()

    if (Config.mobile) {
      // 移动端的作品选择器就这一个
      this.selectors = ['.works-item-novel']
    } else {
      this.selectors = [
        'li[size="1"]>div',
        'nav>div>div',
        'div.gtm-novel-work-recommend-link',
        'section ul>div',
        'section ul>li',
        'div._ranking-item',
        'div[size="496"]',
        'div[size="392"]',
        // 新版首页里的推荐作品，很奇怪，直接打开首页时是第一种选择器，切换到其他分类再切换回来是第二种选择器
        'div[style="width:184px"]>div:first-child',
        'div[style="width: 184px;"]>div:first-child',
        'div[data-ga4-entity-id^="novel"]>div:nth-child(2)',
        // 在搜索页面里，小说的选择器可能是这个
        'div[data-ga4-label="works_content"]>div>div',
        // 鼠标放到作者名字上，显示作者的 3 个作品预览图，其中小说的选择器是这个
        'div[type="novel"][size]',
        // 在比赛页面使用
        '.thumbnail-container',
        '.image-container',
        // 在用户主页的“小说”分类的“精选”部分使用
        'ul ul li>div',
        'section li>div',
        // 在小说排行榜页面里使用
        'li[id]',
        '.gtm-illust-recommend-zone li',
        'li',
      ]
    }

    this.findThumbnail(document.body)
    this.createObserver(document.body)
  }

  protected readonly selectors: string[] = []

  protected findThumbnail(parent: HTMLElement) {
    if (!parent.querySelectorAll) {
      return
    }

    // 遍历所有的选择器，为找到的元素绑定事件
    // 注意：有时候一个节点里会含有多种尺寸的缩略图，为了全部查找到它们，必须遍历所有的选择器。
    // 如果在查找到某个选择器之后，不再查找剩余的选择器，就可能会遗漏一部分缩略图。
    // 但是，这有可能会导致事件的重复绑定，所以下载器添加了 dataset.mouseover 标记以减少重复绑定
    for (const selector of this.selectors) {
      // 处理桌面端特殊情况中使用的选择器
      if (!Config.mobile) {
        // 在用户主页只使用指定的选择器，避免其他选择器导致顶部“精选”的小说作品被重复绑定事件
        if (
          pageType.type === pageType.list.UserHome &&
          selector !== 'section ul>li' &&
          selector !== 'li[size="1"]>div' &&
          selector !== 'ul ul li>div'
        ) {
          continue
        }

        // 在小说排行榜里只使用
        if (
          pageType.type === pageType.list.NovelRanking &&
          selector !== 'div._ranking-item' &&
          selector !== 'li[id]'
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

        if (
          selector === '.gtm-illust-recommend-zone li' &&
          pageType.type !== pageType.list.Discover
        ) {
          continue
        }

        if (
          selector === 'div[data-ga4-entity-id^="novel"]>div:nth-child(2)' &&
          pageType.type !== pageType.list.Home
        ) {
          continue
        }

        // 在首页的首页分类里，不使用这些选择器，因为它会连带小说封面下方的作者区域也一起选择
        if (
          (selector === 'section li>div' || selector === 'section ul>li') &&
          pageType.type === pageType.list.Home
        ) {
          if (location.pathname === '/' || location.pathname === '/en/') {
            continue
          }
        }

        // 在首页的小说分类里不使用这个选择器
        if (
          selector === 'section ul>div' &&
          pageType.type === pageType.list.Home
        ) {
          if (location.pathname === '/novel') {
            continue
          }
        }

        if (
          selector === 'div[data-ga4-label="works_content"]>div>div' &&
          pageType.type !== pageType.list.NovelSearch
        ) {
          continue
        }

        if (
          (selector === '.thumbnail-container' ||
            selector === '.image-container') &&
          pageType.type !== pageType.list.Contest
        ) {
          continue
        }

        if (
          selector === 'div[size="392"]' &&
          pageType.type !== pageType.list.SearchUsers
        ) {
          continue
        }

        // 这个选择器只在约稿-小说页面里使用：
        // https://www.pixiv.net/request/creators/works/novels
        if (
          selector === 'li' &&
          window.location.pathname !== '/request/creators/works/novels'
        ) {
          continue
        }
      }
      let elements: HTMLElement[] | NodeListOf<Element> =
        parent.querySelectorAll(selector)
      // 处理特殊的动态添加的元素
      // 有些动态添加的元素不能被选择器选中

      // 在一些小说页面里，动态添加的元素就是 li 元素，直接使用它
      if (
        (pageType.type === pageType.list.NovelSeries ||
          pageType.type === pageType.list.NovelRanking) &&
        parent.nodeName === 'LI'
      ) {
        elements = [parent]
      }

      for (const el of elements) {
        const id = Tools.findWorkIdFromElement(el as HTMLElement, 'novels')
        // 在移动端页面里，此时获取的可能是 '0'
        // 依然绑定
        if (Config.mobile) {
          this.bindEvents(el as HTMLElement, id, 'novels')
        } else {
          // 在桌面版页面里，只有查找到 id 时才会执行回调函数
          // 分为两种情况：单篇小说 和 系列小说
          // 实际上这两种情况经常同时发生，例如在单篇小说的缩略图里附带了它的系列页面链接
          // 优先查找单篇小说的链接，因为很多时候是在展示单篇小说，至于它的系列页面链接只是附带的
          if (id) {
            // 单篇小说
            this.bindEvents(el as HTMLElement, id, 'novels')
            this.addSelectorData(el as HTMLElement, selector)
          } else {
            // 如果找不到作品 id，可能这个元素是系列小说，此时尝试查找系列 id
            const seriesId = Tools.findSeriesIdFromElement(
              el as HTMLElement,
              'novels'
            )
            if (seriesId) {
              this.bindEvents(el as HTMLElement, seriesId, 'novels', true)
              this.addSelectorData(el as HTMLElement, selector)
            }
          }
        }
      }
    }
  }
}

const novelThumbnail = new NovelThumbnail()
export { novelThumbnail }
