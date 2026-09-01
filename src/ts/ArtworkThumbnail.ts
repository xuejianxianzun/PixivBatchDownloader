import { WorkThumbnail } from './WorkThumbnail'
import { pageType } from './PageType'
import { Tools } from './Tools'
import { Config } from './Config'

// 查找图像作品的缩略图，当鼠标进入、移出时等动作触发时执行回调函数
// 这个功能是始终启用的，没有开关的选项
class ArtworkThumbnail extends WorkThumbnail {
  constructor() {
    super()

    if (Config.mobile) {
      // 移动端的作品选择器
      this.selectors = [
        '.works-item-illust',
        '.works-item',
        // 首页底部用大尺寸展示的作品
        '[data-ga4-label="work_content"]',
        '[data-ga4-label="thumbnail"]',
        // 不要使用下面这个选择器，因为它过于宽泛了，经常是其他缩略图元素的子元素，容易造成重复绑定
        // [data-ga4-label="thumbnail_link"]
        // 发现页面
        'a.gtm-illust-recommend-thumbnail-link',
        // 排行榜里的插画
        '[data-tx]',
        // 动态页面
        '.stacclist .illust',
      ]
      this.selectors.push(...this.requestPageSelectorsOnMobile)
    } else {
      this.selectors = [
        // 下面是通用的选择器
        '#viewerWarpper li',
        'div[width="136"]',
        'div[width="131"]',
        'div[size="131"]',
        'div[width="288"]',
        'div[width="184"]',
        'div[size="184"]',
        'div[size="112"]',
        'div[width="112"]',
        'div[width="104"]',
        'div[width="90"]',
        'div[width="118"]',
        '._work',
        '._work.item',
        'div[type="illust"]',
        // 下面是在某些页面里使用的选择器
        // 这是搜索框下拉内容里的作品缩略图
        'div[type="illust"][size="118"]',
        'li>div>div:first-child',
        'li>div>div:first-child>div:first-child',
        'li>div>div>div:first-child',
        '.worksUL li>div>div:first-child',
        'div[data-ga4-entity-id^="illust"]>div:nth-child(2)',
        'div[data-ga4-entity-id^="manga"]>div:nth-child(2)',
        // 在新版搜索页面里使用
        'li[id]>div:nth-child(2)',
        // 搜索页面的热门作品，这是我自己添加的 className
        '.hotBarWorkLink',
        // 在比赛页面使用
        '.thumbnail-container',
        // 在某些比赛页面里会有“注目的应募作品”一栏，使用这个选择器
        '._module-carousel-container>div',
        // 首页-插画-瞩目的企划目录里的作品
        'li[size="1"]',
        // 新版首页里的推荐作品，很奇怪，直接打开首页时是第一种选择器，切换到其他分类再切换回来是第二种选择器
        'div[style="width:184px"]>div:first-child',
        'div[style="width: 184px;"]>div:first-child',
        // 约稿页面里的图像作品
        'ul li>div>div:first-child',
      ]
      // div[data-ga4-entity-id^="illust"]>div:nth-child(2) 匹配新版首页的插画作品区域
      // 即显示在页面左半边的作品缩略图。它们的元素里含有此类特征：
      // data-ga4-entity-id="illust/128387071"
      // 这里还会显示小说，但小说的含有 novel 关键词，可以区别开来，例如：
      // data-ga4-entity-id="novel/18205969"
    }

    this.createObserver(document.body)

    // 立即查找一次元素
    this.findThumbnail(document.body)

    // 在某些页面里循环查找
    window.setInterval(() => {
      if (this.loopFind()) {
        this.findThumbnail(document.body)
      }
    }, 1000)
  }

  protected readonly selectors: string[] = []

  // 移动端的约稿页面里的图像作品
  private requestPageSelectorsOnMobile = [
    '.gtm-request-creator-recommend-post-link-work[data-ga4-label="thumbnail_link"]',
    '.gtm-complete-request-portal-work-link-illust[data-ga4-label="thumbnail_link"]',
    '.gtm-commission-portal-follow-work[data-ga4-label="thumbnail_link"]',
    '.gtm-commission-portal-new-work[data-ga4-label="thumbnail_link"]',
    '.gtm-complete-request-portal-work-link-manga[data-ga4-label="thumbnail_link"]',
    '.gtm-complete-request-complete-work-link-illust-recommend-all[data-ga4-label="thumbnail_link"]',
    '.gtm-complete-request-complete-work-link-manga-recommend-all[data-ga4-label="thumbnail_link"]',
    '.gtm-complete-request-complete-work-link-ugoira-recommend-all[data-ga4-label="thumbnail_link"]',
  ]

  // 需要循环查找的页面类型。需要使用循环查找来处理的情况有：
  // 这些页面里的作品出现的比较晚，一开始查找不到
  // 下载器绑定一次之后，这些缩略图的元素可能被 pixiv 再次修改，导致绑定失效，需要重新添加相关标记
  private loopFindPageTypeOnPC = [pageType.list.Request]
  private loopFindPageTypeOnMobile = [
    pageType.list.Request,
    pageType.list.ArtworkRanking,
    pageType.list.UserHome,
    pageType.list.Bookmark,
    pageType.list.NewArtworkFromFollowing,
    pageType.list.NewArtworkFromAllUsers,
    pageType.list.ArtworkSearch,
    pageType.list.Following,
  ]

  /** 决定是否在当前页面里循环查找 */
  private loopFind() {
    if (document.hidden) {
      return false
    }

    // PC 端页面
    if (!Config.mobile) {
      return this.loopFindPageTypeOnPC.includes(pageType.type)
    }

    if (Config.mobile) {
      return this.loopFindPageTypeOnMobile.includes(pageType.type)
    }
    return false
  }

  protected findThumbnail(parent: HTMLElement) {
    // pathname 里有 /novel 的页面里也可能有图像作品，所以这个条件不启用
    // if(window.location.pathname.includes('/novel')){
    //   return
    // }

    if (!parent.querySelectorAll) {
      return
    }

    // 遍历所有的选择器，为找到的元素绑定事件
    // 注意：有时候一个节点里会含有多种尺寸的缩略图，为了全部查找到它们，必须遍历所有的选择器。
    // 如果在查找到某个选择器之后，不再查找剩余的选择器，就可能会遗漏一部分缩略图。
    // 但是这有可能会导致事件重复绑定，所以下载器添加了 dataset.mouseover 标记以减少重复绑定
    for (const selector of this.selectors) {
      // #viewerWarpper li 是下载器在多图作品页面里添加的缩略图列表
      if (
        selector === '#viewerWarpper li' &&
        pageType.type !== pageType.list.Artwork
      ) {
        continue
      }

      // div[size="184"] 在这些页面里使用
      if (
        selector === 'div[size="184"]' &&
        pageType.type !== pageType.list.Discover &&
        pageType.type !== pageType.list.DiscoverUsers &&
        pageType.type !== pageType.list.Home &&
        pageType.type !== pageType.list.SearchUsers &&
        pageType.type !== pageType.list.Unsupported
      ) {
        continue
      }

      if (
        selector === '.hotBarWorkLink' &&
        pageType.type !== pageType.list.ArtworkSearch
      ) {
        continue
      }

      // div[type="illust"] 只在约稿页面使用
      // 因为已知问题：在收藏页面里， div[type="illust"] 嵌套了子元素 div[width="184"]
      // 这会导致重复绑定（在不同元素上）
      if (
        selector === 'div[type="illust"]' &&
        pageType.type !== pageType.list.Request
      ) {
        continue
      }

      // 只在 大家的新作 页面里使用
      if (
        selector === 'li>div>div:first-child' &&
        pageType.type !== pageType.list.NewArtworkFromAllUsers
      ) {
        continue
      }

      // 只在 约稿 页面里使用
      // .worksUL li>div>div:first-child 是在“已完成的约稿”里使用的
      if (
        (selector === 'li>div>div:first-child>div:first-child' ||
          selector === '.worksUL li>div>div:first-child') &&
        pageType.type !== pageType.list.Request
      ) {
        continue
      }

      // 只在用户主页的约稿分类页面里使用
      if (
        selector === 'ul li>div>div:first-child' &&
        pageType.type !== pageType.list.UserRequest
      ) {
        continue
      }

      // 这些选择器只在新版首页使用
      if (
        pageType.type !== pageType.list.Home &&
        (selector === 'li>div>div>div:first-child' ||
          selector === 'div[style="width:184px"]>div:first-child' ||
          selector === 'div[style="width: 184px;"]>div:first-child' ||
          selector === 'div[data-ga4-entity-id^="illust"]>div:nth-child(2)' ||
          selector === 'div[data-ga4-entity-id^="manga"]>div:nth-child(2)')
      ) {
        continue
      }

      // 在首页的“插画”、“漫画”分类里不使用这个选择器，因为它会导致错误的选择，或者导致同一个作品被选择两次
      if (selector === 'li[size="1"]' && pageType.type === pageType.list.Home) {
        if (
          location.pathname.endsWith('/illustration') ||
          location.pathname.endsWith('/manga') ||
          location.pathname.includes('/cate_r18.php')
        ) {
          continue
        }
      }

      // 在一些页面里不使用这个选择器，因为它会连带插画封面下方的标题、用户区域也一起选择
      if (
        selector === 'li[size="1"]' &&
        (pageType.type === pageType.list.UserHome ||
          pageType.type == pageType.list.Artwork ||
          pageType.type == pageType.list.NewArtworkFromFollowing ||
          pageType.type === pageType.list.Bookmark)
      ) {
        continue
      }

      if (
        selector === 'li[id]>div:nth-child(2)' &&
        pageType.type !== pageType.list.ArtworkRanking
      ) {
        continue
      }

      if (
        (selector === '.thumbnail-container' ||
          selector == '._module-carousel-container>div') &&
        pageType.type !== pageType.list.Contest
      ) {
        continue
      }

      // 处理移动端页面里的缩略图选择器
      if (Config.mobile) {
        if (
          selector === '[data-ga4-label="thumbnail_link"]' &&
          pageType.type === pageType.list.Home
        ) {
          continue
        }
      }

      const elements = parent.querySelectorAll<HTMLElement>(selector)
      for (const el of elements) {
        const id = Tools.findWorkIdFromElement(el, 'illusts')

        if (Config.mobile) {
          // 在移动端页面里，即使没有找到作品 id，也要执行回调函数
          // 因为此时可能内部的 A 标签还未生成，所以会获取不到 id
          // 等到点击下载按钮时再尝试获取 id
          this.bindEvents(el, id, 'illusts')
          this.addSelectorData(el, selector)

          // 在移动端的约稿页面里，需要把这些 a 标签的宽高设为 100%，否则它们的尺寸是 0
          if (this.requestPageSelectorsOnMobile.includes(selector)) {
            el.style.display = 'block'
            el.style.width = '100%'
            el.style.height = '100%'
            el.style.zIndex = '2'
          }
        } else {
          // 在桌面版页面里，只有查找到作品 id 时才会执行回调函数
          if (id) {
            this.bindEvents(el, id, 'illusts')
            this.addSelectorData(el, selector)
          }
        }
      }
    }
  }
}

const artworkThumbnail = new ArtworkThumbnail()
export { artworkThumbnail }
