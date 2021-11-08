import { Tools } from './Tools'
import { Colors } from './config/Colors'
import { lang } from './Lang'
import { EVT } from './EVT'
import { states } from './store/States'
import { IDData } from './store/StoreType'
import { toast } from './Toast'
import { msgBox } from './MsgBox'

// 手动选择作品，图片作品和小说都可以选择
class SelectWork {
  constructor() {
    if (!this.created && location.hostname.endsWith('.pixiv.net')) {
      this.created = true
      this.selector = this.createSelectorEl()
      this.addBtn()
      this.bindEvents()
      this.checkNeedSetPosition()
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
  private needSetPosition = true // 是否需要给父元素设置定位属性

  private artworkReg = /artworks\/(\d{2,15})/
  private novelReg = /novel\/show\.php\?id=(\d{2,15})/

  // 不同页面里的作品列表容器的选择器可能不同，这里储存所有页面里会使用到的的选择器
  // root 是大部分页面通用的; js-mount-point-discovery 是发现页面使用的
  private worksWrapperSelectorList: string[] = [
    '#root',
    '#js-mount-point-discovery',
  ]
  // 储存当前页面使用的选择器
  private usedWorksWrapperSelector = this.worksWrapperSelectorList[0]

  private idList: IDData[] = []

  private observeTimer = 0

  private sendCrawl = false // 它用来判断抓取的是不是选择的作品。抓取选择的作品时激活此标记；当触发下一次的抓取完成事件时，表示已经抓取了选择的作品。
  private crawled = false // 是否已经抓取了选择的作品

  private readonly svg = `<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-select"></use>
</svg>`

  private bindClickEvent!: (ev: MouseEvent) => void | undefined
  private bindEscEvent!: (ev: KeyboardEvent) => void | undefined

  private bindEvents() {
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

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.checkNeedSetPosition()
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
    window.onbeforeunload = () => {
      // 如果存在选择的作品，并且选择的作品（全部或部分）没有被抓取，则进行提示
      if (this.idList.length > 0 && !this.crawled) {
        msgBox.error(lang.transl('_离开页面前提示选择的作品未抓取'), {
          btn: lang.transl('_我知道了'),
        })
        return false
      }
    }

    // 每次页面切换之后，重新添加被选择的作品上的标记。
    // 因为 pixiv 的页面切换一般会导致作品列表变化，所以之前添加的标记也没有了。
    // 监听 dom 变化，当 dom 变化停止一段时间之后，一般作品列表就加载出来了，此时重新添加标记（防抖）
    // 一个页面里可能产生多轮 dom 变化，所以可能会多次触发 reAddAllFlag 方法。这是必要的。
    window.addEventListener(EVT.list.pageSwitch, () => {
      // 查找作品列表容器，并保存使用的选择器
      let worksWrapper: HTMLElement | null = null
      for (const selector of this.worksWrapperSelectorList) {
        worksWrapper = document.querySelector(selector)
        if (worksWrapper) {
          this.usedWorksWrapperSelector = selector
          break
        }
      }

      if (worksWrapper === null) {
        return
      }

      // 监听作品列表容器的变化
      const ob = new MutationObserver((records) => {
        window.clearTimeout(this.observeTimer)
        this.observeTimer = window.setTimeout(() => {
          this.reAddAllFlag()
        }, 300)
        // 延迟时间不宜太小，否则代码执行时可能页面上还没有对应的元素，而且更耗费性能
      })

      ob.observe(worksWrapper, {
        childList: true,
        subtree: true,
      })
    })
  }

  private checkNeedSetPosition() {
    // 进入某些特定页面时，不需要给父元素添加定位属性
    // 在投稿页面内不能添加定位，否则作品的缩略图会不显示
    const requestPage = window.location.pathname.startsWith('/request')
    this.needSetPosition = !requestPage
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
      lang.transl('_手动选择作品'),
      [['title', 'Alt + S']]
    )
    this.updateControlBtn()

    this.clearBtn = Tools.addBtn(
      'selectWorkBtns',
      Colors.bgRed,
      lang.transl('_清空选择的作品')
    )
    this.clearBtn.style.display = 'none'
    this.clearBtn.addEventListener('click', () => {
      this.clearIdList()
    })

    this.crawlBtn = Tools.addBtn(
      'selectWorkBtns',
      Colors.bgBlue,
      lang.transl('_抓取选择的作品')
    )
    this.crawlBtn.style.display = 'none'
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
        this.clearBtn.style.display = 'block'
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
        this.crawled = false

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
  // 鼠标移动时，由于事件触发频率很高，所以这里的代码也会执行很多次，但是这没有导致明显的性能问题，所以没有加以限制（如：使用节流）
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

    EVT.fire('closeCenterPanel')
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
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    this.pauseSelect()

    if (this.idList.length > 0) {
      // 传递 id 列表时，将其转换成一个新的数组。否则传递的是引用，外部操作会影响到内部的 id 列表
      EVT.fire('crawlIdList', Array.from(this.idList))

      this.sendCrawl = true
      this.crawled = false
    } else {
      toast.error(lang.transl('_没有数据可供使用'))
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

  // 当点击事件查找到一个作品时，给这个作品添加标记
  private addSelectedFlag(el: HTMLElement, id: string) {
    const i = document.createElement('i')
    i.classList.add(this.selectedWorkFlagClass)
    i.dataset.id = id
    i.innerHTML = this.svg

    let target = el

    // 如果点击的元素处于 svg 里，则添加到 svg 外面。因为 svg 里面不会显示添加的标记
    // 这里的代码只能应对 svg 内只有一层子元素的情况。目前 pixiv 的作品列表都是这样
    if (el.nodeName === 'svg' || el.parentElement?.nodeName === 'svg') {
      target = el.parentElement as HTMLElement
    }
    target.insertAdjacentElement('beforebegin', i)

    // 如果父元素没有某些定位，可能会导致下载器添加的标记的位置异常。修复此问题
    if (this.needSetPosition && target.parentElement) {
      const position = window.getComputedStyle(target.parentElement)['position']
      if (!this.positionValue.includes(position)) {
        target.parentElement.style.position = 'relative'
      }
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
