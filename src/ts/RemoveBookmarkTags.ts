import { canRequestInBatch } from './AccountWarning'
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
    if (!canRequestInBatch('_移除收藏标签')) {
      return
    }

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
    // 处理失败的作品数量（例如断网、作品被删除）。完成时需要如实告诉用户
    let failed = 0
    // 是否因为账户被警告而中止了遍历
    let aborted = false
    for (const item of list) {
      // 账户被警告时终止遍历，不再发出后续的请求
      if (!canRequestInBatch('_移除收藏标签')) {
        aborted = true
        break
      }

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

        // 只要不是 200 就说明这个作品没有处理成功，需要如实统计
        if (status !== 200) {
          failed++
        }
      } catch (error) {
        // 处理自己收藏的作品时可能遇到错误。最常见的错误就是作品被删除了，获取作品数据时会产生 404 错误
        // 但是也可能出现其他错误，比如因为请求太多而出现 429 错误。因为 429 错误需要等待几分钟后才能重试，这里偷懒不再重试
        failed++
      }
      number++
      log.log(`${number} / ${total}`, 'removeWorksTagsProgress')

      if (slowMode) {
        await Utils.sleep(settings.slowCrawlDealy)
      }
    }

    states.busy = false

    // 因为账户被警告而中止时，不显示「完成」的提示
    if (aborted) {
      return
    }

    const completeMsg =
      lang.transl('_移除本页面中所有作品的标签') + ' ' + lang.transl('_完成')
    if (failed > 0) {
      // 有失败时如实说明失败数量，并提示用户可以再次执行来重试
      const msg =
        completeMsg +
        ' ' +
        lang.transl('_有x个作品失败请再次执行重试', failed.toString())
      log.error(msg)
      toast.error(lang.transl('_收藏作品完毕但是有一些失败了'))
    } else {
      log.success(completeMsg)
      toast.success(completeMsg)
    }
  }
}

const removeBookmarkTags = new RemoveBookmarkTags()
export { removeBookmarkTags }
