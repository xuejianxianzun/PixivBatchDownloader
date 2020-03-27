// 图片查看器类
/// <reference path = "./Viewer.d.ts" />
import { API } from './API'

class ImgViewer {
  private myViewer!: Viewer // 查看器
  private viewerUl: HTMLUListElement = document.createElement('ul') // 图片列表的 ul 元素
  private viewerWarpper: HTMLDivElement = document.createElement('div') // 图片列表的容器

  // 初始化图片查看器
  private newViewer(pageCount: number, firsturl: string) {
    // 因为选项里的 size 是枚举类型，所以在这里也要定义一个枚举
    enum ToolbarButtonSize {
      Small = 'small',
      Medium = 'medium',
      Large = 'large',
    }

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

        const nextImg = firsturl.replace('p0', 'p' + index)
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
  }

  // 初始化图片查看器
  public init() {
    // 检查图片查看器元素是否已经生成
    if (!document.getElementById('viewerWarpper')) {
      // 创建图片查看器
      this.createViewer()
    } else {
      // 更新数据
      this.updateViewer()
    }
  }

  // 创建图片查看器 html 元素，并绑定一些事件，这个函数只会在初始化时执行一次
  private createViewer() {
    if (!document.querySelector('main figcaption')) {
      // 等到作品主体部分的元素生成之后再创建查看器
      setTimeout(() => {
        this.createViewer()
      }, 300)
      return
    }

    // 查看器图片列表元素的结构： div#viewerWarpper > ul > li > img
    this.viewerWarpper = document.createElement('div')
    this.viewerWarpper.id = 'viewerWarpper'
    this.viewerUl = document.createElement('ul')
    this.viewerWarpper.appendChild(this.viewerUl)
    document
      .querySelector('main figcaption')!
      .insertAdjacentElement('beforebegin', this.viewerWarpper)

    // 图片查看器显示之后
    this.viewerUl.addEventListener('shown', () => {
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
          setTimeout(() => {
            this.setViewerCenter()
          }, 100)

          setInterval(() => {
            this.zoomToMax()
          }, 100)
        })
    })

    // 全屏状态下，查看和切换图片时，显示比例始终为 100%
    this.viewerUl.addEventListener('view', () => {
      if (this.isFullscreen()) {
        setTimeout(() => {
          // 通过点击 1:1 按钮，调整为100%并居中。这里必须要加延时，否则点击的时候图片还是旧的
          ;(document.querySelector(
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

    // esc 退出图片查看器
    document.addEventListener('keyup', (event) => {
      if (event.code === 'Escape') {
        // 按下 esc
        // 如果非全屏，且查看器已经打开，则退出查看器
        if (!this.isFullscreen() && this.viewerIsShow()) {
          ;(document.querySelector('.viewer-close') as HTMLDivElement).click()
        }
      }
    })

    void [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
    ].forEach((arg) => {
      // 检测全屏状态变化，目前有兼容性问题（这里也相当于绑定了按 esc 退出的事件）
      document.addEventListener(arg, () => {
        // 退出全屏
        if (!this.isFullscreen()) {
          this.showViewerOther()
        }
      })
    })

    this.updateViewer()
  }

  // 根据作品信息，更新图片查看器配置。每当页面更新时执行一次
  private async updateViewer() {
    this.viewerWarpper.style.display = 'none' // 先隐藏 viewerWarpper

    // 获取作品信息
    const data = await API.getWorksData(API.getIllustId())
    const thisOneData = data.body
    // 处理插画或漫画作品，不处理动图作品
    if (thisOneData.illustType === 0 || thisOneData.illustType === 1) {
      // 有多张图片时，创建缩略图
      if (thisOneData.pageCount > 1) {
        const { thumb, original } = thisOneData.urls
        this.viewerUl.innerHTML = new Array(thisOneData.pageCount)
          .fill(1)
          .reduce((html, now, index) => {
            return (html += `<li><img src="${thumb.replace(
              'p0',
              'p' + index
            )}" data-src="${original.replace('p0', 'p' + index)}"></li>`)
          }, '')

        // 数据更新后，显示 viewerWarpper
        this.viewerWarpper.style.display = 'block'

        // 销毁看图组件
        if (this.myViewer) {
          this.myViewer.destroy()
        }
        // 重新配置看图组件
        this.newViewer(thisOneData.pageCount, original)

        // 预加载第一张图片
        const img = new Image()
        img.src = original
      }
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
    for (const element of [close, oneToOne, navbar]) {
      element.style.display = 'none'
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
    for (const element of [close, oneToOne, navbar]) {
      element.style.display = 'block'
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
      setTimeout(() => {
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

const imgViewer = new ImgViewer()
export { imgViewer }
