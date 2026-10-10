import { canRequestInBatch } from './AccountWarning'
import { API } from './API'
import { ArtworkCommonData, BookmarkResult } from './crawl/CrawlResult'
import { EVT } from './EVT'
import { lang } from './Language'
import { log } from './Log'
import { settings } from './setting/Settings'
import { toast } from './Toast'
import { token } from './Token'
import { Tools } from './Tools'
import { Utils } from './utils/Utils'

export interface WorkBookmarkData {
  workID: number
  type: 'illusts' | 'novels'
  bookmarkID: string
  private: boolean
  bookmarkTags: string[]
}

// 对 API.addBookmark 进行封装
class Bookmark {
  constructor() {
    window.addEventListener(EVT.list.downloadComplete, () => {
      if (this.taskID > this.nextTaskID) {
        const msg = lang.transl('_收藏任务尚未完成请等待')
        log.warning(msg)
        toast.warning(msg, {
          position: 'center',
        })
      }
    })

    // 如果用户在离开页面时还有等待重试的收藏任务，就提示用户
    // 使用 window.onbeforeunload 事件
    // 但是这会导致 SelectWork 里的该事件出现问题，或者两个模块里都会出现问题，所以就不提示了
  }

  private async getWorkData(type: 'illusts' | 'novels', id: string) {
    return type === 'illusts'
      ? await API.getArtworkData(id)
      : await API.getNovelData(id)
  }

  /** 接收到需要排队的任务时增加计数 */
  private taskID = 0

  /**叫号的号码，当 add 方法的 slowly 参数为 true 时，需要等待叫号到它才能执行 */
  private nextTaskID = 1

  /**添加收藏。会返回操作完成时的状态码，200 表示成功，0 表示因为网络请求失败导致无法收藏，也可能返回其他状态码。
   *
   * 发生一些错误时会重试一定次数，并返回最终的状态码。调用方可以根据需要决定是否要对收藏失败的请求再次进行重试。
   *
   * 当添加收藏失败时，会在日志里输出错误信息。调用方可以根据需要决定是否补充其他提示方式，例如弹出消息框或显示 toast。
   *
   * @param id 作品 id
   *
   * @param type 作品类型，illusts 或 novels
   *
   * @param tags 可以直接传入这个作品的 tag 列表
   *
   * 如果未传入 tags，但收藏设置要求 tags，则此方法会发送请求获取作品数据
   *
   * @param needAddTag 控制是否添加 tag。缺省时使用 settings.widthTagBoolean
   *
   * @param restrict 指示这个收藏是否为非公开收藏。false 为公开收藏，true 为非公开收藏。缺省时使用 settings.restrictBoolean
   *
   * @param slowly 未指定或 false 时，立即执行这个收藏请求。设置为 true 则会获得一个号码并等待叫号到它再执行。这是为了减少 429 错误发生的概率。当需要大批量收藏作品时应该设置为 true。
   */
  public async add(
    id: string,
    type: 'illusts' | 'novels',
    tags?: string[],
    needAddTag?: boolean,
    restrict?: boolean,
    slowly?: boolean
  ) {
    const _needAddTag =
      needAddTag === undefined ? settings.widthTagBoolean : !!needAddTag
    if (_needAddTag) {
      // 需要添加 tags
      if (tags === undefined) {
        // 如果未传递 tags，则请求作品数据来获取 tags
        try {
          const data = await this.getWorkData(type, id)
          tags = Tools.extractTags(data)
        } catch (error) {
          // 请求失败的话使用空 tags。这不是致命问题
          tags = []
        }
      }
    } else {
      // 不需要添加 tags
      tags = []
    }

    const _restrict =
      restrict === undefined ? settings.restrictBoolean : !!restrict

    // 立即执行的情况
    if (!slowly) {
      const status = await this.sendRequest(id, type, tags, _restrict)
      return status
    } else {
      log.warning(
        lang.transl('_提示添加收藏时会慢速执行'),
        'tipSlowlyAddBookmark'
      )
    }

    // 需要排队的情况
    const NO = ++this.taskID
    await this.waitCallMe(NO)
    try {
      await Utils.sleep(settings.slowCrawlDealy)
      return await this.sendRequest(id, type, tags!, _restrict)
    } finally {
      // 请求或 token 刷新拒绝时也叫下一个号码，避免后续收藏一直等待。
      this.nextTaskID++
    }
  }

  private async waitCallMe(NO: number) {
    while (this.nextTaskID !== NO) {
      await Utils.sleep(300)
    }
    return NO
  }

  /**获取指定用户的指定分类下的所有收藏列表，不限制页数或个数，全部抓取 */
  public async getAllBookmarkList(
    userID: string,
    type: 'illusts' | 'novels',
    tags: string,
    offsetStart: number = 0,
    hide: boolean
  ): Promise<BookmarkResult[]> {
    const result: BookmarkResult[] = []
    let offset = offsetStart
    const onceOffset = 100

    while (true) {
      // 账户被警告时终止遍历，不再请求后续的收藏列表
      if (!canRequestInBatch('_添加收藏')) {
        break
      }

      const data = await API.getBookmarkData(userID, type, '', offset, hide)

      for (const workData of data.body.works) {
        result.push({
          id: workData.id,
          type:
            (workData as ArtworkCommonData).illustType === undefined
              ? 'novels'
              : 'illusts',
          tags: workData.tags,
          restrict: workData.bookmarkData?.private || false,
        })
      }
      log.log(result.length.toString(), 'resutlCountWhenCrawlingBookmark')

      offset += onceOffset
      if (data.body.works.length === 0) {
        break
      }

      await Utils.sleep(settings.slowCrawlDealy)
    }

    log.persistentRefresh('resutlCountWhenCrawlingBookmark')
    return result
  }

  public async addBookmarksInBatchs(
    list: BookmarkResult[],
    oldList: BookmarkResult[] = []
  ) {
    if (!canRequestInBatch('_添加收藏')) {
      return
    }

    // 反转要添加收藏的作品列表。这是因为它来自于导出的收藏列表，导出时的顺序是按照添加收藏时的倒序排列
    // 即后收藏的作品在数组前面，先收藏的作品在数组后面
    // 如果不反转，那么在添加收藏时，就会先收藏在“导出时是后收藏”的作品，这会导致添加收藏的顺序反了
    // 在网页上看新添加收藏的作品时，顺序也是反的
    list.reverse()

    let added = 0
    let skip = 0
    // 收藏失败的作品数量（例如断网、作品被删除）。完成时要如实告诉用户，不能只说「完毕」
    let failed = 0
    let tip = ''
    // 是否因为账户被警告而中止了遍历
    let aborted = false
    for (const data of list) {
      // 账户被警告时终止遍历，不再发出后续的请求
      if (!canRequestInBatch('_添加收藏')) {
        aborted = true
        break
      }
      // 如果这个作品已经被收藏过，就不会重复收藏它（这里没有检查 tag 列表）
      const find = oldList.find(
        (old) => old.id === data.id && old.type === data.type
      )
      if (!find) {
        // 决定添加收藏时使用的 tag 列表。如果有 bookmarkTags 就优先使用它，否则就使用作品本身的 tags
        let useTags = data.tags
        if (data.bookmarkTags && data.bookmarkTags.length > 0) {
          useTags = data.bookmarkTags
        }

        // 慢速收藏（添加等待时间）
        let status = 0
        try {
          status = await this.add(
            data.id,
            data.type!,
            useTags,
            undefined,
            undefined,
            true
          )
        } catch (error) {
          // add 一般不会抛异常（它把错误转成了返回值），这里兜底：
          // 不能让一个作品出错就中断整批收藏
          status = 0
        }
        if (status !== 200) {
          failed++
        }
      } else {
        skip++
      }
      added++
      tip = lang.transl('_收藏作品') + ` ${added}/${list.length}`
      if (skip > 0) {
        tip = tip + `, ${lang.transl('_跳过x个', skip.toString())}`
      }
      log.log(tip, 'bookmarkAddProgress')
    }

    // 因为账户被警告而中止时，不显示「完成」的提示
    if (aborted) {
      return
    }

    log.persistentRefresh('bookmarkAddProgress')
    this.showCompleteMessage(failed)
  }

  /** 请求本身失败（例如断网）时最多重试几次。
   *
   * 这类错误通常只持续几秒（切换网络、路由器重连、DNS 抖动），重试几次就能成功，
   * 调用方也就不会拿到失败。⚠️ 这里只做短重试：add 是串行阻塞的（slowly 模式还要先等号），
   * 长时间重试会把整条队列冻住。需要扛长时间断网时应该在调用方把作品重新排队（见 BookmarkAfterDL）。 */
  private readonly retryMaxForNetworkError = 3

  /** 请求本身失败后，每次重试前等待的时间（毫秒），按重试次数递增 */
  private readonly retryWaitForNetworkError = [2000, 5000, 10000]

  /** 添加收藏的请求。
   *
   * 400 时只刷新并重试一次，固定本次 token；刷新失败仍返回状态码以释放慢速队列。
   *
   * 请求本身失败（没有状态码，例如断网）时会等待后重试几次（见 retryMaxForNetworkError），如果重试失败会返回 0。 */
  private async sendRequest(
    id: string,
    type: 'illusts' | 'novels',
    tags: string[],
    hide: boolean,
    tokenRefreshed = false,
    requestToken = token.token,
    networkRetry = 0
  ): Promise<number> {
    try {
      await API.addBookmark(id, type, tags, hide, requestToken)
      return 200
    } catch (error: Error | any) {
      if (error.status) {
        const status = error.status
        const workLink = Tools.createWorkLink(
          id,
          '',
          type === 'novels' ? 'novel' : 'artwork'
        )
        if (status === 400 && !tokenRefreshed) {
          const refreshedToken = await token.reset().catch(() => '')
          if (refreshedToken) {
            await Utils.sleep(3000)
            return this.sendRequest(id, type, tags, hide, true, refreshedToken)
          }
        }
        switch (status) {
          // 注意：其他模块调用本模块来添加收藏时，由本模块来显示下面的错误消息
          // 所以其他模块通常不需要自行显示错误消息，否则就重复了
          // 不过下面没有使用 msgBox 来显示（因为会打扰用户），所以如果其他模块想使用 msgBox 来显示的话可以自行处理
          case 403:
            // 显示 403 错误的提示
            // 当一个账号被限制无法收藏时，依然可以正常删除收藏，所以“取消收藏本页面中的所有作品”的功能不受影响
            const msg = Tools.addBookmark403Error()
            log.error(workLink + ' ' + msg)
            this.toastDebounce(msg)
            return status
          case 404:
            log.error(`${id} 404 Not Found`)
            return status
          default:
            log.error(
              `${workLink} ${lang.transl('_添加收藏失败')}, ${lang.transl('_状态码')}: ${status}`
            )
            return status
        }
      }

      // 走到这里说明请求本身失败了（没有状态码），例如断网。等待一会再重试一次。
      if (networkRetry < this.retryMaxForNetworkError) {
        await Utils.sleep(this.retryWaitForNetworkError[networkRetry] ?? 10000)
        return this.sendRequest(
          id,
          type,
          tags,
          hide,
          tokenRefreshed,
          requestToken,
          networkRetry + 1
        )
      }

      // 重试次数用尽，仍然失败。返回 0 让调用方知道这个作品没有收藏成功（调用方需要如实提示用户）
      const link = Tools.createWorkLinkByIDData({ id, type })
      log.error(
        `${link} ${lang.transl('_添加收藏失败')}`,
        'bookmarkNetworkRetry' + id
      )
      return 0
    }
  }

  public showCompleteMessage(failed: number) {
    const completeMsg = '♥️' + lang.transl('_收藏作品完毕')
    if (failed > 0) {
      // 有失败时如实说明失败数量，并提示用户可以再次执行来重试
      const msg =
        completeMsg +
        ' ' +
        lang.transl('_有x个作品失败请再次执行重试', failed.toString())
      log.error(msg)
      toast.error(lang.transl('_收藏作品完毕但是有一些失败了'), {
        position: 'center',
      })
    } else {
      log.success(completeMsg)
      toast.success(completeMsg, {
        position: 'center',
      })
    }
  }

  private toastDebounce: (msg: string) => void = Utils.debounce(
    (msg: string) => {
      toast.error(msg)
      // 延迟时间不能太短，如果小于两次调用的间隔，就会导致每次都执行
    },
    500
  )
}

const bookmark = new Bookmark()
export { bookmark }
