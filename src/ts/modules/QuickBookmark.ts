// 快速收藏
import { API } from './API'
import { lang } from './Lang'
import { form } from './Settings'

class QuickBookmark {
  constructor() {
    this.quickBookmark()
  }

  private quickBookmarkEl: HTMLAnchorElement = document.createElement('a') // 快速收藏的元素
  private readonly likeBtnClass = '_35vRH4a'

  // 快速收藏
  private quickBookmark() {
    // 因为切换作品（pushstate）时，不能准确的知道 toolbar 何时更新，而且获取 token 也可能需要时间，所以只能不断检测
    setTimeout(() => {
      this.quickBookmark()
    }, 300)

    // 如果获取不到 token，则不展开快速收藏功能
    if (!API.getToken()) {
      return
    }

    // 因为 p 站改版 class 经常变，所以从父元素查找，父元素的 class 变化没那么频繁
    const toolbarParent = document.querySelectorAll('main > section')

    let toolbar // 作品下方的工具栏
    for (const el of toolbarParent) {
      const test = el.querySelector('div>section')
      if (test) {
        toolbar = test
        break
      }
    }

    if (toolbar) {
      this.quickBookmarkEl = document.querySelector(
        '#quickBookmarkEl'
      ) as HTMLAnchorElement

      // 如果没有 quick 元素则添加
      if (!this.quickBookmarkEl) {
        // 创建快速收藏元素
        this.quickBookmarkEl = document.createElement('a')
        this.quickBookmarkEl.id = 'quickBookmarkEl'
        this.quickBookmarkEl.textContent = '✩'
        this.quickBookmarkEl.href = 'javascript:void(0)'
        this.quickBookmarkEl.title = lang.transl('_快速收藏')
        toolbar.insertBefore(this.quickBookmarkEl, toolbar.childNodes[3])
        // 隐藏原来的收藏按钮并检测收藏状态
        const orgIcon = toolbar.childNodes[2] as HTMLDivElement

        if (!orgIcon) {
          // 当用户处于自己作品的页面时，是没有收藏按钮的，停止执行
          return
        } else {
          orgIcon.style.display = 'none'
        }

        const heart = orgIcon.querySelector('svg')!
        if (window.getComputedStyle(heart)['fill'] === 'rgb(255, 64, 96)') {
          // 如果已经收藏过了
          this.quickBookmarkEnd()
        } else {
          // 准备快速收藏
          this.readyQuickBookmark()
        }
      } else {
        // 如果有 quick 元素，什么都不做
        return
      }
    }
  }

  // 准备快速收藏
  private readyQuickBookmark() {
    this.quickBookmarkEl.addEventListener('click', () => {
      ;(document.querySelector(
        `.${this.likeBtnClass}`
      )! as HTMLButtonElement).click() // 自动点赞

      let tagString = ''
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
        tagString = encodeURI(tagArray.join(' '))
      }

      // 调用添加收藏的 api
      const type: 'illusts' | 'novels' = window.location.href.includes('/novel')
        ? 'novels'
        : 'illusts'

      API.addBookmarkNew(
        type,
        API.getIllustId(),
        tagArray,
        false,
        API.getToken()
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error === false) {
            this.quickBookmarkEnd()
          }
        })
    })
  }

  // 如果这个作品已收藏，则改变样式
  private quickBookmarkEnd() {
    this.quickBookmarkEl.style.color = '#FF4060'
    this.quickBookmarkEl.href = `/bookmark_add.php?type=illust&illust_id=${API.getIllustId()}`
  }
}

export { QuickBookmark }
