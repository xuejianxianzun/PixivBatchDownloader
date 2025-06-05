import { Config } from './Config'
import { EVT } from './EVT'
import { pageType } from './PageType'
import { settings } from './setting/Settings'
import { Tools } from './Tools'

class ShowLargerThumbnails {
  constructor() {
    if (Config.mobile) {
      return
    }

    this.loadCssText()
    this.bindEvents()
    this.findSpecialEl()
  }

  // css 内容来自 style/showLargerThumbnails.css
  private css = ''
  private readonly styleId = 'ShowLargerThumbnails'

  private needFind = true

  private async loadCssText() {
    const css = await fetch(
      chrome.runtime.getURL('style/showLargerThumbnails.css')
    )
    this.css = await css.text()
    this.setCss()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'showLargerThumbnails') {
        this.setCss()
      }
    })

    // 切换页面时，允许重新查找特定元素
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.setCss()
      this.needFind = true
    })

    // 当页面元素变化时，允许重新查找。
    // 这主要是因为切换页面时，下载器可能先查找到了目标元素，但之后页面内容马上发生了变化，移除了目标元素。
    // 所以当元素变化时，需要重新查找，否则偶尔会显示异常
    const targetNode = document.querySelector('body')!
    const observer = new MutationObserver(() => {
      this.needFind = true
    })
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    })

    // 循环查找
    window.setInterval(() => {
      this.findSpecialEl()
    }, 500)
  }

  private setCss() {
    if (!this.css) {
      return
    }

    if (Tools.notEnabledShowLargerThumb()) {
      return this.removeStyle()
    }
    settings.showLargerThumbnails ? this.addStyle() : this.removeStyle()
  }

  private addStyle() {
    if (document.querySelector('#' + this.styleId)) {
      return
    }

    const el = document.createElement('style')
    el.id = this.styleId
    el.innerHTML = this.css
    document.body.append(el)
  }

  private removeStyle() {
    const el = document.querySelector('#' + this.styleId)
    el && el.remove()
  }

  /** 在某些页面里超找一些特定容器，为其添加自定义的 className **/
  private findSpecialEl() {
    if (this.needFind === false) {
      return
    }

    // 首页
    if (pageType.type === pageType.list.Home) {
      const sectionList = document.querySelectorAll('section')
      if (sectionList.length === 0) {
        return
      }

      if (sectionList[1]) {
        // 查找 精选新作 和 已关注用户的作品 的 section 父元素
        if (sectionList[1].querySelector('ul div')) {
          sectionList[1].classList.add('homeFriendsNewWorks')
          this.needFind = false
        }
      }

      // 在漫画页面里，查找 推荐作品
      if (window.location.pathname.includes('/manga')) {
        const allLi = sectionList[2]?.querySelectorAll('ul li')
        if (allLi.length > 1) {
          sectionList[2].classList.add('homeRecommendedWorks')
          sectionList[2].parentElement!.classList.add(
            'homeRecommendedWorksParent'
          )

          const ul = sectionList[2].querySelector('ul')!
          ul.classList.add('homeRecommendedWorksUL')
          // 宽度为 1224px 的容器
          ul.parentElement!.classList.add('homeRecommendedWorksULWrapper')
        }
      }

      // 查找“正在举办的比赛”
      const testA = document.querySelector('section li a[href*="/contest"]')
      if (testA) {
        // 查找这个章节，然后查找显示的几张图片的 UL 元素
        const wrapper = testA.closest('section')
        const ul = wrapper?.querySelector('ul')
        ul?.classList.add('contestWorksUL')
      }

      // 在新版首页里，额外查找 推荐作品
      if (
        sectionList[2] &&
        ['/', '/en/', '/illustration'].includes(window.location.pathname)
      ) {
        const allLi = sectionList[2].querySelectorAll('ul li')
        if (allLi.length > 1) {
          sectionList[2].classList.add('homeRecommendedWorks')
          sectionList[2].parentElement!.classList.add(
            'homeRecommendedWorksParent'
          )

          // 并且需要查找里面的小说作品，然后找到其 li 元素。
          // 这样可以给小说的 li 添加 width:100%，否则小说的宽度就是原本的样子，和大图片的视觉效果不一致
          allLi.forEach((li) => {
            if (li.querySelector('a[href^="/novel"]')) {
              li.classList.add('novelLI')
            }
          })

          // 推荐作品里，最前面两个 li 元素可能是空的，也可能有个含有 iframe 的元素。
          // 当下载器把 ul 设置为 display: flex; 之后，需要移除这些元素，否则它们会占据一些宽度
          allLi.forEach((li) => {
            if (li.childElementCount === 0) {
              li.remove()
            }
            const iframe = li.querySelector('iframe')
            if (iframe) {
              iframe.remove()
            }
          })
        }
      }
    }

    // 画师主页
    if (pageType.type === pageType.list.UserHome) {
      // 查找“插画·漫画”的父级 div（宽度为 1224px 的那个）
      const li = document.querySelector('li[size="1"]')
      if (li) {
        const target = li.parentElement!.parentElement!
        if (target.nodeName === 'DIV') {
          target.classList.add('userHomeWrapper')
          this.needFind = false
        }
      }

      // 查找精选作品
      const allFeatured = document.querySelectorAll('div[width="288"]')
      for (const div of allFeatured) {
        // 每个精选作品的内容分为左右两部分，左侧是缩略图，右侧是作品信息
        // 区分左右，并查找其父元素 li
        div.parentElement!.classList.add('featuredLeft')
        div.parentElement!.nextElementSibling!.classList.add('featuredRight')
        const li = div.closest('li')
        if (li) {
          li.classList.add('featuredLI')
          // 查找有很大 padding 的父元素
          li.closest('div')!.classList.add('featuredPadding')
        }
      }

      // 查找作品列表上方的 tag 列表
      const a = document.querySelector('a[status="normal"]')
      if (a) {
        a.parentElement!.parentElement!.parentElement!.classList.add(
          'userHomeTagList'
        )
      }
    }

    //  收藏页面
    if (pageType.type === pageType.list.Bookmark) {
      // 查找宽度为 1224px 的父元素
      // 首先查找 li[size="1"]，并且需要判断里面的链接是 illust，而非 novel
      const li = document.querySelector('li[size="1"]')
      if (li) {
        const illustLink = li.querySelector('a[href^="/artworks/"]')
        if (!illustLink) {
          return
        }

        li.parentElement!.classList.add('worksUL')
        li.parentElement!.parentElement!.classList.add('worksWrapper')

        this.needFind = false
      }

      // 查找“主页、插画、漫画、收藏”一栏的导航栏
      const nav = document.querySelector('nav')
      nav?.parentElement!.classList.add('navBar')
    }

    //  搜索页面、Tag 页面
    if (pageType.type === pageType.list.ArtworkSearch) {
      // 查找作品列表的 UL 元素，将其从 grid 布局改为 flex 布局
      // 在 tag 首页，可能有两个作品缩略图区域，第一个是“热门作品”，第二个才是普通的作品列表
      const ulList = document.querySelectorAll('section ul')
      for (const ul of ulList) {
        if (ul.querySelector('div[width="184"]')) {
          ul.classList.add('worksUL')
          this.needFind = false
        }
      }
    }

    // 已关注用户的新作品
    if (pageType.type === pageType.list.NewArtworkBookmark) {
      if (window.location.pathname.includes('/novel') === false) {
        // 查找 UL 的父级 div（宽度为 1224px 的那个）
        const li = document.querySelector('li[size="1"]')
        if (li) {
          li.parentElement!.classList.add('worksUL')

          const target = li.parentElement!.parentElement!
          if (target.nodeName === 'DIV') {
            target.classList.add('worksWrapper')
            this.needFind = false
          }
        }
      }
    }

    //  发现页面
    if (pageType.type === pageType.list.Discover) {
      // 查找作品列表的 UL 元素
      // 因为会有多个板块，所以需要多次查找
      const ulList = document.querySelectorAll('ul')
      for (const ul of ulList) {
        if (ul.querySelector('div[type="illust"]')) {
          ul.classList.add('worksUL')
          this.needFind = false
        }
      }

      // 收藏作品后出现的“相关作品”区域
      // 寻找作品列表 ul 元素的上、下 div 元素，左侧是占位符，右侧是遮罩
      const els = document.querySelectorAll('ul + div')
      els.forEach((div) => {
        div.parentElement!.classList.add('ul-father')
      })
    }

    //  发现用户页面
    if (pageType.type === pageType.list.DiscoverUsers) {
      // 查找宽度为 1224px 的容器的父元素，解除它的所有直接子元素的宽度限制
      const els = document.querySelectorAll('.bg-background1')
      const name = 'wrapperwrapper'
      // 先把所有符合条件的都移除目标 className，再对最后一个添加目标 className
      els.forEach((el) => el.classList.remove(name))
      els[els.length - 1].classList.add(name)

      // 查找作品列表的 UL 元素
      // 因为会有多个板块，所以需要多次查找
      const ulList = document.querySelectorAll('ul')
      for (const ul of ulList) {
        const work = ul.querySelector('div[type="illust"]')
        if (work) {
          const ul = work.closest('ul')
          ul?.classList.add('worksUL')
          this.needFind = false
        }
      }
    }
  }
}

new ShowLargerThumbnails()
