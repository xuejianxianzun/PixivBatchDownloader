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

  /**添加收藏
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
    await Utils.sleep(settings.slowCrawlDealy)
    const status = await this.sendRequest(id, type, tags!, _restrict)
    this.nextTaskID++
    return status
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
    // 反转要添加收藏的作品列表。这是因为它来自于导出的收藏列表，导出时的顺序是按照添加收藏时的倒序排列
    // 即后收藏的作品在数组前面，先收藏的作品在数组后面
    // 如果不反转，那么在添加收藏时，就会先收藏在“导出时是后收藏”的作品，这会导致添加收藏的顺序反了
    // 在网页上看新添加收藏的作品时，顺序也是反的
    list.reverse()

    let added = 0
    let skip = 0
    let tip = ''
    for (const data of list) {
      // 如果这个作品已经被收藏过，就不会重复收藏它（这里没有检查 tag 列表）
      const find = oldList.find(
        (old) => old.id === data.id && old.type === data.type
      )
      if (!find) {
        // 慢速收藏（添加等待时间）
        await this.add(
          data.id,
          data.type!,
          data.tags,
          undefined,
          undefined,
          true
        )
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

    log.persistentRefresh('bookmarkAddProgress')
    const msg = '♥️' + lang.transl('_收藏作品完毕')
    log.success(msg)
    toast.success(msg, {
      position: 'center',
    })
  }

  private async sendRequest(
    id: string,
    type: 'illusts' | 'novels',
    tags: string[],
    hide: boolean
  ): Promise<number> {
    try {
      await API.addBookmark(id, type, tags, hide, token.token)
      return 200
    } catch (error: Error | any) {
      if (error.status) {
        const status = error.status
        const workLink = Tools.createWorkLink(
          id,
          '',
          type === 'novels' ? 'novel' : 'artwork'
        )
        switch (status) {
          // 注意：其他模块调用本模块来添加收藏时，由本模块来显示下面的错误消息
          // 所以其他模块通常不需要自行显示错误消息，否则就重复了
          // 不过下面没有使用 msgBox 来显示（因为会打扰用户），所以如果其他模块想使用 msgBox 来显示的话可以自行处理
          // 当发生 400 错误时会无限重试，因为重试不成功的话就无法添加收藏
          case 400:
            await token.reset()
            await Utils.sleep(3000)
            return this.sendRequest(id, type, tags, hide)
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
      return 0
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
