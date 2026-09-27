import { API } from '../API'
import { EVT } from '../EVT'
import { Config } from '../Config'
import { lang } from '../Language'
import { msgBox } from '../MsgBox'
import { states } from '../store/States'

/** 检查当前用户是否被 pixiv 警告。
 *
 * 抓取阶段和下载阶段都会被覆盖：已下载的文件数量每增加 100 个，或者 API 请求次数每增加 300 次，
 * 就会检查一次站内信。
 * 实际的检查时机受 checkInterval 限制，所以最多会延迟一个 checkInterval 才进行检查 */
class CheckWarningMessage {
  constructor() {
    this.setTimer()
  }

  /** 检查「是否需要检查站内信」的时间间隔。
   *
   * 抓取和下载都可能在短时间内产生大量请求，但检查站内信本身也是一次请求，
   * 间隔太短就会检查得过于频繁，没有必要。
   * ⚠️ 这里复用了 Config.retryTime，如果以后它的值被调整，这个间隔也会跟着变 */
  private readonly checkInterval = Config.retryTime

  /** 已下载（成功保存到硬盘上）的文件数量每增加这个数量，就检查一次站内信 */
  private readonly downloadedUnit = 100

  /** API 请求次数每增加这个数量，就检查一次站内信。
   *
   * 大量抓取时耗时可能以小时计，所以在抓取期间检查站内信会更加稳妥。
   * 300 大致相当于很多列表页里 5 - 6 页的作品数量 */
  private readonly apiRequestUnit = 300

  /** 上次检查站内信时的已下载文件数量 */
  private lastCheckDownloaded = 0
  /** 上次检查站内信时的 API 请求次数 */
  private lastCheckApiRequest = 0

  /** 检查过去 1 小时内的消息 */
  // 如果警告消息的时间过去比较久了，则不再显示提示消息，否则就会无限提示了
  private readonly checkTimeRange = 1 * 60 * 60 * 1000

  /** 每隔一段时间检查一次「是否满足检查站内信的条件」。
   *
   * 不使用 setInterval 是因为检查可能因为 429 重试而耗时很久（甚至超过这个间隔），
   * 那样会让多次检查重叠、发出多余的请求。这里改为上一次结束后再安排下一次 */
  private setTimer() {
    window.setTimeout(async () => {
      try {
        await this.checkCondition()
      } catch (error) {
        console.error(error)
      } finally {
        this.setTimer()
      }
    }, this.checkInterval)
  }

  /** 判断是否满足检查站内信的条件，满足则检查一次 */
  private async checkCondition() {
    const needCheck =
      states.downloadSuccessCount >=
        this.lastCheckDownloaded + this.downloadedUnit ||
      states.apiRequestCount >= this.lastCheckApiRequest + this.apiRequestUnit
    if (!needCheck) {
      return
    }

    // 更新基线。两个条件都以「上次检查站内信时」为基准，所以只要检查了，就都要一起更新
    this.lastCheckDownloaded = states.downloadSuccessCount
    this.lastCheckApiRequest = states.apiRequestCount

    const result = await this.check()
    if (result) {
      this.handleWarning()
    }
  }

  /** 检测到账户被警告之后要做的事 */
  private handleWarning() {
    // 下载中和抓取中的流程会响应这两个事件而自动暂停/停止。
    // 两者都不在时（例如正在执行批量收藏）就不需要触发它们，交给下面的 accountWarning 事件处理。
    // ⚠️ 判断「正在抓取」要用 states.crawling，不能用 states.busy —— busy 还会被
    // 批量取消收藏、批量移除标签等操作设为 true，用它会触发没有意义的 stopCrawl
    let tip = ''
    if (states.downloading) {
      EVT.fire('downloadPause')
      tip = lang.transl('_下载已暂停')
    } else if (states.crawling) {
      EVT.fire('stopCrawl')
      tip = lang.transl('_已停止抓取')
    }

    msgBox.error(
      tip
        ? lang.transl('_过度访问警告') + '<br>' + tip
        : lang.transl('_过度访问警告')
    )

    // 通知那些不理会 stopCrawl / downloadPause 事件、但自身会批量发送请求的模块。
    // 这些模块会检查 states.accountWarning，并停止后续的操作（见 AccountWarning.ts）
    EVT.fire('accountWarning')
  }

  private async check(): Promise<boolean> {
    const data = await API.getLatestMessage(3)
    if (data.error) {
      console.error(data.message)
      return false
    }
    if (data.body.total === 0) {
      return false
    }

    // 获取到的数据是以会话为单位的，也就是最后三个发送消息的账号。包含了每个消息里的最后一条对话
    // 如果与一个用户发送了多条消息，也只会有一条数据，而不会是多条数据
    for (const msgData of data.body.message_threads) {
      if (
        msgData.is_official === true &&
        msgData.thread_name === 'pixiv事務局'
      ) {
        // pixiv事務局 这个账号名称应该是不会变的。它是这个账号：
        // https://www.pixiv.net/users/11
        // 但是下面这个判断条件不清楚以后是否会发生变化
        if (
          msgData.latest_content.includes('policies.pixiv.net') &&
          msgData.latest_content.includes('14')
        ) {
          // 如果找到了官方账号发送的警告消息，则判断时间
          const now = Date.now()
          const msgTime = Number.parseInt(msgData.modified_at + '000')
          if (now - msgTime < this.checkTimeRange) {
            return true
          }
        }
      }
    }

    return false
  }
}

new CheckWarningMessage()
