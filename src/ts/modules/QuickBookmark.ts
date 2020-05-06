// 快速收藏
import { API } from './API'
import { lang } from './Lang'
import { form } from './Settings'
import { IllustData, NovelData } from './CrawlResult.d'

class QuickBookmark {
  constructor() {
    this.init()
  }

  private btn: HTMLAnchorElement = document.createElement('a') // 快速收藏的元素
  private readonly btnId = 'quickBookmarkEl'
  private readonly colorClass = 'bookmarkedColor'
  private readonly likeBtnClass = '_35vRH4a'

  private isNovel = false
  private isBookmarked: boolean | null = null
  private timer: number = 0

  private async init() {
    window.clearInterval(this.timer)

    this.isNovel = window.location.href.includes('/novel')

    this.isBookmarked = !!(await this.getBookmarkData())

    this.timer = setInterval(() => {
      this.initBtn()
    }, 300)
  }

  private async getBookmarkData() {
    let data: IllustData | NovelData
    if (this.isNovel) {
      data = await API.getNovelData(API.getNovelId())
    } else {
      data = await API.getArtworkData(API.getIllustId())
    }
    return data.body.bookmarkData
  }

  // 首先添加快速下载按钮，如果选项是不启用快速收藏，则不添加
  private initBtn() {
    // 在某些条件下，不展开快速收藏功能
    if (!API.getToken() || !form.quickBookmarks.checked) {
      return
    }

    // 从父元素查找作品下方的工具栏
    const toolbarParent = document.querySelectorAll('main > section')

    let toolbar // 工具栏
    for (const el of toolbarParent) {
      const test = el.querySelector('div>section')
      if (test) {
        toolbar = test
        break
      }
    }

    if (toolbar) {
      const orgIcon = toolbar.childNodes[2] as HTMLDivElement
      // 当没有收藏按钮时，停止执行（如用户处于自己作品的页面时没有收藏按钮）
      if (!orgIcon) {
        return
      }
      // 隐藏原来的收藏按钮
      orgIcon.style.display = 'none'

      // 如果没有快速收藏元素则添加
      this.btn = toolbar.querySelector(this.btnId) as HTMLAnchorElement
      if (!this.btn) {
        this.btn = this.createBtn()
        toolbar.insertBefore(this.btn, toolbar.childNodes[3])
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
      ;(document.querySelector(
        `.${this.likeBtnClass}`
      )! as HTMLButtonElement).click()

      // 快速收藏
      if (this.isBookmarked) {
        return
      }

      let tagArray: string[] = []
      // 如果设置了快速收藏，则获取 tag
      if (form.quickBookmarks.checked) {
        const tagElements = document.querySelectorAll('._1LEXQ_3 li')
        for (const el of tagElements) {
          const nowA = el.querySelector('a')
          if (nowA) {
            let nowTag = nowA.textContent?.trim()
            // 对于原创作品，非日文的页面上只显示了用户语言的“原创”，替换成日文 tag “オリジナル”。
            if (
              nowTag === '原创' ||
              nowTag === 'Original' ||
              nowTag === '창작'
            ) {
              nowTag = 'オリジナル'
            }
            if (nowTag) {
              tagArray.push(nowTag)
            }
          }
        }
      }

      const type: 'illusts' | 'novels' = this.isNovel ? 'novels' : 'illusts'
      const id = this.isNovel ? API.getNovelId() : API.getIllustId()

      // 调用添加收藏的 api
      API.addBookmark(type, id, tagArray, false, API.getToken())
        .then((response) => response.json())
        .then((data) => {
          if (data.error === false) {
            this.isBookmarked = true
            this.bookmarked()
          }
        })
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
