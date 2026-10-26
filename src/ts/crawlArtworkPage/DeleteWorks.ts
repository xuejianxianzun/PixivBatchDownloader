import { lang } from '../Language'
import { Tools } from '../Tools'
import { toast } from '../Toast'
import { SearchResultPreview } from './SearchResultPreview'

// 在搜索页面里添加批量清除作品的按钮（清除多图作品、清除动图作品）
//
// 这个模块只负责添加这两个按钮并绑定点击事件。它不接触抓取结果，点击按钮时直接调用
// SearchResultPreview 的方法 —— 抓取结果、作品列表容器、页面重绘都由预览模块负责。
//
// 之前这里是派发全局事件（clearMultiple / clearUgoira）来通知预览模块的，
// 但这两个模块只在搜索页面里一对一存在，用全局事件反而绕了一圈，所以改成了直接调用。
//
// 原先还有一个「手动删除作品」按钮（在预览卡片上点击即从抓取结果删除），
// 因为它的作用与「手动排除作品」重复，已被移除。需要删除作品时请使用「手动排除作品」。
class DeleteWorks {
  constructor(private readonly preview: SearchResultPreview) {}

  /** 添加本模块提供的全部按钮 */
  public addBtns() {
    this.addFilterBtn('_清除多图作品', 'clearMultiImageWork', () =>
      this.preview.clearMultiple()
    )
    this.addFilterBtn('_清除动图作品', 'clearUgoiraWork', () =>
      this.preview.clearUgoira()
    )
  }

  /** 添加由预览模块处理的“清除某一类作品”的按钮 */
  private addFilterBtn(text: string, id: string, callback: () => void) {
    Tools.addBtn(
      'filterCrawlResultBtns',
      text,
      '',
      id,
      'secondary',
      'danger'
    ).addEventListener(
      'click',
      () => {
        if (!this.checkCanDelete()) {
          return
        }

        callback()
      },
      false
    )
  }

  /** 检查是否存在可以操作的抓取结果 */
  private checkCanDelete() {
    if (!this.preview.hasResult) {
      toast.error(lang.transl('_没有可用的抓取结果'))
      return false
    }
    return true
  }
}

export { DeleteWorks }
