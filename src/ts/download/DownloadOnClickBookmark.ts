import { WorkTypeString } from '../store/StoreType'
import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { states } from '../store/States'
import { toast } from '../Toast'
import { Colors } from '../config/Colors'
import { lang } from '../Lang'

// 点击作品的收藏按钮时，下载这个作品
class DownloadOnClickBookmark {
  /**发送作品的 id 和类型，抓取并下载这个作品
   *
   * type 默认值是 'illusts'
   */
  static send(id: string, type: WorkTypeString = 'illusts') {
    if (settings.downloadOnClickBookmark) {
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

export { DownloadOnClickBookmark }
