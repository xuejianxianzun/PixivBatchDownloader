import { msgBox } from './MsgBox'
import { lang } from './Lang'

// 显示帮助信息
// 在第一次使用某些功能的时候显示一次性的帮助信息
class Help {
  public showDownloadTip() {
    const name = 'PBDDownloadTip'

    chrome.storage.sync.get(name, function (result) {
      if (!result[name]) {
        msgBox.show(lang.transl('_下载说明提示2'))
        chrome.storage.sync.set({
          [name]: true
        })
      }
    })
  }
}

const help = new Help()
export { help }
