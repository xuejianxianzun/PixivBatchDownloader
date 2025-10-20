import { theme } from '../Theme'
import { Tools } from '../Tools'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { EVT } from '../EVT'
import { ImageViewer } from '../ImageViewer'
import { Config } from '../Config'

class DisplayThumbnailListOnMultiImageWorkPage {
  constructor() {
    this.bindEvents()
  }

  private readonly ID = 'viewerWarpper'
  private readonly insertTarget = 'main figcaption'
  private waitTimer: number | undefined

  private bindEvents() {
    window.addEventListener(EVT.list.pageSwitch, () => {
      this.init()
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'displayThumbnailListOnMultiImageWorkPage') {
        data.value ? this.init() : this.remove()
      }
    })
  }

  private init() {
    this.remove()

    if (!settings.displayThumbnailListOnMultiImageWorkPage) {
      return
    }

    if (
      pageType.type !== pageType.list.Artwork &&
      pageType.type !== pageType.list.Unlisted
    ) {
      return
    }

    window.setTimeout(() => {
      this.display()
    }, 0)
  }

  private remove() {
    // 删除之前创建的元素，因为切换页面时它不会被自动清理
    document.querySelector(`#${this.ID}`)?.remove()
    window.clearTimeout(this.waitTimer)
  }

  private async display() {
    // 等待要插入的目标元素生成
    const target = document.querySelector(this.insertTarget)
    if (!target) {
      this.waitTimer = window.setTimeout(() => {
        this.display()
      }, 300)
      return
    }

    // 把缩略图列表添加到页面上
    this.remove()
    const viewer = new ImageViewer({
      workId: Tools.getIllustId(),
      imageNumber: 2,
    })
    const wrap = await viewer.init()
    if (wrap) {
      wrap.id = this.ID
      theme.register(wrap)
      wrap.style.display = 'block'
      target.insertAdjacentElement('afterbegin', wrap)
    }
  }

  
  /**检查目标元素是否是 ImageViewer 生成的 li 元素，以便进行特殊处理 */
  public checkLI(el?: HTMLElement) {
    return el?.classList.contains(Config.ImageViewerLI)
  }
}

const displayThumbnailListOnMultiImageWorkPage = new DisplayThumbnailListOnMultiImageWorkPage()
export { displayThumbnailListOnMultiImageWorkPage }
