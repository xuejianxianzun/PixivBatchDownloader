import { EVT } from '../EVT'
import { lang } from '../Language'
import { log } from '../Log'
import { setTimeoutWorker } from '../SetTimeoutWorker'
import { settings } from '../setting/Settings'
import { toast } from '../Toast'
import { MergeNovel } from './MergeNovel'

// 抓取小说时，如果某个小说属于系列小说，则合并这个系列小说
class AutoMergeNovel {
  constructor() {
    this.bindEvents()
  }

  /** 等待队列。因为合并小说时使用了任务队列，每次只执行一个任务，所以需要有等待队列 */
  // 合并小说时经常需要发送很多请求并下载很多图片，所以不能并发执行，以免因为频繁的请求和下载导致账号被封禁
  // 在执行过程中，等待队列里的 id 数量会变化，范围是 0 - 同时抓取的数量
  // 例如同时抓取数量为 3 的话，一开始的 3 个小说可能都属于系列，就会导致等待队列里有 3 个系列 id
  // 等到抓取完毕时，等待队列会变成空的
  private pendingQueue: string[] = []
  /** 已完成的队列 */
  // 抓取完毕时，已完成的队列里的 id 数量就是合并了多少个系列的数量
  private completedQueue: string[] = []
  /** 正在合并（尚未完成）的系列 id */
  private workingId = ''
  /* *保存系列 id 和它对应的标题，用于在日志里显示**/
  private idTitleMap: { [key: string]: string } = {}
  /** 指示是否可以工作。当抓取完毕、抓取停止时，不再处理等待队列里的任务，但当前进行中的这个合并任务会正常执行完。 */
  private stop = true

  /** 在本次抓取任务里，自动合并的系列里一共包含多少篇小说 */
  private novelTotal = 0

  /** 添加系列 id，需要避免重复添加。返回值表示是否添加了这个 id。如果返回值为 false，说明这个 id 已存在 */
  private push(seriesId: string) {
    if (
      this.pendingQueue.includes(seriesId) ||
      this.completedQueue.includes(seriesId)
    ) {
      return false
    }
    this.pendingQueue.push(seriesId)
    return true
  }

  /** 获取下一个系列 id 进行处理。这个 id 依然存在于 pendingQueue 里，等到合并完成后才会移除它 */
  private async next(): Promise<string> {
    while (true) {
      if (
        this.pendingQueue.length > 0 &&
        this.pendingQueue[0] !== this.workingId
      ) {
        return this.pendingQueue[0]
      }
      await setTimeoutWorker.sleep(100)
    }
  }

  /** 如果某个系列 id 已经存在于等待队列里，则等待这个系列合并完成（等待它从等待队列里移除） */
  private async waitMergeComplete(seriesId: string) {
    while (true) {
      if (this.stop || !this.pendingQueue.includes(seriesId)) {
        return
      }
      await setTimeoutWorker.sleep(500)
    }
  }

  // 参数 forceStart: 如果为 true，则使 this.stop = false，以便可以执行合并操作
  public async merge(
    seriesId: string,
    seriesTitle?: string,
    forceStart = false
  ) {
    if (!seriesId) {
      toast.error('seriesId is undefined')
      return
    }

    if (forceStart) {
      this.stop = false
    }

    const absent = this.push(seriesId)
    if (!absent) {
      // 如果这个系列 id 已经存在，则检查它是否在等待队列里
      // 如果是，则等到这个系列合并完成（从等待队列里移除）再返回
      // 这个等待机制是为了解决这个问题：
      // getWorksData 抓取小说数据时，可能有连续多个小说作品都属于同一个系列（特别是在小说系列页面里抓取时）
      // 当第一个小说调用这个 merge 方法时，会在下面等待合并完成
      // 但当后续作品调用这个 merge 方法时，由于 absent 为 false，不会实际合成
      // 如果在这里立刻返回，getWorksData 会继续抓取下一个小说，导致它和 MergeNovel.merge 同时发送请求
      // 尤其是当作品数量不满足“减慢抓取速度”的条件时，getWorksData 的抓取速度很快
      // 这样两个模块会同时发送请求，会增加用户被 Pixiv 警告的风险
      // 所以如果 absent 为 false，则等待这个系列合并完成（这会让 getWorksData 也保持等待），避免两个模块同时发送请求
      await this.waitMergeComplete(seriesId)
      return
    }

    if (this.stop) {
      // console.log('auto merge stopped')
      return
    }

    this.idTitleMap[seriesId] = seriesTitle || ''

    this.showTip()

    this.workingId = await this.next()
    const seriesTitleLog = this.idTitleMap[this.workingId]
    const novelTotal = await new MergeNovel().merge(
      this.workingId,
      seriesTitleLog,
      true
    )

    if (this.stop) {
      // console.log('auto merge stopped')
      return
    }

    this.novelTotal += novelTotal
    // shift() 所移除的 id 就是 this.workingId
    this.pendingQueue.shift()
    this.workingId && this.completedQueue.push(this.workingId)
    this.workingId = ''
  }

  private enableTip = true
  private bindEvents() {
    // 抓取完毕、抓取停止时，重置一些状态
    // 当抓取停止时，如果当前正在合并一个系列，那么它会正常完成，不会被取消。剩余的合并任务会取消（因为等待队列会被清空）
    const stopEvents = [EVT.list.crawlComplete, EVT.list.stopCrawl]
    stopEvents.forEach((evt) => {
      window.addEventListener(evt, () => {
        window.setTimeout(() => {
          const completed = this.completedQueue.length
          if (completed > 0) {
            const msg = lang.transl(
              '_本次抓取一共合并了x个系列小说包含y篇小说',
              completed.toString(),
              this.novelTotal.toString()
            )
            log.log(msg)
            log.log('')
          }

          if (evt === EVT.list.stopCrawl && this.workingId) {
            log.warning(lang.transl('_提示有一个系列正在合并中'))
          }

          this.reset()
        }, 0)
      })
    })

    window.addEventListener(EVT.list.crawlStart, () => {
      this.stop = false
    })
  }

  private reset() {
    this.stop = true
    // 允许再次显示提示
    this.enableTip = true
    // 重置队列
    // 由于自动合并是与抓取串行（交替进行）的，所以抓取完毕时，自动合并的任务也肯定全部完成了，所以可以重置状态
    // 重置是为了在重复抓取时可以重复合并同一个系列
    // 如果不重置的话，由于队列里已经存在了这个系列 id，那么在重复抓取时就会导致不会再合并这个系列
    this.pendingQueue = []
    this.completedQueue = []
    this.workingId = ''
    this.idTitleMap = {}
    this.novelTotal = 0
  }

  private showTip() {
    // 每次抓取期间只显示一次提示
    if (this.enableTip) {
      this.enableTip = false

      // 在窗口中间显示轻提示，这是因为“开始抓取”的提示也位于中间，保持一致
      toast.warning(lang.transl('_自动合并系列小说'), {
        position: 'center',
      })

      log.warning(lang.transl('_自动合并系列小说时提示会添加间隔时间'))
      if (settings.skipNovelsInSeriesWhenAutoMerge) {
        log.warning(lang.transl('_不再单独下载系列里的小说'))
      }
    }
  }
}

const autoMergeNovel = new AutoMergeNovel()
export { autoMergeNovel }
