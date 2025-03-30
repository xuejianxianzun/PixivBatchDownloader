import { lang } from './Lang'
import { log } from './Log'
import { toast } from './Toast'
import { states } from './store/States'
import { bookmark, WorkBookmarkData } from './Bookmark'
import { msgBox } from './MsgBox'

// 移除本页面中所有作品的标签
class RemoveWorksTagsInBookmarks {
  public async start(list: WorkBookmarkData[]) {
    if (list.length === 0) {
      toast.error(lang.transl('_没有数据可供使用'))
      log.error(lang.transl('_没有数据可供使用'))
      return
    }

    states.busy = true

    const total = list.length.toString()
    log.log(lang.transl('_当前作品个数', total))

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
          msgBox.error(
            `Add bookmark: ${item.workID}, Error: 403 Forbidden, ${lang.transl(
              '_你的账号已经被Pixiv限制'
            )}`
          )
          break
        }
      } catch (error) {
        // 处理自己收藏的作品时可能遇到错误。最常见的错误就是作品被删除了，获取作品数据时会产生 404 错误
        // 但是也可能出现其他错误，比如因为请求太多而出现 429 错误。因为 429 错误需要等待几分钟后才能重试，这里偷懒不再重试
      }
      number++
      log.log(`${number} / ${total}`, 1, false)
    }

    const msg =
      lang.transl('_移除本页面中所有作品的标签') + ' ' + lang.transl('_完成')
    log.success(msg)
    toast.success(msg, {
      position: 'topCenter',
    })
    states.busy = false
  }
}

const removeWorksTagsInBookmarks = new RemoveWorksTagsInBookmarks()
export { removeWorksTagsInBookmarks }
