import { API } from './API'
import { Config } from './Config'
import { EVT } from './EVT'
import { lang } from './Lang'
import { log } from './Log'
import { setTimeoutWorker } from './SetTimeoutWorker'
import { settings } from './setting/Settings'
import { toast } from './Toast'
import { token } from './Token'
import { Tools } from './Tools'

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
   * 可选参数 tags：可以直接传入这个作品的 tag 列表
   *
   * 如果未传入 tags，但收藏设置要求 tags，则此方法会发送请求获取作品数据
   *
   * 可选参数 needAddTag：控制是否添加 tag。缺省时使用 settings.widthTagBoolean
   *
   * 可选参数 restrict：指示这个收藏是否为非公开收藏。false 为公开收藏，true 为非公开收藏。缺省时使用 settings.restrictBoolean
   *
   * 可选参数 slowly：未指定或 false 时，立即执行这个收藏请求。设置为 true 则会获得一个号码并等待叫号到它再执行。这是为了减少 429 错误发生的概率。当需要大批量收藏作品时应该设置为 true。
   */
  public async add(
    id: string,
    type: 'illusts' | 'novels',
    tags?: string[],
    needAddTag?: boolean,
    restrict?: boolean,
    slowly?: boolean
  ) {
    return new Promise<number>(async (resolve, reject) => {
      const _needAddTag =
        needAddTag === undefined ? settings.widthTagBoolean : !!needAddTag
      if (_needAddTag) {
        // 需要添加 tags
        if (tags === undefined) {
          // 如果未传递 tags，则请求作品数据来获取 tags
          const data = await this.getWorkData(type, id)
          tags = Tools.extractTags(data)
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
        return resolve(status)
      }

      // 需要排队的情况
      const NO = ++this.taskID
      await this.waitCallMe(NO)
      setTimeoutWorker.set(async () => {
        const status = await this.sendRequest(id, type, tags!, _restrict)
        this.nextTaskID++
        return resolve(status)
      }, Config.slowCrawlDealy)
    })
  }

  private async waitCallMe(NO: number) {
    return new Promise<number>(async (resolve) => {
      if (this.nextTaskID === NO) {
        return resolve(NO)
      } else {
        setTimeoutWorker.set(() => {
          return resolve(this.waitCallMe(NO))
        }, 300)
      }
    })
  }

  private async sendRequest(
    id: string,
    type: 'illusts' | 'novels',
    tags: string[],
    hide: boolean
  ) {
    return new Promise<number>(async (resolve) => {
      API.addBookmark(id, type, tags, hide, token.token).then(async (res) => {
        switch (res.status) {
          case 400:
            await token.reset()
            return resolve(this.sendRequest(id, type, tags, hide))
          case 429:
          case 500:
            toast.error(lang.transl('_添加收藏失败'), {
              position: 'center',
            })

            log.error(
              `${Tools.createWorkLink(id, type === 'illusts')} ${lang.transl(
                '_添加收藏失败'
              )}. ${lang.transl('_错误代码')}${res.status}. ${lang.transl(
                '_下载器会在几分钟后重试'
              )}`
            )

            window.setTimeout(() => {
              return resolve(this.sendRequest(id, type, tags, hide))
            }, Config.retryTime)
            break
          default:
            return resolve(res.status)
        }
      })
    })
  }
}

const bookmark = new Bookmark()
export { bookmark }
