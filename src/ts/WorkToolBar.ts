import { Config } from './Config'
import { EVT } from './EVT'
import { pageType } from './PageType'

// 在作品页面里，获取作品内容下方包含点赞、收藏、分享等按钮的工具栏元素
// 注意：处于自己的作品页面里的时候，是没有收藏和点赞按钮的
class WorkToolBar {
  constructor() {
    this.init()
    this.bindEvents()
  }

  private toolbar: HTMLDivElement | undefined // 工具栏容器
  private readonly flag = 'xzToolbar' // 在工具栏上添加的标记
  private pixivBMKDiv: HTMLDivElement | undefined // pixiv 的心形收藏按钮
  private likeBtn: HTMLButtonElement | HTMLDivElement | undefined // 点赞按钮

  private timer: number = 0 // 获取元素用的定时器

  private async init() {
    this.toolbar = undefined
    this.pixivBMKDiv = undefined
    this.likeBtn = undefined
    window.clearInterval(this.timer)

    if (
      pageType.type !== pageType.list.Artwork &&
      pageType.type !== pageType.list.Novel
    ) {
      return
    }

    this.timer = window.setInterval(() => {
      Config.mobile ? this.getElementsOnMobile() : this.getElementsOnDesktop()
    }, 300)
  }

  private bindEvents() {
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.init()
    })
  }

  private async getElementsOnDesktop() {
    // 获取工具栏
    const toolbarParent = document.querySelectorAll('main > section')
    for (const el of toolbarParent) {
      const test = el.querySelector('div>section')
      if (test) {
        const toolbar = test as HTMLDivElement
        if (!toolbar.classList.contains(this.flag)) {
          this.toolbar = toolbar
          toolbar.classList.add(this.flag)
          break
        }
      }
    }

    if (!this.toolbar) {
      return
    }

    // 获取心形收藏按钮的 div
    const total = this.toolbar.childElementCount
    // 心形收藏按钮是倒数第二个（从左往右数第二个）
    this.pixivBMKDiv =
      (this.toolbar.childNodes[total - 2] as HTMLDivElement) || undefined

    // 获取点赞按钮
    const btnList = this.toolbar.querySelectorAll('button')
    this.likeBtn = btnList[btnList.length - 1] || undefined

    // 全部获取完毕
    if (this.pixivBMKDiv && this.likeBtn) {
      window.clearInterval(this.timer)
      this.executionCB()
    }
  }

  private async getElementsOnMobile() {
    // 获取工具栏
    const toolbar = document.querySelector(
      '.work-interactions'
    ) as HTMLDivElement
    if (!toolbar) {
      return
    }
    this.toolbar = toolbar

    // 在移动端不要给工具栏添加自定义 class 名，因为切换页面时元素没重新生成，class 还在

    const divs = toolbar.querySelectorAll('div')
    if (divs.length !== 4) {
      return
    }
    // 只在正常模式下（有 4 个按钮）时工作
    // 如果在自己的作品页面里，就只有 1 个分享按钮

    // 获取心形收藏按钮的 div
    this.pixivBMKDiv = divs[1]

    // 获取点赞按钮
    this.likeBtn = divs[0]

    // 全部获取完毕
    if (this.pixivBMKDiv && this.likeBtn) {
      window.clearInterval(this.timer)
      this.executionCB()
    }
  }

  private callbackList: Function[] = []

  /**注册回调函数
   *
   * 当 WorkToolBar 模块获取到了所有需要的元素时，会执行回调函数，并把以下元素作为参数传入：
   *
   * toolbar, pixivBMKDiv, likeBtn */
  public register(cb: Function) {
    this.callbackList.push(cb)
  }

  private executionCB() {
    this.callbackList.forEach((cb) =>
      cb(this.toolbar, this.pixivBMKDiv, this.likeBtn)
    )
  }
}

const workToolBar = new WorkToolBar()
export { workToolBar }
