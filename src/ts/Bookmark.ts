import { API } from './API'
import { Config } from './Config'
import { EVT } from './EVT'
import { lang } from './Lang'
import { log } from './Log'
import { msgBox } from './MsgBox'
import { settings } from './setting/Settings'
import { toast } from './Toast'
import { token } from './Token'
import { Tools } from './Tools'
import { Utils } from './utils/Utils'

type AddBMKArgs = [
  string,
  'illusts' | 'novels',
  string[] | undefined,
  Boolean | undefined,
  Boolean | undefined,
  Boolean | undefined
]

// 对 API.addBookmark 进行封装
class Bookmark {
  constructor() {
    window.setTimeout(() => {
      this.retry()
    }, this.retryInterval)

    window.addEventListener(EVT.list.downloadComplete, () => {
      if (settings.bmkAfterDL && this.retryList.length > 0) {
        const msg = `${lang.transl('_有一些作品未能成功收藏')} ${lang.transl(
          '_下载器会在几分钟后重试'
        )} `
        log.error(msg)
      }
    })

    // 如果用户在离开页面时还有等待重试的收藏任务，就提示用户
    // 使用 window.onbeforeunload 事件
    // 但是这会导致 SelectWork 里的该事件出现问题，或者两个模块里都会出现问题，所以就不提示了
  }

  // 保存重试收藏的数据的队列
  // 现在没有做去重处理，因为一般不会有重复的，而且即使有重复的也没有什么影响
  private retryList: AddBMKArgs[] = []

  // 当前是否可以重试收藏
  // 当出现 429 错误时，设置为不可重试
  private canRetry = true

  // 每隔指定时间，尝试重试收藏
  private readonly retryInterval = 1000

  // 429 错误过去一段时间后，把重试标记设置为可以重试
  private delayRetry = Utils.debounce(() => {
    this.canRetry = true
  }, Config.retryTime)

  // 不间断运行的函数，每次运行会检查是否可以重试，如果可以重试，则取出队列中的一条数据进行重试
  private retry() {
    if (this.canRetry !== false) {
      const args = this.retryList.shift()
      if (args) {
        log.warning(
          `${lang.transl('_重试收藏')} ${Tools.createWorkLink(
            args[0],
            args[1] === 'illusts'
          )}`
        )

        this.add(...args)
      }
    }

    // 不管是否能够重试，都会继续下一次运行
    window.setTimeout(() => {
      this.retry()
    }, this.retryInterval)
  }

  private async getWorkData(type: 'illusts' | 'novels', id: string) {
    return type === 'illusts'
      ? await API.getArtworkData(id)
      : await API.getNovelData(id)
  }

  /**添加收藏
   *
   * 可选参数 tags：可以直接传入这个作品的 tag 列表
   *
   * 如果未传入 tags，但收藏设置要求 tags，则此方法会发送请求获取作品数据
   *
   * 可选参数 needAddTag：控制是否添加 tag。缺省时使用 settings.widthTagBoolean
   *
   * 可选参数 restrict：指示这个收藏是否为非公开收藏。缺省时使用 settings.restrictBoolean
   *
   */
  public async add(
    id: string,
    type: 'illusts' | 'novels',
    tags?: string[],
    needAddTag?: Boolean,
    restrict?: Boolean,
    retry?: Boolean
  ) {
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

    const request = API.addBookmark(id, type, tags, _restrict, token.token)

    let status = 0
    await request.then((res) => {
      status = res.status
    })

    // 如果状态码为 400，则表示当前 token 无效，需要重新获取 token，然后重新添加收藏
    if (status === 400) {
      await token.reset()
      return await API.addBookmark(id, type, tags, _restrict, token.token)
    }

    if (status === 429) {
      toast.error(lang.transl('_添加收藏失败'), {
        position: 'topCenter',
      })

      log.error(
        `${Tools.createWorkLink(id, type === 'illusts')} ${lang.transl(
          '_添加收藏失败'
        )}. ${lang.transl('_错误代码')}${status}. ${lang.transl(
          '_下载器会在几分钟后重试'
        )}`
      )

      // 将参数添加到重试队列，并且把 retry 标记设为 true
      this.retryList.push([id, type, tags, needAddTag, restrict, true])

      // 在一定时间后重试收藏
      this.canRetry = false
      this.delayRetry()
    }

    // 其他状态码视为收藏成功

    // 显示重试收藏的进度信息
    if (retry) {
      log.success(
        `${Tools.createWorkLink(id, type === 'illusts')} ${lang.transl(
          '_重试收藏成功'
        )} ${lang.transl('_剩余xx个', this.retryList.length.toString())}`
      )

      if (this.retryList.length === 0) {
        const msg = `${lang.transl('_重试收藏')} ${lang.transl('_完成')}.`
        log.success(msg)
        toast.success(msg, {
          position: 'center',
        })
      }
    }

    // 返回状态码
    return status
  }
}

const bookmark = new Bookmark()
export { bookmark }
