// 作品页面内的快速收藏功能
import { API } from '../API'
import { Tools } from '../Tools'
import { lang } from '../Lang'
import { token } from '../Token'
import { Utils } from '../utils/Utils'
import { Bookmark } from '../Bookmark'
import { ArtworkData, NovelData } from '../crawl/CrawlResult'
import { cacheWorkData } from '../store/CacheWorkData'

type WorkType = 'illusts' | 'novels'

class QuickBookmark {
  constructor() {
    this.init()
  }

  private toolbar!: HTMLDivElement // 包含点赞 收藏 等按钮的工具栏元素
  private pixivBMKDiv: HTMLDivElement | undefined // p 站原本的心形收藏按钮
  private ob: MutationObserver | undefined // 监视心形收藏按钮变化
  private btn: HTMLAnchorElement = document.createElement('a') // 快速收藏按钮
  private readonly btnId = 'quickBookmarkEl' // 快速收藏按钮的 id
  private readonly redClass = 'bookmarkedColor' // 收藏后的红色的颜色值
  private readonly likeBtnClass = '_35vRH4a' // 点赞按钮的 class
  private isNovel = false
  private isBookmarked: boolean | undefined
  private timer: number = 0
  private flag = 'xzFlag' // 当插入快速下载按钮时，给原本的收藏按钮添加一个标记

  // 初始化时，会获取作品数据，保存到这个成员
  private workData: ArtworkData | NovelData | undefined

  private async init() {
    // 没有 token 就不能进行收藏
    if (!token.token) {
      return
    }

    this.isNovel = window.location.href.includes('/novel')

    this.timer = window.setInterval(() => {
      this.initBtn()
    }, 300)
  }

  // 插入快速收藏按钮
  private async initBtn() {
    // 从父元素查找作品下方的工具栏
    const toolbarParent = document.querySelectorAll('main > section')

    for (const el of toolbarParent) {
      const test = el.querySelector('div>section')
      if (test) {
        this.toolbar = test as HTMLDivElement
        break
      }
    }

    if (this.toolbar) {
      // 获取心形收藏按钮的 div
      this.pixivBMKDiv = this.toolbar.childNodes[2] as HTMLDivElement
      // 当没有心形收藏按钮时，中止这次执行（可能是尚未添加；或者是用户处于自己的作品页面）
      if (!this.pixivBMKDiv) {
        return
      }

      if (!this.isNovel) {
        // 在插画漫画作品页面里，给心形收藏按钮添加标记，标记过的就不再处理
        // 但是在小说页面里不会给心形收藏按钮添加标记，也不会修改它，因为小说页面里切换作品时，工具栏不会重新生成，也就是说小说页面里的心形收藏按钮用的都是一开始的那一个，如果下载器修改了它，就会导致异常
        if (this.pixivBMKDiv.classList.contains(this.flag)) {
          return
        } else {
          // 给心形收藏按钮添加标记，表示已经对其进行处理
          this.pixivBMKDiv.classList.add(this.flag)
        }
      }

      window.clearInterval(this.timer)

      // 删除可能存在的旧的快速收藏按钮
      const oldBtn = this.toolbar.querySelector(
        '#' + this.btnId
      ) as HTMLAnchorElement
      if (oldBtn) {
        oldBtn.remove()
      }

      // 判断这个作品是否收藏过了
      this.workData = await this.getWorkData()
      this.isBookmarked = !!this.workData.body.bookmarkData

      // 监听心形收藏按钮从未收藏到收藏的变化
      // 没有收藏时，心形按钮的第一个子元素是 button。收藏之后，button 被移除，然后添加一个 a 标签
      if (!this.isBookmarked) {
        this.ob = new MutationObserver((mutations) => {
          for (const change of mutations) {
            if (change.type === 'childList') {
              const added = change.addedNodes
              if (added.length > 0 && added[0].nodeName === 'A') {
                this.isBookmarked = true
                this.bookmarked()
              }
            }
          }
        })
        this.ob.observe(this.pixivBMKDiv, {
          childList: true,
        })
      }

      // 添加快速收藏按钮
      this.btn = this.createBtn()
      lang.register(this.btn)
      this.toolbar.insertBefore(this.btn, this.toolbar.childNodes[3])

      if (this.isBookmarked) {
        this.bookmarked()
      } else {
        this.btn.addEventListener('click', () => {
          this.addBookmark()
        })
      }
    }
  }

  //　创建快速收藏按钮
  private createBtn() {
    const btn = document.createElement('a')
    btn.id = this.btnId
    btn.textContent = '✩'
    btn.href = 'javascript:void(0)'
    btn.dataset.xztitle = '_快速收藏'
    return btn
  }

  private async getWorkData() {
    if (this.isNovel) {
      return await API.getNovelData(Tools.getNovelId())
    } else {
      const id = Tools.getIllustId()
      return cacheWorkData.get(id) || (await API.getArtworkData(id))
    }
  }

  private async addBookmark() {
    const type = this.isNovel ? 'novels' : 'illusts'
    const id = this.isNovel ? Tools.getNovelId() : Tools.getIllustId()

    this.like(type, id)

    if (this.isBookmarked) {
      return
    }

    await Bookmark.add(id, type, Tools.extractTags(this.workData!))

    // 收藏成功之后
    this.isBookmarked = true
    this.bookmarked()
    // 让心形收藏按钮也变成收藏后的状态
    if (!this.isNovel) {
      this.changePixivBMKDiv()
    }
  }

  // 点赞这个作品
  private like(type: WorkType, id: string) {
    API.addLike(id, type, token.token)

    // 不在小说页面里修改点赞按钮，否则切换到其他小说之后点赞按钮依然是蓝色的
    if (this.isNovel) {
      return
    }

    // 将点赞按钮的颜色改为蓝色
    let likeBtn = document.querySelector(
      `.${this.likeBtnClass}`
    ) as HTMLButtonElement
    if (!likeBtn) {
      // 上面尝试直接用 class 获取点赞按钮，如果获取不到则从工具栏里选择
      // 点赞按钮是工具栏里的最后一个 button 元素
      console.error('likeBtn class is not available')
      const btnList = this.toolbar.querySelectorAll('button')
      likeBtn = btnList[btnList.length - 1]
    }
    likeBtn.style.color = '#0096fa'
  }

  private getEditBookmarkLink() {
    if (this.isNovel) {
      return `/novel/bookmark_add.php?id=${Tools.getNovelId()}`
    } else {
      return `/bookmark_add.php?type=illust&illust_id=${Tools.getIllustId()}`
    }
  }

  // 如果这个作品已收藏，则改变快速收藏按钮
  private bookmarked() {
    this.btn.classList.add(this.redClass)
    this.btn.href = this.getEditBookmarkLink()
  }

  // 把心形收藏按钮从未收藏变成已收藏
  private changePixivBMKDiv() {
    if (!this.pixivBMKDiv) {
      return
    }

    // 取消监听心形收藏按钮的变化
    if (this.ob) {
      this.ob.disconnect()
    }

    const svg = this.pixivBMKDiv.querySelector('svg')
    if (!svg) {
      return
    }

    // 这条规则让心形的内部填充，显示出来完整的心。缺少这个规则的话，心形只有边框，内部还是空的
    const redStyle = `
    .${this.redClass} mask path{
      fill: white !important;
    }`
    Utils.addStyle(redStyle)

    // 创建一个 a 标签，用它替换掉 button（模拟心形按钮收藏后的变化）
    const a = document.createElement('a')
    a.href = this.getEditBookmarkLink()
    a.appendChild(svg as Node)

    // 移除 button，添加 a 标签
    const btn = this.pixivBMKDiv.querySelector('button')
    btn && btn.remove()
    this.pixivBMKDiv.insertAdjacentElement('afterbegin', a)

    // 给 svg 添加 class，让心形变红
    svg.classList.add(this.redClass)

    // 点击 a 标签时阻止事件冒泡。因为不阻止的话，点击这个 a 标签，pixiv 会进行添加收藏的操作。我的目的是让它跳转到编辑 tag 的页面。
    a.addEventListener(
      'click',
      (ev) => {
        ev.stopPropagation()
      },
      true
    )
  }
}

export { QuickBookmark }
