import { API } from "./API"
import { pageType } from "./PageType"
import { EVT } from "./EVT"
import { ImgViewer } from './ImgViewer'
import { settings } from "./setting/Settings"

// 在作品缩略图上显示放大按钮，点击按钮会调用图片查看器，查看大图
class ViewBigImage {
  constructor() {
    this.addBtn()
    this.bindEvents()
  }

  private btn!: HTMLButtonElement
  private btnId = 'ViewBigImageBtn'
  private btnSize: number[] = [32, 32]
  private hiddenBtnTimer = 0  // 使用定时器让按钮延迟消失。这是为了解决一些情况下按钮闪烁的问题
  private hiddenBtnDelay = 100

  private observer!: MutationObserver

  private currentWorkId = ''  // 显示放大按钮时，保存触发事件的作品 id

  private doNotShowBtn = false // 当点击了放大按钮后，进入此状态，此状态中不会显示放大按钮
  // 此状态是为了解决这个问题：点击了放大按钮之后，按钮会被隐藏，隐藏之后，鼠标下方就是图片缩略图区域，这会触发缩略图的鼠标事件，导致放大按钮马上就又显示了出来。所以点击放大按钮之后设置这个状态，在其为 true 的期间不会显示放大按钮。过一段时间再把它复位。复位所需的时间很短，因为只要能覆盖这段时间就可以了：从隐藏放大按钮开始算起，到缩略图触发鼠标事件结束。

  // 作品缩略图的选择器
  // 注意不是选择整个作品区域，而是只选择缩略图区域
  private readonly selectors: string[] = ['._work', 'figure > div', 'div[width="136"]', 'div[width="184"]', 'div[width="288"]',]

  // 页面主要内容区域的选择器
  private readonly allRootSelector: string[] = [
    '#root',  // 大部分页面使用
    '#wrapper', // 旧版收藏页面使用
    '#js-mount-point-discovery',  // 发现页面使用
  ]

  private addBtn() {
    const btn = document.createElement('button')
    btn.id = this.btnId
    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-fangda"></use>
</svg>`
    document.body.appendChild(btn)
    this.btn = document.body.querySelector('#' + this.btnId)! as HTMLButtonElement
  }

  private bindEvents() {
    // 查找页面主体内容的容器
    let contentRoot: HTMLElement | undefined = undefined
    for (const selector of this.allRootSelector) {
      const test = document.body.querySelector(selector)
      if (test) {
        contentRoot = test as HTMLElement
        break
      }
    }

    if (contentRoot) {
      // 对作品缩略图绑定事件
      this.headleThumbnail(document.body)
      // 使用监视器，让未来出现的作品缩略图也绑定上事件
      this.createObserver(contentRoot)
    }

    // 页面切换时隐藏按钮
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.hiddenBtn()
    })

    // 鼠标移入按钮时取消隐藏按钮
    this.btn.addEventListener('mouseenter', (ev) => {
      window.clearTimeout(this.hiddenBtnTimer)
    })

    // 鼠标移出按钮时隐藏按钮
    this.btn.addEventListener('mouseleave', () => {
      this.hiddenBtn()
    })

    // 点击按钮时初始化图片查看器
    this.btn.addEventListener('click', (ev) => {
      if (this.currentWorkId) {
        this.hiddenBtnNow()

        new ImgViewer({
          workId: this.currentWorkId,
          imageNumber: 1,
          imageSize: settings.magnifierSize,
          showDownloadBtn: true,
          autoStart: true,
          showLoading: true,
        })

      }
    })
  }

  // 判断元素是否含有作品缩略图，如果找到了缩略图则为其绑定事件
  private headleThumbnail(parent: HTMLElement) {
    // 有时候 parent 会是纯文本，所以需要判断
    if (!parent.querySelectorAll) {
      return
    }

    for (const selector of this.selectors) {
      // 在作品页面内不检查指定的选择器。因为这是作品大图区域
      if (pageType.type === 1 && selector === 'figure > div') {
        continue
      }

      const elements = parent.querySelectorAll(selector)
      for (const el of elements) {
        el.addEventListener('mouseenter', (ev) => {
          const el = ev.target as HTMLElement
          this.currentWorkId = this.findWorkId(el)
          if (this.currentWorkId) {
            this.showBtn(el)
          }
        })

        el.addEventListener('mouseleave', () => {
          this.hiddenBtn()
        })
      }

      if (elements.length > 0) {
        break
      }
    }
  }

  private createObserver(target: HTMLElement) {
    this.observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.addedNodes.length > 0) {
          // 遍历被添加的元素
          for (const newEl of record.addedNodes) {
            this.headleThumbnail(newEl as HTMLElement)
          }
        }
      }
    })
    this.observer.observe(target, {
      childList: true,
      subtree: true,
    })
  }

  // 从元素中查找作品 id
  private findWorkId(el: HTMLElement) {
    const a = el.querySelector('a')
    if (!a) {
      return ''
    }

    const href = (a as HTMLAnchorElement).href
    return API.getIllustId(href)
  }

  // 显示放大按钮
  private showBtn(target: HTMLElement) {
    if (this.doNotShowBtn) {
      return
    }
    if (!settings.magnifier) {
      return
    }

    window.clearTimeout(this.hiddenBtnTimer)
    const rect = target.getBoundingClientRect()
    this.btn.style.left = window.pageXOffset + rect.left + rect.width - this.btnSize[0] + 'px'
    this.btn.style.top = window.pageYOffset + rect.top + 'px'
    this.btn.style.display = 'flex'
  }

  // 延迟隐藏放大按钮
  private hiddenBtn() {
    window.clearTimeout(this.hiddenBtnTimer)
    this.hiddenBtnTimer = window.setTimeout(() => {
      this.btn.style.display = 'none'
    }, this.hiddenBtnDelay)
  }

  // 立刻隐藏放大按钮
  private hiddenBtnNow() {
    this.doNotShowBtn = true
    window.setTimeout(() => {
      this.doNotShowBtn = false
    }, 100);

    window.clearTimeout(this.hiddenBtnTimer)
    this.btn.style.display = 'none'
  }
}

const viewBigImage = new ViewBigImage()
export { viewBigImage }