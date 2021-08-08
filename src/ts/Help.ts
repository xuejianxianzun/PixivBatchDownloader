import { msgBox } from './MsgBox'
import { lang } from './Lang'

// 显示帮助信息
// 在第一次使用某些功能的时候显示一次性的帮助信息
class Help {
  public showDownloadTip() {
    const flag = {
      name: 'PBDDownloadTip',
      value: '1',
    }
    const getValue = localStorage.getItem(flag.name)
    if (getValue === null) {
      msgBox.show(lang.transl('_下载说明提示2'))
      localStorage.setItem(flag.name, flag.value)
    }
  }
}

const help = new Help()
export { help }
