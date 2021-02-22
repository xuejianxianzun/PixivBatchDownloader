// 图片查看器
/// <reference path = "./Viewer.d.ts" />
import { API } from './utils/API'
import { EVT } from './EVT'
import { lang } from './Lang'
import { theme } from './Theme'
import { loading } from './Loading'
import { states } from './States'
import { toast } from './Toast'
import { Tools } from './tools/Tools'

// 所有参数
interface Config {
  // 作品 id
  // 默认从 url 中获取作品 id，但要考虑到获取 id 失败的情况
  workId: string
  // 是否显示缩略图列表
  // 默认为 false，不会把缩略图列表添加到页面上
  // 如果需要显示缩略图列表供用户查看，则应为 true
  showImageList: boolean
  // 图片列表容器的 id
  // 默认为空字符串
  // 对于图片查看器来说没有任何作用。如果需要获取图片列表容器，或者使用 css 控制样式，可以传入 id 作为标记
  imageListId: string
  // 图片列表要插入到的父元素的选择器
  // 默认为空字符串
  // showImageList 为 false 时可以省略，为 true 时必需
  insertTarget: string
  // 插入到父元素的什么位置
  // 默认为 beforeend
  // showImageList 为 false 时可以省略，为 true 时必需
  insertPostion: InsertPosition
  // 图片最少有多少张时 >= 才会启用查看器
  // 默认为 2
  imageNumber: number
  // 查看大图时，显示哪种尺寸的图片
  // 默认为 original
  imageSize: 'original' | 'regular' | 'small'
  // 查看大图时，是否显示下载按钮
  // 默认为 false
  showDownloadBtn: boolean
  // 初始化之后，直接启动查看器，无需用户点击缩略图
  // 默认为 false
  // showImageList 为 false 时建议 autoStart 为 true
  autoStart: boolean
  // 获取作品数据期间，是否显示 loading 动画
  // 默认为 false
  showLoading: boolean
}

// 可选参数
interface ConfigOptional {
  workId?: string
  showImageList?: boolean
  imageListId?: string
  insertTarget?: string
  insertPostion?: InsertPosition
  imageNumber?: number
  imageSize?: 'original' | 'regular' | 'small'
  showDownloadBtn?: boolean
  autoStart?: boolean
  showLoading?: boolean
}

// 对 Viewer 进行修改以供下载器使用
// 原版是接收页面上已存在的缩略图列表，但在下载器里它需要从作品 id 获取数据，生成缩略图列表
class ImageViewer {
  constructor(cfg: ConfigOptional) {
    this.cfg = Object.assign(this.cfg, cfg)
    this.init()
  }

  private myViewer!: Viewer // 查看器
  private viewerWarpper: HTMLDivElement = document.createElement('div') // 图片列表的容器
  private viewerUl: HTMLUListElement = document.createElement('ul') // 图片列表的 ul 元素

  private show = false // 当前查看器实例是否处于显示状态

  private scrollX = 0
  private scrollY = 0

  // 默认配置
  private cfg: Config = {
    workId: Tools.getIllustId(),
    showImageList: false,
    imageListId: '',
    insertTarget: '',
    insertPostion: 'beforeend',
    imageNumber: 2,
    imageSize: 'original',
    showDownloadBtn: false,
    autoStart: false,
    showLoading: false,
  }

  private readonly viewerWarpperFlag = 'viewerWarpperFlag'
  private readonly downloadBtnClass = 'viewer-download-btn'

  private init() {
    // 当创建新的查看器实例时，删除旧的查看器元素。其实不删除也没有问题，但是查看器每初始化一次都会创建全新的对象，所以旧的对象没必要保留。

    // 删除之前创建的图片列表，否则旧的图片列表依然存在
    const oldViewerWarpper = document.querySelector(
      '.' + this.viewerWarpperFlag
    )
    oldViewerWarpper && oldViewerWarpper.remove()

    // 删除旧的查看器的 DOM 节点
    const oldViewerContainer = document.querySelector('.viewer-container')
    oldViewerContainer && oldViewerContainer.remove()

    this.createImageList()

    this.bindEvents()
  }

  // 如果多次初始化查看器，这些事件会被多次绑定。但是因为回调函数内部判断了查看器实例，所以不会有问题
  private bindEvents() {
    // 按 F 进入/退出全屏模式
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyF') {
        if (this.show) {
          this.isFullscreen()
            ? document.exitFullscreen()
            : this.enterFullScreenMode()
        }
      }
    })

    // 按 D 下载当前作品
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyD') {
        if (this.show) {
          this.download()
        }
      }
    })

    // 监听左右方向键，防止在看图时，左右方向键导致 Pixiv 切换作品
    window.addEventListener(
      'keydown',
      (event) => {
        if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
          if (this.show) {
            // 阻止事件冒泡
            event.stopPropagation()
            // 控制切换到上一张或者下一张
            // true 表示启用循环切换
            event.code === 'ArrowLeft'
              ? this.myViewer.prev(true)
              : this.myViewer.next(true)
          }
        }
      },
      true
    )
    ;[
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
    ].forEach((arg) => {
      // 检测全屏状态变化，目前有兼容性问题（这里也相当于绑定了按 esc 退出的事件）
      document.addEventListener(arg, () => {
        // 退出全屏
        if (this.myViewer && !this.isFullscreen()) {
          this.showViewerOther()
        }
      })
    })
  }

  // 创建缩略图列表
  private async createImageList() {
    if (this.cfg.showImageList) {
      // 如果要显示缩略图列表，则等待要插入的容器元素生成
      if (!document.querySelector(this.cfg.insertTarget)) {
        window.setTimeout(() => {
          this.createImageList()
        }, 300)
        return
      }
    }

    let useBigURL = '' // 查看大图时的第一张图片的 url

    // 查看器图片列表元素的结构： div > ul > li > img
    // 创建图片列表的容器
    this.viewerWarpper = document.createElement('div')
    this.viewerWarpper.classList.add(this.viewerWarpperFlag)
    this.viewerUl = document.createElement('ul')
    this.viewerWarpper.appendChild(this.viewerUl)
    this.viewerWarpper.style.display = 'none'

    if (this.cfg.imageListId) {
      this.viewerWarpper.id = this.cfg.imageListId
    }

    if (this.cfg.showLoading) {
      loading.show = true
    }

    // 获取作品数据，生成缩略图列表
    const data = await API.getArtworkData(this.cfg.workId)
    const body = data.body
    // 处理插画、漫画、动图作品，不处理其他类型的作品
    if (
      body.illustType === 0 ||
      body.illustType === 1 ||
      body.illustType === 2
    ) {
      // 如果图片数量达到指定值，则会创建创建缩略图，启用查看器
      if (body.pageCount >= this.cfg.imageNumber) {
        // 配置大图 url
        useBigURL = body.urls[this.cfg.imageSize] || body.urls.original

        // 生成缩略图列表
        let html = []
        for (let index = 0; index < body.pageCount; index++) {
          const str = `<li><img src="${body.urls.thumb.replace(
            'p0',
            'p' + index
          )}" data-src="${useBigURL.replace('p0', 'p' + index)}"></li>`
          html.push(str)
        }
        this.viewerUl.innerHTML = html.join('')
      } else {
        return
      }
    } else {
      return
    }

    if (this.cfg.showLoading) {
      loading.show = false
    }

    if (this.cfg.showImageList) {
      // 把缩略图列表添加到页面上
      theme.register(this.viewerWarpper)

      this.viewerWarpper.style.display = 'block'

      const target = document.querySelector(this.cfg.insertTarget)
      if (target) {
        target.insertAdjacentElement('beforebegin', this.viewerWarpper)
      }
    }

    this.configureViewer(body.pageCount, useBigURL)
  }

  // 配置图片查看器
  private async configureViewer(pageCount: number, firstBigImgURL: string) {
    // 图片查看器显示之后
    this.viewerUl.addEventListener('shown', () => {
      this.show = true

      this.scrollX = window.scrollX
      this.scrollY = window.scrollY

      if (this.cfg.showDownloadBtn) {
        this.addDownloadBtn()
      }

      // 显示相关元素
      this.showViewerOther()

      // 点击 1：1 按钮时，全屏查看
      document
        .querySelector('.viewer-one-to-one')!
        .addEventListener('click', () => {
          this.enterFullScreenMode()
        })
    })

    // 退出图片查看器时（可能尚未完全退出）
    this.viewerUl.addEventListener('hide', () => {
      this.show = false
      // 如果查看图片时进入了全屏模式，退出全屏后页面就会滚动到最顶端。在这里让页面滚动到查看图片之前的位置
      window.scrollTo(this.scrollX, this.scrollY)
    })

    // 查看每一张图片时，如果处于全屏模式，就把图片缩放到 100%
    // viewed 事件是图片加载完成时触发的
    this.viewerUl.addEventListener('viewed', () => {
      if (this.isFullscreen()) {
        this.myViewer.zoomTo(1)
      }
    })

    // 隐藏查看器时，如果还处于全屏，则退出全屏
    this.viewerUl.addEventListener('hidden', () => {
      if (this.isFullscreen()) {
        document.exitFullscreen()
      }
    })

    // 销毁旧的看图组件
    // 目前不会复用查看器，所以不用销毁
    // if (this.myViewer) {
    //   this.myViewer.destroy()
    // }

    // 因为选项里的 size 是枚举类型，所以在这里也要定义一个枚举
    enum ToolbarButtonSize {
      Small = 'small',
      Medium = 'medium',
      Large = 'large',
    }

    // 配置新的看图组件
    this.myViewer = new Viewer(this.viewerUl, {
      toolbar: {
        zoomIn: 0,
        zoomOut: 0,
        oneToOne: 1,
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

      viewed(ev) {
        // 当图片显示完成（加载完成）后，预加载下一张图片
        let index = ev.detail.index

        if (index < pageCount - 1) {
          index++
        }

        const nextImg = firstBigImgURL.replace('p0', 'p' + index)
        const img = new Image()
        img.src = nextImg
      },

      // 取消一些动画，比如切换图片时，图片从小变大出现的动画
      transition: false,
      keyboard: true,
      // 不显示 title（图片名和宽高信息）
      title: false,
      // 不显示缩放比例
      tooltip: false,
    })

    // 预加载第一张图片
    const img = new Image()
    img.src = firstBigImgURL

    if (this.cfg.autoStart) {
      // 自动显示
      this.myViewer.show()
    }
  }

  // 进入全屏模式
  private enterFullScreenMode() {
    this.hideViewerOther()

    document.body.requestFullscreen()

    // 这里延迟一段时间再把图片放大到 100%
    // 这是因为进入全屏后，当前显示的这张图不会自动放大到 100%，所以需要对它执行一次放大。延迟时间不能太小
    ;[150, 300].forEach((time) => {
      window.setTimeout(() => {
        this.myViewer.zoomTo(1)
      }, time)
    })
  }

  // 在图片查看器里添加下载按钮
  private addDownloadBtn() {
    // 最后的查看器元素就是最新添加的查看器
    const allContainer = document.querySelectorAll('.viewer-container')
    const last = allContainer[allContainer.length - 1]

    const test = last.querySelector('.' + this.downloadBtnClass)
    if (test) {
      return
    }

    const one2one = last.querySelector('.viewer-one-to-one')
    if (one2one) {
      const li = document.createElement('li')
      li.setAttribute('role', 'button')
      li.setAttribute('title', lang.transl('_下载') + ' (D)')
      li.classList.add(this.downloadBtnClass)
      li.textContent = '↓'
      const btn = one2one.insertAdjacentElement('afterend', li)!

      // 点击下载按钮
      btn.addEventListener('click', () => {
        this.download()
      })
    }
  }

  // 下载当前查看的作品
  private download() {
    // 因为 downloadFromViewer 状态会影响后续下载行为，所以必须先判断 busy 状态
    if (states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    states.downloadFromViewer = true

    // 发送要下载的作品 id
    EVT.fire(EVT.list.downloadIdList, [
      {
        id: this.cfg.workId,
        type: 'unknown',
      },
    ])

    // 显示提示
    toast.show(lang.transl('_已发送下载请求'), {
      bgColor: '#333',
      position: 'mouse',
    })
  }

  // 判断是否处于全屏状态
  private isFullscreen() {
    return !!document.fullscreenElement
  }

  // 隐藏查看器的其他元素
  private hideViewerOther() {
    document
      .querySelector('.viewer-container')!
      .classList.add('black-background')
    // 隐藏底部的其他元素，仍然显示左右切换按钮
    const close = document.querySelector('.viewer-close') as HTMLDivElement
    const oneToOne = document.querySelector(
      '.viewer-one-to-one'
    ) as HTMLDivElement
    const navbar = document.querySelector('.viewer-navbar') as HTMLDivElement
    const downloadBtn = document.querySelector(
      '.' + this.downloadBtnClass
    ) as HTMLLIElement
    for (const element of [close, oneToOne, navbar, downloadBtn]) {
      if (element) {
        element.style.display = 'none'
      }
    }
  }

  // 显示查看器的其他元素
  private showViewerOther() {
    document
      .querySelector('.viewer-container')!
      .classList.remove('black-background')
    // 显示底部隐藏的元素
    const close = document.querySelector('.viewer-close') as HTMLDivElement
    const oneToOne = document.querySelector(
      '.viewer-one-to-one'
    ) as HTMLDivElement
    const navbar = document.querySelector('.viewer-navbar') as HTMLDivElement
    const downloadBtn = document.querySelector(
      '.' + this.downloadBtnClass
    ) as HTMLLIElement
    for (const element of [close, oneToOne, navbar, downloadBtn]) {
      if (element) {
        element.style.display = 'block'
      }
    }
  }
}

export { ImageViewer }
