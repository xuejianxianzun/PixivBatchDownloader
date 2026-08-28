import { Tools } from './Tools'
import { lang } from './Language'
import { EVT } from './EVT'
import { workSelection } from './WorkSelection'
import { store } from './store/Store'
import { states } from './store/States'
import { IDData, IDTypeString } from './store/StoreType'
import { msgBox } from './MsgBox'
import { Utils } from './utils/Utils'
import { artworkThumbnail } from './ArtworkThumbnail'
import { novelThumbnail } from './NovelThumbnail'
import { pageType } from './PageType'
import { Config } from './Config'
import { toast } from './Toast'
import { showOneTimeMsg } from './ShowOneTimeMsg'
import { displayThumbnailListOnMultiImageWorkPage } from './pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'

// 手动排除作品，图片作品和小说都可以排除
class ExcludeWork {
  constructor() {
    // 符合条件时才会创建“手动排除作品”的按钮
    // 注意：由于这个初始化步骤只会执行一次，所以如果在这里不创建按钮的话，之后即使切换到符合条件的页面里，也依然是没有按钮的
    if (Utils.isPixiv()) {
      this.selector = this.createSelectorEl()
      this.addBtn()
      this.bindEvents()
    }
  }

  private selector?: HTMLElement // 用于排除作品的指示器
  private selectorId = 'excludeWorkEl'
  private left = 0
  private top = 0
  private half = 10 // 指示器的一半宽度（用于设置位置）

  private _tempHide = false // 打开下载面板时临时隐藏。这个变量只会影响指示器的 display

  private disablePageList = [pageType.list.Unlisted]

  get start() {
    return workSelection.excludeActive
  }

  set start(bool: boolean) {
    if (bool) {
      workSelection.enterExcludeMode()
    } else {
      workSelection.exitExcludeMode()
    }
  }

  get pause() {
    return workSelection.excludePaused
  }

  set pause(bool: boolean) {
    workSelection.setExcludePaused(bool)
  }

  get tempHide() {
    return this._tempHide
  }

  set tempHide(bool: boolean) {
    this._tempHide = bool
    this.updateSelectorEl()
  }

  private controlBtn: HTMLButtonElement = document.createElement('button') // 启动、暂停、继续排除的按钮
  private controlTextSpan: HTMLSpanElement = document.createElement('span') // 按钮里的文字
  private clearBtn: HTMLButtonElement = document.createElement('button') // 清空排除作品的按钮
  private clearTextSpan: HTMLSpanElement = document.createElement('span') // 按钮里的文字

  private excludedWorkFlagClass = 'excludedWorkFlag' // 给被排除的作品添加标记时使用的 class
  private positionValue = ['relative', 'absolute', 'fixed'] // 标记元素需要父元素拥有这些定位属性

  // 储存当前页面的作品列表容器
  private worksWrapper: HTMLElement = document.body
  private ob: MutationObserver | undefined = undefined

  private readonly svg = `<svg class="icon" aria-hidden="true">
  <use xlink:href="#exclude"></use>
</svg>`

  private bindEscEvent!: (ev: KeyboardEvent) => void | undefined

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.pauseExclude()
    })

    artworkThumbnail.onClick((el: HTMLElement, id: string, ev: Event) => {
      this.clickThumbnail(el, id, ev, 'illusts')
    })

    novelThumbnail.onClick(
      (
        el: HTMLElement,
        id: string,
        ev: Event,
        type: 'novels' | 'novelSeries'
      ) => {
        this.clickThumbnail(el, id, ev, type)
      }
    )

    document.body.addEventListener(
      Config.mobile ? 'touchend' : 'click',
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

    window.addEventListener(EVT.list.commandToggleExcludeWork, () => {
      this.toggleExcludeWork()
    })

    // 鼠标移动时保存鼠标的坐标
    window.addEventListener(
      'mousemove',
      (ev) => {
        this.moveEvent(ev)
      },
      true
    )

    // 每次页面切换之后，查找新的作品列表容器并保存
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.worksWrapper = document.body
    })

    // 每次页面切换之后，查找新显示的作品里是否有之前被排除的作品，如果有则为其添加标记
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

    // 当“手动选择作品”或“手动排除作品”的状态变化时，同步 UI
    window.addEventListener(EVT.list.workSelectionChange, () => {
      this.updateSelectorEl()
      this.updateControlBtn()
    })

    // 当一个作品被选择、并且它之前被排除时，移除其排除标记
    window.addEventListener(
      EVT.list.excludeWorkRemovedExternally,
      (ev: CustomEventInit) => {
        const id = ev.detail.data as string
        this.removeExcludedFlag(id)
        this.updateClearBtn()
      }
    )
  }

  private clearIdList() {
    // 清空标记需要使用 id 数据，所以需要执行之后才能清空 id
    this.removeAllExcludedFlag()
    workSelection.clearExclude()
    this.updateClearBtn()
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

    const show = this.canExclude() && !this.tempHide

    this.selector.style.display = show ? 'flex' : 'none'
    // 如果选择器处于隐藏状态，就不会更新其坐标。这样可以优化性能
    if (show) {
      this.selector.style.left = this.left - this.half + 'px'
      this.selector.style.top = this.top - this.half + 'px'
    }
  }

  private addBtn() {
    this.controlBtn = Tools.addBtn(
      'excludeWorkBtns',
      '_手动排除作品',
      '',
      'excludeWork',
      'secondary',
      'danger'
    )
    this.controlTextSpan = this.controlBtn.querySelector('span')!
    this.updateControlBtn()

    this.clearBtn = Tools.addBtn(
      'excludeWorkBtns',
      '_清空排除的作品',
      '',
      'clearExcludedWork',
      'secondary',
      'danger'
    )
    this.clearBtn.style.display = 'none'
    this.clearTextSpan = this.clearBtn.querySelector('span')!
    this.clearBtn.addEventListener('click', () => {
      this.clearIdList()
      this.clearBtn.style.display = 'none'
    })
  }

  // 切换控制按钮的文字和点击事件
  private updateControlBtn() {
    if (!this.start) {
      lang.updateText(this.controlTextSpan, '_手动排除作品')
      this.controlBtn.onclick = (ev) => {
        const disable = this.disablePageList.includes(pageType.type)
        if (disable) {
          msgBox.warning(lang.transl('_不支持在此页面上排除作品'), {
            title: lang.transl('_手动排除作品'),
          })
          return
        }

        this.startExclude(ev)
        this.clearBtn.style.display = 'flex'
        if (!Config.mobile) {
          showOneTimeMsg.show(
            'tipAltEToExcludeWork',
            lang.transl('_快捷键ALTE手动排除作品')
          )
        }
      }
    } else {
      if (!this.pause) {
        lang.updateText(this.controlTextSpan, '_暂停排除')
        this.controlBtn.onclick = () => {
          this.pauseExclude()
        }
      } else {
        lang.updateText(this.controlTextSpan, '_继续排除')
        this.controlBtn.onclick = (ev) => {
          this.startExclude(ev)
        }
      }
    }
  }

  // 在排除作品的数量改变时，在清空按钮上显示作品数量
  private updateClearBtn() {
    if (workSelection.excludeIdList.length > 0) {
      lang.updateText(
        this.clearTextSpan,
        '_清空排除的作品2',
        workSelection.excludeIdList.length.toString()
      )
      this.clearBtn.style.display = 'flex'
    } else {
      lang.updateText(this.clearTextSpan, '_清空排除的作品')
      this.clearBtn.style.display = 'none'
    }
  }

  private addId(el: HTMLElement, id: string, type: IDTypeString) {
    let seriesTitle = ''
    if (type === 'novelSeries') {
      const aList = el.querySelectorAll(`a[href*="${id}"]`)
      for (const a of aList) {
        if (a.textContent) {
          seriesTitle = a.textContent
          break
        }
      }
    }

    // 添加这个 id，或从列表里移除它（toggle）
    const added = workSelection.toggleExcludeId(id, type, seriesTitle)
    if (added) {
      this.addExcludedFlag(el, id, type)
      // 如果这个作品已经被抓取，则从抓取结果里移除它
      if (!states.busy) {
        const removed = store.removeWorkById([id])
        if (removed) {
          toast.error(lang.transl('_已从抓取结果中移除'))
        }
      }
    } else {
      this.removeExcludedFlag(id)
    }
    this.updateClearBtn()
  }

  private clickThumbnail(
    el: HTMLElement,
    id: string,
    ev: Event,
    type: IDTypeString
  ) {
    if (!this.canExclude()) {
      return
    }

    // 如果点击的元素是作品缩略图里的收藏按钮，则不排除这个作品，这样可以让收藏按钮发挥作用
    const target = ev.target as HTMLElement
    if (target && (target.nodeName === 'svg' || target.nodeName === 'path')) {
      return
    }

    // 如果点击的是多图作品页面里的作品缩略图，则不排除这个作品
    if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
      return
    }

    if (!id || id === '0') {
      id = Tools.findWorkIdFromElement(
        el,
        type === 'novels' ? 'novels' : 'illusts'
      )
    }

    // 对于小说或系列小说，尝试从元素里获取 id 和类型。因为在极少数情况下，一个小说或系列的缩略图里的内容可能会变化，导致传入的数据不再准确。
    if (type === 'novels' || type === 'novelSeries') {
      const idData = Tools.getNovelOrSeriesIDData(el)
      if (idData) {
        id = idData.id
        type = idData.type
      } else {
        id = ''
      }
    }

    // 阻止默认事件，否则会进入作品页面，导致无法在当前页面继续排除
    ev.preventDefault()
    ev.stopPropagation()

    // 仅当有 id 时才添加到选择列表里
    id && this.addId(el, id, type)
  }

  private clickElement(el: HTMLElement, ev: Event) {
    if (!this.canExclude()) {
      return
    }

    if (!el) {
      return
    }

    // 添加排除标记的目标元素，通常是点击的元素的父元素
    let addFlagTarget = el.parentElement!
    // 查找 A 标签，获取作品 id
    let a: HTMLAnchorElement | null = null

    if (el.nodeName === 'A') {
      a = el as HTMLAnchorElement
    } else {
      // 处理点击在动图的播放图标上的情况
      if (
        el.nodeName === 'svg' ||
        el.nodeName === 'path' ||
        el.nodeName === 'circle'
      ) {
        a = el.closest('a')
        if (a) {
          addFlagTarget = a!.parentElement!
        }
      }
    }

    if (!a || !a.href) {
      return
    }

    const href = a.href
    const artworkId = Tools.getIllustId(href)
    if (artworkId) {
      ev.preventDefault()
      ev.stopPropagation()
      this.addId(addFlagTarget, artworkId, 'illusts')
      return
    }

    const novelId = Tools.getNovelId(href)
    if (novelId) {
      ev.preventDefault()
      ev.stopPropagation()
      this.addId(addFlagTarget, novelId, 'novels')
      return
    }

    // 如果没有查找到小说 id，可能是系列小说，此时尝试查找系列 id
    const seriesId = Tools.getNovelSeriesId(href)
    if (seriesId) {
      ev.preventDefault()
      ev.stopPropagation()
      this.addId(addFlagTarget, seriesId, 'novelSeries')
      return
    }
  }

  // 监听鼠标移动
  private moveEvent(ev: MouseEvent) {
    this.left = ev.x
    this.top = ev.y
    this.updateSelectorEl()
  }

  // 按 Esc 键时暂停排除
  private escEvent(ev: KeyboardEvent) {
    if (ev.code === 'Escape') {
      this.pauseExclude()
    }
  }

  // 开始或继续排除
  private startExclude(ev: MouseEvent) {
    this.start = true
    // 进入排除模式时，确保处于“活动中、未暂停”的状态。
    // 不排除列表的数据不会在这里被清空。排除列表会一直保留，直到用户点击“清空排除的作品”按钮为止。
    // 这样可以避免切换到“手动选择作品”模式再切回来时，之前排除的作品被误清空。
    this.pause = false

    this.bindEscEvent = this.escEvent.bind(this)
    window.addEventListener('keydown', this.bindEscEvent)

    EVT.fire('closeCenterPanel')
  }

  private pauseExclude() {
    this.pause = true
    this.bindEscEvent &&
      window.removeEventListener('keydown', this.bindEscEvent)
  }

  private canExclude() {
    return this.start && !this.pause
  }

  /** 启动或暂停手动排除作品（模拟点击控制按钮） */
  private toggleExcludeWork() {
    this.controlBtn.click()
  }

  // 给这个作品添加排除标记
  private addExcludedFlag(
    wrap: HTMLElement,
    id: string,
    type: IDTypeString = 'illusts'
  ) {
    // 同一个作品可能有多个缩略图元素，所以要在每个缩略图上都添加标记
    let allThisIdWorks = document.querySelectorAll<HTMLElement>(
      `.ppd-workThumbnail[data-workid='${id}'][data-worktype='${type}']`
    )
    // 如果没有找到缩略图元素，可能是因为 type 是系列小说。系列小说没有上面的两个 data 属性
    if (allThisIdWorks.length === 0) {
      allThisIdWorks = [wrap] as any
    }

    for (const el of allThisIdWorks) {
      if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
        continue
      }

      // 如果这个缩略图里已经存在标记，就不需要重复添加
      const existingFlag = el.querySelector(`.${this.excludedWorkFlagClass}`)
      if (existingFlag) {
        continue
      }

      const i = document.createElement('i')
      i.classList.add(this.excludedWorkFlagClass)
      i.dataset.id = id
      i.dataset.type = type
      i.innerHTML = this.svg

      el.insertAdjacentElement('afterbegin', i)

      // 如果容器没有某些定位，可能会导致下载器添加的标记的位置异常。修复此问题
      const position = window.getComputedStyle(el)['position']
      if (!this.positionValue.includes(position)) {
        el.style.position = 'relative'
      }
    }
  }

  // 重新添加被排除的作品上的标记
  private reAddAllFlag() {
    if (workSelection.excludeIdList.length === 0) {
      return
    }

    for (const { id, type } of workSelection.excludeIdList) {
      let el: HTMLAnchorElement | null
      if (type === 'novels') {
        el = document.querySelector(`body a[href="/novel/show.php?id=${id}"]`)
      } else {
        el = document.querySelector(`body a[href="/artworks/${id}"]`)
      }

      if (el) {
        // 如果在当前页面查找到了排除的作品，就给它添加标记
        this.addExcludedFlag(el, id, type)
      }
    }
  }

  private getExcludedFlag(id: string) {
    return document.querySelectorAll(
      `.${this.excludedWorkFlagClass}[data-id='${id}']`
    )
  }

  // 清空指定作品的标记
  private removeExcludedFlag(id: string) {
    const els = this.getExcludedFlag(id)
    els.forEach((el) => el.remove())
  }

  // 清空所有标记
  private removeAllExcludedFlag() {
    for (const item of workSelection.excludeIdList) {
      this.removeExcludedFlag(item.id)
    }
  }
}

const excludeWork = new ExcludeWork()
export { excludeWork }
