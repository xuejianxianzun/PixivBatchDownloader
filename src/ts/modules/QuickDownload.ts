import { API } from './API'
import { EVT } from './EVT'
import { lang } from './Lang'
import { pageType } from './PageType'
import { states } from './States'
import { IDData } from './Store.d'

// 快速下载
class QuickDownload {
  constructor() {
    this.addBtn()
    this.toggle()
    this.bindEvents()
  }

  private btn!: HTMLButtonElement

  private show = true // 是否显示

  // 指定在哪些页面类型里启用
  private readonly enablePageType = [1, 13]

  private addBtn() {
    // 在右侧添加快速下载按钮
    this.btn = document.createElement('button')
    this.btn.id = 'quick_down_btn'
    this.btn.textContent = '↓'
    this.btn.setAttribute('title', lang.transl('_快速下载本页') + ' (Alt + Q)')
    document.body.insertAdjacentElement('afterbegin', this.btn)
  }

  private bindEvents() {
    // 点击按钮启动快速下载
    this.btn.addEventListener(
      'click',
      () => {
        this.sendDownload()
      },
      false
    )

    // 使用快捷键 Alt + q 启动快速下载
    window.addEventListener(
      'keydown',
      (ev) => {
        if (this.show && ev.altKey && ev.code === 'KeyQ') {
          this.sendDownload()
        }
      },
      false
    )

    // 下载完成，或者下载中止时，复位状态
    const evtList = [
      EVT.list.crawlEmpty,
      EVT.list.downloadStop,
      EVT.list.downloadPause,
      EVT.list.downloadComplete,
    ]

    for (const ev of evtList) {
      window.addEventListener(ev, () => {
        states.quickDownload = false
      })
    }

    // 页面类型改变时设置按钮的显示隐藏
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.toggle()
    })
  }

  private sendDownload() {
    states.quickDownload = true
    EVT.fire(EVT.list.QuickDownload)

    const isNovel = window.location.href.includes('/novel')

    const idList: IDData[] = [
      {
        type: isNovel ? 'novels' : 'unknown',
        id: API.getIllustId(window.location.href),
      },
    ]

    EVT.fire(EVT.list.downloadIdList, idList)
  }

  private toggle() {
    this.show = this.enablePageType.includes(pageType.type)
    this.btn.style.display = this.show ? 'block' : 'none'
  }
}

const quickDownload = new QuickDownload()
export { quickDownload }
