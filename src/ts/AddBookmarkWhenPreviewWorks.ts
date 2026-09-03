import { bookmark } from './Bookmark'
import { Colors } from './Colors'
import { ArtworkData } from './crawl/CrawlResult'
import { lang } from './Language'
import { pageType } from './PageType'
import { toast } from './Toast'
import { Tools } from './Tools'

// 在预览作品、查看原图时，收藏这个作品
class AddBookmarkWhenPreviewWorks {
  public async add(
    workData?: ArtworkData,
    workEL?: HTMLElement,
    clickBtn = false
  ) {
    if (workData?.body.illustId === undefined) {
      return
    }

    toast.show(lang.transl('_收藏'), {
      bgColor: Colors.bgBlue,
    })

    const status = await bookmark.add(
      workData.body.illustId,
      'illusts',
      Tools.extractTags(workData)
    )

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
          // 注释掉了，因为不应该点击收藏按钮。原因是：下载器会先添加收藏（默认会附带标签），如果点击了收藏按钮，会导致触发一次收藏按钮原本的收藏事件，并且这次收藏没有附带标签，导致第一次收藏时附带的标签被覆盖掉了
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
    }
  }
}

const addBookmarkWhenPreviewWorks = new AddBookmarkWhenPreviewWorks()
export { addBookmarkWhenPreviewWorks }
