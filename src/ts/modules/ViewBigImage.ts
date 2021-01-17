import { EVT } from "./EVT"
import { pageType } from "./PageType"

// 从作品缩略图上点击查看大图
class ViewBigImage {
  constructor() {
    this.addBtn()
    this.bindEvent()
  }

  private btn!: HTMLButtonElement
  private btnId = 'ViewBigImageBtn'
  private btnSize: number[] = [32, 32]
  private hiddenBtnTimer = 0  // 使用定时器让按钮延迟消失。这是为了解决一些情况下按钮闪烁的问题
  private hiddenBtnDelay = 100

  private observer!: MutationObserver

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
    btn.innerHTML= `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-fangda"></use>
</svg>`
    document.body.appendChild(btn)
    this.btn = document.body.querySelector('#' + this.btnId)! as HTMLButtonElement
  }

  private bindEvent() {
    let contentRoot: HTMLElement | undefined = undefined
    for (const selector of this.allRootSelector) {
      const test = document.body.querySelector(selector)
      if (test) {
        contentRoot = test as HTMLElement
        break
      }
    }

    if (contentRoot) {
      this.createObserver(contentRoot)
      this.bindWorksEvent(document.body)
    }

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.hiddenBtn()
    })

    this.btn.addEventListener('mouseenter', () => {
      window.clearTimeout(this.hiddenBtnTimer)
    })

    this.btn.addEventListener('mouseleave', () => {
      this.hiddenBtn()
    })
  }

  private createObserver(target: HTMLElement) {
    this.observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.addedNodes.length > 0) {
          // 遍历被添加的元素
          for (const newEl of record.addedNodes) {
            this.bindWorksEvent(newEl as HTMLElement)
          }
        }
      }
    })
    this.observer.observe(target, {
      childList: true,
      subtree: true,
    })
  }

  private bindWorksEvent(parent: HTMLElement) {
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
          // console.log(el)
          this.showBtn(el)
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

  private showBtn(target: HTMLElement) {
    window.clearTimeout(this.hiddenBtnTimer)
    const rect = target.getBoundingClientRect()
    this.btn.style.left = window.pageXOffset + rect.left + rect.width - this.btnSize[0] + 'px'
    this.btn.style.top = window.pageYOffset + rect.top + 'px'
    this.btn.style.display = 'flex'
  }

  private hiddenBtn() {
    window.clearTimeout(this.hiddenBtnTimer)
    this.hiddenBtnTimer = window.setTimeout(() => {
      this.btn.style.display = 'none'
    }, this.hiddenBtnDelay)
  }
}

const viewBigImage = new ViewBigImage()
export { viewBigImage }