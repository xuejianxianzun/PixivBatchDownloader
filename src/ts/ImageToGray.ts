import { EVT } from './EVT'
import { settings } from './setting/Settings'

// 把图片变成灰色，不显示图片内容避免被别人发现在看 H
class ImageToGray {
  constructor() {
    this.bindEvents()
  }

  private style?: HTMLStyleElement

  private bindEvents() {
    window.addEventListener(EVT.list.getPageTheme, (ev: CustomEventInit) => {
      if (ev.detail.data) {
        this.updateStyle()
      }
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'coverImage') {
        this.updateStyle()
      }
    })
  }

  private updateStyle() {
    settings.coverImage ? this.setStyle() : this.removeStyle()
  }

  private setStyle() {
    this.removeStyle()

    this.style = document.createElement('style')
    // 本来想使用 img::before 在图片上覆盖一层元素，但是 img 不能有子元素，所以 ::before 无效
    // 之后改为使用滤镜，还更简单了
    // https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter

    // brightness 滤镜为 0 可以把图片变成纯黑；值为 100 大致是全白的，但是一些颜色还是会显示出来，不完美
    // brightness() 函数将线性乘法器应用于输入图像，使其看起来或多或少地变得明亮。值为 0% 将创建全黑图像。值为 100% 会使输入保持不变。其他值是效果的线性乘数。如果值大于 100% 提供更明亮的结果。

    // 另一种方案是用 contrast(0) 滤镜把图片都显示灰色
    // contrast() 函数可调整输入图像的对比度。值是 0% 的话，图像会全黑。值是 100%，图像不变。值可以超过 100%，意味着会运用更低的对比。若没有设置值，默认是 1。
    this.style.innerHTML = `
      /* 让图片还有一些背景图片变成灰色 */
      img, .sc-x1dm5r-0, .jSwXpE, .gLVttt, .hmCglJ, .sc-mfqjj-5, .fpdtUH, .gOATqM, .sc-k3uf3r-2{
        filter: contrast(0);
      }
      /* 让作品缩略图左上角的 R-18 角标里的文字不显示 */
      .sc-1ovn4zb-0, .efxZOo, .bfWaOT{
        color: rgb(255, 64, 96);
      }
      .xxxxx{
        background: transparent;
      }`
    document.body.append(this.style)
  }

  private removeStyle() {
    this.style && this.style.remove()
  }
}

new ImageToGray()
