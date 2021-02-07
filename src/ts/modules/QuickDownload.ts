import { EVT } from './EVT'
import { lang } from './Lang'
import { pageType } from './PageType'
import { states } from './States'
import { IDData } from './Store.d'
import { toast } from './Toast'
import { Tools } from './Tools'

// 快速下载
class QuickDownload {
  constructor() {
    this.addBtn()
    this.setVisible()
    this.bindEvents()
  }

  private btn!: HTMLButtonElement

  private show = true // 是否显示

  // 指定在哪些页面类型里启用
  private readonly enablePageType = [pageType.list.Artwork, pageType.list.Novel]

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

    // 页面类型改变时设置按钮的显示隐藏
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.setVisible()
    })
  }

  private sendDownload() {
    // 因为 quickDownload 状态会影响后续下载行为，所以必须先判断 busy 状态
    if (states.busy) {
      toast.error(lang.transl('_当前任务尚未完成'))
      return
    }

    states.quickDownload = true
    EVT.fire(EVT.list.QuickDownload)

    const isNovel = window.location.href.includes('/novel')

    const idList: IDData[] = [
      {
        type: isNovel ? 'novels' : 'unknown',
        id: Tools.getIllustId(window.location.href),
      },
    ]

    EVT.fire(EVT.list.downloadIdList, idList)
  }

  private setVisible() {
    this.show = this.enablePageType.includes(pageType.type)
    this.btn.style.display = this.show ? 'block' : 'none'
  }
}

const quickDownload = new QuickDownload()
export { quickDownload }
