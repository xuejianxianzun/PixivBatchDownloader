import { EVT } from '../EVT'
import { Config } from '../Config'
import { Tools } from '../Tools'
import { pageType } from '../PageType'
import { store } from '../store/Store'
import { IDData } from '../store/StoreType'
import { cacheWorkData } from '../store/CacheWorkData'
import { settings } from '../setting/Settings'

// 在多图作品页面里，当用户点击“查看全部”按钮显示所有图片时，在每张图片上显示下载按钮，点击按钮可以下载这张图片
class ShowDownloadBtnOnMultiImageWorkPage {
  constructor() {
    if (Config.mobile) {
      return
    }

    this.bindEvents()
  }

  private readonly flagClassName = 'downloadBtnOnMultiImageWorkPage'
  private readonly styleClassName = 'downloadBtnOnThumb'

  private bindEvents() {
    window.setInterval(() => {
      this.check()
    }, 300)
  }

  private check() {
    if (pageType.type !== pageType.list.Artwork) {
      return
    }

    const AList = this.getAList()
    if (AList.length > 0) {
      this.addBtn(AList)
    }
  }

  /**选择包含 img 元素的 a 元素 */
  private getAList(): NodeListOf<HTMLAnchorElement> {
    // 在单图页面里，这个选择器是一直存在的，就是大图区域
    // 在多图页面里，这个选择器一开始不存在，只有在点击“查看全部”按钮后才有，是每张图片的 a 标签
    const selector = 'a.gtm-expand-full-size-illust'
    const AList = document.querySelectorAll(
      selector
    ) as NodeListOf<HTMLAnchorElement>
    return AList
  }

  private addBtn(AList: NodeListOf<HTMLAnchorElement>) {
    AList.forEach((a, index) => {
      // 如果没有添加过按钮
      if (a.querySelector(`.${this.flagClassName}`) === null) {
        // 添加按钮
        const top = this.addBtnOffset()
        const btn = this.createBtn()
        btn.style.top = `${top}px`
        a.style.position = 'relative'
        a.appendChild(btn)

        // 点击按钮时发送下载任务
        btn.addEventListener(
          'click',
          (ev) => {
            // 因为 a 被 Pixiv 绑定了事件，点击它会显示大图
            // 所以需要阻止按钮的冒泡，否则会触发 a 的事件，导致大图显示
            ev.stopPropagation()
            ev.preventDefault()
            const id = Tools.getIllustId()
            // 从 a.href 里提取出序号
            // https://i.pximg.net/img-original/img/2025/03/14/00/41/16/128179900_p0.png
            // 提取结果为 0
            const p = a.href!.split('_p').pop()?.split('.')[0]

            const IDData: IDData = {
              type: 'illusts',
              id,
            }

            store.setDownloadOnlyPart(Number.parseInt(id), [
              Number.parseInt(p || '0'),
            ])

            EVT.fire('crawlIdList', [IDData])
          },
          {
            capture: true,
            passive: false,
          }
        )
      }
    })
  }

  /**判断按钮是否应该下移一定距离，避免挡住页码。返回值是 top 的数值 */
  private addBtnOffset() {
    // 如果按钮显示在左上角就不需要加 top，因为页码是显示在图片右上角的
    if(settings.magnifierPosition === 'left'){
      return 0
    }

    const data = cacheWorkData.get(Tools.getIllustId())

    // 单图作品不需要处理。PS：有些漫画也是单图的
    if (!data || data.body.pageCount === 1) {
      return 0
    }

    // 对于多图插画作品，由于图片的右上角会显示 Pixiv 原本的图片编号，如 “1/5”，
    // 所以需要将按钮下移一定距离，避免遮挡住图片编号
    if (data.body.illustType === 0) {
      return 34
    }

    // 对于多图漫画作品，如果图片是竖图的话就不会与编号区域重叠，只有横图有可能会重叠
    // 所以判断是横图的话才需要下移。并且由于漫画展开后的图片编号位置不同，需要下移更多距离
    // 图片宽度的临界值：
    // 编号区域的容器宽度最大值是 1224px。当页面宽度不够时，容器宽度会随之缩小
    // 如果图片宽度接近或达到容器宽度，右侧就会与编号重叠
    // 但这个临界值不是固定的，我假设页面宽度为 1024px，此时图片宽度为 900px 时就会与编号重叠
    if (
      data.body.illustType === 1 &&
      data.body.width > 900 &&
      data.body.width >= data.body.height
    ) {
      return 60
    }

    return 0
  }

  private createBtn(): HTMLButtonElement {
    const btn = document.createElement('button')
    btn.classList.add(this.flagClassName, this.styleClassName)
    // 这个按钮复用了 styleClassName 的样式，但需要覆写一些样式
    btn.style.display = 'flex'
    // 根据“在作品缩略图上显示放大按钮”的位置设置，将按钮显示在左侧或右侧
    if (settings.magnifierPosition === 'left') {
      btn.style.left = '0'
      btn.style.right = 'unset'
    } else {
      btn.style.left = 'unset'
      btn.style.right = '0'
    }

    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-download"></use>
</svg>`
    return btn
  }
}

new ShowDownloadBtnOnMultiImageWorkPage()
