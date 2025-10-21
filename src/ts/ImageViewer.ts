/// <reference path = "./ImageViewer.d.ts" />
import { API } from './API'
import { EVT } from './EVT'
import { lang } from './Language'
import { loading } from './Loading'
import { toast } from './Toast'
import { Tools } from './Tools'
import { ArtworkData } from './crawl/CrawlResult'
import { bookmark } from './Bookmark'
import { cacheWorkData } from './store/CacheWorkData'
import { Colors } from './Colors'
import { downloadOnClickBookmark } from './download/DownloadOnClickBookmark'
import { pageType } from './PageType'
import { store } from './store/Store'
import { copyWorkInfo } from './CopyWorkInfo'

interface InitConfig {
  /** 作品 id，如果为空从会 url 中获取作品 id */
  workId: string
  /** 初始化时显示哪一张图片。如果不传入的话，Viewer 会自行处理。
   *
   * 如果用户是点击与 Viewer 绑定的缩略图来启动 Viewer 的话，Viewer 会自动设置这个值为点击的图片索引。
   *
   * 但是目前下载器里不存在这种情况（用户点击的缩略图或按钮与 Viewer 是解耦的），所以如果不传入这个值，Viewer 会默认显示第一张图片（索引 0）。
   */
  initialViewIndex?: number
  /** 查看大图时，显示哪种尺寸的图片，默认为 original */
  imageSize: 'original' | 'regular' | 'small'
  /** 初始化之后，是否直接启动查看器，默认为 false */
  autoStart: boolean
  /** 获取作品数据期间，是否显示 loading 动画，默认为 false */
  showLoading: boolean
}

// 所有参数都是可选的
type ConfigOptional = Partial<InitConfig>

// 对 Viewer 进行修改以供下载器使用
// 原版是接收页面上已存在的缩略图列表，但在下载器里它需要从作品 id 获取数据，生成缩略图列表。并且需要进行一些改造
class ImageViewer {
  constructor(cfg: ConfigOptional) {
    this.cfg = Object.assign(this.cfg, cfg)
    this.init()
  }

  private myViewer!: Viewer // 查看器
  private viewerWarpper?: HTMLDivElement // 图片列表的容器
  private viewerUl: HTMLUListElement = document.createElement('ul') // 图片列表的 ul 元素

  private show = false // 当前查看器实例是否处于显示状态
  private isOriginalSize = false // 是否原尺寸显示图片

  // 图片查看器初始化时，会获取作品数据，保存到这个成员
  private workData: ArtworkData | undefined
  private pageCount = 1
  private firstImageURL = '' // 第一张图片的 url
  private index = 0 // 当前查看的图片索引

  // 默认配置
  private cfg: InitConfig = {
    workId: Tools.getIllustId(),
    imageSize: 'original',
    autoStart: false,
    showLoading: false,
  }

  private readonly addBtnClass = 'viewer-add-btn'

  public async init() {
    // 删除旧的图片查看器元素
    const oldViewerContainer = document.querySelector('.viewer-container')
    oldViewerContainer && oldViewerContainer.remove()

    const wrap = await this.createImageList()
    if (wrap) {
      this.bindShortcuts()
      this.configureViewer()
    }
    return wrap
  }

  // 事件会重复绑定，设计如此，这是因为每次绑定时的 this 是不同的，必须重新绑定。而且不会冲突
  private bindShortcuts() {
    document.addEventListener('keydown', (ev) => {
      if (!this.show) {
        return
      }

      // 不需要 Alt 的快捷键
      if (!ev.altKey) {
        // 按 F 进入/退出 1:1 查看模式
        if (ev.code === 'KeyF') {
          this.isOriginalSize = !this.isOriginalSize
          this.setOriginalSize()
        } else if (ev.code === 'KeyC') {
          // 按 C 下载当前查看的图片
          ev.stopPropagation()
          this.download(this.index)
        } else if (ev.code === 'KeyD') {
          // 按 D 下载这个作品
          this.download()
        }
      } else {
        // 需要 Alt 的快捷键
        if (ev.code === 'KeyB') {
          // 按 Alt + B 收藏当前作品
          // 因为 Pixiv 会在按下 B 键时收藏当前作品，所以下载器不能使用 B 键。尝试阻止 Pixiv 的事件但是没有成功
          // 阻止冒泡，这主要是因为作品页面内，按 B 会触发作品内容下方的快速收藏按钮，需要避免
          ev.stopPropagation()
          this.addBookmark()
        } else if (ev.code === 'KeyC') {
          // 按 Alt + C 复制当前作品的信息
          // 阻止冒泡，这主要是因为作品页面内，按 Alt + C 会触发作品内容下方的复制按钮，需要避免
          ev.stopPropagation()
          this.copy()
        }
      }
    })

    // 监听左右方向键，防止在看图时，左右方向键导致 Pixiv 切换作品
    window.addEventListener(
      'keydown',
      (ev) => {
        if (this.show) {
          if (ev.code === 'ArrowLeft' || ev.code === 'ArrowRight') {
            // 阻止事件冒泡
            ev.stopPropagation()
            ev.preventDefault()
            // 控制切换到上一张或者下一张
            // true 表示启用循环切换
            ev.code === 'ArrowLeft'
              ? this.myViewer.prev(true)
              : this.myViewer.next(true)
          }
        }
      },
      true
    )
  }

  // 图片查看器需要一个图片列表元素，创建缩略图列表
  private async createImageList(): Promise<HTMLElement | undefined> {
    return new Promise(async (resolve) => {
      // 获取作品数据
      if (cacheWorkData.has(this.cfg.workId)) {
        this.workData = cacheWorkData.get(this.cfg.workId)
      } else {
        this.cfg.showLoading && (loading.show = true)

        const unlisted = pageType.type === pageType.list.Unlisted
        const data = await API.getArtworkData(this.cfg.workId, unlisted)
        this.workData = data
        cacheWorkData.set(data)

        this.cfg.showLoading && (loading.show = false)
      }

      const body = this.workData!.body
      // 处理插画、漫画、动图作品，不处理其他类型的作品
      if (
        body.illustType === 0 ||
        body.illustType === 1 ||
        body.illustType === 2
      ) {
        // 创建缩略图列表
        this.pageCount = body.pageCount
        this.firstImageURL = body.urls[this.cfg.imageSize] || body.urls.original

        // 缩略图列表的结构： div > ul > li > img + a
        this.viewerWarpper = document.createElement('div')
        this.viewerUl = document.createElement('ul')
        this.viewerUl.classList.add('beautify_scrollbar')
        this.viewerWarpper.appendChild(this.viewerUl)
        this.viewerWarpper.style.display = 'none'

        // 生成 UL 里面的缩略图列表
        let html: string[] = []
        for (let index = 0; index < body.pageCount; index++) {
          const thumb = Tools.convertThumbURLTo540px(
            body.urls.thumb.replace('p0', 'p' + index)
          )
          const imgUrl = this.firstImageURL.replace('p0', 'p' + index)
          const imageName = imgUrl.split('/').pop()
          // img 的 alt 属性会在 viewer 的 title 里显示为图片名称
          const str = `<li data-index="${index}">
              <img src="${thumb}" data-src="${imgUrl}" alt="${imageName}" />
              <a href="${window.location.href}"></a>
            </li>`
          html.push(str)
        }
        this.viewerUl.innerHTML = html.join('')
      }

      return resolve(this.viewerWarpper)
    })
  }

  // 配置图片查看器
  private configureViewer() {
    const setIndex = (index: number) => {
      this.index = index
    }

    // 图片查看器显示之后
    this.viewerUl.addEventListener('shown', () => {
      this.show = true
      // 添加自定义的按钮
      this.addOneToOneBtn()
      this.addBookmarkBtn()
      this.addCopyBtn()
      this.addDownloadCurrentImageBtn()
      this.addDownloadBtn()

      // 如果图片数量只有 1 个，则不显示缩略图一栏
      const navbar = document.querySelector('.viewer-navbar') as HTMLDivElement
      if (navbar) {
        // 设置不透明度为 0，这样它依然会占据空间，不会导致工具栏下移
        navbar.style.opacity = this.pageCount > 1 ? '1' : '0'
      }
    })

    // 退出图片查看器时（可能尚未完全退出）
    this.viewerUl.addEventListener('hide', () => {
      this.show = false
    })

    // 查看每一张图片时，如果处于 1:1 模式，就把图片缩放到 100%
    // viewed 事件是图片加载完成时触发的
    this.viewerUl.addEventListener('viewed', () => {
      if (this.isOriginalSize) {
        this.setOriginalSize()
      }
    })

    // 因为选项里的 size 是枚举类型，所以在这里也要定义一个枚举
    enum ToolbarButtonSize {
      Small = 'small',
      Medium = 'medium',
      Large = 'large',
    }

    // 配置新的看图组件
    const handleToTop = this.moveToTop.bind(this)
    const pageCount = this.pageCount
    const firstImageURL = this.firstImageURL
    const option: Viewer.Options = {
      toolbar: {
        zoomIn: 0,
        zoomOut: 0,
        oneToOne: 0,
        reset: 0,
        prev: 1,
        play: {
          show: 0,
          size: ToolbarButtonSize.Large,
        },
        next: 1,
        rotateLeft: 0,
        rotateRight: 0,
        flipHorizontal: 0,
        flipVertical: 0,
      },

      url(image: HTMLImageElement) {
        return image.dataset.src!
      },

      view(ev) {
        setIndex(ev.detail.index)
      },

      viewed(ev) {
        handleToTop()
        // 当图片显示完成（加载完成）后，预加载下一张图片
        let index = ev.detail.index

        if (index < pageCount - 1) {
          index++
        }

        const nextImg = firstImageURL.replace('p0', 'p' + index)
        const img = new Image()
        img.src = nextImg
      },

      // 取消一些动画，比如切换图片时，图片从小变大出现的动画
      transition: false,
      keyboard: true,
      // 显示 title（图片名和宽高信息）
      title: true,
      // 不显示缩放比例
      tooltip: false,
    }
    // initialViewIndex 在有值的时候才能设置。如果没有值就设置的话会出错
    if (this.cfg.initialViewIndex !== undefined) {
      option.initialViewIndex = this.cfg.initialViewIndex
    }

    this.myViewer = new Viewer(this.viewerUl, option)

    // 预加载第一张图片
    const img = new Image()
    img.src = firstImageURL

    if (this.cfg.autoStart) {
      this.myViewer.show()
    }
  }

  // 设置原始尺寸显示
  private setOriginalSize() {
    if (this.isOriginalSize) {
      // 1:1 显示图片
      this.myViewer.zoomTo(1)
      this.moveToTop()
    } else {
      // 缩小图片以适应可视区域
      const w = this.myViewer.image.naturalWidth
      const h = this.myViewer.image.naturalHeight
      const vw = this.myViewer.viewerData.width * 0.9
      const vh = this.myViewer.viewerData.height * 0.9
      const wScale = vw / w
      const hScale = vh / h
      let scale = Math.min(wScale, hScale)
      if (scale >= 1) {
        return
      }
      this.myViewer.zoomTo(scale)

      const nowTop = Number.parseInt(this.myViewer.image.style.marginTop)
      this.myViewer.move(0, vh * 0.05 - nowTop)
    }
  }

  // 如果图片的高度超出可视区域高度，则从图片的顶部开始显示
  private moveToTop() {
    const img = this.myViewer.image as HTMLImageElement
    const windowHeight = window.innerHeight
    if (img.height <= windowHeight) {
      return
    }
    // 如果图片高度大于视口高度，让它从顶部显示
    // 目的是把图片的 marginTop 设为 0，但不能直接修改 marginTop，否则鼠标拖动图片时会抖动
    const nowTop = Number.parseInt(this.myViewer.image.style.marginTop)
    this.myViewer.move(0, 0 - nowTop)
  }

  /**在图片查看器的工具栏里添加按钮
   *
   * 元素必须具有 id 属性，用于区分
   */
  private addBtn(btn: HTMLElement) {
    // 最后的查看器元素就是最新添加的查看器
    const allContainer = document.querySelectorAll('.viewer-container')
    const last = allContainer[allContainer.length - 1]

    const test = last.querySelector('#' + btn.id)
    if (test) {
      return
    }

    const toolbar = last.querySelector('.viewer-toolbar ul')
    if (toolbar) {
      toolbar.append(btn)
      return btn
    } else {
      console.error('Add btn failed')
    }
  }

  // 添加 1:1 按钮
  private addOneToOneBtn() {
    const li = document.createElement('li')
    li.setAttribute('role', 'button')
    li.setAttribute('title', lang.transl('_原始尺寸') + ' (F)')
    li.classList.add(this.addBtnClass)
    li.textContent = '1:1'
    li.id = 'imageViewer1To1Btn'
    this.addBtn(li)

    li.addEventListener('click', () => {
      this.isOriginalSize = !this.isOriginalSize
      this.setOriginalSize()
    })
  }

  // 添加下载这个作品的按钮
  private addDownloadBtn() {
    const li = document.createElement('li')
    li.setAttribute('role', 'button')
    li.setAttribute('title', lang.transl('_下载这个作品') + ' (D)')
    li.classList.add(this.addBtnClass)
    li.textContent = '↓↓↓'
    li.id = 'imageViewerDownloadBtn'
    this.addBtn(li)

    li.addEventListener('click', () => {
      this.download()
    })
  }

  // 添加下载当前查看的图片的按钮
  private addDownloadCurrentImageBtn() {
    const li = document.createElement('li')
    li.setAttribute('role', 'button')
    li.setAttribute('title', lang.transl('_下载这张图片') + ' (C)')
    li.classList.add(this.addBtnClass)
    li.textContent = '↓'
    li.id = 'imageViewerDownloadCurrentImageBtn'
    this.addBtn(li)

    li.addEventListener('click', () => {
      this.download(this.index)
    })
  }

  private copy() {
    copyWorkInfo.receive(
      {
        id: this.cfg.workId,
        type: 'illusts',
      },
      this.index
    )
  }

  // 添加复制按钮
  private addCopyBtn() {
    const li = document.createElement('li')
    li.setAttribute('role', 'button')
    li.setAttribute('title', lang.transl('_复制摘要数据'))
    li.classList.add(this.addBtnClass)
    li.textContent = '↓'
    li.id = 'imageViewerCopyBtn'
    li.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-copy"></use>
</svg>`
    this.addBtn(li)

    li.addEventListener('click', this.copy.bind(this))
  }

  // 添加收藏按钮
  private addBookmarkBtn() {
    const li = document.createElement('li')
    li.setAttribute('role', 'button')
    li.setAttribute('title', lang.transl('_收藏') + ' (Alt + B)')
    li.classList.add(this.addBtnClass)
    // 这个五角星显示的比较小，需要单独加大字号
    li.style.fontSize = '20px'
    li.textContent = '✩'
    li.id = 'imageViewerBookmarkBtn'
    this.addBtn(li)

    li.addEventListener('click', async () => {
      // 添加收藏
      this.addBookmark()

      // 下载这个作品
      downloadOnClickBookmark.send(this.workData!.body.illustId)
    })
  }

  private async addBookmark() {
    // 显示提示
    toast.show(lang.transl('_收藏'), {
      bgColor: Colors.bgBlue,
    })

    const status = await bookmark.add(
      this.cfg.workId,
      'illusts',
      Tools.extractTags(this.workData!)
    )

    if (status === 200) {
      toast.success(lang.transl('_已收藏'))
    }

    if (status === 403) {
      toast.error(`403 Forbidden, ${lang.transl('_你的账号已经被Pixiv限制')}`)
    }
  }

  /**下载当前查看的作品。如果传入参数 p，则只下载指定的这张图片 */
  private download(p?: number) {
    if (this.workData && this.workData.body.id === this.cfg.workId) {
      if (p !== undefined) {
        if (this.workData!.body.pageCount > 1) {
          store.setDownloadOnlyPart(Number.parseInt(this.cfg.workId), [
            this.index,
          ])
        }
      }

      EVT.fire('crawlIdList', [
        {
          id: this.cfg.workId,
          type: 'illusts',
        },
      ])
    }
  }
}

export { ImageViewer }
