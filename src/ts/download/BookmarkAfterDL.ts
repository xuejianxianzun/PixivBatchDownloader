import { store } from '../store/Store'
import { Result } from '../store/StoreType'
import { settings } from '../setting/Settings'
import { lang } from '../Language'
import { EVT } from '../EVT'
import { DonwloadSuccessData, DonwloadSkipData } from './DownloadType'
import { bookmark } from '../Bookmark'
import { log } from '../Log'
import { Utils } from '../utils/Utils'
import { filter } from '../filter/Filter'
import { Tools } from '../Tools'

/** 接收下载结果时固定写入对象和设置，排队期间不再读取可变的抓取结果。 */
interface BookmarkAfterDLWork {
  id: string
  type: 'illusts' | 'novels'
  tags: string[]
  needAddTag: boolean
  restrict: boolean
  slowly: boolean
}

/** 一次下载后收藏的队列和进度；重置用新对象隔离仍在等待的旧写入。 */
interface BookmarkAfterDLTask {
  ids: Set<string>
  queue: BookmarkAfterDLWork[]
  successCount: number
  downloadComplete: boolean
  completionLogged: boolean
  resetOnStart: boolean
}

/** 下载成功后收藏作品；一个串行循环负责写入，各批次只更新自己的进度。 */
class BookmarkAfterDL {
  /** 沿用原有提示元素、翻译注册和 200ms 调度。 */
  constructor(tipEl?: HTMLElement) {
    if (tipEl) {
      this.tipEl = tipEl
      lang.register(this.tipEl)
    }
    this.bindEvents()
    this.addBookmark()
  }

  /** 当前批次的唯一身份，同时保存其待处理作品和完成状态。 */
  private task = this.createTask()

  /** 原有设置面板中的进度提示，不创建新的 UI。 */
  private tipEl: HTMLElement = document.createElement('span')

  /** 创建空批次；暂停/继续下载不调用此方法。 */
  private createTask(): BookmarkAfterDLTask {
    return {
      ids: new Set(),
      queue: [],
      successCount: 0,
      downloadComplete: false,
      completionLogged: false,
      resetOnStart: false,
    }
  }

  /** 接收原有成功/重复下载事件，并区分新结果、新下载与暂停后继续。 */
  private bindEvents() {
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      this.send(successData.id)
    })

    window.addEventListener(EVT.list.skipDownload, (ev: CustomEventInit) => {
      const skipData = ev.detail.data as DonwloadSkipData
      // 重复文件仍是用户打算下载的作品；其他过滤跳过不收藏。
      if (skipData.reason === 'duplicate') this.send(skipData.id, skipData.type)
    })

    window.addEventListener(EVT.list.crawlStart, () => this.reset())
    // 恢复保存的下载结果会替换 Store，也属于新的结果集合。
    window.addEventListener(EVT.list.resume, () => this.reset())

    window.addEventListener(EVT.list.downloadComplete, () => {
      this.task.downloadComplete = true
      this.task.resetOnStart = true
      this.showProgress()
    })

    window.addEventListener(EVT.list.downloadStop, () => {
      // 已接收的收藏仍正常处理；停止后的重新下载建立新批次。
      this.task.resetOnStart = true
    })

    window.addEventListener(EVT.list.downloadStart, () => {
      if (this.task.resetOnStart) this.reset()
    })
  }

  /** 仅显示当前批次；文件和收藏的完成先后顺序都只产生一次完成日志。 */
  private showProgress() {
    const task = this.task
    if (task.ids.size === 0) {
      lang.updateText(this.tipEl, '')
      return
    }
    lang.updateText(
      this.tipEl,
      '_已收藏带参数',
      `${task.successCount}/${task.ids.size}`
    )
    if (
      task.downloadComplete &&
      !task.completionLogged &&
      task.successCount === task.ids.size
    ) {
      task.completionLogged = true
      log.success('♥️' + lang.transl('_收藏作品完毕'))
    }
  }

  /** 丢弃尚未执行的旧队列，已开始的写入仍由同一个循环等待真实结果。 */
  private reset() {
    this.task = this.createTask()
    this.tipEl.classList.remove('red')
    this.tipEl.classList.add('green')
    this.showProgress()
  }

  /** 优先使用原有元数据；没有元数据的恢复结果仍使用 result。 */
  private findData(id: number, type?: BookmarkAfterDLWork['type']) {
    const dataSource =
      store.resultMeta.length > 0 ? store.resultMeta : store.result
    let found: Result | undefined
    for (const data of dataSource) {
      if (data.idNum !== id) continue
      const family = data.type === 3 ? 'novels' : 'illusts'
      if (type && family !== type) continue
      // 纯数字 ID 同时对应小说和动图时，缺少类型信息不能任选一个写入。
      if (found && (found.type === 3) !== (data.type === 3)) return
      found ??= data
    }
    return found
  }

  /** 固定类型、标签、公开范围和慢速条件；同作品的多张图片只入队一次。 */
  private send(fileID: string, resultType?: Result['type']) {
    if (!settings.bmkAfterDL) return
    const match = fileID.match(/^(\d+)(?:_p\d+)?$/)
    if (!match) return
    const id = Number.parseInt(match[1])
    if (!Number.isSafeInteger(id) || id <= 0) return

    const type =
      resultType === 3
        ? 'novels'
        : resultType !== undefined || fileID.includes('_p')
          ? 'illusts'
          : undefined
    const data = this.findData(id, type)
    const family = data ? (data.type === 3 ? 'novels' : 'illusts') : type
    const key = `${family || 'unknown'}:${id}`
    if (this.task.ids.has(key)) return
    this.task.ids.add(key)

    if (data) {
      this.task.queue.push({
        id: id.toString(),
        type: data.type === 3 ? 'novels' : 'illusts',
        tags: [...data.tags],
        needAddTag: settings.widthTagBoolean,
        restrict: settings.restrictBoolean,
        slowly: store.result.length > 30,
      })
    } else {
      // 缺失的数据仍计入总数，不能让部分成功伪装成全部完成。
      log.error(`${id} ${lang.transl('_没有可用的抓取结果')}`)
    }
    this.showProgress()
  }

  /** 保留串行写入及 200ms 间隔；失败或旧批次响应都不会停止后续处理。 */
  private async addBookmark(): Promise<void> {
    while (true) {
      await Utils.sleep(200)
      const task = this.task
      const work = task.queue.shift()
      if (!work) continue

      // 用户手动排除的作品不收藏。这里在真正写入之前才判断，
      // 所以排队期间被排除的作品也会被跳过。
      // 跳过的作品计入已完成数量，否则进度会一直差几个，永远等不到「收藏完毕」
      if (!filter.checkExcluded(work.id, work.type)) {
        log.warning(
          '⏭️' +
            lang.transl(
              '_跳过收藏因为用户排除了作品',
              Tools.createWorkLinkByIDData({ id: work.id, type: work.type })
            )
        )
        task.successCount++
        this.showProgress()
        continue
      }

      let status = 0
      try {
        status = await bookmark.add(
          work.id,
          work.type,
          work.tags,
          work.needAddTag,
          work.restrict,
          work.slowly
        )
      } catch {
        if (task === this.task)
          log.error(`${work.id} ${lang.transl('_添加收藏失败')}`)
      }

      if (task !== this.task) continue
      if (status === 200) {
        task.successCount++
        this.showProgress()
      }
    }
  }
}

export { BookmarkAfterDL }
