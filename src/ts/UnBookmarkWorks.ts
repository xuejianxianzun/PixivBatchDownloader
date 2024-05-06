import { API } from './API'
import { lang } from './Lang'
import { log } from './Log'
import { toast } from './Toast'
import { token } from './Token'
import { states } from './store/States'
import { WorkBookmarkData } from './Bookmark'
import { setTimeoutWorker } from './SetTimeoutWorker'
import { Config } from './Config'
import { settings } from './setting/Settings'

class UnBookmarkWorks {
  public async start(list: WorkBookmarkData[]) {
    log.warning(lang.transl('_取消收藏作品'))
    if (list.length === 0) {
      toast.error(lang.transl('_没有数据可供使用'))
      log.error(lang.transl('_没有数据可供使用'))
      return
    }

    states.busy = true

    const total = list.length
    log.log(lang.transl('_当前作品个数', total.toString()))

    // 尚不清楚 deleteBookmark 使用的 API 是否会被计入 429 限制里
    // 当操作的作品数量大于一页（48 个作品）时，使用慢速抓取
    const slowMode = total > 48

    let progress = 0

    for (const item of list) {
      try {
        await this.waitSlowMode(slowMode)
        await API.deleteBookmark(item.bookmarkID, item.type, token.token)
      } catch (error) {
        // 处理自己收藏的作品时可能遇到错误。最常见的错误就是作品被删除了，获取作品数据时会产生 404 错误
        // 对于出错的作品直接跳过，不需要对其执行任何操作
        // 不过这种作品无法被删除，执行完毕后还是会留在收藏里
      }
      progress++
      log.log(`${progress} / ${total}`, 1, false)
    }

    const msg = lang.transl('_取消收藏作品') + ' ' + lang.transl('_完成')
    log.success(msg)
    toast.success(msg, {
      position: 'topCenter',
    })
    states.busy = false
  }

  private waitSlowMode(slowMode: boolean): Promise<void> {
    return new Promise((resolve) => {
      if (!slowMode) {
        return resolve()
      } else {
        setTimeoutWorker.set(() => {
          return resolve()
        }, settings.slowCrawlDealy)
      }
    })
  }
}

const unBookmarkWorks = new UnBookmarkWorks()
export { unBookmarkWorks }
