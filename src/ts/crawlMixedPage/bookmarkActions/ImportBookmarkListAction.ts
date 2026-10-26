import { bookmark } from '../../Bookmark'
import { EVT } from '../../EVT'
import { BookmarkResult } from '../../crawl/CrawlResult'
import { lang } from '../../Language'
import { log } from '../../Log'
import { msgBox } from '../../MsgBox'
import { store } from '../../store/Store'
import { toast } from '../../Toast'
import { Utils } from '../../utils/Utils'

class ImportBookmarkListAction {
  constructor(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => {
      void this.importBookmarkIDList()
    })
  }

  private async importBookmarkIDList() {
    const loaded = (await Utils.loadJSONFilesWithFiles<
      BookmarkResult[]
    >().catch((err) => {
      return msgBox.error(err)
    })) as { files: File[]; data: BookmarkResult[][] } | undefined
    if (!loaded) {
      return
    }

    // 收藏较多时导出会被拆成多个文件，这里把它们合并到一起导入
    const loadedJSON: BookmarkResult[] = []
    for (const data of loaded.data) {
      if (!Array.isArray(data) || !data.length || !data[0]) {
        return toast.error(lang.transl('_格式错误'))
      }
      for (const item of data) {
        loadedJSON.push(item)
      }
    }

    const keys = Object.keys(loadedJSON[0])
    const need = ['id', 'type', 'tags']
    for (const field of need) {
      if (!keys.includes(field)) {
        return toast.error(lang.transl('_格式错误'))
      }
    }

    const tip = lang.transl('_导入收藏列表')
    toast.success(tip)
    log.success('🚀' + tip)
    // 数据较多时会分成多个文件，所以显示一下本次导入的文件名，便于用户确认
    log.log(
      lang.transl('_本次导入的文件', loaded.files.map((f) => f.name).join(', '))
    )
    log.log(lang.transl('_作品数量') + ` ${loadedJSON.length}`)

    EVT.fire('closeSettingsPanel')

    let oldList: BookmarkResult[] = []
    if (loadedJSON.length > 200) {
      log.warning(lang.transl('_提示会跳过已收藏的作品'))
      log.log(lang.transl('_加载收藏列表'))
      const userID = store.loggedUserID
      const loadIllust = loadedJSON.some((item) => item.type === 'illusts')
      const loadNovel = loadedJSON.some((item) => item.type === 'novels')
      if (loadIllust) {
        log.log(lang.transl('_插画') + ', ' + lang.transl('_公开'))
        const illustsPublic = await bookmark.getAllBookmarkList(
          userID,
          'illusts',
          '',
          0,
          false
        )

        log.log(lang.transl('_插画') + ', ' + lang.transl('_不公开'))
        const illustsPrivate = await bookmark.getAllBookmarkList(
          userID,
          'illusts',
          '',
          0,
          true
        )

        oldList = oldList.concat(illustsPublic, illustsPrivate)
      }
      if (loadNovel) {
        log.log(lang.transl('_小说') + ', ' + lang.transl('_公开'))
        const novelsPublic = await bookmark.getAllBookmarkList(
          userID,
          'novels',
          '',
          0,
          false
        )

        log.log(lang.transl('_小说') + ', ' + lang.transl('_不公开'))
        const novelsPrivate = await bookmark.getAllBookmarkList(
          userID,
          'novels',
          '',
          0,
          true
        )

        oldList = oldList.concat(novelsPublic, novelsPrivate)
      }

      log.log(lang.transl('_一共有x个', oldList.length.toString()))
    }

    bookmark.addBookmarksInBatchs(loadedJSON, oldList)
  }
}

export { ImportBookmarkListAction }
