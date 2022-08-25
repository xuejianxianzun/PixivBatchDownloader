// 作品页面内的快速收藏功能
import { API } from '../API'
import { Tools } from '../Tools'
import { lang } from '../Lang'
import { token } from '../Token'
import { Utils } from '../utils/Utils'
import { pageType } from '../PageType'
import { ArtworkData, NovelData } from '../crawl/CrawlResult'
import { Bookmark } from '../Bookmark'
import { workToolBar } from '../WorkToolBar'
import { downloadOnClickBookmark } from '../download/DownloadOnClickBookmark'

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
    // 没有收藏时，心形按钮的第一个子元素是 button。收藏之后，button 被移除，然后添加一个 a 标签
    if (!this.isBookmarked) {
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
      })
    }
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

    this.like(type, id, likeBtn)

    if (this.isBookmarked) {
      return
    }

    await Bookmark.add(id, type, Tools.extractTags(this.workData!))

    // 收藏成功之后
    this.isBookmarked = true
    this.redQuickBookmarkBtn()
    this.redPixivBMKDiv(pixivBMKDiv)
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

  // 把心形收藏按钮从未收藏变成已收藏
  private redPixivBMKDiv(pixivBMKDiv: HTMLDivElement) {
    // 取消监听心形收藏按钮的变化
    this.ob && this.ob.disconnect()

    const svg = pixivBMKDiv.querySelector('svg')
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
    const btn = pixivBMKDiv.querySelector('button')
    btn && btn.remove()
    pixivBMKDiv.insertAdjacentElement('afterbegin', a)

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

new QuickBookmark()
