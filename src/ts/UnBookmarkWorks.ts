import { IDData } from './store/StoreType'
import { API } from './API'
import { lang } from './Lang'
import { log } from './Log'
import { toast } from './Toast'
import { token } from './Token'
import { states } from './store/States'

class UnBookmarkWorks {
  public async start(idList: IDData[]) {
    log.warning(lang.transl('_取消收藏作品'))
    if (idList.length === 0) {
      toast.error(lang.transl('_没有数据可供使用'))
      log.error(lang.transl('_没有数据可供使用'))
      return
    }

    states.busy = true

    const total = idList.length.toString()
    log.log(lang.transl('_当前作品个数', total))
    log.log(lang.transl('_开始获取作品信息'))

    let number = 0
    for (const idData of idList) {
      try {
        const data = await API[
          idData.type === 'novels' ? 'getNovelData' : 'getArtworkData'
        ](idData.id)
        if (data.body.bookmarkData) {
          await API.deleteBookmark(
            data.body.bookmarkData.id,
            idData.type === 'novels' ? 'novels' : 'illusts',
            token.token
          )
        }
      } catch (error) {
        // 处理自己收藏的作品时可能遇到错误。最常见的错误就是作品被删除了，获取作品数据时会产生 404 错误
        // 对于出错的作品直接跳过，不需要对其执行任何操作
        // 不过这种作品无法被删除，执行完毕后还是会留在收藏里
      }
      number++
      log.log(`${number} / ${total}`, 1, false)
    }

    const msg = lang.transl('_取消收藏作品') + ' ' + lang.transl('_完成')
    log.success(msg)
    toast.success(msg, {
      position: 'topCenter',
    })
    states.busy = false
  }
}

const unBookmarkWorks = new UnBookmarkWorks()
export { unBookmarkWorks }
