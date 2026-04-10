import { EVT } from '../EVT'
import { settings, setSetting, updateBlockList } from '../setting/Settings'
import { artworkThumbnail } from '../ArtworkThumbnail'
import { Config } from '../Config'
import { ImageViewer } from '../ImageViewer'
import { IDData } from '../store/StoreType'
import { store } from '../store/Store'
import { copyWorkInfo } from '../CopyWorkInfo'
import { displayThumbnailListOnMultiImageWorkPage } from '../pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'
import { lang } from '../Language'
import { ButtonsConfig, BtnConfig } from './ButtonsConfig'
import { Tools } from '../Tools'
import { toast } from '../Toast'

// 在图片作品的缩略图上显示一些按钮
// 目前它只管理在 PC 上生效的缩略图按钮
class ButtonsOnArtworkThumbOnPC extends ButtonsConfig {
  constructor() {
    super()
    if (Config.mobile) {
      return
    }

    this.bindEvents()
    this.createAllBtn()
  }

  private currentWorkId = '' // 保存触发事件的缩略图的作品 id
  private currentUserId = '' // 保存触发事件的缩略图对应的用户 id
  private workEL?: HTMLElement // 保存触发事件的缩略图的作品元素

  private hiddenBtnTimer = 0 // 使用定时器让按钮延迟消失。这是为了解决一些情况下按钮闪烁的问题
  private delay = 100
  private doNotShowBtn = false // 当点击了按钮后，进入此状态，此状态中不会显示按钮
  // 此状态是为了解决这个问题：点击了按钮之后，按钮会被隐藏，隐藏之后，鼠标下方就是图片缩略图区域，这会触发缩略图的鼠标事件，导致按钮马上就又显示了出来。所以点击按钮之后设置这个状态，在其为 true 的期间不会显示按钮。过一段时间再把它复位。复位所需的时间很短，因为只要能覆盖这段时间就可以了：从隐藏按钮开始算起，到缩略图触发鼠标事件结束。

  private confirmingBtnName = '' // 正在等待二次确认的按钮名
  private confirmTimer = 0 // 重置二次确认状态的定时器

  private bindEvents() {
    artworkThumbnail.onEnter((el: HTMLElement, id: string) => {
      this.currentWorkId = id
      this.currentUserId = this.getUserId(el)
      this.workEL = el
      this.showAllBtn()
    })

    artworkThumbnail.onLeave(() => {
      this.hiddenBtnDelay()
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as { name?: string }
      if (data.name === 'blockList') {
        this.updateHideUserBtnState()
      }
      if (data.name === 'hideUserButton' && !settings.hideUserButton) {
        this.hiddenHideUserBtn()
      }
    })

    // 页面切换时，隐藏所有按钮
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.hiddenBtnDelay()
    })

    // 开始抓取时，隐藏所有按钮
    window.addEventListener(EVT.list.crawlStart, () => {
      this.hiddenBtnDelay()
    })
  }

  private createAllBtn() {
    this.btnsConfig.forEach((config) => {
      config.btn = this.createBtn(config)

      // 鼠标移入按钮时取消隐藏按钮
      config.btn.addEventListener('mouseenter', (ev) => {
        window.clearTimeout(this.hiddenBtnTimer)
      })

      // 鼠标移出按钮时，隐藏所有按钮
      config.btn.addEventListener('mouseleave', () => {
        this.hiddenBtnDelay()
      })

      // 点击按钮时
      config.btn.addEventListener('click', (ev) => {
        if (!this.currentWorkId) {
          return
        }

        // 隐藏用户按钮需要二次确认
        if (config.name === 'hideUserBtnOnThumb') {
          if (this.confirmingBtnName !== config.name) {
            // 第一次点击，进入确认状态
            this.confirmingBtnName = config.name
            config.btn.classList.add('confirming')
            window.clearTimeout(this.confirmTimer)
            this.confirmTimer = window.setTimeout(() => {
              this.resetConfirmState()
            }, 3000)
            return
          } else {
            // 第二次点击，重置状态并继续执行
            this.resetConfirmState()
          }
        }

        this.hiddenBtnNow()
        EVT.fire('clickBtnOnThumb')
        // 定义点击每个按钮时的具体逻辑
        this.clickBtn(config)
      })
    })
  }

  private resetConfirmState() {
    this.confirmingBtnName = ''
    this.btnsConfig.forEach((config) => {
      config.btn.classList.remove('confirming')
    })
  }

  private createBtn(config: BtnConfig) {
    const btn = document.createElement('button')
    btn.id = config.name
    btn.classList.add('btnOnThumb')
    btn.innerHTML = `<svg class="icon" aria-hidden="true"><use xlink:href="#${config.icon}"></use></svg>`
    btn.dataset.xztitle = config.title
    lang.register(btn)
    document.body.appendChild(btn)

    return btn
  }

  private clickBtn(config: BtnConfig) {
    let index = 0
    const onThumbList = displayThumbnailListOnMultiImageWorkPage.checkLI(
      this.workEL
    )
    // 在多图作品的缩略图列表上触发时，通过 data-index 属性获取序号
    if (onThumbList) {
      index = Number.parseInt(this.workEL!.dataset!.index!)
    }

    const idData: IDData = {
      type: 'illusts',
      id: this.currentWorkId,
    }

    if (config.name === 'zoomBtnOnThumb') {
      new ImageViewer({
        workId: this.currentWorkId,
        imageSize: settings.magnifierSize,
        autoStart: true,
        showLoading: true,
      })
    } else if (config.name === 'copyBtnOnThumb') {
      copyWorkInfo.receive(idData, index)
    } else if (config.name === 'downloadBtnOnThumb') {
      // 在多图作品的缩略图列表上点击下载按钮时，只下载这一张图片
      if (onThumbList) {
        store.setDownloadOnlyPart(Number.parseInt(this.currentWorkId), [index])
      }

      EVT.fire('crawlIdList', [idData])
    } else if (config.name === 'hideUserBtnOnThumb') {
      if (!this.currentUserId) {
        return
      }

      if (settings.blockList.includes(this.currentUserId)) {
        updateBlockList(this.currentUserId, 'remove')
        toast.success(lang.transl('_已从阻止名单移除'))
      } else {
        updateBlockList(this.currentUserId, 'add')
        toast.success(lang.transl('_已添加到阻止名单'))
      }
    }
  }

  private getUserId(el: HTMLElement) {
    const userLink = el.querySelector(
      'a[href*="/users/"]'
    ) as HTMLAnchorElement | null
    if (userLink) {
      return Tools.getUserID(userLink.href)
    }

    const userIdEl = el.querySelector(
      '[data-gtm-user-id]'
    ) as HTMLElement | null
    if (userIdEl && userIdEl.dataset.gtmUserId) {
      return userIdEl.dataset.gtmUserId
    }

    return ''
  }

  private updateHideUserBtnState() {
    const config = this.btnsConfig.find(
      (item) => item.name === 'hideUserBtnOnThumb'
    )
    if (!config) {
      return
    }

    const blocked =
      this.currentUserId && settings.blockList.includes(this.currentUserId)
    config.btn.dataset.xztitle = blocked ? '_取消阻止' : '_阻止'
    config.btn.classList.toggle('blocked', !!blocked)
    lang.register(config.btn)
  }

  private showAllBtn() {
    if (this.doNotShowBtn) {
      return
    }

    window.clearTimeout(this.hiddenBtnTimer)
    let rightOrder = 0
    let leftOrder = 0
    const rect = this.workEL!.getBoundingClientRect()
    const imageViewerLI = displayThumbnailListOnMultiImageWorkPage.checkLI(
      this.workEL
    )

    for (const config of this.btnsConfig) {
      // 在多图作品页面里的缩略图列表上触发时，不显示放大按钮，因为点击图片即可放大
      if (imageViewerLI && config.name === 'zoomBtnOnThumb') {
        continue
      }

      if (config.name === 'hideUserBtnOnThumb' && !this.currentUserId) {
        continue
      }

      if (config.show()) {
        if (config.name === 'hideUserBtnOnThumb') {
          this.updateHideUserBtnState()
          this.showBtnOnLeft(config.btn, rect, leftOrder)
          leftOrder++
        } else {
          this.showBtnOnRight(config.btn, rect, rightOrder)
          rightOrder++
        }
      }
    }
  }

  private showBtnOnRight(btn: HTMLButtonElement, rect: DOMRect, order: number) {
    btn.style.left =
      window.scrollX +
      rect.left +
      (settings.magnifierPosition === 'left' ? 0 : rect.width - this.btnSize) +
      'px'

    const size = this.btnSize + this.margin
    const top = window.scrollY + rect.top + size * order
    btn.style.top = top + 'px'
    btn.style.display = 'flex'
  }

  private showBtnOnLeft(btn: HTMLButtonElement, rect: DOMRect, order: number) {
    btn.style.left = window.scrollX + rect.left + 'px'

    const size = this.btnSize + this.margin
    const top = window.scrollY + rect.top + size * order
    btn.style.top = top + 'px'
    btn.style.display = 'flex'
  }

  private hiddenHideUserBtn() {
    const config = this.btnsConfig.find(
      (item) => item.name === 'hideUserBtnOnThumb'
    )
    if (!config) {
      return
    }
    config.btn.style.display = 'none'
  }

  private hiddenAllBtn() {
    this.resetConfirmState()
    this.btnsConfig.forEach((config) => {
      config.btn.style.display = 'none'
    })
  }

  // 延迟隐藏按钮
  private hiddenBtnDelay() {
    window.clearTimeout(this.hiddenBtnTimer)
    this.hiddenBtnTimer = window.setTimeout(() => {
      this.hiddenAllBtn()
    }, this.delay)
  }

  // 立刻隐藏按钮
  private hiddenBtnNow() {
    this.doNotShowBtn = true
    window.setTimeout(() => {
      this.doNotShowBtn = false
    }, 100)

    window.clearTimeout(this.hiddenBtnTimer)
    this.hiddenAllBtn()
  }
}

new ButtonsOnArtworkThumbOnPC()
