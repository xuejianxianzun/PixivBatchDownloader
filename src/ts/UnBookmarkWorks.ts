import { canRequestInBatch } from './AccountWarning'
import { API } from './API'
import { lang } from './Language'
import { log } from './Log'
import { toast } from './Toast'
import { token } from './Token'
import { states } from './store/States'
import { WorkBookmarkData } from './Bookmark'
import { settings } from './setting/Settings'
import { Utils } from './utils/Utils'

class UnBookmarkWorks {
  public async start(list: WorkBookmarkData[]) {
    if (!canRequestInBatch('_取消收藏作品')) {
      return
    }

    log.warning(lang.transl('_取消收藏作品'))
    if (list.length === 0) {
      toast.error(lang.transl('_没有数据可供使用'))
      log.error(lang.transl('_没有数据可供使用'))
      return
    }

    states.busy = true

    const total = list.length
    log.log(lang.transl('_当前有x个作品', total.toString()))

    // 当操作的作品数量大于一页（48 个作品）时，使用慢速抓取
    const slowMode = total > 48

    let progress = 0
    // 是否因为账户被警告而中止了遍历
    let aborted = false

    for (const item of list) {
      // 账户被警告时终止遍历，不再发出后续的请求
      if (!canRequestInBatch('_取消收藏作品')) {
        aborted = true
        break
      }

      try {
        await this.waitSlowMode(slowMode)
        await API.deleteBookmark(item.bookmarkID, item.type, token.token)
      } catch (error) {
        // 处理自己收藏的作品时可能遇到错误。最常见的错误就是作品被删除了，获取作品数据时会产生 404 错误
        // 对于出错的作品直接跳过，不需要对其执行任何操作
        // 不过这种作品无法被删除，执行完毕后还是会留在收藏里
      }
      progress++
      log.log(`${progress} / ${total}`, 'unBookmarkWorksProgress')
    }

    states.busy = false

    // 因为账户被警告而中止时，不显示「完成」的提示
    if (aborted) {
      return
    }

    const msg = lang.transl('_取消收藏作品') + ' ' + lang.transl('_完成')
    log.success(msg)
    toast.success(msg, {
      position: 'center',
    })
  }

  private async waitSlowMode(slowMode: boolean) {
    if (slowMode) {
      return Utils.sleep(settings.slowCrawlDealy)
    }
  }
}

const unBookmarkWorks = new UnBookmarkWorks()
export { unBookmarkWorks }
