import { msgBox } from './MsgBox'
import { lang } from './Lang'
import { settings, setSetting } from './setting/Settings'

// 显示帮助信息
// 在第一次使用某些功能的时候显示一次性的帮助信息
class Help {
  public showDownloadTip() {
    if (settings.showDownloadTip) {
      msgBox.show(lang.transl('_首次下载显示的提示'))
      setSetting('showDownloadTip', false)
    }
  }
}

const help = new Help()
export { help }
