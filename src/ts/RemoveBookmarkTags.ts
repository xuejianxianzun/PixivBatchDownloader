import { lang } from './Language'
import { log } from './Log'
import { toast } from './Toast'
import { states } from './store/States'
import { bookmark, WorkBookmarkData } from './Bookmark'
import { msgBox } from './MsgBox'
import { Tools } from './Tools'
import { settings } from './setting/Settings'
import { Utils } from './utils/Utils'

// 移除已收藏的作品的标签
class RemoveBookmarkTags {
  public async start(list: WorkBookmarkData[]) {
    if (list.length === 0) {
      toast.error(lang.transl('_没有数据可供使用'))
      log.error(lang.transl('_没有数据可供使用'))
      return
    }

    states.busy = true

    const total = list.length.toString()
    log.log(lang.transl('_当前有x个作品', total))

    let slowMode = false

    // 如果作品数量超过 1 页，就启用慢速模式
    if (list.length > 48) {
      slowMode = true
      log.warning(lang.transl('_慢速抓取'))
    }

    let number = 0
    for (const item of list) {
      try {
        const status = await bookmark.add(
          item.workID.toString(),
          item.type,
          [],
          false,
          item.private,
          true
        )

        if (status === 403) {
          const msg = Tools.addBookmark403Error()
          msgBox.error(msg)
          break
        }
      } catch (error) {
        // 处理自己收藏的作品时可能遇到错误。最常见的错误就是作品被删除了，获取作品数据时会产生 404 错误
        // 但是也可能出现其他错误，比如因为请求太多而出现 429 错误。因为 429 错误需要等待几分钟后才能重试，这里偷懒不再重试
      }
      number++
      log.log(`${number} / ${total}`, 'removeWorksTagsProgress')

      if (slowMode) {
        await Utils.sleep(settings.slowCrawlDealy)
      }
    }

    const msg =
      lang.transl('_移除本页面中所有作品的标签') + ' ' + lang.transl('_完成')
    log.success(msg)
    toast.success(msg)
    states.busy = false
  }
}

const removeBookmarkTags = new RemoveBookmarkTags()
export { removeBookmarkTags }
