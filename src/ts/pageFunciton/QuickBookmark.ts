// 作品页面内的快速收藏功能
import { API } from '../API'
import { Tools } from '../Tools'
import { lang } from '../Lang'
import { token } from '../Token'
import { pageType } from '../PageType'
import { ArtworkData, NovelData } from '../crawl/CrawlResult'
import { bookmark } from '../Bookmark'
import { workToolBar } from '../WorkToolBar'
import { downloadOnClickBookmark } from '../download/DownloadOnClickBookmark'
import { showHelp } from '../ShowHelp'
import { Config } from '../Config'
import { toast } from '../Toast'

type WorkType = 'illusts' | 'novels'

class QuickBookmark {
  constructor() {
    workToolBar.register(
      (
        toolbar: HTMLDivElement,
        pixivBMKDiv: HTMLDivElement,
        likeBtn: HTMLButtonElement
      ) => {
        this.init(toolbar, pixivBMKDiv, likeBtn)
      }
    )
  }

  private isNovel = false
  // 初始化时，获取作品数据
  private workData: ArtworkData | NovelData | undefined
  private isBookmarked: boolean | undefined

  private ob: MutationObserver | undefined // 监视心形收藏按钮变化
  private btn: HTMLAnchorElement = document.createElement('a') // 快速收藏按钮
  private readonly btnId = 'quickBookmarkEl' // 快速收藏按钮的 id
  private readonly redClass = 'bookmarkedColor' // 收藏后的红色的颜色值

  private async init(
    toolbar: HTMLDivElement,
    pixivBMKDiv: HTMLDivElement,
    likeBtn: HTMLButtonElement
  ) {
    // 没有 token 就不能进行收藏
    if (!token.token) {
      return
    }

    if (
      pageType.type !== pageType.list.Artwork &&
      pageType.type !== pageType.list.Novel
    ) {
      return
    }

    this.isNovel = pageType.type === pageType.list.Novel

    // 删除可能存在的旧的快速收藏按钮
    const oldBtn = toolbar.querySelector('#' + this.btnId) as HTMLAnchorElement
    if (oldBtn) {
      oldBtn.remove()
    }

    // 判断这个作品是否收藏过了
    this.workData = await this.getWorkData()
    this.isBookmarked = !!this.workData.body.bookmarkData

    // 监听心形收藏按钮从未收藏到收藏的变化
    if (!this.isBookmarked) {
      if (!Config.mobile) {
        // 桌面端
        // 没有收藏时，心形按钮的第一个子元素是 button。收藏之后，button 被移除，然后添加一个 a 标签
        this.ob = new MutationObserver((mutations) => {
          for (const change of mutations) {
            if (change.type === 'childList') {
              const added = change.addedNodes
              if (added.length > 0 && added[0].nodeName === 'A') {
                this.isBookmarked = true
                this.redQuickBookmarkBtn()
              }
            }
          }
        })
        this.ob.observe(pixivBMKDiv, {
          childList: true,
        })
      } else {
        // 移动端
        // 点击心形按钮收藏作品后，不会添加 a 标签，也不会跳转到编辑收藏的页面，仅仅会改变 path 的 fill 颜色。
        const path = pixivBMKDiv.querySelector('path')
        if (!path) {
          return
        }
        this.ob = new MutationObserver((mutations) => {
          if (path.getAttribute('fill') === '#FF4060') {
            this.isBookmarked = true
            this.redQuickBookmarkBtn()
          } else {
            this.isBookmarked = false
            this.resetQuickBookmarkBtn()
          }
        })
        this.ob.observe(path, {
          attributes: true,
          attributeFilter: ['fill'],
        })
      }
    }

    // 添加快速收藏按钮
    this.btn = this.createBtn()
    lang.register(this.btn)
    toolbar.insertBefore(this.btn, toolbar.childNodes[3])

    if (this.isBookmarked) {
      this.redQuickBookmarkBtn()
    } else {
      this.btn.addEventListener('click', () => {
        // 添加收藏
        this.addBookmark(pixivBMKDiv, likeBtn)

        // 下载这个作品
        this.sendDownload()

        showHelp.show(
          'tipBookmarkButton',
          lang.transl('_下载器的收藏按钮默认会添加作品的标签')
        )
      })
    }

    // 使用快捷键 Ctrl + B 点击快速收藏按钮
    window.addEventListener('keydown', (ev) => {
      if (ev.code === 'KeyB' && ev.ctrlKey) {
        this.btn && this.btn.click()
      }
    })
  }

  private sendDownload() {
    if (Tools.isArtworkData(this.workData!)) {
      downloadOnClickBookmark.send(this.workData!.body.illustId)
    } else {
      downloadOnClickBookmark.send(this.workData!.body.id, 'novels')
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
    // 这里不能从缓存的数据中获取作品数据，因为作品的收藏状态可能已经发生了变化
    if (this.isNovel) {
      return await API.getNovelData(Tools.getNovelId())
    } else {
      return await API.getArtworkData(Tools.getIllustId())
    }
  }

  private async addBookmark(
    pixivBMKDiv: HTMLDivElement,
    likeBtn: HTMLButtonElement
  ) {
    const type = this.isNovel ? 'novels' : 'illusts'
    const id = this.isNovel ? Tools.getNovelId() : Tools.getIllustId()

    // 移动端不自动点赞和设置点赞按钮的颜色，因为切换作品后元素没有重新生成，样式会依旧存在
    if (!Config.mobile) {
      this.like(type, id, likeBtn)
    }

    if (this.isBookmarked) {
      return
    }

    // 先模拟点击 Pixiv 原本的收藏按钮，这样可以显示推荐作品
    // 这会发送一次 Pixiv 原生的收藏请求
    this.clickPixivBMKBtn(pixivBMKDiv)

    // 然后再由下载器发送收藏请求
    // 因为下载器的收藏按钮具有添加标签、非公开收藏等功能，所以要在后面执行，覆盖掉 Pixiv 原生收藏的效果
    window.setTimeout(async () => {
      const status = await bookmark.add(
        id,
        type,
        Tools.extractTags(this.workData!)
      )

      if (status === 403) {
        toast.error(`403 Forbidden, ${lang.transl('_你的账号已经被Pixiv限制')}`)
        return
      }

      if (status !== 429) {
        this.isBookmarked = true
        this.redQuickBookmarkBtn()
      }
    }, 100)
  }

  // 点赞这个作品
  private like(type: WorkType, id: string, likeBtn: HTMLButtonElement) {
    API.addLike(id, type, token.token)
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
  private redQuickBookmarkBtn() {
    this.btn.classList.add(this.redClass)
    this.btn.href = this.getEditBookmarkLink()
  }

  // 如果这个作品从已收藏变成未收藏，则改变快速收藏按钮
  private resetQuickBookmarkBtn() {
    this.btn.classList.remove(this.redClass)
    this.btn.href = 'javascript:void(0)'
  }

  private clickPixivBMKBtn(pixivBMKDiv: HTMLDivElement) {
    if (Config.mobile) {
      pixivBMKDiv && pixivBMKDiv.click()
    } else {
      const btn = pixivBMKDiv.querySelector('button')
      btn && btn.click()
    }
    // 取消监听心形收藏按钮的变化
    this.ob && this.ob.disconnect()
  }
}

new QuickBookmark()
