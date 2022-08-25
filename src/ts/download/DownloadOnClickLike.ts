import { Colors } from '../config/Colors'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { states } from '../store/States'
import { WorkTypeString } from '../store/StoreType'
import { toast } from '../Toast'
import { Tools } from '../Tools'
import { workToolBar } from '../WorkToolBar'

// 在作品页面里点赞时，下载这个作品
class DownloadOnClickLike {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    workToolBar.register(
      (
        toolbar: HTMLDivElement,
        pixivBMKDiv: HTMLDivElement,
        likeBtn: HTMLButtonElement
      ) => {
        likeBtn.addEventListener('click', () => {
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
  private send(id: string, type: WorkTypeString = 'illusts') {
    if (settings.downloadOnClickLike) {
      states.quickCrawl = true

      EVT.fire('crawlIdList', [
        {
          id,
          type,
        },
      ])

      toast.show(lang.transl('_已发送下载请求'), {
        bgColor: Colors.bgBlue,
        position: 'mouse',
      })
    }
  }
}

new DownloadOnClickLike()
