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
  private likeBtn: HTMLButtonElement | undefined // 点赞按钮

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
      this.getElements()
    }, 300)
  }

  private bindEvents() {
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.init()
    })
  }

  private async getElements() {
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
    this.pixivBMKDiv =
      (this.toolbar.childNodes[2] as HTMLDivElement) || undefined

    // 获取点赞按钮
    const btnList = this.toolbar.querySelectorAll('button')
    this.likeBtn = btnList[btnList.length - 1] || undefined

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
