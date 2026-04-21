import browser from 'webextension-polyfill'
import { Msg } from '../serviceWorker/CheckDownloadCount'
import { log } from '../Log'
import { lang } from '../Language'

// 这是一个前台脚本。当接收到 SW 发送的特定消息时，显示提示
class DownloadCountWarning {
  constructor() {
    browser.runtime.onMessage.addListener((msg: any) => {
      // console.log(msg, msg)
      const _msg = msg as Msg
      if (_msg.message === 'highDownloadCountWarning') {
        this.tip(_msg.data.count)
      }
    })
  }

  private tip(count: number) {
    log.warning(
      lang.transl('_提示下载记录数量太多', count.toString()),
      'downloadCountWarning'
    )
  }
}

new DownloadCountWarning()
