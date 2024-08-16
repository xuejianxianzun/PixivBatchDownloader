import { WorkTypeString } from '../store/StoreType'
import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { states } from '../store/States'
import { toast } from '../Toast'
import { Colors } from '../Colors'
import { lang } from '../Lang'
import { workToolBar } from '../WorkToolBar'
import { pageType } from '../PageType'
import { Tools } from '../Tools'
import { artworkThumbnail } from '../ArtworkThumbnail'
import { novelThumbnail } from '../NovelThumbnail'

// 点击作品的收藏按钮时，下载这个作品
class DownloadOnClickBookmark {
  constructor() {
    this.bindEvents()
  }

  public bindEvents() {
    // 在作品缩略图上点击收藏按钮时，下载这个作品
    artworkThumbnail.onClickBookmarkBtn((el: HTMLElement, id: string) => {
      if (!id) {
        id = Tools.findWorkIdFromElement(el, 'illusts')
      }
      this.send(id)
    })

    novelThumbnail.onClickBookmarkBtn((el: HTMLElement, id: string) => {
      if (!id || id === '0') {
        id = Tools.findWorkIdFromElement(el, 'novels')
        console.log(id)
      }
      this.send(id, 'novels')
    })

    // 在作品页面里点击收藏按钮时，下载这个作品
    workToolBar.register(
      (
        toolbar: HTMLDivElement,
        pixivBMKDiv: HTMLDivElement,
        likeBtn: HTMLButtonElement
      ) => {
        pixivBMKDiv.addEventListener('click', () => {
          if (pageType.type === pageType.list.Artwork) {
            this.send(Tools.getIllustId(window.location.href))
          }

          if (pageType.type === pageType.list.Novel) {
            this.send(Tools.getNovelId(window.location.href), 'novels')
          }
        })
      }
    )
  }

  /**发送作品的 id 和类型，抓取并下载这个作品
   *
   * @type 默认值是 'illusts'
   */
  public send(id: string, type: WorkTypeString = 'illusts') {
    if (settings.downloadOnClickBookmark) {
      EVT.fire('crawlIdList', [
        {
          id,
          type,
        },
      ])
    }
  }
}

const downloadOnClickBookmark = new DownloadOnClickBookmark()
export { downloadOnClickBookmark }
