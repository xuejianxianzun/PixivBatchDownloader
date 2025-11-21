import { lang } from '../Language'
import { log } from '../Log'
import { settings } from '../setting/Settings'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'
import { EVT } from '../EVT'

// 网络请求状态异常时输出日志
class LogErrorStatus {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    // 短时间内可能触发多次错误（例如获取作品数据时是 3 个并发请求）
    window.addEventListener(
      EVT.list.requestStatusError,
      (ev: CustomEventInit) => {
        // console.log(ev.detail.data)
        const { status, url } = ev.detail.data as {
          status: number
          url: string
        }

        /** 对特定 API 错误显示更友好的提示 */
        let isSpecialHandle = false

        // 判断是否是获取作品数据的 API（url 如下所示）
        // 如果是，则输出具体的日志
        // https://www.pixiv.net/ajax/illust/86583637
        // https://www.pixiv.net/ajax/novel/24482163
        const matchIllust = url.match(/ajax\/illust\/(\d+)/)
        if (matchIllust && matchIllust.length > 1) {
          this.logErrorWithWorkLink(status, matchIllust[1], 'artwork')
          isSpecialHandle = true
        }

        const matchNovel = url.match(/ajax\/novel\/(\d+)/)
        if (matchNovel && matchNovel.length > 1) {
          this.logErrorWithWorkLink(status, matchNovel[1], 'novel')
          isSpecialHandle = true
        }

        // 判断是否是添加收藏的请求
        // https://www.pixiv.net/ajax/novels/bookmarks/add
        if (url.includes('/bookmarks/add')) {
          log.error('_添加收藏失败')
          isSpecialHandle = true
        }

        // 判断是否是获取关注列表的请求
        // https://www.pixiv.net/ajax/user/103852206/following?offset=0&limit=24&rest=show&tag=&lang=zh
        if (url.includes('/following')) {
          log.error(lang.transl('_获取关注列表失败'))
          isSpecialHandle = true
        }

        // 如果不符合特殊处理的情况，则输出通用的提示
        if (!isSpecialHandle) {
          const link = `<a href="${url}" target="_blank">${url}</a>`
          const msg = lang.transl(
            '_网络错误状态码为x网址为y',
            status.toString(),
            link
          )
          log.error(msg)
        }

        // 429 错误时，显示额外的提示
        if (status === 429) {
          log.error(lang.transl('_下载器会等待几分钟然后重试'))
          this.tipSlowCrawl()
        }

        this.listenerList.forEach((cb) => {
          cb(status, url)
        })
      }
    )
  }

  private tipSlowCrawl = Utils.debounce(() => {
    if (!settings.slowCrawl) {
      log.log(lang.transl('_提示启用减慢抓取速度功能'))
    }
  }, 500)

  private listenerList: Function[] = []
  /** 当发生错误时执行回调。回调函数会接收到两个参数：status 和 url */
  // 这主要是为了处理调用 API 的发起方无法获取 429 状态的问题。
  // 因为 API 通常不会返回 429 错误码，所以调用方如果想在发生 429 错误时进行不同于该模块的针对性处理，
  // 可以注册回调函数，然后自行处理
  public listen(cb: Function) {
    this.listenerList.push(cb)
  }

  private logErrorWithWorkLink(
    status: number,
    id: string,
    type: 'artwork' | 'novel' = 'artwork'
  ) {
    const workLink = Tools.createWorkLink(id, '', type)
    switch (status) {
      case 0:
        log.error(workLink + ' ' + lang.transl('_状态码0的提示'))
        break

      case 400:
        log.error(workLink + ' ' + lang.transl('_状态码400的提示'))
        break

      case 401:
        log.error(workLink + ' ' + lang.transl('_状态码401的提示'))
        break

      case 403:
        log.error(workLink + ' ' + lang.transl('_状态码403的提示'))
        break

      case 404:
        log.error(workLink + ' ' + lang.transl('_状态码404的提示'))
        break

      case 429:
        log.error(workLink + ' ' + lang.transl('_状态码429的提示'))
        break

      case 500:
        log.error(workLink + ' ' + lang.transl('_状态码500的提示'))
        break

      case 503:
        log.error(workLink + ' ' + lang.transl('_状态码503的提示'))
        break

      default:
        const msg = lang.transl(
          '_网络错误状态码为x网址为y',
          status.toString(),
          workLink
        )
        log.error(msg)
        break
    }
  }
}

const logErrorStatus = new LogErrorStatus()
export { logErrorStatus }
