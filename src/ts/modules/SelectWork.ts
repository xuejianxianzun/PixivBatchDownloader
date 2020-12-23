import { DOM } from './DOM'
import { Colors } from './Colors'
import { lang } from './Lang'
import { EVT } from './EVT'
import { states } from './States'
import { IDData } from './Store.d'

// 手动选择作品
class SelectWork {
  constructor() {
    if (!this.created && location.hostname.endsWith('.pixiv.net')) {
      this.created = true
      this.selector = this.createSelectorEl()
      this.addBtn()
      this.bindEvents()
    }
  }

  private created = false

  private selector?: HTMLElement // 用于选择作品的指示器
  private selectorId = 'selectWorkEl'
  private left = 0
  private top = 0
  private half = 10 // 指示器的一半宽度（用于设置位置）

  private _start = false
  private _pause = false
  private _tempHide = false // 打开下载面板时临时隐藏。这个变量只会影响选择器的 display

  get start() {
    return this._start
  }

  set start(bool: boolean) {
    this._start = bool
    this.updateSelectorEl()
    this.updateControlBtn()
  }

  get pause() {
    return this._pause
  }

  set pause(bool: boolean) {
    this._pause = bool
    this.updateSelectorEl()
    this.updateControlBtn()
  }

  get tempHide() {
    return this._tempHide
  }

  set tempHide(bool: boolean) {
    this._tempHide = bool
    this.updateSelectorEl()
  }

  private controlBtn: HTMLButtonElement = document.createElement('button') // 启动、暂停、继续选择的按钮
  private crawlBtn: HTMLButtonElement = document.createElement('button') // 抓取选择的作品的按钮，并且会退出选择模式

  private selectedWorkFlagClass = 'selectedWorkFlag' // 给已选择的作品添加标记时使用的 class
  private positionValue = ['relative', 'absolute', 'fixed'] // 标记元素需要父元素拥有这些定位属性

  private artworkReg = /artworks\/(\d{2,15})/
  private novelReg = /novel\/show\.php\?id=(\d{2,15})/

  private idList: IDData[] = []

  private crawlSelectedWork = false // 对选择的作品进行抓取时激活此标记。当触发下一次的抓取完成事件时，表示已经抓取了选择的作品，此时清空 id 列表。

  private bindClickEvent!: (ev: MouseEvent) => void | undefined
  private bindEscEvent!: (ev: KeyboardEvent) => void | undefined

  private bindEvents() {
    window.addEventListener(EVT.list.openCenterPanel, () => {
      this.tempHide = true
    })

    window.addEventListener(EVT.list.closeCenterPanel, () => {
      this.tempHide = false
    })

    // 当抓取完成时，如果抓取的是选择的作品，则清空 id 列表
    window.addEventListener(EVT.list.crawlFinish, () => {
      if (this.crawlSelectedWork) {
        this.crawlSelectedWork = false
        this.clearIdList()
      }
    })

    // 可以使用 Alt + S 快捷键来模拟点击控制按钮
    window.addEventListener('keydown', (ev) => {
      if (ev.altKey && ev.code === 'KeyS') {
        this.controlBtn.click()
      }
    })

    // 鼠标移动时保存鼠标的坐标
    window.addEventListener(
      'mousemove',
      (ev) => {
        this.moveEvent(ev)
      },
      true,
    )

    // 离开页面前，如果选择的作品没有抓取，则提示用户，并阻止用户直接离开页面
    window.onbeforeunload = () => {
      if (this.idList.length > 0) {
        EVT.sendMsg({
          msg: lang.transl('_离开页面前提示选择的作品未抓取'),
          type: 'error',
        })
        return false
      }
    }
  }

  private clearIdList() {
    // 清空标记需要使用 id 数据，所以需要执行之后才能清空 id
    this.removeAllSelectedFlag()
    this.idList = []
    this.updateCrawlBtn()
  }

  private createSelectorEl() {
    const el = document.createElement('div')
    el.id = this.selectorId
    document.body.appendChild(el)
    return el
  }

  private updateSelectorEl() {
    if (!this.selector) {
      return
    }

    const show = this.start && !this.pause && !this.tempHide

    this.selector.style.display = show ? 'block' : 'none'

    if (show) {
      this.selector.style.left = this.left - this.half + 'px'
      this.selector.style.top = this.top - this.half + 'px'
    }
  }

  private addBtn() {
    this.controlBtn = DOM.addBtn(
      'selectWorkBtns',
      Colors.green,
      lang.transl('_手动选择作品'),
    )
    this.updateControlBtn()

    this.crawlBtn = DOM.addBtn(
      'selectWorkBtns',
      Colors.blue,
      lang.transl('_抓取选择的作品'),
      [['style', 'display:none;']],
    )
    this.crawlBtn.addEventListener('click', (ev) => {
      this.downloadSelect()
    })
  }

  // 切换控制按钮的文字和点击事件
  private updateControlBtn() {
    if (!this.start) {
      this.controlBtn.textContent = lang.transl('_手动选择作品')
      this.controlBtn.onclick = (ev) => {
        this.startSelect(ev)
      }
    } else {
      if (!this.pause) {
        this.controlBtn.textContent = lang.transl('_暂停选择')
        this.controlBtn.onclick = (ev) => {
          this.pauseSelect()
        }
      } else {
        this.controlBtn.textContent = lang.transl('_继续选择')
        this.controlBtn.onclick = (ev) => {
          this.startSelect(ev)
        }
      }
    }
  }

  // 在选择作品的数量改变时，在抓取按钮上显示作品数量
  private updateCrawlBtn() {
    this.crawlBtn.style.display = this.start ? 'block' : 'none'
    if (this.idList.length > 0) {
      this.crawlBtn.textContent =
        lang.transl('_抓取选择的作品') + ` ${this.idList.length}`
    } else {
      this.crawlBtn.textContent = lang.transl('_抓取选择的作品')
    }
  }

  // 监听点击事件
  private clickEvent(ev: MouseEvent) {
    const workId = this.findWork((ev as any).path || ev.composedPath())

    if (workId) {
      // 如果点击的元素是作品元素，就阻止默认事件。否则会进入作品页面，导致无法在当前页面继续选择
      ev.preventDefault()
      // 如果点击的元素不是作品元素，就不做任何处理，以免影响用户体验

      const index = this.idList.findIndex((item) => {
        return item.id === workId.id && item.type === workId.type
      })
      // 这个 id 不存在于 idList 里
      if (index === -1) {
        this.idList.push(workId)

        this.addSelectedFlag(ev.target as HTMLElement, workId.id)
      } else {
        // id 已存在，则删除
        this.idList.splice(index, 1)

        this.removeSelectedFlag(workId.id)
      }

      this.updateCrawlBtn()
    }
  }

  // 监听鼠标移动
  private moveEvent(ev: MouseEvent) {
    this.left = ev.x
    this.top = ev.y
    this.updateSelectorEl()
  }

  // esc 暂停选择
  private escEvent(ev: KeyboardEvent) {
    if (ev.code === 'Escape') {
      this.pauseSelect()
    }
  }

  // 开始或继续选择
  private startSelect(ev: MouseEvent) {
    this.start = true

    if (this.pause) {
      // 如果之前暂停了，则继续选择。不清空之前的结果
      this.pause = false
    } else {
      // 如果是全新开始的选择，则清空之前的结果
      this.clearIdList()
    }

    this.bindClickEvent = this.clickEvent.bind(this)
    this.bindEscEvent = this.escEvent.bind(this)
    window.addEventListener('click', this.bindClickEvent, true)
    document.addEventListener('keyup', this.bindEscEvent)

    EVT.fire(EVT.list.closeCenterPanel)
  }

  private pauseSelect() {
    this.pause = true
    this.bindClickEvent &&
      window.removeEventListener('click', this.bindClickEvent, true)
    this.bindEscEvent &&
      document.removeEventListener('keyup', this.bindEscEvent)
  }

  // 抓取选择的作品，这会暂停选择
  private downloadSelect() {
    if (states.busy) {
      EVT.sendMsg({
        msg: lang.transl('_当前任务尚未完成'),
        type: 'error',
      })
      return
    }

    this.pauseSelect()

    if (this.idList.length > 0) {
      // 传递 id 列表时，将其转换成一个新的数组。否则传递的是引用，外部操作会影响到内部的 id 列表
      EVT.fire(EVT.list.downloadIdList, Array.from(this.idList))

      this.crawlSelectedWork = true
    } else {
      EVT.sendMsg({
        msg: lang.transl('_没有数据可供使用'),
        type: 'error',
      })
    }
  }

  // 从传递的元素中查找第一个作品 id
  private findWork(arr: HTMLElement[]): IDData | undefined {
    for (const el of arr) {
      // 查找所有 a 标签
      if (el.nodeName === 'A') {
        const href = (el as HTMLAnchorElement).href
        // 测试图片作品链接
        const test = this.artworkReg.exec(href)
        if (test && test[1]) {
          return {
            type: 'unknown',
            id: test[1],
          }
        }

        // 测试小说作品链接
        const test2 = this.novelReg.exec(href)
        if (test2 && test2[1]) {
          return {
            type: 'novels',
            id: test2[1],
          }
        }
      }
    }
  }

  // 当这次点击事件查找到一个作品时，添加一个标记
  private addSelectedFlag(el: HTMLElement, id: string) {
    const span = document.createElement('span')
    span.classList.add(this.selectedWorkFlagClass)
    span.dataset.id = id

    let target = el

    // 如果点击的元素处于 svg 里，则添加到 svg 外面。因为 svg 里面不会显示添加的标记
    // 这里的代码只能应对 svg 内只有一层子元素的情况。目前 pixiv 的作品列表都是这样
    if (el.nodeName === 'svg' || el.parentElement?.nodeName === 'svg') {
      target = el.parentElement as HTMLElement
    }
    target.insertAdjacentElement('beforebegin', span)

    // 如果父元素没有某些定位，就会导致标记定位异常。修复此问题
    if (target.parentElement) {
      const position = window.getComputedStyle(target.parentElement)['position']
      if (!this.positionValue.includes(position)) {
        target.parentElement.style.position = 'relative'
      }
    }
  }

  // 清空指定作品的标记
  private removeSelectedFlag(id: string) {
    const el = document.querySelector(
      `.${this.selectedWorkFlagClass}[data-id='${id}']`,
    )
    el && el.remove()
  }

  // 清空所有标记
  private removeAllSelectedFlag() {
    for (const item of this.idList) {
      this.removeSelectedFlag(item.id)
    }
  }
}

new SelectWork()
export {}
