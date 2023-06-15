import { Colors } from '../Colors'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { pageType } from '../PageType'
import { states } from '../store/States'
import { store } from '../store/Store'
import { IDData } from '../store/StoreType'
import { toast } from '../Toast'
import { Tools } from '../Tools'

// 抓取当前显示/查看的这一张图片
class CrawlCurrent {
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
    pageType.list.Unlisted,
  ]

  private addBtn() {
    // 在右侧添加快速抓取按钮
    this.btn = document.createElement('button')
    this.btn.classList.add('rightButton')
    this.btn.id = 'crawlCurrentBtn'
    this.btn.innerHTML = `<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-C_square"></use>
</svg>`
    document.body.append(this.btn)
  }

  private bindEvents() {
    this.btn.addEventListener(
      'click',
      () => {
        this.sendDownload()
      },
      false
    )

    window.addEventListener(
      'keydown',
      (ev) => {
        if (ev.code === 'KeyC' && !ev.shiftKey && !ev.altKey && !ev.ctrlKey) {
          // 在作品页面内按 C 时，Pixiv 会把焦点定位到评论输入框里，阻止此行为
          // 但是如果用户在可输入区域里打字时按 C 则不应执行动作，所以还要检查焦点元素
          if (document.activeElement) {
            const nodeName = document.activeElement.nodeName
            if (nodeName !== 'INPUT' && nodeName !== 'TEXTAREA') {
              // 如果焦点元素不是输入框，则阻止 C 定位到评论区，并下载
              ev.stopPropagation()
              this.sendDownload()
            }
          }
        }
      },
      true
    )

    // 页面类型改变时设置按钮的显示隐藏
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.setVisible()
    })
  }

  private sendDownload() {
    // 首先判断是否处于预览作品的状态
    // 因为预览作品时也使用了快捷键 C，所以如果正在预览，则不执行本模块的下载，以免造成同时下载 2 个文件的情况
    const previewWorkWrap = document.querySelector(
      '#previewWorkWrap'
    ) as HTMLDivElement
    if (previewWorkWrap && previewWorkWrap.style.display === 'block') {
      return
    }

    let id = 0
    let no = 0

    // 判断是否打开了图片查看器，如果打开了则下载图片查看器里的图片
    const viewerImg = document.querySelector(
      '.viewer-canvas img'
    ) as HTMLImageElement
    if (viewerImg && (viewerImg as any).checkVisibility() && viewerImg.src) {
      // 获取 id
      const matchID = viewerImg.src.match(/(\d+)_p/)
      if (matchID && matchID[1]) {
        id = Number.parseInt(matchID[1])
      }

      // 获取页码
      const matchNO = viewerImg.src.match(/_p(\d)\./)
      if (matchNO && matchNO[1]) {
        no = Number.parseInt(matchNO[1])
      }
    } else {
      // 如果没有打开图片查看器，则下载当前页面所显示的图片
      if (this.show) {
        // 获取 id
        id = Number.parseInt(Tools.getIllustId(window.location.href))

        // 获取页码
        const span = document.querySelector('div[role="presentation"] span')
        if (!span) {
          no = 0
        } else {
          // 获取多图右上角显示的图片进度，较小的那个数字就是页码
          const text = span.textContent || ''
          const match = text.match(/(\d+)\/(\d+)/)
          // 对于页码如 1/4，匹配结果：
          // ['1/4', '1', '4']
          if (match && match.length === 3) {
            const number1 = Number.parseInt(match[1])
            const number2 = Number.parseInt(match[2])
            const min = Math.min(number1, number2)
            // 因为右上角的页码是从 1 开始的，所以需要 -1
            no = min - 1
          }
        }
      } else {
        // 没有显示预览作品或者图片查看器，也不在作品页面里，则不能下载
        return
      }
    }

    states.quickCrawl = true
    store.setDownloadOnlyPart(id, [no])

    let idData: IDData = {
      type: 'illusts',
      id: id.toString(),
    }

    EVT.fire('crawlIdList', [idData])

    toast.show(lang.transl('_已发送下载请求'), {
      bgColor: Colors.bgBlue,
    })
  }

  private setVisible() {
    this.show = this.enablePageType.includes(pageType.type)
    this.btn.style.display = this.show ? 'flex' : 'none'
  }
}

new CrawlCurrent()
