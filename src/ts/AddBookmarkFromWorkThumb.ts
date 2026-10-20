import { bookmark } from './Bookmark'
import { bookmarkPanel } from './BookmarkPanel'
import { Colors } from './Colors'
import { ArtworkData, NovelData } from './crawl/CrawlResult'
import { lang } from './Language'
import { msgBox } from './MsgBox'
import { pageType } from './PageType'
import { settings } from './setting/Settings'
import { toast } from './Toast'
import { Tools } from './Tools'

// 在预览作品、查看原图时，或者点击作品缩略图上的收藏按钮时，收藏这个作品
class AddBookmarkFromWorkThumb {
  /**收藏一个作品
   *
   * @param workData 图像作品或小说作品的数据
   *
   * @param workEL 作品缩略图的元素。下载器收藏之后，会尝试把 Pixiv 的收藏按钮变成红色
   *
   * @param onConfirmed 用户确认收藏之后（没有显示操作面板时，就是开始收藏之前）调用。
   * 此时还没有发送收藏请求。调用方可以在这里执行“点击收藏按钮时下载作品”之类的操作；
   * 用户取消了操作面板时不会调用它。
   */
  public async add(
    workData?: ArtworkData | NovelData,
    workEL?: HTMLElement,
    onConfirmed?: () => void
  ) {
    if (workData === undefined) {
      return
    }

    // 区分图像作品和小说作品，这样调用收藏模块时才能传入正确的 id 和类型
    let id = ''
    let type: 'illusts' | 'novels' = 'illusts'
    if (Tools.isArtworkData(workData)) {
      id = workData.body.illustId
      type = 'illusts'
    } else {
      id = workData.body.id
      type = 'novels'
    }

    if (!id) {
      return
    }

    // 按照“是否添加标签”设置来决定使用原始标签还是翻译后的标签
    let tags = bookmark.getTagsBySetting(workData)
    let restrict: boolean | undefined = undefined
    // 是否添加标签。不指定时使用“是否添加标签”设置的值
    let needAddTag: boolean | undefined = undefined

    // 启用了操作面板时，先显示面板，等用户在面板上确认之后再收藏
    if (settings.showBookmarkPanel) {
      const option = await bookmarkPanel.show(id, type, workData)
      if (!option) {
        // 用户取消了面板，不进行收藏
        return
      }
      tags = option.tags
      restrict = option.restrict
      // 面板里的标签列表是用户明确选择的，所以要覆盖“是否添加标签”设置
      needAddTag = true
    }

    // 用户已经确认收藏（没有启用面板时就是开始收藏）。在发送收藏请求之前通知调用方
    onConfirmed?.()

    toast.show(lang.transl('_收藏'), {
      bgColor: Colors.bgBlue,
    })

    const status = await bookmark.add(id, type, tags, needAddTag, restrict)

    if (status === 200) {
      toast.success(lang.transl('_已收藏'))

      // 将作品缩略图上的收藏按钮变成红色
      if (workEL) {
        const allSVG = workEL.querySelectorAll('svg')
        if (allSVG.length > 0) {
          // 如果有多个 svg，一般最后一个是收藏按钮
          let useSVG = allSVG[allSVG.length - 1]

          // 但有些特殊情况是第一个
          if (pageType.type === pageType.list.Request) {
            useSVG = allSVG[0]
          }

          // 多图作品里可能有两个 svg，一个是右上角的图片数量，一个是收藏按钮
          // 区别是收藏按钮在 button 元素里
          const btnSVG = workEL.querySelector('button svg') as SVGSVGElement
          if (btnSVG) {
            useSVG = btnSVG
          }

          useSVG.style.color = 'rgb(255, 64, 96)'
          const allPath = useSVG.querySelectorAll('path')
          for (const path of allPath) {
            path.style.fill = 'currentcolor'
          }

          // 点击收藏按钮时，触发收藏按钮的点击事件
          // 之前有 clickBtn 参数，但现在去掉了，因为不应该点击收藏按钮。原因是：下载器会先添加收藏（默认会附带标签），如果点击了收藏按钮，会导致触发一次收藏按钮原本的收藏事件，并且这次收藏没有附带标签，导致第一次收藏时附带的标签被覆盖掉了
          // if (clickBtn) {
          //   const btn = useSVG.closest('button')
          //   if (btn && clickBtn) {
          //     btn.click()
          //   }
          // }
        }

        // 排行榜页面的收藏按钮
        const btn = workEL.querySelector('._one-click-bookmark')
        if (btn) {
          btn.classList.add('on')
        }
      }
    } else {
      const msg = lang.transl('_添加收藏失败')
      msgBox.error(msg)
      toast.error(msg)
    }
  }
}

const addBookmarkFromWorkThumb = new AddBookmarkFromWorkThumb()
export { addBookmarkFromWorkThumb }
