import { Tools } from './Tools'
import { Colors } from './Colors'
import { lang } from './Lang'
import { EVT } from './EVT'
import { states } from './store/States'
import { IDData, WorkTypeString } from './store/StoreType'
import { toast } from './Toast'
import { msgBox } from './MsgBox'
import { Utils } from './utils/Utils'
import { artworkThumbnail } from './ArtworkThumbnail'
import { novelThumbnail } from './NovelThumbnail'
import { pageType } from './PageType'

// 手动选择作品，图片作品和小说都可以选择
class SelectWork {
  constructor() {
    const unlisted = pageType.type === pageType.list.Unlisted
    if (!this.created && Utils.isPixiv() && !unlisted) {
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
    states.selectWork = bool
    this.updateSelectorEl()
    this.updateControlBtn()
  }

  get pause() {
    return this._pause
  }

  set pause(bool: boolean) {
    this._pause = bool
    if (bool) {
      states.selectWork = false
    }
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
  private clearBtn: HTMLButtonElement = document.createElement('button') // 清空选择的作品的按钮

  private selectedWorkFlagClass = 'selectedWorkFlag' // 给已选择的作品添加标记时使用的 class
  private positionValue = ['relative', 'absolute', 'fixed'] // 标记元素需要父元素拥有这些定位属性

  // 不同页面里的作品列表容器的选择器可能不同，这里储存所有页面里会使用到的的选择器
  // root 是大部分页面通用的; js-mount-point-discovery 是发现页面使用的
  private worksWrapperSelectorList: string[] = [
    '#root',
    '#js-mount-point-discovery',
  ]
  // 储存当前页面使用的选择器
  private usedWorksWrapperSelector = this.worksWrapperSelectorList[0]
  // 储存当前页面的作品列表容器
  private worksWrapper: HTMLElement = document.body
  private ob: MutationObserver | undefined = undefined

  private idList: IDData[] = []

  private sendCrawl = false // 它用来判断抓取的是不是选择的作品。抓取选择的作品时激活此标记；当触发下一次的抓取完成事件时，表示已经抓取了选择的作品。
  private crawled = false // 是否已经抓取了选择的作品

  private readonly svg = `<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-select"></use>
</svg>`

  private bindEscEvent!: (ev: KeyboardEvent) => void | undefined

  private bindEvents() {
    artworkThumbnail.onClick((el: HTMLElement, id: string, ev: Event) => {
      this.clickThumbnail(el, id, ev, 'illusts')
    })

    novelThumbnail.onClick((el: HTMLElement, id: string, ev: Event) => {
      this.clickThumbnail(el, id, ev, 'novels')
    })

    document.body.addEventListener(
      'click',
      (ev: Event) => {
        this.clickElement(ev.target as HTMLElement, ev)
      },
      true
    )

    window.addEventListener(EVT.list.openCenterPanel, () => {
      this.tempHide = true
    })

    window.addEventListener(EVT.list.closeCenterPanel, () => {
      this.tempHide = false
    })

    window.addEventListener(EVT.list.crawlFinish, () => {
      if (this.sendCrawl) {
        this.sendCrawl = false
        this.crawled = true
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
      true
    )

    // 离开页面前提示用户
    // 如果把此处的 window.onbeforeunload 换成 window.addEventListener('beforeunload') 会出现问题
    // 浏览器不会弹出询问对话框，而是直接关闭页面
    window.onbeforeunload = () => {
      // 如果存在选择的作品，并且选择的作品（全部或部分）没有被抓取，则进行提示
      if (this.idList.length > 0 && !this.crawled) {
        msgBox.error(lang.transl('_离开页面前提示选择的作品未抓取'), {
          btn: lang.transl('_我知道了'),
        })
        return false
      }
    }

    // 每次页面切换之后，查找新的作品列表容器并保存
    window.addEventListener(EVT.list.pageSwitch, () => {
      let worksWrapper: HTMLElement | null = null
      for (const selector of this.worksWrapperSelectorList) {
        worksWrapper = document.querySelector(selector)
        if (worksWrapper) {
          this.usedWorksWrapperSelector = selector
          break
        }
      }
      this.worksWrapper = worksWrapper || document.body
    })

    // 每次页面切换之后，查找新显示的作品里是否有之前被选择的作品，如果有则为其添加标记
    // 因为 pixiv 的页面切换会导致作品列表变化，之前添加的标记也就没有了，需要重新添加
    window.addEventListener(EVT.list.pageSwitch, () => {
      // 每次触发时都要断开之前绑定的观察器，否则会导致事件重复绑定
      // 因为 pageSwitch 事件可能会触发多次，如果不断开之前的观察器，那么每切换一次页面就会多绑定和执行一个回调
      this.ob && this.ob.disconnect()

      this.ob = new MutationObserver(
        Utils.debounce(() => {
          this.reAddAllFlag()
        }, 300)
      )

      this.ob.observe(this.worksWrapper, {
        childList: true,
        subtree: true,
      })
    })
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

    const show = this.canSelect() && !this.tempHide

    this.selector.style.display = show ? 'block' : 'none'
    // 设置元素的 style 时，如果新的值和旧的值相同（例如：每次都设置 display 为 none），Chrome 会自动优化，此时不会导致节点发生变化。

    // 如果选择器处于隐藏状态，就不会更新其坐标。这样可以优化性能
    if (show) {
      this.selector.style.left = this.left - this.half + 'px'
      this.selector.style.top = this.top - this.half + 'px'
    }
  }

  private addBtn() {
    this.controlBtn = Tools.addBtn(
      'selectWorkBtns',
      Colors.bgGreen,
      '_手动选择作品'
    )
    this.controlBtn.setAttribute('title', 'Alt + S')
    this.updateControlBtn()

    this.clearBtn = Tools.addBtn(
      'selectWorkBtns',
      Colors.bgRed,
      '_清空选择的作品'
    )
    this.clearBtn.style.display = 'none'
    this.clearBtn.addEventListener('click', () => {
      this.clearIdList()
    })

    this.crawlBtn = Tools.addBtn(
      'selectWorkBtns',
      Colors.bgBlue,
      '_抓取选择的作品'
    )
    this.crawlBtn.style.display = 'none'
    this.crawlBtn.addEventListener('click', (ev) => {
      this.sendDownload()
    })
  }

  // 切换控制按钮的文字和点击事件
  private updateControlBtn() {
    if (!this.start) {
      lang.updateText(this.controlBtn, '_手动选择作品')
      this.controlBtn.onclick = (ev) => {
        this.startSelect(ev)
        this.clearBtn.style.display = 'block'
      }
    } else {
      if (!this.pause) {
        lang.updateText(this.controlBtn, '_暂停选择')
        this.controlBtn.onclick = (ev) => {
          this.pauseSelect()
        }
      } else {
        lang.updateText(this.controlBtn, '_继续选择')
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
      lang.updateText(
        this.crawlBtn,
        '_抓取选择的作品2',
        this.idList.length.toString()
      )
    } else {
      lang.updateText(this.crawlBtn, '_抓取选择的作品')
    }
  }

  private addId(el: HTMLElement, id: string, type: WorkTypeString) {
    const index = this.idList.findIndex((item) => {
      return item.id === id && item.type === type
    })
    // 添加这个 id
    if (index === -1) {
      this.idList.push({
        id,
        type,
      })
      this.crawled = false
      this.addSelectedFlag(el, id)
    } else {
      // id 已存在，则删除
      this.idList.splice(index, 1)
      this.removeSelectedFlag(id)
    }
    this.updateCrawlBtn()
  }

  private clickThumbnail(
    el: HTMLElement,
    id: string,
    ev: Event,
    type: WorkTypeString
  ) {
    if (!this.canSelect()) {
      return
    }

    // 阻止默认事件，否则会进入作品页面，导致无法在当前页面继续选择
    ev.preventDefault()
    this.addId(el, id, type)
  }

  private clickElement(el: HTMLElement, ev: Event) {
    if (!this.canSelect()) {
      return
    }

    if (!el || el.nodeName !== 'A') {
      return
    }

    const href = (el as HTMLAnchorElement).href
    const artworkId = Tools.getIllustId(href)
    if (artworkId) {
      ev.preventDefault()
      // 如果查找到了作品 id，必须阻止冒泡，否则会执行 clickThumbnail
      ev.stopPropagation()
      this.addId(el.parentElement!, artworkId, 'illusts')
      return
    }

    const novelId = Tools.getNovelId(href)
    if (novelId) {
      ev.preventDefault()
      ev.stopPropagation()
      this.addId(el.parentElement!, novelId, 'novels')
      return
    }
  }

  // 监听鼠标移动
  // 鼠标移动时，由于事件触发频率很高，所以这里的代码也会执行很多次，但是这没有导致明显的性能问题，所以没有使用节流等加以限制
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

    this.bindEscEvent = this.escEvent.bind(this)
    document.addEventListener('keyup', this.bindEscEvent)

    EVT.fire('closeCenterPanel')
  }

  private pauseSelect() {
    this.pause = true
    this.bindEscEvent &&
      document.removeEventListener('keyup', this.bindEscEvent)
  }

  private canSelect() {
    return this.start && !this.pause
  }

  // 抓取选择的作品，这会自动暂停手动选择作品
  private sendDownload() {
    this.pauseSelect()

    if (this.idList.length > 0) {
      // 传递 id 列表时，将其转换成一个新的数组。否则传递的是引用，外部的一些操作可能会影响内部的 id 列表
      EVT.fire('crawlIdList', Array.from(this.idList))

      this.sendCrawl = true
      this.crawled = false
      states.quickCrawl = true

      toast.show(lang.transl('_已发送下载请求'), {
        bgColor: Colors.bgBlue,
      })
    } else {
      toast.error(lang.transl('_没有数据可供使用'))
    }
  }

  // 给这个作品添加标记
  private addSelectedFlag(wrap: HTMLElement, id: string) {
    const i = document.createElement('i')
    i.classList.add(this.selectedWorkFlagClass)
    i.dataset.id = id
    i.innerHTML = this.svg

    wrap.insertAdjacentElement('afterbegin', i)

    // 如果容器没有某些定位，可能会导致下载器添加的标记的位置异常。修复此问题
    const position = window.getComputedStyle(wrap)['position']
    if (!this.positionValue.includes(position)) {
      wrap.style.position = 'relative'
    }
  }

  // 重新添加被选择的作品上的标记
  private reAddAllFlag() {
    if (this.idList.length === 0) {
      return
    }

    for (const { id, type } of this.idList) {
      if (this.getSelectedFlag(id)) {
        // 如果这个作品的标记依旧存在，就不需要重新添加
        /**
         * 示例：从作品列表 https://www.pixiv.net/users/18095070/illustrations
         * 进入 tag 列表页 https://www.pixiv.net/users/18095070/illustrations/%E5%A5%B3%E3%81%AE%E5%AD%90
         * pixiv 会复用可用的作品，所以这些作品上的标记也依然存在，不需要重新添加
         */
        return
      }

      let el: HTMLAnchorElement | null
      if (type === 'novels') {
        el = document.querySelector(
          `${this.usedWorksWrapperSelector} a[href="/novel/show.php?id=${id}"]`
        )
      } else {
        el = document.querySelector(
          `${this.usedWorksWrapperSelector} a[href="/artworks/${id}"]`
        )
      }

      if (el) {
        // 如果在当前页面查找到了选择的作品，就给它添加标记
        this.addSelectedFlag(el, id)
      }
    }
  }

  private getSelectedFlag(id: string) {
    return document.querySelector(
      `.${this.selectedWorkFlagClass}[data-id='${id}']`
    )
  }

  // 清空指定作品的标记
  private removeSelectedFlag(id: string) {
    const el = this.getSelectedFlag(id)
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
