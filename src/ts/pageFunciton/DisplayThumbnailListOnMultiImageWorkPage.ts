import { theme } from '../Theme'
import { Tools } from '../Tools'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { EVT } from '../EVT'
import { ImageViewer } from '../ImageViewer'
import { Config } from '../Config'
import { cacheWorkData } from '../store/CacheWorkData'
import { API } from '../API'
import { ArtworkData } from '../crawl/CrawlResult'

/**在多图作品页面里显示缩略图列表 */
class DisplayThumbnailListOnMultiImageWorkPage {
  constructor() {
    this.bindEvents()
  }

  private readonly wrapperID = 'viewerWarpper'
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

  private async display() {
    // 等待要插入的目标元素生成
    const target = document.querySelector(this.insertTarget)
    if (!target) {
      this.waitTimer = window.setTimeout(() => {
        this.display()
      }, 300)
      return
    }

    this.remove()

    // 把缩略图列表添加到页面上
    const id = Tools.getIllustId()
    const wrap = await this.createThumbList(id)
    if (wrap) {
      wrap.style.display = 'block'
      target.insertAdjacentElement('afterbegin', wrap)

      // 为每个缩略图添加点击事件，点击时打开图片查看器
      const images = wrap.querySelectorAll('li img')
      images.forEach((img) => {
        img.addEventListener('click', (ev) => {
          const li = img.parentElement as HTMLElement
          const index = Number.parseInt(li.dataset.index!)

          new ImageViewer({
            workId: id,
            initialViewIndex: index,
            imageSize: settings.magnifierSize,
            autoStart: true,
            showLoading: true,
          })
        })
      })
    }
  }

  private remove() {
    // 删除之前创建的元素，因为切换页面时它不会被自动清理
    document.querySelector(`#${this.wrapperID}`)?.remove()
    window.clearTimeout(this.waitTimer)
  }

  private async createThumbList(id: string): Promise<HTMLElement | undefined> {
    return new Promise(async (resolve) => {
      // 获取作品数据
      let workData: ArtworkData | undefined
      if (cacheWorkData.has(id)) {
        workData = cacheWorkData.get(id)
      } else {
        const unlisted = pageType.type === pageType.list.Unlisted
        const data = await API.getArtworkData(id, unlisted)
        workData = data
        cacheWorkData.set(data)
      }

      const body = workData!.body
      // 这个作品里至少有 2 张图片才会创建缩略图
      if (body.pageCount >= 2) {
        // 缩略图列表的结构： div#viewerWarpper > ul > li.xz-thumb-li > img + a
        const warpper = document.createElement('div')
        warpper.id = this.wrapperID
        warpper.classList.add('beautify_scrollbar')
        const ul = document.createElement('ul')
        warpper.appendChild(ul)
        theme.register(warpper)

        // 生成 li 元素列表
        let liHtml: string[] = []
        for (let index = 0; index < body.pageCount; index++) {
          const thumbUrl = Tools.convertThumbURLTo540px(
            body.urls.thumb.replace('p0', 'p' + index)
          )
          const str = `<li data-index="${index}" class="${Config.ImageViewerLI}">
            <img src="${thumbUrl}" />
            <a href="${window.location.href}"></a>
          </li>`
          // a 标签是查找作品缩略图时用到的。如果没有 a 标签，就无法被识别为作品缩略图
          liHtml.push(str)
        }
        ul.innerHTML = liHtml.join('')
        return resolve(warpper)
      }
    })
  }

  /**检查目标元素是否是 ImageViewer 生成的 li 元素，以便进行特殊处理 */
  public checkLI(el?: HTMLElement) {
    return el?.classList.contains(Config.ImageViewerLI)
  }
}

const displayThumbnailListOnMultiImageWorkPage =
  new DisplayThumbnailListOnMultiImageWorkPage()
export { displayThumbnailListOnMultiImageWorkPage }
