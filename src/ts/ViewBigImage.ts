import { EVT } from './EVT'
import { ImageViewer } from './ImageViewer'
import { settings } from './setting/Settings'
import { Tools } from './Tools'

// 在作品缩略图上显示放大按钮，点击按钮会调用图片查看器来查看大图
class ViewBigImage {
  constructor() {
    this.addBtn()
    this.bindEvents()
  }

  private btn!: HTMLButtonElement
  private btnId = 'ViewBigImageBtn'
  private btnSize: number[] = [32, 32]
  private hiddenBtnTimer = 0 // 使用定时器让按钮延迟消失。这是为了解决一些情况下按钮闪烁的问题
  private hiddenBtnDelay = 100

  private observer!: MutationObserver

  private currentWorkId = '' // 显示放大按钮时，保存触发事件的作品 id

  private doNotShowBtn = false // 当点击了放大按钮后，进入此状态，此状态中不会显示放大按钮
  // 此状态是为了解决这个问题：点击了放大按钮之后，按钮会被隐藏，隐藏之后，鼠标下方就是图片缩略图区域，这会触发缩略图的鼠标事件，导致放大按钮马上就又显示了出来。所以点击放大按钮之后设置这个状态，在其为 true 的期间不会显示放大按钮。过一段时间再把它复位。复位所需的时间很短，因为只要能覆盖这段时间就可以了：从隐藏放大按钮开始算起，到缩略图触发鼠标事件结束。

  // 作品缩略图的选择器
  // 注意不是选择整个作品区域，而是只选择缩略图区域
  private readonly selectors = [
    'div[width="136"]',
    'div[width="288"]',
    'div[width="184"]',
    'div[width="112"]',
    'div[width="104"]',
    'div[width="90"]',
    '._work',
    'figure > div',
  ]

  private addBtn() {
    const btn = document.createElement('button')
    btn.id = this.btnId
    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-fangda"></use>
</svg>`
    this.btn = document.body.appendChild(btn)
  }

  private bindEvents() {
    // 立即对作品缩略图绑定事件
    this.headleThumbnail(document.body)
    // 使用监视器，让未来出现的作品缩略图也绑定上事件
    this.createObserver(document.body)

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

        new ImageViewer({
          workId: this.currentWorkId,
          imageNumber: 1,
          imageSize: settings.magnifierSize,
          autoStart: true,
          showLoading: true,
        })
      }
    })
  }

  // 判断元素是否含有作品缩略图，如果找到了缩略图则为其绑定事件
  private headleThumbnail(parent: HTMLElement) {
    if (!parent.querySelectorAll) {
      return
    }

    // 遍历所有的选择器，为找到的元素绑定事件
    // 注意：有时候一个节点里会含有多种尺寸的缩略图，为了全部查找到它们，必须遍历所有的选择器。
    // 如果在查找到某个选择器之后，不再查找剩余的选择器，就会遗漏一部分缩略图。
    for (const selector of this.selectors) {
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
    }
  }

  private createObserver(target: HTMLElement) {
    this.observer = new MutationObserver((records) => {
      for (const record of records) {
        // 遍历被添加的元素
        if (record.addedNodes.length > 0) {
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
    return Tools.getIllustId(href)
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
    this.btn.style.left =
      window.pageXOffset +
      rect.left +
      (settings.magnifierPosition === 'left'
        ? 0
        : rect.width - this.btnSize[0]) +
      'px'
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
    }, 100)

    window.clearTimeout(this.hiddenBtnTimer)
    this.btn.style.display = 'none'
  }
}

const viewBigImage = new ViewBigImage()
export { viewBigImage }
