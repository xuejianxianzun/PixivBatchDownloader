// 图片查看器
/// <reference path = "./Viewer.d.ts" />
import { API } from './API'
import { EVT } from './EVT'
import { lang } from './Lang'
import { theme } from './Theme'

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
  insertPostion: InsertPosition,
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
}

// 可选参数
interface ConfigOptional {
  workId?: string
  showImageList?: boolean
  imageListId?: string
  insertTarget?: string
  insertPostion?: InsertPosition,
  imageNumber?: number
  imageSize?: 'original' | 'regular' | 'small'
  showDownloadBtn?: boolean
  autoStart?: boolean
}

// 对 Viewer 进行修改以供下载器使用
// 原版是接收页面上已存在的缩略图列表，但在下载器里它需要从作品 id 获取数据，生成缩略图列表
class ImgViewer {
  constructor(cfg: ConfigOptional) {
    this.cfg = Object.assign(this.cfg, cfg)
    this.init()
  }

  private myViewer!: Viewer // 查看器
  private viewerWarpper: HTMLDivElement = document.createElement('div') // 图片列表的容器
  private viewerUl: HTMLUListElement = document.createElement('ul') // 图片列表的 ul 元素

  // 默认配置
  private cfg: Config = {
    workId: API.getIllustId(),
    showImageList: false,
    imageListId: '',
    insertTarget: '',
    insertPostion: 'beforeend',
    imageNumber: 2,
    imageSize: 'original',
    showDownloadBtn: false,
    autoStart: false
  }

  private readonly viewerWarpperFlag = 'viewerWarpperFlag'
  private readonly downloadBtnClass = 'viewer-download-btn'

  private init() {
    // 当创建新的查看器实例时，删除旧的查看器元素。其实不删除也没有问题，但是查看器每初始化一次都会创建全新的对象，所以旧的对象没必要保留。

    // 删除之前创建的图片列表，否则旧的图片列表依然存在
    const oldViewerWarpper = document.querySelector('.' + this.viewerWarpperFlag)
    oldViewerWarpper && oldViewerWarpper.remove()

    // 删除旧的查看器的 DOM 节点
    const oldViewerContainer = document.querySelector('.viewer-container')
    oldViewerContainer && oldViewerContainer.remove()

    this.createImageList()

    this.bindEvent()
  }

  // 如果多次初始化查看器，这些事件会被多次绑定。但是因为回调函数内部判断了查看器实例，所以不会有问题
  private bindEvent() {
    document.addEventListener('keyup', (event) => {
      if (event.code === 'Escape') {
        this.myViewer && this.myViewer.hide()
      }
    })

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

    let useBigURL = ''  // 查看大图时的第一张图片的 url

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

    // 获取作品数据，生成缩略图列表
    const data = await API.getArtworkData(this.cfg.workId)
    const body = data.body
    // 处理插画、漫画、动图作品，不处理其他类型的作品
    if (body.illustType === 0 || body.illustType === 1 || body.illustType === 2) {
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
      if (this.cfg.showDownloadBtn) {
        this.addDownloadBtn()
      }

      // 显示相关元素
      this.showViewerOther()

      // 点击 1：1 按钮时，全屏查看
      document
        .querySelector('.viewer-one-to-one')!
        .addEventListener('click', () => {
          this.hideViewerOther() // 隐藏查看器的其他元素
          // 进入全屏
          document.body.requestFullscreen()

          // 使图片居中显示，必须加延迟
          window.setTimeout(() => {
            this.setViewerCenter()
          }, 100)

          window.setInterval(() => {
            this.zoomToMax()
          }, 100)
        })
    })

    // 全屏状态下，查看和切换图片时，显示比例始终为 100%
    this.viewerUl.addEventListener('view', () => {
      if (this.isFullscreen()) {
        window.setTimeout(() => {
          // 通过点击 1:1 按钮，调整为100%并居中。这里必须要加延时，否则点击的时候图片还是旧的
          ; (document.querySelector(
            '.viewer-one-to-one'
          ) as HTMLLIElement).click()
        }, 50)
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
      // 取消键盘支持，主要是用键盘左右方向键切换的话，会和 pixiv 页面产生冲突。（pixiv 页面上，左右方向键会切换作品）
      keyboard: false,
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
      li.setAttribute('title', lang.transl('_下载'))
      li.classList.add(this.downloadBtnClass)
      li.textContent = '↓'
      const btn = one2one.insertAdjacentElement('afterend', li)!

      btn.addEventListener('click', () => {
        // 点击下载按钮时，发送要下载的作品 id
        EVT.fire(EVT.list.downloadIdList, [
          {
            id: this.cfg.workId,
            type: 'unknown'
          }
        ])

        // 显示简单的动画效果
        btn.classList.add('rotate360')
        window.setTimeout(() => {
          btn.classList.remove('rotate360')
        }, 1000)
      })
    }
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
    const downloadBtn = document.querySelector('.' + this.downloadBtnClass) as HTMLLIElement
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
    const downloadBtn = document.querySelector('.' + this.downloadBtnClass) as HTMLLIElement
    for (const element of [close, oneToOne, navbar, downloadBtn]) {
      if (element) {
        element.style.display = 'block'
      }
    }
  }

  private zoomToMax() {
    const img = document.querySelector('.viewer-move') as HTMLImageElement
    if (this.isFullscreen() && parseInt(img.style.width!) < img.naturalWidth) {
      // img.style.width=img.naturalWidth+'px'
      // img.style.height = img.naturalHeight+'px'
      this.myViewer.zoomTo(1)
    }
  }

  // 在图片100%显示时，使其居中
  private setViewerCenter() {
    // 获取图片宽高
    const imgInfo = document.querySelector('.viewer-title')!.textContent

    // 如果图片尚未加载出来的话，就没有内容，就过一会儿再执行
    if (!imgInfo) {
      window.setTimeout(() => {
        this.setViewerCenter()
      }, 200)
      return
    }

    const [imgWidth, imgHeight] = /\d{1,5} × \d{1,5}/
      .exec(imgInfo)![0]
      .split(' × ')
    // > '66360324_p5_master1200.jpg (919 × 1300)'
    // < ["919", "1300"]

    // 获取网页宽高
    const htmlWidth = document.documentElement.clientWidth
    const htmlHeight = document.documentElement.clientHeight

    // 设置边距
    const setWidth = (htmlWidth - parseInt(imgWidth)) / 2
    let setHeight = (htmlHeight - parseInt(imgHeight)) / 2

    // 当图片高度大于浏览器窗口高度时，居顶显示而不是居中
    // if (setHeight < 0) {
    //   setHeight = 0
    // }

    this.myViewer.zoomTo(1)
    this.myViewer.moveTo(setWidth, setHeight)
  }

  // 判断是否处于全屏状态
  private isFullscreen() {
    return !!document.fullscreenElement
  }

  // 判断看图器是否处于显示状态
  private viewerIsShow() {
    const viewerContainer = document.querySelector('.viewer-container')

    if (viewerContainer) {
      return viewerContainer.classList.contains('viewer-in')
    } else {
      return false
    }
  }
}

export { ImgViewer }
