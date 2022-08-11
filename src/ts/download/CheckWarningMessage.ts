import { API } from '../API'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { msgBox } from '../MsgBox'

/**当下载数量达到一定数值时，检查当前用户是否被 pixiv 警告 */
class CheckWarningMessage {
  constructor() {
    this.bindEvents()
  }

  /**已下载（成功保存到硬盘上）的文件数量
   *
   * 这个数字不会重置，除非当前标签页被关闭
   */
  private downloaded = 0
  /**每当保存数量增加了指定数量时，进行一次检查 */
  private readonly unitNumber = 100
  /**上次检查时的下载数量 */
  private lastCheckDownloaded = 0

  private bindEvents() {
    // 当有文件保存成功后，计算已下载文件的数量（不会计算跳过的文件）
    window.addEventListener(EVT.list.downloadSuccess, () => {
      this.addDownloaded()
    })
  }

  private async addDownloaded() {
    this.downloaded++
    if (this.downloaded >= this.lastCheckDownloaded + this.unitNumber) {
      this.lastCheckDownloaded = this.downloaded
      const result = await this.check()
      if (result) {
        msgBox.error(
          lang.transl('_过度访问警告警告') + '<br>' + lang.transl('_已暂停')
        )
        return EVT.fire('requestPauseDownload')
      }
    }
  }

  private async check(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const data = await API.getLatestMessage(3)
      if (data.error) {
        console.error(data.message)
        return resolve(false)
      }
      if (data.body.total === 0) {
        return resolve(false)
      }

      for (const msgData of data.body.message_threads) {
        if (
          msgData.is_official === true &&
          msgData.thread_name === 'pixiv事務局'
        ) {
          if (
            msgData.latest_content.includes('policies.pixiv.net') &&
            msgData.latest_content.includes('14')
          ) {
            // 如果找到了官方账号发送的警告消息，则判断时间
            const now = new Date().getTime()
            const msgTime = Number.parseInt(msgData.modified_at + '000')
            // 如果这是 1 小时内的消息，则视为有效的警告消息
            // 如果警告消息的时间过去比较久了，则不再显示提示消息，否则就会无限提示了
            // 在进行大量下载时，pixiv 的警告消息可能会延迟几十分钟发送
            if (now - msgTime < 60 * 60 * 1000) {
              return resolve(true)
            }
          }
        }
      }

      return resolve(false)
    })
  }
}

new CheckWarningMessage()
