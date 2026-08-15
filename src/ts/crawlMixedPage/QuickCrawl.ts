import { Config } from '../Config'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { pageType } from '../PageType'
import { showOneTimeMsg } from '../ShowOneTimeMsg'
import { IDData } from '../store/StoreType'
import { Tools } from '../Tools'
import { rightButtonManager } from '../RightButtonManager'

// 快速抓取
class QuickCrawl {
  constructor() {
    this.addBtn()
    this.setVisible()
    this.bindEvents()
  }

  private btn!: HTMLButtonElement

  private show = true // 是否显示

  // 指定在哪些页面类型里启用
  private readonly enablePageType = [
    pageType.list.Artwork,
    pageType.list.Novel,
    pageType.list.Unlisted,
  ]

  private addBtn() {
    this.btn = rightButtonManager.register({
      id: 'quickCrawlBtn',
      title: '_快速下载本页',
      icon: 'download',
      order: 30,
    })
  }

  private bindEvents() {
    // 点击按钮启动快速抓取
    this.btn.addEventListener(
      'click',
      () => {
        this.sendDownload()
        if (!Config.mobile) {
          showOneTimeMsg.show(
            'tipAltQToQuickDownload',
            lang.transl('_快捷键ALTQ快速下载本页作品')
          )
        }
      },
      false
    )

    // 使用快捷键 Alt + Q 启动快速抓取
    window.addEventListener(
      'keydown',
      (ev) => {
        if (this.show && ev.altKey && ev.code === 'KeyQ') {
          this.sendDownload()
        }
      },
      false
    )

    // 页面类型改变时设置按钮的显示隐藏
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.setVisible()
    })
  }

  private sendDownload() {
    const isNovel = window.location.href.includes('/novel')

    let idData: IDData

    if (isNovel) {
      idData = {
        type: 'novels',
        id: Tools.getNovelId(window.location.href),
      }
    } else {
      idData = {
        type: 'illusts',
        id: Tools.getIllustId(window.location.href),
      }
    }

    EVT.fire('crawlIdList', [idData])
  }

  private setVisible() {
    this.show = this.enablePageType.includes(pageType.type)
    if (this.show) {
      rightButtonManager.show(this.btn)
    } else {
      rightButtonManager.hide(this.btn)
    }
  }
}

new QuickCrawl()
