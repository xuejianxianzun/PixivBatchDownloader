import { API } from '../API'
import { Tools } from '../Tools'
import { lang } from '../Language'
import { token } from '../Token'
import { pageType } from '../PageType'
import { ArtworkData, NovelData } from '../crawl/CrawlResult'
import { bookmark } from '../Bookmark'
import { workToolBar } from '../WorkToolBar'
import { downloadOnClickBookmark } from '../download/DownloadOnClickBookmark'
import { showHelp } from '../ShowHelp'
import { Config } from '../Config'
import { toast } from '../Toast'
import { logErrorStatus } from '../crawl/LogErrorStatus'

type WorkType = 'illusts' | 'novels'

// 在作品页面里添加快速收藏按钮
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

    logErrorStatus.listen((status: number, url: string) => {
      const id = this.workData?.body?.id
      if (id && url.includes(id) && status === 429) {
        toast.error(lang.transl('_状态码429的提示'), {
          position: 'mouse',
        })
      }
    })
  }

  private isNovel = false
  // 初始化时，获取作品数据
  private workData: ArtworkData | NovelData | undefined
  // 是否已收藏
  private _isBookmarked: boolean | undefined
  private get isBookmarked(): boolean {
    return this._isBookmarked || false
  }
  private set isBookmarked(value: boolean) {
    this._isBookmarked = value
    this.setBtnStyle()
  }

  private ob: MutationObserver | undefined // 监视心形收藏按钮变化
  private btn: HTMLButtonElement = document.createElement('button') // 快速收藏按钮
  private readonly btnId = 'quickBookmarkEl' // 快速收藏按钮的 id
  private readonly redClass = 'bookmarkedColor' // 收藏后的红色的颜色值
  private pixivBMKDiv?: HTMLDivElement
  private likeBtn?: HTMLButtonElement

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

    this.pixivBMKDiv = pixivBMKDiv
    this.likeBtn = likeBtn

    this.isNovel = pageType.type === pageType.list.Novel

    // 删除可能存在的旧的快速收藏按钮
    const oldBtn = toolbar.querySelector('#' + this.btnId) as HTMLAnchorElement
    if (oldBtn) {
      oldBtn.remove()
    }

    // 判断这个作品是否收藏过了
    const data = await this.getWorkData()
    if (data === null) {
      return
    }
    this.workData = data as ArtworkData | NovelData

    // 添加快速收藏按钮
    this.createBtn()
    toolbar.insertBefore(this.btn, toolbar.childNodes[3])

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
          } else {
            this.isBookmarked = false
          }
        })
        this.ob.observe(path, {
          attributes: true,
          attributeFilter: ['fill'],
        })
      }
    }

    // 使用快捷键 Alt + B 和 Ctrl + B 来点击快速收藏按钮
    // 以前是 Ctrl + B，现在我改成了 Alt + B。为了保持用户的操作习惯，所以保留了 Ctrl + B
    window.addEventListener(
      'keydown',
      (ev) => {
        if (ev.code === 'KeyB' && (ev.altKey || ev.ctrlKey)) {
          ev.preventDefault()
          ev.stopPropagation()
          this.btn && this.btn.click()
        }
      },
      true
    )
  }

  //　创建快速收藏按钮
  private createBtn() {
    this.btn = document.createElement('button')
    this.btn.id = this.btnId
    this.btn.textContent = '✩'
    this.btn.addEventListener('click', () => {
      if (this.isBookmarked) {
        this.delBookmark()
      } else {
        this.addBookmark(this.pixivBMKDiv!, this.likeBtn!)
        this.sendDownload()
        showHelp.show(
          'tipBookmarkButton',
          lang.transl('_下载器的收藏按钮默认会添加作品的标签')
        )
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

  private async getWorkData() {
    try {
      // 这里不能从缓存的数据中获取作品数据，因为作品的收藏状态可能已经发生了变化
      if (this.isNovel) {
        return await API.getNovelData(Tools.getNovelId())
      } else {
        return await API.getArtworkData(Tools.getIllustId())
      }
    } catch (error: Error | any) {
      return null as any
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
        toast.success(lang.transl('_已收藏'), { position: 'mouse' })
      }
    }, 100)
  }

  private async delBookmark() {
    const data = await this.getWorkData()
    if (data) {
      this.workData = data as ArtworkData | NovelData
      if (this.workData.body.bookmarkData) {
        const bmkId = this.workData.body.bookmarkData.id
        await API.deleteBookmark(
          bmkId,
          this.isNovel ? 'novels' : 'illusts',
          token.token
        )
        this.isBookmarked = false
        toast.success(lang.transl('_已取消收藏'), { position: 'mouse' })
      }
    }
  }

  // 点赞这个作品
  private like(type: WorkType, id: string, likeBtn: HTMLButtonElement) {
    API.addLike(id, type, token.token)
    likeBtn.style.color = '#0096fa'
  }

  private setBtnStyle() {
    if (this.isBookmarked) {
      this.btn.classList.add(this.redClass)
      this.btn.setAttribute('title', lang.transl('_取消收藏AltB'))
    } else {
      this.btn.classList.remove(this.redClass)
      this.btn.setAttribute('title', lang.transl('_快速收藏AltB'))
    }
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
