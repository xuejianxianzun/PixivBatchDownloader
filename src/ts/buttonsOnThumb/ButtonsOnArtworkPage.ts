import { EVT } from '../EVT'
import { Config } from '../Config'
import { Tools } from '../Tools'
import { pageType } from '../PageType'
import { store } from '../store/Store'
import { IDData } from '../store/StoreType'
import { cacheWorkData } from '../store/CacheWorkData'
import { settings } from '../setting/Settings'
import { ButtonsConfig, BtnConfig } from './ButtonsConfig'
import { lang } from '../Language'
import { ImageViewer } from '../ImageViewer'
import { copyWorkInfo } from '../CopyWorkInfo'

/** 在插画、漫画作品的详情页面里，在每张大图的旁边显示一些按钮 */
// 对于单图作品，下载器会直接显示按钮
// 对于多图作品，当用户点击“查看全部”按钮显示所有图片时，下载器才会显示按钮
// 对于动图作品，不会显示这些按钮
class ButtonsOnArtworkPage extends ButtonsConfig {
  constructor() {
    super()
    if (Config.mobile) {
      return
    }

    this.bindEvents()
  }

  private readonly btnFlag = 'buttonsOnArtworkPage'

  private bindEvents() {
    window.setInterval(() => {
      this.check()
    }, 300)

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      // 如果按钮位置变化了，就立即响应变化，重新创建按钮
      if (data.name === 'magnifierPosition') {
        const allBtn = document.querySelectorAll(`.${this.btnFlag}`)
        allBtn.forEach((btn) => btn.remove())
        this.check()
      }
    })
  }

  private check() {
    if (pageType.type !== pageType.list.Artwork) {
      return
    }

    const AList = this.getAList()
    // 遍历每个 a 标签，也就是每张大图
    AList.forEach((a, index) => {
      // 如果这个图片里没有添加过按钮
      if (a.querySelector(`.${this.btnFlag}`) === null) {
        this.createAllBtn(a)
      }
    })
  }

  /**选择包含 img 元素的 a 元素，按钮会添加为 a 的子元素 */
  private getAList(): NodeListOf<HTMLAnchorElement> {
    // 在单图页面里，这个选择器是一直存在的，就是大图区域
    // 在多图页面里，这个选择器一开始不存在，只有在点击“查看全部”按钮后才有，是每张图片的 a 标签
    const selector = 'a.gtm-expand-full-size-illust'
    const AList = document.querySelectorAll(
      selector
    ) as NodeListOf<HTMLAnchorElement>
    return AList
  }

  private createAllBtn(a: HTMLAnchorElement) {
    // 设置 a 标签的样式
    a.style.position = 'relative'
    a.parentElement!.style.overflow = 'unset'

    // 记录有几个按钮需要显示，用于设置按钮的 top 值
    let order = 0
    // 添加按钮
    this.btnsConfig.forEach((config) => {
      if (config.show()) {
        config.btn = this.createBtn(config, order)
        a.appendChild(config.btn)
        order++

        config.btn.addEventListener(
          'click',
          (ev) => {
            // 因为 a 被 Pixiv 绑定了事件，点击它会显示大图
            // 所以需要阻止按钮的冒泡，否则会触发 a 的事件，导致大图显示
            ev.stopPropagation()
            ev.preventDefault()
            this.clickBtn(config, a)
          },
          {
            capture: true,
            passive: false,
          }
        )
      }
    })
  }

  private createBtn(config: BtnConfig, order = 0) {
    const btn = document.createElement('button')
    btn.classList.add(this.btnFlag, 'btnOnThumb')
    // 这些按钮复用了 btnOnThumb 的样式，但需要覆写一些样式
    btn.style.display = 'flex'
    // 根据“在作品缩略图上显示放大按钮”的位置设置，将按钮显示在左侧或右侧
    if (settings.magnifierPosition === 'left') {
      btn.style.left = `-${this.btnSize}px`
      btn.style.right = 'unset'
    } else {
      btn.style.left = 'unset'
      btn.style.right = `-${this.btnSize}px`
    }
    // 计算按钮的 top 值
    const top = (this.btnSize + this.margin) * order
    btn.style.top = top + 'px'

    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#${config.icon}"></use>
</svg>`
    btn.dataset.xztitle = config.title
    lang.register(btn)

    return btn
  }

  private clickBtn(config: BtnConfig, a: HTMLAnchorElement) {
    // 获取作品 id
    const id = Tools.getIllustId()
    // 从 a.href 里提取出序号
    // 例如对于下面这个链接：
    // https://i.pximg.net/img-original/img/2025/03/14/00/41/16/128179900_p0.png
    // 提取结果为 0
    const p = a.href!.split('_p').pop()?.split('.')[0]
    const index = Number.parseInt(p || '0')

    const idData: IDData = {
      type: 'illusts',
      id,
    }

    if (config.name === 'zoomBtnOnThumb') {
      new ImageViewer({
        workId: id,
        initialViewIndex: index,
        imageSize: settings.magnifierSize,
        autoStart: true,
        showLoading: true,
      })
    } else if (config.name === 'copyBtnOnThumb') {
      copyWorkInfo.receive(idData, index)
    } else if (config.name === 'downloadBtnOnThumb') {
      store.setDownloadOnlyPart(Number.parseInt(id), [index])
      EVT.fire('crawlIdList', [idData])
    }
  }

  /**判断按钮是否应该下移一定距离，避免挡住图片编号。返回值是 top 的数值 */
  // 由于现在按钮会显示在图片外侧，很少会挡住图片编号了，所以这个方法现在没有使用了
  private addBtnOffset() {
    const data = cacheWorkData.get(Tools.getIllustId())

    // 单图作品不需要处理。PS：有些漫画也是单图的
    if (!data || data.body.pageCount === 1) {
      return 0
    }

    // 对于多图插画作品，由于图片的右上角会显示 Pixiv 原本的图片编号，如 “1/5”，
    // 所以需要将按钮下移一定距离，避免遮挡住图片编号
    if (data.body.illustType === 0) {
      // 对于插画作品，如果按钮显示在左上角就不需要加 top
      // 因为图片编号是显示在图片右上角的，左上角没什么元素会被遮挡
      if (settings.magnifierPosition === 'left') {
        return 0
      }
      return 34
    }

    // 对于多图漫画作品，始终设置 60px 的 top
    // 因为左上角有个返回按钮，右上角是图片编号，所以不管显示在左侧还是右侧都要加 top 值
    return 60
  }
}

new ButtonsOnArtworkPage()
