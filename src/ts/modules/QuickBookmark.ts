// 快速收藏
import { API } from './API'
import { lang } from './Lang'
import { form } from './setting/Form'
import { ArtworkData, NovelData } from './CrawlResult.d'

class QuickBookmark {
  constructor() {
    this.init()
  }

  private toolbar!: HTMLDivElement // 包含点赞 收藏 等按钮的工具栏元素
  private pixivBMKDiv!: HTMLDivElement // p 站原本的收藏按钮
  private btn: HTMLAnchorElement = document.createElement('a') // 快速收藏按钮
  private readonly btnId = 'quickBookmarkEl'
  private readonly colorClass = 'bookmarkedColor'
  private readonly likeBtnClass = '_35vRH4a'

  private isNovel = false
  private isBookmarked: boolean | null = null
  private timer: number = 0

  private async init() {
    // 在某些条件下，不展开快速收藏功能
    if (!API.getToken() || !form.quickBookmarks.checked) {
      return
    }

    window.clearInterval(this.timer)

    this.isNovel = window.location.href.includes('/novel')

    this.isBookmarked = !!(await this.getBookmarkData())

    this.timer = window.setInterval(() => {
      this.initBtn()
    }, 300)
  }

  private async getBookmarkData() {
    let data: ArtworkData | NovelData
    if (this.isNovel) {
      data = await API.getNovelData(API.getNovelId())
    } else {
      data = await API.getArtworkData(API.getIllustId())
    }
    return data.body.bookmarkData
  }

  // 插入快速收藏按钮
  private initBtn() {
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
      // 获取原本的收藏按钮（其实是按钮外层的 div）
      this.pixivBMKDiv = this.toolbar.childNodes[2] as HTMLDivElement
      // 当没有收藏按钮时，停止执行（如用户处于自己作品的页面时没有收藏按钮）
      if (!this.pixivBMKDiv) {
        return
      }
      // 隐藏原来的收藏按钮
      this.pixivBMKDiv.style.display = 'none'

      // 如果没有快速收藏元素则添加
      this.btn = this.toolbar.querySelector(
        '#' + this.btnId
      ) as HTMLAnchorElement
      if (!this.btn) {
        this.btn = this.createBtn()
        this.toolbar.insertBefore(this.btn, this.toolbar.childNodes[3])
      }

      if (this.isBookmarked) {
        this.bookmarked()
      } else {
        this.readyBookmark()
      }

      window.clearInterval(this.timer)
    }
  }

  private createBtn() {
    const btn = document.createElement('a')
    btn.id = this.btnId
    btn.textContent = '✩'
    btn.href = 'javascript:void(0)'
    btn.title = lang.transl('_快速收藏')
    return btn
  }

  // 准备快速收藏
  private readyBookmark() {
    this.btn.classList.remove(this.colorClass)
    this.btn.href = 'javascript:void(0)'

    this.btn.addEventListener('click', () => {
      // 自动点赞
      let likeBtn = document.querySelector(
        `.${this.likeBtnClass}`
      ) as HTMLButtonElement
      if (!likeBtn) {
        // 上面尝试直接用 class 获取点赞按钮，考虑到 class 可能会变化，这里从工具栏的按钮里选择。
        // 点赞按钮是工具栏里的最后一个 button 元素
        console.error('likeBtn class is not available')
        const btnList = this.toolbar.querySelectorAll('button')
        likeBtn = btnList[btnList.length - 1]
      }
      likeBtn.click()

      if (this.isBookmarked) {
        return
      }

      // 点击 p 站自带的收藏按钮，这是因为这一行为将会在作品下方显示推荐作品。如果不点击自带的按钮，只使用本程序添加的按钮，那么就不会出现推荐作品了。
      const pixivBMKBtn =
        this.pixivBMKDiv && this.pixivBMKDiv.querySelector('button')
      pixivBMKBtn && pixivBMKBtn.click()

      // 如果设置了快速收藏，则获取 tag
      let tags: string[] = []
      if (form.quickBookmarks.checked) {
        const tagElements = document.querySelectorAll('._1LEXQ_3 li')
        for (const el of tagElements) {
          const nowA = el.querySelector('a')
          if (nowA) {
            const nowTag = nowA.textContent!.trim()
            if (nowTag) {
              tags.push(nowTag)
            }
          }
        }
      }

      // 如果一个作品是原创作品，它的 tag 列表的最前面会显示“原创” tag。以前是统一显示日文的“オリジナル”，现在则会根据用户语言显示不同的文字。这里会把“オリジナル”添加到末尾，保持和以前的习惯一致。
      if (
        tags.includes('原创') ||
        tags.includes('Original') ||
        tags.includes('창작')
      ) {
        tags.push('オリジナル')
      }

      const type: 'illusts' | 'novels' = this.isNovel ? 'novels' : 'illusts'
      const id = this.isNovel ? API.getNovelId() : API.getIllustId()

      // 这里加了个延迟，因为上面先点击了 pixiv 自带的收藏按钮，但不加延迟的话， p 站自己的不带 tag 的请求反而是后发送的。所以这里通过延迟让 p 站不带 tag 的请求先发送，下载器的带 tag 的请求后发送。
      setTimeout(() => {
        // 调用添加收藏的 api
        API.addBookmark(type, id, tags, false, API.getToken())
          .then((response) => response.json())
          .then((data) => {
            if (data.error === false) {
              this.isBookmarked = true
              this.bookmarked()
            }
          })
      }, 400)
    })
  }

  // 如果这个作品已收藏，则改变样式
  private bookmarked() {
    this.btn.classList.add(this.colorClass)

    if (this.isNovel) {
      this.btn.href = `/novel/bookmark_add.php?id=${API.getNovelId()}`
    } else {
      this.btn.href = `/bookmark_add.php?type=illust&illust_id=${API.getIllustId()}`
    }
  }
}

export { QuickBookmark }
